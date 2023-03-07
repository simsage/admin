import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';


export class CrawlerWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onError: props.onError,
            onSave: props.onSave,

            // web specific
            baseUrlList: Api.defined(props.baseUrlList) ? props.baseUrlList : '',
            webCss: Api.defined(props.webCss) ? props.webCss : '',
            webCssIgnore: Api.defined(props.webCssIgnore) ? props.webCssIgnore : 'header, footer',
            validExtensions: Api.defined(props.validExtensions) ? props.validExtensions : '',
            validExtensionsIgnore: Api.defined(props.validExtensionsIgnore) ? props.validExtensionsIgnore : '',
            articleIncludeWordsCsv: Api.defined(props.articleIncludeWordsCsv) ? props.articleIncludeWordsCsv : '',
            articleExcludeWordsCsv: Api.defined(props.articleExcludeWordsCsv) ? props.articleExcludeWordsCsv : '',
            pagePrefixesToIgnore: Api.defined(props.pagePrefixesToIgnore) ? props.pagePrefixesToIgnore : '',
            bearerToken: Api.defined(props.bearerToken) ? props.bearerToken : '',
            basicUsername: Api.defined(props.basicUsername) ? props.basicUsername : '',
            password: Api.defined(props.password) ? props.password : '',
            specific_json: props.specific_json,
            userAgent: Api.defined(props.userAgent) ? props.userAgent : '',
        };

    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({baseUrlList: nextProps.baseUrlList,
                webCss: Api.defined(nextProps.webCss) ? nextProps.webCss : '',
                validExtensions: Api.defined(nextProps.validExtensions) ? nextProps.validExtensions : '',
                webCssIgnore: Api.defined(nextProps.webCssIgnore) ? nextProps.webCssIgnore : '',
                validExtensionsIgnore: Api.defined(nextProps.validExtensionsIgnore) ? nextProps.validExtensionsIgnore : '',
                articleIncludeWordsCsv: Api.defined(nextProps.articleIncludeWordsCsv) ? nextProps.articleIncludeWordsCsv : '',
                articleExcludeWordsCsv: Api.defined(nextProps.articleExcludeWordsCsv) ? nextProps.articleExcludeWordsCsv : '',
                pagePrefixesToIgnore: Api.defined(nextProps.pagePrefixesToIgnore) ? nextProps.pagePrefixesToIgnore : '',
                bearerToken: Api.defined(nextProps.bearerToken) ? nextProps.bearerToken : '',
                basicUsername: Api.defined(nextProps.basicUsername) ? nextProps.basicUsername : '',
                password: Api.defined(nextProps.password) ? nextProps.password : '',
                userAgent: Api.defined(nextProps.userAgent) ? nextProps.userAgent : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            baseUrlList: Api.defined(data.baseUrlList) ? data.baseUrlList : this.state.baseUrlList,
            webCss: Api.defined(data.webCss) ? data.webCss : this.state.webCss,
            webCssIgnore: Api.defined(data.webCssIgnore) ? data.webCssIgnore : this.state.webCssIgnore,
            validExtensions: Api.defined(data.validExtensions) ? data.validExtensions : this.state.validExtensions,
            validExtensionsIgnore: Api.defined(data.validExtensionsIgnore) ? data.validExtensionsIgnore : this.state.validExtensionsIgnore ,
            articleIncludeWordsCsv: Api.defined(data.articleIncludeWordsCsv) ? data.articleIncludeWordsCsv : this.state.articleIncludeWordsCsv ,
            articleExcludeWordsCsv: Api.defined(data.articleExcludeWordsCsv) ? data.articleExcludeWordsCsv : this.state.articleExcludeWordsCsv ,
            pagePrefixesToIgnore: Api.defined(data.pagePrefixesToIgnore) ? data.pagePrefixesToIgnore : this.state.pagePrefixesToIgnore ,
            bearerToken: Api.defined(data.bearerToken) ? data.bearerToken : this.state.bearerToken ,
            basicUsername: Api.defined(data.basicUsername) ? data.basicUsername : this.state.basicUsername ,
            password: Api.defined(data.password) ? data.password : this.state.password ,
            userAgent: Api.defined(data.userAgent) ? data.userAgent : this.state.userAgent ,
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
            return <h1>crawler-web.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="label-right-top">http/s base url</span>
                    <span className="full-column">
                        <input type="text"
                            placeholder="single http/s base url path (e.g. https://simsage.ai)"
                            autoFocus={true}
                            className="form-control"
                            value={this.state.baseUrlList}
                            onChange={(event) => {this.change_callback({baseUrlList: event.target.value})}}
                        />
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">valid extensions</span>
                        <span className="big-text">
                            <input type="text" className="form-control"
                                   value={this.state.validExtensions}
                                   onChange={(event) => {this.change_callback({validExtensions: event.target.value})}}
                            />
                        </span>
                    </span>
                    <span className="left-column">
                            <span className="small-label-right">ignore extensions</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                    value={this.state.validExtensionsIgnore}
                                    onChange={(event) => {this.change_callback({validExtensionsIgnore: event.target.value})}}
                                />
                            </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <div>
                            <span className="small-label-right">bearer token</span>
                            <span className="big-text">
                                <input type="text" className="form-control"
                                       value={this.state.bearerToken}
                                       placeholder="an optional bearer token if available"
                                       title="(optional) bearer token"
                                       onChange={(event) => {this.change_callback({bearerToken: event.target.value})}}
                                />
                            </span>
                        </div>
                        <div>
                            <span className="small-label-right">user-agent</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                   placeholder="web-crawler's user-agent (blank to leave default)"
                                   title="(optional) web-crawler's user-agent"
                                   value={this.state.userAgent}
                                   onChange={(event) => {this.change_callback({userAgent: event.target.value})}}
                            />
                            </span>
                        </div>
                    </span>
                    <span className="left-column">
                        <div>
                            <span className="small-label-right">username</span>
                            <span className="big-text">
                            <input type="text" className="form-control"
                                   value={this.state.basicUsername}
                                   placeholder="optional basic auth username"
                                   title="(optional) basic auth username"
                                   onChange={(event) => {this.change_callback({basicUsername: event.target.value})}}
                            />
                            </span>
                        </div>
                        <div>
                            <span className="small-label-right">password</span>
                            <span className="big-text">
                            <input type="password" className="form-control"
                                   placeholder="basic auth password (leave blank to keep previous)"
                                   title="(optional) basic auth password (leave blank to keep previous)"
                                   value={this.state.password}
                                   onChange={(event) => {this.change_callback({password: event.target.value})}}
                            />
                            </span>
                        </div>
                    </span>
                </div>

                <div className="form-group">
                    <span className="label-right-top">include css csv</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="css/html root fragments to include csv"
                            rows="3"
                            value={this.state.webCss}
                            onChange={(event) => {this.change_callback({webCss: event.target.value})}}
                        />
                    </span>
                </div>

                <div className="form-group">
                    <span className="label-right-top">exclude css csv</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="css/html root fragments to exclude csv"
                            rows="3"
                            value={this.state.webCssIgnore}
                            onChange={(event) => {this.change_callback({webCssIgnore: event.target.value})}}
                        />
                    </span>
                </div>

                <div className="form-group">
                    <span className="label-right-top">csv include words</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="csv words, include articles by words [optional]"
                            rows="3"
                            value={this.state.articleIncludeWordsCsv}
                            onChange={(event) => {this.change_callback({articleIncludeWordsCsv: event.target.value})}}
                        />
                    </span>
                </div>

                <div className="form-group">
                    <span className="label-right-top">csv exclude words</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="csv words, exclude articles by words [optional]"
                            rows="3"
                            value={this.state.articleExcludeWordsCsv}
                            onChange={(event) => {this.change_callback({articleExcludeWordsCsv: event.target.value})}}
                        />
                    </span>
                </div>

                <div className="form-group">
                    <span className="label-right-top">csv exclude prefixes</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                                  placeholder="csv urls (starting with https://), exclude pages by prefix starts [optional]"
                                  rows="3"
                                  value={this.state.pagePrefixesToIgnore}
                                  onChange={(event) => {this.change_callback({pagePrefixesToIgnore: event.target.value})}}
                        />
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerWeb;
