import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeSynonymForm, updateSynonyms} from "./synonymSlice";



export function SynonymEdit(props){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_synonym_form = useSelector( (state) => state.synonymReducer.show_synonym_form)
    const synonym = useSelector( (state) => state.synonymReducer.edit);

    //Synonym details
    const [synonymList, setSynonymList] = useState('');




    // Grab synonym details if editing
    let selectedSynonym = {}
    useEffect(()=> {
    if ( synonym ) {
        setSynonymList(synonym.words);
    }
    }, [show_synonym_form])

    function resetData () {
        setSynonymList('');
    }

    function handleClose(e){
        dispatch(closeSynonymForm());
        resetData();
    }



    const handleSave = () => {
        const session_id = session.id;
        console.log(`Editing...`, synonym)
        const data = {
            "id": synonym ? synonym.id : "",
            "words": synonymList
        }
        console.log(`Saving...`, data);
        dispatch(updateSynonyms({session_id, organisation_id, knowledge_base_id, data}));
        dispatch(closeSynonymForm());

    }


    if (show_synonym_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header">{synonym ? "Edit Synonym" : "Add New Synonym"}</div>
                    <div className="modal-body">
                        <div className="tab-content">


                            <div className="control-row">
                                <span className="label-2">Related Words</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Links"
                                                       value={synonymList}
                                                       onChange={(event) => setSynonymList(event.target.value)}
                                                />
                                            </form>
                                        </span>
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
