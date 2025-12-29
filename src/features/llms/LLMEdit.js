/*
 * Copyright (c) 2025 by Rock de Vocht
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
import {showErrorMessage, closeErrorMessage, updateLLM, closeLLMEdit, empty_llm} from "./llmSlice";
import ErrorMessage from "../../common/ErrorMessage";
import {BsFilePdf} from "react-icons/bs";
import CustomSelect from "../../components/CustomSelect";


const LLM_PROVIDERS = {
    NONE: "none",
    OPENAI: "openai",
    GEMINI: "gemini",
    OLLAMA: "ollama",
    AMAZON_Q: "amazon_q",
    COPILOT: "copilot"
}

const open_ai_model_list = [
    "gpt5",
    "gpt5-latest",
    "gpt5-mini",
    "gpt5-nano",
    "gpt-4.1",
    "gpt-4",
    "gpt-4-32k",
    "gpt-4o-latest",
    "gpt-4o-mini",
    "o1",
    "o1-mini",
    "o3-mini",
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-16k"
]

const gemini_model_list = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
]

const ollama_model_list = [
    "llama3.2:3b",
    "cogito:14b"
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

export default function LLMEdit() {

    const dispatch = useDispatch()

    const {is_error, busy, error_text, llm_edit} = useSelector((state) => state.llmReducer)
    const session = useSelector((state) => state.authReducer.session);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session_id = session && session.id ? session.id : null;

    useEffect(() => {
        setLLMData(llm_edit);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llm_edit])


    const [llmData, setLLMData] = useState({empty_llm})

    function set_llm(llm_model) {
        let llm_data_copy = JSON.parse(JSON.stringify(llmData));
        llm_data_copy.llm = llm_model ? llm_model : LLM_PROVIDERS.NONE;
        setLLMData(llm_data_copy)
    }

    function on_cancel() {
        dispatch(closeLLMEdit());
    }

    function on_save() {

        let documentQATokens = 0;
        let summaryTokens = 0;
        let numSearchResults = 0;
        let perSearchResultTokens = 0;
        let tokensThisMonth = 0;
        let tokensPerMonthMax = 0;

        let key_id = "";
        let key = ""
        let model = "";
        let region = "";
        let endpoint = "";
        let error = false;
        let enabled = true;
        const llm = llmData.llm;

        if (llm === LLM_PROVIDERS.OPENAI || llm === LLM_PROVIDERS.GEMINI || llm === LLM_PROVIDERS.AMAZON_Q ||
            llm === LLM_PROVIDERS.COPILOT || llm === LLM_PROVIDERS.OLLAMA) {
            documentQATokens = parseInt(llmData.documentQATokens);
            summaryTokens = parseInt(llmData.summaryTokens);
            numSearchResults = parseInt(llmData.numSearchResults);
            perSearchResultTokens = parseInt(llmData.perSearchResultTokens);
            tokensPerMonthMax = parseInt(llmData.tokensPerMonthMax);
            tokensThisMonth = parseInt(llmData.tokensThisMonth);
            key = llmData.key.trim();
            key_id = llmData.keyId ? llmData.keyId.trim() : '';
            region = llmData.region ? llmData.region.trim() : '';
            endpoint = llmData.endpoint ? llmData.endpoint.trim() : '';
            model = llmData.model;
            enabled = llmData.enabled;
        }

        if (llm === LLM_PROVIDERS.OPENAI || llm === LLM_PROVIDERS.GEMINI || llm === LLM_PROVIDERS.AMAZON_Q ||
            llm === LLM_PROVIDERS.COPILOT || llm === LLM_PROVIDERS.OLLAMA) {
            if (key.trim() === "" && llm !== LLM_PROVIDERS.OLLAMA) {
                error = true;
                dispatch(showErrorMessage({error_message: "key value not set, required"}));
            }
            if (llm === LLM_PROVIDERS.OLLAMA && model === "") {
                model = ollama_model_list[0];
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
                    tokensPerMonthMax: tokensPerMonthMax,
                    tokensThisMonth: tokensThisMonth,
                    enabled: enabled,
                    id: llmData.id,
                    useForInference: llmData.useForInference,
                    useForTraining: llmData.useForTraining,
                }
            }));
        }
    }

    const options = [
        {key: LLM_PROVIDERS.NONE, value: 'None'},
        {key: LLM_PROVIDERS.OPENAI, value: 'OpenAI'},
        {key: LLM_PROVIDERS.GEMINI, value: 'Google Gemini'},
        {key: LLM_PROVIDERS.OLLAMA, value: 'Ollama (local)'},
        // {key: LLM_PROVIDERS.AMAZON_Q, value: 'Amazon Bedrock'},
        // {key: LLM_PROVIDERS.COPILOT, value: 'CoPilot'}
    ]

    const handleModelChange = (value) => setLLMData({ ...llmData, model: value })

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                <div className="modal-content">
                    {is_error &&
                        <ErrorMessage error={{code: "Error", message: error_text}} close={() => dispatch(closeErrorMessage())}/>
                    }

                    <div className="modal-header px-5 pt-4">
                        <h4 className="mb-0" id="staticBackdropLabel">Large Language Model (LLM)</h4>
                    </div>

                    <div className="modal-body ms-2 p-2">

                        {/***********************************-LLM SELECT-***********************************/}
                        <div className="row pb-4 mt-4 mb-2">

                            <div className="col-1">
                            </div>

                            <div className="col-4">
                                LLM Provider
                                <CustomSelect
                                    options={options}
                                    defaultValue={llmData.llm}
                                    disabled={busy}
                                    onChange={(llm) => set_llm(llm)}
                                    label="Select LLM Provider"
                                />
                            </div>

                            <div className="col-4">
                            </div>

                            <div className="col-2">
                                <a href={DOCUMENTATION.AI_SETUP_GUIDE} id="dlGDrive" target="_blank" rel="noreferrer"
                                   title="Download the SimSage AI setup guide"
                                   className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                                    <BsFilePdf size={25}/>
                                    <span className="me-2 mt-2"></span>SimSage AI<br/>Setup Guide
                                </a>
                            </div>

                        </div>

                        {llmData.llm === LLM_PROVIDERS.OPENAI &&
                            <div className="row mb-3">
                                {/***********************************-OPEN AI-***********************************/}
                                <div className="col-1">
                                </div>
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
                        {llmData.llm === LLM_PROVIDERS.GEMINI &&
                            <div className="row mb-3">
                                {/***********************************-GEMINI-***********************************/}
                                <div className="col-1">
                                </div>
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
                        {llmData.llm === LLM_PROVIDERS.OLLAMA &&
                            <div className="mb-3">
                                <div className={"row"}>
                                    {/***********************************-OLLAMA-***********************************/}
                                    <div className="col-1">
                                    </div>
                                    <div className="form-group col-6 mb-4">
                                        <b>NB.</b> Ollama requires a GPU, please ensure you have a GPU available / set up.
                                        <ul className={"mt-2"}>
                                            <li>14b models requires 9GB of GPU RAM</li>
                                            <li>Smaller models require 4GB of GPU RAM</li>
                                            <li>CPU only is not sufficient for Ollama</li>
                                        </ul>

                                    </div>

                                </div>

                                <div className={"row"}>
                                    <div className="col-1">
                                    </div>
                                    <div className="form-group col-2">
                                        <label className="small">Ollama Models</label>
                                        <div className="w-100">
                                            <CustomSelect
                                                options={ollama_model_list.map((value) => (
                                                    {key: value, value: value}
                                                ))}
                                                defaultValue={llmData.model}
                                                onChange={(model) => handleModelChange(model)}
                                                label="Select Model"
                                            />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        }
                        {llmData.llm === LLM_PROVIDERS.AMAZON_Q &&
                            <div className="row mb-3">
                                {/***********************************-AMAZON Bedrock-***********************************/}
                                <div className="col-1">
                                </div>
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
                        {llmData.llm === LLM_PROVIDERS.COPILOT &&
                            <div className="row mb-3">
                                <div className="form-group col-1">
                                </div>
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
                        {llmData.llm !== LLM_PROVIDERS.NONE &&
                            <div>
                                {/***********************************-WHEN NOT NONE-***********************************/}

                                <div className="row mb-3">
                                    <div className="form-group col-1">
                                    </div>
                                    <div className="form-check form-switch col-10"
                                         title="At the end of a run through your data we can optionally check if files have been removed by seeing which files weren't seen during a run.  Check this option if you want files that no longer exist removed automatically from SimSage.">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={(llmData.enabled === true || llmData.enabled === 'true')}
                                            onChange={(e) => setLLMData({...llmData, enabled: e.target.checked})}
                                        />
                                        <label className="form-check-label small">
                                            Enabled (automatically disabled if maxmimum number of tokens is exceeded)
                                        </label>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="form-group col-1">
                                    </div>
                                    <div className="form-check form-switch col-10"
                                         title="Should this model be used for SimSage inference? (Q&A, summarizations, etc.)">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={(llmData.useForInference === true || llmData.useForInference === 'true')}
                                            onChange={(e) => setLLMData({...llmData, useForInference: e.target.checked})}
                                        />
                                        <label className="form-check-label small">
                                            used-for inference
                                        </label>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="form-group col-1">
                                    </div>
                                    <div className="form-check form-switch col-10"
                                         title="Should this model be used for SimSage document training?">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={(llmData.useForTraining === true || llmData.useForTraining === 'true')}
                                            onChange={(e) => setLLMData({...llmData, useForTraining: e.target.checked})}
                                        />
                                        <label className="form-check-label small">
                                            used-for training
                                        </label>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-1">
                                    </div>
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
                                    <div className="col-1">
                                    </div>
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
                                    <div className="col-1">
                                    </div>
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
                                    <div className="col-1">
                                    </div>
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

                                <div className="row mb-3">
                                    <div className="col-1">
                                    </div>
                                    <div className="form-group col-5"
                                         title="the maximum number of tokens per month before the model is disabled and a warning is emailed (if > 0)">
                                        <label className="small">the maximum number of tokens per month before the model is disabled and a warning is emailed (if > 0)</label>
                                        <input type="text" className="form-control"
                                               value={"" + llmData.tokensPerMonthMax}
                                               onChange={(event) => {
                                                   setLLMData({...llmData, tokensPerMonthMax: event.target.value})
                                               }}
                                        />
                                    </div>
                                    <div className="form-group col-5"
                                         title="the estimated number of tokens used thufar this month">
                                        <label className="small">the estimated number of tokens used this month: {llmData.tokensThisMonth ? llmData.tokensThisMonth.toLocaleString() : "0"}</label>
                                    </div>
                                </div>

                            </div>
                        }

                    </div>

                    <div className="modal-footer px-5 pb-4">
                        <div className="form-group col-2" title="Save Settings">

                            <button className={"btn btn-primary px-4 me-2 pe-auto"}
                                    title="Cancel"
                                    disabled={busy}
                                    onClick={() => on_cancel()}>
                                Cancel
                            </button>

                            <button className={"btn btn-primary px-4 pe-auto"}
                                    title="Save"
                                    disabled={llmData.llm === LLM_PROVIDERS.NONE || busy}
                                    onClick={() => on_save()}>
                                Save
                            </button>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

