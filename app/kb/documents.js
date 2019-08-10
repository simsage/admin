import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {Api} from '../common/api'
import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'
import {AutoComplete} from "../common/autocomplete";
import {DocumentUpload} from "../common/document-upload";


const styles = {
    tableStyle: {
        minWidth: '800px',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '200px',
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
    floatLeft: {
        float: 'left',
    },
    searchFloatLeft: {
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
    text: {
        padding: '4px',
        width: '280px',
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


export class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            busy: false,

            document_list: [],
            num_documents: 0,
            document: null,

            // pagination maintenance
            nav_list: [],
            page: 0,

            error_msg: "",
            error_title: "",

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            message_title: "",
            message: "",
            message_callback: null,

            // pagination
            filter: "",
            page_size: 10,
            prev_page: 'null',
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
        this.refreshDocuments(this.state.prev_page, this.state.page_size);
    }
    changeKB() {
        this.setState({prev_page: 'null'});
        this.refreshDocuments('null', this.state.page_size);
    }
    refreshDocuments(prev_page, page_size) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0) {
            this.setState({busy: true});
            Api.getDocumentsPaginated(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id,
                                      this.state.filter, prev_page, page_size,
                (result) => {
                    this.setState({document_list: result.documentList, num_documents: result.numDocuments, busy: false})
                },
                (errStr) => {
                    this.showError("Error", errStr)
                }
            )
        }
    }
    changePage(page) {
        const page0 = this.state.page;
        const document_list = this.state.document_list;
        const nav_list = this.state.nav_list;
        if (page0 !== page && page >= 0) {
            if (page0 < page) {
                // next page
                if (document_list.length > 0) {
                    const prev = document_list[document_list.length - 1].url;
                    nav_list.push(prev);
                    this.setState({nav_list: nav_list, prev_page: prev, page: page});
                    this.refreshDocuments(prev, this.state.page_size);
                }
            } else {
                // prev page
                const prev = nav_list[page];
                this.setState({pev_page: prev, page: page});
                this.refreshDocuments(prev, this.state.page_size);
            }
        }
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
        this.refreshDocuments(this.state.prev_page, page_size);
    }
    deleteDocumentAsk(document) {
        if (document) {
            this.setState({message_title: "Remove Document",
                message_callback: (action) => { this.deleteDocument(action) },
                message: "are you sure you want to remove \"" + document.url + "\" ?",
                document: document})
        }
    }
    deleteDocument(action) {
        if (action && this.state.document) {
            this.setState({busy: true});
            Api.deleteDocument(this.kba.selected_organisation_id,
                               this.kba.selected_knowledgebase_id, this.state.document.url, () => {
                    this.setState({message_title: "", message: "", busy: false});
                    this.refreshDocuments(this.state.prev_page, this.state.page_size);
                }, (errStr) => {
                    this.setState({message_title: "", message: "", busy: false,
                        error_msg: errStr, error_title: "Error Removing Document"});
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
            this.refreshDocuments(this.state.prev_page, this.state.page_size);
        }
    }
    documentUploaded() {
        this.refreshDocuments(this.state.prev_page, this.state.page_size);
        this.setState({message_title: "done", message: "document uploaded",
            message_callback: () => { this.setState({message: ""})}});
    }
    viewDocument(document) {
    }
    render() {
        if (this.state.has_error) {
            return <h1>documents.js: Something went wrong.</h1>;
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
                        <div style={styles.floatLeftLabel}>filter</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.state.filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.setState({filter: event.target.value})
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.refreshDocuments(this.state.prev_page, this.state.page_size)}
                                 src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.kba.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableHeaderStyle}>url</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.document_list.map((document) => {
                                        return (
                                            <TableRow key={document.url}>
                                                <TableCell>
                                                    <div style={styles.label}>{document.url}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.deleteDocumentAsk(document)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove document" alt="remove"/>
                                                    </div>
                                                    {/*<a style={styles.linkButton} onClick={() => this.viewDocument(document)}>download</a>*/}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.state.num_documents}
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
                }

                {this.kba.selected_knowledgebase_id &&
                    <div style={styles.manualUploadSection}>
                        <div>manually upload a document</div>
                        <div>
                            <DocumentUpload kbId={this.kba.selected_knowledgebase_id}
                                            organisationId={this.kba.selected_organisation_id}
                                            onUploadDone={() => this.documentUploaded()}
                                            onError={(errStr) => this.showError("Error", errStr)}/>
                        </div>
                    </div>
                }

            </div>
        )
    }
}

export default Documents;
