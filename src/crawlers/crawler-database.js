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
            db_username: props.db_username ? props.db_username : '',
            db_password: props.db_password ? props.db_password : '',
            db_jdbc: props.db_jdbc ? props.db_jdbc : '',
            db_type: Api.defined(props.db_type) ? props.db_type : 'none',
            db_query: props.db_query ? props.db_query : '',
            db_pk: props.db_pk ? props.db_pk : '',
            db_template: props.db_template ? props.db_template : '',
            db_text: props.db_text ? props.db_text : '',
            metadata_list: props.metadata_list ? props.metadata_list : [],
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
            this.setState(this.construct_data({file_username: nextProps.file_username,
                db_username: nextProps.db_username,
                db_password: nextProps.db_password,
                db_jdbc: nextProps.db_jdbc,
                db_type: Api.defined(nextProps.db_type) ? nextProps.db_type : 'none',
                db_query: nextProps.db_query,
                db_pk: nextProps.db_pk,
                db_template: nextProps.db_template,
                db_text: nextProps.db_text,
                metadata_list: nextProps.metadata_list,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {db_username: Api.defined(data.db_username) ? data.db_username : this.state.db_username,
            db_password: Api.defined(data.db_password) ? data.db_password : this.state.db_password,
            db_jdbc: Api.defined(data.db_jdbc) ? data.db_jdbc : this.state.db_jdbc,
            db_type: Api.defined(data.db_type) ? data.db_type : this.state.db_type,
            db_query: Api.defined(data.db_query) ? data.db_query : this.state.db_query,
            db_pk: Api.defined(data.db_pk) ? data.db_pk : this.state.db_pk,
            db_template: Api.defined(data.db_template) ? data.db_template : this.state.db_template,
            db_text: Api.defined(data.db_text) ? data.db_text : this.state.db_text,
            metadata_list: Api.defined(data.metadata_list) ? data.metadata_list : this.state.metadata_list,
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
                            value={this.state.db_username}
                            onChange={(event) => {this.change_callback({db_username: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="password"
                            label="password (enter a value to change it)"
                            type="password"
                            variant="outlined"
                            value={this.state.db_password}
                            onChange={(event) => {this.change_callback({db_password: event.target.value})}}
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
                            value={this.state.db_jdbc}
                            onChange={(event) => {this.change_callback({db_jdbc: event.target.value})}}
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
                            value={this.state.db_type}
                            style={styles.fieldWidth}
                            onChange={(event) => {this.change_callback({db_type: event.target.value})}}>
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
                            value={this.state.db_pk}
                            onChange={(event) => {this.change_callback({db_pk: event.target.value})}}
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
                            value={this.state.db_query}
                            onChange={(event) => {this.change_callback({db_query: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="sql text index template, an text template referencing SQL fields in square brackets [FIELD-NAME]"
                            label="sql text index template"
                            variant="outlined"
                            multiline={true}
                            rows={7}
                            value={this.state.db_text}
                            onChange={(event) => {this.change_callback({db_text: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="sql html render template, an html template referencing SQL fields in square brackets [FIELD-NAME]"
                            label="sql html render template"
                            variant="outlined"
                            multiline={true}
                            rows={7}
                            value={this.state.db_template}
                            onChange={(event) => {this.change_callback({db_template: event.target.value})}}
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
