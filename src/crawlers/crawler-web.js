import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Api from '../common/api';
import Grid from "@material-ui/core/Grid";


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
            baseUrlList: Api.defined(props.baseUrlList) ? props.baseUrlList : '',
            webCss: Api.defined(props.webCss) ? props.webCss : '',
            webCssIgnore: Api.defined(props.webCssIgnore) ? props.webCssIgnore : '',
            validExtensions: Api.defined(props.validExtensions) ? props.validExtensions : '',
            validExtensionsIgnore: Api.defined(props.validExtensionsIgnore) ? props.validExtensionsIgnore : '',
            articleIncludeWordsCsv: Api.defined(props.articleIncludeWordsCsv) ? props.articleIncludeWordsCsv : '',
            articleExcludeWordsCsv: Api.defined(props.articleExcludeWordsCsv) ? props.articleExcludeWordsCsv : '',
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
            this.setState(this.construct_data({baseUrlList: nextProps.baseUrlList,
                webCss: Api.defined(nextProps.webCss) ? nextProps.webCss : '',
                validExtensions: Api.defined(nextProps.validExtensions) ? nextProps.validExtensions : '',
                webCssIgnore: Api.defined(nextProps.webCssIgnore) ? nextProps.webCssIgnore : '',
                validExtensionsIgnore: Api.defined(nextProps.validExtensionsIgnore) ? nextProps.validExtensionsIgnore : '',
                articleIncludeWordsCsv: Api.defined(nextProps.articleIncludeWordsCsv) ? nextProps.articleIncludeWordsCsv : '',
                articleExcludeWordsCsv: Api.defined(nextProps.articleExcludeWordsCsv) ? nextProps.articleExcludeWordsCsv : '',
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
                            value={this.state.baseUrlList}
                            onChange={(event) => {this.change_callback({baseUrlList: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            label="file extensions to include (csv list)"
                            variant="outlined"
                            value={this.state.validExtensions}
                            onChange={(event) => {this.change_callback({validExtensions: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            label="file extensions to exclude (csv list)"
                            variant="outlined"
                            value={this.state.validExtensionsIgnore}
                            onChange={(event) => {this.change_callback({validExtensionsIgnore: event.target.value})}}
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
                            value={this.state.webCss}
                            onChange={(event) => {this.change_callback({webCss: event.target.value})}}
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
                            value={this.state.webCssIgnore}
                            onChange={(event) => {this.change_callback({webCssIgnore: event.target.value})}}
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
                            value={this.state.articleIncludeWordsCsv}
                            onChange={(event) => {this.change_callback({articleIncludeWordsCsv: event.target.value})}}
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
                            value={this.state.articleExcludeWordsCsv}
                            onChange={(event) => {this.change_callback({articleExcludeWordsCsv: event.target.value})}}
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
