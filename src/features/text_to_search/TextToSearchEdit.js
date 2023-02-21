import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {addOrUpdateTextToSearch, closeEditForm} from "./TextToSearchSlice";


export function TextToSearchEdit(props){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const show_text_to_search_form = useSelector( (state) => state.textToSearchReducer.show_text_to_search_form)
    const edit = useSelector( (state) => state.textToSearchReducer.edit);

    //Synonym details

    const [searchPart, setSearchPart] = useState('');
    const [searchType, setSearchType] = useState('');
    const [matchWords, setMatchWords] = useState('');

    // Grab synonym details if editing
    useEffect(()=> {
        if ( edit ) {
            setSearchPart(edit.searchPart);
            setSearchType(edit.type);
            setMatchWords(edit.matchWords);
        }
    }, [show_text_to_search_form])

    function resetData () {
        setSearchPart('');
        setSearchType('');
        setMatchWords('');
    }

    function handleClose(e){
        dispatch(closeEditForm());
        resetData();
    }



    function handleSave(e) {
        e.preventDefault();
        const session_id = session.id;
        console.log(`Editing...`, edit)
        const data = {
            "matchWordCsv": matchWords,
            "searchPart": searchPart,
            "searchType": searchType
        }
        console.log(`Saving...`, data);
        dispatch(addOrUpdateTextToSearch({session_id:session_id, organisation_id: organisation_id, kb_id: knowledge_base_id, data}));
        dispatch(closeEditForm());
        resetData();
    }


    if (show_text_to_search_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header fw-bold">{edit ? "Edit" : "Add New"}</div>
                    <div className="modal-body">
                        <div className="tab-content">

                            <div className="control-row">
                                <span className="label-2">Search Part</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="e.g. Law..."
                                                       value= {searchPart}
                                                       onChange={(e) => setSearchPart(e.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2">Type</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="e.g. Law..."
                                                       value= {searchType}
                                                       onChange={(e) => setSearchType(e.target.value)}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">
                                <span className="label-2 py-4">Match Words (csv)</span>
                                <span className="text">
                                            <form>
                                                <textarea type="text" className="form-control"
                                                          autoComplete="false"
                                                          placeholder="words"
                                                          value={matchWords}
                                                          rows={10}
                                                          onChange={(event) => setMatchWords(event.target.value)}
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
