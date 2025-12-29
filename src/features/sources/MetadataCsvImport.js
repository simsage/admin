/*
 * Copyright (c) 2025 by Rock de Vocht and Callum
 *
 * All rights reserved. No part of this publication may be reproduced, distributed, or
 * transmitted in any form or by any means, including photocopying, recording, or other
 * electronic or mechanical methods, without the prior written permission of the publisher,
 * except in the case of brief quotations embodied in critical reviews and certain other
 * noncommercial uses permitted by copyright law.
 *
 */
import { useDispatch, useSelector } from "react-redux";
import { FaFileImport } from 'react-icons/fa';
import React, {useState} from "react";
import {closeCsvImportForm, importCsvMetadata} from "./sourceSlice";

export function MetadataCsvImport() {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const show_csv_import = useSelector((state) => state.sourceReducer.show_csv_import);
    const csv_import_primary_key = useSelector((state) => state.sourceReducer.csv_import_primary_key);
    const selected_source = useSelector((state) => state.sourceReducer.selected_source);

    const [isTextPresent, setIsTextPresent] = useState(false);
    const [text, setText] = useState('');

    const handleClose = () => {
        dispatch(closeCsvImportForm());
    }

    const handleImport = () => {
        dispatch(importCsvMetadata({
            "session_id": session_id,
            "organisation_id": organisation_id,
            "kb_id": kb_id,
            "source_id": selected_source.sourceId,
            "primary_key": csv_import_primary_key,
            "text": text
        }));
    }

    const handleDragOver = (event) => event.preventDefault()

    const handleTextareaChange = (event) => {
        setIsTextPresent(event.target.value.trim() !== "")
        setText(event.target.value)
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setText(e.target.result);
            setIsTextPresent(true);
        }
        reader.readAsText(file)
    }

    // create a random key example consistent with the primary key supplied
    const random_key = () => {
        let new_str = ""
        const digits = "0123456789"
        const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const both = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        for (let i = 0; i < csv_import_primary_key.length; i++) {
            const ch = csv_import_primary_key[i]
            if (ch === '#') new_str += digits.charAt(Math.floor(Math.random() * digits.length));
            else if (ch === '.') new_str += letters.charAt(Math.floor(Math.random() * letters.length));
            else if (ch === '*') new_str += both.charAt(Math.floor(Math.random() * both.length));
            else new_str += ch
        }
        return new_str
    }

    const handleFileInput = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setText(e.target.result); // Update form state
            setIsTextPresent(true); // Set text present flag to true
        }
        reader.readAsText(file);
    }

    if (!show_csv_import || !csv_import_primary_key) {
        return (<div />)
    }

    return (
        <div
            className="modal alert-warning"
            role="dialog"
            style={{ display: "inline", background: "#202731bb" }}
        >
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <h4 className="modal-header px-5 pt-4" id="staticBackdropLabel">Import Metadata Csv Data</h4>
                    <div
                        className="tab-content px-5 py-4 overflow-auto"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <h5 className="label-2 medium">Text</h5>
                        <div style={{ position: "relative" }}>
                            <textarea
                                id="sourceTextarea"
                                className="form-control"
                                placeholder={"e.g., for a primary-key defined as " + csv_import_primary_key + ":\n\nkey, mdAuthor, mdTitle, mdValue\n" + random_key() + ", John Elderberries, A Tale of two Cities, 40\n" +  random_key() + ", John Smallberries, Constellation Drive Title, 25"}
                                spellCheck="false"
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
                                value={text}
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
                                            accept=".txt"
                                            style={{ display: 'none' }} // Hide the input element visually
                                            onChange={handleFileInput}
                                        />
                                    </div>
                                )
                            }

                        </div>
                        <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                            <li>The first line of your Csv must define the column names</li>
                            <li>first column must be named 'key'</li>
                            <li>One Csv record per line</li>
                            <li>Csv records with commas inside must use double quotes</li>
                            <li>There is a 10 MB limit per Csv file-upload</li>
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
                        <button
                            onClick={handleImport}
                            disabled={!isTextPresent}
                            type="button"
                            className="btn btn-primary px-4"
                            data-bs-dismiss="modal"
                        >
                            Import
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}
