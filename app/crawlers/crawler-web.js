import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Api from '../common/api';
import Grid from "@material-ui/core/Grid";
import {ThemeProvider} from "@material-ui/core/styles";


const styles = {
    formContent: {
        marginTop: '20px',
        width: '98%',
    },
    textField: {
        width: '98%',
    },
};


export class CrawlerWeb extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onError: props.onError,
            onSave: props.onSave,

            // web specific
            web_base_url: Api.defined(props.web_base_url) ? props.web_base_url : '',
            web_css: Api.defined(props.web_css) ? props.web_css : '',
            web_css_ignore: Api.defined(props.web_css_ignore) ? props.web_css_ignore : '',
            web_extension_filter: Api.defined(props.web_extension_filter) ? props.web_extension_filter : '',
            web_extension_filter_ignore: Api.defined(props.web_extension_filter_ignore) ? props.web_extension_filter_ignore : '',
            web_article_filter_incl_csv: Api.defined(props.web_article_filter_incl_csv) ? props.web_article_filter_incl_csv : '',
            web_article_filter_excl_csv: Api.defined(props.web_article_filter_excl_csv) ? props.web_article_filter_excl_csv : '',
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
            this.setState(this.construct_data({web_base_url: nextProps.web_base_url,
                web_css: Api.defined(nextProps.web_css) ? nextProps.web_css : '',
                web_extension_filter: Api.defined(nextProps.web_extension_filter) ? nextProps.web_extension_filter : '',
                web_css_ignore: Api.defined(nextProps.web_css_ignore) ? nextProps.web_css_ignore : '',
                web_extension_filter_ignore: Api.defined(nextProps.web_extension_filter_ignore) ? nextProps.web_extension_filter_ignore : '',
                web_article_filter_incl_csv: Api.defined(nextProps.web_article_filter_incl_csv) ? nextProps.web_article_filter_incl_csv : '',
                web_article_filter_excl_csv: Api.defined(nextProps.web_article_filter_excl_csv) ? nextProps.web_article_filter_excl_csv : '',
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {web_base_url: Api.defined(data.web_base_url) ? data.web_base_url : this.state.web_base_url,
            web_css: Api.defined(data.web_css) ? data.web_css : this.state.web_css,
            web_css_ignore: Api.defined(data.web_css_ignore) ? data.web_css_ignore : this.state.web_css_ignore,
            web_extension_filter: Api.defined(data.web_extension_filter) ? data.web_extension_filter : this.state.web_extension_filter,
            web_extension_filter_ignore: Api.defined(data.web_extension_filter_ignore) ? data.web_extension_filter_ignore : this.state.web_extension_filter_ignore ,
            web_article_filter_incl_csv: Api.defined(data.web_article_filter_incl_csv) ? data.web_article_filter_incl_csv : this.state.web_article_filter_incl_csv ,
            web_article_filter_excl_csv: Api.defined(data.web_article_filter_excl_csv) ? data.web_article_filter_excl_csv : this.state.web_article_filter_excl_csv ,
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
            <div style={styles.formContent}>

                <Grid container spacing={2}>

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="http/s base name list (preferably https), one per line"
                            multiline={true}
                            autoFocus={true}
                            variant="outlined"
                            rows="3"
                            label="http/s base name list (preferably https), one per line"
                            value={this.state.web_base_url}
                            onChange={(event) => {this.change_callback({web_base_url: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            label="file extensions to include (csv list)"
                            variant="outlined"
                            value={this.state.web_extension_filter}
                            onChange={(event) => {this.change_callback({web_extension_filter: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            label="file extensions to exclude (csv list)"
                            variant="outlined"
                            value={this.state.web_extension_filter_ignore}
                            onChange={(event) => {this.change_callback({web_extension_filter_ignore: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="css/html root fragments to include csv"
                            multiline={true}
                            variant="outlined"
                            rows="3"
                            label="css/html root fragments to include csv (e.g. div.class or id)"
                            value={this.state.web_css}
                            onChange={(event) => {this.change_callback({web_css: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="css/html root fragments to exclude csv"
                            multiline={true}
                            variant="outlined"
                            rows="3"
                            label="css/html root fragments to exclude csv (e.g. div.class or id)"
                            value={this.state.web_css_ignore}
                            onChange={(event) => {this.change_callback({web_css_ignore: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="csv words, include articles by words [optional]"
                            multiline={true}
                            variant="outlined"
                            rows="3"
                            label="csv words, include articles by words [optional]"
                            value={this.state.web_article_filter_incl_csv}
                            onChange={(event) => {this.change_callback({web_article_filter_incl_csv: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="csv words, exclude articles by words [optional]"
                            multiline={true}
                            variant="outlined"
                            rows="3"
                            label="csv words, exclude articles by words [optional]"
                            value={this.state.web_article_filter_excl_csv}
                            onChange={(event) => {this.change_callback({web_article_filter_excl_csv: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                </Grid>

            </div>
        );
    }
}

export default CrawlerWeb;
