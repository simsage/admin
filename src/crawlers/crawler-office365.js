import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';
import Checkbox from "@material-ui/core/Checkbox";
import Api from '../common/api'
import Grid from "@material-ui/core/Grid";


const styles = {
    formContent: {
        marginTop: '20px',
        width: '98%',
    },
    textField: {
        width: '95%',
    },
    dlText: {
        marginTop: '-2px',
        width: '150px',
        float: 'left',
    },
    manualBox: {
        float: 'right',
        marginRight: '100px',
    },
    manualImage: {
        float: 'left',
        width: '40px',
    }
};


export class CrawlerOffice365 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // office 365 properties
            tenantId: props.tenantId ? props.tenantId : '',
            clientId: props.clientId ? props.clientId : '',
            clientSecret: props.clientSecret ? props.clientSecret : '',
            redirectUrl: props.redirectUrl ? props.redirectUrl : '',

            crawlOneDrive: Api.defined(props.crawlOneDrive) ? props.crawlOneDrive : false,
            crawlAllOfOneDrive: Api.defined(props.crawlAllOfOneDrive) ? props.crawlAllOfOneDrive : false,
            oneDriveUsersToCrawl: props.oneDriveUsersToCrawl ? props.oneDriveUsersToCrawl : '',

            crawlSharePoint: Api.defined(props.crawlSharePoint) ? props.crawlSharePoint : false,
            crawlRootSite: Api.defined(props.crawlRootSite) ? props.crawlRootSite : false,
            sharePointSitesToCrawl: props.sharePointSitesToCrawl ? props.sharePointSitesToCrawl : '',

            crawlExchange: Api.defined(props.crawlExchange) ? props.crawlExchange : false,
            crawlAllOfExchange: Api.defined(props.crawlAllOfExchange) ? props.crawlAllOfExchange : false,
            exchangeUsersToCrawl: props.exchangeUsersToCrawl ? props.exchangeUsersToCrawl : '',

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
                tenantId: nextProps.tenantId,
                clientId: nextProps.clientId,
                clientSecret: nextProps.clientSecret,
                redirectUrl: nextProps.redirectUrl,

                crawlOneDrive: nextProps.crawlOneDrive,
                crawlAllOfOneDrive: nextProps.crawlAllOfOneDrive,
                oneDriveUsersToCrawl: nextProps.oneDriveUsersToCrawl,

                crawlSharePoint: nextProps.crawlSharePoint,
                crawlRootSite: nextProps.crawlRootSite,
                sharePointSitesToCrawl: nextProps.sharePointSitesToCrawl,

                crawlExchange: nextProps.crawlExchange,
                crawlAllOfExchange: nextProps.crawlAllOfExchange,
                exchangeUsersToCrawl: nextProps.exchangeUsersToCrawl,

                specific_json: nextProps.specific_json,

                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,

            tenantId: Api.defined(data.tenantId) ? data.tenantId : this.state.tenantId,
            clientId: Api.defined(data.clientId) ? data.clientId : this.state.clientId,
            clientSecret: Api.defined(data.clientSecret) ? data.clientSecret : this.state.clientSecret,
            redirectUrl: Api.defined(data.redirectUrl) ? data.redirectUrl : this.state.redirectUrl,

            crawlOneDrive: Api.defined(data.crawlOneDrive) ? data.crawlOneDrive : this.state.crawlOneDrive,
            crawlAllOfOneDrive: Api.defined(data.crawlAllOfOneDrive) ? data.crawlAllOfOneDrive : this.state.crawlAllOfOneDrive,
            oneDriveUsersToCrawl: Api.defined(data.oneDriveUsersToCrawl) ? data.oneDriveUsersToCrawl : this.state.oneDriveUsersToCrawl,

            crawlSharePoint: Api.defined(data.crawlSharePoint) ? data.crawlSharePoint : this.state.crawlSharePoint,
            crawlRootSite: Api.defined(data.crawlRootSite) ? data.crawlRootSite : this.state.crawlRootSite,
            sharePointSitesToCrawl: Api.defined(data.sharePointSitesToCrawl) ? data.sharePointSitesToCrawl : this.state.sharePointSitesToCrawl,

            crawlExchange: Api.defined(data.crawlExchange) ? data.crawlExchange : this.state.crawlExchange,
            crawlAllOfExchange: Api.defined(data.crawlAllOfExchange) ? data.crawlAllOfExchange : this.state.crawlAllOfExchange,
            exchangeUsersToCrawl: Api.defined(data.exchangeUsersToCrawl) ? data.exchangeUsersToCrawl : this.state.exchangeUsersToCrawl,
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
            return <h1>crawler-office365.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>

                <Grid container spacing={1}>

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="tenant id"
                            label="tenant id"
                            autoFocus={true}
                            value={this.state.tenantId}
                            onChange={(event) => {this.change_callback({tenantId: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <div style={styles.manualBox}>
                            <a href="../resources/simsage-office365-setup.pdf" id="dlOffice365" target="_blank" title="download the SimSage Office 365 setup guide">
                                <div style={styles.dlText}>download Microsoft Azure configuration instructions</div>
                                <img src="../images/pdf-icon.png" alt="offce 365 setup guide" style={styles.manualImage}/></a>
                        </div>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="client id"
                            label="client id"
                            value={this.state.clientId}
                            onChange={(event) => {this.change_callback({clientId: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            placeholder="client secret"
                            label="client secret"
                            value={this.state.clientSecret}
                            onChange={(event) => {this.change_callback({clientSecret: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <TextField
                            placeholder="redirect url: the SimSage interface url to return-to after MS sign-in completes."
                            label="redirect url"
                            value={this.state.redirectUrl}
                            onChange={(event) => {this.change_callback({redirectUrl: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={6} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want OneDrive of your Office365 to be included">
                            <Checkbox
                                checked={this.state.crawlOneDrive}
                                onChange={(event) => { this.change_callback({crawlOneDrive: event.target.checked}); }}
                                value="enable OneDrive?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            enable OneDrive?
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want ALL of OneDrive to be included">
                            <Checkbox
                                checked={this.state.crawlAllOfOneDrive}
                                disabled={!this.state.crawlOneDrive}
                                onChange={(event) => { this.change_callback({crawlAllOfOneDrive: event.target.checked}); }}
                                value="crawl all of OneDrive?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            crawl all of OneDrive?
                        </div>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="specific one-drive accounts (comma separated email addresses)"
                            label="specific one-drive accounts (comma separated email addresses)"
                            disabled={this.state.crawlAllOfOneDrive || !this.state.crawlOneDrive}
                            variant="outlined"
                            multiline={true}
                            rows={2}
                            value={this.state.oneDriveUsersToCrawl}
                            onChange={(event) => {this.change_callback({oneDriveUsersToCrawl: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />


                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want SharePoint of your Office365 to be included">
                            <Checkbox
                                checked={this.state.crawlSharePoint}
                                onChange={(event) => { this.change_callback({crawlSharePoint: event.target.checked}); }}
                                value="enable SharePoint indexing?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            enable SharePoint indexing?
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want the root SharePoint site to be indexed">
                            <Checkbox
                                checked={this.state.crawlRootSite}
                                disabled={!this.state.crawlSharePoint}
                                onChange={(event) => { this.change_callback({crawlRootSite: event.target.checked}); }}
                                value="crawl SharePoint root site?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            crawl SharePoint root site?
                        </div>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="other SharePoint sites (comma separated ids)"
                            label="other SharePoint sites (comma separated ids)"
                            disabled={!this.state.crawlSharePoint}
                            variant="outlined"
                            multiline={true}
                            rows={2}
                            value={this.state.sharePointSitesToCrawl}
                            onChange={(event) => {this.change_callback({sharePointSitesToCrawl: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want Exchange of your Office365 to be included">
                            <Checkbox
                                checked={this.state.crawlExchange}
                                onChange={(event) => { this.change_callback({crawlExchange: event.target.checked}); }}
                                value="enable Exchange?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            enable Exchange?
                        </div>
                    </Grid>
                    <Grid item xs={5}>
                        <div style={{float: 'left'}} title="Check this box if you want ALL of Exchange to be included">
                            <Checkbox
                                checked={this.state.crawlAllOfExchange}
                                disabled={!this.state.crawlExchange}
                                onChange={(event) => { this.change_callback({crawlAllOfExchange: event.target.checked}); }}
                                value="crawl all of Exchange?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            crawl all of Exchange?
                        </div>
                    </Grid>
                    <Grid item xs={1} />

                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <TextField
                            placeholder="specific exchange accounts (comma separated email addresses)"
                            label="specific exchange accounts (comma separated email addresses)"
                            disabled={this.state.crawlAllOfExchange || !this.state.crawlExchange}
                            variant="outlined"
                            multiline={true}
                            rows={2}
                            value={this.state.exchangeUsersToCrawl}
                            onChange={(event) => {this.change_callback({exchangeUsersToCrawl: event.target.value})}}
                            style={styles.textField}
                        />
                    </Grid>
                    <Grid item xs={1} />

                </Grid>

            </div>
        );
    }
}

export default CrawlerOffice365;
