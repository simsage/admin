import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {CrawlerDialog} from '../crawlers/crawler-dialog'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import CrawlerGeneral from "../crawlers/crawler-general";

const empty_crawler= {id: '', crawlerType: '', name: '', deleteFiles: true, allowAnonymous: true,
                      enablePreview: false, enableIndexing: true, description: '', schedule: '',
                      filesPerSecond: '0', specificJson: ''};

const styles = {
    pageWidth: {
        width: '900px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    addImage: {
        width: '25px',
        cursor: 'pointer',
        color: "green",
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
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    label: {
        marginTop: '20px',
        color: '#555',
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
    download: {
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: '600',
        height: '24px',
    },
    downloadType: {
        fontSize: '0.9em',
        height: '24px',
    },
    downloadImage: {
        width: '24px',
    },
    labelHeader: {
        marginTop: '20px',
        marginBottom: '5px',
        fontSize: '0.8em',
    },
};

export class DocumentSources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // pagination
            page_size: 5,
            page: 0,
            // dialog
            open: false,
            title: '',
            selected_crawler: {},
            crawler_ask: null,
        };
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
    getCrawlers() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        for (const i in this.props.crawler_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.crawler_list[i]);
            }
        }
        return paginated_list;
    }
    addNewCrawler() {
        this.setState({open: true, selected_crawler: empty_crawler, title: 'Create New Crawler'});
    }
    onUpdate(crawler) {
        this.setState({selected_crawler: crawler});
    }
    editCrawler(crawler) {
        if (crawler) {
            this.setState({open: true, selected_crawler: { ...empty_crawler, ...crawler}, title: 'Edit Crawler'});
        }
    }
    deleteCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to remove the crawler named <b>" + crawler.name + "</b>?",
            "Remove Crawler", (action) => { this.deleteCrawler(action) });
    }
    deleteCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.id) {
            this.props.deleteCrawler(this.state.crawler_ask.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    saveCrawler(crawler) {
        if (crawler) {
            crawler.organisationId = this.props.selected_organisation_id;
            crawler.kbId = this.props.selected_knowledgebase_id;
            this.props.updateCrawler(crawler);
        }
        this.setState({open: false});
    }
    render() {
        return (
            <div>
                <CrawlerDialog
                    open={this.state.open}
                    title={this.state.title}
                    organisation_id={this.props.selected_organisation_id}
                    kb_id={this.props.selected_knowledgebase_id}
                    onSave={(crawler) => this.saveCrawler(crawler)}
                    onUpdate={(crawler) => this.onUpdate(crawler)}
                    onError={(title, errStr) => this.props.setError(title, errStr)}
                    error_title={this.props.error_title}
                    error_msg={this.props.error}
                    crawler={this.state.selected_crawler}
                />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <Paper style={styles.pageWidth}>
                        <Table>
                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableHeaderStyle}>name</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>type</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.getCrawlers().map((crawler) => {
                                        return (
                                            <TableRow key={crawler.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{crawler.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{crawler.crawlerType}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editCrawler(crawler)}>
                                                        <img src="../images/edit.svg" style={styles.downloadImage} title="edit crawler" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteCrawlerAsk(crawler)}>
                                                        <img src="../images/delete.svg" style={styles.downloadImage} title="remove crawler" alt="remove"/>
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
                                        {this.props.selected_organisation_id.length > 0 &&
                                        <a style={styles.imageButton} onClick={() => this.addNewCrawler()}><img
                                            style={styles.addImage} src="../images/add.svg" title="add new crawler"
                                            alt="add new crawler"/></a>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.crawler_list.length}
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

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        crawler_list: state.appReducer.crawler_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(DocumentSources);
