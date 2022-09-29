import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";

import {Pagination} from "../../common/pagination";
import {loadSynonyms, showAddSynonymForm, showEditSynonymForm, showDeleteSynonymForm} from "./synonymSlice";
import {SynonymEdit} from "./SynonymEdit";
import SynonymDeleteAsk from "./SynonymDeleteAsk";

export default function SynonymsHome(props) {

    const title = "Synonyms";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const synonym_list = useSelector((state)=>state.synonymReducer.synonym_list)
    const num_synonyms = useSelector((state)=>state.synonymReducer.num_synonyms)
    const [synonym_page_size,setSynonymPageSize] = useState(useSelector((state)=>state.synonymReducer.synonym_page_size))
    const [synonym_page,setSynonymPage] = useState(useSelector((state)=>state.synonymReducer.synonym_page))
    const [synonym_filter,setSynonymFilter] = useState('');

    const dispatch = useDispatch();

    let data = {
        "organisationId": selected_organisation_id,
        "kbId": selected_knowledge_base_id,
        "prevId": null,
        "filter": "",
        "pageSize": 10
    };

    useEffect(() => {
        dispatch(loadSynonyms({session_id, data }));
    }, [])


    function getSynonymList() {
        return synonym_list ? synonym_list : [];
    }

    function filterSynonyms(event) {
        if (event.key === "Enter") {
            data.filter = synonym_filter
            dispatch(loadSynonyms( {session_id, data } ))
        }
    }

    function editSynonym(s) {
       dispatch(showEditSynonymForm({show:true, syn: s}))
    }

    function newSynonym() {
        dispatch(showAddSynonymForm(true));
    }

    function deleteSynonymAsk(synonym) {
        dispatch(showDeleteSynonymForm({show: true, synonym: synonym}))
    }

    //Legacy functions
    function getSynonyms(){
        //Todo::getSynonyms
    }

    function deleteSynonym(action)
    {
        if (action && this.state.synonym) {
            this.props.deleteSynonym(this.state.synonym.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({synonym_edit: false, synonym: {}});
    }

    function handleSearchTextKeydown(event)
    {
        if (event.key === "Enter") {
            getSynonyms();
        }
    }

    function save(synonym)
    {
        if (synonym) {
            if (synonym.words.length > 0 && synonym.words.indexOf(",") > 0) {
                this.props.saveSynonym(synonym);
                this.setState({synonym_edit: false, synonym: {}});
            } else {
                this.props.setError("Error Saving Synonym", "synonym cannot be empty and need more than one item");
            }
        } else {
            this.setState({synonym_edit: false, synonym: {}});
        }
    }
    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }


    const getSemantics = () => {
        console.log("getSemantics clicked")
        //Todo::getSemantics
    }


    return (
        <div className="section px-5 pt-4">

            <div>

                {
                    isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find synonyms </span>
                        <span className="filter-find-text">
                            <input type="text" value={synonym_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyDown={(event) => filterSynonyms(event)}
                                   onChange={(event) => {
                                       setSynonymFilter(event.target.value)
                                   }}/>
                        </span> &nbsp;
                        <span className="filter-find-image">
                            <button className="btn btn-secondary"
                                    onClick={() => getSemantics()}
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
                                <th className='table-header'>id</th>
                                <th className='table-header synonym-column-width'>synonyms</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                getSynonymList().map((synonym) => {
                                    return (
                                        <tr key={synonym.id}>
                                            <td>
                                                <div>{synonym.id}</div>
                                            </td>
                                            <td>
                                                <div>{synonym.words}</div>
                                            </td>
                                            <td>
                                                <button className="btn btn-secondary" title="edit synonym" onClick={() => editSynonym(synonym)}>edit</button> &nbsp;
                                                <button className="btn btn-secondary" title="remove synonym" onClick={() => deleteSynonymAsk(synonym)}>remove</button>
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
                                        <button className="btn btn-outline-primary" title="add new synonym" onClick={() => newSynonym()}>new synonym</button>
                                    }
                                </td>
                            </tr>

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

            </div>
            <SynonymEdit />
            <SynonymDeleteAsk />
        </div>
    )
}