import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import TablePagination from '@material-ui/core/TablePagination';

import {Api} from '../common/api'
import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'
import {Comms} from "../common/comms";

const id_style = "<div style='width: 170px; float: left; height: 24px;'>";

const styles = {
    label: {
        color: '#555',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    editBox: {
        width: '500px',
        marginBottom: '15px',
    },
    roleBlock: {
        padding: '5px',
        marginTop: '20px',
        float: 'left',
        width: '400px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    roleLabel: {
        fontSize: '0.8em',
        color: '#aaa',
    },
    roleArea: {
        padding: '20px',
    },
    roleChip: {
        margin: '2px',
    },
    addImage: {
        width: '25px',
    },
    textFieldBox: {
        float: 'left',
    },
    imageBox: {
        float: 'left',
    },
    imageSize: {
        marginTop: '20px',
        width: '20px',
    },
    dlImageSize: {
        width: '24px',
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


export class KnowledgeBases extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            busy: false,

            edit_knowledgebase: false,
            knowledgeBase: null,

            edit_kb_id: "",
            edit_name: "",
            edit_email: "",
            edit_security_id: "",

            error_msg: "",
            error_title: "",

            message_title: "",
            message: "",
            message_callback: null,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            // pagination
            page_size: 5,
            page: 0,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentWillReceiveProps(props) {
        this.kba = props.kba;
        this.setState({
            openDialog: props.openDialog,
            closeDialog: props.closeDialog,
        });
    }
    componentDidMount() {
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getKnowledgeBases() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        for (const i in this.kba.knowledge_base_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.kba.knowledge_base_list[i]);
            }
        }
        return paginated_list;
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    addNewKnowledgeBase() {
        if (this.state.openDialog) {
            this.state.openDialog();
        }
        this.setState({edit_knowledgebase: true, knowledgeBase: null,
            edit_knowledgebase_id: "",
            edit_name: "",
            edit_email: "",
            edit_security_id: Api.createGuid(),
        })
    }
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
    }
    editKnowledgeBase(knowledgeBase) {
        if (knowledgeBase) {
            if (this.state.openDialog) {
                this.state.openDialog();
            }
            this.setState({edit_knowledgebase: true, knowledgeBase: knowledgeBase,
                edit_knowledgebase_id: knowledgeBase.kbId,
                edit_name: knowledgeBase.name,
                edit_email: knowledgeBase.email,
                edit_security_id: knowledgeBase.securityId,
            })
        }
    }
    deleteKnowledgeBaseAsk(knowledgeBase) {
        if (knowledgeBase) {
            this.setState({message_title: "Remove Knowledge Base",
                message_callback: (action) => { this.deleteKnowledgeBase(action) },
                message: "are you sure you want to remove \"" + knowledgeBase.name + "\" ?",
                knowledgeBase: knowledgeBase})
        }
    }
    deleteKnowledgeBase(action) {
        if (action) {
            this.setState({busy: true});
            Api.deleteKnowledgeBase(this.kba.selected_organisation_id,
                                    this.state.knowledgeBase.kbId, () => {
                this.setState({message_title: "", message: "", busy: false});
                this.kba.deleteKnowledgeBase(this.state.knowledgeBase.kbId, this.state.prev_page, this.state.page_size);
            }, (errStr) => {
                this.setState({message_title: "", message: "", busy: false,
                    error_msg: errStr, error_title: "Error Removing knowledge Base"});
            })
        } else {
            this.setState({message_title: "", message: ""});
        }
    }
    editCancel() {
        this.setState({edit_knowledgebase: false, knowledgeBase: null})
        if (this.state.closeDialog) {
            this.state.closeDialog();
        }
    }
    editOk() {
        if (this.state.edit_name.length > 0) {
            this.setState({busy: true});
            Api.updateKnowledgeBase(this.kba.selected_organisation_id, this.state.edit_knowledgebase_id,
                                    this.state.edit_name, this.state.edit_email, this.state.edit_security_id,
                (data) => {
                    this.setState({edit_knowledgebase: false, knowledgeBase: null, busy: false});
                    this.kba.updateKnowledgeBase(this.state.edit_name, this.state.edit_email, this.state.edit_knowledgebase_id, this.state.prev_page, this.state.page_size);
                    if (this.state.closeDialog) {
                        this.state.closeDialog();
                    }
                },
                (errStr) => {
                    this.setState({edit_knowledgebase: false, error_msg: errStr, error_title: "Error Updating Knowledge Base", busy: false});
                    if (this.state.closeDialog) {
                        this.state.closeDialog();
                    }
                });
        } else {
            this.setState({
                error_msg: "Please complete all fields.  Must have a name.",
                error_title: "Incomplete Data"});
        }
    }
    viewIds(knowledge_base) {
        this.setState({message_title: '"' + knowledge_base.name + "\" Knowledge Base Ids",
            message_callback: (action) => { this.setState({message: ""}) },
            message: id_style + "organisation id</div><div style='float: left'>" + this.kba.selected_organisation_id + "</div><br clear='both'>" +
                     id_style + "knowledge base id</div><div style='float: left'>" + knowledge_base.kbId + "</div><br clear='both'>" +
                     id_style + "security id</div><div style='float: left'>" + knowledge_base.securityId + "</div><br clear='both'>"
        })
    }
    downloadHtml(html, kb) {
        window.open(Comms.get_html_url(html, this.kba.selected_organisation_id, kb.kbId), '_blank');
    }
    render() {
        if (this.state.has_error) {
            return <h1>knowledge-bases.js: Something went wrong.</h1>;
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

                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow style={styles.tableHeaderStyle}>
                                <TableCell style={styles.tableHeaderStyle}>knowledge base</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>email queries to</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.getKnowledgeBases().map((knowledge_base) => {
                                    return (
                                        <TableRow key={knowledge_base.kbId}>
                                            <TableCell>
                                                <div style={styles.label}>{knowledge_base.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.label}>{knowledge_base.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.linkButton} onClick={() => this.editKnowledgeBase(knowledge_base)}>
                                                    <img src="../images/edit.svg" style={styles.dlImageSize} title="edit knowledge base" alt="edit"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.deleteKnowledgeBaseAsk(knowledge_base)}>
                                                    <img src="../images/delete.svg" style={styles.dlImageSize} title="remove knowledge base" alt="remove"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.viewIds(knowledge_base)}>
                                                    <img src="../images/id.svg" style={styles.dlImageSize} title="view knowledge base ids" alt="ids"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.downloadHtml("bot", knowledge_base)}>
                                                    <img src="../images/bot.svg" style={styles.dlImageSize} title="download knowledge-base bot HTML" alt="download bot"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.downloadHtml("operator", knowledge_base)}>
                                                    <img src="../images/operator.svg" style={styles.dlImageSize} title="download knowledge-base operator HTML" alt="download operator"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.downloadHtml("search", knowledge_base)}>
                                                    <img src="../images/search.svg" style={styles.dlImageSize} title="download knowledge-base search HTML" alt="download search"/>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell />
                                <TableCell />
                                <TableCell>
                                    {this.kba.selected_organisation_id.length > 0 &&
                                    <a style={styles.imageButton} onClick={() => this.addNewKnowledgeBase()}><img
                                        style={styles.addImage} src="../images/add.svg" title="add new user"
                                        alt="add new user"/></a>
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.kba.knowledge_base_list.length}
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

                </Paper>


                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.edit_knowledgebase}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={() => this.setState({edit_knowledgebase: false, knowledgeBase: null})} >
                    <DialogTitle>{this.state.edit_knowledgebase_id ? "Edit Knowledge Base" : "Add New Knowledge Base"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus={true}
                            style={styles.editBox}
                            placeholder="knowledge base name"
                            label="knowledge base name"
                            value={this.state.edit_name}
                            onChange = {(event) => this.setState({edit_name: event.target.value})}
                        />
                        <TextField
                            style={styles.editBox}
                            placeholder="email questions to"
                            label="email questions to"
                            value={this.state.edit_email}
                            onChange = {(event) => this.setState({edit_email: event.target.value})}
                        />
                        <div>
                            <div style={styles.textFieldBox}>
                                <TextField
                                    style={styles.editBox}
                                    disabled={true}
                                    placeholder="security id"
                                    label="security id"
                                    value={this.state.edit_security_id}
                                    onChange = {(event) => this.setState({edit_security_id: event.target.value})}
                                />
                            </div>
                            <div style={styles.imageBox}>
                                <img title="generate new security id" alt="refresh" src="../images/refresh.svg"
                                     onClick={() => this.refreshSecurityId()}
                                     style={styles.imageSize} />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this.editCancel()}>Cancel</Button>
                        <Button variant="outlined" color="secondary" onClick={() => this.editOk()}>Save</Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }
}

export default KnowledgeBases;
