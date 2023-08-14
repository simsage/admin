import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";

import {Pagination} from "../../common/pagination";
import {
    loadSynonyms,
    showAddSynonymForm,
    showEditSynonymForm,
    showDeleteSynonymForm,
} from "./synonymSlice";
import {SynonymEdit} from "./SynonymEdit";
import SynonymDeleteAsk from "./SynonymDeleteAsk";
import api from "../../common/api";

export default function SynonymsHome() {

    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.synonymReducer.data_status)

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms)

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const [filter,setFilter] = useState('')

    const [page_history,setPageHistory] = useState([])
    const [prev_id,setPrevID] = useState(0)

    const dispatch = useDispatch();

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": prev_id,
        "filter": '',
        "pageSize": page_size
    }


    useEffect(() => {
            dispatch(loadSynonyms({session_id, data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now",page, page_size])


    function handlePageChange(next_page){
        if(next_page > page){
            // last list item is used for next page
            const last_row = synonym_list.slice(-1)[0]
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

    function getSynonymList() {
        return synonym_list ? synonym_list : [];
    }
    const handleRefresh = () => {
        dispatch(loadSynonyms({session_id, data }))
    }

    //
    // function handleKeyDown(event) {
    //     if (event.key === "Enter") {
    //         filterSynonyms()
    //     }
    // }
    // function filterSynonyms() {
    //
    //     // data.filter = synonym_filter
    //     // dispatch(loadSynonyms( {session_id, data } ))
    // }

    function editSynonym(s) {
       dispatch(showEditSynonymForm({show:true, syn: s}))
    }

    function newSynonym() {
        dispatch(showAddSynonymForm(true));
    }

    function deleteSynonymAsk(synonym) {
        dispatch(showDeleteSynonymForm({show: true, synonym: synonym}))
    }

     function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }


    function filterRecords(e) {
        e.preventDefault()
        data.filter = filter
        data.pageSize = page_size
        dispatch(loadSynonyms({ session_id, data }));
    }


    return (
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="d-flex form-group me-2">
                        <input
                            type="text"
                            placeholder={"Search Synonym..."}
                            autoFocus={true}
                            className={"form-control me-2 filter-search-input " + theme}
                            value={filter}
                            onChange={(e) => {setFilter(e.target.value)}}
                            onKeyDown={(e) => {if(e.key === 'Enter') filterRecords(e)}}
                        />
                        <button className="btn btn-secondary"
                                onClick={(e) => filterRecords(e)}
                                title="search">Search</button>
                    </div>
                </div>

                <div className="form-group d-flex col ms-auto">
                    <div className="btn" onClick={() => handleRefresh()} >
                        <img src="images/refresh.svg" className="refresh-image" alt="refresh" title="refresh list of synonyms" />
                    </div>
                    <button className="btn btn-primary text-nowrap" onClick={() => newSynonym()}>
                        + Add Synonym
                    </button>
                </div>
            </div>

            {/* <br clear="both"/> */}
            {
                isVisible() &&
                <div>
                    <table className="table">
                        <thead>
                        <tr className=''>
                             {/*<td className='small text-black-50 px-4'>ID</td>*/}
                            <td className='small text-black-50 px-4 synonym-column-width'>Synonyms</td>
                            <td className='small text-black-50 px-4'></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getSynonymList().map((synonym) => {
                                return (
                                    <tr key={synonym.id}>
                                        {/*<td className="pt-3 px-4 pb-3">*/}
                                        {/*    <div>{synonym.id}</div>*/}
                                        {/*</td>*/}
                                        <td className="pt-3 px-4 pb-2">
                                            <div className="d-flex flex-wrap">
                                            {/*<div className="me-2">{synonym.words}</div>*/}
                                            {synonym.words && synonym.words.split(',').map((word)=>{
                                                return <div className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill text-nowrap">{word}</div>
                                            })

                                            }
                                            {/*<div className="small text-capitalize table-pill px-3 py-2 me-2 mb-2 rounded-pill">word1</div>*/}
                                            {/*<div className="small text-capitalize table-pill px-3 py-2 me-2 mb-2 rounded-pill">word2</div>*/}
                                            {/*<div className="small text-capitalize table-pill px-3 py-2 me-2 mb-2 rounded-pill">word3</div>*/}
                                            </div>
                                        </td>
                                        <td className="pt-3 px-4 pb-0">
                                            <div className="d-flex  justify-content-end">
                                                <button className="btn text-primary btn-sm" title="edit synonym" onClick={() => editSynonym(synonym)}>Edit</button> &nbsp;
                                                <button className="btn text-danger btn-sm" title="remove synonym" onClick={() => deleteSynonymAsk(synonym)}>Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        {/* <tr>
                            <td/>
                            <td/>
                            <td>
                                {isVisible() &&
                                    <button className="btn btn-outline-primary" title="add new synonym" onClick={() => newSynonym()}>new synonym</button>
                                }
                            </td>
                        </tr> */}

                        </tbody>

                    </table>


                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={num_synonyms}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => handlePageChange(page)}
                        onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                    />

                </div>
            }
            <SynonymEdit />
            <SynonymDeleteAsk />
        </div>
    )
}