import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TimeSelect from '../common/time-select'
import Api from '../common/api'

import CrawlerGeneral from './crawler-general'
import CrawlerFile from './crawler-file'
import CrawlerWeb from "./crawler-web";
import CrawlerDatabase from "./crawler-database";
import CrawlerOffice365 from "./crawler-office365";
import CrawlerDropbox from "./crawler-dropbox";
import CrawlerWordpress from "./crawler-wordpress";
import CrawlerGDrive from "./crawler-gdrive";


const styles = {
    formContent: {
        overflowY: 'scroll',
        height: '550px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    timeTabContent: {
        marginLeft: '20px',
    }
};

export class CrawlerDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,

            onSave: props.onSave,  // save callback
            onUpdate: props.onUpdate, // update callback

            onError: props.onError,
            error_title: props.error_title,
            error_msg: props.error_msg,

            selectedTab: 'general',

            // cache
            schedule: '',

            // organisational details
            organisation_id: props.organisation_id,
            kb_id: props.kb_id,

            has_error: false,

            ...this.setupFromCrawler(props.crawler)
        }
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps !== null) {
            if (nextProps.crawler && nextProps.crawler) {
                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onUpdate: nextProps.onUpdate,

                    onError: nextProps.onError,
                    error_title: nextProps.error_title,
                    error_msg: nextProps.error_msg,

                    organisation_id: nextProps.organisation_id,
                    kb_id: nextProps.kb_id,

                    ...this.setupFromCrawler(nextProps.crawler)
                });

            } else {
                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onError: nextProps.onError,
                });
            }
        }
    }
    setupFromCrawler(crawler) {

        let file_username = '';
        let file_password = '';
        let file_domain = '';
        let file_server = '';
        let file_share_name = '';
        let file_share_path = '';

        if (crawler.crawlerType === "file") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                file_username = obj['username'];
                file_password = obj['password'];
                file_domain = obj['domain'];
                file_server = obj['server'];
                file_share_name = obj['shareName'];
                file_share_path = obj['sharePath'];
            }
        }

        let web_base_url = '';
        let web_extension_filter = '';
        let web_extension_filter_ignore = '';
        let web_css = '';
        let web_css_ignore = '';
        let web_article_filter_incl_csv = '';
        let web_article_filter_excl_csv = '';

        if (crawler.crawlerType === "web") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                web_base_url = obj['baseUrlList'];
                web_extension_filter = Api.defined(obj['validExtensions']) ? obj['validExtensions'] : '';
                web_extension_filter_ignore = Api.defined(obj['validExtensionsIgnore']) ? obj['validExtensionsIgnore'] : '';
                web_css = Api.defined(obj['webCss']) ? obj['webCss'] : '';
                web_css_ignore = Api.defined(obj['webCssIgnore']) ? obj['webCssIgnore']: '';
                web_article_filter_incl_csv = Api.defined(obj['articleIncludeWordsCsv']) ? obj['articleIncludeWordsCsv']: '';
                web_article_filter_excl_csv = Api.defined(obj['articleExcludeWordsCsv']) ? obj['articleExcludeWordsCsv']: '';
            }
        }

        let db_username = '';
        let db_password = '';
        let db_jdbc = '';
        let db_type = 'none';
        let db_query = '';
        let db_pk = '';
        let db_title = '';
        let db_author = '';
        let db_created = '';
        let db_last_modified = '';
        let db_template = '';

        if (crawler.crawlerType === "database") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                db_username = obj['username'];
                db_password = obj['password'];
                db_jdbc = obj['jdbc'];
                db_type = obj['type'];
                db_query = obj['query'];
                db_pk = obj['pk'];
                db_title = obj['title'];
                db_author = obj['author'];
                db_created = obj['created'];
                db_last_modified = obj['last_modified'];
                db_template = obj['template'];
            }
        }

        let tenantId = '';
        let clientId = '';
        let clientSecret = '';
        let redirectUrl = '';
        let crawlOneDrive = false;
        let crawlAllOfOneDrive = false;
        let oneDriveUsersToCrawl = '';
        let crawlSharePoint = false;
        let crawlRootSite = false;
        let sharePointSitesToCrawl = '';
        let crawlExchange = false;
        let crawlAllOfExchange = false;
        let exchangeUsersToCrawl = '';
        if (crawler.crawlerType === "office365") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                tenantId = obj['tenantId'];
                clientId = obj['clientId'];
                clientSecret = obj['clientSecret'];
                redirectUrl = obj['redirectUrl'];
                crawlOneDrive = obj['crawlOneDrive'];
                crawlAllOfOneDrive = obj['crawlAllOfOneDrive'];
                oneDriveUsersToCrawl = obj['oneDriveUsersToCrawl'];
                crawlSharePoint = obj['crawlSharePoint'];
                crawlRootSite = obj['crawlRootSite'];
                sharePointSitesToCrawl = obj['sharePointSitesToCrawl'];
                crawlExchange = obj['crawlExchange'];
                crawlAllOfExchange = obj['crawlAllOfExchange'];
                exchangeUsersToCrawl = obj['exchangeUsersToCrawl'];
            }
        }

        let clientToken = '';
        let folderList = '';
        let userList = '';
        if (crawler.crawlerType === "dropbox") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                clientToken = obj['clientToken'];
                folderList = obj['folderList'];
                userList = Api.defined(obj['userList']) ? obj['userList']: '';
            }
        }

        let gdrive_projectId = '';
        let gdrive_clientId = '';
        let gdrive_clientSecret = '';
        let gdrive_clientName = '';
        let gdrive_clientPort = '';
        let gdrive_userList = '';
        if (crawler.crawlerType === "gdrive") {
            if (crawler.specificJson && crawler.specificJson.length > 0) {
                const obj = JSON.parse(crawler.specificJson);
                gdrive_projectId = Api.defined(obj['gdrive_projectId']) ? obj['gdrive_projectId']: '';
                gdrive_clientId = Api.defined(obj['gdrive_clientId']) ? obj['gdrive_clientId']: '';
                gdrive_clientSecret = Api.defined(obj['gdrive_clientSecret']) ? obj['gdrive_clientSecret']: '';
                gdrive_clientName = Api.defined(obj['gdrive_clientName']) ? obj['gdrive_clientName']: '';
                gdrive_clientPort = Api.defined(obj['gdrive_clientPort']) ? obj['gdrive_clientPort']: '';
                gdrive_userList = Api.defined(obj['gdrive_userList']) ? obj['gdrive_userList']: '';
            }
        }

        // wordpress has no additional properties

        return {
            sourceId: crawler.sourceId,
            nodeId: crawler.nodeId,
            name: crawler.name,
            crawlerType: crawler.crawlerType,
            filesPerSecond: crawler.filesPerSecond,
            schedule: (Api.defined(crawler.schedule) ? crawler.schedule : ''),
            deleteFiles: crawler.deleteFiles,
            allowAnonymous: crawler.allowAnonymous,
            enablePreview: crawler.enablePreview,
            processingLevel: crawler.processingLevel,
            maxItems: crawler.maxItems,
            maxBotItems: crawler.maxBotItems,

            file_username: file_username,
            file_password: file_password,
            file_domain: file_domain,
            file_server: file_server,
            file_share_name: file_share_name,
            file_share_path: file_share_path,

            web_base_url: web_base_url,
            web_extension_filter: web_extension_filter,
            web_extension_filter_ignore: web_extension_filter_ignore,
            web_css: web_css,
            web_css_ignore: web_css_ignore,
            web_article_filter_incl_csv: web_article_filter_incl_csv,
            web_article_filter_excl_csv: web_article_filter_excl_csv,

            db_username: db_username,
            db_password: db_password,
            db_jdbc: db_jdbc,
            db_type: db_type,
            db_query: db_query,
            db_pk: db_pk,
            db_title: db_title,
            db_author: db_author,
            db_created: db_created,
            db_last_modified: db_last_modified,
            db_template: db_template,

            tenantId: tenantId,
            clientId: clientId,
            clientSecret: clientSecret,
            redirectUrl: redirectUrl,
            crawlOneDrive: crawlOneDrive,
            crawlAllOfOneDrive: crawlAllOfOneDrive,
            oneDriveUsersToCrawl: oneDriveUsersToCrawl,
            crawlSharePoint: crawlSharePoint,
            crawlRootSite: crawlRootSite,
            sharePointSitesToCrawl: sharePointSitesToCrawl,
            crawlExchange: crawlExchange,
            crawlAllOfExchange: crawlAllOfExchange,
            exchangeUsersToCrawl: exchangeUsersToCrawl,

            gdrive_projectId: gdrive_projectId,
            gdrive_clientId: gdrive_clientId,
            gdrive_clientSecret: gdrive_clientSecret,
            gdrive_clientName: gdrive_clientName,
            gdrive_clientPort: gdrive_clientPort,
            gdrive_userList: gdrive_userList,

            // for now shared between gdrive and dropbox
            clientToken: clientToken,
            folderList: folderList,
            userList: userList,
        }
    }
    setError(title, error_msg) {
        if (this.props.onError) {
            this.props.onError(title, error_msg);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
        this.setState({open: false});
    };
    handleSave() {
        if (this.state.name.length === 0) {

            this.setError('invalid parameters', 'you must supply a crawler name as a minimum.');

        } else if (this.state.crawlerType === 'file' && (
            this.state.file_username.length === 0 ||
            this.state.file_server.length === 0 ||
            this.state.file_share_name.length === 0)) {

            this.setError('invalid parameters', 'you must supply crawler-type, name, username, server and share path as a minimum.');

        } else if (this.state.crawlerType === 'web' && (
                this.state.web_base_url.length === 0 ||
                (!this.state.web_base_url.startsWith("http://") && !this.state.web_base_url.startsWith("https://")) )) {

            this.setError('invalid parameters', 'you must supply a base url of type http:// or https://');

        } else if (this.state.crawlerType === 'database' && (
                this.state.db_jdbc.length === 0 ||
                this.state.db_type.length === 0 || this.state.db_type === 'none' ||
                this.state.db_query.length === 0 || this.state.db_pk.length === 0 ||
                this.state.db_template.length === 0)) {

            this.setError('invalid parameters', 'you must supply a jdbc connection string, database-type, a query, a primary-key, and a SQL-template as a minimum.');

        } else if (this.state.crawlerType === 'office365' && (
                this.state.tenantId.length === 0 ||
                this.state.clientId.length === 0 ||
                this.state.redirectUrl.length === 0 ||
                this.state.clientSecret.length === 0)) {

            this.setError('invalid parameters', 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.');

        } else if (this.state.crawlerType === 'dropbox' && (this.state.clientToken.length === 0 ||
                   this.state.userList.length === 0)) {

            this.setError('invalid parameters', 'you must supply a client-token, and select a user as a minimum.');

        } else if (this.state.crawlerType === 'gdrive' && (this.state.gdrive_clientId.length === 0 || this.state.gdrive_projectId.length === 0 ||
                   this.state.gdrive_clientSecret.length === 0 || this.state.gdrive_clientName.length === 0 || this.state.gdrive_clientPort.length ===0 ||
                   this.state.gdrive_userList.length === 0)) {

            this.setError('invalid parameters', 'you must supply values for all fields, and select one user as a minimum.');

        } else if (this.state.crawlerType !== 'web' && this.state.crawlerType !== 'file' && this.state.crawlerType !== 'database' &&
                   this.state.crawlerType !== 'office365' && this.state.crawlerType !== 'dropbox' &&
                   this.state.crawlerType !== 'wordpress' && this.state.crawlerType !== 'gdrive') {

            this.setError('invalid parameters', 'you must select a crawler-type first.');

        } else if (isNaN(this.state.filesPerSecond)) {

            this.setError("invalid parameters", "files-per-second must be a number");

        } else {
            // save setup?
            if (this.state.onSave) {
                this.state.onSave(this.getCrawlerData(this.state));
                // and reset the tabs to the first tab
                this.setState({selectedTab: 'general'});
            }
        }
    };
    getCrawlerData(data) {
        let specificJson = this.convertSpecificJson(this.state);
        return {
            sourceId: data.sourceId,
            nodeId: data.nodeId,
            name: data.name,
            crawlerType: data.crawlerType,
            deleteFiles: data.deleteFiles,
            allowAnonymous: data.allowAnonymous,
            enablePreview: data.enablePreview,
            processingLevel: data.processingLevel,
            maxItems: data.maxItems,
            maxBotItems: data.maxBotItems,
            filesPerSecond: data.filesPerSecond,
            schedule: data.schedule,
            specificJson: specificJson,
        }
    };
    convertSpecificJson(data) {
        let specificJson = {};
        if (data) {
            if (this.state.crawlerType === 'file') {
                specificJson = JSON.stringify({
                    username: data.file_username ? data.file_username : '',
                    password: data.file_password ? data.file_password : '',
                    domain: data.file_domain ? data.file_domain : '',
                    server: data.file_server ? data.file_server : '',
                    shareName: data.file_share_name ? data.file_share_name : '',
                    sharePath: data.file_share_path ? data.file_share_path : '',
                });
            } else if (this.state.crawlerType === 'database') {
                specificJson = JSON.stringify({
                    username: data.db_username ? data.db_username : '',
                    password: data.db_password ? data.db_password : '',
                    jdbc: data.db_jdbc ? data.db_jdbc : '',
                    type: data.db_type ? data.db_type : 'none',
                    query: data.db_query ? data.db_query : '',
                    pk: data.db_pk ? data.db_pk : '',
                    title: data.db_title ? data.db_title : '',
                    author: data.db_author ? data.db_author : '',
                    created: data.db_created ? data.db_created : '',
                    last_modified: data.db_last_modified ? data.db_last_modified : '',
                    template: data.db_template ? data.db_template : '',
                });
            } else if (this.state.crawlerType === 'office365') {
                specificJson = JSON.stringify({
                    tenantId: data.tenantId ? data.tenantId : '',
                    clientId: data.clientId ? data.clientId : '',
                    clientSecret: data.clientSecret ? data.clientSecret : '',
                    redirectUrl: data.redirectUrl ? data.redirectUrl : '',
                    crawlOneDrive: Api.defined(data.crawlOneDrive) ? data.crawlOneDrive : false,
                    crawlAllOfOneDrive: Api.defined(data.crawlAllOfOneDrive) ? data.crawlAllOfOneDrive : false,
                    oneDriveUsersToCrawl: data.oneDriveUsersToCrawl ? data.oneDriveUsersToCrawl : '',
                    crawlSharePoint: Api.defined(data.crawlSharePoint) ? data.crawlSharePoint : false,
                    crawlRootSite: Api.defined(data.crawlRootSite) ? data.crawlRootSite : false,
                    sharePointSitesToCrawl: data.sharePointSitesToCrawl ? data.sharePointSitesToCrawl : '',
                    crawlExchange: Api.defined(data.crawlExchange) ? data.crawlExchange : false,
                    crawlAllOfExchange: Api.defined(data.crawlAllOfExchange) ? data.crawlAllOfExchange : false,
                    exchangeUsersToCrawl: data.exchangeUsersToCrawl ? data.exchangeUsersToCrawl : '',
                });
            } else if (this.state.crawlerType === 'dropbox') {
                specificJson = JSON.stringify({
                    clientToken: data.clientToken ? data.clientToken : '',
                    folderList: data.folderList ? data.folderList : '',
                    userList: data.userList ? data.userList : '',
                });
            } else if (this.state.crawlerType === 'gdrive') {
                specificJson = JSON.stringify({
                    gdrive_projectId: data.gdrive_projectId ? data.gdrive_projectId : '',
                    gdrive_clientId: data.gdrive_clientId ? data.gdrive_clientId : '',
                    gdrive_clientSecret: data.gdrive_clientSecret ? data.gdrive_clientSecret : '',
                    gdrive_clientName: data.gdrive_clientName ? data.gdrive_clientName : '',
                    gdrive_clientPort: data.gdrive_clientPort ? data.gdrive_clientPort : '',
                    gdrive_userList: data.gdrive_userList ? data.gdrive_userList : '',
                });
            } else if (this.state.crawlerType === 'wordpress') {
                // dummy value in order to save
                specificJson = JSON.stringify({
                    crawlerType: 'wordpress',
                });
            } else if (this.state.crawlerType === 'web') {
                specificJson = JSON.stringify({
                    baseUrlList: data.web_base_url ? data.web_base_url : '',
                    validExtensions: data.web_extension_filter ? data.web_extension_filter : '',
                    validExtensionsIgnore: data.web_extension_filter_ignore ? data.web_extension_filter_ignore : '',
                    webCss: data.web_css ? data.web_css : '',
                    webCssIgnore: data.web_css_ignore ? data.web_css_ignore : '',
                    articleIncludeWordsCsv: data.web_article_filter_incl_csv ? data.web_article_filter_incl_csv : '',
                    articleExcludeWordsCsv: data.web_article_filter_excl_csv ? data.web_article_filter_excl_csv : '',
                });
            }
        }
        return specificJson;
    };
    updateSchedule(time) {
        if (time !== null) {
            this.setState({schedule: time});
            if (this.state.onUpdate) {
                this.state.onUpdate({...this.getCrawlerData(this.state), "schedule": time});
            }
        }
    }
    update_general_data(data) {
        this.setState({...this.state, data});
        if (this.state.onUpdate) {
            this.state.onUpdate({...this.getCrawlerData(data), "schedule": this.state.schedule});
        }
    }
    update_control_data(data) {
        this.setState({...this.state, data});
        if (this.state.onUpdate) {
            this.state.onUpdate({...this.getCrawlerData(this.state), "specificJson": this.convertSpecificJson(data)});
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dialog.js: Something went wrong.</h1>;
        }
        const t_value = this.state.selectedTab;
        return (
            <div>
                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.open}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="lg"
                        onClose={this.handleCancel.bind(this)} >
                    <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                    <div>
                        <div>
                            <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                                <Tab label="general" value="general" style={styles.tab} />
                                {this.state.crawlerType === "file" && <Tab label="file-crawler" value="file crawler" style={styles.tab} />}
                                {this.state.crawlerType === "web" && <Tab label="web-crawler" value="web crawler" style={styles.tab} />}
                                {this.state.crawlerType === "database" && <Tab label="database-crawler" value="database crawler" style={styles.tab} />}
                                {this.state.crawlerType === "office365" && <Tab label="office 365-crawler" value="office365 crawler" style={styles.tab} />}
                                {this.state.crawlerType === "dropbox" && <Tab label="dropbox-crawler" value="dropbox crawler" style={styles.tab} />}
                                {this.state.crawlerType === "wordpress" && <Tab label="wordpress-crawler" value="wordpress crawler" style={styles.tab} />}
                                {this.state.crawlerType === "gdrive" && <Tab label="gdrive-crawler" value="google drive crawler" style={styles.tab} />}
                                {this.state.crawlerType !== "wordpress" && <Tab label="schedule" value="schedule" style={styles.tab} />}
                            </Tabs>

                            <div style={styles.formContent}>
                                {t_value === 'general' &&
                                                            <CrawlerGeneral
                                                                sourceId={this.state.sourceId}
                                                                nodeId={this.state.nodeId}
                                                                organisation_id={this.state.organisation_id}
                                                                kb_id={this.state.kb_id}
                                                                name={this.state.name}
                                                                filesPerSecond={this.state.filesPerSecond}
                                                                crawlerType={this.state.crawlerType}
                                                                deleteFiles={this.state.deleteFiles}
                                                                allowAnonymous={this.state.allowAnonymous}
                                                                enablePreview={this.state.enablePreview}
                                                                processingLevel={this.state.processingLevel}
                                                                maxItems={this.state.maxItems}
                                                                maxBotItems={this.state.maxBotItems}
                                                                error_title={this.state.crawler_error_title}
                                                                schedule={this.state.schedule}
                                                                error_msg={this.state.crawler_error_msg}
                                                                onError={(title, errStr) => this.setError(title, errStr)}
                                                                onSave={(crawler) => this.update_general_data(crawler)}/>
                                }
                                {t_value === 'file crawler' &&
                                                            <CrawlerFile
                                                                file_username={this.state.file_username}
                                                                file_password={this.state.file_password}
                                                                file_server={this.state.file_server}
                                                                file_domain={this.state.file_domain}
                                                                file_share_name={this.state.file_share_name}
                                                                file_share_path={this.state.file_share_path}
                                                                onError={(title, errStr) => this.setError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                                            }
                                {t_value === 'web crawler' &&
                                                            <CrawlerWeb
                                                                web_base_url={this.state.web_base_url}
                                                                web_css={this.state.web_css}
                                                                web_css_ignore={this.state.web_css_ignore}
                                                                web_extension_filter={this.state.web_extension_filter}
                                                                web_extension_filter_ignore={this.state.web_extension_filter_ignore}
                                                                web_article_filter_incl_csv={this.state.web_article_filter_incl_csv}
                                                                web_article_filter_excl_csv={this.state.web_article_filter_excl_csv}
                                                                onError={(title, errStr) => this.setError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'database crawler' &&
                                                            <CrawlerDatabase
                                                                db_username={this.state.db_username}
                                                                db_password={this.state.db_password}
                                                                db_jdbc={this.state.db_jdbc}
                                                                db_type={this.state.db_type}
                                                                db_query={this.state.db_query}
                                                                db_pk={this.state.db_pk}
                                                                db_title={this.state.db_title}
                                                                db_author={this.state.db_author}
                                                                db_created={this.state.db_created}
                                                                db_last_modified={this.state.db_last_modified}
                                                                db_template={this.state.db_template}
                                                                onError={(title, errStr) => this.setError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'office365 crawler' &&
                                                            <CrawlerOffice365
                                                                tenantId={this.state.tenantId}
                                                                clientId={this.state.clientId}
                                                                clientSecret={this.state.clientSecret}
                                                                redirectUrl={this.state.redirectUrl}
                                                                crawlOneDrive={this.state.crawlOneDrive}
                                                                crawlAllOfOneDrive={this.state.crawlAllOfOneDrive}
                                                                oneDriveUsersToCrawl={this.state.oneDriveUsersToCrawl}
                                                                crawlSharePoint={this.state.crawlSharePoint}
                                                                crawlRootSite={this.state.crawlRootSite}
                                                                sharePointSitesToCrawl={this.state.sharePointSitesToCrawl}
                                                                crawlExchange={this.state.crawlExchange}
                                                                crawlAllOfExchange={this.state.crawlAllOfExchange}
                                                                exchangeUsersToCrawl={this.state.exchangeUsersToCrawl}
                                                                onError={(title, errStr) => this.setError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'dropbox crawler' &&
                                    <CrawlerDropbox
                                        clientToken={this.state.clientToken}
                                        folderList={this.state.folderList}
                                        userList={this.state.userList}
                                        availableUserList={this.props.user_list}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'google drive crawler' &&
                                    <CrawlerGDrive
                                        gdrive_projectId={this.state.gdrive_projectId}
                                        gdrive_clientId={this.state.gdrive_clientId}
                                        gdrive_clientSecret={this.state.gdrive_clientSecret}
                                        gdrive_clientName={this.state.gdrive_clientName}
                                        gdrive_clientPort={this.state.gdrive_clientPort}
                                        gdrive_userList={this.state.gdrive_userList}
                                        availableUserList={this.props.user_list}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'wordpress crawler' &&
                                    <CrawlerWordpress
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'schedule' && this.state.crawlerType !== "wordpress" &&
                                                            <div style={styles.timeTabContent}>
                                                                <TimeSelect time={this.state.schedule}
                                                                            onSave={(time) => this.updateSchedule(time)}/>
                                                            </div>
                                }
                            </div>


                            </div>
                    </div>
                    <DialogActions>
                        <Button onClick={this.handleCancel.bind(this)}>cancel</Button>
                        <Button onClick={this.handleSave.bind(this)}>save</Button>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}

export default CrawlerDialog;
