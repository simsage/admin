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
    const [semantic_page_size, setSemanticPageSize] = useState(useSelector((state) => state.semanticReducer.semantic_page_size));
    const [semantic_page, setSemanticPage] = useState(useSelector((state) => state.semanticReducer.semantic_page));
    const [semantic_filter,setSemanticFilter] = useState();

    const dispatch = useDispatch();

    let data = {
        "filter": "",
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": semantic_page_size,
        "prevWord": 0
    };


    useEffect(() => {
        dispatch(loadSemantics({ session_id, data }));
    }, [load_data === "load_now" , semantic_page_size ,selected_organisation_id, selected_knowledge_base_id])


    function getSemanticList()
    {
        return semantic_list?semantic_list:[];
    }

    function filterSemantic() {
            data.filter = semantic_filter
            data.pageSize = semantic_page_size
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
                {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find semantics </span>
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
                                    src="../images/dark-magnifying-glass.svg" title="search" alt="search">search</button>
                        </span>
                    </div>
                }

                <br clear="both"/>

                {
                    isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                            <tr className='table-header'>
                                <th className='table-header'>word</th>
                                <th className='table-header'>semantic</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getSemanticList().map((semantic) => {
                                    return (
                                        <tr key={semantic.word + ":" + semantic.semantic}>
                                            <td>
                                                <div>{semantic.word}</div>
                                            </td>
                                            <td>
                                                <div>{semantic.semantic}</div>
                                            </td>
                                            <td>
                                                <button className="btn btn-secondary" title="edit semantic"
                                                        onClick={() => handleEditSemantic(semantic)}>edit
                                                </button> &nbsp;
                                                <button className="btn btn-secondary"  title="remove semantic"
                                                        onClick={() => deleteSemanticAsk(semantic)}>remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td/>
                                <td/>
                                <td>
                                    {isVisible() &&
                                        <button className="btn btn-outline-primary" title="new semantic" onClick={() => handleAddSemantic()}>new semantic</button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>



                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={num_semantics}
                            rowsPerPage={semantic_page_size}
                            page={semantic_page}
                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                            onChangePage={(page) => setSemanticPage(page)}
                            onChangeRowsPerPage={(rows) => setSemanticPageSize(rows)}
                        />
                    </div>
                }

            </div>
            <SemanticEdit />
            <SemanticDeleteAsk />
        </div>
    )

}