import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useForm} from "react-hook-form";
import Api from "../../common/api";
import {addOrUpdate, closeForm, showSecurityPrompt} from "./knowledgeBaseSlice";
import {showErrorAlert} from "../alerts/alertSlice";
import {KnowledgeBaseSecurityDialog} from "./KnowledgeBaseSecurityDialog";

export default function KnowledgeBaseForm() {

    const dispatch = useDispatch();
    //get the data from slices
    const kb_list = useSelector((state) => state.kbReducer.kb_list)

    //load kb
    const kb_id = useSelector((state) => state.kbReducer.edit_id)
    const show_kb_form = useSelector((state) => state.kbReducer.show_form)
    const session = useSelector((state) => state.authReducer.session)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const [security_id, setSecurityId] = useState();

    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")


    function showMissingOrganisationError() {
        if (!organisation_id) {
            dispatch(showErrorAlert({
                "message": "Organisation-id missing, please select an organisation first.",
                "title": "error"
            }))
            handleClose()
        }
    }

    let kb = undefined

    if (kb_id && kb_list) {
        let temp_obj = kb_list.filter((obj) => {
            return obj.kbId === kb_id
        })
        if (temp_obj.length > 0) {
            kb = (temp_obj[0])
        }
    }

    const [edit_index_schedule, setIndexSchedule] = useState('');
    const [scheduleEnable, setScheduleEnable] = useState(false);

    const refreshSecurityId = () => {
        const id = Api.createGuid()
        setSecurityId(id)
        return id
    }

    const refreshSecurityIdPrompt = () => dispatch(showSecurityPrompt())

    useEffect(() => {
        if (kb) {
            setScheduleEnable(kb.scheduleEnable)
            setIndexSchedule(kb.similarityCalculationSchedule)
        }
    }, [kb])


    useEffect(() => {
        if (kb_id === undefined || kb_id === null) {
            refreshSecurityId()
        }
        //Show Missing Org error at page loading if no org set.
        showMissingOrganisationError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_kb_form])


    const handleClose = () => dispatch(closeForm())

    // set title
    const title = (kb_id) ? "Edit Knowledge Base" : "New Knowledge Base"

    //Form Hook
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {}

        defaultValues.kbId = kb_id ? kb_id : ''
        defaultValues.name = kb ? kb.name : ''
        defaultValues.email = kb ? kb.email : ''
        defaultValues.securityId = kb ? kb.securityId : refreshSecurityId()
        defaultValues.maxQueriesPerDay = kb ? kb.maxQueriesPerDay : 0
        defaultValues.enabled = kb ? kb.enabled : true
        defaultValues.capacityWarnings = kb ? kb.capacityWarnings : false

        defaultValues.created = kb ? kb.created : 0
        defaultValues.autoOptimizationEnabled = kb ? kb.autoOptimizationEnabled : true
        defaultValues.globalSearchBoost = kb ? kb.globalSearchBoost : false
        defaultValues.similarityCalculationSchedule = kb ? kb.similarityCalculationSchedule : ''
        defaultValues.scheduleEnable = kb ? kb.scheduleEnable : false

        reset({...defaultValues})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kb, show_kb_form])


    //on submit store or update
    const onSubmit = data => {
        data = {
            ...data,
            organisationId: organisation_id,
            similarityCalculationSchedule: edit_index_schedule,
            scheduleEnable: scheduleEnable
        }
        dispatch(addOrUpdate({session_id: session.id, data: data}))
    }

    if (!show_kb_form)
        return <div/>

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-xl"} role="document">
                    <div className="modal-content">

                        <div className="modal-header px-5 pt-4">
                            <h4 className="mb-0" id="staticBackdropLabel">{title}</h4>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body p-0">

                                <div className="tab-content px-5 py-4 overflow-auto"
                                     style={{maxHeight: "600px", minHeight: "400px"}}>
                                    <div className="row mb-5">
                                        <div className="control-row col-4">
                                            <label className="label-2 small required">Name</label>
                                            <input
                                                className="form-control" {...register("name", {required: true})} />
                                            {errors.name &&
                                                <span className="text-danger fst-italic small">Name is required </span>}
                                        </div>
                                        <div className="control-row col-4">
                                            <label className="label-2 small required">Security ID</label>
                                            <div className="d-flex input-group">
                                                <input className="form-control" value={security_id}
                                                       readOnly="readonly" {...register("securityId", {required: true})} />
                                                <span className="input-group-text copied-style"
                                                      title="generate new security id"
                                                      onClick={() => refreshSecurityIdPrompt()}>
                                                    <img src={REFRESH_IMAGE} className="refresh-image"
                                                         alt="refresh" title="refresh"/>
                                                 </span>
                                            </div>
                                            {errors.securityId &&
                                                <span
                                                    className="text-danger fst-italic small"> Security id is required</span>}
                                        </div>
                                    </div>

                                    <div className="row mb-5">
                                        <div className="control-row col-4">
                                            <label className="label-2 small required">Email Capacity Warnings to</label>
                                            <input className="form-control"
                                                   placeholder="example@email.com" {...register("email", {
                                                required: true
                                            })} />
                                            {errors.email && <span className="text-danger fst-italic small"> Email is required</span>}
                                        </div>
                                        <div className="control-row col-4"
                                             title="The maximum number of queries of the entire system is checked and enforced if this value is greater than zero">
                                            <span className="label-2 small">Max number of queries per day </span>
                                            <span className={(theme==="light" ? "text-black-50" : "text-white-50") + " text-nowrap small"}>(0 = no limits)</span>
                                            <div className="form-control d-flex">
                                                <input
                                                    inputMode="numeric"
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    className="border-0 p-0 w-100"
                                                    placeholder="(0 = no limits)"
                                                    {...register("maxQueriesPerDay", {
                                                        required: true,
                                                        pattern: /^[0-9]*$/ // Only allows numeric input
                                                    })}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="row mb-3">
                                        <div className="form-check form-switch"
                                             title="A knowledge base can be disabled in which case it can't be used for Search">
                                            <input className="form-check-input" type="checkbox"
                                                   id="enableKnowledgeBase"
                                                   {...register('enabled')}/>
                                            <label className="form-check-label">Knowledge Base Enabled</label>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="form-check form-switch"
                                             title="Email the person above if this knowledge base exceeds its size limits">
                                            <input className="form-check-input" type="checkbox"
                                                   id="enableCapacityWarnings"
                                                   {...register('capacityWarnings')}/>
                                            <label className="form-check-label">Email Capacity Warnings</label>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="form-check form-switch"
                                             title="The index optimizer will automatically create optimized indexes as data is processed">
                                            <input className="form-check-input" type="checkbox"
                                                   id="autoOptimizationEnabled"
                                                   {...register('autoOptimizationEnabled')}/>
                                            <label className="form-check-label">Auto Optimize Data</label>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="form-check form-switch"
                                             title="Apply Result Influencing / Search Boosting to all Users' results.">
                                            <input className="form-check-input" type="checkbox"
                                                   id="globalSearchBoost"
                                                   {...register('globalSearchBoost')}/>
                                            <label className="form-check-label">Global Result Influencing</label>
                                        </div>
                                    </div>

                                </div>

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
    )
}
