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
import {SynonymEdit} from "./synonym-edit";


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


export class Synonyms extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            synonym_list: [],
            synonym: null,
            synonym_edit: false,

            message_title: "",
            message: "",
            message_callback: null,

            error_msg: "",
            error_title: "",

            query: "",
        };
    }
    componentDidCatch(error, info) {
    }
    componentWillReceiveProps(nextProps) {
        this.kba = nextProps.kba;
    }
    componentDidMount() {
    }
    findSynonyms(query) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0 &&
            this.state.query.length > 0) {
            Api.findSynonyms(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, this.state.query,
                (synonymList) => {
                    this.setState({synonym_list: synonymList})
                },
                (errStr) => {
                    this.showError("Error", errStr)
                }
            )
        }
    }
    deleteSynonymAsk(synonym) {
        if (synonym) {
            this.setState({message_title: "Remove Synonym",
                message_callback: (action) => { this.deleteSynonym(action) },
                message: "are you sure you want to remove id " + synonym.id + "?<br/><br/>(" + synonym.words + ")",
                synonym: synonym})
        }
    }
    deleteSynonym(action) {
        if (action && this.state.synonym) {
            Api.deleteSynonym(this.kba.selected_organisation_id,
                               this.kba.selected_knowledgebase_id, this.state.synonym.id, () => {
                    this.setState({message_title: "", message: ""});
                    this.findSynonyms(this.state.query);
                }, (errStr) => {
                    this.setState({message_title: "", message: "",
                                         error_msg: errStr, error_title: "Error Removing Mind Entry"});
                })
        } else {
            this.setState({message_title: "", message: ""});
        }
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.findSynonyms(this.state.query);
        }
    }
    editSynonym(synonym) {
        this.setState({synonym_edit: true, synonym: synonym});
    }
    newSynonym() {
        this.setState({synonym_edit: true, synonym: {
                id: Api.createGuid(),
                words: "",
            }});
    }
    save(synonym) {
        if (synonym) {
            if (synonym.words.length > 0 && synonym.words.indexOf(",") > 0) {
                Api.saveSynonym(this.kba.selected_organisation_id,
                    this.kba.selected_knowledgebase_id, synonym, () => {
                        this.setState({synonym_edit: false});
                        this.findSynonyms(this.state.query);
                    }, (errStr) => {
                        this.setState({error_msg: errStr, error_title: "Error Saving Synonym"});
                    });
            } else {
                this.setState({error_msg: "synonym cannot be empty and need more than one item", error_title: "Error Saving Synonym"});
            }
        } else {
            this.setState({synonym_edit: false});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>synonyms.js: Something went wrong.</h1>;
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

                <SynonymEdit open={this.state.synonym_edit}
                             synonym={this.state.synonym}
                             onSave={(item) => this.save(item)}
                             onError={(err) => this.showError("Error", err)} />


                <div style={styles.knowledgeSelect}>
                    <div style={styles.lhs}>knowledge base</div>
                    <div style={styles.rhs}>
                        <AutoComplete
                            label='knowledge base'
                            value={this.kba.selected_knowledgebase}
                            onFilter={(text, callback) => this.kba.getKnowledgeBaseListFiltered(text, callback)}
                            minTextSize={1}
                            onSelect={(label, data) => this.kba.selectKnowledgeBase(label, data)}
                        />
                    </div>
                </div>

                <div style={styles.findBox}>
                    <div style={styles.floatLeftLabel}>find synonyms</div>
                    <div style={styles.searchFloatLeft}>
                        <input type="text" value={this.state.filter} autoFocus={true} style={styles.text}
                               onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                               onChange={(event) => {this.setState({query: event.target.value})}} />
                    </div>
                    <div style={styles.floatLeft}>
                        <img style={styles.search}
                             onClick={() => this.findSynonyms(this.state.query)}
                             src="../images/dark-magnifying-glass.svg" title="search" alt="search" />
                    </div>
                </div>
                <br clear="both" />

                {
                    this.kba.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={styles.smallTableHeaderStyle}>id</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>synonyms</TableCell>
                                    <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.synonym_list.map((synonym) => {
                                        return (
                                            <TableRow key={synonym.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{synonym.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{synonym.words}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editSynonym(synonym)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit synonym" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteSynonymAsk(synonym)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove synonym" alt="remove"/>
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
                                        <a style={styles.imageButton} onClick={() => this.newSynonym()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new synonym"
                                            alt="new synonym"/></a>
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

export default Synonyms;
