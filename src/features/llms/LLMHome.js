/*
 * Copyright (c) 2023 by Rock de Vocht
 *
 * All rights reserved. No part of this publication may be reproduced, distributed, or
 * transmitted in any form or by any means, including photocopying, recording, or other
 * electronic or mechanical methods, without the prior written permission of the publisher,
 * except in the case of brief quotations embodied in critical reviews and certain other
 * noncommercial uses permitted by copyright law.
 *
 */
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import SensitiveCredential from "../../components/SensitiveCredential";
import {showErrorMessage, closeErrorMessage, loadLLM, updateLLM} from "./llmSlice";
import ErrorMessage from "../../common/ErrorMessage";
import {BsFilePdf} from "react-icons/bs";
import CustomSelect from "../../components/CustomSelect";


const LLM_PROVIDERS = {
    NONE: "none",
    OPENAI: "openai",
    GEMINI: "gemini",
    AMAZON_Q: "amazon_q",
    COPILOT: "copilot"
}

const open_ai_model_list = [
    "gpt-3.5-turbo",
    "gpt-4",
    "gpt-4o"
]

const gemini_model_list = [
    "gemini-pro", "gemini-1.5-pro", "gemini-1.5-flash"
]

const copilot_model_list = [
    "gpt-4"
]

// the AWS models are region specific (usually)
const amazon_bedrock_model_list = [
    {key: "claude3", value: "Claude 3 Sonnet"},
    {key: "mistral-large", value: "Mistral Large"},
]

const amazon_region_list = [
    {key: "ap-southeast-2", value: "Asia Pacific (Sydney)"},
    {key: "eu-west-2", value: "Europe (London)"},
    {key: "af-south-1", value: "Africa (Cape Town)"},
    {key: "ap-east-1", value: "Asia Pacific (Hong Kong)"},
    {key: "ap-south-2", value: "Asia Pacific (Hyderabad)"},
    {key: "ap-southeast-3", value: "Asia Pacific (Jakarta)"},
    {key: "ap-southeast-4", value: "Asia Pacific (Melbourne)"},
    {key: "ap-south-1", value: "Asia Pacific (Mumbai)"},
    {key: "ap-northeast-3", value: "Asia Pacific (Osaka)"},
    {key: "ap-northeast-2", value: "Asia Pacific (Seoul)"},
    {key: "ap-southeast-1", value: "Asia Pacific (Singapore)"},
    {key: "ap-northeast-1", value: "Asia Pacific (Tokyo)"},
    {key: "ca-central-1", value: "Canada (Central)"},
    {key: "ca-west-1", value: "Canada West (Calgary)"},
    {key: "eu-central-1", value: "Europe (Frankfurt)"},
    {key: "eu-west-1", value: "Europe (Ireland)"},
    {key: "eu-south-1", value: "Europe (Milan)"},
    {key: "eu-west-3", value: "Europe (Paris)"},
    {key: "eu-south-2", value: "Europe (Spain)"},
    {key: "eu-north-1", value: "Europe (Stockholm)"},
    {key: "eu-central-2", value: "Europe (Zurich)"},
    {key: "il-central-1", value: "Israel (Tel Aviv)"},
    {key: "me-south-1", value: "Middle East (Bahrain)"},
    {key: "me-central-1", value: "Middle East (UAE)"},
    {key: "sa-east-1", value: "South America (São Paulo)"},
    {key: "us-east-2", value: "US East (Ohio)"},
    {key: "us-east-1", value: "US East (Virginia)"},
    {key: "us-west-1", value: "US West (N. California)"},
    {key: "us-west-2", value: "US West (Oregon)"}
]

const DOCUMENTATION = {
    AI_SETUP_GUIDE: "resources/simsage-ai.pdf"
}

export default function LLMHome() {

    const dispatch = useDispatch()

    const {is_error, busy, error_text, llm_model} = useSelector((state) => state.llmReducer)
    const session = useSelector((state) => state.authReducer.session);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session_id = session && session.id ? session.id : null;

    useEffect(() => {
        if (organisation_id && kb_id && llm_model && llm_model.llm) {
            dispatch(loadLLM({session_id, organisation_id: organisation_id, kb_id: kb_id}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, kb_id, organisation_id, session_id])

    useEffect(() => {
        setLLM(llm_model.llm);
        setLLMData(llm_model);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llm_model])


    const [llm, setLLM] = useState(llm_model && llm_model.llm ? llm_model && llm_model.llm : LLM_PROVIDERS.NONE)
    const [llmData, setLLMData] = useState({
        'key': llm_model.key,
        'model': (llm_model.llm === 'openai' && llm_model.model === '') ? open_ai_model_list[0] : llm_model.model,
        'keyId': llm_model.keyId ? llm_model.keyId : '',
        'region': llm_model.region ? llm_model.region : '',
        'endpoint': llm_model.endpoint ? llm_model.endpoint : '',
        'documentQATokens': '' + llm_model.documentQATokens,
        'summaryTokens': '' + llm_model.summaryTokens,
        'numSearchResults': '' + llm_model.numSearchResults,
        'perSearchResultTokens': '' + llm_model.perSearchResultTokens
    })


    function on_save() {

        let documentQATokens = 0;
        let summaryTokens = 0;
        let numSearchResults = 0;
        let perSearchResultTokens = 0;

        let key_id = "";
        let key = ""
        let model = "";
        let region = "";
        let endpoint = "";
        let error = false;

        if (llm === LLM_PROVIDERS.OPENAI || llm === LLM_PROVIDERS.GEMINI || llm === LLM_PROVIDERS.AMAZON_Q ||
            llm === LLM_PROVIDERS.COPILOT) {
            documentQATokens = parseInt(llmData.documentQATokens);
            summaryTokens = parseInt(llmData.summaryTokens);
            numSearchResults = parseInt(llmData.numSearchResults);
            perSearchResultTokens = parseInt(llmData.perSearchResultTokens);
            key = llmData.key.trim();
            key_id = llmData.keyId ? llmData.keyId.trim() : '';
            region = llmData.region ? llmData.region.trim() : '';
            endpoint = llmData.endpoint ? llmData.endpoint.trim() : '';
            model = llmData.model;
        }

        if (llm === LLM_PROVIDERS.OPENAI || llm === LLM_PROVIDERS.GEMINI || llm === LLM_PROVIDERS.AMAZON_Q ||
            llm === LLM_PROVIDERS.COPILOT) {
            if (key.trim() === "") {
                error = true;
                dispatch(showErrorMessage({error_message: "key value not set, required"}));
            }
            if (llm === LLM_PROVIDERS.OPENAI && model === "") {
                model = open_ai_model_list[0];
            }
            if (llm === LLM_PROVIDERS.AMAZON_Q && region === "") {
                error = true;
                dispatch(showErrorMessage({error_message: "region value not set, required"}));
            }
            if (llm === LLM_PROVIDERS.COPILOT && endpoint === "") {
                error = true;
                dispatch(showErrorMessage({error_message: "endpoint value not set, required"}));
            }
            if (isNaN(documentQATokens) || isNaN(summaryTokens) || isNaN(numSearchResults) || isNaN(perSearchResultTokens)) {
                error = true;
                dispatch(showErrorMessage({error_message: "document-qa tokens, summary tokens, number of search results, and per search-result tokens must be numbers"}));
            }
            if (numSearchResults < 1 || numSearchResults > 10) {
                error = true;
                dispatch(showErrorMessage({error_message: "number of search results must have a value between 1 and 10"}));
            }
            if (perSearchResultTokens < 100 || perSearchResultTokens > 100_000) {
                error = true;
                dispatch(showErrorMessage({error_message: "per search-result tokens must have a value between 100 and 100,000"}));
            }
            if (summaryTokens < 1_000 || summaryTokens > 1_000_000) {
                error = true;
                dispatch(showErrorMessage({error_message: "summary tokens must have a value between 1,000 and 1,000,000"}));
            }
            if (documentQATokens < 1_000 || documentQATokens > 1_000_000) {
                error = true;
                dispatch(showErrorMessage({error_message: "document-qa tokens must have a value between 1,000 and 1,000,000"}));
            }
        }

        if (!error) {
            dispatch(updateLLM({
                session_id: session_id, llm_data: {
                    organisationId: organisation_id,
                    kbId: kb_id,
                    llm: llm,
                    key: key,
                    keyId: key_id,
                    region: region,
                    endpoint: endpoint,
                    model: model,
                    documentQATokens: documentQATokens,
                    summaryTokens: summaryTokens,
                    numSearchResults: numSearchResults,
                    perSearchResultTokens: perSearchResultTokens,
                }
            }));
        }
    }

    useEffect(() => {
        const modelLists = {
            [LLM_PROVIDERS.COPILOT]: copilot_model_list,
            [LLM_PROVIDERS.OPENAI]: open_ai_model_list,
            [LLM_PROVIDERS.GEMINI]: gemini_model_list,
            [LLM_PROVIDERS.AMAZON_Q]: amazon_bedrock_model_list
        }

        if (llm in modelLists) {
            setLLMData({...llmData, model: modelLists[llm][0]})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llm])

    const options = [
        {key: LLM_PROVIDERS.NONE, value: 'None'},
        {key: LLM_PROVIDERS.OPENAI, value: 'OpenAI'},
        {key: LLM_PROVIDERS.GEMINI, value: 'Google Gemini'},
        {key: LLM_PROVIDERS.AMAZON_Q, value: 'Amazon Bedrock'},
        {key: LLM_PROVIDERS.COPILOT, value: 'CoPilot'}
    ]

    const handleModelChange = (value) => setLLMData({ ...llmData, model: value })

    return (
        <div className={busy ? "section px-5 pt-4 wait-cursor" : "section px-5 pt-4"}>
            {is_error &&
                <ErrorMessage error={{code: "Error", message: error_text}} close={() => dispatch(closeErrorMessage())}/>
            }
            <div className="mb-4">
                <div className="row mb-3">
                    <div className="row">
                        <div className="col-4">
                            <label className="fs-4">Large Language Model (LLM)</label>
                        </div>
                        <div className="col-2 offset-4">
                            <a href={DOCUMENTATION.AI_SETUP_GUIDE} id="dlGDrive" target="_blank" rel="noreferrer"
                               title="Download the SimSage AI setup guide"
                               className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                <BsFilePdf size={25}/>
                                <span className="me-2 mt-2"></span>SimSage AI<br/>Setup Guide
                            </a>
                        </div>
                    </div>
                    {/***********************************-LLM SELECT-***********************************/}
                    <div className="control-row col-2">
                        <CustomSelect
                            options={options}
                            defaultValue={llm}
                            onChange={(llm) => setLLM(llm)}
                            label="Select LLM Provider"
                        />
                    </div>
                </div>
                {llm === LLM_PROVIDERS.OPENAI &&
                    <div className="row mb-3">
                        {/***********************************-OPEN AI-***********************************/}
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
                                <CustomSelect
                                    options={open_ai_model_list.map((value) => (
                                        {key: value, value: value}
                                    ))}
                                    defaultValue={llmData.model}
                                    onChange={(model) => handleModelChange(model)}
                                    label="Select Model"
                                />
                            </div>
                        </div>
                    </div>
                }
                {llm === LLM_PROVIDERS.GEMINI &&
                    <div className="row mb-3">
                        {/***********************************-GEMINI-***********************************/}
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

                        <div className="form-group col-2">
                            <label className="small">Gemini model</label>
                            <div className="w-100">
                                <CustomSelect
                                    options={gemini_model_list.map((value) => (
                                        {key: value, value: value}
                                    ))}
                                    defaultValue={llmData.model}
                                    onChange={(model) => handleModelChange(model)}
                                    label="Select Model"
                                />
                            </div>
                        </div>

                    </div>
                }
                {llm === LLM_PROVIDERS.AMAZON_Q &&
                    <div className="row mb-3">
                        {/***********************************-AMAZON Bedrock-***********************************/}
                        <div className="form-group col-2"
                             title="Amazon key-id">
                            <label className="small">Amazon key id</label>
                            <input type="text" className="form-control"
                                   value={llmData.keyId}
                                   onChange={(event) => {
                                       setLLMData({...llmData, keyId: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-3">
                            <SensitiveCredential
                                specific_json={llmData.key}
                                onChange={(event) => {
                                    setLLMData({...llmData, key: event.target.value})
                                }}
                                name="Amazon key"
                                required={false}
                            />
                        </div>
                        <div className="form-group col-2">
                            <label className="small">Bedrock model</label>
                            <div className="w-100">
                                <CustomSelect
                                    options={amazon_bedrock_model_list}
                                    defaultValue={llmData.model}
                                    onChange={(model) => handleModelChange(model)}
                                    label="Select Model"
                                />
                            </div>
                        </div>
                        <div className="form-group col-2">
                            <label className="small">Amazon region</label>
                            <div className="w-100">
                                <CustomSelect
                                    label={"Select AWS Region"}
                                    defaultValue={llmData.region}
                                    disabled={false}
                                    onChange={(region) => setLLMData({...llmData, region: region})}
                                    options={amazon_region_list}
                                />
                            </div>
                        </div>
                    </div>
                }
                {llm === LLM_PROVIDERS.COPILOT &&
                    <div className="row mb-3">
                        {/***********************************-AMAZON Bedrock-***********************************/}
                        <div className="form-group col-3">
                            <SensitiveCredential
                                specific_json={llmData.key}
                                onChange={(event) => {
                                    setLLMData({...llmData, key: event.target.value})
                                }}
                                name="CoPilot key"
                                required={false}
                            />
                        </div>
                        <div className="form-group col-3"
                             title="CoPilot endpoint">
                            <label className="small">CoPilot endpoint</label>
                            <input type="text" className="form-control"
                                   value={llmData.endpoint}
                                   onChange={(event) => {
                                       setLLMData({...llmData, endpoint: event.target.value})
                                   }}
                            />
                        </div>
                        <div className="form-group col-3">
                            <label className="small">CoPilot model</label>
                            <div className="w-100">
                                <CustomSelect
                                    options={copilot_model_list.map((value) => (
                                        {key: value, value: value}
                                    ))}
                                    defaultValue={llmData.model}
                                    onChange={(model) => handleModelChange(model)}
                                    label="Select Model"
                                />
                            </div>
                        </div>
                    </div>
                }
                {llm !== LLM_PROVIDERS.NONE &&
                    <div>
                        {/***********************************-WHEN NOT NONE-***********************************/}
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
                                <label className="small">search box question answering, the number of results to pass to
                                    the LLM</label>
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
                                <label className="small">search box question answering, the number of tokens to pass for
                                    each search result</label>
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
                                onClick={() => on_save()}>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

