import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Api} from "../common/api";

const type_list = [
    {"key": "none", "value": "please select database type"},
    {"key": "mysql", "value": "MySQL"},
    {"key": "postgresql", "value": "Postgresql"},
    {"key": "microsoftsql", "value": "Microsoft SQL"},
];


const styles = {
    formContent: {
        marginTop: '20px',
        width: '98%',
    },
    fieldWidth: {
        width: '100%',
    },
    dbType: {
        float: 'right',
        marginTop: '6px',
        marginRight: '10px',
    }
};


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
            template: props.template ? props.template : '',
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
            <div style={styles.formContent}>

                <Grid container spacing={1}>

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the user name for accessing this database"
                            label="user name"
                            variant="outlined"
                            value={this.state.username}
                            onChange={(event) => {this.change_callback({username: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="password"
                            label="password (enter a value to change it)"
                            type="password"
                            variant="outlined"
                            value={this.state.password}
                            onChange={(event) => {this.change_callback({password: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="jdbc connection string, e.g. jdbc:microsoft:sqlserver://HOST:1433;DatabaseName=DATABASE"
                            label="jdbc connection string"
                            variant="outlined"
                            value={this.state.jdbc}
                            onChange={(event) => {this.change_callback({jdbc: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={1}>
                        <div style={styles.dbType}>Database</div>
                    </Grid>
                    <Grid item xs={3}>
                        <Select
                            disableUnderline
                            value={this.state.type}
                            style={styles.fieldWidth}
                            onChange={(event) => {this.change_callback({type: event.target.value})}}>
                            {
                                type_list.map((value) => {
                                    return (<MenuItem key={value.key} value={value.key}>{value.value}</MenuItem>)
                                })
                            }
                        </Select>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the primary key field for this SELECT"
                            label="primary key name"
                            variant="outlined"
                            value={this.state.pk}
                            onChange={(event) => {this.change_callback({pk: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="SQL query, a valid SELECT statement, no other allowed"
                            label="sql query"
                            variant="outlined"
                            multiline={true}
                            rows={3}
                            value={this.state.query}
                            onChange={(event) => {this.change_callback({query: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="document http/https reference SQL fields in square brackets [FIELD-NAME]"
                            label="document http/https reference (non custom-renders)"
                            variant="outlined"
                            multiline={false}
                            disabled={this.state.customRender}
                            value={this.state.content_url}
                            onChange={(event) => {this.change_callback({content_url: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="sql text index template, an text template referencing SQL fields in square brackets [FIELD-NAME]"
                            label="sql text index template (custom-render only)"
                            variant="outlined"
                            multiline={true}
                            disabled={!this.state.customRender}
                            rows={7}
                            value={this.state.text}
                            onChange={(event) => {this.change_callback({text: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="sql html render template, an html template referencing SQL fields in square brackets [FIELD-NAME]"
                            label="sql html render template (custom-render only)"
                            variant="outlined"
                            multiline={true}
                            disabled={!this.state.customRender}
                            rows={7}
                            value={this.state.template}
                            onChange={(event) => {this.change_callback({template: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                </Grid>
            </div>
        );
    }
}

export default CrawlerDatabase;
