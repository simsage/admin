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
import api from "../../common/api";
import {Pagination} from "../../common/pagination";
import {loadLLMList, newLLM, editLLM, deleteLLM} from "./llmSlice";
import LLMEdit from "./LLMEdit";
import ConfirmMessage from "../../common/ConfirmMessage";

export default function LLMHome() {

    const dispatch = useDispatch();

    const {busy, llm_list, llm_edit, needs_reload} = useSelector((state) => state.llmReducer)
    const session = useSelector((state) => state.authReducer.session);
    const kb_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session_id = session && session.id ? session.id : null;
    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    //pagination
    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);
    const [message, setMessage] = useState("");
    const [delete_id, setDeleteId] = useState(0);


    useEffect(() => {
        if ((organisation_id && kb_id) || needs_reload) {
            dispatch(loadLLMList({session_id, organisation_id: organisation_id, kb_id: kb_id, page: page, page_size: page_size}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, kb_id, organisation_id, page, page_size, session_id, needs_reload])

    const handleRefresh = () => {
        dispatch(loadLLMList({session_id, organisation_id: organisation_id, kb_id: kb_id, page: page, page_size: page_size}));
    }

    function handleNewLLM() {
        dispatch(newLLM({session_id, organisation_id: organisation_id, kb_id: kb_id}));
    }

    function handleEditLLM(llm) {
        if (!session || !llm) return;
        dispatch(editLLM({llm_edit: llm}));
    }

    function handleRemoveLLM(llm) {
        if (!session || !llm) return;
        setMessage("Are you sure you want to delete LLM " + llm.id + " " + llm.llm)
        setDeleteId(llm.id);
    }

    function confirm_delete(apply) {
        if (apply && delete_id > 0) {
            dispatch(deleteLLM({
                session_id,
                organisation_id: organisation_id,
                kb_id: kb_id,
                id: delete_id
            }));
        }
        setMessage("")
        setDeleteId(0);
    }

    return (
        <div className="section px-5 pt-4">
            <ConfirmMessage message={message}
                            close={(apply) => confirm_delete(apply)} />
            <div>
                <div className="d-flex justify-content-beteween w-100 mb-4">
                    <div className="form-group d-flex ms-auto">
                        <div className="btn" onClick={() => handleRefresh()} >
                            <img src={REFRESH_IMAGE} className="refresh-image" alt="refresh" title="refresh organisations" />
                        </div>

                        <button data-testid="add-new-organisation" onClick={() => handleNewLLM()}
                                disabled={busy}
                                className="btn btn-primary text-nowrap ms-2">+ Add
                            LLM
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <table className={theme === "light" ? "table" : "table-dark"}>
                    <thead>
                    <tr>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>LLM</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Enabled</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Inference</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Training</td>
                        <td>

                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        {(!llm_list || llm_list.length === 0) &&
                            <td className={"pt-3 px-4 pb-3 fw-light"} colSpan={5}>No records found.</td>
                        }
                    </tr>

                    {llm_list && llm_list.length > 0 &&
                        llm_list.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td className={"pt-3 px-4 pb-3 pointer-cursor"}
                                        title={"llm " + item.id}
                                        onClick={() => handleEditLLM(item)}>
                                        { item.id + ": " + (item.llm ? item.llm : "") + "/" + (item.model ? item.model : "")}
                                    </td>
                                    <td className="pt-3 px-4 pb-3"
                                        title={item.enabled ? item.id + " is enabled" : item.id + " is disabled"}>
                                        {item.enabled ? "yes" : "no"}
                                    </td>
                                    <td className="pt-3 px-4 pb-3"
                                        title={item.useForInference ? item.id + " is enabled for inferencing" : item.id + " is disabled for inferencing"}>
                                        {item.useForInference ? "yes" : "no"}
                                    </td>
                                    <td className="pt-3 px-4 pb-3"
                                        title={item.useForTraining ? item.id + " is enabled for training" : item.id + " is disabled for training"}>
                                        {item.useForTraining ? "yes" : "no"}
                                    </td>
                                    <td>
                                        <div className="d-flex  justify-content-end">
                                            <button className={"btn text-primary btn-sm"}
                                                    title={"edit LLM " + item.id}
                                                    onClick={() => handleEditLLM(item)}>Edit
                                            </button>

                                            <button className={"btn text-danger btn-sm"}
                                                    title={"remove LLM " + item.id}
                                                    onClick={() => handleRemoveLLM(item)}>Delete
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>

                <Pagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={llm_list.length}
                    rowsPerPage={page_size}
                    page={page}
                    backIconButtonProps={{'aria-label': 'Previous Page',}}
                    nextIconButtonProps={{'aria-label': 'Next Page',}}
                    onChangePage={(page) => setPage(page)}
                    onChangeRowsPerPage={(rows) => setPageSize(rows)}
                />


            </div>

            {/*Show backups*/}
            <div>

                { llm_edit && <LLMEdit /> }

            </div>
        </div>);
}
