import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import SynsetFilter from "./SynsetFilter";
import {Pagination} from "../../common/pagination";
import {loadSynsets} from "./synsetSlice";
import {showEditForm} from "../synsets/synsetSlice"
import SynsetEdit from "./SynsetEdit";

export default function SynsetsHome(props) {
    const title = "Synsets";
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
    let [synset_filter, setSynSetFilter] = useState();

    const synset_show_form = useSelector((state) => state.synsetReducer.show_data_form)
    const load_data = useSelector((state) => state.synsetReducer.data_status)

    const dispatch = useDispatch();
    console.log("load_data",load_data)

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


    function deleteSynSetAsk(synSet) {
        if (synSet) {
            // this.props.openDialog("are you sure you want to remove id " + synSet.word + "?",
            //     "Remove SynSet", (action) => {
            //         this.deleteSynSet(action)
            //     });
            // this.setState({synSet: synSet});

            alert("are you sure you want to remove id " + synSet.word + "?")
        }
    }


    function deleteSynSet(action) {
        if (action && this.state.synSet) {
            this.props.deleteSynSet(this.state.synSet.lemma);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({synSet_edit: false, synSet: {}});
    }

    function handleSynSetFilterKeydown(event) {
        if (event.key === "Enter") {
            this.props.findSynSets();
        }
    }

    const handleEditForm = (synset) => {
        console.log("synset", synset)
        dispatch(showEditForm({selected_synset: synset}));
    }
    // function editSynSet(synSet) {
    //     this.setState({synSet_edit: true, synSet: synSet});
    // }

    function newSynSet() {
        this.setState({
            synSet_edit: true, synSet: {
                word: "",
                lemma: "",
                wordCloudCsvList: [],
            }
        });
    }

    function save(synSet) {
        if (synSet) {
            if (synSet.word.trim().length > 0 && synSet.wordCloudCsvList.length > 1) {
                const list = synSet.wordCloudCsvList;
                let validList = true;
                for (const item of list) {
                    if (item.trim().length === 0) {
                        validList = false;
                    }
                }
                if (validList) {
                    this.props.saveSynSet(synSet);
                    this.setState({synSet_edit: false, synSet: {}});
                } else {
                    this.props.setError("Error Saving SynSet", "syn-set word-cloud items must not be empty.");
                }
            } else {
                this.props.setError("Error Saving SynSet", "syn-set cannot be empty and need more than one item");
            }
        } else {
            this.setState({synSet_edit: false, synSet: {}});
        }
    }


    function isVisible() {
        return selected_organisation_id !== null && selected_organisation_id.length > 0 &&
            selected_organisation !== null && selected_organisation.id === selected_organisation_id &&
            selected_knowledge_base_id !== null && selected_knowledge_base_id.length > 0;
    }

    function defaultSynSetsAsk() {
        this.props.openDialog("are you sure you want to add all DEFAULT SYNSETS?",
            "Add Default SynSets", (action) => {
                this.addDefaultSynSets(action)
            });
    }

    function addDefaultSynSets(action) {
        if (action) {
            this.props.addDefaultSynSets();
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
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
            {/*<SynsetFilter/>*/}

            <div className="synset-page">

                {
                    isVisible() &&

                    <div className="filter-find-box">
                        <span className="filter-label">find synsets </span>
                        <span className="filter-find-text">
                            <input type="text" value={synset_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyPress={(event) => handleSynSetFilterKeydown(event)}
                                   onChange={(event) => {
                                       setSynSetFilter(event.target.value)
                                   }}/>
                        </span>
                        <button className="filter-find-image" onClick={() => findSynSets()} title="search">
                            search
                        </button>
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

                                                <button onClick={() => handleEditForm(synSet)}
                                                        className="btn text-primary btn-sm" title="edit syn-set">edit
                                                </button>
                                                &nbsp;
                                                <button onClick={() => deleteSynSetAsk(synSet)}
                                                        className="btn text-danger btn-sm"
                                                        title="remove syn-set">remove
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
                                            <button className="btn text-primary btn-sm" onClick={() => newSynSet()}
                                                    title="add a new syn-set">new
                                            </button>
                                            &nbsp;
                                            <button className="btn text-primary btn-sm"
                                                    onClick={() => defaultSynSetsAsk()}
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
        </div>
    )
}

