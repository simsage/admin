import {useState} from "react";
import {useSelector} from "react-redux";
import Api from "../../common/api";
import {Pagination} from "../../common/pagination";
import SourceFilter from "./SourceFilter";
import db from "../../notes/db.json";

export default function SourceHome(){

    const title = "Source";
    const theme = '';
    const selected_knowledge_base_id = "1123122"; // useSelector((state) => state.kbReducer.selected_knowledgebase_id);
    const selected_organisation_id = "1123122"; // useSelector((state) => state.kbReducer.selected_knowledgebase_id);
    const source_list = db.sources
    const [curr_page, setCurrPage] = useState(0)
    const [page_size, setPageSize] = useState(10)

    const default_specific_json = '{"metadata_list":[' +
        '{"key":"created date range","display":"created","metadata":"created","db1":"","db2":"","sort":"true","sortDefault":"desc","sortAscText":"oldest documents first","sortDescText":"newest documents first", "fieldOrder": "0"},' +
        '{"key":"last modified date ranges","display":"last modified","metadata":"last-modified","db1":"","db2":"","sort":"true","sortDefault":"","sortAscText":"least recently modified","sortDescText":"most recently modified", "fieldOrder": "1"},' +
        '{"key":"document type","display":"document type","metadata":"document-type","db1":"","db2":"","sort":"","sortDefault":"","sortAscText":"","sortDescText":"", "fieldOrder": "2"}' +
        ']}';

    const empty_crawler= {id: '', sourceId: '0', crawlerType: '', name: '', deleteFiles: true, allowAnonymous: false,
        enablePreview: true, schedule: '', filesPerSecond: '0', specificJson: default_specific_json,
        processingLevel: 'SEARCH', nodeId: '0', maxItems: '0', maxQNAItems: '0', customRender: false, "acls": []};


    function getCrawlers() {
        const paginated_list = [];
        const first = curr_page * page_size;
        const last = first + page_size;

        source_list.sort((a, b) => { return a.sourceId - b.sourceId });
        for (const i in source_list) {
            if (i >= first && i < last) {
                paginated_list.push(source_list[i]);
            }
        }
        return paginated_list;
    }

    function getCrawlerStatus(crawler) {
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

    function isCrawlerRunning(crawler) {
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

    function changePage(page) {
        setCurrPage(page);
    }
    function changePageSize(page_size) {
        setPageSize(page_size)
    }

    function addNewCrawler() {
        this.setState({open: true, selected_crawler: empty_crawler, title: 'Create New Crawler'});
    }
    function onUpdate(crawler) {
        this.setState({selected_crawler: crawler});
    }
    function editCrawler(crawler) {
        if (crawler) {
            this.setState({open: true, selected_crawler: { ...empty_crawler, ...crawler}, title: 'Edit Crawler'});
        }
    }
    function deleteCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to remove the crawler named <b>" + crawler.name + "</b>?",
            "Remove Crawler", (action) => { this.deleteCrawler(action) });
    }
    function deleteCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            this.props.deleteCrawler(this.state.crawler_ask.sourceId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function saveCrawler(crawler) {
        if (crawler) {
            crawler.organisationId = selected_organisation_id;
            crawler.kbId = selected_knowledge_base_id;
            this.props.updateCrawler(crawler);
        }
        this.setState({open: false});
    }
    function canDeleteDocuments(crawler) {
        return crawler.crawlerType !== 'wordpress';
    }
    function exportCrawler(crawler) {
        this.setState({selected_crawler: crawler, export_upload: false, export_open: true})
    }
    function importCrawler() {
        this.setState({selected_crawler: {}, export_upload: true, export_open: true})
    }
    function saveExport(crawler_str) {
        if (crawler_str && this.state.export_upload) {
            const crawler = JSON.parse(crawler_str);
            delete crawler.sourceId;
            this.saveCrawler(crawler);
        }
        this.setState({export_open: false, selected_crawler: {}});
    }

    function zipSourceAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to zip the content of <b>" + crawler.name + "</b>?",
            "Zip Source", (action) => { this.zipSource(action) });
    }
    function zipSource(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.zipSource(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function startCrawlerAsk(crawler) {
        this.setState({crawler_ask: crawler});
        this.props.openDialog("are you sure you want to start <b>" + crawler.name + "</b>?",
            "Start Crawler", (action) => { this.startCrawler(action) });
    }
    function startCrawler(action) {
        if (action && this.state.crawler_ask && this.state.crawler_ask.sourceId) {
            const crawler = this.state.crawler_ask;
            this.props.startCrawler(crawler);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    function resetCrawlersAsk() {
        this.props.openDialog("Are you sure you want to reset all crawlers?  This will clear crawler schedules, and mark their files as out-of-date.",
            "Reset Crawlers", (action) => { this.resetCrawlers(action) });
    }
    function resetCrawlers(action) {
        if (action) {
            this.props.resetCrawlers(selected_organisation_id, selected_knowledge_base_id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }

    return(
        <div className="section px-5 pt-4">

            <SourceFilter />
            { selected_knowledge_base_id.length > 0 &&
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
                            getCrawlers().map((crawler) => {
                                const description = getCrawlerStatus(crawler);
                                const is_running = isCrawlerRunning(crawler);
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
                                                 onClick={() => startCrawlerAsk(crawler)}>
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
                                            <div className="link-button" onClick={() => editCrawler(crawler)}>
                                                <img src="../images/edit.svg" className="image-size" title="edit crawler" alt="edit"/>
                                            </div>
                                            <div className="link-button" onClick={() => deleteCrawlerAsk(crawler)}>
                                                <img src="../images/delete.svg" className="image-size" title="remove crawler" alt="remove"/>
                                            </div>
                                            <div className="link-button" onClick={() => exportCrawler(crawler)}>
                                                <img src="../images/download.svg" className="image-size" title="get crawler JSON for export" alt="export"/>
                                            </div>
                                            <div className="link-button" onClick={() => zipSourceAsk(crawler)}>
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
                                {selected_organisation_id.length > 0 &&
                                <div className="image-button" onClick={() => addNewCrawler()}><img
                                    className="image-size" src="../images/add.svg" title="add new crawler"
                                    alt="add new crawler"/></div>
                                }
                                {selected_knowledge_base_id.length > 0 &&
                                <div className="image-button" onClick={() => resetCrawlersAsk()}><img
                                    className="image-size" src="../images/refresh.svg" title="reset crawlers"
                                    alt="reset crawlers"/></div>
                                }
                                {selected_organisation_id.length > 0 &&
                                <div className="image-button" onClick={() => importCrawler()}><img
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
                        count={source_list.length}
                        rowsPerPage={page_size}
                        page={curr_page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => changePage(page)}
                        onChangeRowsPerPage={(rows) => changePageSize(rows)}
                    />

                </div>
            }
        </div>
    )
}