import React, {Component} from 'react';

import Comms from '../common/comms'
import BotSingleSearchResult from '../common/bot-single-search-result'

import '../css/mind.css';


export class MindSearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onError: props.onError,

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
            onError: nextProps.onError,
        })
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.doClickSearch();
        }
    }
    doClickSearch() {
        if (this.props.mindQuery) {
            this.setState({hasSearched: true});
            this.props.mindQuery();
        }
    }
    getResultList() {
        return JSON.parse(JSON.stringify(this.props.queryResultList));
    }
    openDocument(url) {
        const session_id = Comms.getSession();
        const window_url = Comms.toUrl('/document/' + encodeURIComponent(session_id) + '/' + encodeURIComponent(url));
        window.open(window_url, "_blank");
    }
    render() {
        return (
            <div className="mind-page">

                <div className="form-group">
                    <div className="busy-body">
                        <img alt="busy" src="../images/busy2.gif"
                             style={{'display': this.state.busy ? '' : 'none', width: '32px'}}/>
                    </div>
                </div>

                <div className="form-group">
                    <div className="full-column">
                        <span className="left-1">
                            <input type="text" className="form-control text-width"
                                onChange={(event) => this.props.setBotQueryString(event.target.value)}
                                onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                            />
                        </span>
                        <span className="left">
                            <button className="btn btn-primary btn-block" onClick={() => this.doClickSearch()}>Ask</button>
                        </span>
                    </div>
                </div>


                <br clear="both" />


                {this.state.queryResultList && this.state.queryResultList.length > 0 &&
                <div>
                    <div className="search-results-box">
                        {
                            this.getResultList().map((item) => {
                                return (<BotSingleSearchResult key={item.key} item={item} openDocument={(url) => this.openDocument(url)} />)
                            })
                        }
                    </div>

                </div>
                }

                {
                    this.state.queryResultList && this.state.queryResultList.length === 0 && this.state.hasSearched && !this.state.busy &&
                    <div className="no-results">no results</div>
                }

            </div>
        );
    }
}

export default MindSearchComponent;
