/*
 * Copyright (c) 2024 by Rock de Vocht & Callum Clegg
 *
 * All rights reserved. No part of this publication may be reproduced, distributed, or
 * transmitted in any form or by any means, including photocopying, recording, or other
 * electronic or mechanical methods, without the prior written permission of the publisher,
 * except in the case of brief quotations embodied in critical reviews and certain other
 * noncommercial uses permitted by copyright law.
 *
 */
import {useDispatch, useSelector} from "react-redux";
import {closeForm, safeSourceForImportOrExport} from "./sourceSlice";
import React, {useRef} from 'react';
import {CopyButton} from "../../components/CopyButton";
import { FaDownload } from 'react-icons/fa'

export function SourceExport() {
    const selected_source = useSelector((state) => state.sourceReducer.selected_source);
    const dispatch = useDispatch();
    const textareaRef = useRef(null);

    const title = "Export Crawler";

    const handleClose = () => dispatch(closeForm())

    // Function to handle changes in the textarea
    const handleChange = (event) => textareaRef.current.value = event.target.value

    // Function to convert textarea text to JSON
    const convertToJSON = () => {
        try {
            return JSON.parse(textareaRef.current.value);
        } catch (error) {
            console.error('Invalid JSON format:', error);
            return null;
        }
    };

    // Function to trigger download of JSON file
    const downloadJSONFile = () => {
        const jsonObject = convertToJSON();
        if (jsonObject) {
            const jsonBlob = new Blob([JSON.stringify(jsonObject, null, 5)], { type: 'application/json' });
            const url = URL.createObjectURL(jsonBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${jsonObject.name}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('Invalid JSON format. Cannot download.');
        }
    };

    return (
        <div
            id={"error_alert"} className="modal alert-warning" tabIndex="-1" role="dialog"
            style={{ display: "inline", zIndex: 8000, background: "#202731bb" }}
        >
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                    </div>
                    <div className="tab-content px-5 py-4 overflow-auto">
                        <h5 className="label-2 medium">Data - JSON Format</h5>
                        <textarea
                            ref={textareaRef}
                            className="form-control"
                            placeholder="Crawler data..."
                            rows="20"
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                minHeight: '300px',
                                fontFamily: 'monospace',
                                fontSize: '14px',
                                padding: '10px',
                                border: '1px solid #ced4da',
                                borderRadius: '5px',
                                resize: 'vertical',
                            }}
                            defaultValue={JSON.stringify(safeSourceForImportOrExport(selected_source), null, 5)}
                            readOnly
                        />
                    </div>
                    <div className="modal-footer px-5 pb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="" >
                            <button style={{ marginRight: '8px' }} className="btn btn-primary px-4" onClick={downloadJSONFile}>
                                <FaDownload /> {/* Include the download icon */}
                            </button>
                            <CopyButton reference={textareaRef} />
                        </div>
                        <button
                            onClick={handleClose}
                            type="button"
                            className="btn btn-primary px-4"
                            data-bs-dismiss="modal"
                        >
                            Done
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

