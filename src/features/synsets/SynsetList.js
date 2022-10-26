import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {Pagination} from "../../common/pagination";
import {loadSynsets,showDeleteSynSetForm, showAddSynSetForm, showAddDefaultAskForm} from "./synsetSlice";
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

    const dispatch = useDispatch();

    useEffect(() => {
        console.log("load_data",load_data)
        dispatch(loadSynsets({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            kb_id: selected_knowledge_base_id,
            page: synset_page,
            filter: synset_filter,
            page_size: synset_page_size
        }));
    }, [load_data === 'load_now', session_id, selected_organisation_id, selected_knowledge_base_id])

    const handleFilterTextChange = (e) => {
        setSynSetFilter(e.target.value);
    }

    const handleFilterTextKeyDown = (e) => {
        if( e.key === "Enter") {
            dispatch(loadSynsets({
                session_id: session_id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id,
                page: synset_page,
                filter: synset_filter,
                page_size: synset_page_size
            }))
            setSynSetFilter('');
        }
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
    function handleSynSetFilterKeydown(event) {
        //TODO: Add in filtering.
    }

    function findSynSets() {
        //todo::findSynSets
        console.log("findSynSets clicked");
    }

    function getSynSets() {
        return synset_list ? synset_list : [];
    }

    return (
        <div className="section px-5 pt-4">

            <div className="synset-page">

                {
                    isVisible() &&
                    <div className="d-flex justify-content-center w-100 mb-4">
                        <div className="filter-find-box">
                            <span className="filter-label">find synsets </span>
                            <span className="filter-find-text">
                                <input type="text" value={synset_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyDown={(e) => handleFilterTextKeyDown(e)}
                                   onChange={(e) => {handleFilterTextChange(e)}}/>
                            </span>
                            <button className="filter-find-image" onClick={() => findSynSets()} title="search">
                            search
                            </button>
                        </div>
                        <div className="form-group ms-auto w-20">
                            <button className="btn btn-primary text-nowrap m-1"  onClick={() => handleAddSynSet()}>
                                + Add User
                            </button>
                            <button className="btn btn-primary text-nowrap m-1"
                                    onClick={() => handleAddDefaultSynSet()}
                                    title="add all default syn-sets">+ Defaults
                            </button>
                        </div>
                    </div>
                }

                <br clear="both"/>

                {
                    isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                            <tr className='table-header'>
                                <th className='table-header'>syn-set</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getSynSets().map((synSet) => {
                                    return (
                                        <tr key={synSet.word}>
                                            <td>
                                                <div className="synset-label">{synSet.word}</div>
                                            </td>
                                            <td>

                                                <button onClick={() => handleEdit(synSet)}
                                                        className="btn text-primary btn-sm" title="edit syn-set">edit
                                                </button>
                                                &nbsp;
                                                <button
                                                        className="btn text-danger btn-sm"
                                                        title="remove syn-set"
                                                        onClick={() => deleteSynSetAsk(synSet)}
                                                >
                                                    remove
                                                </button>

                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
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
                            </tr>

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

