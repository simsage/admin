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
    const synset = useSelector((state) => state.synsetReducer.edit)


    //Synonym details
    const [word, setWord] = useState('');
    const [lemma, setLemma] = useState('');
    const [wordCloud, setWordCloud] = useState([]);
    const [newWordCloud, setNewWordCloud] = useState('');

    // Grab synonym details if editing
    useEffect(()=> {
        if ( synset ) {
            console.log('editing', synset)
            setWord(synset.word);
            setLemma(synset.lemma);
            setWordCloud(synset.wordCloudCsvList);
            console.log('here', wordCloud)
        }
    }, [show_synset_form])

    function resetData () {
        setWord('');
        setLemma('');
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
            wordCloudCsvList:
            wordCloud
        }
        console.log('saving...', data);
        dispatch(addOrUpdate({organisation_id: organisation_id, kb_id: knowledge_base_id, session_id: session_id, data}));
        dispatch(closeSynSetForm());
    }

    const updateWordCloud = index => e => {
      let newArr = [...wordCloud];
      newArr[index] = e.target.value;
      console.log('wordcloud', newArr);
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

                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <span className="label-2">SynSet</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                autoComplete="false"
                                                placeholder="e.g. Law..."
                                                value= {word}
                                                onChange={(e) => setWord(e.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="label-2 small">Word Cloud <span className="small text-black-50 fst-italic fw-light">(Separate by comma) </span></label>
                                {
                                    wordCloud && wordCloud.map( (cloud, i) => {
                                        if(cloud === ''){return;}
                                        return (
                                        <div className="control-row" key={i}>
                                            <span className="text">
                                                <form>
                                                    <textarea type="text" className="form-control"
                                                            autoComplete="false"
                                                            placeholder="e.g. Family, Divorce, Custody..."
                                                            value={cloud}
                                                            onChange={updateWordCloud(i)}
                                                    />
                                                </form>
                                            </span>
                                            <p className="text-danger pointer-cursor" onClick={() => removeNewWordCloudBtn(cloud, i)}>Remove</p>
                                        </div>
                                        )
                                    })
                                }
                                <div className="control-row">
                                    <span className="text">
                                                <form>
                                                    <textarea type="text" className="form-control"
                                                        autoComplete="false"
                                                        placeholder="e.g. Family, Divorce, Custody..."
                                                        value={newWordCloud}
                                                        onChange={(e) => {setNewWordCloud(e.target.value)} }
                                                        onKeyDown={(e) => addNewWordCloud(e)}
                                                    />
                                                </form>
                                            </span>
                                    <p className="text-primary pointer-cursor" onClick={(e) => addNewWordCloudBtn(e, newWordCloud)}>+ Word Cloud</p>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="modal-footer px-5 pb-4">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
