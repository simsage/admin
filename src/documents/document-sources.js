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
    '{"key":"document type","display":"document type","metadata":"document-type","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "2"},' +
    '{"key":"categorical list","display":"document category","metadata":"categorization","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "3"}' +
    ']}';

// default values for an empty / new crawler
const empty_crawler = {
    id: '',
    sourceId: '0',
    crawlerType: '',
    name: '',
    deleteFiles: true,
    allowAnonymous: false,
    enablePreview: true,
    schedule: '',
    filesPerSecond: '0',
    specificJson: default_specific_json,
    processingLevel: 'INDEX',
    nodeId: '0',
    maxItems: '0',
    maxQNAItems: '0',
    customRender: false,
    acls: window.ENV.new_source_security_groups,
    useDefaultRelationships: true,
    autoOptimize: false,
    storeBinary: true,
    processorConfig: '',
    versioned: false,
    writeToCassandra: true,
    documentSimilarityThreshold: 0.9,
    enableDocumentSimilarity: false,
    isExternal: false
};

export class DocumentSources extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        this.props.setSourcePage(page);
    }

    changePageSize(page_size) {
        this.props.setSourcePageSize(page_size);
    }

    getCrawlers() {
        const paginated_list = [];
        const first = parseInt('' + this.props.source_page) * parseInt('' + this.props.source_page_size);
        const last = first + parseInt('' + this.props.source_page_size);
        this.props.crawler_list.sort((a, b) => {
            return a.sourceId - b.sourceId
        });
        for (const i in this.props.crawler_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.crawler_list[i]);
            }
        }
        console.log("first, last", first, last);
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
            this.setState({open: true, selected_crawler: {...empty_crawler, ...crawler}, title: 'Edit Crawler'});
        }
    }

    deleteCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to remove the crawler named <b>" + crawler.name + "</b>?",
            "Remove Crawler", (action) => {
                this.deleteCrawler(action)
            });
    }

    deleteCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            this.props.deleteCrawler(this.state.crawler_ask.sourceId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    saveCrawler(crawler, on_success) {
        if (crawler) {
            crawler.organisationId = this.props.selected_organisation_id;
            crawler.kbId = this.props.selected_knowledgebase_id;
            this.props.updateCrawler(crawler, () => {
                this.setState({open: false});
                if (on_success)
                    on_success();
            });
        } else {
            this.setState({open: false});
        }
    }

    exportCrawler(crawler) {
        this.setState({selected_crawler: crawler, export_upload: false, export_open: true})
    }

    importCrawler() {
        this.setState({selected_crawler: {}, export_upload: true, export_open: true})
    }

    saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            try {
                const crawler = JSON.parse(crawler_str);
                delete crawler.sourceId;
                this.saveCrawler(crawler, () => {
                    this.setState({export_open: false, selected_crawler: {}});
                });
            } catch (e) {
                alert(e);
            }

            // close dialog?
        } else if (crawler_str === null) {
            this.setState({export_open: false, selected_crawler: {}});
        }
    }

    zipSourceAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to zip the content of <b>" + crawler.name + "</b>?",
            "Zip Source", (action) => {
                this.zipSource(action)
            });
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
            "Start Crawler", (action) => {
                this.startCrawler(action)
            });
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

    processAllFilesCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to process all files for <b>" + crawler.name + "</b>?" +
            "<br/><br/>NB. Please stop any crawling activity first to keep your counters up-to-date.",
            "Process all files for Crawler", (action) => {
                this.processAllFilesCrawler(action)
            });
    }

    processAllFilesCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.processAllFilesForCrawler(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    pretty(name) {
        if (name === "external")
            return "SimSage API";
        return name;
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
                    setUpOIDCRequest={(OIDCClientID, OIDCSecret) => this.props.setUpOIDCRequest(OIDCClientID, OIDCSecret)}
                    error_title={this.props.error_title}
                    error_msg={this.props.error}
                    wpUploadArchive={(data) => this.props.wpUploadArchive(data)}
                    group_list={this.props.group_list}
                    crawler={this.state.selected_crawler}
                    edge_device_list={this.props.edge_device_list}
                    testCrawler={this.props.testCrawler}
                />

                <CrawlerImportExport
                    open={this.state.export_open}
                    theme={theme}
                    upload={this.state.export_upload}
                    crawler={this.state.selected_crawler}
                    export_upload={this.state.export_upload}
                    onSave={(crawler) => this.saveExport(crawler)}
                    onError={(title, errStr) => this.props.setError(title, errStr)}
                />

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               theme={this.props.theme}
                               message={this.state.message}
                               title={this.state.message_title}/>

                {
                    this.props.selected_knowledgebase_id.length > 0 &&
                    <div className="source-page">
                        <table className="table">
                            <thead>
                            <tr className='table-header'>
                                <th className='table-header'>id</th>
                                <th className='table-header'>name</th>
                                <th className='table-header'>type</th>
                                <th className='table-header'>progress</th>
                                <th className='table-header'>actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.getCrawlers().map((crawler) => {
                                    return (
                                        <tr key={crawler.sourceId}>
                                            <td>
                                                <div className="source-label">{crawler.sourceId}</div>
                                            </td>
                                            <td>
                                                <div className="source-label">{crawler.name}</div>
                                            </td>
                                            <td>
                                                <div className="source-label">{this.pretty(crawler.crawlerType)}</div>
                                            </td>
                                            <td>
                                                <div className="small-label-size"
                                                     title="first stage of the pipeline: collect/gather the documents and/or data">
                                                    <span className="counter-label"><span
                                                        className="counter-number counter-color1">1</span> collected</span><span>{Api.numberWithCommas(crawler.numCrawledDocuments)}</span>
                                                </div>
                                                <div className="small-label-size"
                                                     title="stage two of the pipeline: extract text from the collected data">
                                                    <span className="counter-label"><span
                                                        className="counter-number counter-color2">2</span> converted</span><span>{Api.numberWithCommas(crawler.numConvertedDocuments)}</span>
                                                </div>
                                                <div className="small-label-size"
                                                     title="stage three of the pipeline: Perform natural language processing on the text">
                                                    <span className="counter-label"><span
                                                        className="counter-number counter-color3">3</span> analyzed</span><span>{Api.numberWithCommas(crawler.numParsedDocuments)}</span>
                                                </div>
                                                <div className="small-label-size"
                                                     title="stage four of the pipeline: create the SimSage index graph for the parsed data (if enabled)">
                                                    <span className="counter-label"><span
                                                        className="counter-number counter-color4">4</span> indexed</span><span>{Api.numberWithCommas(crawler.numIndexedDocuments)}</span>
                                                </div>
                                                <div className="small-label-size"
                                                     title="stage five of the pipeline: generate preview information of the data (if enabled)">
                                                    <span className="counter-label"><span
                                                        className="counter-number counter-border-bottom counter-color5">5</span> completed</span><span>{Api.numberWithCommas(crawler.numFinishedDocuments)}</span>
                                                </div>
                                                <div className="small-label-size"
                                                     title="the total number of documents in SimSage for this source">
                                                    <span
                                                        className="counter-label">total documents</span><span>{Api.numberWithCommas(crawler.numTotalDocuments)}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="link-button"
                                                     onClick={() => this.startCrawlerAsk(crawler)}>
                                                    <img src="../images/play.svg" className="image-size"
                                                         title="start this crawler" alt="start"/>
                                                </div>
                                                <div className="link-button" onClick={() => this.editCrawler(crawler)}>
                                                    <img src="../images/edit.svg" className="image-size"
                                                         title="edit crawler" alt="edit"/>
                                                </div>
                                                <div className="link-button"
                                                     onClick={() => this.deleteCrawlerAsk(crawler)}>
                                                    <img src="../images/delete.svg" className="image-size"
                                                         title="remove crawler" alt="remove"/>
                                                </div>
                                                {crawler.storeBinary &&
                                                    <div className="link-button"
                                                         onClick={() => this.processAllFilesCrawlerAsk(crawler)}>
                                                        <img src="../images/file.svg" className="image-size"
                                                             title="process all files for a source"
                                                             alt="process files"/>
                                                    </div>
                                                }
                                                {!crawler.storeBinary &&
                                                    <div className="link-button">
                                                        <img src="../images/file-disabled.svg" className="image-size"
                                                             title="process all files for a source disabled (store binaries is not set)"
                                                             alt="process files"/>
                                                    </div>
                                                }
                                                <div className="link-button"
                                                     onClick={() => this.exportCrawler(crawler)}>
                                                    <img src="../images/download.svg" className="image-size"
                                                         title="get crawler JSON for export" alt="export"/>
                                                </div>
                                                <div className="link-button" onClick={() => this.zipSourceAsk(crawler)}>
                                                    <img src="../images/zip.svg" className="image-size"
                                                         title="zip all files in a source" alt="zip files"/>
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
                                            className="image-size" src="../images/upload.svg"
                                            title="upload crawler JSON"
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
                            rowsPerPage={this.props.source_page_size}
                            page={this.props.source_page}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(page) => this.changePage(page)}
                            onChangeRowsPerPage={(page_size) => this.changePageSize(page_size)}
                        />

                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = function (state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        session: state.appReducer.session,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        selected_knowledgebase: state.appReducer.selected_knowledgebase,            // the name
        user_list: state.appReducer.all_user_list,
        user_filter: state.appReducer.user_filter,

        source_page: state.appReducer.source_page,
        source_page_size: state.appReducer.source_page_size,
        crawler_list: state.appReducer.crawler_list,
        edge_device_list: state.appReducer.edge_device_list,

        group_list: state.appReducer.group_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(DocumentSources);
