import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import {Api} from '../common/api'
import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'
import {AutoComplete} from "../common/autocomplete";
import {SemanticEdit} from "./semantic-edit";


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
    busy: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.8',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(255,255,255)"
    },
};


export class Semantics extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            busy: false,

            semantic_list: [],
            semantic: null,
            semantic_edit: false,

            message_title: "",
            message: "",
            message_callback: null,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            error_msg: "",
            error_title: "",

            query: "",
        };
    }
    componentDidCatch(error, info) {
    }
    componentWillReceiveProps(nextProps) {
        this.kba = nextProps.kba;
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidMount() {
    }
    changeKB() {
        this.findSemantics(this.state.query);
    }
    findSemantics(query) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0 &&
            this.state.query.length > 0) {
            this.setState({busy: true});
            Api.findSemantics(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, this.state.query,
                (semanticList) => {
                    this.setState({semantic_list: semanticList, busy: false})
                },
                (errStr) => {
                    this.showError("Error", errStr)
                }
            )
        }
    }
    deleteSemanticAsk(semantic) {
        if (semantic) {
            this.setState({message_title: "Remove Semantic",
                message_callback: (action) => { this.deleteSemantic(action) },
                message: "are you sure you want to remove " + semantic.word + " is a " + semantic.semantic + "?",
                semantic: semantic})
        }
    }
    deleteSemantic(action) {
        if (action && this.state.semantic) {
            this.setState({busy: true});
            Api.deleteSemantic(this.kba.selected_organisation_id,
                               this.kba.selected_knowledgebase_id, this.state.semantic.word, () => {
                    this.setState({message_title: "", message: "", busy: false});
                    this.findSemantics(this.state.query);
                }, (errStr) => {
                    this.setState({message_title: "", message: "", busy: false,
                                         error_msg: errStr, error_title: "Error Removing Semantic"});
                })
        } else {
            this.setState({message_title: "", message: ""});
        }
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg, busy: false});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.findSemantics(this.state.query);
        }
    }
    editSemantic(semantic) {
        if (this.state.openDialog) {
            this.state.openDialog();
        }
        this.setState({semantic_edit: true, semantic: semantic});
    }
    newSemantic() {
        if (this.state.openDialog) {
            this.state.openDialog();
        }
        this.setState({semantic_edit: true, semantic: {
                word: "",
                semantic: "",
            }});
    }
    save(semantic) {
        if (semantic) {
            if (semantic.word.length > 0 && semantic.semantic.length > 0) {
                this.setState({busy: true});
                Api.saveSemantic(this.kba.selected_organisation_id,
                    this.kba.selected_knowledgebase_id, semantic, () => {
                        this.setState({semantic_edit: false, busy: false});
                        this.findSemantics(this.state.query);
                        if (this.state.closeDialog) {
                            this.state.closeDialog();
                        }
                    }, (errStr) => {
                        this.setState({error_msg: errStr, error_title: "Error Saving Semantic"});
                    });
            } else {
                this.setState({error_msg: "word and semantic must have a value", error_title: "Error Saving Semantic", busy: false});
            }
        } else {
            this.setState({semantic_edit: false});
            if (this.state.closeDialog) {
                this.state.closeDialog();
            }
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>semantics.js: Something went wrong.</h1>;
        }
        return (
            <div>
                <ErrorDialog
                    callback={() => { this.closeError() }}
                    open={this.state.error_msg.length > 0}
                    message={this.state.error_msg}
                    title={this.state.error_title} />

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

                <SemanticEdit open={this.state.semantic_edit}
                             semantic={this.state.semantic}
                             onSave={(item) => this.save(item)}
                             onError={(err) => this.showError("Error", err)} />

                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                <div style={styles.knowledgeSelect}>
                    <div style={styles.lhs}>knowledge base</div>
                    <div style={styles.rhs}>
                        <AutoComplete
                            label='knowledge base'
                            value={this.kba.selected_knowledgebase}
                            onFilter={(text, callback) => this.kba.getKnowledgeBaseListFiltered(text, callback)}
                            minTextSize={1}
                            onSelect={(label, data) => { this.kba.selectKnowledgeBase(label, data); this.changeKB() }}
                        />
                    </div>
                </div>

                {
                    this.kba.selected_knowledgebase_id.length > 0 &&

                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>find semantics</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.state.filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.setState({query: event.target.value})
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.findSemantics(this.state.query)}
                                 src="../images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.kba.selected_knowledgebase_id.length > 0 &&
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
                                    this.state.semantic_list.map((semantic) => {
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
                                        {this.kba.selected_organisation_id.length > 0 &&
                                        <a style={styles.imageButton} onClick={() => this.newSemantic()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new semantic"
                                            alt="new semantic"/></a>
                                        }
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                        </Table>

                    </Paper>
                }

            </div>
        )
    }
}

export default Semantics;
