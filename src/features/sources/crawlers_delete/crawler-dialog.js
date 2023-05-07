import React, {Component, useEffect} from 'react';
import {connect} from "react-redux";

import '../../../css/acl-setup.css';
import '../../../css/crawler.css';

import TimeSelect from '../../../common/time-select'

import CrawlerGeneral from './crawler-general'
import CrawlerFile from './crawler-file'
import CrawlerWeb from "./crawler-web";
import CrawlerDatabase from "./crawler-database";
import CrawlerMetadataMapper from "./crawler-metadata-mapper";
import CrawlerExchange365 from "./crawler-exchange365";
import CrawlerOneDrive from "./crawler-onedrive";
import CrawlerDropbox from "./crawler-dropbox";
import CrawlerBox from "./crawler-box";
import CrawlerIManage from "./crawler-imanage";
import CrawlerWordpress from "./crawler-wordpress";
import CrawlerGDrive from "./crawler-gdrive";
import CrawlerNFS from "./crawler-nfs";
import CrawlerRestFull from "./crawler-restfull";
import CrawlerRss from "./crawler-rss";
import CrawlerMetadata from "./crawler-metadata";
import Api from "../../../common/api";
import AclSetup from "../../../common/acl-setup";
import CrawlerExternal from "./crawler-external";
import CrawlerSharepoint365 from "./crawler-sharepoint365";
import {closeForm} from "../sourceSlice";




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

    componentWillMount() {
        console.log("componentWillMount: crawler dialog organisation_id", this.state.organisation_id)
    }

    componentDidMount() {
        console.log("componentDidMount: crawler dialog crawler" , this.state.crawler)
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps !== null) {
            this.setState({
                selectedTab: (nextProps.open !== this.state.open) ? 'general' : this.state.selectedTab,

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
            console.log("handleSave step 5", nextProps.crawler)
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
        this.props.hideForm();
        // this.setState({open: false});
    }
    // validate metadata
    isValidMetadata(list, is_db) {
        console.log("isValidMetadata",list)
        //  "key": "none", "display": null, "metadata": "", "field2": "", "db1": "", "db2":"", "sort": ""
        const metadata_name_map = {};
        let sort_counter = 0;
        let empty_sort_field_counter = 0;
        let default_sort_counter = 0;
        if (!Api.defined(list)) {
            list = [];
        }
        for (const item of list) {
            const name = item.metadata;
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
                if (item.sortAscText.trim().length === 0) empty_sort_field_counter += 1;
                if (item.sortDescText.trim().length === 0) empty_sort_field_counter += 1;
                if (item.sortDefault.trim() !== "") default_sort_counter += 1;
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
    validDropBoxFolderList(folder_list) {
        for (const i of folder_list.split(",")) {
            const item = i.trim();
            if (item.length > 0) {
                if (!item.startsWith("/"))
                    return false;
                if (item.lastIndexOf("/") > 0)
                    return false;
            }
        }
        return true;
    }

    handleSave(){
        console.log("handle save new")

    }

    handleSave2() {
        const crawler = this.state.crawler;
        const validAcls = crawler.allowAnonymous || (crawler.acls && crawler.acls.length > 0);
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

        } else if (!validAcls) {

            this.setError('invalid parameters', 'This source does not have valid ACLs.\nThis source won\'t be usable.  Please add ACLs to this source.');

        } else if (crawler.crawlerType === 'file' && (
            (!sj.username || sj.username.length === 0) ||
            (!sj.server || sj.server.length === 0) ||
            !this.validFQDN(sj.fqdn) ||
            (!sj.shareName || sj.shareName.length === 0))) {

            this.setError('invalid parameters', 'file crawler: you must supply a name, username, server, valid FQDN and share path as a minimum.');

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

        } else if (crawler.crawlerType === 'exchange365' && (
            !sj.tenantId || sj.tenantId.length === 0 ||
            !sj.clientId || sj.clientId.length === 0 ||
            !sj.redirectUrl || sj.redirectUrl.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0)) {

            this.setError('invalid parameters', 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.');

        } else if (crawler.crawlerType === 'sharepoint365' && (
            !sj.tenantId || sj.tenantId.length === 0 ||
            !sj.clientId || sj.clientId.length === 0 ||
            !sj.redirectUrl || sj.redirectUrl.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0)) {

            this.setError('invalid parameters', 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.');

        } else if (crawler.crawlerType === 'onedrive' && (
                    !sj.tenantId || sj.tenantId.length === 0 ||
                    !sj.clientId || sj.clientId.length === 0 ||
                    !sj.redirectUrl || sj.redirectUrl.length === 0 ||
                    !sj.clientSecret || sj.clientSecret.length === 0)) {

            this.setError('invalid parameters', 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.');

        } else if (crawler.crawlerType === 'dropbox' && (!sj.clientToken || sj.clientToken.length === 0)) {

            this.setError('invalid parameters', 'dropbox crawler: you must supply a client-token, and select a user as a minimum.');

        } else if (crawler.crawlerType === 'dropbox' && !this.validDropBoxFolderList(sj.folderList)) {

            this.setError('invalid parameters', 'dropbox crawler: you have invalid values in your start folder.');

        } else if (crawler.crawlerType === 'box' && !this.validDropBoxFolderList(sj.folderList)) {

            this.setError('invalid parameters', 'box crawler: you have invalid values in your start folder.');

        } else if (crawler.crawlerType === 'imanage' && !this.validDropBoxFolderList(sj.folderList)) {

            this.setError('invalid parameters', 'iManage crawler: you have invalid values in your start folder.');

        } else if (crawler.crawlerType === 'box' && (!sj.clientId || sj.clientId.length === 0 ||
                    !sj.clientSecret || sj.clientSecret.length === 0 || !sj.enterpriseId || sj.enterpriseId.length === 0 ||
                     sj.timeToCheckFrom.length === 0)) {

            this.setError('invalid parameters', 'box crawler: you have invalid values for clientId / clientSecret / enterpriseId / time-to-check-from.');

        } else if (crawler.crawlerType === 'imanage' && (!sj.clientId || sj.clientId.length === 0 ||
                   !sj.clientSecret || sj.clientSecret.length === 0 || !sj.libraryId || sj.libraryId.length === 0 ||
                   !sj.server || sj.server.length === 0 || !sj.username || sj.username.length === 0 ||
                   !sj.cursor || sj.cursor.length === 0)) {

            this.setError('invalid parameters', 'iManage crawler: you have invalid values for server / username / clientId / clientSecret / libraryId / cursor.');

        } else if (crawler.crawlerType === 'gdrive' && (!sj.gdrive_clientId || sj.gdrive_clientId.length === 0 ||
                    !sj.gdrive_projectId || sj.gdrive_projectId.length === 0 ||
                    !sj.gdrive_clientSecret || sj.gdrive_clientSecret.length === 0 ||
                    !sj.gdrive_clientName || sj.gdrive_clientName.length === 0 || !sj.gdrive_clientPort || sj.gdrive_clientPort.length ===0)) {

            this.setError('invalid parameters', 'you must supply values for all fields, and select one user as a minimum.');

        } else if (crawler.crawlerType === 'nfs' && (sj.nfs_local_folder.length === 0)) {

            this.setError('invalid parameters', 'nfs: you must set a local folder.');

        } else if (crawler.crawlerType === 'rss' && (sj.endpoint.length < 5)) {

            this.setError('invalid parameters', 'RSS: you must supply a value for endpoint.');

        } else if (crawler.crawlerType !== 'web' && crawler.crawlerType !== 'file' && crawler.crawlerType !== 'database' &&
                   crawler.crawlerType !== 'exchange365' && crawler.crawlerType !== 'dropbox' &&
                   crawler.crawlerType !== 'nfs' && crawler.crawlerType !== 'wordpress' && crawler.crawlerType !== 'gdrive' &&
                   crawler.crawlerType !== 'onedrive' && crawler.crawlerType !== 'sharepoint365' &&
                   crawler.crawlerType !== 'restfull' && crawler.crawlerType !== 'rss' && crawler.crawlerType !== 'external' &&
                   crawler.crawlerType !== 'box' && crawler.crawlerType !== 'imanage') {

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
            let crawler = this.state.crawler;
            crawler.schedule = time;
            this.setState({crawler: crawler});
            if (this.state.onUpdate) {
                this.state.onUpdate(crawler);
            }
        }
    }
    update_general_data(data) {
        let crawler = this.state.crawler;
        data.specificJson = crawler.specificJson;
        data.schedule = crawler.schedule;
        data.acls = crawler.acls;
        this.setState({crawler: data});
        if (this.state.onUpdate) {
            this.state.onUpdate(data);
        }
    }
    update_acl_list(acl_list) {
        let crawler = this.state.crawler;
        crawler.acls = acl_list;
        this.setState({crawler: crawler});
        if (this.state.onUpdate) {
            this.state.onUpdate(crawler);
        }
    }
    update_specific_json(specific_json) {
        let crawler = this.state.crawler;
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

        console.log()
        if (!this.state.open) {
            return (<div />)
        }
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded crawler-page">

                        <div className="modal-header">{this.state.title}</div>
                        <div className={"modal-body " + this.props.theme}>
                            <div>
                                <ul className="nav nav-tabs">
                                    <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'general' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'general'})}>general</div>
                                    </li>
                                    {c_type === "file" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'file crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'file crawler'})}>file crawler</div>
                                    </li>}
                                    {c_type === "web" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'web crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'web crawler'})}>web crawler</div>
                                    </li>}
                                    {c_type === "database" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'database crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'database crawler'})}>database crawler</div>
                                    </li>}
                                    {c_type === "restfull" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'RESTful crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'RESTful crawler'})}>RESTful crawler</div>
                                    </li>}
                                    {c_type === "exchange365" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'exchange365 crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'exchange365 crawler'})}>exchange 365 crawler</div>
                                    </li>}
                                    {c_type === "onedrive" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'onedrive crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'onedrive crawler'})}>one-drive crawler</div>
                                    </li>}
                                    {c_type === "sharepoint365" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'sharepoint365 crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'sharepoint365 crawler'})}>sharepoint 365 crawler</div>
                                    </li>}
                                    {c_type === "dropbox" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'dropbox crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'dropbox crawler'})}>dropbox crawler</div>
                                    </li>}
                                    {c_type === "box" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'box crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'box crawler'})}>box crawler</div>
                                    </li>}
                                    {c_type === "imanage" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'iManage crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'iManage crawler'})}>iManage crawler</div>
                                    </li>}
                                    {c_type === "gdrive" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'google drive crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'google drive crawler'})}>google drive crawler</div>
                                    </li>}
                                    {c_type === "wordpress" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'wordpress crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'wordpress crawler'})}>wordpress crawler</div>
                                    </li>}
                                    {c_type === "nfs" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'nfs crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'nfs crawler'})}>nfs crawler</div>
                                    </li>}
                                    {c_type === "rss" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'rss crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'rss crawler'})}>rss crawler</div>
                                    </li>}
                                    {c_type === "external" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'external crawler' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'external crawler'})}>external crawler</div>
                                    </li>}

                                    {c_type !== "wordpress" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'metadata' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'metadata'})}>metadata</div>
                                    </li>}
                                    <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'acls' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'acls'})}>ACLs</div>
                                    </li>
                                    {c_type !== "wordpress" && <li className="nav-item nav-cursor">
                                        <div className={"nav-link " + (this.state.selectedTab === 'schedule' ? 'active' : '')}
                                             onClick={() => this.setState({selectedTab: 'schedule'})}>schedule</div>
                                    </li>}
                                </ul>

                                <div className="form-content">
                                    {console.log("handleSave step 4 general", crawler)}
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
                                            maxQNAItems={crawler.maxQNAItems}
                                            schedule={crawler.schedule}
                                            customRender={crawler.customRender}
                                            edgeDeviceId={crawler.edgeDeviceId}
                                            qaMatchStrength={crawler.qaMatchStrength}
                                            numResults={crawler.numResults}
                                            numFragments={crawler.numFragments}
                                            numErrors={crawler.numErrors}
                                            errorThreshold={crawler.errorThreshold}
                                            startTime={crawler.startTime}
                                            endTime={crawler.endTime}
                                            edge_device_list={this.props.edge_device_list}
                                            testCrawler={this.props.testCrawler}
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

                                    {t_value === 'exchange365 crawler' &&
                                    <CrawlerExchange365
                                        theme={theme}
                                        tenantId={sj.tenantId}
                                        clientId={sj.clientId}
                                        clientSecret={sj.clientSecret}
                                        redirectUrl={sj.redirectUrl}
                                        crawlAllOfExchange={sj.crawlAllOfExchange}
                                        exchangeUsersToCrawl={sj.exchangeUsersToCrawl}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                    }
                                    {t_value === 'sharepoint365 crawler' &&
                                    <CrawlerSharepoint365
                                        theme={theme}
                                        tenantId={sj.tenantId}
                                        clientId={sj.clientId}
                                        clientSecret={sj.clientSecret}
                                        redirectUrl={sj.redirectUrl}
                                        crawlRootSite={sj.crawlRootSite}
                                        sharePointSitesToCrawl={sj.sharePointSitesToCrawl}
                                        specific_json={sj}
                                        onError={(title, errStr) => this.setError(title, errStr)}
                                        onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                    }
                                    {t_value === 'onedrive crawler' &&
                                    <CrawlerOneDrive
                                        theme={theme}
                                        tenantId={sj.tenantId}
                                        clientId={sj.clientId}
                                        clientSecret={sj.clientSecret}
                                        redirectUrl={sj.redirectUrl}
                                        crawlAllOfOneDrive={sj.crawlAllOfOneDrive}
                                        oneDriveUsersToCrawl={sj.oneDriveUsersToCrawl}
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
                                    {t_value === 'box crawler' &&
                                        <CrawlerBox
                                            theme={theme}
                                            clientId={sj.clientId}
                                            clientSecret={sj.clientSecret}
                                            enterpriseId={sj.enterpriseId}
                                            folderList={sj.folderList}
                                            timeToCheckFrom={sj.timeToCheckFrom}
                                            specific_json={sj}
                                            onError={(title, errStr) => this.setError(title, errStr)}
                                            onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                    }
                                    {t_value === 'iManage crawler' &&
                                        <CrawlerIManage
                                            theme={theme}
                                            username={sj.username}
                                            password={sj.password}
                                            server={sj.server}
                                            clientId={sj.clientId}
                                            clientSecret={sj.clientSecret}
                                            libraryId={sj.libraryId}
                                            folderList={sj.folderList}
                                            cursor={sj.cursor}
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
                                            session={this.props.session}
                                            wpUploadArchive={(data) => this.props.wpUploadArchive(data) }
                                            onError={(title, errStr) => this.setError(title, errStr)}
                                            onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                    }
                                    {t_value === 'rss crawler' &&
                                        <CrawlerRss
                                            theme={theme}
                                            source_id={crawler.sourceId}
                                            organisation_id={this.props.organisation_id}
                                            kb_id={this.props.kb_id}
                                            endpoint={sj.endpoint}
                                            initial_feed={sj.initial_feed}
                                            specific_json={sj}
                                            onError={(title, errStr) => this.setError(title, errStr)}
                                            onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                    }
                                    {t_value === 'external crawler' &&
                                    <CrawlerExternal
                                        theme={theme}
                                        source_id={crawler.sourceId}
                                        organisation_id={this.props.organisation_id}
                                        kb_id={this.props.kb_id}
                                        specific_json={sj}
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
                                    {t_value === 'acls' &&
                                        <div>
                                            <div className="acl-text">this list sets a default set of Access Control for this source</div>
                                            <AclSetup
                                                organisation_id={this.props.organisation_id}
                                                acl_list={crawler.acls}
                                                onChange={(acl_list) => this.update_acl_list(acl_list)}
                                                user_list={this.props.user_list}
                                                group_list={this.props.group_list} />
                                        </div>
                                    }
                                    {t_value === 'schedule' && c_type !== "wordpress" &&
                                        <div className="time-tab-content">
                                            <TimeSelect time={crawler.schedule}
                                                        onSave={(time) => this.updateSchedule(time)}/>
                                        </div>
                                    }
                                </div>


                                </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>save</button>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        // open: state.sourceReducer.show_form,
        open: false,
        source_id: state.sourceReducer.edit_id,
        crawler: state.sourceReducer.selected_source
    }
}

const mapDispatchToProps = dispatch => {
    console.log("mapDispatchToProps")
    return {
        hideForm: () => dispatch(closeForm())
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(CrawlerDialog);
// export default CrawlerDialog;
