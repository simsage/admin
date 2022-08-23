import {useSelector} from "react-redux";
import React, {useState} from "react";
import SemanticsFilter from "./SemanticsFilter";
import {Pagination} from "../../common/pagination";

export default function SemanticsHome() {
    const title = "Semantics";
    const theme = null;
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const semantic_list = useSelector((state) => state.semanticReducer.semantic_list);
    const num_semantics = useSelector((state) => state.semanticReducer.num_semantics);
    const [semantic_page_size, setSemanticPageSize] = useState(useSelector((state) => state.semanticReducer.semantic_page_size));
    const [semantic_page, setSemanticPage] = useState(useSelector((state) => state.semanticReducer.semantic_page));
    const [semantic_filter,setSemanticFilter] = useState();

    function getSemanticList()
    {
        return semantic_list;
    }

    function deleteSemanticAsk(semantic)
    {
        if (semantic) {
            this.props.openDialog("are you sure you want to remove " + semantic.word + " is a " + semantic.semantic + "?",
                "Remove Semantic", (action) => {
                    this.deleteSemantic(action)
                });
            this.setState({semantic: semantic});
        }
    }

    function deleteSemantic(action)
    {
        if (action && this.state.semantic) {
            this.props.deleteSemantic(this.state.semantic.word);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({semantic_edit: false, semantic: {}});
    }

    function handleSearchTextKeydown(event)
    {
        if (event.key === "Enter") {
            getSemantics();
        }
    }

    function editSemantic(semantic)
    {
        this.setState({
            semantic_edit: true,
            prev_semantic: {
                word: semantic.word,
                semantic: semantic.semantic,
            },
            semantic: {
                word: semantic.word,
                semantic: semantic.semantic,
            }
        });
    }

    function newSemantic()
    {
        this.setState({
            semantic_edit: true,
            prev_semantic: {
                word: "",
                semantic: "",
            },
            semantic: {
                word: "",
                semantic: "",
            }
        });
    }

    function save(semantic)
    {
        if (semantic) {
            if (semantic.word.length > 0 && semantic.semantic.length > 0) {
                // delete the previous semantic?
                if (this.state.prev_semantic.word !== "" && this.state.prev_semantic.word !== semantic.word) {
                    semantic.prevWord = this.state.prev_semantic.word;
                } else {
                    semantic.prevWord = '';
                }
                this.props.saveSemantic(semantic);
                this.setState({semantic_edit: false, semantic: {}});
                if (this.state.closeDialog) {
                    this.state.closeDialog();
                }
            } else {
                this.props.setError("Error Saving Semantic", "word and semantic must have a value");
            }
        } else {
            this.setState({semantic_edit: false, semantic: {}});
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
            {/*<SemanticsFilter/>*/}
            <div>
                {/*<SemanticEdit open={this.state.semantic_edit}*/}
                {/*              theme={theme}*/}
                {/*              semantic={this.state.semantic}*/}
                {/*              onSave={(item) => this.save(item)}*/}
                {/*              onError={(err) => this.props.setError("Error", err)}/>*/}

                {
                    isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find semantics</span>
                        <span className="filter-find-text">
                            <input type="text" value={semantic_filter} autoFocus={true}
                                   className={"filter-text-width " + theme}
                                   onKeyPress={(event) => handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       setSemanticFilter(event.target.value);
                                   }}/>
                        </span>
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
                                                     onClick={() => editSemantic(semantic)}>edit
                                                </button>
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
                                        <div className="link-button" onClick={() => newSemantic()}><img
                                            className="image-size" src="../images/add.svg" title="new semantic"
                                            alt="new semantic"/></div>
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
        </div>
    )

}