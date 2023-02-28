import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {loadSemantics, showAddSemanticForm, showDeleteSemanticAsk, showEditSemanticForm} from "./semanticSlice";
import {SemanticEdit} from "./SemanticEdit";
import SemanticDeleteAsk from "./SemanticDeleteAsk";


export default function SemanticsHome(props) {
    const title = "Semantics";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.semanticReducer.data_status)

    const semantic_list = useSelector((state) => state.semanticReducer.semantic_list);
    const num_semantics = useSelector((state) => state.semanticReducer.num_semantics);

    const [page_size, setPageSize] = useState(useSelector((state) => state.semanticReducer.semantic_page_size));
    const [page, setPage] = useState(useSelector((state) => state.semanticReducer.semantic_page));
    const [semantic_filter,setSemanticFilter] = useState();
    // let [prev_word, setPrevWord] = useState('');

    const dispatch = useDispatch();



    let prev_semantic_set = semantic_list.slice(-1)[0]
    let prev_word = page != 0 ? prev_semantic_set['word']:0
    // useEffect(() => {
    //     console.log("Page",page)
    //     console.log("prev_semantic_set1",prev_semantic_set)
    //
    // },[page,page!=0])


    console.log("page num",page,prev_word)
    let data = {
        "filter": "",
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": page_size,
        "prevWord": prev_word
    };

//load semantics
    useEffect(() => {
        console.log("useEffect dataload", data)
        dispatch(loadSemantics({ session_id, data }));
    }, [load_data === "load_now" ,page, page_size ,selected_organisation_id, selected_knowledge_base_id])



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

    function handleSearchTextKeydown(event)
    {
        if (event.key === "Enter") {
            filterSemantic();
        }
    }

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
                {/* {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find </span>
                        <span className="filter-find-text">
                            <input type="text" value={semantic_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyDown={(event) => handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       setSemanticFilter(event.target.value);
                                   }}/>
                        </span> &nbsp;
                        <span className="filter-find-image">
                            <button className="btn btn-secondary"
                                    onClick={() => filterSemantic()}
                                    src="../images/dark-magnifying-glass.svg" title="search" alt="search">Search</button>
                        </span>
                </div>
            } */}

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
                                    src="../images/dark-magnifying-glass.svg" title="search" alt="search">Search</button>
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
                            {
                                getSemanticList().map((semantic) => {
                                    return (
                                        <tr key={semantic.word + ":" + semantic.semantic}>
                                            <td className="pt-3 px-4 pb-3">
                                                <div>{semantic.word}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-2 d-flex">
                                                <div className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill">{semantic.semantic}</div>
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
                            onChangePage={(page) => setPage(page)}
                            onChangeRowsPerPage={(rows) => setPageSize(rows)}
                        />
                    </div>
                }

            </div>
            <SemanticEdit />
            <SemanticDeleteAsk />
        </div>
    )

}