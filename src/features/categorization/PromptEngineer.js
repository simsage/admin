import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {
    closePromptEngineeringForm,
    testPrompt,
} from "./categorizationSlice";


export function PromptEngineer(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const {show_prompt_engineering_form, form_prompt, llm_response} = useSelector( (state) => state.categorizationReducer)

    //Categorization details
    const [prompt, setPrompt] = useState('');
    const [text, setText] = useState('');
    const [numTokens, setNumTokens] = useState('1000');
    const [error,setError] = useState('');

    // Grab categorization details if editing
    useEffect(()=> {
        if (form_prompt && form_prompt.length > 0) {
            setPrompt(form_prompt);
            setError('');
            setText('');
            setNumTokens('1000');
        } else {
            resetData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_prompt_engineering_form])

    function resetData () {
        setError('');
        setPrompt('');
        setText('');
        setNumTokens('1000');
    }

    function handleClose(){
        dispatch(closePromptEngineeringForm());
        resetData();
    }

    function handleTest(e) {
        e.preventDefault();
        setError('')
        if (prompt.trim().length === 0 || prompt.trim().length < 20) { setError("a prompt of at least 20 characters is required"); return }
        if (text.trim().length === 0 || text.trim().length < 100) { setError("a text of at least 100 characters is required"); return }
        const nt = parseInt(numTokens.trim());
        if (isNaN(numTokens.trim()) || nt < 100 || nt > 32000) { setError("number of tokens must be between 100 and 32,000"); return }

        const session_id = session.id;
        const data = {
            "organisationId": organisation_id,
            "kbId": knowledge_base_id,
            "prompt": prompt,
            "text": text,
            "numTokens": nt
        }
        dispatch(testPrompt({session_id, data}));
    }


    if (show_prompt_engineering_form !== true)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Prompt Engineer</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content px-5 py-4 overflow-auto">

                            {error && error.length > 0 &&
                                <div className="row mb-3">
                                    <div className="control-row col-12">
                                        <span className="text-danger fst-italic small">{error}</span>
                                    </div>
                                </div>
                            }

                            <div className="row mb-3 mt-4">
                                <div className="control-row col-12">
                                    <label className="label-2 small required">LLM prompt</label>
                                    <span className="text">
                                        <form>
                                            <textarea className="form-control"
                                                      autoFocus={true}
                                                      autoComplete="false"
                                                      placeholder="LLM prompt for this categorization"
                                                      value={prompt}
                                                      rows={10}
                                                      onChange={(event) => setPrompt(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>


                            <div className="row mb-3">
                                <div className="control-row col-6">
                                    <label className="label-2 small required">number of tokens of document text to pass to the
                                        LLM</label>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               placeholder="the number of tokens to pass"
                                               title="a number specifying the number of tokens to pass to the LLM [100, 32,000]"
                                               value={numTokens}
                                               onChange={(event) => {
                                                   setNumTokens(event.target.value)
                                               }}
                                        />
                                    </span>
                                </div>
                            </div>

                            <div className="row mb-3 mt-4">
                                <div className="control-row col-12">
                                    <label className="label-2 small required">document text to test against</label>
                                    <span className="text">
                                        <form>
                                            <textarea className="form-control"
                                                      autoComplete="false"
                                                      placeholder="the text of a document..."
                                                      value={text}
                                                      rows={10}
                                                      onChange={(event) => setText(event.target.value)}
                                            />
                                        </form>
                                    </span>
                                </div>
                            </div>

                            { llm_response && llm_response.length > 0 &&
                            <div className="row mb-3 mt-4">
                                <div className="control-row col-12">
                                    <label className="label-2 small">LLM response</label>
                                    <br/>
                                    <span className="text">
                                        <span className="fst-italic">{llm_response}</span>
                                    </span>
                                </div>
                            </div>
                            }


                        </div>
                    </div>

                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleTest(e)}>Test prompt
                        </button>
                    </div>

                </div>
            </div>
        </div>

    )
}
