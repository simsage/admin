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
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Test Text-To-Search Query</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-aut">

                            <div className="control-row">
                                <span className="label-2 small">Search Part</span>
                                <span className="text">
                                            <div className="form-control p-0 d-flex overflow-hidden">
                                                <input type="text" className="border-0 w-100" style={{padding : "0.375rem 0.75rem"}}
                                                       autoComplete="false"
                                                       placeholder="Type query..."
                                                       value= {searchPart}
                                                       onChange={(e) => setSearchPart(e.target.value)}
                                                       onKeyDown={(e) => {if(e.key === 'Enter') handleTest(e)}}
                                                />
                                                { !showAnswer ?
                                                        <button className="btn px-4 btn-primary btn-sm btn-block" onClick={(e) => handleTest(e)}>Test</button>
                                                    :
                                                    <button className="btn btn-secondary btn-sm btn-block px-4" onClick={(e) => handleReset(e)}>Reset</button>
                                                }
                                            </div>
                                        </span>
                            </div>
                            <div className="control-row">
                                    
                                    <div className="mt-4 mb-3 d-flex justify-content-center">
                                        <h4 className="mb-0">
                                        { !showAnswer ?
                                        <span></span>
                                        :
                                        <span>{test_response}</span>
                                        }
                                        </h4>
                                    </div>
                            
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleClose(e)}>Done</button>
                        {/* <button className="btn btn-primary btn-block px-4" onClick={(e) => handleReset(e)}>Reset</button> */}
                    </div>

                </div>
            </div>
        </div>

    )
};

export default TextToSearchTest;