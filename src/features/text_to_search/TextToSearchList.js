import React, {useState,useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadTextToSearch} from "./TextToSearchSlice";


const TextToSearchList = () => {

    const dispatch = useDispatch();
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session)
    const session_id = session.id
    const status = useSelector((state) => state.textToSearchReducer.status)
    const load_data = useSelector((state) => state.textToSearchReducer.data_status)

    const text_to_search_list = useSelector( (state) => state.textToSearchReducer.text_to_search_list)
    const num_of_text_to_search = useSelector((state) => state.textToSearchReducer.num_of_text_to_search)


    const [filter, setFilter] = useState('');

    let data = {
        "filter": filter,
        "kbId": selected_knowledge_base_id,
        "organisationId": selected_organisation_id,
        "pageSize": 10,
        "prevWord": ""
    };

    useEffect( () => {
        dispatch(loadTextToSearch({session_id, data}))
    }, [load_data === "load_now"])

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function getTextToSearch() {
        return text_to_search_list ? text_to_search_list : [];
    }


    return (
        <div className="section px-5 pt-4">
            <div className="synset-page">
                <div className="d-flex justify-content-between w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="d-flex form-group me-2">
                            <input type="text" placeholder={"Find Search Part..."} autoFocus={true} className={"form-control me-2 filter-search-input " + theme} value={filter} onChange={(e) => {setFilter(e.target.value)}}
                            />
                            <button className="btn btn-secondary" title="search">
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="form-group d-flex ms-auto">
                        <button className="btn btn-primary text-nowrap ms-2">
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
                                                            className="btn text-primary btn-sm" title="edit syn-set">Edit
                                                    </button>
                                                    &nbsp;
                                                    <button
                                                        className="btn text-danger btn-sm"
                                                        title="remove syn-set"
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

                        {/*<Pagination*/}
                        {/*    rowsPerPageOptions={[5, 10, 25]}*/}
                        {/*    theme={theme}*/}
                        {/*    component="div"*/}
                        {/*    count={synset_total_size}*/}
                        {/*    rowsPerPage={synset_page_size}*/}
                        {/*    page={synset_page}*/}
                        {/*    onChangePage={(page) => setSynSetPage(page)}*/}
                        {/*    onChangeRowsPerPage={(rows) => setSynSetPageSize(rows)}*/}
                        {/*/>*/}

                    </div>
                }

            </div>
        </div>
    );
};

export default TextToSearchList;