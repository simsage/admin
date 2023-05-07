import React, {Component} from 'react';

import Api from "../../../common/api";

import '../../../css/crawler.css';

const type_list = [
    {"key": "none", "value": "please select database type"},
    {"key": "mysql", "value": "MySQL"},
    {"key": "postgresql", "value": "Postgresql"},
    {"key": "microsoftsql", "value": "Microsoft SQL"},
];


export class CrawlerDatabase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // database specific
            username: props.username ? props.username : '',
            password: props.password ? props.password : '',
            jdbc: props.jdbc ? props.jdbc : '',
            type: Api.defined(props.type) ? props.type : 'none',
            query: props.query ? props.query : '',
            pk: props.pk ? props.pk : '',
            template: props.template ? props.template : '<div class="ms-3 w-100">\n' +
                '  <div class="d-flex align-items-center text-align-end mb-1">\n' +
                '    <p class="mb-0 result-breadcrumb me-2">BREADCRUMB</p>\n' +
                '  </div>\n' +
                '    <span class="mb-2 results-filename text-break pointer-cursor" title="URL">TITLE</span>\n' +
                '    <div class="d-flex align-items-center mb-1">\n' +
                '      <span class="mb-0 result-details-title">URL</span>\n' +
                '    </div>\n' +
                '  <div class="d-flex align-items-center mb-1">\n' +
                '    <span class="mb-0 result-details">LAST_MODIFIED</span>\n' +
                '    <span class="d-flex align-items-center">\n' +
                '      <span class="mb-0 result-details mx-2">|</span>\n' +
                '      <span class="mb-0 result-details">AUTHOR</span>\n' +
                '    </span>\n' +
                '  </div>\n' +
                '  <div>\n' +
                '    <p class="small fw-light mb-2">RESULT_TEXT</p>\n' +
                '  </div>\n' +
                '  <div class="d-flex align-items-center flex-wrap"></div>\n' +
                '</div>\n',
            text: props.text ? props.text : '',
            content_url: props.content_url ? props.content_url : '',
            customRender: props.customRender,

            specific_json: props.specific_json,
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
            this.setState(this.construct_data({
                username: nextProps.username,
                password: nextProps.password,
                jdbc: nextProps.jdbc,
                type: Api.defined(nextProps.type) ? nextProps.type : 'none',
                query: nextProps.query,
                pk: nextProps.pk,
                template: nextProps.template,
                text: nextProps.text,
                content_url: nextProps.content_url,
                customRender: nextProps.customRender,

                specific_json: nextProps.specific_json,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            username: Api.defined(data.username) ? data.username : this.state.username,
            password: Api.defined(data.password) ? data.password : this.state.password,
            jdbc: Api.defined(data.jdbc) ? data.jdbc : this.state.jdbc,
            type: Api.defined(data.type) ? data.type : this.state.type,
            query: Api.defined(data.query) ? data.query : this.state.query,
            pk: Api.defined(data.pk) ? data.pk : this.state.pk,
            template: Api.defined(data.template) ? data.template : this.state.template,
            text: Api.defined(data.text) ? data.text : this.state.text,
            content_url: Api.defined(data.content_url) ? data.content_url : this.state.content_url,
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
            return <h1>crawler-database.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="office-manual-box">
                        <a href="resources/simsage-database-crawler-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage Database crawler setup guide">
                            <span className="instructions-label">instructions</span>
                            <img src="../images/pdf-icon.png" alt="database crawler setup guide" className="image-size" />
                        </a>
                    </span>
                    <br />
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">user name</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="the user name for db access"
                                    autoFocus={true}
                                    value={this.state.username}
                                    onChange={(event) => {this.change_callback({username: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                    <span className="right-column">
                        <span className="small-label-right">password</span>
                        <span className="big-text">
                            <form>
                                <input type="password" className="form-control"
                                    placeholder="password"
                                    value={this.state.password}
                                    onChange={(event) => {this.change_callback({password: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>


                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">jdbc string</span>
                        <span className="big-text">
                            <input type="text" className="form-control jdbc-field-width"
                                placeholder="jdbc connection string, e.g. jdbc:microsoft:sqlserver://HOST:1433;DatabaseName=DATABASE"
                                value={this.state.jdbc}
                                onChange={(event) => {this.change_callback({jdbc: event.target.value})}}
                            />
                        </span>
                    </span>
                </div>

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">database</span>
                        <span className="big-text">
                            <select className="form-select" onChange={(event) => {this.change_callback({type: event.target.value})}}
                                    defaultValue={this.state.type}>
                                {
                                    type_list.map((value) => {
                                        return (<option key={value.key} value={value.key}>{value.value}</option>)
                                    })
                                }
                            </select>
                        </span>
                    </span>
                    <span className="right-column">
                        <span className="small-label-right">pk field</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control"
                                    placeholder="primary key field name"
                                    value={this.state.pk}
                                    onChange={(event) => {this.change_callback({pk: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>


                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">web fields</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control jdbc-field-width"
                                       placeholder="document http/https reference SQL fields in square brackets [FIELD-NAME]"
                                       disabled={this.state.customRender}
                                       value={this.state.content_url}
                                       onChange={(event) => {this.change_callback({content_url: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>


                <div className="form-group">
                    <span className="label-right-top">select</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="SQL query, a valid SELECT statement, no other allowed"
                            rows={3}
                            value={this.state.query}
                            onChange={(event) => {this.change_callback({query: event.target.value})}}
                        />
                    </span>
                </div>


                <div className="form-group">
                    <span className="label-right-top">text index template</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="sql text index template, an text template referencing SQL fields in square brackets [FIELD-NAME]"
                            disabled={!this.state.customRender}
                            rows={4}
                            value={this.state.text}
                            onChange={(event) => {this.change_callback({text: event.target.value})}}
                        />
                    </span>
                </div>


                <div className="form-group">
                    <span className="label-right-top">html template</span>
                    <span className="full-column">
                        <textarea className="textarea-width"
                            placeholder="sql html render template, an html template referencing SQL fields in square brackets [FIELD-NAME]"
                            disabled={!this.state.customRender}
                            rows={22}
                            value={this.state.template}
                            onChange={(event) => {this.change_callback({template: event.target.value})}}
                        />
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerDatabase;
