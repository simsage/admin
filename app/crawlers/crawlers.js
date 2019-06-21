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
};

export class Crawlers extends Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,

            crawler_list: [],

            // error message
            error_title: '',
            error_msg: '',

            // crawler dialog error messages
            crawler_error_title: '',
            crawler_error_msg: '',

            // pagination
            page_size: 10,
            nav_list: ['null'],
            page: 0,
            prev_page: 'null',

            // dialog
            open: false,
            title: '',
            selected_crawler: {},

            // delete crawler
            remove_crawler_message: '',
            crawler_ask: null,
        };
    }
    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }
    componentWillReceiveProps(nextProps) {
        this.kba = nextProps.kba;
    }
    componentWillMount() {
        this.getCrawlerList(this.state.prev_page, this.state.page_size);
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    changePage(page) {
        const page0 = this.state.page;
        const crawler_list = this.state.crawler_list;
        const nav_list = this.state.nav_list;
        if (page0 !== page && page >= 0) {
            if (page0 < page) {
                // next page
                if (crawler_list.length > 0) {
                    const prev = crawler_list[crawler_list.length - 1].id;
                    nav_list.push(prev);
                    this.setState({nav_list: nav_list, page: page});
                    this.getCrawlerList(prev, this.state.page_size);
                }
            } else {
                // prev page
                const prev = nav_list[page];
                this.setState({page: page});
                this.getCrawlerList(prev, this.state.page_size);
            }
        }
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
        this.getCrawlerList(this.state.prev_page, page_size);
    }
    addNewCrawler() {
        this.setState({open: true, selected_crawler: {id: '', crawlerType: '', name: '', description: '',
                             schedule: '', filesPerSecond: '0', specificJson: ''}, title: 'Create New Crawler'});
    }
    editCrawler(crawler) {
        if (crawler) {
            this.setState({open: true, selected_crawler: crawler, title: 'Edit Crawler'});
        }
    }
    getCrawlerList(prev_page, page_size) {
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0) {
            Api.getCrawlersPaginated(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, prev_page, page_size,
                (crawler_list) => {
                    if (crawler_list && crawler_list.length) {
                        this.setState({crawler_list: crawler_list});
                    }
                },
                (errStr) => {
                    this.showError("Error", errStr);
                });
        }
    }
    deleteCrawlerAsk(crawler) {
        this.setState({
            crawler_ask: crawler,
            remove_crawler_message: 'Are you sure you want to remove the crawler named <b>' + crawler.name + '</b>?'
        });
    }
    static downloadCrawler(crawler) {
        if (crawler && crawler.crawlerType) {
            const filename = crawler.crawlerType + "_crawler:zip";
            window.location.assign(url('/crawler/dl/' + filename));
        }
    }
    saveCrawler(crawler) {
        if (crawler) {
            const self = this;
            crawler.organisationId = this.kba.selected_organisation_id;
            crawler.kbId = this.kba.selected_knowledgebase_id;
            Api.updateCrawler(crawler,
                (response) => {
                    self.setState({open: false, selected_crawler: null});
                    self.getCrawlerList(self.state.prev_page, self.state.page_size);
                },
                (error) => {
                    this.setState({crawler_error_title: 'Error', crawler_error_msg: error, selected_crawler: crawler});
                }
            )
        } else {
            this.setState({open: false});
        }
    }
    confirmCrawlerDelete(confirm) {
        const self = this;
        this.setState({remove_crawler_message: ''});
        if (confirm) {
            const crawler = this.state.crawler_ask;
            const self = this;
            Api.deleteCrawler(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, crawler.id,
                (response) => {
                    self.getCrawlerList(self.state.prev_page, self.state.page_size);
                },
                (error) => {
                    self.showError('Error', error);
                }
            );
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawlers.js: Something went wrong.</h1>;
        }
        const self = this;
        return (
            <div>

                <MessageDialog title='Remove crawler'
                               message={this.state.remove_crawler_message}
                               callback={this.confirmCrawlerDelete.bind(this)} />

                <ErrorDialog title={this.state.error_title}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)}/>

                <CrawlerDialog
                    open={this.state.open}
                    title={this.state.title}
                    onSave={(crawler) => this.saveCrawler(crawler)}
                    onError={(title, errStr) => this.showError(title, errStr)}
                    error_title={this.state.crawler_error_title}
                    error_msg={this.state.crawler_error_msg}
                    crawler={this.state.selected_crawler}
                />

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

                {
                    this.kba.selected_knowledgebase_id.length > 0 &&
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableHeaderStyle}>name</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>type</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>crawler id</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.state.crawler_list.map((crawler) => {
                                        return (
                                            <TableRow key={crawler.id}>
                                                <TableCell>
                                                    <div style={styles.label}>{crawler.name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{crawler.crawlerType}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{crawler.id}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <a style={styles.linkButton}
                                                       onClick={() => this.editCrawler(crawler)}>edit</a>
                                                    <a style={styles.linkButton}
                                                       onClick={() => this.deleteCrawlerAsk(crawler)}>delete</a>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell/>
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
                            count={this.state.crawler_list.length + 1}
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

export default Crawlers;
