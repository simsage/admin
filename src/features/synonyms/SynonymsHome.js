import {useSelector} from "react-redux";
import React, {useState} from "react";
import SynonymFilter from "./SynonymFilter";
import {Pagination} from "../../common/pagination";

export default function SynonymsHome() {
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
    const [synonym_filter,setSynonymFilter] = useState()

    function getSynonymList()
    {
        return synonym_list;
    }

    function getSynonyms(){
    //Todo::getSynonyms
    }

    function deleteSynonymAsk(synonym)
    {
        if (synonym) {
            this.props.openDialog("are you sure you want to remove id " + synonym.id + "?<br/><br/>(" + synonym.words + ")",
                "Remove Synonym", (action) => {
                    this.deleteSynonym(action)
                });
            this.setState({synonym: synonym});
        }
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

    function editSynonym(synonym)
    {
        this.setState({synonym_edit: true, synonym: synonym});
    }
    function newSynonym()
    {
        this.setState({
            synonym_edit: true, synonym: {
                id: "",
                words: "",
            }
        });
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
            {/*<SynonymFilter/>*/}
            <div>
                {/*<SynonymEdit open={this.state.synonym_edit}*/}
                {/*             theme={theme}*/}
                {/*             synonym={this.state.synonym}*/}
                {/*             onSave={(item) => this.save(item)}*/}
                {/*             onError={(err) => this.props.setError("Error", err)}/>*/}

                {
                    isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find synonyms </span>
                        <span className="filter-find-text">
                            <input type="text" value={synonym_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyPress={(event) => handleSearchTextKeydown(event)}
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

        </div>
    )
}