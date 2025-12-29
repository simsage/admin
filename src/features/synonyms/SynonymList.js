import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";

import {Pagination} from "../../common/pagination";
import {
    loadSynonyms,
    showAddSynonymForm,
    showEditSynonymForm,
    showDeleteSynonymForm, showImportSynonymForm,
} from "./synonymSlice";
import {SynonymEdit} from "./SynonymEdit";
import SynonymDeleteAsk from "./SynonymDeleteAsk";
import api from "../../common/api";
import {SynonymImport} from "./SynonymImport";
import InfoTooltip from "../../components/InfoTooltip";

export default function SynonymsHome() {

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.synonymReducer.data_status)
    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms) ?? 0
    const synonyms_busy = useSelector((state)=>state.synonymReducer.synonyms_busy)

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
        data.filter = filter
        data.pageSize = page_size
        dispatch(loadSynonyms({session_id, data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now", page, page_size])


    function handlePageChange(next_page){
        if (next_page > page) {
            // last list item is used for next page
            const last_row = synonym_list.slice(-1)[0]
            const temp_last_id = last_row['id']
            setPrevID(temp_last_id);
            setPageHistory([...page_history,{page:next_page,id:prev_id}]);

        } else {
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

    function editSynonym(s) {
       dispatch(showEditSynonymForm({show:true, syn: s}))
    }

    function newSynonym() {
        dispatch(showAddSynonymForm(true));
    }

    function importSynonyms() {
        dispatch(showImportSynonymForm())
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
        if (e) e.preventDefault()
        setPrevID(0)
        setPageHistory([])
        setPage(0)
        data.filter = filter
        data.pageSize = page_size
        dispatch(loadSynonyms({session_id, data}));
    }


    return (
        <div className="section px-5 pt-4">

            <SynonymImport />

            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="d-flex form-group me-2">
                        <input
                            type="text"
                            placeholder={"Search Synonym..."}
                            autoFocus={true}
                            className={"form-control me-2 filter-search-input "}
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
                    <div className="btn" onClick={(e) => filterRecords(e)} >
                        <img src={REFRESH_IMAGE} className="refresh-image" alt="refresh" title="refresh list of synonyms" />
                    </div>
                    <button className="btn btn-outline-primary text-nowrap me-2"
                            disabled={synonyms_busy}
                            onClick={() => importSynonyms()}>
                        Import Synonyms
                    </button>
                    <button className="btn btn-primary text-nowrap"
                            disabled={synonyms_busy}
                            onClick={() => newSynonym()}>
                        + Add Synonym
                    </button>
                </div>
            </div>

            {
                isVisible() &&
                <div>
                    <table className={theme === "light" ? "table" : "table-dark"}>
                        <thead>
                        <tr>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4 synonym-column-width"}>
                                Synonyms
                                <InfoTooltip
                                    text="Here you can define synonyms and other relationships between words.  Synonyms are not case sensitive (use lower-case).  Here you can define words that are related (be it exactly, or loosely)."
                                    placement="right"
                                />
                            </td>
                            <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getSynonymList().map((synonym) => {
                                return (
                                    <tr key={synonym.id}>
                                        <td className="pt-3 px-4 pb-2">
                                            <div className="d-flex flex-wrap">
                                            {synonym.words && synonym.words.split(',').map((word, index)=>{
                                                return <div key={word + "_" + index} className="small table-pill px-3 py-1 me-2 mb-2 rounded-pill text-nowrap">{word}</div>
                                            })
                                            }
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

                        </tbody>

                    </table>


                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
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
