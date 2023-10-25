import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useForm} from "react-hook-form";
import Api from "../../common/api";
import {addOrUpdate, closeForm, showSecurityPrompt} from "./knowledgeBaseSlice";
import {showErrorAlert} from "../alerts/alertSlice";
import {KnowledgeBaseFormTab} from "./KnowledgeBaseFormTab";
import TimeSelect from "../../common/time-select";
import {KnowledgeBaseSecurityDialog} from "./KnowledgeBaseSecurityDialog";

export default function KnowledgeBaseForm() {

    const dispatch = useDispatch();
    //get the data from slices
    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const theme = null;

    //load kb
    const kb_id = useSelector((state) => state.kbReducer.edit_id);
    const show_kb_form = useSelector((state) => state.kbReducer.show_form);
    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)



    const [security_id, setSecurityId] = useState();
    const [selected_tab, setSelectedTab] = useState('general')


    function showMissingOrganisationError() {
        if (!organisation_id) {
            dispatch(showErrorAlert({
                "message": "Organisation-id missing, please select an organisation first.",
                "title": "error"
            }));
            handleClose();
        }
    }


    let kb = undefined;

    if (kb_id && kb_list) {
        let temp_obj = kb_list.filter((obj) => {
            return obj.kbId === kb_id
        })
        if (temp_obj.length > 0) {
            kb = (temp_obj[0])
        }
    }

    const [edit_index_schedule, setIndexSchedule] = useState(kb ? kb.indexSchedule : '');

    const refreshSecurityId = () => {
        const id = Api.createGuid();
        setSecurityId(id);
        return id;
    }

    const refreshSecurityIdPrompt = () => {
        dispatch(showSecurityPrompt())
    }


    useEffect(() => {

        if (kb_id === undefined || kb_id === null) {
            refreshSecurityId();
        }
        //Show Missing Org error at page loading if no org set.
        showMissingOrganisationError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_kb_form]);


    const handleClose = () => {
        dispatch(closeForm());
    }

    // set title
    const title = (kb_id) ? "Edit Knowledge Base" : "New Knowledge Base";

    //Form Hook
    const {register, handleSubmit, formState: {errors}, reset} = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};

        defaultValues.kbId = kb_id ? kb_id : '';
        defaultValues.name = kb ? kb.name : '';
        defaultValues.email = kb ? kb.email : '';
        defaultValues.securityId = kb ? kb.securityId : refreshSecurityId();
        defaultValues.maxQueriesPerDay = kb ? kb.maxQueriesPerDay : 0;
        defaultValues.analyticsWindowInMonths = kb ? kb.analyticsWindowInMonths : 0;

        defaultValues.enabled = kb ? kb.enabled : true;
        defaultValues.capacityWarnings = kb ? kb.capacityWarnings : false;

        defaultValues.indexSchedule = kb ? kb.indexSchedule : '';
        defaultValues.created = kb ? kb.created : 0;
        defaultValues.lastIndexOptimizationTime = 0;

        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kb, show_kb_form]);


    //on submit store or update
    const onSubmit = data => {

        console.log("data", data)
        data = {
            ...data,
            organisationId: organisation_id,
            indexSchedule: edit_index_schedule,
        }
        dispatch(addOrUpdate({session_id: session.id, data: data}))

        // dispatch(getKBList({session_id: session.id, organization_id: organisation_id}));
    };

    function handleTabChange(slug) {
        setSelectedTab(slug);
    }

    function updateSchedule(time) {
        setIndexSchedule(time)
    }


    if (!show_kb_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">

                        <div className="modal-header px-5 pt-4 bg-light">
                            <h4 className="mb-0" id="staticBackdropLabel">{title}</h4>
                            {/* <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button> */}
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body p-0">

                                <div className="nav nav-tabs overflow-auto">
                                    <KnowledgeBaseFormTab selected_tab={selected_tab} onTabChange={handleTabChange}/>
                                </div>


                                {selected_tab === 'general' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="row mb-5">
                                            <div className="control-row col-4">
                                                <label className="label-2 small">Name</label>
                                                <input
                                                    className="form-control" {...register("name", {required: true})} />
                                                {errors.name && <span className="text-danger fst-italic small">Name is required </span>}
                                            </div>
                                            <div className="control-row col-4">
                                                <label className="label-2 small">Email Queries</label>
                                                <input className="form-control"
                                                       placeholder="example@email.com" {...register("email", {
                                                    required: true,
                                                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
                                                })} />
                                                {errors.email && <span className="text-danger fst-italic small"> Email is required</span>}
                                            </div>
                                            <div className="control-row col-4">
                                                <label className="label-2 small">Security ID</label>

                                                <div className="form-control d-flex">
                                                    <input className="border-0 p-0 w-100 sid-box" value={security_id}
                                                           readOnly="readonly" {...register("securityId", {required: true})} />
                                                    <img title="generate new security id" alt="refresh"
                                                         src={theme === 'light' ? "images/refresh.svg" : "images/refresh.svg"}
                                                         onClick={() => refreshSecurityIdPrompt()}
                                                         className="image-size form-icon"/>
                                                </div>
                                                {errors.securityId && <span className="text-danger fst-italic small"> Security id is required</span>}
                                            </div>
                                        </div>

                                        <div className="row mb-5">
                                            <div className="control-row col-4">
                                                <span className="label-2 small">Max number of queries (per day) </span>
                                                <div className="form-control d-flex">
                                                    <input
                                                        className="border-0 p-0 w-100" {...register("maxQueriesPerDay", {required: true})} />
                                                    <span
                                                        className="text-nowrap small text-black-50">(0 = no limits)</span>
                                                </div>
                                            </div>

                                            <div className="control-row col-4">
                                                <span
                                                    className="label-2 small">Max analytics retention period (months) </span>
                                                <div className="form-control d-flex">
                                                    <input
                                                        className="border-0 p-0 w-100" {...register("analyticsWindowInMonths", {required: true})} />
                                                    <span
                                                        className="text-nowrap small text-black-50">(0 = no limits)</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="control-row col-4">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox"
                                                           id="enableKnowledgeBase"
                                                           {...register('enabled')}/>
                                                    <label className="form-check-label">Knowledge Base</label>
                                                </div>

                                                {/* <span className="label-3">capacity-warnings on?</span>
                                            <input type="checkbox" {...register('capacityWarnings')}  /> */}
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox"
                                                           id="enableCapacityWarnings"
                                                           {...register('capacityWarnings')}/>
                                                    <label className="form-check-label">Capacity Warnings</label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }
                                {selected_tab === 'index_schedule' &&

                                    <div className="time-tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="row justify-content-center">
                                            <div className="col-6">
                                                <div className="alert alert-warning small py-2" role="alert">
                                                    We strongly advice to allocate only one hour per day for index
                                                    optimizations. Unlike the crawler, each selected slot will cause the
                                                    indexer to start again.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-100">
                                            <TimeSelect time={edit_index_schedule}
                                                        onSave={(time) => updateSchedule(time)}/>
                                        </div>

                                        {kb && kb.lastIndexOptimizationTime > 0 &&
                                            <div>
                                                <br/>
                                                <br/>
                                                <br/>
                                                this knowledge-base was last optimized on&nbsp;
                                                <i>{Api.unixTimeConvert(kb.lastIndexOptimizationTime)}</i>
                                            </div>
                                        }
                                    </div>

                                }

                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <input type="hidden" {...register("kbId")} />
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <KnowledgeBaseSecurityDialog setSecurityId={setSecurityId}/>
        </div>
    );
}
