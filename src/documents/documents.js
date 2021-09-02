import React from 'react';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Home} from "../home";
import {Pagination} from "../common/pagination";

import '../css/documents.css';

// display length of a url
const maxUrlDisplayLength = 50;


export class Documents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            document: null,
            crawler_map: {},
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
        let crawler_map = {};
        for (const crawler of this.props.crawler_list) {
            crawler_map[crawler.sourceId] = crawler.crawlerType;
        }
        this.setState({crawler_map: crawler_map});
    }
    deleteDocumentAsk(document) {
        if (document) {
            this.props.openDialog("are you sure you want to remove \"" + document.url + "\" ?", "Remove Document", (action) => { this.deleteDocument(action) });
            this.setState({document: document});
        }
    }
    deleteDocument(action) {
        if (action && Api.defined(this.state.document)) {
            console.log(this.state.document);
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
            return "document not " + stage;
        else
            return staging + " disabled for this document-source";
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    canDeleteDocument(document) {
        return this.state.crawler_map[document.sourceId] !== 'wordpress';
    }
    render() {
        const theme = this.props.theme;
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        return (
            <div className="document-display">

                {
                    this.isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.document_filter} autoFocus={true} className={theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setDocumentFilter(event.target.value)
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getDocuments()}
                                 src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                        </span>
                    </div>
                }


                {
                    this.isVisible() &&
                    <div className="table-style">
                        <table className="table">

                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>url</th>
                                    <th className='table-header'>source</th>
                                    <th className='table-header'>last modified</th>
                                    <th className='table-header'>status</th>
                                    {isAdmin &&
                                        <th className='table-header'>actions</th>
                                    }
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    this.getDocuments().map((document) => {
                                        return (
                                                <tr key={document.url}>
                                                    <td className="urlLabel">
                                                        {
                                                            Documents.isWeb(document.url) &&
                                                            <div className="urlLabel">
                                                                <a href={document.url} title={document.url} rel="noopener noreferrer" target="_blank">{Documents.adjustUrl(document.url)}</a>
                                                            </div>
                                                        }
                                                        {
                                                            !Documents.isWeb(document.url) &&
                                                            <div className="urlLabel">{Documents.adjustUrl(document.url)}</div>
                                                        }
                                                    </td>
                                                    <td className="sourceLabel">
                                                        {document.origin}
                                                    </td>
                                                    <td>
                                                        <div className="timeLabel">{Api.unixTimeConvert(document.lastModified)}</div>
                                                    </td>
                                                    <td>
                                                        <div className="label">
                                                            <img src={this.getStatus(document, "crawled")} className="statusImage" alt="crawler" title={this.getStatusText(document, "crawled", "crawling")} />
                                                            <img src={this.getStatus(document, "converted")} className="statusImage" alt="converted" title={this.getStatusText(document, "converted", "converting")} />
                                                            <img src={this.getStatus(document, "parsed")} className="statusImage" alt="parsed" title={this.getStatusText(document, "parsed", "parsing")} />
                                                            <img src={this.getStatus(document, "indexed")} className="statusImage" alt="indexed" title={this.getStatusText(document, "indexed", "indexing")} />
                                                            <img src={this.getStatus(document, "previewed")} className="statusImage" alt="previewed" title={this.getStatusText(document, "previewed", "preview generation")} />
                                                        </div>
                                                    </td>
                                                    {isAdmin &&
                                                        <td>
                                                            <div className="linkButton"
                                                                 onClick={() => this.deleteDocumentAsk(document)}>
                                                                <img src="../images/delete.svg"
                                                                     className="image-size" title="remove document"
                                                                     alt="remove"/>
                                                            </div>
                                                        </td>
                                                    }
                                                </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>

                        <Pagination
                            theme={theme}
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
                            onChangePage={(page) => this.props.setDocumentPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setDocumentPageSize(rows)}
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
        user: state.appReducer.user,

        document_list: state.appReducer.document_list,
        document_filter: state.appReducer.document_filter,
        document_page: state.appReducer.document_page,
        document_page_size: state.appReducer.document_page_size,
        document_nav_list: state.appReducer.document_nav_list,
        num_documents: state.appReducer.num_documents,

        crawler_list: state.appReducer.crawler_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Documents);

