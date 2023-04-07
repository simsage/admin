import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {
    loadSynsets,
    showDeleteSynSetForm,
    showAddSynSetForm,
    showAddDefaultAskForm,
    noResultsMessage
} from "./synsetSlice";
import {showEditSynSetForm} from "../synsets/synsetSlice"
import SynsetEdit from "./SynsetEdit";
import SynsetDelete from "./SynsetDelete";
import SynsetDefault from "./SynsetDefault";

export default function SynsetList() {

    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const synset_list = useSelector((state) => state.synsetReducer.synset_list)
    const synset_total_size = useSelector((state) => state.synsetReducer.synset_total_size)
    const [synset_page_size, setSynSetPageSize] = useState(useSelector((state) => state.synsetReducer.synset_page_size));
    const [synset_page, setSynSetPage] = useState(useSelector((state) => state.synsetReducer.synset_page))
    let [synset_filter, setSynSetFilter] = useState('');

    const load_data = useSelector((state) => state.synsetReducer.data_status)

    let data = {
        session_id: session_id,
        organisation_id: selected_organisation_id,
        kb_id: selected_knowledge_base_id,
        page: synset_page,
        filter: synset_filter,
        page_size: synset_page_size
    };

    const dispatch = useDispatch();

    useEffect(() => {
        console.log(" useEffect load_data",load_data)
        console.log(" useEffect load_data",load_data)
        dispatch(loadSynsets(data));
    }, [load_data === 'load_now', synset_page, synset_page_size])

    // const handleFilterTextChange = (e) => {
    //     setSynSetFilter(e.target.value);
    // }
    //
    // const handleSearchTextKeydown = (e) => {
    //     if( e.key === "Enter") {
    //         dispatch(loadSynsets({
    //             session_id: session_id,
    //             organisation_id: selected_organisation_id,
    //             kb_id: selected_knowledge_base_id,
    //             page: synset_page,
    //             filter: synset_filter,
    //             page_size: synset_page_size
    //         }))
    //         dispatch(noResultsMessage(true))
    //         setSynSetFilter('');
    //     }
    // }

    // function handleSearchTextKeydown(event)
    // {
    //     if (event.key === "Enter") {
    //         setSynSetFilter('');
    //     }
    // }

    function filterRecords(e) {
        e.preventDefault()
        dispatch(loadSynsets(data));
        dispatch(noResultsMessage(true))
        setSynSetFilter('');
    }

    const handleEdit = (synset) => {
        dispatch(showEditSynSetForm({selected_synset: synset}));
    }

    const handleAddSynSet = () => {
        console.log("handleAddSynSet")
        dispatch(showAddSynSetForm());
    }

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function deleteSynSetAsk(s) {
        dispatch(showDeleteSynSetForm({selected_synset:s}))
    }

    //Legacy functions

    const handleAddDefaultSynSet = () => {
        console.log("handleAddSynSet")
        dispatch(showAddDefaultAskForm());
    }
    // function handleSynSetFilterKeydown(event) {
    //     //TODO: Add in filtering.
    // }

    // function findSynSets() {
    //     dispatch(loadSynsets({
    //         session_id: session_id,
    //         organisation_id: selected_organisation_id,
    //         kb_id: selected_knowledge_base_id,
    //         page: synset_page,
    //         filter: synset_filter,
    //         page_size: synset_page_size
    //     }))
    //     dispatch(noResultsMessage(true))
    //     setSynSetFilter('');
    // }

    function getSynSets() {
        return synset_list ? synset_list : [];
    }

    return (
        <div className="section px-5 pt-4">

            <div className="synset-page">

                {/* {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find </span>
                        <span className="filter-find-text">
                            <input type="text" value={synset_filter} autoFocus={true}
                                className={"filter-text-width " + theme}
                                onKeyDown={(e) => handleSearchTextKeydown(e)}
                                onChange={(e) => {setSynSetFilter(e.target.value)}}/>
                        </span> &nbsp;
                        <span className="filter-find-image">
                            <button className="btn btn-secondary" onClick={() => filterRecords()} title="search">
                            search
                            </button>
                        </span>
                        <span className="ms-4 fw-bolder" style={{color: "hotPink"}}> &#8592; Couldn't get the filter below to work without a button</span>
                    <div className="form-group ms-auto w-20">
                        <button className="btn btn-primary text-nowrap m-1"  onClick={() => handleAddSynSet()}>
                            + Add SynSet
                        </button>
                        <button className="btn btn-primary text-nowrap m-1"
                                onClick={() => handleAddDefaultSynSet()}
                                title="add all default syn-sets">+ Defaults
                        </button>
                    </div>
                </div>
            }
            <br/><br/><br/> */}
            
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="d-flex form-group me-2">
                        <input
                            type="text"
                            placeholder={"Search Synset..."}
                            autoFocus={true}
                            className={"form-control me-2 filter-search-input " + theme}
                            value={synset_filter}
                            onChange={(e) => {setSynSetFilter(e.target.value)}}
                            onKeyDown={(e) => {if(e.key === 'Enter') filterRecords(e)}}
                        />
                        <button className="btn btn-secondary" onClick={(e) => filterRecords(e)} title="search">
                            Search
                        </button>
                    </div>
                </div>

                <div className="form-group d-flex ms-auto">
                    <button className="btn btn-outline-primary text-nowrap ms-2"
                        onClick={() => handleAddDefaultSynSet()}
                        title="add all default syn-sets">Defaults
                    </button>
                    <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddSynSet()}>
                        + Add Syn-set
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
                                <td className='small text-black-50 px-4'>Syn-set</td>
                                <td className='small text-black-50 px-4'>Word Clouds</td>
                                <td className='small text-black-50 px-4'></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getSynSets().map((synSet) => {
                                    return (
                                        <tr key={synSet.word}>
                                            <td className="pt-3 px-4 pb-3">
                                                <div className="synset-label text-capitalize fw-500">{synSet.word}</div>
                                            </td>
                                            <td className="pt-3 px-4 pb-2">
                                                    {synSet.wordCloudCsvList.map((wc,i) => {
                                                        console.log('testing', wc.split(','))
                                                        //  wc.split(',').slice(0,3).map(item => {
                                                        //     console.log('test', item)
                                                        //      return <div>hello</div>
                                                        // })
                                                        return (
                                                            <div className="synset-label">
                                                                {   
                                                                <div className="d-flex flex-wrap">
                                                                    <div className="table-pill rounded-pill d-flex mb-2">
                                                                    {/* <span className="small px-3 py-1 mb-2">&bull;</span> */}
                                                                    {
                                                                    wc.split(',').slice(0,3).map(word => {
                                                                        return (
                                                                            <div className={`small text-capitalize px-3 py-1 wc-divider ${i%2 === 0 ? '' : ''}`}>{word}</div>
                                                                        )
                                                                    })}

                                                                    </div>
                                                                    <span className="small fw-light fst-italic px-2 py-1 text-secondary pointer-cursor" title={wc}>{wc.split(',').length > 3 ? `+${wc.split(',').length - 3}` : ""}</span>
                                                                </div>
                                                                }

                                                            </div>
                                                        )
                                                    })}
                                            </td>
                                            <td className="pt-3 px-4 pb-0">
                                                <div className="d-flex  justify-content-end">
                                                    <button onClick={() => handleEdit(synSet)}
                                                            className="btn text-primary btn-sm" title="edit syn-set">Edit
                                                    </button>
                                                    &nbsp;
                                                    <button
                                                            className="btn text-danger btn-sm"
                                                            title="remove syn-set"
                                                            onClick={() => deleteSynSetAsk(synSet)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {/* <tr>
                                <td/>
                                <td>
                                    {isVisible() &&
                                        <div>
                                            <button className="btn text-primary btn-sm"
                                                    onClick={() => handleAddDefaultSynSet()}
                                                    title="add all default syn-sets">defaults
                                            </button>
                                        </div>

                                    }
                                </td>
                            </tr> */}

                            </tbody>

                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={synset_total_size}
                            rowsPerPage={synset_page_size}
                            page={synset_page}
                            onChangePage={(page) => setSynSetPage(page)}
                            onChangeRowsPerPage={(rows) => setSynSetPageSize(rows)}
                        />

                    </div>
                }

            </div>


            {/*Edit form*/}
            <SynsetEdit />

            {/* delete   */}
            <SynsetDelete/>

            {/* add default   */}
            <SynsetDefault/>
        </div>
    )
}

