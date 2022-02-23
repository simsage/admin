import React, {Component} from 'react';

import {CrawlerDialog} from '../crawlers/crawler-dialog'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import MessageDialog from "../common/message-dialog";
import CrawlerImportExport from "./crawler-import-export";
import {Pagination} from "../common/pagination";

import '../css/sources.css';
import Api from "../common/api";


const default_specific_json = '{"metadata_list":[' +
    '{"key":"created date range","display":"created","metadata":"created","db1":"","db2":"","sort":"true","sortDefault":"desc","sortAscText":"oldest documents first","sortDescText":"newest documents first", "fieldOrder": "0"},' +
    '{"key":"last modified date ranges","display":"last modified","metadata":"last-modified","db1":"","db2":"","sort":"true","sortDefault":"","sortAscText":"least recently modified","sortDescText":"most recently modified", "fieldOrder": "1"},' +
    '{"key":"document type","display":"document type","metadata":"document-type","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "2"}' +
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
        this.props.crawler_list.sort((a, b) => { return a.sourceId - b.sourceId });
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
    getCrawlerStatus(crawler) {
        if (crawler) {
            if (crawler.startTime <= 0)
                return "never started";
            if (crawler.endTime > crawler.startTime && crawler.optimizedTime > crawler.endTime)
                return "up to date since " + Api.unixTimeConvert(crawler.startTime);
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime > 0)
                    return "schedule disabled: last finished " + Api.unixTimeConvert(crawler.endTime);
                else if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime <= 0)
                    return "schedule disabled";
                else
                    return "running: started on " + Api.unixTimeConvert(crawler.startTime);
            }
            if (crawler.endTime > crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0 && crawler.endTime > 0)
                    return "schedule disabled: last finished " + Api.unixTimeConvert(crawler.endTime);
                if (crawler.numErrors === 0)
                    return "finished at " + Api.unixTimeConvert(crawler.startTime);
                else if (crawler.numErrors > crawler.errorThreshold)
                    return "failed with " + crawler.numErrors + " errors at " + Api.unixTimeConvert(crawler.startTime);
                else
                    return "finished at " + Api.unixTimeConvert(crawler.startTime);
            }
        }
        return "?";
    }
    isCrawlerRunning(crawler) {
        if (crawler) {
            if (crawler.startTime <= 0)
                return false;
            if (crawler.endTime > crawler.startTime && crawler.optimizedTime > crawler.endTime)
                return false;
            if (crawler.startTime > 0 && crawler.endTime < crawler.startTime) {
                if (Api.defined(crawler.schedule) && crawler.schedule.length === 0)
                    return false;
                else
                    return true;
            }
            if (crawler.endTime > crawler.startTime) {
                return false;
            }
        }
        return false;
    }
    zipSourceAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to zip the content of <b>" + crawler.name + "</b>?",
            "Zip Source", (action) => { this.zipSource(action) });
    }
    zipSource(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.zipSource(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    startCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to start <b>" + crawler.name + "</b>?",
            "Start Crawler", (action) => { this.startCrawler(action) });
    }
    startCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.startCrawler(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    resetCrawlersAsk() {
        this.props.openDialog("Are you sure you want to reset all crawlers?  This will clear crawler schedules, and mark their files as out-of-date.",
            "Reset Crawlers", (action) => { this.resetCrawlers(action) });
    }
    resetCrawlers(action) {
        if (action) {
            this.props.resetCrawlers(this.props.selected_organisation_id, this.props.selected_knowledgebase_id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    render() {
        const theme = this.props.theme;
        return (
            <div>
                <CrawlerDialog
                    open={this.state.open}
                    title={this.state.title}
                    theme={theme}
                    session={this.props.session}
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
                                    <th className='table-header'>id</th>
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
                                        const description = this.getCrawlerStatus(crawler);
                                        const is_running = this.isCrawlerRunning(crawler);
                                        return (
                                            <tr key={crawler.sourceId}>
                                                <td>
                                                    <div className="source-label">{crawler.sourceId}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.name}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.crawlerType}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label small-label-size" title={description}>{description}</div>
                                                </td>
                                                <td>
                                                    <div className="source-label">{crawler.numCrawledDocuments + " / " + crawler.numIndexedDocuments}</div>
                                                </td>
                                                <td>
                                                    {!is_running &&
                                                    <div className="link-button"
                                                         onClick={() => this.startCrawlerAsk(crawler)}>
                                                        <img src="../images/play.svg" className="image-size"
                                                             title="start this crawler" alt="start"/>
                                                    </div>
                                                    }
                                                    {is_running &&
                                                    <div className="link-button">
                                                        <img src="../images/play-disabled.svg" className="image-size"
                                                             title="crawler running" alt="start"/>
                                                    </div>
                                                    }
                                                    <div className="link-button" onClick={() => this.editCrawler(crawler)}>
                                                        <img src="../images/edit.svg" className="image-size" title="edit crawler" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteCrawlerAsk(crawler)}>
                                                        <img src="../images/delete.svg" className="image-size" title="remove crawler" alt="remove"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.exportCrawler(crawler)}>
                                                        <img src="../images/download.svg" className="image-size" title="get crawler JSON for export" alt="export"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.zipSourceAsk(crawler)}>
                                                        <img src="../images/zip.svg" className="image-size" title="zip all files in a source" alt="zip files"/>
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
                                    <td/>
                                    <td>
                                        {this.props.selected_organisation_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.addNewCrawler()}><img
                                                className="image-size" src="../images/add.svg" title="add new crawler"
                                                alt="add new crawler"/></div>
                                        }
                                        {this.props.selected_knowledgebase_id.length > 0 &&
                                            <div className="image-button" onClick={() => this.resetCrawlersAsk()}><img
                                                className="image-size" src="../images/refresh.svg" title="reset crawlers"
                                                alt="reset crawlers"/></div>
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

        session: state.appReducer.session,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        selected_knowledgebase: state.appReducer.selected_knowledgebase,            // the name
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
