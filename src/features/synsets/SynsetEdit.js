import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {addOrUpdate, closeSynSetForm} from "./synsetSlice";
// import {closeSynonymForm, loadSynonyms, updateSynonyms} from "./synonymSlice";



export default function SynsetEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_synset_form = useSelector( (state) => state.synsetReducer.show_synset_form)
    const synset = useSelector((state) => state.synsetReducer.selected_synset)


    //Synonym details
    const [word, setWord] = useState('');
    const [wordCloud, setWordCloud] = useState([]);
    const [newWordCloud, setNewWordCloud] = useState('');

    // Grab synonym details if editing
    useEffect(()=> {
        if ( synset ) {
            setWord(synset.word);
            setWordCloud(synset.wordCloudCsvList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_synset_form])

    function resetData () {
        setWord('');
        setWordCloud([]);
        setNewWordCloud('');
    }

    function handleClose(e){
        dispatch(closeSynSetForm())
        resetData();
    }



    const handleSave = () => {

        const data = {
            lemma: word,
            word: word,
            wordCloudCsvList: wordCloud
        }
        dispatch(addOrUpdate({organisation_id: organisation_id, kb_id: knowledge_base_id, session_id: session_id, data}));
        dispatch(closeSynSetForm());
    }

    const updateWordCloud = index => e => {
      let newArr = [...wordCloud];
      newArr[index] = e.target.value;
      setWordCloud(newArr)
    };

    const addNewWordCloud = e => {
        if(e.key === 'Enter'){
            e.preventDefault()
            let newArr = [...(wordCloud || [])];
            setNewWordCloud(e.target.value)
            newArr.push(newWordCloud)
            setWordCloud(newArr)
            setNewWordCloud('')
        }
    }

    const addNewWordCloudBtn = () => {
        let newArr = [...(wordCloud || [])];
        newArr.push(newWordCloud)
        setWordCloud(newArr);
        setNewWordCloud('')
    }

    const removeNewWordCloudBtn= (wc, index) => {
        let newArr = [...wordCloud];
        newArr.splice(index,1)
        setWordCloud(newArr);
    }

    if (show_synset_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{synset ? "Edit SynSet" : "New SynSet"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>

                            <div className="row mb-4">
                                <div className="control-row col-6">
                                    <span className="label-2">SynSet</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                autoComplete="false"
                                                placeholder="e.g. Law..."
                                                value= {word}
                                                onChange={(e) => setWord(e.target.value)}
                                                onKeyDown={(e) => {if(e.key === 'Enter') e.preventDefault()}}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>



                            <div className="row mb-3">
                                <div className="d-flex justify-content-between small">
                                    <label className="label-2">Word Cloud <span className="small text-black-50 fst-italic fw-light">(Separate by comma) </span></label>
                                    <span className="small text-black-50 fst-italic fw-light ms-2">(Type &amp; press enter to add another)</span>
                                </div>
                                {
                                    wordCloud && wordCloud.map( (cloud, i) => {
                                        if(cloud === '')
                                            return (<div />)
                                        return (
                                        <div className="control-row col-12 mb-2" key={i}>
                                            <span className="text">
                                                    <div className="form-control d-flex p-0 overflow-hidden align-items-start">
                                                        <textarea
                                                            type="text" className="border-0 w-100 mb-0 me-2 d-block" style={{padding: "0.375rem 0.75rem"}}
                                                                autoComplete="false"
                                                                rows="3"
                                                                placeholder="e.g. Family, Divorce, Custody..."
                                                                value={cloud}
                                                                onChange={updateWordCloud(i)}
                                                        />
                                                        <bubtton className="btn pointer-cursor mb-0 px-3 py-1" title="Remove Word Cloud" onClick={() => removeNewWordCloudBtn(cloud, i)}>&times;</bubtton>
                                                    </div>
                                            </span>
                                            
                                        </div>
                                        )
                                    })
                                }
                                <div className="control-row col-12 mb-3">
                                    <span className="text d-flex">
                                        <form className="w-100 me-2">
                                            <textarea type="text" className="form-control"
                                                autoComplete="false"
                                                rows="3"
                                                placeholder="e.g. Family, Divorce, Custody..."
                                                value={newWordCloud}
                                                onChange={(e) => {setNewWordCloud(e.target.value)} }
                                                onKeyDown={(e) => addNewWordCloud(e)}
                                            />
                                        </form>
                                        <div>
                                            <button className="btn-secondary btn pointer-cursor px-3" title="Add another Word Cloud" onClick={(e) => addNewWordCloudBtn(e, newWordCloud)}>+</button>
                                        </div>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
