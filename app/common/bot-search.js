import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Comms from './comms'
import BotSingleSearchResult from './bot-single-search-result'

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


export class BotSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onError: props.onError,

            botQuery: props.botQuery, // callback functions
            setBotQueryString: props.setBotQueryString,

            // search system
            botQueryString: props.botQueryString,
            // results
            queryResultList: props.queryResultList,
            // a result list if applicable after asking
            hasSearched: false,
        };

    }
    componentDidCatch(error, info) {
        this.props.onError(error, info);
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            botQueryString: nextProps.botQueryString,
            queryResultList: nextProps.queryResultList,
            setBotQueryString: nextProps.setBotQueryString,
            botQuery: nextProps.botQuery,
            onError: nextProps.onError,
        })
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.doClickSearch();
        }
    }
    doClickSearch() {
        if (this.props.botQuery) {
            this.setState({hasSearched: true});
            this.props.botQuery();
        }
    }
    getResultList() {
        const copy = JSON.parse(JSON.stringify(this.props.queryResultList));
        BotSingleSearchResult.updateResults(copy);
        return copy;
    }
    openDocument(url) {
        const session_id = Comms.getSession();
        const window_url = Comms.toUrl('/document/' + encodeURIComponent(session_id) + '/' + encodeURIComponent(url));
        window.open(window_url, "_blank");
    }
    render() {
        return (
            <div>
                <div style={styles.busyBox}>
                    <img alt="busy" src="../images/busy2.gif"
                         style={{'display': this.state.busy ? '' : 'none', width: '32px'}}/>
                </div>
                <div style={styles.searchTextBox}>
                    <TextField
                        onChange={(event) => this.props.setBotQueryString(event.target.value)}
                        onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                        label="test the bot by asking it something"
                        fullWidth={true}
                        value={this.props.botQueryString}
                    />
                </div>
                <div style={styles.searchButtonBox}>
                    <Button variant="outlined"
                        color="secondary"
                        onClick={() => this.doClickSearch()}>
                        Ask
                    </Button>
                </div>

                <div style={{clear: 'both'}}/>
                <br/>

                {this.state.queryResultList && this.state.queryResultList.length > 0 &&
                <div>
                    <div style={styles.searchResultsBox}>
                        {
                            this.getResultList().map((item) => {
                                return (<BotSingleSearchResult key={item.key} item={item} openDocument={(url) => this.openDocument(url)} />)
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

export default BotSearch;
