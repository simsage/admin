import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";

import {useForm} from "react-hook-form";
import Api from "../../common/api";
import {addOrUpdate, closeForm} from "./knowledgeBaseSlice";
import {showError} from "../auth/authSlice";

export default function KnowledgeBaseForm(props) {

    const dispatch = useDispatch();
    //get the data from slices
    const kb_list = useSelector((state) => state.kbReducer.kb_list)
    const theme = null;

    //load kb
    const kb_id = useSelector((state) => state.kbReducer.edit_id);
    const show_kb_form = useSelector((state)=>state.kbReducer.show_form);
    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    let kb = undefined;

    if(kb_id && kb_list) {
        let temp_obj = kb_list.filter((obj) => {return obj.kbId === kb_id})
        if(temp_obj.length > 0){
            kb = (temp_obj[0])
        }
    }


    const refreshSecurityId = () => {
        setSecurityId(Api.createGuid());
    }


    useEffect(()=>{
        if(kb_id === undefined){
            refreshSecurityId();
        }
    },[show_kb_form])



    const handleClose = () => {
        dispatch(closeForm());
    }

    // set title
    const title = (kb_id)?"Edit Knowledge Base":"Add new Knowledge Base";
    const [security_id,setSecurityId] = useState('');

    //Form Hook
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();

    console.log(watch("email"));

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};

        defaultValues.kbId = kb_id?kb_id:undefined;
        defaultValues.name = kb?kb.name:'';
        defaultValues.email = kb?kb.email:'';
        defaultValues.securityId = kb?kb.securityId:security_id;
        defaultValues.maxQueriesPerDay = kb?kb.maxQueriesPerDay:0;
        defaultValues.analyticsWindowInMonths = kb?kb.analyticsWindowInMonths:0;

        defaultValues.enabled = kb?kb.enabled:false;
        defaultValues.operatorEnabled = kb?kb.operatorEnabled:false;
        defaultValues.capacityWarnings = kb?kb.capacityWarnings:false;
        defaultValues.enableDocumentSimilarity = kb?kb.enableDocumentSimilarity:false;

        defaultValues.dmsIndexSchedule = kb?kb.dmsIndexSchedule:'';
        defaultValues.documentSimilarityThreshold = kb?kb.documentSimilarityThreshold:0.9;
        defaultValues.created = kb?kb.created:'';

        reset({...defaultValues});
    }, [kb, show_kb_form]);


    //on submit store or update
    const onSubmit = data => {
        data = {...data, organisationId: organisation_id}
        console.log("data",data)
        dispatch(addOrUpdate({session_id: session.id, data: data}))
        handleClose()
    };

// } else {
//     dispatch(showError({"text": "can't save, organisation-id missing", "title": "error"}));
// }
// } else {
//     dispatch(showError({"text": "can't save, missing or invalid parameter(s)", "title": "error"}));
// }

    if (!show_kb_form)
        return (<div />);
    return(

        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}  {kb_id}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="modal-body">
                            <div>
                                <div className="control-row">
                                    <span className="label-3">name</span>
                                    <input {...register("name", {required: true})} /><br/>

                                </div>

                                <div className="control-row">
                                    <span className="label-3">email questions to</span>
                                    <input {...register("email", {required: true})} /><br/>
                                </div>

                                <div className="control-row">
                                    <span className="label-3">security id</span>
                                    <input value={security_id} readOnly="readonly" {...register("securityId", {required: true})} />&nbsp;
                                    <img title="generate new security id" alt="refresh"
                                         src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh-dark.svg"}
                                         onClick={() => refreshSecurityId()}
                                         className="image-size form-icon" />
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
                                    <input {...register("maxQueriesPerDay", {required: true})} /> (0 is no limits)<br/>
                                </div>

                                <div className="control-row">
                                    <span className="label-3">maximum analytics retention period in months </span>
                                    <input {...register("analyticsWindowInMonths", {required: true})} /> (0 is no limits)<br/>
                                </div>

                            </div>

                        </div>
                        <div className="modal-footer">
                            <input type="hidden" {...register("kbId")} />
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <input type="submit" className={"btn btn-outline-primary"}/>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}