import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";
import {Api} from "../common/api";


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


export class CrawlerRestFull extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // database specific
            rest_pk: props.rest_pk ? props.rest_pk : '',
            rest_url: props.rest_url ? props.rest_url : '',
            rest_template: props.rest_template ? props.rest_template : '',
            rest_text: props.rest_text ? props.rest_text : '',
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
            this.setState(this.construct_data({
                rest_pk: nextProps.rest_pk,
                rest_url: nextProps.rest_url,
                rest_template: nextProps.rest_template,
                rest_text: nextProps.rest_text,
                metadata_list: nextProps.metadata_list,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {rest_url: Api.defined(data.rest_url) ? data.rest_url : this.state.rest_url,
            rest_template: Api.defined(data.rest_template) ? data.rest_template : this.state.rest_template,
            rest_text: Api.defined(data.rest_text) ? data.rest_text : this.state.rest_text,
            rest_pk: Api.defined(data.rest_pk) ? data.rest_pk : this.state.rest_pk,
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
            return <h1>crawler-restfull.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>

                <Grid container spacing={1}>

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="url"
                            label="url"
                            variant="outlined"
                            value={this.state.rest_url}
                            onChange={(event) => {this.change_callback({rest_url: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="the name of the primary key in the record"
                            label="primary key name"
                            variant="outlined"
                            value={this.state.rest_pk}
                            onChange={(event) => {this.change_callback({rest_pk: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={6} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="REST text index template, an text template referencing REST fields in square brackets [FIELD-NAME]"
                            label="REST text index template"
                            variant="outlined"
                            multiline={true}
                            rows={7}
                            value={this.state.rest_text}
                            onChange={(event) => {this.change_callback({rest_text: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="REST html render template, an html template referencing REST fields in square brackets [FIELD-NAME]"
                            label="REST html render template"
                            variant="outlined"
                            multiline={true}
                            rows={7}
                            value={this.state.rest_template}
                            onChange={(event) => {this.change_callback({rest_template: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={1} />

                </Grid>
            </div>
        );
    }
}

export default CrawlerRestFull;
