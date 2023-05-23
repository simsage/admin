import React, {useState,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadTextToSearch, showAddForm, showDeleteForm, showEditForm, showTestForm} from "./TextToSearchSlice";
import {Pagination} from "../../common/pagination";
import {TextToSearchEdit} from "./TextToSearchEdit";
import TextToSearchDeleteAsk from "./TextToSearchDeleteAsk";
import TextToSearchTest from "./TextToSearchTest";
import api from "../../common/api";


const TextToSearchList = () => {

    const dispatch = useDispatch();
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session)
    const session_id = session.id
    const load_data = useSelector((state) => state.textToSearchReducer.data_status)

    const text_to_search_list = useSelector( (state) => state.textToSearchReducer.text_to_search_list)
    const num_of_text_to_search = useSelector((state) => state.textToSearchReducer.num_of_text_to_search)

    const [filter, setFilter] = useState('');
    const [ts_page_size, setPageSize] = useState(api.initial_page_size);
    const [ts_page, setPage] = useState(api.initial_page)

    // let prev_obj = text_to_search_list.slice(-1)[0]
    // let prev_word = ts_page !== 0 ? prev_obj['searchPart']:""

    const [page_history,setPageHistory] = useState([])
    const [prev_word,setPrevWord] = useState("")

    console.log("semantic_page",page_history)
    console.log("semantic_page",prev_word)


    let data = {
        "filter": filter,
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": ts_page_size,
        "prevWord": prev_word
    };

    useEffect( () => {
        dispatch(loadTextToSearch({session_id, data}))
    }, [load_data === "load_now", ts_page, ts_page_size, selected_knowledge_base_id])


    function handlePageChange(next_page){
        if(next_page > ts_page){
            // last list item is used for next page
            const last_row = text_to_search_list.slice(-1)[0]
            const temp_last_word = last_row['searchPart']
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
        setPrevWord("")
        setPage(0)
        setPageSize(row)
    }


    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function getTextToSearch() {
        return text_to_search_list ? text_to_search_list : [];
    }

    function handleFilter(e) {
        e.preventDefault()
        console.log('filtering', data)
        dispatch(loadTextToSearch({session_id, data}))
    }

    function handleEdit(obj) {
        console.log('edit', obj);
        dispatch(showEditForm(obj));
    }

    function handleAdd(e) {
        dispatch(showAddForm());
    }

    function handleTest() {
        dispatch(showTestForm());
    }

    function handleDelete(obj) {
        console.log('deleting: ', obj);
        dispatch(showDeleteForm(obj));
        setFilter('');
    }


    return (
        <div className="section px-5 pt-4">
            <div className="synset-page">
                <div className="d-flex justify-content-between w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="d-flex form-group me-2">
                            <input
                                type="text"
                                placeholder={"Find Search Part..."}
                                autoFocus={true}
                                className={"form-control me-2 filter-search-input " + theme}
                                value={filter}
                                onChange={(e) => {setFilter(e.target.value)}}
                                onKeyDown={(e) => {if(e.key === 'Enter') handleFilter(e)} }
                            />
                            <button className="btn btn-secondary" title="search" onClick={(e)=>handleFilter(e)}>
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="form-group d-flex ms-auto">
                        <button className="btn btn-outline-primary text-nowrap ms-2" onClick={(e) => handleTest()}>
                            Test Search Parts
                        </button>

                        <button className="btn btn-primary text-nowrap ms-2" onClick={(e) => handleAdd(e)}>
                            + Add Search Part
                        </button>
                    </div>
                </div>


                {
                    isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                            <tr className=''>
                                <td className='small text-black-50 px-4'>Search Part</td>
                                <td className='small text-black-50 px-4'>Sub</td>
                                <td className='small text-black-50 px-4'>Match Words</td>
                                <td className='small text-black-50 px-4'></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getTextToSearch().map((obj) => {
                                    return (
                                        <tr key={obj.searchPart}>
                                            <td className="pt-3 px-4 pb-3">
                                                <div className="synset-label">{obj.searchPart}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-3">
                                                <div className="synset-label">{obj.type}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-3">
                                                {obj.matchWords && obj.matchWords.join(" , ")}
                                            </td>
                                            <td className="pt-3 px-4 pb-0">
                                                <div className="d-flex  justify-content-end">
                                                    <button
                                                            className="btn text-primary btn-sm"
                                                            title="edit syn-set"
                                                            onClick={() => handleEdit(obj)}
                                                    >Edit
                                                    </button>
                                                    &nbsp;
                                                    <button
                                                        className="btn text-danger btn-sm"
                                                        title="remove syn-set"
                                                        onClick={() => handleDelete(obj)}
                                                    >
                                                        Delete
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
                            count={num_of_text_to_search}
                            rowsPerPage={ts_page_size}
                            page={ts_page}
                            onChangePage={(page) => handlePageChange(page)}
                            onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                        />

                    </div>
                }

            </div>
            <TextToSearchEdit/>
            <TextToSearchDeleteAsk/>
            <TextToSearchTest/>
        </div>
    );
};

export default TextToSearchList;