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
                    <div className="modal-header">{synset ? "Edit SynSet" : "Add New SynSet"}</div>
                    <div className="modal-body">
                        <div className="tab-content">


                            <div className="control-row">
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
                            {
                                wordCloud && wordCloud.map( (cloud, i) => {
                                    if(cloud === ''){return;}
                                    return (
                                    <div className="control-row" key={i}>
                                        <span className="label-2">Word Cloud</span>
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
                                        <button className="btn-danger btn-block" onClick={() => removeNewWordCloudBtn(cloud, i)}>-</button>
                                    </div>
                                    )
                                })
                            }
                            <div className="control-row">
                                <span className="label-2">New word cloud</span>
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
                                <button className="btn-primary btn-block" onClick={(e) => addNewWordCloudBtn(e, newWordCloud)}>+</button>
                            </div>
                        </div>
                    </div>


                    <div className="modal-footer">
                        <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
