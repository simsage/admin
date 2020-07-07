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
            db_title: props.db_title ? props.db_title : '',
            db_author: props.db_author ? props.db_author : '',
            db_created: props.db_created ? props.db_created : '',
            db_last_modified: props.db_last_modified ? props.db_last_modified : '',
            db_template: props.db_template ? props.db_template : '',
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
                db_title: nextProps.db_title,
                db_author: nextProps.db_author,
                db_created: nextProps.db_created,
                db_last_modified: nextProps.db_last_modified,
                db_template: nextProps.db_template,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {db_username: data.db_username ? data.db_username : this.state.db_username,
            db_password: data.db_password ? data.db_password : this.state.db_password,
            db_jdbc: data.db_jdbc ? data.db_jdbc : this.state.db_jdbc,
            db_type: Api.defined(data.db_type) ? data.db_type : this.state.db_type,
            db_query: data.db_query ? data.db_query : this.state.db_query,
            db_pk: data.db_pk ? data.db_pk : this.state.db_pk,
            db_title: data.db_title ? data.db_title : this.state.db_title,
            db_author: data.db_author ? data.db_author : this.state.db_author,
            db_created: data.db_created ? data.db_created : this.state.db_created,
            db_last_modified: data.db_last_modified ? data.db_last_modified : this.state.db_last_modified,
            db_template: data.db_template ? data.db_template : this.state.db_template,
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
                            placeholder="password (enter a value to change it)"
                            label="password"
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
                    <Grid item xs={2}>
                        <div style={styles.dbType}>Database type</div>
                    </Grid>
                    <Grid item xs={5}>
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
                    <Grid item xs={4} />

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
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the title field (optional)"
                            label="title field name (optional)"
                            variant="outlined"
                            value={this.state.db_title}
                            onChange={(event) => {this.change_callback({db_title: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the author field (optional)"
                            label="author field name (optional)"
                            variant="outlined"
                            value={this.state.db_author}
                            onChange={(event) => {this.change_callback({db_author: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the created-datetime field (optional)"
                            label="created-datetime field name (optional)"
                            variant="outlined"
                            value={this.state.db_created}
                            onChange={(event) => {this.change_callback({db_created: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the last-modified-datetime field (optional)"
                            label="last-modified-datetime field name (optional)"
                            variant="outlined"
                            value={this.state.db_last_modified}
                            onChange={(event) => {this.change_callback({db_last_modified: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={5} />
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="sql template, a text template referencing SQL fields in square brackets [FIELD-NAME]"
                            label="sql template"
                            variant="outlined"
                            multiline={true}
                            rows={8}
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
