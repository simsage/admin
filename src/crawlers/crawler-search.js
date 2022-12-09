import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';


export class CrawlerSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // Search properties
            target_organisation_id: props.target_organisation_id ? props.target_organisation_id : '',
            target_kb_id: props.target_kb_id ? props.target_kb_id : '',
            query: props.query ? props.query : '',
            userId: props.userId ? props.userId : '',
            specific_json: props.specific_json,
        };

    }

    componentWillUnmount() {
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({
                target_organisation_id: Api.defined(nextProps.target_organisation_id) ? nextProps.target_organisation_id : '',
                target_kb_id: Api.defined(nextProps.target_kb_id) ? nextProps.target_kb_id : '',
                query: Api.defined(nextProps.query) ? nextProps.query : '',
                userId: Api.defined(nextProps.userId) ? nextProps.userId : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }

    construct_data(data) {
        return {
            ...this.state.specific_json,
            target_organisation_id: Api.defined(data.target_organisation_id) ? data.target_organisation_id : this.state.target_organisation_id,
            target_kb_id: Api.defined(data.target_kb_id) ? data.target_kb_id : this.state.target_kb_id,
            query: Api.defined(data.query) ? data.query : this.state.query,
            userId: Api.defined(data.userId) ? data.userId : this.state.userId
        };
    }

    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }


    render() {
        if (this.state.has_error) {
            return <h1>crawler-search.js: Something went wrong.</h1>;
        }


        return (
            <div className="crawler-page">

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">Target Organisation</span>
                        <span className="bigger-text">
                            <form>
                                <input type="text" className="form-control dropbox-text-width"
                                       spellCheck={false}
                                       style={{width: "400px", marginRight: "10px"}}
                                       placeholder="Organisation id to query"
                                       value={this.state.target_organisation_id}
                                       onChange={(event) => {
                                           this.change_callback({target_organisation_id: event.target.value})
                                       }}
                                />
                            </form>
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">Target Knowledgebase</span>
                        <span className="bigger-text">
                            <form>
                                <input className="textarea-width"
                                       spellCheck={false}
                                       style={{width: "400px", marginRight: "10px"}}
                                       placeholder="The Knowledgebase id to search across"
                                       value={this.state.target_kb_id}
                                       onChange={(event) => {
                                           this.change_callback({target_kb_id: event.target.value})
                                       }}
                                />
                            </form>
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">Search User</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="User id under which the search will run"
                                               value={this.state.userId}
                                               onChange={(event) => {
                                                   this.change_callback({userId: event.target.value})
                                               }}
                                        />
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">Query text</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="Query text to run"
                                               value={this.state.query}
                                               onChange={(event) => {
                                                   this.change_callback({query: event.target.value})
                                               }}
                                        />
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </div>
                </div>

            </div>
        );
    }
}

export default CrawlerSearch;
