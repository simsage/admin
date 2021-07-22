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
            pk: props.pk ? props.pk : '',
            url: props.url ? props.url : '',
            template: props.template ? props.template : '',
            text: props.text ? props.text : '',
            content_url: props.content_url ? props.content_url : '',
            customRender: props.customRender ? props.customRender : false,

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
                pk: nextProps.pk,
                url: nextProps.url,
                template: nextProps.template,
                text: nextProps.text,
                content_url: nextProps.content_url ? nextProps.content_url : '',
                customRender: nextProps.customRender ? nextProps.customRender : false,

                specific_json: nextProps.specific_json,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            url: Api.defined(data.url) ? data.url : this.state.url,
            template: Api.defined(data.template) ? data.template : this.state.template,
            text: Api.defined(data.text) ? data.text : this.state.text,
            content_url: Api.defined(data.content_url) ? data.content_url : this.state.content_url,
            pk: Api.defined(data.pk) ? data.pk : this.state.pk,
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
                            value={this.state.url}
                            onChange={(event) => {this.change_callback({url: event.target.value})}}
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
                            value={this.state.pk}
                            onChange={(event) => {this.change_callback({pk: event.target.value})}}
                            style={styles.fieldWidth}
                        />
                    </Grid>
                    <Grid item xs={6} />

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
                            placeholder="REST text index template, an text template referencing REST fields in square brackets [FIELD-NAME]"
                            label="REST text index template"
                            variant="outlined"
                            disabled={!this.state.customRender}
                            multiline={true}
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
                            placeholder="REST html render template, an html template referencing REST fields in square brackets [FIELD-NAME]"
                            label="REST html render template"
                            variant="outlined"
                            disabled={!this.state.customRender}
                            multiline={true}
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

export default CrawlerRestFull;
