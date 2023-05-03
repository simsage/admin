import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {closeForm, updateSources} from "./sourceSlice";
import SourceTabs from "./SourceTabs";
import React, {useEffect, useState} from "react";
import GeneralForm from "./forms/GeneralForm";
import CrawlerMetadataForm from "./forms/CrawlerMetadataForm";
import AclSetup from "../../common/acl-setup";
import {getGroupList} from "../groups/groupSlice";
import {getUserListPaginated} from "../users/usersSlice";
import TimeSelect from "../../common/time-select";
import CrawlerRssForm from "./forms/CrawlerRssForm";
import CrawlerBoxForm from "./forms/CrawlerBoxForm";
import CrawlerDatabaseForm from "./forms/CrawlerDatabaseForm";
import CrawlerDropboxForm from "./forms/CrawlerDropboxForm";
import CrawlerExchange365Form from "./forms/CrawlerExchange365Form";
import CrawlerExternalForm from "./forms/CrawlerExternalForm";
import CrawlerFileForm from "./forms/CrawlerFileForm";
import CrawlerGDriveForm from "./forms/CrawlerGDriveForm";
import CrawlerIManageForm from "./forms/CrawlerIManageForm";
import CrawlerNfsForm from "./forms/CrawlerNfsForm";
import CrawlerOnedriveForm from "./forms/CrawlerOnedriveForm";
import CrawlerRestfulForm from "./forms/CrawlerRestfulForm";
import CrawlerSharepoint365Form from "./forms/CrawlerSharepoint365Form";
import CrawlerWebForm from "./forms/CrawlerWebForm";
import CrawlerWordPressForm from "./forms/CrawlerWordPressForm";
import CrawlerMetaMapperForm from "./forms/CrawlerMetaMapperForm";
import {showErrorAlert} from "../alerts/alertSlice";
import Api from "../../common/api";
import CrawlerConfluenceForm from "./forms/CrawlerConfluenceForm";
import CrawlerDiscourseForm2 from "./forms/CrawlerDiscourseForm2";
import CrawlerSearchForm2 from "./forms/CrawlerSearchForm2";
import CrawlerServiceNow from "./forms/CrawlerServiceNow";
import ProcessorSetup from "../../common/processor-setup";


export default function SourceForm() {

    let new_default_source_data = {
        "filesPerSecond": 0.5,
        "organisationId": "",
        "crawlerType": "none",
        "deleteFiles": false,
        "allowAnonymous": true,
        "enablePreview": true,
        "processingLevel": "INDEX",
        "name": "",
        "sourceId": '0',
        "nodeId": 0,
        "maxItems": 0,
        "maxQNAItems": "0",
        "customRender": false,
        "edgeDeviceId": "",
        "qaMatchStrength": 0.8125,
        "numResults": 5,
        "numFragments": 3,
        "errorThreshold": 10,
        "useDefaultRelationships": true,
        "autoOptimize": false,
        "specificJson": "",
        "schedule": "mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23",
        "acls": [],
        "kbId": "",
        "internalCrawler": "",

        "storeBinary":"",
        "versioned":"",
        writeToCassandra:"",
        enableDocumentSimilarity:"",
        documentSimilarityThreshold:"",
        isExternal:"",

        "processorConfig": "",

        //todo::need check these fields with Rock
        //are these for crawler stats?
        "maxBotItems": 0,
        "numErrors": 0,
        "startTime": 0,
        "endTime": 0,
        "isCrawling": false,
        "numCrawledDocuments": 0,
        "numConvertedDocuments": 0,
        "numParsedDocuments": 0,
        "numIndexedDocuments": 0,
        "numFinishedDocuments": 0,
        "numTotalDocuments": 0,
        "isBusy": false
    }


    const dispatch = useDispatch();
    // const theme = '';
    // marker for an external node
    // const external_node_id = 1000000;


    // a few defaults
    const default_error_threshold = 10;
    const default_num_results = 5;
    const default_num_fragments = 3;
    const default_qna_threshold = 0.8125;

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const show_form = useSelector((state) => state.sourceReducer.show_data_form);

    useEffect(() => {
        const page = 0;
        const page_size = 100;
        dispatch(getGroupList({session_id: session_id, organization_id: selected_organisation_id}))
        // session_id,organization_id,page,page_size,filter
        dispatch(getUserListPaginated({session_id:session.id, organization_id:selected_organisation_id,page:page,page_size:page_size,filter:null}))
        dispatch(getUserListPaginated({session_id: session_id, organization_id: selected_organisation_id, filter: null}))
    }, [show_form]);


    const user_list = useSelector((state) => state.usersReducer.user_list);
    const group_list = useSelector((state) => state.groupReducer.group_list);
    console.log("user_list",user_list)
    console.log("group_list",group_list)

    /**
     Set Form Data
     */
        // load the selected source
    let selected_source = useSelector((state) => state.sourceReducer.selected_source);
    // if selected_source === '' then show add form otherwise show edit form
    const title = selected_source ? "Edit Source: " + selected_source.name : "Add Source";
    //if selected_source is null then this is a new source
    if (!selected_source) {
        //if selected_source === '' then set selected_source = new_default_source_data
        selected_source = {
            ...new_default_source_data,
            organisationId: selected_organisation_id,
            kbId: selected_knowledge_base_id
        }
    }

    console.log("processorConfig", selected_source)
    //set the selected source as the form_data
    const [form_data, setFormData] = useState(selected_source);


    /**
     Menu/Tabs for the Form
     */
    const source_tabs = [
        {label: "general", slug: "general", type: "core"},

        //crawlers
        {label: "box crawler", slug: "box", type: "optional"},
        {label: "confluence crawler", slug: "confluence", type: "optional"},
        {label: "database crawler", slug: "database", type: "optional"},

        {label: "dropbox crawler", slug: "dropbox", type: "optional"},
        {label: "discourse crawler", slug: "discourse", type: "optional"},

        {label: "exchange365 crawler", slug: "exchange365", type: "optional"},
        // {label: "external crawler", slug: "external", type: "optional"},

        {label: "file (SMB) crawler", slug: "file", type: "optional"},
        {label: "google-drive crawler", slug: "gdrive", type: "optional"},
        {label: "iManage crawler", slug: "imanage", type: "optional"},

        {label: "nfs crawler", slug: "nfs", type: "optional"},
        {label: "one-drive crawler", slug: "onedrive", type: "optional"},

        {label: "rest-full crawler", slug: "restfull", type: "optional"},
        {label: "rss crawler", slug: "rss", type: "optional"},

        {label: "sharepoint 365 crawler", slug: "sharepoint365", type: "optional"},
        {label: "service-now crawler", slug: "servicenow", type: "optional"},
        {label: "web crawler", slug: "web", type: "optional"},
        {label: "wordpress crawler", slug: "wordpress", type: "optional"},

        {label: "search crawler", slug: "search", type: "optional"},
        //crawlers

        //metadata
        {label: "metadata", slug: "metadata", type: "meta"},

        //rest
        {label: "ACLs", slug: "acls", type: "core"},
        {label: "Processors", slug: "processors", type: "core"},
        {label: "schedule", slug: "schedule", type: "schedule"},

    ]
    const [selected_source_tab, setSelectedSourceTab] = useState('general')

    function changeNav(slug) {
        console.log("slug", slug)
        setSelectedSourceTab(slug);
    }


    /**
     Get React Form Hook
     */
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, dirtyFields},
        reset,
        // control,
        getValues
    } = useForm({mode: 'onChange'});

    const handleClose = () => {
        dispatch(closeForm());
    }

    // Set form defaultValues
    useEffect(() => {
        let defaultValues = {};

        defaultValues.name = selected_source ? selected_source.name : '';
        defaultValues.crawlerType = selected_source ? selected_source.crawlerType : 'none';
        defaultValues.processingLevel = selected_source ? selected_source.processingLevel : '';
        defaultValues.filesPerSecond = selected_source ? selected_source.filesPerSecond : 0;

        defaultValues.maxItems = selected_source ? selected_source.maxItems : 0;
        defaultValues.maxQNAItems = selected_source && !(selected_source.maxQNAItems === undefined || selected_source.maxQNAItems === '') ? selected_source.maxQNAItems : 0;

        defaultValues.nodeId = selected_source ? selected_source.nodeId : 0;
        defaultValues.customRender = selected_source ? selected_source.customRender : '';
        defaultValues.internalCrawler = selected_source ? selected_source.internalCrawler : '';
        defaultValues.deleteFiles = selected_source ? selected_source.deleteFiles : '';
        defaultValues.autoOptimize = selected_source ? selected_source.autoOptimize : '';

        defaultValues.allowAnonymous = selected_source ? selected_source.allowAnonymous : '';
        defaultValues.enablePreview = selected_source ? selected_source.enablePreview : '';
        defaultValues.useDefaultRelationships = selected_source ? selected_source.useDefaultRelationships : '';
        defaultValues.numFragments = selected_source ? selected_source.numFragments : default_num_fragments;

        defaultValues.qaMatchStrength = selected_source ? selected_source.qaMatchStrength : default_qna_threshold;
        defaultValues.errorThreshold = selected_source ? selected_source.errorThreshold : default_error_threshold;
        defaultValues.numResults = selected_source ? selected_source.numResults : default_num_results;
        defaultValues.edgeDeviceId = selected_source && selected_source.edgeDeviceId !== '' ? selected_source.edgeDeviceId : 'none';
        //
        defaultValues.sourceId = selected_source ? selected_source.sourceId : 0;

        defaultValues.storeBinary = "";
        defaultValues.versioned = "";
        defaultValues.writeToCassandra = "";
        defaultValues.enableDocumentSimilarity = "";
        defaultValues.documentSimilarityThreshold = "";
        defaultValues.isExternal = "";

        reset({...defaultValues});
    }, [show_form]);


    const [has_error, setError] = useState();
    useEffect(() => {
        console.log("has_error",has_error)
        if (has_error) dispatch(showErrorAlert(has_error))
    }, [has_error])


    function isValidMetadata(list, is_db) {
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
            if (!name || name.length === 0) {
                setError({title: 'invalid parameters', message: "metadata field missing metadata-field-name"});
                return false;
            }
            const db_name = item.db1;
            if (is_db && (!db_name || db_name.length === 0)) {
                setError({
                    title: 'invalid parameters',
                    message: "database field missing for database-field-name \"" + name + "\""
                });
                return false;
            }
            if (item.key === "two level category") {
                const db_name2 = item.db2;
                if (!db_name2 || db_name2.length === 0) {
                    setError({
                        title: 'invalid parameters',
                        message: "database field missing for database-field-name \"" + name + "\""
                    });
                    return false;
                }
            }
            const display = item.display;
            if (display !== null && display.length === 0) {
                setError({
                    title: 'invalid parameters',
                    message: "database field missing display-name \"" + name + "\""
                });
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
                    setError({
                        title: 'invalid parameters',
                        message: "metadata name \"" + key + "\" is used more than once."
                    });
                    return false;
                }
            }
        }
        if (sort_counter > 0) { // has sort
            if (empty_sort_field_counter > 0) {
                setError({title: 'invalid parameters', message: "sort-by fields cannot be empty"});
                return false;
            }
            if (default_sort_counter !== 1) {
                setError({title: 'invalid parameters', message: "you must specify the default UI sort field"});
                return false;
            }
        }
        return true;
    }

    function validFQDN(fqdn) {
        if (fqdn && fqdn.length > 0) {
            // valid characters ., a..z A..Z 0..9
            for (let i = 0; i < fqdn.length; i++) {
                const ch = fqdn.charAt(i);
                if (ch !== '.' && !((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9'))) {
                    return false;
                }
            }
            // must have at least one . in it and it can't be the first or last item in the string
            return fqdn.indexOf('.') > 0 && (fqdn.indexOf('.') + 1 < fqdn.length);
        }
        return false;
    }


    function validDropBoxFolderList(folder_list) {
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


    //on submit store or update
    // const onSubmit = data => {
    //
    //     let errors = undefined;
    //
    //     // for existing data form returns data.crawlerType as undefined because the form field is disabled
    //     // thus merge form_data.crawlerType to data
    //     if (data.crawlerType === undefined) {
    //         data = {...data, crawlerType: form_data.crawlerType}
    //     }
    //
    //
    //     // Properties in data will overwrite those in form_data.
    //     let new_data = {...form_data, ...data}
    //
    //
    //     const validAcls = new_data.allowAnonymous || (new_data.acls && new_data.acls.length > 0);
    //
    //     let sj = {};
    //     if (new_data && new_data.specificJson && (typeof new_data.specificJson === "string" || new_data.specificJson instanceof String)) {
    //         sj = JSON.parse(new_data.specificJson);
    //     }
    //
    //     if (new_data.qaMatchStrength < 0.0 || new_data.qaMatchStrength > 1.0) {
    //         setError({title: 'invalid parameters', message: 'Q&A threshold must be between 0.0 and 1.0.'});
    //     } else if (new_data.name.length === 0) {
    //         setError({title: 'invalid parameters', message: 'You must supply a crawler name.'});
    //     } else if (new_data.crawlerType === 'none') {
    //
    //         setError({title: 'invalid parameters', message: ' you must select a crawler-type.'});
    //
    //     } else if (!sj) {
    //
    //         setError({title: 'invalid parameters', message: ' crawler specific data not set'});
    //
    //     } else if (!validAcls) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' This source does not have valid ACLs.\nThis source won\'t be usable.  Please add ACLs to this source.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'file' && (
    //         (!sj.username || sj.username.length === 0) ||
    //         (!sj.server || sj.server.length === 0) ||
    //         !validFQDN(sj.fqdn) ||
    //         (!sj.shareName || sj.shareName.length === 0))) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' file crawler: you must supply a name, username, server, valid FQDN and share path as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'web' && (
    //         !sj.baseUrlList || sj.baseUrlList.length === 0 ||
    //         (!sj.baseUrlList || (!sj.baseUrlList.startsWith("http://") && !sj.baseUrlList.startsWith("https://"))))) {
    //
    //         setError({title: 'invalid parameters', message: ' you must supply a base url of type http:// or https://'});
    //
    //     } else if (new_data.crawlerType === 'database' && (
    //         !sj.jdbc || sj.jdbc.length === 0 ||
    //         !sj.type || sj.type.length === 0 || !sj.type || sj.type === 'none' ||
    //         !sj.query || sj.query.length === 0 || !sj.pk || sj.pk.length === 0 ||
    //         !sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' you must supply a jdbc connection string, database-type, a query, a primary-key, a text-template, and a SQL-template as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'restfull' && (
    //         !sj.url || sj.url.length === 0 ||
    //         !sj.pk || sj.pk.length === 0 ||
    //         (new_data.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) ||
    //         (!new_data.customRender && (!sj.content_url || sj.content_url.length === 0)))
    //     ) {
    //         if (new_data.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0))
    //             setError({
    //                 title: 'invalid parameters',
    //                 message: ' you must supply a primary-key, a url, a text-template, and an HTML-template as a minimum.'
    //             });
    //         else
    //             setError({
    //                 title: 'invalid parameters',
    //                 message: ' you must supply a primary-key, a url, and a content-url as a minimum.'
    //             });
    //
    //     } else if (new_data.crawlerType === 'database' && sj.metadata_list && sj.metadata_list.length > 0 &&
    //         !isValidMetadata(sj.metadata_list, true)) {
    //
    //         // isValidDBMetadata will set the error
    //
    //     } else if (new_data.crawlerType === 'exchange365' && (
    //         !sj.tenantId || sj.tenantId.length === 0 ||
    //         !sj.clientId || sj.clientId.length === 0 ||
    //         !sj.redirectUrl || sj.redirectUrl.length === 0 ||
    //         !sj.clientSecret || sj.clientSecret.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'sharepoint365' && (
    //         !sj.tenantId || sj.tenantId.length === 0 ||
    //         !sj.clientId || sj.clientId.length === 0 ||
    //         !sj.redirectUrl || sj.redirectUrl.length === 0 ||
    //         !sj.clientSecret || sj.clientSecret.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'onedrive' && (
    //         !sj.tenantId || sj.tenantId.length === 0 ||
    //         !sj.clientId || sj.clientId.length === 0 ||
    //         !sj.redirectUrl || sj.redirectUrl.length === 0 ||
    //         !sj.clientSecret || sj.clientSecret.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'dropbox' && (!sj.clientToken || sj.clientToken.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' dropbox crawler: you must supply a client-token, and select a user as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'dropbox' && !validDropBoxFolderList(sj.folderList)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' dropbox crawler: you have invalid values in your start folder.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'box' && !validDropBoxFolderList(sj.folderList)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' box crawler: you have invalid values in your start folder.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'imanage' && !validDropBoxFolderList(sj.folderList)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' iManage crawler: you have invalid values in your start folder.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'box' && (!sj.clientId || sj.clientId.length === 0 ||
    //         !sj.clientSecret || sj.clientSecret.length === 0 || !sj.enterpriseId || sj.enterpriseId.length === 0 ||
    //         sj.timeToCheckFrom.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' box crawler: you have invalid values for clientId / clientSecret / enterpriseId / time-to-check-from.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'imanage' && (!sj.clientId || sj.clientId.length === 0 ||
    //         !sj.clientSecret || sj.clientSecret.length === 0 || !sj.libraryId || sj.libraryId.length === 0 ||
    //         !sj.server || sj.server.length === 0 || !sj.username || sj.username.length === 0 ||
    //         !sj.cursor || sj.cursor.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' iManage crawler: you have invalid values for server / username / clientId / clientSecret / libraryId / cursor.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'gdrive' && (!sj.gdrive_clientId || sj.gdrive_clientId.length === 0 ||
    //         !sj.gdrive_projectId || sj.gdrive_projectId.length === 0 ||
    //         !sj.gdrive_clientSecret || sj.gdrive_clientSecret.length === 0 ||
    //         !sj.gdrive_clientName || sj.gdrive_clientName.length === 0 || !sj.gdrive_clientPort || sj.gdrive_clientPort.length === 0)) {
    //
    //         setError({
    //             title: 'invalid parameters',
    //             message: ' you must supply values for all fields, and select one user as a minimum.'
    //         });
    //
    //     } else if (new_data.crawlerType === 'nfs' && (sj.nfs_local_folder.length === 0)) {
    //
    //         setError({title: 'invalid parameters', message: ' nfs: you must set a local folder.'});
    //
    //     } else if (new_data.crawlerType === 'rss' && (sj.endpoint.length < 5)) {
    //
    //         setError({title: 'invalid parameters', message: ' RSS: you must supply a value for endpoint.'});
    //
    //     } else if (new_data.crawlerType !== 'web' && new_data.crawlerType !== 'file' && new_data.crawlerType !== 'database' &&
    //         new_data.crawlerType !== 'exchange365' && new_data.crawlerType !== 'dropbox' &&
    //         new_data.crawlerType !== 'nfs' && new_data.crawlerType !== 'wordpress' && new_data.crawlerType !== 'gdrive' &&
    //         new_data.crawlerType !== 'onedrive' && new_data.crawlerType !== 'sharepoint365' &&
    //         new_data.crawlerType !== 'restfull' && new_data.crawlerType !== 'rss' && new_data.crawlerType !== 'external' &&
    //         new_data.crawlerType !== 'box' && new_data.crawlerType !== 'imanage' && new_data.crawlerType !== 'discourse' &&
    //         new_data.crawlerType !== 'googlesite' && new_data.crawlerType !== 'servicenow' &&
    //         new_data.crawlerType !== 'search' && new_data.crawlerType !== 'confluence') {
    //
    //         setError({title: 'invalid parameters', message: ' you must select a crawler-type first.'});
    //
    //     } else if (isNaN(new_data.filesPerSecond)) {
    //
    //         setError({title: 'invalid parameters', message: 'files-per-second must be a number'});
    //
    //     } else if (!isValidMetadata(sj.metadata_list, false)) {
    //         // takes care of itself
    //
    //     } else {
    //         dispatch(updateSources({session_id: session.id, data: new_data}))
    //     }
    //
    //
    //     // setFormData(new_data)
    //     console.log("onSubmit new_data", new_data)
    //     // console.log("onSubmit new_default_source_data", new_default_source_data)
    //     // errors = {title: "Form validation", message: "Invalid name added"}
    //
    //     // if (errors != undefined) {
    //     //     console.log("showErrorAlert: event dispatch", errors)
    //     //     dispatch(showErrorAlert(errors))
    //     // } else {
    //
    //     // }
    //
    //     // handleClose()
    // };

    const onSubmit = data => {

        let errors = undefined;

        // for existing data form returns data.crawlerType as undefined because the form field is disabled
        // thus merge form_data.crawlerType to data
        if (data.crawlerType === undefined) {
            data = {...data, crawlerType: form_data.crawlerType}
        }


        // Properties in data will overwrite those in form_data.
        let new_data = {...form_data, ...data}


        const validAcls = new_data.allowAnonymous || (new_data.acls && new_data.acls.length > 0);



        let sj = {};
        if (new_data && new_data.specificJson && (typeof new_data.specificJson === "string" || new_data.specificJson instanceof String)) {
            sj = JSON.parse(new_data.specificJson);
        }

        if (new_data.qaMatchStrength < 0.0 || new_data.qaMatchStrength > 1.0) {

            setError({title: 'invalid parameters', message: 'Q&A threshold must be between 0.0 and 1.0.'});
        } else if (new_data.name.length === 0) {
            setError({title: 'invalid parameters', message: 'you must supply a crawler name.'});
        } else if (new_data.crawlerType === 'none') {
            setError({title: 'invalid parameters', message: 'you must select a crawler-type.'});
        } else if (!sj) {
            setError({title: 'invalid parameters', message: 'crawler specific data not set'});
        } else if (!validAcls && !new_data.crawlerType === 'discourse') {
            setError({title: 'invalid parameters', message:  'This source does not have valid ACLs.\nThis source won\'t be usable.  Please add ACLs to this source.'});
        } else if (new_data.crawlerType === 'file' && (
            (!sj.username || sj.username.length === 0) ||
            (!sj.server || sj.server.length === 0) ||
            !this.validFQDN(sj.fqdn) ||
            (!sj.shareName || sj.shareName.length === 0))) {
            setError({title: 'invalid parameters', message: 'file crawler: you must supply a name, username, server, valid FQDN and share path as a minimum.'});
        } else if (new_data.crawlerType === 'servicenow' && (
            (!sj.username || sj.username.length === 0) ||
            (!sj.server || sj.server.length === 0))) {
            setError({title: 'invalid parameters', message: 'service-now crawler: you must supply a username, password, and service-now instance name.'});
            // this.setError('invalid parameters', 'service-now crawler: you must supply a username, password, and service-now instance name.');

        } else if (new_data.crawlerType === 'web' && (
            !sj.baseUrlList || sj.baseUrlList.length === 0 ||
            (!sj.baseUrlList || (!sj.baseUrlList.startsWith("http://") && !sj.baseUrlList.startsWith("https://"))))) {
            setError({title: 'invalid parameters', message: 'you must supply a base url of type http:// or https://'});

        } else if (new_data.crawlerType === 'googlesite' && (
            !sj.baseUrlList || sj.baseUrlList.length === 0 || !sj.baseUrlList.trim().startsWith("https://sites.google.com/"))) {
            setError({title: 'invalid parameters', message: 'you must supply a base-url starting with https://sites.google.com/'});

        } else if (new_data.crawlerType === 'database' && (
            !sj.jdbc || sj.jdbc.length === 0 ||
            !sj.type || sj.type.length === 0 || !sj.type || sj.type === 'none' ||
            !sj.query || sj.query.length === 0 || !sj.pk || sj.pk.length === 0 ||
            !sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) {
            setError({title: 'invalid parameters', message: 'you must supply a jdbc connection string, database-type, a query, a primary-key, a text-template, and a SQL-template as a minimum.'});

        } else if (new_data.crawlerType === 'restfull' && (
            !sj.url || sj.url.length === 0 ||
            !sj.pk || sj.pk.length === 0 ||
            (new_data.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0)) ||
            (!new_data.customRender && (!sj.content_url || sj.content_url.length === 0)))
        ) {
            if (new_data.customRender && (!sj.template || sj.template.length === 0 || !sj.text || sj.text.length === 0))
                setError({title: 'invalid parameters', message: 'you must supply a primary-key, a url, a text-template, and an HTML-template as a minimum.'});
            else
                setError({title: 'invalid parameters', message: 'you must supply a primary-key, a url, and a content-url as a minimum.'});

        } else if (new_data.crawlerType === 'database' && sj.metadata_list && sj.metadata_list.length > 0 &&
            !this.isValidMetadata(sj.metadata_list, true)) {

            // isValidDBMetadata will set the error

        } else if (new_data.crawlerType === 'exchange365' && (
            !sj.tenantId || sj.tenantId.length === 0 ||
            !sj.clientId || sj.clientId.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0)) {
            setError({title: 'invalid parameters', message: 'you must supply tenant-id, client-id, and client-secret as a minimum.'});

        } else if (new_data.crawlerType === 'sharepoint365' && (
            !sj.tenantId || sj.tenantId.length === 0 ||
            !sj.clientId || sj.clientId.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0)) {
            setError({title: 'invalid parameters', message: 'you must supply tenant-id, client-id, and client-secret as a minimum.'});

        } else if (new_data.crawlerType === 'onedrive' && (
            !sj.tenantId || sj.tenantId.length === 0 ||
            !sj.clientId || sj.clientId.length === 0 ||
            !sj.redirectUrl || sj.redirectUrl.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0)) {
            setError({title: 'invalid parameters', message: 'you must supply tenant-id, client-id, client-secret, and redirect-url as a minimum.'});

        } else if (new_data.crawlerType === 'dropbox' && (!sj.clientToken || sj.clientToken.length === 0)) {
            setError({title: 'invalid parameters', message: 'dropbox crawler: you must supply a client-token, and select a user as a minimum.'});

        } else if (new_data.crawlerType === 'discourse' && (!sj.apiToken || sj.apiToken.length === 0 || !sj.server || sj.server.length === 0)) {
            setError({title: 'invalid parameters', message: 'discourse crawler: you must supply an api-token, and a server name.'});

        } else if (new_data.crawlerType === 'dropbox' && !this.validDropBoxFolderList(sj.folderList)) {
            setError({title: 'invalid parameters', message: 'dropbox crawler: you have invalid values in your start folder.'});

        } else if (new_data.crawlerType === 'box' && !this.validDropBoxFolderList(sj.folderList)) {
            setError({title: 'invalid parameters', message: 'box crawler: you have invalid values in your start folder.'});

        } else if (new_data.crawlerType === 'imanage' && !this.validDropBoxFolderList(sj.folderList)) {
            setError({title: 'invalid parameters', message: 'iManage crawler: you have invalid values in your start folder.'});

        } else if (new_data.crawlerType === 'box' && (!sj.clientId || sj.clientId.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0 || !sj.enterpriseId || sj.enterpriseId.length === 0 ||
            sj.deltaIndicator.length === 0)) {
            setError({title: 'invalid parameters', message: 'box crawler: you have invalid values for clientId / clientSecret / enterpriseId / time-to-check-from.'});

        } else if (new_data.crawlerType === 'imanage' && (!sj.clientId || sj.clientId.length === 0 ||
            !sj.clientSecret || sj.clientSecret.length === 0 || !sj.libraryId || sj.libraryId.length === 0 ||
            !sj.server || sj.server.length === 0 || !sj.username || sj.username.length === 0 ||
            !sj.cursor || sj.cursor.length === 0)) {
            setError({title: 'invalid parameters', message: 'iManage crawler: you have invalid values for server / username / clientId / clientSecret / libraryId / cursor.'});

        } else if (new_data.crawlerType === 'gdrive' && (!sj.drive_user_csv || sj.drive_user_csv.length === 0 ||
            !sj.deltaIndicator || sj.deltaIndicator.length === 0)) {
            setError({title: 'invalid parameters', message: 'you must supply values for all fields, and select one user as a minimum.'});

        } else if (new_data.crawlerType === 'nfs' && (!sj.nfs_local_folder || sj.nfs_local_folder.length === 0)) {
            setError({title: 'invalid parameters', message: 'nfs: you must set a local folder.'});

        } else if (new_data.crawlerType === 'rss' && (!sj.endpoint || sj.endpoint.length < 5)) {
            setError({title: 'invalid parameters', message: 'RSS: you must supply a value for endpoint.'});

        } else if (new_data.crawlerType !== 'web' && new_data.crawlerType !== 'file' && new_data.crawlerType !== 'database' &&
            new_data.crawlerType !== 'exchange365' && new_data.crawlerType !== 'dropbox' &&
            new_data.crawlerType !== 'nfs' && new_data.crawlerType !== 'wordpress' && new_data.crawlerType !== 'gdrive' &&
            new_data.crawlerType !== 'onedrive' && new_data.crawlerType !== 'sharepoint365' &&
            new_data.crawlerType !== 'restfull' && new_data.crawlerType !== 'rss' && new_data.crawlerType !== 'external' &&
            new_data.crawlerType !== 'box' && new_data.crawlerType !== 'imanage' && new_data.crawlerType !== 'discourse' &&
            new_data.crawlerType !== 'googlesite' && new_data.crawlerType !== 'servicenow' &&
            new_data.crawlerType !== 'search' && new_data.crawlerType !== 'confluence') {
            setError({title: 'invalid parameters', message: 'you must select a crawler-type first.'});
            // this.setError('invalid parameters', 'you must select a crawler-type first.');

        } else if (isNaN(new_data.filesPerSecond)) {
            setError({title: 'invalid parameters', message: 'files-per-second must be a number'});

        } else if (!isValidMetadata(sj.metadata_list, false)) {
            // takes care of itself

        } else {
            dispatch(updateSources({session_id: session.id, data: new_data}))
        }


        // setFormData(new_data)
        console.log("onSubmit new_data", new_data)
        // console.log("onSubmit new_default_source_data", new_default_source_data)
        // errors = {title: "Form validation", message: "Invalid name added"}

        // if (errors != undefined) {
        //     console.log("showErrorAlert: event dispatch", errors)
        //     dispatch(showErrorAlert(errors))
        // } else {

        // }

        // handleClose()
    };

    //update the crawlerType
    useEffect(() => {
        let selected_val = getValues("crawlerType")
        console.log("selected_val", selected_val)

        if (selected_val) setFormData({...form_data, crawlerType: selected_val})
    }, [watch("crawlerType")])


    //set acl data to form_data
    function updateAclList(list) {
        console.log("acl in source form", list)
        setFormData({...form_data, acls: list})
        console.log("acl in source form form_data", form_data)
    }


    //set schedule data to form_data
    function updateSchedule(time) {
        console.log(time)
        if (time !== null) {
            setFormData({...form_data, schedule: time})
        }
    }

    function updateProcessorConfig(processors) {
        console.log(processors)
        if (processors !== null) {
            setFormData({...form_data, processorConfig: processors})
        }
    }




    //consoles
    console.log("elected_source.crawlerType", selected_source.crawlerType)


    if (!show_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", 'zIndex': 8000, background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="mb-0" id="staticBackdropLabel">{title}</h4>
                                {/* <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button> */}
                            </div>


                            <div className="modal-body p-0">

                                {/* Menu */}
                                

                                <div className="nav nav-tabs overflow-auto">
                                    <SourceTabs
                                    source_tabs={source_tabs}
                                    selected_source_tab={selected_source_tab}
                                    onClick={changeNav}
                                    crawler_type={form_data ? form_data.crawlerType : null}/>
                                </div>


                                {/* Page 1: GeneralForm */}
                                {selected_source_tab === 'general' &&
                                    <GeneralForm
                                        errors={errors}
                                        register={register}
                                        source={selected_source}
                                        getValues={getValues}/>
                                }


                                {/* Page 2: form for the selected_source_tab - crawler config  */}

                                {selected_source_tab === 'rss' &&
                                    <CrawlerRssForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'box' &&
                                    <CrawlerBoxForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'database' &&
                                    <CrawlerDatabaseForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'dropbox' &&
                                    <CrawlerDropboxForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'exchange365' &&
                                    <CrawlerExchange365Form
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'external' &&
                                    <CrawlerExternalForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'file' &&
                                    <CrawlerFileForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'gdrive' &&
                                    <CrawlerGDriveForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'imanage' &&
                                    <CrawlerIManageForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'nfs' &&
                                    <CrawlerNfsForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'onedrive' &&
                                    <CrawlerOnedriveForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'restfull' &&
                                    <CrawlerRestfulForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'sharepoint365' &&
                                    <CrawlerSharepoint365Form
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'web' &&
                                    <CrawlerWebForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }


                                {selected_source_tab === 'confluence' &&
                                    <CrawlerConfluenceForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'discourse' &&
                                    <CrawlerDiscourseForm2
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'search' &&
                                    <CrawlerSearchForm2
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'wordpress' &&
                                    <CrawlerWordPressForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }

                                {selected_source_tab === 'servicenow' &&
                                    <CrawlerServiceNow
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>
                                }


                                {/* Page 3: CrawlerMetadataForm  */}
                                {selected_source_tab === 'metadata' && (selected_source.crawlerType === "database" || selected_source.crawlerType === "restfull") &&

                                    <CrawlerMetaMapperForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                }
                                {selected_source_tab === 'metadata' && selected_source.crawlerType !== "restfull" && selected_source.crawlerType !== "database" && selected_source.crawlerType !== "wordpress" &&
                                    <CrawlerMetadataForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>

                                    // {selected_source_tab === 'metadata' && c_type !== "restfull" && c_type !== "database" && c_type !== "wordpress" &&
                                    //     <CrawlerMetadataForm
                                    // theme={theme}
                                    // specific_json={sj}

                                    // onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }


                                {/* Page 4: AclSetup  */}
                                {selected_source_tab === 'acls' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"  style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="row mb-3">
                                            <div className="col-6 d-flex">
                                                <div class="alert alert-warning small py-2" role="alert">
                                                This list sets a default set of Access Control for this source
                                                </div>
                                            </div>
                                        </div>
                                        {/*<AclSetupForm*/}
                                        {/*    source={selected_source}*/}
                                        {/*    form_data={form_data}*/}
                                        {/*    setFormData={setFormData}/>*/}


                                        <AclSetup
                                            organisation_id={selected_organisation_id}
                                            acl_list={form_data.acls}
                                            onChange={(acl_list) => updateAclList(acl_list)}
                                            user_list={user_list}
                                            group_list={group_list}/>
                                    </div>
                                }



                                {/* Page 5: processors TimeSelect  */}
                                {selected_source_tab === 'processors' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto">
                                        <ProcessorSetup
                                            processorConfig={form_data.processorConfig}
                                            onSave={(processorConfig) => updateProcessorConfig(processorConfig)}/>
                                    </div>
                                }


                                {/* Page 6: schedule TimeSelect  */}
                                {selected_source_tab === 'schedule' &&
                                    // {selected_source_tab === 'schedule' && c_type !== "wordpress" &&
                                    <div className="time-tab-content px-5 py-4">
                                        <TimeSelect time={form_data.schedule}
                                                    onSave={(time) => updateSchedule(time)}/>
                                    </div>
                                }


                            </div>
                            <div className="modal-footer px-5 pb-3">

                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Close
                                </button>
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>


                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}