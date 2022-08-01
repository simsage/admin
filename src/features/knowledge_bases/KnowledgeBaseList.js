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

                <div>
                    <table className="table">
                        <thead>
                        <tr className='table-header'>
                            <th className='table-header table-width-20'>Knowledge Base</th>
                            <th className='table-header table-width-20'>Email Queries</th>
                            <th className='table-header'>actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getKnowledgeBases().map((knowledge_base) => {
                                return (
                                    <tr key={knowledge_base.kbId}>
                                        <td>
                                            <div className="kb-label" onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.name}</div>
                                        </td>
                                        <td>
                                            <div className="kb-label" onClick={() => dispatch(setSelectedKB(knowledge_base.kbId))}>{knowledge_base.email}</div>
                                        </td>

                                        <td>
                                            <div className="link-button" >
                                                <button title="edit knowledge base" onClick={() => handleEditForm(knowledge_base.kbId)}  className={"btn btn-primary"}>Edit</button>&nbsp; &nbsp;
                                                <button title="remove knowledge base" onClick={() => handleDeleteForm(knowledge_base.kbId)}  className={"btn btn-outline-danger"}>Delete</button>&nbsp; &nbsp;
                                                <button title="view knowledge base ids" onClick={() => handleViewIds(knowledge_base.kbId)}  className={"btn btn-outline-primary"}>View Ids</button>&nbsp; &nbsp;
                                                <button title="optimize indexes" onClick={() => handleOptimizeIndexesAsk(knowledge_base)}  className={"btn btn-outline-primary"}>Optimize indexes</button>&nbsp; &nbsp;

                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td/>
                            <td/>
                            <td>
                                {organisation_id && organisation_id.length > 0 &&
                                    <button onClick={() => handleAddForm()} className={"btn btn-primary"}>Add New</button>
                                // <div className="kb-image-button" >
                                //
                                //     <img
                                //         className="image-size" src="../images/add.svg" title="add new user"
                                //         alt="add new kb"/></div>
                                }
                            </td>
                        </tr>
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

