import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useForm} from "react-hook-form";
import Api from "../../common/api";
import {addOrUpdate, closeForm, setSelectedTab} from "./knowledgeBaseSlice";
import {showErrorAlert} from "../alerts/alertSlice";
import {KnowledgeBaseFormTab} from "./KnowledgeBaseFormTab";

export default function KnowledgeBaseForm(props) {

    //TODO: Speak to Cole regarding highlighting the form errors


    const dispatch = useDispatch();
    //get the data from slices
    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const theme = null;

    //load kb
    const kb_id = useSelector((state) => state.kbReducer.edit_id);
    const show_kb_form = useSelector((state) => state.kbReducer.show_form);
    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const [security_id, setSecurityId] = useState('');

    const [selected_tab, setSelectedTab] = useState('general')

    function showMissingOrganisationError() {
        if (!organisation_id) {
            dispatch(showErrorAlert({"message": "Organisation-id missing, please select an organisation first.", "title": "error"}));
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


    const refreshSecurityId = () => {
        const id = Api.createGuid();
        setSecurityId(id);
        return id;
    }


    useEffect(() => {

        if (kb_id === undefined || kb_id === null) {
            refreshSecurityId();
        }
        //Show Missing Org error at page loading if no org set.
        showMissingOrganisationError()
    }, [show_kb_form]);


    const handleClose = () => {
        dispatch(closeForm());
    }


    // set title
    const title = (kb_id) ? "Edit Knowledge Base" : "Add new Knowledge Base";

    console.log(security_id)
    //Form Hook
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};

        defaultValues.kbId = kb_id ? kb_id : undefined;
        defaultValues.name = kb ? kb.name : '';
        defaultValues.email = kb ? kb.email : '';
        defaultValues.securityId = kb ? kb.securityId : refreshSecurityId();
        defaultValues.maxQueriesPerDay = kb ? kb.maxQueriesPerDay : 0;
        defaultValues.analyticsWindowInMonths = kb ? kb.analyticsWindowInMonths : 0;

        defaultValues.enabled = kb ? kb.enabled : false;
        defaultValues.operatorEnabled = kb ? kb.operatorEnabled : false;
        defaultValues.capacityWarnings = kb ? kb.capacityWarnings : false;
        defaultValues.enableDocumentSimilarity = kb ? kb.enableDocumentSimilarity : false;

        defaultValues.dmsIndexSchedule = kb ? kb.dmsIndexSchedule : '';
        defaultValues.documentSimilarityThreshold = kb ? kb.documentSimilarityThreshold : 0.9;
        defaultValues.created = kb ? kb.created : '';

        reset({...defaultValues});
    }, [kb, show_kb_form]);


    //on submit store or update
    const onSubmit = data => {
        data = {...data, organisationId: organisation_id}
        console.log("data", data)
        dispatch(addOrUpdate({session_id: session.id, data: data}))
        handleClose()
    };

    function handleTabChange(slug) {
        setSelectedTab(slug);
    }


    if (!show_kb_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title} {kb_id}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body">
                                <KnowledgeBaseFormTab selected_tab={selected_tab} onTabChange={handleTabChange} />

                                <div>
                                    <div className="control-row">
                                        <span className="label-3">name</span>
                                        <input {...register("name", {required: true})} />
                                        {errors.name && <span className=""> Name is required <br/></span>}
                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">email questions to</span>
                                        <input {...register("email", {required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i})} />
                                        {errors.email && <span> Email is required <br/></span>}
                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">security id</span>
                                        <input value={security_id} className="sid-box"
                                               readOnly="readonly" {...register("securityId", {required: true})} />&nbsp;
                                        <img title="generate new security id" alt="refresh"
                                             src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh.svg"}
                                             onClick={() => refreshSecurityId()}
                                             className="image-size form-icon"/>
                                        {errors.securityId && <span> Security id is required <br/></span>}
                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">knowledge-base enabled?</span>
                                        <input type="checkbox" {...register('enabled')}  />

                                    </div>


                                    <div className="control-row">
                                        <span className="label-3">operator enabled?</span>
                                        <input type="checkbox" {...register('operatorEnabled')}  />
                                    </div>


                                    <div className="control-row">
                                        <span className="label-3">capacity-warnings on?</span>
                                        <input type="checkbox" {...register('capacityWarnings')}  />

                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">enable document similarity?</span>
                                        <input type="checkbox" {...register('enableDocumentSimilarity')}  />

                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">maximum number of queries per day </span>
                                        <input {...register("maxQueriesPerDay", {required: true})} /> (0 is no
                                        limits)<br/>

                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">maximum analytics retention period in months </span>
                                        <input {...register("analyticsWindowInMonths", {required: true})} /> (0 is no
                                        limits)<br/>
                                    </div>

                                </div>

                            </div>
                            <div className="modal-footer">
                                <input type="hidden" {...register("kbId")} />
                                <button onClick={handleClose} type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Close
                                </button>
                                <input type="submit" className={"btn btn-outline-primary"}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}