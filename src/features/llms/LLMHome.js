import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import SensitiveCredential from "../../components/SensitiveCredential";
import {showErrorMessage, closeErrorMessage, loadLLM, updateLLM} from "./llmSlice";
import ErrorMessage from "../../common/ErrorMessage";
import {BsFilePdf} from "react-icons/bs";

const open_ai_model_list = [
    "gpt-3.5-turbo",
];

export default function LLMHome() {

    const dispatch = useDispatch()

    const {is_error, busy, error_text, llm_model} = useSelector((state) => state.llmReducer)
    const session = useSelector((state) => state.authReducer.session);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session_id = session && session.id ? session.id : null;

    useEffect(() => {
        dispatch(loadLLM({ session_id, organisation_id: organisation_id, kb_id: kb_id}));
        setLLM(llm_model.llm);
        setLLMData(llm_model);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llm_model.llm])

    function errorClose(error_obj) {
        dispatch(closeErrorMessage());
    }

    const [llm, setLLM] = useState(llm_model.llm)
    const [llmData, setLLMData] = useState({
        'key': llm_model.key,
        'model': (llm_model.llm === 'openai' && llm_model.model === '') ? open_ai_model_list[0] : llm_model.model,
        'documentQATokens': '' + llm_model.documentQATokens,
        'summaryTokens': '' + llm_model.summaryTokens,
        'numSearchResults': '' + llm_model.numSearchResults,
        'perSearchResultTokens': '' + llm_model.perSearchResultTokens
    })

    const llmChange = (src) => {
        setLLM(src.value)
    }

    function close_error() {
        dispatch(closeErrorMessage())
    }

    function on_save() {

        let documentQATokens = 0;
        let summaryTokens = 0;
        let numSearchResults = 0;
        let perSearchResultTokens = 0;

        let key = ""
        let model = "";
        let error = false;

        if (llm === "openai" || llm === "gemini") {
            documentQATokens = parseInt(llmData.documentQATokens);
            summaryTokens = parseInt(llmData.summaryTokens);
            numSearchResults = parseInt(llmData.numSearchResults);
            perSearchResultTokens = parseInt(llmData.perSearchResultTokens);
            key = llmData.key.trim();
            model = llmData.model;
        }

        if (llm === "gemini" || llm === "openai") {
            if (key.trim() === "") {
                error = true;
                dispatch(showErrorMessage({error_message: "key value not set, required"}));
            }
            if (llm === "openai" && model === "") {
                model = open_ai_model_list[0];
            }
            if (isNaN(documentQATokens) || isNaN(summaryTokens) || isNaN(numSearchResults) || isNaN(perSearchResultTokens)) {
                error = true;
                dispatch(showErrorMessage({error_message: "document-qa tokens, summary tokens, number of search results, and per search-result tokens must be numbers"}));
            }
            if (numSearchResults < 1 || numSearchResults > 10) {
                error = true;
                dispatch(showErrorMessage({error_message: "number of search results must have a value between 1 and 10"}));
            }
            if (perSearchResultTokens < 100 || perSearchResultTokens > 100000) {
                error = true;
                dispatch(showErrorMessage({error_message: "per search-result tokens must have a value between 100 and 100,000"}));
            }
            if (summaryTokens < 1000 || summaryTokens > 1000000) {
                error = true;
                dispatch(showErrorMessage({error_message: "summary tokens must have a value between 1,000 and 1,000,000"}));
            }
            if (documentQATokens < 1000 || documentQATokens > 1000000) {
                error = true;
                dispatch(showErrorMessage({error_message: "document-qa tokens must have a value between 1,000 and 1,000,000"}));
            }
        }

        if (!error) {
            dispatch(updateLLM({session_id: session_id, llm_data: {
                organisationId: organisation_id,
                kbId: kb_id,
                llm: llm,
                key: key,
                model: (llm === "gemini") ? '' : model,
                documentQATokens: documentQATokens,
                summaryTokens: summaryTokens,
                numSearchResults: numSearchResults,
                perSearchResultTokens: perSearchResultTokens,
            }}));
        }

    }

    return (
        <div className={busy ? "section px-5 pt-4 wait-cursor" : "section px-5 pt-4"}>

            { is_error &&
            <ErrorMessage
                error={{code: "Error", message: error_text}}
                close={() => close_error()}
                />
            }

            <div className="mb-4">

                <div className="row mb-3">

                    <div className="row">
                        <div className="col-4">
                            <label className="fs-4">Large Language Model (LLM)</label>
                        </div>
                        <div className="col-2 offset-4">
                        <a href="resources/simsage-ai.pdf" id="dlGDrive" target="_blank"
                               title="Download the SimSage AI setup guide"
                               className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                <BsFilePdf size={25}/>
                                <span className="me-2 mt-2"></span>SimSage AI<br/>Setup Guide
                            </a>
                        </div>
                    </div>

                    <div className="control-row col-6">
                        <input
                            className="form-check-input mb-2"
                            name={"llm"}
                            value={"none"}
                            checked={llm === "none"}
                            title={"disable the use of LLMs"}
                            type={"radio"}
                            onChange={(e) => {
                                llmChange(e.target)
                            }}/>
                        <label className="label-2 small">&nbsp;none</label><br/>
                        <input
                            className="form-check-input mb-2"
                            title={"use OpenAI"}
                            name={"llm"}
                            value={"openai"}
                            checked={llm === "openai"}
                            type={"radio"}
                            onChange={(e) => {
                                llmChange(e.target)
                            }}/>
                        <label className="label-2 small">&nbsp;OpenAI</label><br/>
                        <input
                            className="form-check-input mb-5"
                            title={"use Google Gemini"}
                            name={"llm"}
                            value={"gemini"}
                            checked={llm === "gemini"}
                            type={"radio"}
                            onChange={(e) => {
                                llmChange(e.target)
                            }}/>
                        <label className="label-2 small">&nbsp;Google Gemini</label><br/>
                    </div>

                </div>

                {llm === "openai" &&
                    <div>
                        <div className="row mb-3">

                            <div className="form-group col-4">
                                <SensitiveCredential
                                    specific_json={llmData.key}
                                    onChange={(event) => {
                                        setLLMData({...llmData, key: event.target.value})
                                    }}
                                    name="OpenAI key"
                                    required={false}
                                />
                            </div>

                            <div className="form-group col-3">
                                <label className="small">OpenAI model</label>
                                <div className="w-100">
                                    <select className="form-select text-capitalize" onChange={(event) => {
                                        setLLMData({...llmData, model: event.target.value})
                                    }}
                                            defaultValue={llmData.model}
                                            aria-label="the data-type of the metadata to be mapped">
                                        {
                                            open_ai_model_list.map((value, j) => {
                                                return (<option key={j} value={value}>{value}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                        </div>

                    </div>
                }

                {llm === "gemini" &&
                    <div>
                        <div className="row mb-3">

                            <div className="form-group col-4">
                                <SensitiveCredential
                                    specific_json={llmData.key}
                                    onChange={(event) => {
                                        setLLMData({...llmData, key: event.target.value})
                                    }}
                                    name="Gemini key"
                                    required={false}
                                />
                            </div>
                        </div>

                    </div>
                }

                { llm !== "none" &&
                <div>
                    <div className="row mb-3">
                        <div className="form-group col-2"
                             title="how many tokens to pass for document Q&A.">
                            <label className="small">document Q&A token count</label>
                            <input type="text" className="form-control"
                                   value={llmData.documentQATokens}
                                   onChange={(event) => {
                                       setLLMData({...llmData, documentQATokens: event.target.value})
                                   }}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-2"
                             title="how tokens to pass to the LLM for document summarization">
                            <label className="small">document summarization token count</label>
                            <input type="text" className="form-control"
                                   value={llmData.summaryTokens}
                                   onChange={(event) => {
                                       setLLMData({...llmData, summaryTokens: event.target.value})
                                   }}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-2"
                             title="how many search results to pass to the LLM to answer the search box question">
                            <label className="small">search box question answering, the number of results to pass to the LLM</label>
                            <input type="text" className="form-control"
                                   value={llmData.numSearchResults}
                                   onChange={(event) => {
                                       setLLMData({...llmData, numSearchResults: event.target.value})
                                   }}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="form-group col-2"
                             title="how many tokens to pass for each search result to the LLM for search box question answering">
                            <label className="small">search box question answering, the number of tokens to pass for each search result</label>
                            <input type="text" className="form-control"
                                   value={llmData.perSearchResultTokens}
                                   onChange={(event) => {
                                       setLLMData({...llmData, perSearchResultTokens: event.target.value})
                                   }}
                            />
                        </div>
                    </div>
                </div>
                }

                <div className="row mb-3">
                    <div className="form-group col-2" title="Save Settings">
                        <button className={"btn btn-primary px-4 pe-auto"}
                                title="Save"
                                onClick={(e) => on_save()}>
                            Save
                        </button>
                    </div>
                </div>


            </div>

        </div>
    )
}

