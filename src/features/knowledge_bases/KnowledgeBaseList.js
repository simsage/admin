import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "../../common/pagination";
import {deleteRecord, getKBList, setViewIds, showAddForm, showEditForm} from "./knowledgeBaseSlice";
import {setSelectedKB} from "../auth/authSlice";

export default function KnowledgeBaseList(){

    const defaultDmsIndexSchedule = '';
    const theme = '';

    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state).authReducer.session;
    const session_id = session.id;
    const [kb_page, setKbPage] = useState(0)
    const [kb_page_size, setKbPageSize] = useState(useSelector((state) => state.kbReducer.kb_page_size))

    const dispatch = useDispatch()
    

    useEffect(()=>{
        dispatch(getKBList({session_id:session.id, organization_id:organisation_id}));
    },[])


    function getKnowledgeBases() {
        const paginated_list = [];
        const first = kb_page * kb_page_size;
        const last = first + parseInt(kb_page_size);
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
        console.log("kb_id",kb_id)
        dispatch(showEditForm({kb_id:kb_id}));
    }

    const handleDeleteForm = (kb_id) => {
        console.log("delete",kb_id);

        // const data = {session_id:session_id,organisation_id:organisation_id,kb_id:kb_id}
        const data = {session_id,organisation_id,kb_id}
        console.log("delete data",data)
        dispatch(deleteRecord(data));
        // dispatch(getKBList({session_id:session.id, organization_id:organisation_id}));
        // TODO:Delete warning
        // TODO:Reload kb list
    }


    function handleViewIds(kb_id){
        console.log("handleViewIds")
        dispatch(setViewIds({kb_id:kb_id}))
    }


    function handleOptimizeIndexesAsk(knowledge_base){
        //TODO::add handleOptimizeIndexesAsk
        console.log("handleOptimizeIndexesAsk",knowledge_base)
    }


    return(
        <div className="kb-page">
            { isVisible() &&
            <div>
                <div className="d-flex justify-content-beteween w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="form-group me-2">
                            <input type="text" placeholder={"Filter..."} className="form-control"/>
                        </div>
                        <div className="form-group me-2">
                            <select  placeholder={"Filter"} className="form-select filter-text-width">
                                <option value="alphabetical">Alphabetical</option>
                                <option value="">Recently added</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group col ms-auto">
                        {organisation_id && organisation_id.length > 0 &&
                            <button onClick={() => handleAddForm()} className={"btn btn-primary text-nowrap"}>+ Add Knowledge Base</button>
                        }
                    </div>
                </div>
                
                <div>
                    <table className="table">
                        <thead>
                        <tr>
                            <td></td>
                            <td className="small text-black-50 px-4">Knowledge Base</td>
                            <td className="small text-black-50 px-4">Email Queries</td>
                            <td></td>
                        </tr>
                        </thead>
                        <tbody>

                        {/* SIVA: active row example - start */}
                        <tr className="selected-kb">
                            <td className="pt-3 ps-4 pe-0 pb-3 active-marker">
                                <img src="../images/active-marker.svg"></img>
                            </td>
                            <td className="pt-3 px-4 pb-3">
                                <div className="kb-label">Selected KB</div>
                            </td>
                            <td className="pt-3 px-4 pb-3 fw-light">
                                <div className="kb-label">example@email.co.nz</div>
                            </td>

                            <td className="pt-3 px-4 pb-0">
                                <div className="link-button" >
                                    <button title="edit knowledge base" className={"btn text-primary btn-sm"}>Edit</button>
                                    <button title="remove knowledge base" className={"btn text-danger btn-sm"}>Delete</button>
                                    <button title="view knowledge base ids" className={"btn text-primary btn-sm"}>View Ids</button>
                                    <button title="optimize indexes" className={"btn text-sprimary btn-sm"}>Optimize indexes</button>

                                </div>
                            </td>
                        </tr>
                        {/* end */}

                        {
                            getKnowledgeBases().map((knowledge_base) => {
                                return (
                                    <tr key={knowledge_base.kbId}>
                                        <td className="pt-3 ps-4 pe-0 pb-3"></td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div className="kb-label" onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.name}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3 fw-light">
                                            <div className="kb-label" onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.email}</div>
                                        </td>

                                        <td className="pt-3 px-4 pb-0">
                                            <div className="link-button" >
                                                <button title="edit knowledge base" onClick={() => handleEditForm(knowledge_base.kbId)}  className={"btn text-primary btn-sm"}>Edit</button>
                                                <button title="remove knowledge base" onClick={() => handleDeleteForm(knowledge_base.kbId)}  className={"btn text-danger btn-sm"}>Delete</button>
                                                <button title="view knowledge base ids" onClick={() => handleViewIds(knowledge_base.kbId)}  className={"btn text-primary btn-sm"}>View Ids</button>
                                                <button title="optimize indexes" onClick={() => handleOptimizeIndexesAsk(knowledge_base)}  className={"btn text-sprimary btn-sm"}>Optimize indexes</button>

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
                        rowsPerPage={kb_page_size}
                        page={kb_page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setKbPage(page)}
                        onChangeRowsPerPage={(rows) => setKbPageSize(rows)}
                    />

                </div>

                {/*//TODO::edit kb - move this to a new file*/}
                {
                }

            </div>
            }
        </div>

    )
}

