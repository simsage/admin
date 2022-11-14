import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {closeForm, getSource, updateSources} from "./sourceSlice";
import SourceTabs from "./forms/SourceTabs";
import React, {useEffect, useState} from "react";
import GeneralForm from "./forms/GeneralForm";
import CrawlerMetadataForm from "./forms/CrawlerMetadataForm";
import ScheduleForm from "./forms/ScheduleForm";
import AclSetup from "../../common/acl-setup";
import {getGroupList} from "../groups/groupSlice";
import {getUserList} from "../users/usersSlice";
import TimeSelect from "../../common/time-select";


export default function SourceForm(props) {

    let new_default_source_data = {
        "filesPerSecond": 0.5,
        "organisationId": "",
        "crawlerType": "none",
        "deleteFiles": false,
        "allowAnonymous": true,
        "enablePreview": true,
        "processingLevel": "NLU",
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
        "kbId": ""
    }

    const theme = '';
    // marker for an external node
    const external_node_id = 1000000;


    // a few defaults
    const default_error_threshold = 10;
    const default_num_results = 5;
    const default_num_fragments = 3;
    const default_qna_threshold = 0.8125;


    const user_list = useSelector((state) => state.usersReducer.user_list);
    const group_list = useSelector((state) => state.groupReducer.group_list);
    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);


    let selected_source = useSelector((state) => state.sourceReducer.selected_source);

    // if selected_source === '' then show add form otherwise show edit form
    const show_form = useSelector((state) => state.sourceReducer.show_data_form);
    const title = selected_source ? "Edit Source: " + selected_source.name : "Add Source";
    const selected_source_id = selected_source ? selected_source.sourceId : 0;

    if (!selected_source) {
        //if selected_source === '' then set selected_source = new_default_source_data
        selected_source = {
            ...new_default_source_data,
            organisationId: selected_organisation_id,
            kbId: selected_knowledge_base_id
        }
    }

    const [form_data, setFormData] = useState(selected_source);

    // console.log("selected_knowledge_base_id: ", selected_knowledge_base_id)
    // console.log("selected_organisation_id: ", selected_organisation_id)
    console.log("form_data : ", form_data)
    // console.log("session_id: ", session_id)


    //Source Form Tabs
    const source_tabs = [
        {label: "general", slug: "general", type: "core"},

        //crawlers
        {label: "file crawler", slug: "file", type: "optional"},
        {label: "web crawler", slug: "web", type: "optional"},
        {label: "database crawler", slug: "database", type: "optional"},
        {label: "RESTful crawler", slug: "restfull", type: "optional"},
        {label: "exchange365 crawler", slug: "exchange365", type: "optional"},
        {label: "sharepoint365 crawler", slug: "sharepoint365", type: "optional"},
        {label: "dropbox crawler", slug: "dropbox", type: "optional"},
        {label: "box crawler", slug: "box", type: "optional"},
        {label: "iManage crawler", slug: "imanage", type: "optional"},
        {label: "google drive crawler", slug: "gdrive", type: "optional"},
        {label: "wordpress crawler", slug: "wordpress", type: "optional"},
        {label: "nfs crawler", slug: "nfs", type: "optional"},
        {label: "rss crawler", slug: "rss", type: "optional"},
        {label: "external crawler", slug: "external", type: "optional"},

        //metadata
        {label: "metadata", slug: "metadata", type: "meta"},

        //rest
        {label: "ACLs", slug: "acls", type: "core"},
        {label: "schedule", slug: "schedule", type: "core"},

    ]
    const [selected_source_tab, setSelectedSourceTab] = useState('general')

    function changeNav(slug) {
        const data = getValues();
        console.log("changeNav", data)
        setSelectedSourceTab(slug);
    }


    //Form Hook
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors, dirtyFields},
        reset,
        control,
        getValues
    } = useForm({mode: 'onChange'});

    const handleClose = () => {
        dispatch(closeForm());
    }

    //todo: getsource is not working
    // useEffect(()=>{
    //     console.log(session_id)
    //     // dispatch(getSource({session_id:session_id, organisation_id:selected_organisation_id, kb_id:selected_knowledge_base_id, source_id:selected_source_id}))
    // },[selected_source_id,selected_knowledge_base_id,selected_organisation_id,session])

    useEffect(() => {
        dispatch(getGroupList({session_id: session_id, organization_id: selected_organisation_id}))
        dispatch(getUserList({session_id: session_id, organization_id: selected_organisation_id, filter: null}))
    }, [show_form]);

    useEffect(() => {
        let defaultValues = {};
        console.log("useEffect 159")
        // defaultValues = {...defaultValues, ...default_form_data}
        // let defaultValues = selected_source? selected_source : {};

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

        reset({...defaultValues});
    }, [show_form]);


    // useEffect(()=>{
    //     console.log("form_values.crawlerType", form_data.crawlerType)
    //     // console.log("form_values.processingLevel", form_data.processingLevel)
    //     // console.log("form_values.name", form_data.name)
    //     // setFormData(getSource())
    //     // console.log(form_data)
    // },[getValues()])

    //on submit store or update
    const onSubmit = data => {
        // console.log("onSubmit data", data)

        //crawlerType will be undefined for existing data
        if (data.crawlerType === undefined) {
            data = {...data, crawlerType: form_data.crawlerType}
        }

        // Properties in data will overwrite those in form_data.
        let new_data = {...form_data, ...data}
        // setFormData(new_data)
        console.log("onSubmit new_data", new_data)
        // console.log("onSubmit new_default_source_data", new_default_source_data)

        let form_data1 = {
            "id": "",
            "sourceId": 1,
            "crawlerType": "rss",
            "name": "glp rss 2512",
            "deleteFiles": false,
            "allowAnonymous": true,
            "enablePreview": true,
            "schedule": "mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-7,tue-7,wed-7,thu-7,fri-7,sat-7,sun-7,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23",
            "filesPerSecond": 0.5,
            "specificJson": "{\"endpoint\":\"https://www.globallegalpost.com/rss\",\"metadata_list\":[{\"key\":\"author list\",\"display\":\"author_list\",\"metadata\":\"author_list\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"sourceId\":0,\"fieldOrder\":\"1\"},{\"key\":\"created date range\",\"display\":\"created\",\"metadata\":\"created\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"true\",\"sortDefault\":\"desc\",\"sortAscText\":\"oldest documents first\",\"sortDescText\":\"newest documents first\",\"fieldOrder\":\"0\"},{\"key\":\"document type\",\"display\":\"document type\",\"metadata\":\"document-type\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"fieldOrder\":\"2\"},{\"key\":\"last modified date ranges\",\"display\":\"last modified\",\"metadata\":\"last-modified\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"true\",\"sortDefault\":\"\",\"sortAscText\":\"least recently modified\",\"sortDescText\":\"most recently modified\",\"fieldOrder\":\"3\"},{\"key\":\"created date range\",\"display\":\"created12\",\"metadata\":\"created12\",\"db1\":\"\",\"db2\":\"\",\"sort\":\"false\",\"sortDefault\":\"\",\"sortAscText\":\"\",\"sortDescText\":\"\",\"sourceId\":0,\"fieldOrder\":\"4\"}],\"initial_feed\":\"\"}",
            "processingLevel": "NLU",
            "nodeId": 0,
            "maxItems": 0,
            "maxQNAItems": "0",
            "customRender": false,
            "acls": [],
            "useDefaultRelationships": true,
            "autoOptimize": true,
            "organisationId": "018336d1-f905-98c4-61c9-827978f333cb",
            "kbId": "01833a6a-47ef-422a-6376-32c3187ec488",
            "sessionId": "",
            "maxBotItems": 0,
            "edgeDeviceId": "",
            "qaMatchStrength": 0.8125,
            "numResults": 5,
            "numFragments": 3,
            "numErrors": 0,
            "errorThreshold": 10,
            "startTime": 0,
            "endTime": 0,
            "isCrawling": true,
            "numCrawledDocuments": 0,
            "numConvertedDocuments": 0,
            "numParsedDocuments": 0,
            "numIndexedDocuments": 0,
            "numFinishedDocuments": 0,
            "numTotalDocuments": 330,
            "isBusy": false
        }

        console.log("onSubmit form_data1", form_data1)

        dispatch(updateSources({session_id: session.id, data: new_data}))
        // handleClose()
    };


    function updateAclList(list) {
        console.log("acl in source form", list)
        setFormData({...form_data, acls: list})
        console.log("acl in source form form_data", form_data)
    }

    function updateSchedule(time) {
        console.log(time)
        // if (time !== null) {
        //     setFormData({...form_data, schedule:time})
        //
        //     // this.setState({schedule: time});
        //     // if (this.state.onUpdate) {
        //     //     this.state.onUpdate({...this.gather_data(), "schedule": time});
        //     // }
        // }
    }


    // console.log("selected_source.maxQNAItems tab", selected_source)

    if (!show_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded crawler-page w-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                                <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>


                            <div className="modal-body">
                                <SourceTabs
                                    source_tabs={source_tabs}
                                    onClick={changeNav}
                                    crawler_type={selected_source ? selected_source.crawlerType : null}/>

                                {selected_source_tab === 'general' &&
                                    <GeneralForm errors={errors} register={register} source={selected_source}
                                                 getValues={getValues}/>
                                }

                                {selected_source_tab === 'metadata' &&
                                    <CrawlerMetadataForm
                                        source={selected_source}
                                        form_data={form_data}
                                        setFormData={setFormData}/>
                                    // {selected_source_tab === 'metadata' && c_type !== "restfull" && c_type !== "database" && c_type !== "wordpress" &&
                                    //     <CrawlerMetadataForm
                                    // theme={theme}
                                    // specific_json={sj}
                                    // onError={(title, errStr) => this.setError(title, errStr)}
                                    // onSave={(specific_json) => this.update_specific_json(specific_json)}/>
                                }
                                {selected_source_tab === 'acls' &&
                                    <div>
                                        <div className="acl-text">this list sets a default set of Access Control for
                                            this source
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
                                {selected_source_tab === 'schedule' &&
                                    // {selected_source_tab === 'schedule' && c_type !== "wordpress" &&
                                    <div className="time-tab-content">
                                        <TimeSelect time={form_data.schedule}
                                                    onSave={(time) => updateSchedule(time)}/>
                                    </div>
                                }


                            </div>
                            <div className="modal-footer">

                                <input type="submit" className={"btn btn-outline-primary"}/>

                                <button onClick={handleClose} type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Close
                                </button>


                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}