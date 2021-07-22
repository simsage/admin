import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TimeSelect from '../common/time-select'

import CrawlerGeneral from './crawler-general'
import CrawlerFile from './crawler-file'
import CrawlerWeb from "./crawler-web";
import CrawlerDatabase from "./crawler-database";
import CrawlerMetadataMapper from "./crawler-metadata-mapper";
import CrawlerOffice365 from "./crawler-office365";
import CrawlerDropbox from "./crawler-dropbox";
import CrawlerWordpress from "./crawler-wordpress";
import CrawlerGDrive from "./crawler-gdrive";
import CrawlerNFS from "./crawler-nfs";
import CrawlerRestFull from "./crawler-restfull";
import CrawlerMetadata from "./crawler-metadata";
import Api from "../common/api";


const styles = {
    formContent: {
        overflowY: 'scroll',
        height: '550px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    tab_dark: {
        backgroundColor: '#808080',
        color: '#f8f8f8',
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
            crawler: props.crawler,

            has_error: false,
        }
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps !== null) {
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

                crawler: nextProps.crawler,
            });
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
    }
    // validate metadata
    isValidMetadata(list, is_db) {
        //  "key": "none", "display": null, "field1": "", "field2": "", "db1": "", "db2":"", "sort": ""
        const metadata_name_map = {};
        let sort_counter = 0;
        let empty_sort_field_counter = 0;
        let default_sort_counter = 0;
        if (!Api.defined(list)) {
            list = [];
        }
        for (const item of list) {
            const name = item.field1;
            if (!name || name.length ===0) {
                this.setError("invalid metadata field", "metadata field missing metadata-field-name");
                return false;
            }
            const db_name = item.db1;
            if (is_db && (!db_name || db_name.length ===0)) {
                this.setError("invalid database field", "database field missing for database-field-name \"" + name + "\"");
                return false;
            }
            if (item.key === "two level category") {
                const db_name2 = item.db2;
                if (!db_name2 || db_name2.length ===0) {
                    this.setError("invalid database field", "database field missing for database-field-name \"" + name + "\"");
                    return false;
                }
            }
            const display = item.display;
            if (display !== null && display.length ===0) {
                this.setError("invalid display-name", "database field missing display-name \"" + name + "\"");
                return false;
            }
            if (!metadata_name_map[name]) {
                metadata_name_map[name] = 1;
            } else {
                metadata_name_map[name] += 1;
            }
            // sorting checks
            if (item.sort === "true") {
                sort_counter += 1;
                if (item.sort_asc.trim().length === 0) empty_sort_field_counter += 1;
                if (item.sort_desc.trim().length === 0) empty_sort_field_counter += 1;
                if (item.sort_default.trim() !== "") default_sort_counter += 1;
            }
        }
        for (const key in metadata_name_map) {
            if (metadata_name_map.hasOwnProperty(key)) {
                const counter = metadata_name_map[key];
                if (counter > 1) {
                    this.setError("invalid metadata", "metadata name \"" + key + "\" is used more than once.");
                    return false;
                }
            }
        }
        if (sort_counter > 0) { // has sort
            if (empty_sort_field_counter > 0) {
                this.setError("invalid metadata", "sort-by fields cannot be empty");
                return false;
            }
            if (default_sort_counter !== 1) {
                this.setError("invalid metadata", "you must specify the default UI sort field");
                return false;
            }
        }
        return true;
    }
    validFQDN(fqdn) {
        if (fqdn && fqdn.length > 0) {
            // valid characters ., a..z A..Z 0..9
            for (let i = 0; i < fqdn.length; i++) {
                const ch = fqdn.charAt(i);
                if (ch !== '.' && !((ch >='a' && ch<='z') || (ch >='A' && ch<='Z') || (ch >='0' && ch<='9'))) {
                    return false;
                }
            }
            // must have at least one . in it and it can't be the first or last item in the string
            return fqdn.indexOf('.') > 0 && (fqdn.indexOf('.') + 1 < fqdn.length);
        }
        return false;
    }
    handleSave() {
        const crawler = this.state.crawler;
        let sj = {};
        if (crawler && crawler.specificJson && (typeof crawler.specificJson === "string" || crawler.specificJson instanceof String)) {
            sj = JSON.parse(crawler.specificJson);
        }

        if (crawler.qaMatchStrength < 0.0 || crawler.qaMatchStrength > 1.0) {

            this.setError('invalid parameters', 'Q&A threshold must be between 0.0 and 1.0.');

        } else  if (crawler.name.length === 0) {

            this.setError('invalid parameters', 'you must supply a crawler name.');

        } else if (crawler.crawlerType === 'none') {

            this.setError('invalid parameters', 'you must select a crawler-type.');

        } else if (!sj) {

            this.setError('invalid parameters', 'crawler specific data not set');

        } else if (crawler.crawlerType === 'file' && (
            (!sj.username || sj.username.length === 0) ||
            (!sj.server || sj.server.length === 0) ||
            !this.validFQDN(sj.fqdn) ||
            (!sj.shareName || sj.shareName.length === 0))) {

            this.setError('invalid parameters', 'you must supply crawler-type, name, username, server and share path as a minimum.');

        } else if (crawler.crawlerType === 'web' && (
            !sj.baseUrlList || sj.baseUrlList.length === 0 ||
                (!sj.baseUrlList || (!sj.baseUrlList.startsWith("http://") && !sj.baseUrlList.startsWith("https://"))) )) {

            this.setError('invalid parameters', 'you must supply a base url of type http:// or https://');

        } else if (crawler.crawlerType === 'database' && (
                    !sj.jdbc || sj.jdbc.length === 0 ||
                    !sj.type || sj.type.length === 0 || !sj.type || sj.type === 'none' ||
                    !sj.query || sj.query.length === 0 || !sj.pk || sj.pk.length === 0 ||
                    !sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) {

            this.setError('invalid parameters', 'you must supply a jdbc connection string, database-type, a query, a primary-key, a text-template, and a SQL-template as a minimum.');

        } else if (crawler.crawlerType === 'restfull' && (
            !sj.url || sj.url.length === 0 ||
            !sj.pk || sj.pk.length === 0 ||
            (crawler.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) ||
            (!crawler.customRender && (!sj.content_url || sj.content_url.length ===0)))
        ) {
            if (crawler.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0))
                this.setError('invalid parameters', 'you must supply a primary-key, a url, a text-template, and an HTML-template as a minimum.');
            else
                this.setError('invalid parameters', 'you must supply a primary-key, a url, and a content-url as a minimum.');

        } else if (crawler.crawlerType === 'database' && sj.metadata_list && sj.metadata_list.length > 0 &&
                    !this.isValidMetadata(sj.metadata_list, true)) {

            // isValidDBMetadata will set the error

        } else if (crawler.crawlerType === 'office365' && (
                    !sj.tenantId || sj.tenantId.length === 0 ||
                    !sj.clientId || sj.clientId.length === 0 ||
                    !sj.redirectUrl || sj.redirectUrl.length === 0 ||
                    !sj.clientSecret || sj.clientSecret.length === 0)) {

            this.setError('invalid parameters', 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.');

        } else if (crawler.crawlerType === 'dropbox' && (!sj.clientToken || sj.clientToken.length === 0)) {

            this.setError('invalid parameters', 'you must supply a client-token, and select a user as a minimum.');

        } else if (crawler.crawlerType === 'gdrive' && (!sj.gdrive_clientId || sj.gdrive_clientId.length === 0 ||
                    !sj.gdrive_projectId || sj.gdrive_projectId.length === 0 ||
                    !sj.gdrive_clientSecret || sj.gdrive_clientSecret.length === 0 ||
                    !sj.gdrive_clientName || sj.gdrive_clientName.length === 0 || !sj.gdrive_clientPort || sj.gdrive_clientPort.length ===0)) {

            this.setError('invalid parameters', 'you must supply values for all fields, and select one user as a minimum.');

        } else if (crawler.crawlerType === 'nfs' && (sj.nfs_local_folder.length === 0 || sj.nfs_userList.length === 0)) {

            this.setError('invalid parameters', 'nfs: you must supply values for all fields, and select one user as a minimum.');

        } else if (crawler.crawlerType !== 'web' && crawler.crawlerType !== 'file' && crawler.crawlerType !== 'database' &&
                   crawler.crawlerType !== 'office365' && crawler.crawlerType !== 'dropbox' && crawler.crawlerType !== 'nfs' &&
                   crawler.crawlerType !== 'wordpress' && crawler.crawlerType !== 'gdrive' && crawler.crawlerType !== 'restfull') {

            this.setError('invalid parameters', 'you must select a crawler-type first.');

        } else if (isNaN(crawler.filesPerSecond)) {

            this.setError("invalid parameters", "files-per-second must be a number");

        } else if (!this.isValidMetadata(sj.metadata_list, false)) {
            // takes care of itself

        } else {
            // save setup?
            if (this.state.onSave) {
                this.state.onSave(crawler);
                // and reset the tabs to the first tab
                this.setState({selectedTab: 'general'});
            }
        }
    };
    updateSchedule(time) {
        if (time !== null) {
            const crawler = this.state.crawler;
            crawler.schedule = time;
            this.setState({crawler: crawler});
            if (this.state.onUpdate) {
                this.state.onUpdate(crawler);
            }
        }
    }
    update_general_data(data) {
        data.specificJson = this.state.crawler.specificJson;
        data.schedule = this.state.crawler.schedule;
        this.setState({crawler: data});
        if (this.state.onUpdate) {
            this.state.onUpdate(data);
        }
    }
    update_specific_json(specific_json) {
        const crawler = this.state.crawler;
        crawler.specificJson = JSON.stringify(specific_json);
        this.setState({crawler: crawler});
        if (this.state.onUpdate) {
            this.state.onUpdate(crawler);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dialog.js: Something went wrong.</h1>;
        }
        const theme = this.props.theme;
        const t_value = this.state.selectedTab;
        const crawler = this.state.crawler;
        const c_type = crawler.crawlerType;
        const sj = JSON.parse(crawler.specificJson ? crawler.specificJson : "{}");
        const tabStyle = (theme === 'light' ? styles.tab : styles.tab_dark);
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
                    <DialogTitle id="alert-dialog-title" className={this.props.theme}>{this.state.title}</DialogTitle>
                    <div className={this.props.theme}>
                        <div>
                            <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                                <Tab label="general" value="general" style={tabStyle} />
                                {c_type === "file" && <Tab label="file-crawler" value="file crawler" style={tabStyle} />}
                                {c_type === "web" && <Tab label="web-crawler" value="web crawler" style={tabStyle} />}
                                {c_type === "database" && <Tab label="database-crawler" value="database crawler" style={tabStyle} />}
                                {c_type === "restfull" && <Tab label="restful-crawler" value="RESTful crawler" style={tabStyle} />}
                                {c_type !== "wordpress" && <Tab label="metadata" value="metadata" style={tabStyle} />}
                                {c_type === "office365" && <Tab label="office 365-crawler" value="office365 crawler" style={tabStyle} />}
                                {c_type === "dropbox" && <Tab label="dropbox-crawler" value="dropbox crawler" style={tabStyle} />}
                                {c_type === "wordpress" && <Tab label="wordpress-crawler" value="wordpress crawler" style={tabStyle} />}
                                {c_type === "gdrive" && <Tab label="gdrive-crawler" value="google drive crawler" style={tabStyle} />}
                                {c_type === "nfs" && <Tab label="nfs-crawler" value="nfs crawler" style={tabStyle} />}
                                {c_type !== "wordpress" && <Tab label="schedule" value="schedule" style={tabStyle} />}
                            </Tabs>

                            <div style={styles.formContent}>
                                {t_value === 'general' &&
                                    <CrawlerGeneral
                                        theme={theme}
                                        sourceId={crawler.sourceId}
                                        nodeId={crawler.nodeId}
                                        organisation_id={crawler.organisationId}
                                        kb_id={crawler.kbId}
                                        name={crawler.name}
                                        filesPerSecond={crawler.filesPerSecond}
                                        crawlerType={c_type}
                                        deleteFiles={crawler.deleteFiles}
                                        allowAnonymous={crawler.allowAnonymous}
                                        enablePreview={crawler.enablePreview}
                                        processingLevel={crawler.processingLevel}
                                        maxItems={crawler.maxItems}
                                        maxBotItems={crawler.maxBotItems}
                                        schedule={crawler.schedule}
                                        customRender={crawler.customRender}
                                        edgeDeviceId={crawler.edgeDeviceId}
                                        qaMatchStrength={crawler.qaMatchStrength}
                                        numResults={crawler.numResults}
                                        numFragments={crawler.numFragments}
                                        edge_device_list={this.props.edge_device_list}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(crawler) => this.update_general_data(crawler)}/>
                                }
                                {t_value === 'file crawler' &&
                                    <CrawlerFile
                                        theme={theme}
                                        username={sj.username}
                                        password={sj.password}
                                        server={sj.server}
                                        domain={sj.domain}
                                        fqdn={sj.fqdn}
                                        shareName={sj.shareName}
                                        sharePath={sj.sharePath}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                                            }
                                {t_value === 'web crawler' &&
                                    <CrawlerWeb
                                        theme={theme}
                                        baseUrlList={sj.baseUrlList}
                                        webCss={sj.webCss}
                                        webCssIgnore={sj.webCssIgnore}
                                        validExtensions={sj.validExtensions}
                                        validExtensionsIgnore={sj.validExtensionsIgnore}
                                        articleIncludeWordsCsv={sj.articleIncludeWordsCsv}
                                        articleExcludeWordsCsv={sj.articleExcludeWordsCsv}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'database crawler' &&
                                    <CrawlerDatabase
                                        theme={theme}
                                        username={sj.username}
                                        password={sj.password}
                                        jdbc={sj.jdbc}
                                        type={sj.type}
                                        query={sj.query}
                                        pk={sj.pk}
                                        metadata_list={sj.metadata_list}
                                        template={sj.template}
                                        text={sj.text}
                                        content_url={sj.content_url}
                                        specific_json={sj}
                                        customRender={crawler.customRender}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'RESTful crawler' &&
                                    <CrawlerRestFull
                                        theme={theme}
                                        pk={sj.pk}
                                        url={sj.url}
                                        template={sj.template}
                                        text={sj.text}
                                        content_url={sj.content_url}
                                        specific_json={sj}
                                        customRender={crawler.customRender}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'metadata' && (c_type === "database" || c_type === "restfull") &&
                                    <CrawlerMetadataMapper
                                        theme={theme}
                                        specificJson={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'metadata' && c_type !== "restfull" && c_type !== "database" && c_type !== "wordpress" &&
                                    <CrawlerMetadata
                                        theme={theme}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'office365 crawler' &&
                                    <CrawlerOffice365
                                        theme={theme}
                                        tenantId={sj.tenantId}
                                        clientId={sj.clientId}
                                        clientSecret={sj.clientSecret}
                                        redirectUrl={sj.redirectUrl}
                                        crawlOneDrive={sj.crawlOneDrive}
                                        crawlAllOfOneDrive={sj.crawlAllOfOneDrive}
                                        oneDriveUsersToCrawl={sj.oneDriveUsersToCrawl}
                                        crawlSharePoint={sj.crawlSharePoint}
                                        crawlRootSite={sj.crawlRootSite}
                                        sharePointSitesToCrawl={sj.sharePointSitesToCrawl}
                                        crawlExchange={sj.crawlExchange}
                                        crawlAllOfExchange={sj.crawlAllOfExchange}
                                        exchangeUsersToCrawl={sj.exchangeUsersToCrawl}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'dropbox crawler' &&
                                    <CrawlerDropbox
                                        theme={theme}
                                        clientToken={sj.clientToken}
                                        folderList={sj.folderList}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'google drive crawler' &&
                                    <CrawlerGDrive
                                        theme={theme}
                                        gdrive_projectId={sj.gdrive_projectId}
                                        gdrive_clientId={sj.gdrive_clientId}
                                        gdrive_clientSecret={sj.gdrive_clientSecret}
                                        gdrive_clientName={sj.gdrive_clientName}
                                        gdrive_clientPort={sj.gdrive_clientPort}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'nfs crawler' &&
                                    <CrawlerNFS
                                        theme={theme}
                                        nfs_local_folder={sj.nfs_local_folder}
                                        nfs_userList={sj.nfs_userList}
                                        specific_json={sj}
                                        availableUserList={this.props.user_list}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'wordpress crawler' &&
                                    <CrawlerWordpress
                                        theme={theme}
                                        source_id={crawler.sourceId}
                                        organisation_id={this.props.organisation_id}
                                        kb_id={this.props.kb_id}
                                        specific_json={sj}
                                        wpUploadArchive={(data) => this.props.wpUploadArchive(data) }
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {t_value === 'schedule' && c_type !== "wordpress" &&
                                    <div style={styles.timeTabContent}>
                                        <TimeSelect time={crawler.schedule}
                                                    onSave={(time) => this.updateSchedule(time)}/>
                                    </div>
                                }
                            </div>


                            </div>
                    </div>
                    <DialogActions className={this.props.theme}>
                        <Button color={"primary"} onClick={() => this.handleCancel()}>cancel</Button>
                        <Button color={"secondary"} onClick={() => this.handleSave()}>save</Button>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}

export default CrawlerDialog;
