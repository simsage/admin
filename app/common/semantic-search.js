import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Api from './api'
import SingleSemanticSearchResult from './single-semantic-search-result'

// size of the return results
const pageSize = 10;
const scoreThreshold = 0.01;

// styles of form
const styles = {
    busyBox: {
        float: 'left',
        marginLeft: '10px',
        marginRight: '5px',
        marginTop: '15px',
        width: '32px',
    },
    searchTextBox: {
        marginBottom: 16,
        width: '400px',
        float: 'left',
    },
    searchButtonBox: {
        marginTop: '20px',
        marginLeft: '20px',
        float: 'left',
    },
    searchResultsBox: {
        padding: '10px',
        borderRadius: '4px',
        border: '0.5px solid #ccc'
    }
};


export class SemanticSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onError: props.onError,

            // search system
            busy: false,
            searchText: '',

            // a result list if applicable after asking
            hasSearched: false,
            queryResultList: [],

            organisationId: props.organisationId,
            kbId: props.kbId,
        };

    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            organisationId: nextProps.organisationId,
            kbId: nextProps.kbId,
            onError: nextProps.onError,
        })
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter" && this.state.searchText.length > 0) {
            const page = 0;
            this.setState({page: page});
            this.doSearch(page);
        }
    }
    doClickSearch() {
        const page = 0;
        this.setState({page: page});
        this.doSearch(page);
    }
    doSearch(page) {
        // check about and help - special cases
        const self = this;
        if (!self.state.busy) {
            if (this.state.searchText.length > 0) {
                self.setState({busy: true});
                const data = {
                    organisationId: this.state.organisationId,
                    kbId: this.state.kbId,
                    query: this.state.searchText,
                    numResults: pageSize,
                    scoreThreshold: scoreThreshold,
                };
                Api.semanticSearch(this.state.organisationId, this.state.kbId,
                                   this.state.searchText, pageSize, scoreThreshold,
                    (result) => {
                        if (result && result.resultList) {
                            // process
                            SingleSemanticSearchResult.updateResults(result.resultList);
                            self.setState({queryResultList: result.resultList, hasSearched: true, busy: false});
                        }
                    },
                    (error) => {
                        self.setState({busy: false});
                        if (self.state.onError)
                            self.state.onError('Error', error);
                    }
                );
            }
            else {
                if (self.state.onError)
                    self.state.onError('Error', 'Input field value is missing');
            }
        }
    }
    getResultList() {
        return this.state.queryResultList; // copy
    }
    openDocument(url) {
        const session_id = getSession();
        const window_url = toUrl('/document/' + encodeURIComponent(session_id) + '/' + encodeURIComponent(url));
        window.open(window_url, "_blank");
    }
    render() {
        if (this.state.has_error) {
            return <h1>semantic-search.js: Something went wrong.</h1>;
        }
        return (
            <div>

                <div style={styles.busyBox}>
                    <img alt="busy" src="../images/busy2.gif"
                         style={{'display': this.state.busy ? '' : 'none', width: '32px'}}/>
                </div>
                <div style={styles.searchTextBox}>
                    <TextField
                        autoFocus={true}
                        onChange={(event) => this.setState({searchText: event.target.value})}
                        onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                        label="semantic-search"
                        fullWidth={true}
                        value={this.state.searchText}
                    />
                </div>
                <div style={styles.searchButtonBox}>
                    <Button variant="outlined"
                        color="secondary"
                        onClick={() => this.doClickSearch()}>
                        Search
                    </Button>
                </div>

                <div style={{clear: 'both'}}/>
                <br/>

                {this.state.queryResultList && this.state.queryResultList.length > 0 &&
                <div>
                    <div style={styles.searchResultsBox}>
                        {
                            this.getResultList().map((item) => {
                                return (<SingleSemanticSearchResult key={item.key} item={item} openDocument={(url) => this.openDocument(url)} />)
                            })
                        }
                    </div>

                </div>
                }

                {
                    this.state.queryResultList && this.state.queryResultList.length === 0 && this.state.hasSearched &&
                    <div>no results</div>
                }

            </div>
        );
    }
}

export default SemanticSearch;
