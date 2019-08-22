import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {CrawlerDialog} from './crawler-dialog'
import MessageDialog from '../common/message-dialog'
import ErrorDialog from '../common/error-dialog'
import {AutoComplete} from "../common/autocomplete";
import {Api} from "../common/api";
import {Comms} from "../common/comms";

const id_style = "<div style='width: 170px; float: left; height: 24px;'>";

const styles = {
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

export class DocumentSources extends Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,

            busy: false,

            crawler_list: [],

            // error message
            error_title: '',
            error_msg: '',

            // crawler dialog error messages
            crawler_error_title: '',
            crawler_error_msg: '',

            // pagination
            page_size: 5,
            page: 0,

            // dialog
            open: false,
            title: '',
            selected_crawler: {},

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            message_title: '',
            message: '',
            crawler_ask: null,
        };
    }
    componentDidCatch(error, info) {
        this.setState({has_error: true, busy: false});
        console.log(error, info);
    }
    componentWillReceiveProps(nextProps) {
        this.kba = nextProps.kba;
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentWillMount() {
        this.getCrawlerList(this.state.page, this.state.page_size);
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg, busy: false});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    changeKB() {
        this.setState({prev_page: 'null'});
        this.getCrawlerList('null', this.state.page_size);
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
        for (const i in this.state.crawler_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.state.crawler_list[i]);
            }
        }
        return paginated_list;
    }
    addNewCrawler() {
        if (this.state.openDialog) {
            this.state.openDialog();
        }
        this.setState({open: true, selected_crawler: {id: '', crawlerType: '', name: '', description: '',
                             schedule: '', filesPerSecond: '0', specificJson: ''}, title: 'Create New Crawler'});
    }
    updateUI(crawler) {
        this.setState({selected_crawler: crawler});
    }
    editCrawler(crawler) {
        if (crawler) {
            if (this.state.openDialog) {
                this.state.openDialog();
            }
            this.setState({open: true, selected_crawler: crawler, title: 'Edit Crawler'});
        }
    }
    getCrawlerList(prev_page, page_size) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0) {
            this.setState({busy: true});
            Api.getCrawlers(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id,
                (crawler_list) => {
                    if (crawler_list) {
                        this.setState({crawler_list: crawler_list});
                    }
                    this.setState({busy: false});
                },
                (errStr) => {
                    this.showError("Error", errStr);
                });
        }
    }
    deleteCrawlerAsk(crawler) {
        this.setState({
            crawler_ask: crawler,
            message_callback: (action) => this.confirmCrawlerDelete(action),
            message_title: 'delete "' + crawler.name + '"?',
            message: 'Are you sure you want to remove the crawler named <b>' + crawler.name + '</b>?'
        });
    }
    saveCrawler(crawler) {
        if (crawler) {
            const self = this;
            crawler.organisationId = this.kba.selected_organisation_id;
            crawler.kbId = this.kba.selected_knowledgebase_id;
            this.setState({busy: true});
            Api.updateCrawler(crawler,
                (response) => {
                    self.setState({open: false, selected_crawler: null, busy: false});
                    self.getCrawlerList(self.state.page, self.state.page_size);
                    if (this.state.closeDialog) {
                        this.state.closeDialog();
                    }
                },
                (error) => {
                    this.setState({crawler_error_title: 'Error', crawler_error_msg: error, selected_crawler: crawler, busy: false});
                }
            )
        } else {
            this.setState({open: false});
            if (this.state.closeDialog) {
                this.state.closeDialog();
            }
        }
    }
    confirmCrawlerDelete(confirm) {
        const self = this;
        this.setState({message: '', message_title: ''});
        if (confirm) {
            this.setState({busy: true});
            const crawler = this.state.crawler_ask;
            const self = this;
            Api.deleteCrawler(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, crawler.id,
                (response) => {
                    this.setState({busy: false});
                    self.getCrawlerList(self.state.page, self.state.page_size);
                },
                (error) => {
                    self.showError('Error', error);
                }
            );
        }
    }
    downloadCrawler(crawler) {
        window.open(Comms.get_crawler_url(this.kba.selected_organisation_id,
                                          this.kba.selected_knowledgebase_id, crawler.id), '_blank');
    }
    viewIds(crawler) {
        this.setState({message_title: '"' + crawler.name + "\" Crawler Id",
            message_callback: (action) => { this.setState({message: ""}) },
            message: id_style + "crawler id</div><div style='float: left'>" + crawler.id + "</div><br clear='both'>"
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawlers.js: Something went wrong.</h1>;
        }
        const self = this;
        return (
            <div>

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

                <ErrorDialog title={this.state.error_title}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)}/>

                <CrawlerDialog
                    open={this.state.open}
                    title={this.state.title}
                    organisation_id={this.kba.selected_organisation_id}
                    kb_id={this.kba.selected_knowledgebase_id}
                    onSave={(crawler) => this.saveCrawler(crawler)}
                    onUpdate={(crawler) => this.updateUI(crawler)}
                    onError={(title, errStr) => this.showError(title, errStr)}
                    error_title={this.state.crawler_error_title}
                    error_msg={this.state.crawler_error_msg}
                    crawler={this.state.selected_crawler}
                />

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
                    <Paper>
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
                                                    {/*<div style={styles.linkButton} onClick={() => this.viewIds(crawler)}>*/}
                                                    {/*    <img src="../images/id.svg" style={styles.downloadImage} title="view crawler ids" alt="ids"/>*/}
                                                    {/*</div>*/}
                                                    {/*<div style={styles.linkButton} onClick={() => this.downloadCrawler(crawler)}>*/}
                                                    {/*    <img style={styles.downloadImage} alt="download" title="download crawler software" src="../images/download.svg" />*/}
                                                    {/*</div>*/}
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
                            count={this.state.crawler_list.length}
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

export default DocumentSources;
