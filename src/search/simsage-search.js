import React, {Component} from 'react';

import axios from "axios";

import SingleSearchResult from './single-search-result'

import '../css/search.css';

// constants
// const api_base = "http://localhost:8080/api";   // the remote SimSage server's location
const api_base = window.ENV.api_base;
const pageSize = 10;                            // number of search results per page
const fragmentCount = 3;                        // number of fragments per search result
const scoreThreshold = 0.8125;                  // bot score threshold (0.8125 is a good value)
const maxWordDistance = 20;                     // distance between words in search results for scoring
const numQNAResults = 1;                        // number of Q&A replies, set to 1


export class SimsageSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            // search system
            busy: false,
            searchText: '',

            // a result list if applicable after asking
            page: 0,
            has_searched: false,
            search_result_list: [],
            shard_list: [],
            bot_response: '',
            bot_links: [],
        };

    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter" && this.state.searchText.length > 0) {
            this.doSearch();
        }
    }

    // convert js response to its error output equivalent
    static get_error(error) {
        if (typeof error === "string" && error.indexOf("{") === 0) {
            const obj = JSON.parse(error);
            if (obj && obj["response"] && obj["response"]["data"] && obj["response"]["data"]["error"]) {
                return obj["response"]["data"]["error"];
            } else {
                return error;
            }
        } else {
            if (error && error["response"] && error["response"]["data"] && error["response"]["data"]["error"]) {
                return error["response"]["data"]["error"];
            } else {
                return error;
            }
        }
    }

    static getHeaders() {
        return {
            headers: {
                "API-Version": "1",
                "Content-Type": "application/json"
            }
        };
    }

    static http_post(url, payload, fn_success, fn_fail) {
        axios.post(api_base + url, payload, SimsageSearch.getHeaders())
            .then(function (response) {
                if (fn_success) {
                    fn_success(response);
                }
            })
            .catch(function (error) {
                if (fn_fail) {
                    if (error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(SimsageSearch.get_error(error));
                    }
                }
            });
    };

    doSearch() {
        // check about and help - special cases
        const self = this;
        if (!self.state.busy) {
            if (this.state.searchText.length > 0) {
                self.setState({busy: true});
                const data = {
                    organisationId: this.props.organisationId,
                    kbList: [this.props.kbId],
                    scoreThreshold: scoreThreshold,
                    clientId: this.props.clientId,
                    semanticSearch: true,
                    query: "(" + this.state.searchText + ")",
                    queryText: this.state.searchText,
                    numResults: numQNAResults,
                    page: this.state.page,
                    pageSize: pageSize,
                    shardSizeList: this.state.shard_list,
                    fragmentCount: fragmentCount,
                    maxWordDistance: maxWordDistance,
                    spellingSuggest: false,
                    contextLabel: '',
                    contextMatchBoost: 0.01,
                    sourceId: '',
                };
                SimsageSearch.http_post('/semantic/query', data,
                    (result) => {
                        if (result && result.data && result.data.messageType === 'message') {
                            const data = result.data;
                            const shard_list = (data.shardSizeList) ? data.shardSizeList : [];
                            const result_list = (data.resultList) ? data.resultList : [];
                            const bot_response = (data.text) ? data.text : '';
                            const bot_links = (data.urlList) ? data.urlList : [];
                            self.setState({shard_list: shard_list,
                                                 search_result_list: result_list,
                                                 has_searched: true,
                                                 bot_response: bot_response,
                                                 bot_links: bot_links,
                                                 busy: false});
                        } else {
                            self.setState({busy: false});
                        }
                    },
                    (error) => {
                        self.setState({busy: false});
                        if (self.props.onError)
                            self.props.onError('Error', error);
                    }
                )
            }
        }
    }
    openDocument(url) {
        alert("open document " + url);
    }
    render() {
        if (this.state.has_error) {
            return <h1>simsage-search.js: Something went wrong.</h1>;
        }
        return (
            <div className="search-page">

                {/* search bar */}
                <div className="search-bar">
                    <div className="busy-box">
                        <span style={{'display': this.state.busy ? '' : 'none', width: '32px'}}>&#8987;</span>
                    </div>
                    <div className="search-text-box">
                        <input type="text" className="search-text"
                            autoFocus={true}
                            onChange={(event) => this.setState({searchText: event.target.value})}
                            onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                            disabled={this.state.busy}
                            value={this.state.searchText}
                        />
                    </div>
                    <div className="search-button-box">
                        <button className="btn btn-primary btn-block" disabled={this.state.busy} onClick={() => this.doSearch()}>
                            Search
                        </button>
                    </div>
                </div>


                {/* bot response display */}
                {this.state.bot_response !== '' &&
                    <div className="qna-response-bubble">

                        <div>{this.state.bot_response}</div>

                        <div className="url-list">
                            {
                                this.state.bot_links.map((url, index) => {
                                    return (<div key={index} className="url" onClick={() => this.openDocument(url)}>{url}</div>)
                                })
                            }
                        </div>

                    </div>
                }

                {/* search result display */}

                {this.state.search_result_list && this.state.search_result_list.length > 0 &&
                <div>
                    <div className="search-results-box">
                        {
                            this.state.search_result_list.map((item, index) => {
                                return (<SingleSearchResult key={index}
                                                            item={item}
                                                            organisationId={this.props.organisationId}
                                                            kbId={this.props.kbId}
                                                            clientId={this.props.clientId}
                                                            openDocument={(url) => this.openDocument(url)} />)
                            })
                        }
                    </div>
                </div>
                }

                {
                    this.state.search_result_list && this.state.search_result_list.length === 0 &&
                    this.state.has_searched && this.state.bot_response === '' &&
                    <div>no results</div>
                }


            </div>
        );
    }
}

export default SimsageSearch;
