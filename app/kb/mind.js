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
import {MindEdit} from "./mind-edit";
import Grid from "@material-ui/core/Grid";
import {BotSearch} from "../common/bot-search";


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
    spacer: {
        marginTop: '20px',
    }
};


export class Mind extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            mind_item_list: [],
            mind_item: null,
            mind_edit: false,

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
    findMindItems(query) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0 &&
            this.state.query.length > 0) {
            Api.uiMindFind(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, this.state.query,
                (mindItemList) => {
                    this.setState({mind_item_list: mindItemList})
                },
                (errStr) => {
                    this.showError("Error", errStr)
                }
            )
        }
    }
    deleteMindItemAsk(mindItem) {
        if (mindItem) {
            this.setState({message_title: "Remove Mind Entry",
                message_callback: (action) => { this.deleteMindItem(action) },
                message: "are you sure you want to remove id " + mindItem.id + "?<br/><br/>(" + mindItem.expression + ")",
                mind_item: mindItem})
        }
    }
    deleteMindItem(action) {
        if (action && this.state.mind_item) {
            Api.uiMindDelete(this.kba.selected_organisation_id,
                               this.kba.selected_knowledgebase_id, this.state.mind_item.id, () => {
                    this.setState({message_title: "", message: ""});
                    this.findMindItems(this.state.query);
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
            this.findMindItems(this.state.query);
        }
    }
    static toAnswer(mindItem) {
        let str = "";
        if (mindItem && mindItem.actionList) {
            for (const action of mindItem.actionList) {
                if (action && action.action === "browser.write" && action.parameters) {
                    for (const param of action.parameters) {
                        str = str + param.replace(/<br \/>/g, "\n");
                    }
                }
            }
        }
        return str;
    }
    editMindItem(mindItem) {
        this.setState({mind_edit: true, mind_item: mindItem});
    }
    newMindItem() {
        this.setState({mind_edit: true, mind_item: {
                id: Api.createGuid(),
                expression: "",
                actionList: [],
            }
            });
    }
    save(mindItem) {
        if (mindItem) {
            if (mindItem.expression.length > 0 && mindItem.actionList.length > 0) {
                Api.uiMindSave(this.kba.selected_organisation_id,
                    this.kba.selected_knowledgebase_id, mindItem, () => {
                        this.setState({mind_edit: false});
                        this.findMindItems(this.state.query);
                    }, (errStr) => {
                        this.setState({error_msg: errStr, error_title: "Error Saving Mind Entry"});
                    });
            } else {
                this.setState({error_msg: "mind-item must have an expression and actions", error_title: "Error Saving Mind Entry"});
            }
        } else {
            this.setState({mind_edit: false});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>mind.js: Something went wrong.</h1>;
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

               <MindEdit open={this.state.mind_edit}
                         mindItem={this.state.mind_item}
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
                    <div style={styles.floatLeftLabel}>find questions in the mind</div>
                    <div style={styles.searchFloatLeft}>
                        <input type="text" value={this.state.filter} autoFocus={true} style={styles.text}
                               onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                               onChange={(event) => {this.setState({query: event.target.value})}} />
                    </div>
                    <div style={styles.floatLeft}>
                        <img style={styles.search}
                             onClick={() => this.findMindItems(this.state.query)}
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
                                    <TableCell style={styles.tableHeaderStyle}>expression</TableCell>
                                    <TableCell style={styles.actionTableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.mind_item_list.map((mindItem) => {
                                        return (
                                            <TableRow key={mindItem.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{mindItem.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label} title={Mind.toAnswer(mindItem)}>{mindItem.expression}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editMindItem(mindItem)}>
                                                        <img src="../images/edit.svg" style={styles.dlImageSize} title="edit mind-item" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteMindItemAsk(mindItem)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove mind-item" alt="remove"/>
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
                                        <a style={styles.imageButton} onClick={() => this.newMindItem()}><img
                                            style={styles.addImage} src="../images/add.svg" title="new mind item"
                                            alt="new mind item"/></a>
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

                <Grid container spacing={8} style={styles.gridWidth}>

                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.spacer} /></Grid>
                    }

                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={2}>
                        <div style={styles.label}>Query the Mind</div>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={10}>
                        <BotSearch onError={(title, err) => this.showError(title, err)}
                                   kbId={this.kba.selected_knowledgebase_id}
                                   organisationId={this.kba.selected_organisation_id} />
                    </Grid>
                    }

                </Grid>

            </div>
        )
    }
}

export default Mind;
