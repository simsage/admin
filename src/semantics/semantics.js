import React from 'react';

import {SemanticEdit} from "./semantic-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Pagination} from "../common/pagination";


export class Semantics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            semantic: {},
            prev_semantic: {word: "", semantic: ""},
            semantic_edit: false,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            // pagination
            page_size: 5,
            page: 0,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getSemanticList() {
        return this.props.semantic_list;
    }
    deleteSemanticAsk(semantic) {
        if (semantic) {
            this.props.openDialog("are you sure you want to remove " + semantic.word + " is a " + semantic.semantic + "?",
                "Remove Semantic", (action) => { this.deleteSemantic(action) });
            this.setState({semantic: semantic});
        }
    }
    deleteSemantic(action) {
        if (action && this.state.semantic) {
            this.props.deleteSemantic(this.state.semantic.word);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({semantic_edit: false, semantic: {}});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getSemantics();
        }
    }
    editSemantic(semantic) {
        this.setState({semantic_edit: true,
            prev_semantic: {
                word: semantic.word,
                semantic: semantic.semantic,
            },
            semantic: {
                word: semantic.word,
                semantic: semantic.semantic,
            }});
    }
    newSemantic() {
        this.setState({semantic_edit: true,
            prev_semantic: {
                word: "",
                semantic: "",
            },
            semantic: {
                word: "",
                semantic: "",
            }});
    }
    save(semantic) {
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
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        const theme = this.props.theme;
        return (
            <div>
                <SemanticEdit open={this.state.semantic_edit}
                              theme={theme}
                              semantic={this.state.semantic}
                              onSave={(item) => this.save(item)}
                              onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">find semantics</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.semantic_filter} autoFocus={true} className={theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSemanticFilter(event.target.value);
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getSemantics()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </span>
                    </div>
                }

                <br clear="both" />

                {
                    this.isVisible() &&
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
                                    this.getSemanticList().map((semantic) => {
                                        return (
                                            <tr key={semantic.word + ":" + semantic.semantic}>
                                                <td>
                                                    <div>{semantic.word}</div>
                                                </td>
                                                <td>
                                                    <div>{semantic.semantic}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editSemantic(semantic)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit semantic" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteSemanticAsk(semantic)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove semantic" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td/>
                                    <td>
                                        {this.isVisible() &&
                                            <div className="link-button" onClick={() => this.newSemantic()}><img
                                                className="image-size" src="../images/add.svg" title="new semantic" alt="new semantic"/></div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Pagination
                            theme={theme}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.num_semantics}
                            rowsPerPage={this.props.semantic_page_size}
                            page={this.props.semantic_page}
                            onChangePage={(page) => this.props.setSemanticPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setSemanticPageSize(rows)}
                        />

                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        semantic_list: state.appReducer.semantic_list,
        semantic_filter: state.appReducer.semantic_filter,
        semantic_page: state.appReducer.semantic_page,
        semantic_page_size: state.appReducer.semantic_page_size,
        num_semantics: state.appReducer.num_semantics,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Semantics);

