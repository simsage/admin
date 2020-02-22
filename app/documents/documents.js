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
import Grid from "@material-ui/core/Grid";

// display length of a url
const maxUrlDisplayLength = 50;

const styles = {
    tableStyle: {
        width: '900px',
    },
    gridWidth: {
        width: '900px',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        width: '900px',
        color: '#fff',
        minWidth: '100px',
    },
    tableColumnStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
        minWidth: '100px',
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
    urlLabel: {
        padding: '10px',
        color: '#555',
        maxWidth: '200px',
    },
    label: {
        padding: '10px',
        color: '#555',
    },
    statusImage: {
        width: '16px',
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
        marginRight: '10px',
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
    }
    deleteDocumentAsk(document) {
        if (document) {
            this.props.openDialog("are you sure you want to remove \"" + document.url + "\" ?", "Remove Document", (action) => { this.deleteDocument(action) });
            this.setState({document: document});
        }
    }
    deleteDocument(action) {
        if (action && Api.defined(this.state.document)) {
            this.props.deleteDocument(this.state.document.url, this.state.document.sourceId);
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
    // return: 0 => to do, 1 => done, 2 => disabled
    getActive(document, stage) {
        if (stage === "crawled") {
            if (document.crawled > 0)
                return 1;
        } else if (stage === "converted") {
            if (document.converted > 0)
                return 1;
            else if (document.converted < 0)
                return 2;
        } else if (stage === "parsed") {
            if (document.converted > 0 && document.converted <= document.parsed)
                return 1;
            else if (document.parsed < 0)
                return 2;
        } else if (stage === "indexed") {
            if (document.converted > 0 && document.parsed > 0 && document.parsed <= document.indexed)
                return 1;
            else if (document.indexed < 0)
                return 2;
        } else if (stage === "previewed") {
            if (document.previewed > 0)
                return 1;
            else if (document.previewed < 0)
                return 2;
        }
        return 0;
    }
    getStatus(document, stage) {
        const status = this.getActive(document, stage);
        if (status === 1)
            return "../images/dot-green.svg";
        else if (status === 0)
            return "../images/dot-orange.svg";
        else
            return "../images/dot-grey.svg";
    }
    getStatusText(document, stage, staging) {
        const status = this.getActive(document, stage);
        if (status === 1)
            return "document " + stage;
        else if (status === 0)
            return "document not yet " + stage;
        else
            return staging + " disabled for this document-source";
    }
    render() {
        return (
            <Grid container spacing={1} style={styles.gridWidth}>

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Grid item xs={12}>
                        <div style={styles.findBox}>
                            <div style={styles.floatLeftLabel}>filter</div>
                            <div style={styles.searchFloatLeft}>
                                <input type="text" value={this.props.document_filter} autoFocus={true} style={styles.text}
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
                    </Grid>
                }


                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Paper style={styles.tableStyle}>
                        <Table>

                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableColumnStyle}>url</TableCell>
                                    <TableCell style={styles.tableColumnStyle}>source</TableCell>
                                    <TableCell style={styles.tableColumnStyle}>last modified</TableCell>
                                    <TableCell style={styles.tableColumnStyle}>status</TableCell>
                                    <TableCell style={styles.tableColumnStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {
                                    this.getDocuments().map((document) => {
                                        return (
                                                <TableRow>
                                                    <TableCell>
                                                        {
                                                            Documents.isWeb(document.url) &&
                                                            <div style={styles.urlLabel}>
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
                                                        <div style={styles.label}>
                                                            <img src={this.getStatus(document, "crawled")} style={styles.statusImage} alt="crawler" title={this.getStatusText(document, "crawled", "crawling")} />
                                                            <img src={this.getStatus(document, "converted")} style={styles.statusImage} alt="converted" title={this.getStatusText(document, "converted", "converting")} />
                                                            <img src={this.getStatus(document, "parsed")} style={styles.statusImage} alt="parsed" title={this.getStatusText(document, "parsed", "parsing")} />
                                                            <img src={this.getStatus(document, "indexed")} style={styles.statusImage} alt="indexed" title={this.getStatusText(document, "indexed", "indexing")} />
                                                            <img src={this.getStatus(document, "previewed")} style={styles.statusImage} alt="previewed" title={this.getStatusText(document, "previewed", "preview generation")} />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div style={styles.linkButton} onClick={() => this.deleteDocumentAsk(document)}>
                                                            <img src="../images/delete.svg" style={styles.dlImageSize} title="remove document" alt="remove"/>
                                                        </div>
                                                        {/*<div style={styles.linkButton} onClick={() => this.props.reprocessDocument(document)}>*/}
                                                        {/*    <img src="../images/refresh.svg" style={styles.dlImageSize} title="reprocess document (remove it, re-parse and re-index the document." alt="reprocess"/>*/}
                                                        {/*</div>*/}
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

            </Grid>
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

