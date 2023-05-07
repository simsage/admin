import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';


export class CrawlerConfluence extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            show_password: false,

            onSave: props.onSave,
            onError: props.onError,

            baseUrl: props.baseUrl ? props.baseUrl : "",
            userId: props.userId ? props.userId : "",
            accessToken: props.accessToken ? props.accessToken : "",
            excludeSpaces: props.excludeSpaces ? props.excludeSpaces : "",
            includeSpaces: props.includeSpaces ? props.includeSpaces : "",
            categories: props.categories ? props.categories : "",
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
                baseUrl: Api.defined(nextProps.baseUrl) ? nextProps.baseUrl : '',
                accessToken: Api.defined(nextProps.accessToken) ? nextProps.accessToken : '',
                userId: Api.defined(nextProps.userId) ? nextProps.userId : '',
                excludeSpaces: Api.defined(nextProps.excludeSpaces) ? nextProps.excludeSpaces : "",
                includeSpaces: Api.defined(nextProps.includeSpaces) ? nextProps.includeSpaces : "",
                categories: Api.defined(nextProps.categories) ? nextProps.categories : "",
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }

    construct_data(data) {
        return {
            ...this.state.specific_json,
            baseUrl: Api.defined(data.baseUrl) ? data.baseUrl : this.state.baseUrl,
            accessToken: Api.defined(data.accessToken) ? data.accessToken : this.state.accessToken,
            excludeSpaces: Api.defined(data.excludeSpaces) ? data.excludeSpaces : this.state.excludeSpaces,
            includeSpaces: Api.defined(data.includeSpaces) ? data.includeSpaces : this.state.includeSpaces,
            categories: Api.defined(data.categories) ? data.categories : this.state.categories,
            userId: Api.defined(data.userId) ? data.userId : this.state.userId
        };
    }

    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            this.state.onSave(this.construct_data(data));
        }
    }


    render() {
        if (this.state.has_error) {
            return <h1>crawler-search.js: Something went wrong.</h1>;
        }


        return (
            <div className="crawler-page">
                <div className="form-group">
                    <span className="office-manual-box">
                    <a href="resources/simsage-confluence-crawler-setup.pdf" id="dlGDrive" target="_blank"
                       title="download the SimSage Google-drive setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="google-drive setup guide" className="image-size"/>
                        </a>
                    </span>
                </div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span className="label-right-top">Confluence Base Url</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="Base Url of the Atlassian installation"
                                               value={this.state.baseUrl}
                                               onChange={(event) => {
                                                   this.change_callback({baseUrl: event.target.value})
                                               }}
                                        />
                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </div>
                    <div className="full-column-2">
                        <span className="label-right-top">Confluence User</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type="text" className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="User id to use to log into Confluence"
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
                        <span className="label-right-top">Access Token</span>
                        <span className="big-text">
                            <form>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <input type={this.state.show_password ? "text" : "password"}
                                               className="form-control dropbox-text-width"
                                               spellCheck={false}
                                               style={{width: "500px", marginRight: "10px"}}
                                               placeholder="Access token for the user"
                                               value={this.state.accessToken}
                                               onChange={(event) => {
                                                   this.change_callback({accessToken: event.target.value})
                                               }}
                                        />
                                    </td>
                                    <td className={"password_hide_show"}>
                                        {!this.state.show_password &&
                                            <img src="../images/eye.svg" alt="show password" className="image-size"
                                                 onClick={() => this.setState({show_password: true})}/>
                                        }

                                        {this.state.show_password &&
                                            <img src="../images/eye-slash.svg" alt="hide password"
                                                 className="image-size"
                                                 onClick={() => this.setState({show_password: false})}/>
                                        }
                                    </td>
                                    <td>

                                    </td>

                                </tr>
                                </tbody>
                            </table>
                            </form>
                        </span>
                    </div>

                    <div className="full-column-2">
                        <span className="label-right-top">Categories to crawl</span>
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of categories separated by commas to crawl (leave empty to crawl all categories)"
                                          value={this.state.categories}
                                          onChange={(event) => {
                                              this.change_callback({categories: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                    </div>
                    <div className="full-column-2">
                        <span className="label-right-top">Spaces to crawl</span>
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of space keys separated by commas to crawl (leave empty to crawl all spaces)"
                                          value={this.state.includeSpaces}
                                          onChange={(event) => {
                                              this.change_callback({includeSpaces: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                    </div>
                    <div className="full-column-2">
                        <span className="label-right-top">Spaces to exclude</span>
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                          rows="3"
                                          placeholder="a list of space keys separated by commas to exclude from crawling (leave empty not to exclude any spaces)"
                                          value={this.state.excludeSpaces}
                                          onChange={(event) => {
                                              this.change_callback({excludeSpaces: event.target.value})
                                          }}
                                />
                            </form>
                        </span>
                    </div>
                </div>

            </div>
        );
    }
}

export default CrawlerConfluence;
