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
import SynonymFilter from "./SynonymFilter";
import {loadSemantics} from "../semantics/semanticSlice";

export default function SynonymsHome(props) {

    const title = "Synonyms";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const load_data = useSelector( (state) => state.synonymReducer.data_status)

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms)
    const [synonym_page_size,setSynonymPageSize] = useState(useSelector((state)=>state.synonymReducer.synonym_page_size))
    const [synonym_page,setSynonymPage] = useState(useSelector((state)=>state.synonymReducer.synonym_page))
    const [filter,setFilter] = useState('')

    const dispatch = useDispatch();

    let prev_synonym_set = synonym_list.slice(-1)[0]
    let prev_id = synonym_page != 0 ? prev_synonym_set['id']:0

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": prev_id,
        "filter": '',
        "pageSize": synonym_page_size
    };

    useEffect(() => {
        dispatch(loadSynonyms({session_id, data }));
    }, [load_data === "load_now", synonym_page_size,synonym_page])



    function getSynonymList() {
        return synonym_list ? synonym_list : [];
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

    function handleAddNew(){
        dispatch(showAddSynonymForm(true));
    }

    // function handleSearchFilter(event) {
    //     let filter = event.target.value;
    //     if(filter.length > 2){
    //         console.log("handleSearchTextKeydown",filter)
    //         // setFilter(filter)
    //         data = {...data,  ...{"filter": filter,}}
    //         dispatch(loadSynonyms({session_id, data }));
    //     }
    // }

    function handleSearchTextKeydown(event)
    {
        if (event.key === "Enter") {
            filterRecords();
        }
    }

    function filterRecords() {
        data.filter = filter
        data.pageSize = synonym_page_size
        dispatch(loadSynonyms({ session_id, data }));
    }


    return (
        <div className="section px-5 pt-4">
            {
                isVisible() &&
                <div className="filter-find-box">
                    <span className="filter-label">find </span>
                    <span className="filter-find-text">
                        <input type="text" value={filter} autoFocus={true}
                                className={"filter-text-width " + theme}
                                onKeyDown={(event) => handleSearchTextKeydown(event)}
                                onChange={(event) => {
                                    setFilter(event.target.value);
                                }}/>
                    </span> &nbsp;
                    <span className="filter-find-image">
                        <button className="btn btn-secondary"
                                onClick={() => filterRecords()}
                                src="../images/dark-magnifying-glass.svg" title="search" alt="search">search</button>
                    </span>
                    <span className="ms-4 fw-bolder" style={{color: "hotPink"}}> &#8592; Couldn't get the filter below to work without a button</span>
                </div>
            }
            <br/><br/><br/>

            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} autoFocus={true} className={"form-control " + theme} value={filter} onChange={(e) => {setFilter(e.target.value)}}
                        />
                    </div>
                </div>

                <div className="form-group col ms-auto">
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
                            <td className='small text-black-50 px-4'>ID</td>
                            <td className='small text-black-50 px-4 synonym-column-width'>Synonyms</td>
                            <td className='small text-black-50 px-4'></td>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            getSynonymList().map((synonym) => {
                                return (
                                    <tr key={synonym.id}>
                                        <td className="pt-3 px-4 pb-3">
                                            <div>{synonym.id}</div>
                                        </td>
                                        <td className="pt-3 px-4 pb-3">
                                            <div>{synonym.words}</div>
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
                        rowsPerPage={synonym_page_size}
                        page={synonym_page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setSynonymPage(page)}
                        onChangeRowsPerPage={(rows) => setSynonymPageSize(rows)}
                    />

                </div>
            }
            <SynonymEdit />
            <SynonymDeleteAsk />
        </div>
    )
}