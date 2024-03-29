import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeSynonymForm, updateSynonyms} from "./synonymSlice";



export function SynonymEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_synonym_form = useSelector( (state) => state.synonymReducer.show_synonym_form)
    const synonym = useSelector( (state) => state.synonymReducer.edit);

    //Synonym details
    const [synonymList, setSynonymList] = useState('');
    const [error,setError] = useState('');





    // Grab synonym details if editing
    useEffect(()=> {
        if ( synonym ) {
            setSynonymList(synonym.words);
        }
        else {
            resetData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_synonym_form])

    function resetData () {
        setSynonymList('');
        setError('')
    }

    function handleClose(){
        dispatch(closeSynonymForm());
        resetData();
    }


    useEffect(()=>{
        if(synonymList.length===0){
            setError("Synonym list is empty")
        }else {
            setError("")
        }
    },[synonymList])

    function handleSave(e) {

        e.preventDefault();
        if(synonymList.length > 0) {
            const session_id = session.id;
            const data = {
                "id": synonym ? synonym.id : "",
                "words": synonymList
            }
            dispatch(updateSynonyms({session_id, organisation_id, knowledge_base_id, data}));
        }else {
            setError("An input is required");
        }
    }


    if (show_synonym_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{synonym ? "Edit Synonym" : "New Synonym"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">

                            <div className="row mb-3">
                                <div className="control-row col-12">
                                    <label className="label-2 small required">Synonyms <span className="small text-black-50 fst-italic fw-light">(Separate by comma) </span>
                                    </label>
                                    <span className="text">
                                        <form>
                                            <textarea className="form-control"
                                                    autoComplete="false"
                                                    placeholder="e.g. Data Security Standard, DSS..."
                                                    value={synonymList}
                                                        rows={10}
                                                    onChange={(event) => setSynonymList(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                    {error && error.length > 0 &&
                                        <span className="text-danger fst-italic small">{error}</span>}
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
