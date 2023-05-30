import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {loadSemantics, showAddSemanticForm, showDeleteSemanticAsk, showEditSemanticForm} from "./semanticSlice";
import {SemanticEdit} from "./SemanticEdit";
import SemanticDeleteAsk from "./SemanticDeleteAsk";
import api from "../../common/api";


export default function SemanticsHome() {
    // const title = "Semantics";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.semanticReducer.data_status)

    const semantic_list = useSelector((state) => state.semanticReducer.semantic_list);
    const num_semantics = useSelector((state) => state.semanticReducer.num_semantics);

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);
    const [semantic_filter,setSemanticFilter] = useState();

    const [page_history,setPageHistory] = useState([])
    const [prev_word,setPrevWord] = useState(0)

    const dispatch = useDispatch();

console.log("page",page_history)
console.log("page",prev_word)

    // let prev_semantic_set = semantic_list.slice(-1)[0]
    // let prev_word = page != 0 ? prev_semantic_set['word']:0
    // useEffect(() => {
    //     console.log("page",page)
    //     console.log("prev_semantic_set1",prev_semantic_set)
    //
    // },[page,page!=0])


    // console.log("page num",page,prev_word)
    let data = {
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": page_size,
        "prevWord": prev_word,
        "filter": "",
    };

//load semantics
    useEffect(() => {
        console.log("useEffect dataload", data)
        dispatch(loadSemantics({ session_id, data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now" ,page, page_size ,selected_organisation_id, selected_knowledge_base_id])



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


    function getSemanticList()
    {
        return semantic_list;
    }

    function filterSemantic(e) {
        e.preventDefault()
        data.filter = semantic_filter
        data.pageSize = page_size
        dispatch(loadSemantics({ session_id, data }));
    }

    // function handleSearchTextKeydown(event)
    // {
    //     if (event.key === "Enter") {
    //         filterSemantic();
    //     }
    // }

    function handleEditSemantic(semantic)
    {
    dispatch(showEditSemanticForm( {session_id, semantic}))
    }

    function handleAddSemantic() {
        dispatch(showAddSemanticForm(true));
    }
    function deleteSemanticAsk(semantic) {
        console.log(`deleting...` , semantic)
        dispatch(showDeleteSemanticAsk({show:true, semantic: semantic}));
    }


    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    return (
        <div className="section px-5 pt-4">
            <div>

                <div className="d-flex justify-content-between w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="d-flex form-group me-2">
                            <input
                                type="text"
                                placeholder={"Search Semantic..."}
                                autoFocus={true}
                                className={"form-control me-2 filter-search-input " + theme}
                                value={semantic_filter}
                                onChange={(e) => {setSemanticFilter(e.target.value)}}
                                onKeyDown={(e) => {if(e.key === 'Enter') filterSemantic(e)}}
                            />
                            <button className="btn btn-secondary"
                                    onClick={() => filterSemantic()}
                                    src="images/dark-magnifying-glass.svg" title="search" alt="search">Search</button>
                        </div>
                    </div>

                    <div className="form-group col ms-auto">
                        <button className="btn btn-primary text-nowrap" onClick={() => handleAddSemantic()}>
                            + Add Semantic
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
                                <td className='small text-black-50 px-4'>Word</td>
                                <td className='small text-black-50 px-4'>Semantic</td>
                                <td className='small text-black-50 px-4'></td>
                            </tr>
                            </thead>
                            <tbody>
                            {/*{getSemanticList().length === 0 &&*/}
                            {/*    <tr>*/}
                            {/*        <td className="pt-3 px-4 pb-2" colSpan={3}>*/}
                            {/*            <div></div>*/}
                            {/*        </td>*/}
                            {/*    </tr>*/}
                            {/*}*/}
                            {
                                getSemanticList().map((semantic) => {
                                    return (
                                        <tr key={semantic.word + ":" + semantic.semantic}>
                                            <td className="pt-3 px-4 pb-2">
                                                <div>{semantic.word}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-2">
                                                <div className="d-flex">
                                                    <div className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill">{semantic.semantic}</div>
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
                            {/* <tr>
                                <td/>
                                <td/>
                                <td>
                                    {isVisible() &&
                                        <button className="btn btn-outline-primary" title="new semantic" onClick={() => handleAddSemantic()}>new semantic</button>
                                    }
                                </td>
                            </tr> */}
                            </tbody>
                        </table>



                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
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