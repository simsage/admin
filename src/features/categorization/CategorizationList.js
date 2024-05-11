import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";

import {Pagination} from "../../common/pagination";
import {
    loadCategorizations,
    showAddCategorizationForm,
    showEditCategorizationForm,
    showDeleteCategorizationForm,
} from "./categorizationSlice";
import api, {IMAGES} from "../../common/api";
import {CategorizationEdit} from "./CategorizationEdit";
import CategorizationDeleteAsk from "./CategorizationDeleteAsk";

export default function CategorizationList() {

    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.categorizationReducer.data_status)
    const {llm_model} = useSelector((state) => state.llmReducer)
    const has_llm = llm_model && (llm_model.llm === "gemini" || llm_model.llm === "openai")

    const categorization_list = useSelector((state)=>state.categorizationReducer.categorization_list)
    const num_categorizations = useSelector((state)=>state.categorizationReducer.num_categorizations)

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const [page_history,setPageHistory] = useState([])
    const [prev_id,setPrevID] = useState(0)

    const dispatch = useDispatch();

    useEffect(() => {
        if (selected_organisation_id && selected_knowledge_base_id) {
            dispatch(loadCategorizations({
                session_id: session_id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id,
                page: page, page_size: page_size
            }));
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }, [load_data === "load_now", page, page_size, session_id, selected_organisation_id, selected_knowledge_base_id])


    function handlePageChange(next_page){
        if(next_page > page){
            // last list item is used for next page
            const last_row = categorization_list.slice(-1)[0]
            const temp_last_id = last_row['id']
            setPrevID(temp_last_id);
            setPageHistory([...page_history,{page:next_page,id:prev_id}]);

        }else{
            const temp_prev_row = page_history.slice(-1)
            const temp_id = temp_prev_row && temp_prev_row.length === 1?temp_prev_row[0]["id"]:0
            setPrevID(temp_id);
            setPageHistory([...page_history.slice(0,-1)]);
        }
        setPage(next_page);
    }


    function handlePageSizeChange(row){
        setPageHistory([])
        setPrevID(0)
        setPage(0)
        setPageSize(row)
    }

    function getCategorizationList() {
        return categorization_list ? categorization_list : [];
    }
    const handleRefresh = () => {
        if (selected_organisation_id && selected_knowledge_base_id) {
            dispatch(loadCategorizations({
                session_id: session_id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id,
                page: page, page_size: page_size
            }));
        }
    }

    function editCategorization(s) {
       dispatch(showEditCategorizationForm({show:true, syn: s}))
    }

    function newCategorization() {
        dispatch(showAddCategorizationForm(true));
    }

    function deleteCategorizationAsk(categorization) {
        dispatch(showDeleteCategorizationForm({show: true, categorization: categorization}))
    }

     function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }


    return (
        <div className="section px-5 pt-4">
            {!has_llm &&
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <label className="small">Categorizations require an Large Language Model (LLM) to be set up in <i>&nbsp;AI set up&nbsp;</i> to operate.</label>
                </div>
            </div>
            }
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100" />
                <div className="form-group d-flex col ms-auto">
                    <div className="btn" onClick={() => handleRefresh()} >
                        <img src={IMAGES.REFRESH_IMAGE} className="refresh-image" alt="refresh" title="refresh list of categorizations" />
                    </div>
                    <button className="btn btn-primary text-nowrap" onClick={() => newCategorization()}>
                        + Add Categorization
                    </button>
                </div>
            </div>
            {
                isVisible() &&
                <div>
                    <table className="table">
                        <thead>
                        <tr className=''>
                            <td className='small text-black-50 px-4 categorization-column-width'>Categorizations</td>
                            <td className='small text-black-50 px-4'></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getCategorizationList().map((categorization) => {
                                return (
                                    <tr key={categorization.name}>
                                        <td className="pt-3 px-4 pb-2">
                                            <div className="d-flex flex-wrap">
                                                <div className="me-2">{categorization.name}</div>
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-0">
                                            <div className="d-flex  justify-content-end">
                                                <button className="btn text-primary btn-sm" title="edit categorization" onClick={() => editCategorization(categorization)}>Edit</button> &nbsp;
                                                <button className="btn text-danger btn-sm" title="remove categorization" onClick={() => deleteCategorizationAsk(categorization)}>Delete</button>
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
                        count={num_categorizations}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => handlePageChange(page)}
                        onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                    />

                </div>
            }
            <CategorizationEdit />
            <CategorizationDeleteAsk />
        </div>
    )
}