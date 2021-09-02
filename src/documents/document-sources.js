import React, {Component} from 'react';

import {CrawlerDialog} from '../crawlers/crawler-dialog'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import MessageDialog from "../common/message-dialog";
import CrawlerImportExport from "./crawler-import-export";
import {Pagination} from "../common/pagination";

import '../css/sources.css';

const default_specific_json = '{"metadata_list":[' +
    '{"key":"created date range","display":"created","field1":"created","db1":"","db2":"","sort":"true","sort_default":"desc","sort_asc":"oldest documents first","sort_desc":"newest documents first"},' +
    '{"key":"last modified date ranges","display":"last modified","field1":"last-modified","db1":"","db2":"","sort":"true","sort_default":"","sort_asc":"least recently modified","sort_desc":"most recently modified"},' +
    '{"key":"document type","display":"document type","field1":"document-type","db1":"","db2":"","sort":"","sort_default":"","sort_asc":"","sort_desc":""}' +
    ']}';

// default values for an empty / new crawler
const empty_crawler= {id: '', sourceId: '0', crawlerType: '', name: '', deleteFiles: true, allowAnonymous: false,
                      enablePreview: true, schedule: '', filesPerSecond: '0', specificJson: default_specific_json,
                      processingLevel: 'SEARCH', nodeId: '0', maxItems: '0', maxQNAItems: '0', customRender: false, "acls": []};

export class DocumentSources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // pagination
            page_size: 5,
            page: 0,
            // dialog
            open: false,
            export_open: false,
            export_upload: false,
            title: '',
            selected_crawler: {},
            crawler_ask: null,

            // messages
            message_callback: null,
            message: '',
            message_title: '',
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
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            this.props.deleteCrawler(this.state.crawler_ask.sourceId);
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
    canDeleteDocuments(crawler) {
        return crawler.crawlerType !== 'wordpress';
    }
    exportCrawler(crawler) {
        this.setState({selected_crawler: crawler, export_upload: false, export_open: true})
    }
    importCrawler() {
        this.setState({selected_crawler: {}, export_upload: true, export_open: true})
    }
    saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            const crawler = JSON.parse(crawler_str);
            delete crawler.sourceId;
            this.saveCrawler(crawler);
        }
        this.setState({export_open: false, selected_crawler: {}});
    }
    render() {
        const theme = this.props.theme;
        return (
            <div>
                <CrawlerDialog
                    open={this.state.open}
                    title={this.state.title}
                    theme={theme}
                    organisation_id={this.props.selected_organisation_id}
                    kb_id={this.props.selected_knowledgebase_id}
                    user_list={this.props.user_list}
                    onSave={(crawler) => this.saveCrawler(crawler)}
                    onUpdate={(crawler) => this.onUpdate(crawler)}
                    onError={(title, errStr) => this.props.setError(title, errStr)}
                    error_title={this.props.error_title}
                    error_msg={this.props.error}
                    wpUploadArchive={(data) => this.props.wpUploadArchive(data) }
                    group_list={this.props.group_list}
                    crawler={this.state.selected_crawler}
                    edge_device_list={this.props.edge_device_list}
                />

                <CrawlerImportExport
                    open={this.state.export_open}
                    theme={theme}
                    upload={this.state.export_upload}
                    crawler={this.state.selected_crawler}
                    export_upload={this.state.export_upload}
                    onSave={(crawler) => this.saveExport(crawler) }
                    onError={(title, errStr) => this.props.setError(title, errStr)}
                />

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               theme={this.props.theme}
                               message={this.state.message}
                               title={this.state.message_title} />

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <div className="source-page">
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>name</th>
                                    <th className='table-header'>type</th>
                                    <th className='table-header'>status</th>
                                    <th className='table-header'>crawled / indexed</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.getCrawlers().map((crawler) => {
                                        return (
                                            <tr key={crawler.sourceId}>
                                                <td>
                                                    <div className="source-label">{crawler.name}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.crawlerType}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.isCrawling ? "busy" : "idle"}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editCrawler(crawler)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit crawler" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteCrawlerAsk(crawler)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove crawler" alt="remove"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.exportCrawler(crawler)}>
                                                        <img src="../images/download.svg" className="image-size" title="get crawler JSON for export" alt="export"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td>
                                        {this.props.selected_organisation_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.addNewCrawler()}><img
                                                className="image-size" src="../images/add.svg" title="add new crawler"
                                                alt="add new crawler"/></div>
                                        }
                                        {this.props.selected_organisation_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.importCrawler()}><img
                                                className="image-size" src="../images/upload.svg" title="upload crawler JSON"
                                                alt="import"/></div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Pagination
                            rowsPerPageOptions={[5, 10, 25]}
                            theme={theme}
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
                            onChangePage={(page) => this.changePage(page)}
                            onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                        />

                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        user_list: state.appReducer.user_list,
        user_filter: state.appReducer.user_filter,
        crawler_list: state.appReducer.crawler_list,
        edge_device_list: state.appReducer.edge_device_list,

        group_list: state.appReducer.group_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(DocumentSources);
