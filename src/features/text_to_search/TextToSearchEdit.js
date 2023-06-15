import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {addOrUpdateTextToSearch, closeEditForm} from "./TextToSearchSlice";
import {BsFilePdf} from "react-icons/bs";


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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const data = {
            "matchWordCsv": matchWords,
            "searchPart": searchPart,
            "searchType": searchType
        }
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
                    <div className="modal-header px-5 pt-4 bg-light"><h4 className="mb-0">{edit ? "Edit Text to Search" : "New Text to Search"}</h4></div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">
                            <div className="col-2 offset-10">
                                <a href="resources/super-search-syntax.pdf" id="dlsuperquery" target="_blank"
                                   title="Download the SimSage advanced query syntax guide"
                                   className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                    <BsFilePdf size={25}/>
                                    <span className="me-2 mt-2"></span>Advanced Query<br/>Syntax Guide
                                </a>
                            </div>
                            <div className="row mb-3">
                                <div className="control-row col-8">
                                    <span className="label-2 small">SimSage advanced query language part</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                autoComplete="false"
                                                   placeholder="SimSage advanced query language expression (e.g. (word(test))  )"
                                                   title="SimSage advanced query language expression (e.g. (word(test))  )"
                                                value= {searchPart}
                                                onChange={(e) => setSearchPart(e.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                                <div className="control-row col-4">
                                    <span className="label-2 small">Type</span>
                                    <span className="text">
                                        <form>
                                            <input type="text" className="form-control"
                                                autoComplete="false"
                                                placeholder="e.g. and"
                                                value= {searchType}
                                                onChange={(e) => setSearchType(e.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="control-row col-12">
                                    <span className="label-2 small">Match Words <span className="small text-black-50 fst-italic fw-light">(Separate by comma) (csv) </span></span>
                                    <span className="text">
                                        <form>
                                            <textarea type="text" className="form-control"
                                                    autoComplete="false"
                                                    placeholder="e.g. web documents, html file, web file, etc..."
                                                    value={matchWords}
                                                    rows={10}
                                                    onChange={(event) => setMatchWords(event.target.value)}
                                            />
                                        </form>
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
