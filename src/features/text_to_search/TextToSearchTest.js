import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeTestForm, testTextToSearch} from "./TextToSearchSlice";



const TextToSearchTest = () => {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledgeBase_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    const [showAnswer, setShowAnswer] = useState(false);
    const show_test_form = useSelector((state) => state.textToSearchReducer.show_test_form)
    const test_response = useSelector((state) => state.textToSearchReducer.test_response)
    const [searchPart, setSearchPart] = useState('')
    const [filter, setFilter] = useState('');

    const handleClose = () => {
        dispatch(closeTestForm());
        setShowAnswer(false);
        setSearchPart('');
    }

    const handleTest = (e) => {
        e.preventDefault()
        if( searchPart.length <= 0) {return;}
        const session_id = session.id
        const data = {
            "filter": filter,
            "kbId": selected_knowledgeBase_id,
            "organisationId": selected_organisation_id,
            "text": searchPart
        }
        dispatch(testTextToSearch({session_id: session_id, data: data}))
        setShowAnswer(true);
    }

    const handleReset = () => {
        setShowAnswer(false);
        setSearchPart('');
    }

    if (show_test_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header fw-bold">Try Text-To-Search Query </div>
                    <div className="modal-body">
                        <div className="tab-content">

                            <div className="control-row">
                                <span className="label-2">Search Part</span>
                                <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="Search Part"
                                                       value= {searchPart}
                                                       onChange={(e) => setSearchPart(e.target.value)}
                                                       onKeyDown={(e) => {if(e.key === 'Enter') handleTest(e)}}
                                                />
                                            </form>
                                        </span>
                            </div>
                            <div className="control-row">

                                { !showAnswer ?
                                    <div className="m-4 d-flex  justify-content-center">
                                        <button className="btn btn-primary btn-block" onClick={(e) => handleTest(e)}>Test</button>
                                    </div>
                                    :
                                    <div className="m-4 d-flex h4 justify-content-center">
                                        {test_response}
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block" onClick={(e) => handleReset(e)}>Reset</button>
                    </div>

                </div>
            </div>
        </div>

    )
};

export default TextToSearchTest;