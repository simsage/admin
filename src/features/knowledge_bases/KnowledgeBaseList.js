import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "../../common/pagination";
import {
    setViewIds,
    showAddForm,
    showEditForm,
    showDeleteAskForm,
    showOptimizeAskDialog,
    search, getKBList, showOptimizeAbortDialog
} from "./knowledgeBaseSlice";
import {setSelectedKB} from "../auth/authSlice";
import api, {IMAGES} from "../../common/api";
import {ProgressBar} from "../../common/progress-bar";

export default function KnowledgeBaseList() {

    const theme = ''
    const data_status = useSelector((state) => state.kbReducer.data_status)
    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session)
    const session_id = (session && session.id) ? session.id : ""
    const busy = useSelector((state) => state.kbReducer.busy);

    const [page, setPage] = useState(api.initial_page)
    const [page_size, setPageSize] = useState(api.initial_page_size)

    const dispatch = useDispatch()

    useEffect(() => {
        if (organisation_id && data_status === 'load_now')
            dispatch(getKBList({session_id: session_id, organization_id: organisation_id}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session_id, organisation_id, data_status])

    function getKnowledgeBases() {
        const paginated_list = []
        const first = page * page_size
        const last = first + parseInt(page_size)
        for (const i in kb_list) {
            if (i >= first && i < last) {
                paginated_list.push(kb_list[i])
            }
        }
        return paginated_list
    }

    function isVisible() {
        return true
    }

    const handleAddForm = () => dispatch(showAddForm(true))
    const handleEditForm = (kb_id) => dispatch(showEditForm({kb_id: kb_id}))
    const handleDeleteFormAsk = (kb) => dispatch(showDeleteAskForm({session_id, kb}))
    const handleRefresh = () => {
        if (!busy) {
            dispatch(
                getKBList({session_id: session_id, organization_id: organisation_id})
            )
        }
    }

    function handleViewIds(kb_id) {
        dispatch(setViewIds({kb_id: kb_id}))
    }

    function handleOptimizeIndexesAsk(knowledge_base) {
        if (!busy) {
            dispatch(showOptimizeAskDialog({session_id, kb: knowledge_base}))
        }
    }

    function handleOptimizeIndexesAbort(knowledge_base) {
        if (!busy) {
            dispatch(showOptimizeAbortDialog({session_id, kb: knowledge_base}))
        }
    }

    function handleSearchFilter(event) {
        if (!busy) {
            const val = event.target.value
            dispatch(search({keyword: val}))
        }
    }

    function handleSelectKb(kb) {
        if (!busy) {
            let kb_select = document.getElementById("kb-selector")
            kb_select.value = kb.kbId
            dispatch(setSelectedKB(kb))
        }
    }

    return (
        <div className="kb-page">
            {isVisible() &&
                <div>
                    <div className="d-flex justify-content-beteween w-100 mb-4">
                        <div className="d-flex w-100">
                            <div className="form-group me-2">
                                <input
                                    onKeyUp={(event) => handleSearchFilter(event)}
                                    type="text"
                                    placeholder={"Filter..."}
                                    className="form-control filter-search-input"
                                />
                            </div>
                        </div>

                        <div className="form-group d-flex ms-auto">
                            <div className="btn"
                                 onClick={() => handleRefresh()}>
                                 <img src={IMAGES.REFRESH_IMAGE} className="refresh-image" alt="refresh"
                                      title="refresh knowledge-base list"/>
                            </div>
                            {organisation_id && organisation_id.length > 0 &&
                                <button
                                    disabled={busy}
                                    onClick={() => handleAddForm()} className={"btn btn-primary text-nowrap"}>
                                    + Add Knowledge Base</button>
                            }
                        </div>
                    </div>

                    <div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="small text-black-50 px-4">Knowledge Base</td>
                                    <td className="small text-black-50 px-4">Email Queries</td>
                                </tr>
                            </thead>
                            <tbody>

                            <tr>
                                {getKnowledgeBases().length === 0 &&
                                    <td className={"pt-3 px-4 pb-3 fw-light"} colSpan={3}>No records found.</td>
                                }
                            </tr>
                            {
                                getKnowledgeBases().map((knowledge_base) => {
                                    return (
                                        <tr key={knowledge_base.kbId}>
                                            {/* <td className="pt-3 ps-4 pe-0 pb-3"></td> */}
                                            <td className="pt-3 px-4 pb-3 pointer-cursor">
                                                <div className="kb-label fw-500"
                                                     onClick={() => handleSelectKb(knowledge_base)}>{knowledge_base.name}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-3 fw-light pointer-cursor">
                                                <div className="kb-label"
                                                     onClick={() => handleSelectKb(knowledge_base)}>{knowledge_base.email}</div>
                                            </td>

                                            <td className="pt-3 px-4 pb-0">
                                                <div className="link-button d-flex justify-content-end">

                                                    <button title="view knowledge base ids"
                                                            onClick={() => handleViewIds(knowledge_base.kbId)}
                                                            className={"btn text-primary btn-sm"}>View IDs
                                                    </button>
                                                    {
                                                        !knowledge_base.isOptimizing &&
                                                        <button title="optimize indexes"
                                                                onClick={() => handleOptimizeIndexesAsk(knowledge_base)}
                                                                className={"btn text-primary btn-sm"}>Optimize indexes
                                                        </button>
                                                    }
                                                    {
                                                        knowledge_base.isOptimizing &&
                                                        <button
                                                            title={"click to abort: index optimization in progress @ " + knowledge_base.optimizationProgress + "%"}
                                                            onClick={() => handleOptimizeIndexesAbort(knowledge_base)}
                                                            className={"btn text-primary btn-sm"}>
                                                            Abort Optimization
                                                        </button>
                                                    }
                                                    {
                                                        knowledge_base.isOptimizing &&
                                                        <ProgressBar percent={knowledge_base.optimizationProgress}
                                                                     width={80}
                                                                     title={"progress @ " + knowledge_base.optimizationProgress + "%"}/>
                                                    }
                                                    <button title="edit knowledge base"
                                                            onClick={() => handleEditForm(knowledge_base.kbId)}
                                                            className={"btn text-primary btn-sm"}>Edit
                                                    </button>
                                                    <button title="remove knowledge base"
                                                            onClick={() => handleDeleteFormAsk(knowledge_base)}
                                                            className={"btn text-danger btn-sm"}>Delete
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
                            theme={theme}
                            component="div"
                            count={kb_list.length}
                            rowsPerPage={page_size}
                            page={page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => setPage(page)}
                            onChangeRowsPerPage={(rows) => setPageSize(rows)}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

