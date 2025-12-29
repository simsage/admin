/*
 * Copyright (c) 2024 by Rock de Vocht and Callum
 *
 * All rights reserved. No part of this publication may be reproduced, distributed, or
 * transmitted in any form or by any means, including photocopying, recording, or other
 * electronic or mechanical methods, without the prior written permission of the publisher,
 * except in the case of brief quotations embodied in critical reviews and certain other
 * noncommercial uses permitted by copyright law.
 *
 */
import { useDispatch, useSelector } from "react-redux";
import {closeForm, getSources, safeSourceForImportOrExport, updateSource} from "./sourceSlice";
import { useForm } from "react-hook-form";
import { FaFileImport } from 'react-icons/fa';
import React, {useState} from "react";

export function SourceImport() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const { register, handleSubmit, setValue } = useForm();
    const [isTextPresent, setIsTextPresent] = useState(false);

    const handleClose = () => dispatch(closeForm());

    const handleDragOver = (event) => event.preventDefault()

    const handleTextareaChange = (event) => setIsTextPresent(event.target.value.trim() !== "")

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("sourceTextarea").value = e.target.result;
            setValue("source_str", e.target.result); // Update form state
            setIsTextPresent(true); // Set text present flag to true
        }
        reader.readAsText(file)
    }

    const handleFileInput = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById("sourceTextarea").value = e.target.result;
            setValue("source_str", e.target.result); // Update form state
            setIsTextPresent(true); // Set text present flag to true
        }
        reader.readAsText(file);
    }

    const onSubmit = (data) => {
        const dataJson = JSON.parse(data.source_str);
        dataJson.scheduleEnable = false;

        const crawler = safeSourceForImportOrExport(dataJson, {
            organisationId: selected_organisation_id,
            kbId: selected_knowledge_base_id,
        });

        dispatch(updateSource({ session_id: session_id, data: crawler, on_success: () => {
                dispatch(getSources({
                    session_id: session.id,
                    organisation_id: selected_organisation_id,
                    kb_id: selected_knowledge_base_id
                }))
        }}))
        setIsTextPresent(true); // Set text present flag to true
    }

    return (
        <div
            className="modal alert-warning"
            role="dialog"
            style={{ display: "inline", background: "#202731bb" }}
        >
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h4 className="modal-header px-5 pt-4" id="staticBackdropLabel">Import Crawler</h4>
                        <div
                            className="tab-content px-5 py-4 overflow-auto"
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <h5 className="label-2 medium">Data</h5>
                            <div style={{ position: "relative" }}>
                                <textarea
                                    id="sourceTextarea"
                                    className="form-control"
                                    placeholder="JSON..."
                                    spellCheck="true"
                                    rows="10"
                                    style={{
                                        width: '100%',
                                        minHeight: '350px',
                                        fontFamily: 'monospace',
                                        fontSize: '14px',
                                        padding: '10px',
                                        border: '1px solid #ced4da',
                                        borderRadius: '5px',
                                        resize: 'vertical',
                                    }}
                                    {...register("source_str", { required: true })}
                                    onChange={handleTextareaChange} // Call the handler on change
                                />
                                {
                                    !isTextPresent && (
                                        <div style={{ position: "absolute", top: "50%", left: "75%", transform: "translate(-50%, -50%)" }}>
                                            <label className="btn btn-secondary" htmlFor="fileInput">
                                                <FaFileImport size={24} style={{ marginRight: '5px' }} />
                                                <span style={{ textDecoration: 'underline', color: '#fff' }}>
                                                    Browse
                                                </span>
                                            </label>
                                            <input
                                                id="fileInput"
                                                type="file"
                                                accept=".json"
                                                style={{ display: 'none' }} // Hide the input element visually
                                                onChange={handleFileInput}
                                            />
                                        </div>
                                    )
                                }

                            </div>
                            <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                                <li>The schedule is always automatically turned off when importing.</li>
                                <li>
                                    Sensitive credentials are not provided for security reasons,
                                    provide once imported to start the crawler successfully.
                                </li>
                                <li>Source name <i>MUST be unique.</i></li>
                            </ul>
                        </div>
                        <div className="modal-footer px-5 pb-4">
                            <button
                                onClick={handleClose}
                                type="button"
                                className="btn btn-secondary px-4"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <input type="submit" value="Import" className="btn btn-primary px-4"/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
