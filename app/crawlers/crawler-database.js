import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';


const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '500px',
    },
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
            db_query: props.db_query ? props.db_query : '',
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
    componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({file_username: nextProps.file_username,
                db_username: nextProps.db_username,
                db_password: nextProps.db_password,
                db_jdbc: nextProps.db_jdbc,
                db_query: nextProps.db_query,
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
            db_query: data.db_query ? data.db_query : this.state.db_query,
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
                <TextField
                    placeholder="user name"
                    label="user name"
                    value={this.state.db_username}
                    onChange={(event) => {this.change_callback({db_username: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="password"
                    label="password"
                    type="password"
                    value={this.state.db_password}
                    onChange={(event) => {this.change_callback({db_password: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="jdbc connection string"
                    label="jdbc connection string"
                    value={this.state.db_jdbc}
                    onChange={(event) => {this.change_callback({db_jdbc: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="sql query"
                    label="sql query"
                    multiline={true}
                    rows={3}
                    value={this.state.db_query}
                    onChange={(event) => {this.change_callback({db_query: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

                <TextField
                    placeholder="sql template"
                    label="sql template"
                    multiline={true}
                    rows={3}
                    value={this.state.db_template}
                    onChange={(event) => {this.change_callback({db_template: event.target.value})}}
                    style={styles.textField}
                />
                <br />
                <br />

            </div>
        );
    }
}

export default CrawlerDatabase;
