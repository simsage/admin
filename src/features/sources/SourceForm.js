import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {closeForm, getSources, resetSourceDelta, testSource, updateSource} from "./sourceSlice";
import SourceTabs from "./SourceTabs";
import React, {useEffect, useState} from "react";
import GeneralForm from "./forms/GeneralForm";
import CrawlerMetadataForm from "./forms/CrawlerMetadataForm";
import ACLSetup from "../../common/acl-setup";
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
import CrawlerJiraForm from "./forms/CrawlerJiraForm";
import CrawlerZendeskForm from "./forms/CrawlerZendeskForm";
import CrawlerAWSForm from "./forms/CrawlerAWSForm.js";
import CrawlerLocalFileForm from "./forms/CrawlerLocalFileForm";
import CrawlerOneDriveForm from "./forms/CrawlerOneDriveForm";
import CrawlerRestfulForm from "./forms/CrawlerRestfulForm";
import CrawlerSharepoint365Form from "./forms/CrawlerSharepoint365Form";
import CrawlerWebForm from "./forms/CrawlerWebForm";
import {showErrorAlert} from "../alerts/alertSlice";
import CrawlerConfluenceForm from "./forms/CrawlerConfluenceForm";
import CrawlerDiscourseForm from "./forms/CrawlerDiscourseForm";
import CrawlerSearchForm2 from "./forms/CrawlerSearchForm";
import CrawlerServiceNow from "./forms/CrawlerServiceNow";
import CrawlerExternalCrawlerConfigurationForm from "./forms/CrawlerExternalCrawlerConfigurationForm";
import CrawlerStructuredDataForm from "./forms/CrawlerStructuredDataForm";
import CrawlerEgnyteForm from "./forms/CrawlerEgnyteForm";
import CrawlerSFTPForm from "./forms/CrawlerSFTPForm";
import CrawlerXmlForm from "./forms/CrawlerXmlForm";
import CrawlerSlackForm from "./forms/CrawlerSlackForm";
import {CheckDocument} from "./CheckDocument";
import {is_valid_metadata} from "./forms/common";
import CrawlerAlfrecoForm from "./forms/CrawlerAlfrescoForm";


const externalCrawlers = ['localfile']

export default function SourceForm() {

    let new_default_source_data = {
        "filesPerSecond": 0,
        "organisationId": "",
        "crawlerType": "none",
        "processingLevel": "INDEX",
        "name": "",
        "sourceId": '0',
        "nodeId": 0,
        "maxItems": 0,
        "weight": 1.0,
        "numResults": 5,
        "numFragments": 3,
        "errorThreshold": 10,
        "specificJson":
            "{\"metadata_list\":[" +
            "{\"extMetadata\":\"created\",\"display\":\"created\",\"metadata\":\"created\"}," +
            "{\"extMetadata\":\"last-modified\",\"display\":\"last modified\",\"metadata\":\"last-modified\"}," +
            "{\"extMetadata\":\"document-type\",\"display\":\"document type\",\"metadata\":\"document-type\"}]}",
        "schedule": "",
        "scheduleEnable": true,
        "acls": [],
        "kbId": "",
        "documentSimilarityThreshold": 95,
        "processorConfig": "",

        "deleteFiles": true,
        "allowAnonymous": true,
        "enablePreview": true,
        "customRender": false,
        "useDefaultRelationships": true,
        "storeBinary": true,
        "writeToCassandra": true,
        "useOCR": false,
        "useSTT": false,
        "enableDocumentSimilarity": false,
        "isExternal": false,
        "sortByNewestFirst": false,
        "transmitExternalLogs": false,
        "translateForeignLanguages": false,

        // these aren't inputs - just info values coming back from SimSage
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
        "numErroredDocuments": 0,
        "numTotalDocuments": 0,
        "numTotalErroredDocuments": 0,
        "isBusy": false
    }

    const dispatch = useDispatch();

    // a few defaults
    const default_error_threshold = 10;
    const default_num_results = 5;
    const default_num_fragments = 3;
    const default_weight = 1.0;


    let [verify, set_verify] = useState(null);

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    // SimSage system components enabled?
    const {stt_enabled, translate_enabled} = useSelector((state) => state.authReducer)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const show_form = useSelector((state) => state.sourceReducer.show_data_form);
    const error_message = useSelector((state) => state.sourceReducer.error_message);
    const isUserAdmin = useSelector((state) => state.authReducer.is_admin)

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

    //set the selected source as the form_data
    const [form_data, setFormData] = useState(selected_source);
    const [suggest_close_form, setSuggestCloseForm] = useState(false);


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

        // external crawler is needed for external API sources
        {label: "external crawler", slug: "external", type: "optional"},

        {label: "google-drive crawler", slug: "gdrive", type: "optional"},
        {label: "iManage crawler", slug: "imanage", type: "optional"},

        {label: "Jira crawler", slug: "jira", type: "optional"},
        {label: "Alfresco crawler", slug: "alfresco", type: "optional"},
        {label: "AWS crawler", slug: "aws", type: "optional"},
        {label: "Egnyte crawler", slug: "egnyte", type: "optional"},
        {label: "SFTP crawler", slug: "sftp", type: "optional"},
        {label: "Slack", slug: "slack", type: "optional"},

        {label: "local file crawler", slug: "localfile", type: "optional"},
        {label: "microsoft file share crawler", slug: "file", type: "optional"},
        {label: "one-drive crawler", slug: "onedrive", type: "optional"},

        {label: "rest-full crawler", slug: "restfull", type: "optional"},
        {label: "rss crawler", slug: "rss", type: "optional"},

        {label: "sharepoint 365 crawler", slug: "sharepoint365", type: "optional"},
        {label: "service-now crawler", slug: "servicenow", type: "optional"},
        {label: "structured data crawler", slug: "structured", type: "optional"},
        {label: "web crawler", slug: "web", type: "optional"},
        {label: "xml crawler", slug: "xml", type: "optional"},
        {label: "zendesk crawler", slug: "zendesk", type: "optional"},

        //metadata
        {label: "metadata", slug: "metadata", type: "core"},

        //rest
        {label: "ACLs", slug: "acls", type: "core"},
        {label: "Check document", slug: "check", type: "core"},
        {label: "Set up", slug: "external-crawler", type: "external-crawler"},
        {label: "schedule", slug: "schedule", type: "core"},

    ]

    const [selected_source_tab, setSelectedSourceTab] = useState('general')

    function changeNav(slug) {
        setSelectedSourceTab(slug);
    }

    function renderCrawlerForm(props) {
        switch (selected_source_tab) {
            case "rss":
                return <CrawlerRssForm {...props} />
            case "box":
                return <CrawlerBoxForm {...props} />
            case "database":
                return <CrawlerDatabaseForm {...props} />
            case "dropbox":
                return <CrawlerDropboxForm {...props} />
            case "sftp":
                return <CrawlerSFTPForm {...props} />
            case "exchange365":
                return <CrawlerExchange365Form {...props} />
            case "external":
                return <CrawlerExternalForm {...props} />
            case "file":
                return <CrawlerFileForm {...props} />
            case "gdrive":
                return <CrawlerGDriveForm {...props} />
            case "imanage":
                return <CrawlerIManageForm {...props} />
            case "jira":
                return <CrawlerJiraForm {...props} />
            case "alfresco":
                return <CrawlerAlfrecoForm {...props} />
            case "slack":
                return <CrawlerSlackForm {...props} />
            case "aws":
                return <CrawlerAWSForm {...props} />
            case "zendesk":
                return <CrawlerZendeskForm {...props} />
            case "egnyte":
                return <CrawlerEgnyteForm {...props} />
            case "localfile":
                return <CrawlerLocalFileForm {...props} />
            case "onedrive":
                return <CrawlerOneDriveForm {...props} />
            case "restfull":
                return <CrawlerRestfulForm {...props} />
            case "sharepoint365":
                return <CrawlerSharepoint365Form {...props} />
            case "web":
                return <CrawlerWebForm {...props} />
            case "xml":
                return <CrawlerXmlForm {...props} />
            case "confluence":
                return <CrawlerConfluenceForm {...props} />
            case "discourse":
                return <CrawlerDiscourseForm {...props} />
            case "search":
                return <CrawlerSearchForm2 {...props} />
            case "servicenow":
                return <CrawlerServiceNow {...props} />
            case "structured":
                return <CrawlerStructuredDataForm {...props} />

            default:
                return null
        }
    }

    /**
     Get React Form Hook
     */
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors},
        reset,
        // control,
        setValue,
        getValues,
    } = useForm({mode: 'onChange'});

    // Set form defaultValues
    useEffect(() => {
        let defaultValues = {};

        defaultValues.name = selected_source ? selected_source.name : '';
        defaultValues.crawlerType = selected_source ? selected_source.crawlerType : 'none';
        defaultValues.processingLevel = selected_source ? selected_source.processingLevel : '';
        defaultValues.filesPerSecond = selected_source ? selected_source.filesPerSecond : 0;

        defaultValues.maxItems = selected_source ? selected_source.maxItems : 0;

        defaultValues.nodeId = selected_source ? selected_source.nodeId : 0;
        defaultValues.numFragments = selected_source ? selected_source.numFragments : default_num_fragments;

        defaultValues.weight = selected_source ? selected_source.weight : default_weight;
        defaultValues.errorThreshold = selected_source ? selected_source.errorThreshold : default_error_threshold;
        defaultValues.numResults = selected_source ? selected_source.numResults : default_num_results;
        //
        defaultValues.sourceId = selected_source ? selected_source.sourceId : 0;
        defaultValues.documentSimilarityThreshold =
            (selected_source ? selected_source.documentSimilarityThreshold : 95);

        // boolean flags
        defaultValues.customRender = selected_source && selected_source.customRender === true;
        defaultValues.deleteFiles = selected_source && selected_source.deleteFiles === true;
        defaultValues.allowAnonymous = selected_source && selected_source.allowAnonymous === true;
        defaultValues.enablePreview = selected_source && selected_source.enablePreview === true;
        defaultValues.useDefaultRelationships = selected_source && selected_source.useDefaultRelationships === true;
        defaultValues.storeBinary = selected_source && selected_source.storeBinary === true;
        defaultValues.writeToCassandra = selected_source && selected_source.writeToCassandra === true;
        defaultValues.useOCR = selected_source && selected_source.useOCR === true;
        defaultValues.useSTT = selected_source && selected_source.useSTT === true && stt_enabled;
        defaultValues.sortByNewestFirst = selected_source && selected_source.sortByNewestFirst === true;
        defaultValues.transmitExternalLogs = selected_source && selected_source.transmitExternalLogs === true;
        defaultValues.translateForeignLanguages = selected_source && selected_source.translateForeignLanguages === true && translate_enabled;
        defaultValues.enableDocumentSimilarity = selected_source && selected_source.enableDocumentSimilarity === true;
        defaultValues.isExternal = (selected_source && selected_source.isExternal === true) || (selected_source && externalCrawlers.includes(selected_source.crawlerType));

        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_form]);


    const [has_error, setError] = useState({title: "", message: ""});
    useEffect(() => {
        if (has_error && has_error.message && has_error.message.length > 0)
            dispatch(showErrorAlert(has_error))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [has_error, dispatch])

    // close the form?
    useEffect(() => {
        if (suggest_close_form && !error_message) {
            dispatch(closeForm())
            dispatch(getSources({
                session_id: session_id,
                organisation_id: selected_organisation_id,
                kb_id: selected_knowledge_base_id
            }))
            setSuggestCloseForm(false)
        } else if (suggest_close_form && error_message) {
            setSuggestCloseForm(false)
        }
    }, [suggest_close_form, error_message, session_id, selected_organisation_id, selected_knowledge_base_id, dispatch])


    const handleClose = () => {
        dispatch(closeForm());
    }

    const handleTest = () => {
        let data = getValues()

        if (data.crawlerType === undefined) {
            data = {...data, crawlerType: form_data.crawlerType}
        }

        // Properties in data will overwrite those in form_data.
        let new_data = {...form_data, ...data}

        let is_valid = onSubmitValidate(new_data)
        if (is_valid) {
            onSubmitAsync(new_data).then(() =>
                dispatch(testSource({
                    session_id: session_id,
                    organisation_id: selected_organisation_id,
                    knowledgeBase_id: selected_knowledge_base_id,
                    source_id: selected_source.sourceId
                }))
            )
        }
    }


    const handleResetDelta = () => {
        setFormData({...form_data, deltaIndicator: ''}) // clear delta locally
        dispatch(resetSourceDelta({
            session_id: session_id,
            organisation_id: selected_organisation_id,
            knowledgeBase_id: selected_knowledge_base_id,
            source_id: selected_source.sourceId
        }));
    }

    // save the source
    function handleFormSubmit(data) {
        if (data.crawlerType === undefined) {
            data = {...data, crawlerType: form_data.crawlerType}
        }
        data.crawlerType = form_data.crawlerType;

        // force switch-off if these are enabled system-wide on save
        if (!stt_enabled)
            data.useSTT = false;

        // make sure we never save document-similarity enabled when the processing level isn't the highest
        if (data.processingLevel !== "INDEX")
            data.enableDocumentSimilarity = false

        if (!translate_enabled)
            data.translateForeignLanguages = false;

        // Properties in data will overwrite those in form_data.
        let new_data = {...form_data, ...data}

        let is_valid = onSubmitValidate(new_data)
        if (is_valid) {
            onSubmitAsync(new_data).then(() => setSuggestCloseForm(true))
        }
    }

    async function onSubmitAsync(data) {
        await dispatch(updateSource({session_id: session.id, data: data}))
    }

    const validCrawlerTypes = [
        'web', 'file', 'database', 'exchange365', 'dropbox', 'localfile', 'jira', 'aws',
        'egnyte', 'gdrive', 'sftp', 'onedrive', 'sharepoint365', 'restfull', 'rss', 'external',
        'box', 'imanage', 'discourse', 'googlesite', 'servicenow', 'confluence', 'xml',
        'structured', 'zendesk', 'slack', 'alfresco'
    ]

    const onSubmitValidate = data => {

        if (verify instanceof Function) {
            const error_message = verify(data)
            if (error_message) {
                setError({title: 'invalid parameters', message: error_message})
                return false
            }

        } else if (verify === null && selected_source.sourceId === '0') {
            setError({title: 'invalid parameters', message: "Please setup crawler specific data."})
            return false
        }

        let is_valid = false;
        // for existing data form returns data.crawlerType as undefined because the form field is disabled
        // thus merge form_data.crawlerType to data
        if (data.crawlerType === undefined) {
            data = {...data, crawlerType: form_data.crawlerType}
        }

        // Properties in data will overwrite those in form_data.
        let new_data = {...form_data, ...data}

        let sj = {};
        if (new_data && new_data.specificJson &&
            (typeof new_data.specificJson === "string" || new_data.specificJson instanceof String)) {
            sj = JSON.parse(new_data.specificJson);
            if (!sj) {
                setError({title: 'invalid parameters', message: 'crawler specific data not set'});
                return false
            }
        }

        if (new_data.name.length === 0) {
            setError({title: 'invalid parameters', message: 'you must supply a crawler name.'});
            return false
        }

        if (verify && validCrawlerTypes.indexOf(new_data.crawlerType) < 0) {
            setError({title: 'invalid parameters', message: 'you must select a crawler-type first.'});
            return false
        }

        if (isNaN(new_data.filesPerSecond)) {
            setError({title: 'invalid parameters', message: 'files-per-second must be a number'});
            return false
        }

        if (!is_valid_metadata(sj.metadata_list)) {
            return false
        } else {
            is_valid = true
        }

        return is_valid;
    };

    //update the crawlerType
    useEffect(() => {
        let selected_val = getValues("crawlerType")
        if (selected_val) setFormData({...form_data, crawlerType: selected_val})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watch("crawlerType")])


    //set acl data to form_data
    function updateAclList(list) {
        setFormData({...form_data, acls: list})
    }

    //set schedule data to form_data
    function updateSchedule(time, scheduleEnable) {
        if (time !== null) {
            setFormData({...form_data, schedule: time, scheduleEnable: scheduleEnable})
        }
    }

    if (!show_form)
        return <div/>

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog"
                 style={{display: "inline", 'zIndex': 1060, background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(handleFormSubmit)}>
                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="mb-0" id="staticBackdropLabel">{title}</h4>
                            </div>
                            <div className="modal-body p-0">

                                {/* Menu */}
                                <div className="nav nav-tabs overflow-auto">
                                    <SourceTabs
                                        source_tabs={source_tabs}
                                        selected_source_tab={selected_source_tab}
                                        isExternal={selected_source.isExternal}
                                        onClick={changeNav}
                                        crawler_type={form_data ? form_data.crawlerType : null}/>
                                </div>


                                {/* Page 1: GeneralForm */}
                                {selected_source_tab === 'general' &&
                                    <GeneralForm
                                        errors={errors}
                                        register={register}
                                        source={selected_source}
                                        crawler_type={form_data ? form_data.crawlerType : null}
                                        form_data={form_data}
                                        setFormData={setFormData}
                                        setValue={setValue}
                                        getValues={getValues}
                                    />
                                }


                                {/* Page 2: form for the selected_source_tab - crawler config  */}
                                {source_tabs.map((sourceTab) => (
                                    <div key={sourceTab.slug}>
                                        {selected_source_tab === sourceTab.slug &&
                                            renderCrawlerForm(
                                                {
                                                    source: selected_source,
                                                    form_data: form_data,
                                                    setFormData: setFormData,
                                                    set_verify: set_verify
                                                }
                                            )
                                        }
                                    </div>
                                ))}


                                {/* Page: CrawlerMetadataForm  */}
                                {selected_source_tab === 'metadata' &&
                                    <CrawlerMetadataForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>
                                }


                                {/* Page: AclSetup  */}
                                {selected_source_tab === 'acls' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="row mb-3">
                                            <div className="col-6 d-flex">
                                                <div className="alert alert-warning small py-2" role="alert">
                                                    This list sets a default set of Access Control for this source
                                                </div>
                                            </div>
                                        </div>

                                        <ACLSetup
                                            select_acl_crud={true}
                                            active_acl_list={form_data.acls}
                                            on_update={(ACLs) => updateAclList(ACLs)}
                                            organisation_id={selected_organisation_id}
                                            is_admin={isUserAdmin}
                                            page_size={5}
                                        />

                                    </div>
                                }


                                {/* Page: check document  */}
                                {selected_source_tab === 'check' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto">
                                        <CheckDocument
                                            source={form_data}
                                        />
                                    </div>
                                }

                                {selected_source_tab === 'external-crawler' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto">
                                        <CrawlerExternalCrawlerConfigurationForm
                                            source={selected_source}/>
                                    </div>
                                }

                                {/* Page 6: schedule TimeSelect  */}
                                {selected_source_tab === 'schedule' &&
                                    <div className="time-tab-content px-5 py-4">
                                        <TimeSelect time={form_data.schedule}
                                                    scheduleEnable={form_data.scheduleEnable}
                                                    onSave={(time, scheduleEnable) =>
                                                        updateSchedule(time, scheduleEnable)
                                        }/>
                                    </div>
                                }

                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Close
                                </button>
                                {selected_source && selected_source.sourceId > 0 &&
                                    <button onClick={handleTest} type="button" title='Test Source Connection'
                                            className={`btn btn-primary px-4 ${(externalCrawlers.includes(selected_source.crawlerType)) ? 'disabled' : ''}`}
                                            data-bs-dismiss="modal">Test
                                    </button>
                                }
                                {selected_source && selected_source.sourceId > 0 &&
                                    <button onClick={handleResetDelta} type="button" title='Reset Source Delta'
                                            className='btn btn-primary px-4'
                                            data-bs-dismiss="modal">Reset Delta
                                    </button>
                                }
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}