import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {Api} from '../common/api'
import {SemanticEdit} from "./semantic-edit";
import TablePagination from "@material-ui/core/TablePagination";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    tableStyle: {
        minWidth: '800px',
        width: '1024px',
    },
    smallTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '20px',
    },
    actionTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '100px',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '400px',
        width: '600px',
    },
    searchTableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '200px',
        width: '340px',
    },
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '40px',
    },
    lhs: {
        float: 'left',
        width: '150px',
        marginTop: '-10px',
        color: '#aaa',
    },
    rhs: {
        float: 'left',
    },
    label: {
        padding: '10px',
        color: '#555',
    },
    gridWidth: {
        width: '800px',
    },
    hr: {
        border: '0.1px solid #f0f0f0',
        width: '100%',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    addImage: {
        width: '25px',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    dlImageSize: {
        width: '24px',
    },
    search: {
        marginTop: '2px',
        marginLeft: '15px',
        width: '18px',
        color: '#000',
    },
    floatLeftLabel: {
        float: 'left',
        marginRight: '6px',
        marginTop: '4px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    searchFloatLeft: {
        float: 'left',
    },
    text: {
        padding: '4px',
        width: '280px',
    },
    floatLeft: {
        float: 'left',
    },
    manualUploadSection: {
        marginTop: '50px',
    },
    findBox: {
        padding: '10px',
        marginBottom: '5px',
        float: 'right',
    },
};


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
    getSemantics() {
        const paginated_list = [];
        if (Api.defined(this.props.semantic_list)) {
            const first = this.state.page * this.state.page_size;
            const last = first + this.state.page_size;
            for (const i in this.props.semantic_list) {
                if (i >= first && i < last) {
                    paginated_list.push(this.props.semantic_list[i]);
                }
            }
        }
        return paginated_list;
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
            this.props.findSemantics();
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
                    this.props.deleteSemantic(this.state.semantic.word);
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
    render() {
        return (
            <div>
                <SemanticEdit open={this.state.semantic_edit}
                             semantic={this.state.semantic}
                             onSave={(item) => this.save(item)}
                             onError={(err) => this.props.setError("Error", err)} />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>find semantics</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.props.semantic_filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setSemanticFilter(event.target.value);
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.findSemantics()}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.smallTableHeaderStyle}>word</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>semantic</TableCell>
                                    <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.getSemantics().map((semantic) => {
                                        return (
                                            <TableRow key={semantic.word + ":" + semantic.semantic}>
                                                <TableCell>
                                                    <div style={styles.label}>{semantic.word}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{semantic.semantic}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editSemantic(semantic)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit semantic" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteSemanticAsk(semantic)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove semantic" alt="remove"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell>
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                        <a style={styles.imageButton} onClick={() => this.newSemantic()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new semantic"
                                            alt="new semantic"/></a>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25]}
                                            component="div"
                                            count={this.props.semantic_list.length}
                                            rowsPerPage={this.state.page_size}
                                            page={this.state.page}
                                            backIconButtonProps={{
                                                'aria-label': 'Previous Page',
                                            }}
                                            nextIconButtonProps={{
                                                'aria-label': 'Next Page',
                                            }}
                                            onChangePage={(event, page) => this.changePage(page)}
                                            onChangeRowsPerPage={(event) => this.changePageSize(event.target.value)}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                    </Paper>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        semantic_list: state.appReducer.semantic_list,
        semantic_filter: state.appReducer.semantic_filter,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Semantics);

