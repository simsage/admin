import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {
    loadSynsets,
    showDeleteSynSetForm,
    showAddSynSetForm,
    showAddDefaultAskForm,
    noResultsMessage,
} from "./synsetSlice";
import {showEditSynSetForm} from "./synsetSlice"
import SynsetDelete from "./SynsetDelete";
import SynsetDefault from "./SynsetDefault";
import api from "../../common/api";
import SynsetForm from "./SynsetForm";

export default function SynsetList() {

    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const synset_list = useSelector((state) => state.synsetReducer.synset_list)
    const synset_total_size = useSelector((state) => state.synsetReducer.synset_total_size)

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    let [synset_filter, setSynSetFilter] = useState('');

    const load_data = useSelector((state) => state.synsetReducer.data_status)

    const show_synset_form = useSelector((state) => state.synsetReducer.show_synset_form)


    let data = {
        session_id: session_id,
        organisation_id: selected_organisation_id,
        kb_id: selected_knowledge_base_id,
        page: page,
        filter: synset_filter,
        page_size: page_size
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSynsets(data));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === 'load_now', page, page_size, selected_knowledge_base_id])

    function filterRecords(e) {
        e.preventDefault()
        dispatch(loadSynsets(data));
        dispatch(noResultsMessage(true))

    }

    function handlePageSizeChange(num){
        setPageSize(num)
        setPage(0)
    }

    const handleRefresh = () => {
        dispatch(loadSynsets(data))
    }

    const handleEdit = (synset) => {
        dispatch(showEditSynSetForm({selected_synset: synset}));
    }

    const handleAddSynSet = () => {
        dispatch(showAddSynSetForm());
    }

    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function deleteSynSetAsk(s) {
        dispatch(showDeleteSynSetForm({selected_synset: s}))
    }

    //Legacy functions

    const handleAddDefaultSynSet = () => {
        dispatch(showAddDefaultAskForm());
    }

    function getSynSets() {
        return synset_list ? synset_list : [];
    }




    return (
        <div className="section px-5 pt-4">

            <div className="synset-page">

                <div className="d-flex justify-content-between w-100 mb-4">
                    <div className="d-flex w-100">
                        <div className="d-flex form-group me-2">
                            <input
                                type="text"
                                placeholder={"Search Synset..."}
                                autoFocus={true}
                                className={"form-control me-2 filter-search-input " + theme}
                                value={synset_filter}
                                onChange={(e) => {
                                    setSynSetFilter(e.target.value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') filterRecords(e)
                                }}
                            />
                            <button className="btn btn-secondary" onClick={(e) => filterRecords(e)} title="search">
                                Search
                            </button>
                        </div>
                    </div>

                    <div className="form-group d-flex ms-auto">
                        <div className="btn" onClick={() => handleRefresh()} >
                            <img src="images/refresh.svg" className="refresh-image" alt="refresh" title="refresh list of synsets" />
                        </div>
                        <button className="btn btn-outline-primary text-nowrap ms-2"
                                onClick={() => handleAddDefaultSynSet()}
                                title="add all default syn-sets">Defaults
                        </button>
                        <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddSynSet()}>
                            + Add Syn-set
                        </button>
                    </div>
                </div>

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
                                                {synSet.wordCloudCsvList.map((wc, i) => {
                                                    return (
                                                        <div className="synset-label">
                                                            {
                                                                <div className="d-flex flex-wrap">
                                                                    <div
                                                                        className="table-pill rounded-pill d-flex mb-2">
                                                                        {/* <span className="small px-3 py-1 mb-2">&bull;</span> */}
                                                                        {
                                                                            wc.split(',').slice(0, 3).map(word => {
                                                                                return (
                                                                                    <div
                                                                                        className={`small text-capitalize px-3 py-1 wc-divider ${i % 2 === 0 ? '' : ''}`}>{word}</div>
                                                                                )
                                                                            })}

                                                                    </div>
                                                                    <span
                                                                        className="small fw-light fst-italic px-2 py-1 text-secondary pointer-cursor"
                                                                        title={wc}>{wc.split(',').length > 3 ? `+${wc.split(',').length - 3}` : ""}</span>
                                                                </div>
                                                            }

                                                        </div>
                                                    )
                                                })}
                                            </td>
                                            <td className="pt-3 px-4 pb-0">
                                                <div className="d-flex  justify-content-end">
                                                    <button onClick={() => handleEdit(synSet)}
                                                            className="btn text-primary btn-sm"
                                                            title="edit syn-set">Edit
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
                            </tbody>

                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
                            component="div"
                            count={synset_total_size}
                            rowsPerPage={page_size}
                            page={page}
                            onChangePage={(page) => setPage(page)}
                            onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                        />

                    </div>
                }

            </div>

            {/*Edit form*/}

            {show_synset_form &&
            <SynsetForm />
            }

            {/* delete   */}
            <SynsetDelete/>

            {/* add default   */}
            <SynsetDefault/>

        </div>
    )
}

