import { useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "../../common/pagination";
import {
    setViewIds,
    showAddForm,
    showEditForm,
    showDeleteAskForm,
    showOptimizeAskDialog,
    search, showTruncateIndexesAskDialog
} from "./knowledgeBaseSlice";
import {setSelectedKB} from "../auth/authSlice";
import api from "../../common/api";

export default function KnowledgeBaseList() {

    const theme = '';

    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state).authReducer.session;
    const session_id = session.id;

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    // const data_status = useSelector((state) => state.kbReducer.data_status)

    const dispatch = useDispatch()


    function getKnowledgeBases() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        for (const i in kb_list) {
            if (i >= first && i < last) {
                paginated_list.push(kb_list[i]);
            }
        }
        return paginated_list;
    }

    function isVisible() {
        //Todo:: verify selected org before display
        // return this.props.organisation_id && this.props.organisation_id.length > 0 &&
        //     this.props.selected_organisation && this.props.selected_organisation.length > 0;
        return true;
    }

    const handleAddForm = () => {
        dispatch(showAddForm(true));
    }

    const handleEditForm = (kb_id) => {
        console.log("kb_id", kb_id)
        dispatch(showEditForm({kb_id: kb_id}));
    }

    const handleDeleteFormAsk = (kb) => {
        dispatch(showDeleteAskForm({session_id, kb}));
    }

    function handleViewIds(kb_id) {
        console.log("handleViewIds")
        dispatch(setViewIds({kb_id: kb_id}))
    }

    function handleOptimizeIndexesAsk(knowledge_base) {
        dispatch(showOptimizeAskDialog({session_id, kb: knowledge_base}));
    }

    function handleTruncateSlowIndexesAsk(knowledge_base) {
        dispatch(showTruncateIndexesAskDialog({session_id, kb: knowledge_base}));
    }

    function handleSearchFilter(event) {
        const val = event.target.value;
        dispatch(search({keyword: val}))
    }

    return (
        <div className="kb-page">
            {isVisible() &&
                <div>

                    <div className="d-flex justify-content-beteween w-100 mb-4">
                        <div className="d-flex w-100">
                            <div className="form-group me-2">
                                <input onKeyUp={(event) => handleSearchFilter(event)} type="text"
                                       placeholder={"Filter..."} className="form-control filter-search-input"/>
                            </div>

                        </div>

                        <div className="form-group ms-auto">
                            {organisation_id && organisation_id.length > 0 &&
                                <button onClick={() => handleAddForm()} className={"btn btn-primary text-nowrap"}>+ Add
                                    Knowledge Base</button>
                            }
                        </div>
                    </div>

                    <div>



                        <table className="table">
                            <thead>
                            <tr>
                                {/* <td></td> */}
                                <td className="small text-black-50 px-4">Knowledge Base</td>
                                <td className="small text-black-50 px-4">Email Queries</td>
                                <td></td>
                            </tr>
                            </thead>
                            <tbody>

                            {
                                getKnowledgeBases().map((knowledge_base) => {
                                    return (
                                        <tr key={knowledge_base.kbId}>
                                            {/* <td className="pt-3 ps-4 pe-0 pb-3"></td> */}
                                            <td className="pt-3 px-4 pb-3">
                                                <div className="kb-label fw-500"
                                                     onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.name}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-3 fw-light">
                                                <div className="kb-label"
                                                     onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.email}</div>
                                            </td>

                                            <td className="pt-3 px-4 pb-0">
                                                <div className="link-button d-flex justify-content-end">

                                                    <button title="view knowledge base ids"
                                                            onClick={() => handleViewIds(knowledge_base.kbId)}
                                                            className={"btn text-primary btn-sm"}>View IDs
                                                    </button>
                                                    <button title="optimize indexes"
                                                            onClick={() => handleOptimizeIndexesAsk(knowledge_base)}
                                                            className={"btn text-primary btn-sm"}>Optimize indexes
                                                    </button>
                                                    <button title="truncate slow indexes"
                                                            onClick={() => handleTruncateSlowIndexesAsk(knowledge_base)}
                                                            className={"btn text-primary btn-sm"}>Truncate slow indexes
                                                    </button>
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

