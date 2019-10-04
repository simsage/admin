import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

// display length of a url
const maxUrlDisplayLength = 50;

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
};


export class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            document: null,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
        this.props.getDocuments();
    }
    refreshDocuments(prev_page, page_size) {
    }
    deleteDocumentAsk(document) {
        if (document) {
            this.props.openDialog("are you sure you want to remove \"" + document.url + "\" ?", "Remove Document", (action) => { this.deleteDocument(action) });
            this.setState({document: document});
        }
    }
    deleteDocument(action) {
        if (action && Api.defined(this.state.document)) {
            this.props.deleteDocument(this.state.document.url);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getDocuments();
        }
    }
    documentUploaded() {
        this.refreshDocuments(this.state.prev_page, this.state.page_size);
        this.setState({message_title: "done", message: "document uploaded",
            message_callback: () => { this.setState({message: ""})}});
    }
    getDocuments() {
        return this.props.document_list;
    }
    static isWeb(url) {
        return (url.toLowerCase().startsWith("http://") || url.toLowerCase().startsWith("https://"));
    }
    static adjustUrl(url) {
        if (url && url.length > maxUrlDisplayLength) {
            const half = Math.floor(maxUrlDisplayLength / 2);
            return url.substring(0, half) + " ... " + url.substring(url.length - half);
        }
        return url;
    }
    viewDocument(document) {
    }
    render() {
        return (
            <div>
                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <div style={styles.findBox}>
                        <div style={styles.floatLeftLabel}>filter</div>
                        <div style={styles.searchFloatLeft}>
                            <input type="text" value={this.state.filter} autoFocus={true} style={styles.text}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setDocumentFilter(event.target.value)
                                   }}/>
                        </div>
                        <div style={styles.floatLeft}>
                            <img style={styles.search}
                                 onClick={() => this.props.getDocuments()}
                                 src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                        </div>
                    </div>
                }

                <br clear="both" />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table style={styles.tableStyle}>
                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableHeaderStyle}>url</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>source</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>last modified</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.getDocuments().map((document) => {
                                        return (
                                            <TableRow key={document.url}>
                                                <TableCell>
                                                    {
                                                        Documents.isWeb(document.url) &&
                                                        <div style={styles.label}>
                                                            <a href={document.url} title={document.url} target="_blank">{Documents.adjustUrl(document.url)}</a>
                                                        </div>
                                                    }
                                                    {
                                                        !Documents.isWeb(document.url) &&
                                                        <div style={styles.label}>{Documents.adjustUrl(document.url)}</div>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{document.origin}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{Api.unixTimeConvert(document.lastModified)}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.deleteDocumentAsk(document)}>
                                                        <img src="../images/delete.svg" style={styles.dlImageSize} title="remove document" alt="remove"/>
                                                    </div>
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
                            count={this.props.num_documents}
                            rowsPerPage={this.props.document_page_size}
                            page={this.props.document_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(event, page) => this.props.setDocumentPage(page)}
                            onChangeRowsPerPage={(event) => this.props.setDocumentPageSize(event.target.value)}
                        />

                    </Paper>
                }

                <br />
                <br />
                <br />
                <br />

                {/*{this.props.selected_knowledgebase_id &&*/}
                {/*    <div style={styles.manualUploadSection}>*/}
                {/*        <div>manually upload a document</div>*/}
                {/*        <div>*/}
                {/*            <DocumentUpload kbId={this.props.selected_knowledgebase_id}*/}
                {/*                            organisationId={this.props.selected_organisation_id}*/}
                {/*                            onUploadDone={() => this.documentUploaded()}*/}
                {/*                            onError={(errStr) => this.props.setError("Error", errStr)}/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*}*/}

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        document_list: state.appReducer.document_list,
        document_filter: state.appReducer.document_filter,
        document_page: state.appReducer.document_page,
        document_page_size: state.appReducer.document_page_size,
        document_nav_list: state.appReducer.document_nav_list,
        num_documents: state.appReducer.num_documents,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Documents);

