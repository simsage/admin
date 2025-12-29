import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {
    loadSemantics,
    showAddSemanticForm,
    showDeleteSemanticAsk,
    showEditSemanticForm,
    showImportSemanticsForm
} from "./semanticSlice";
import {SemanticEdit} from "./SemanticEdit";
import SemanticDeleteAsk from "./SemanticDeleteAsk";
import api from "../../common/api";
import {SemanticsImport} from "./SemanticsImport";
import InfoTooltip from "../../components/InfoTooltip";


export default function SemanticsHome() {
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.semanticReducer.data_status)
    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    const semantic_list = useSelector((state) => state.semanticReducer.semantic_list);
    const num_semantics = useSelector((state) => state.semanticReducer.num_semantics);
    const semantics_busy = useSelector((state) => state.semanticReducer.semantics_busy);

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);
    const [semantic_filter,setSemanticFilter] = useState('');

    const [page_history,setPageHistory] = useState([])
    const [prev_word,setPrevWord] = useState(0)

    const dispatch = useDispatch();

    let data = {
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": page_size,
        "prevWord": prev_word,
        "filter": "",
    };

//load semantics
    useEffect(() => {
        dispatch(loadSemantics({ session_id, data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now" ,page, page_size ,selected_organisation_id, selected_knowledge_base_id])

    function importSemantics() {
        dispatch(showImportSemanticsForm())
    }

    function handlePageChange(next_page){
        if(next_page > page){
            // last list item is used for next page
            const last_row = semantic_list.slice(-1)[0]
            const temp_last_word = last_row['word']
            setPrevWord(temp_last_word);
            setPageHistory([...page_history, {page: next_page, word: prev_word}]);
        }else{
            const temp_prev_row = page_history.slice(-1)
            const temp_word = temp_prev_row && temp_prev_row.length === 1?temp_prev_row[0]["word"]:0
            setPrevWord(temp_word);
            setPageHistory([...page_history.slice(0,-1)]);
        }
        setPage(next_page);
    }


    function handlePageSizeChange(row){
        setPageHistory([])
        setPrevWord(0)
        setPage(0)
        setPageSize(row)
    }


    function getSemanticList() {
        return semantic_list ?? [];
    }

    function filterSemantic(e) {
        if (e) e.preventDefault()
        data.filter = semantic_filter
        data.pageSize = page_size
        dispatch(loadSemantics({ session_id, data }));
    }

    const handleRefresh = () => {
        if (!semantics_busy) {
            dispatch(loadSemantics({session_id, data}))
        }
    }

    function handleEditSemantic(semantic) {
        dispatch(showEditSemanticForm( {semantic: semantic}))
    }

    function handleAddSemantic() {
        dispatch(showAddSemanticForm({show: true}));
    }

    function deleteSemanticAsk(semantic) {
        dispatch(showDeleteSemanticAsk({show:true, semantic: semantic}));
    }


    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    return (
        <div className="section px-5 pt-4">

            <SemanticsImport />

            <div>

                <div className="d-flex justify-content-between w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="d-flex form-group me-2">
                            <input
                                type="text"
                                placeholder={"Search for a Word..."}
                                title={"these words are case-sensitive (e.g. Paris is a capital)"}
                                autoFocus={true}
                                className={"form-control me-2 filter-search-input "}
                                value={semantic_filter}
                                onChange={(e) => {setSemanticFilter(e.target.value)}}
                                onKeyDown={(e) => {if(e.key === 'Enter') filterSemantic(e)}}
                            />
                            <button className="btn btn-secondary"
                                    onClick={() => filterSemantic()}
                                    title="search" >Search</button>
                        </div>
                    </div>

                    <div className="form-group d-flex col ms-auto">
                        <div className="btn" onClick={() => handleRefresh()}>
                            <img src={REFRESH_IMAGE} className="refresh-image" alt="refresh" title="refresh list of semantics" />
                        </div>
                        <button className="btn btn-outline-primary text-nowrap me-2"
                                disabled={semantics_busy}
                                onClick={() => importSemantics()}>
                            Import Semantics
                        </button>
                        <button className="btn btn-primary text-nowrap"
                                disabled={semantics_busy}
                                onClick={() => handleAddSemantic()}>
                            + Add Semantic
                        </button>
                    </div>
                </div>

                {
                    isVisible() &&
                    <div>
                        <table className={theme === "light" ? "table" : "table-dark"}>
                            <thead>
                            <tr className=''>
                                <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>
                                    Word
                                    <InfoTooltip
                                        text="Semantics are generalizations.  You can for instance define 'Paris' as a 'city', and then search for 'entity: city' in SimSage.  This applies to whole categories of words.  SimSage has a large set of semantics built in.  Search for your word first. Semantic words are case sensitive.  The semantic itself should be lower-case (e.g. 'city')."
                                        placement="right"
                                    />
                                </td>
                                <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Semantic</td>
                                <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getSemanticList().map((semantic) => {
                                    return (
                                        <tr key={semantic.word + ":" + semantic.semantic}>
                                            <td className="pt-3 px-4 pb-2">
                                                <div>{semantic.word}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-2">
                                                <div className="d-flex">
                                                    <div className="small table-pill px-3 py-1 me-2 mb-2 rounded-pill">{semantic.semantic}</div>
                                                </div>
                                            </td>
                                            <td className="pt-3 px-4 pb-0">
                                                <div className="d-flex  justify-content-end">
                                                    <button className="btn text-primary btn-sm" title="edit semantic"
                                                            onClick={() => handleEditSemantic(semantic)}>Edit
                                                    </button> &nbsp;
                                                    <button className="btn text-danger btn-sm"  title="remove semantic"
                                                            onClick={() => deleteSemanticAsk(semantic)}>Delete
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
                            count={num_semantics}
                            rowsPerPage={page_size}
                            page={page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => handlePageChange(page)}
                            onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                        />
                    </div>
                }

            </div>

            <SemanticEdit />
            <SemanticDeleteAsk />

        </div>
    )

}