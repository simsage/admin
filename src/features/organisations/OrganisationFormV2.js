import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeOrganisationForm, deleteOrganisation, updateOrganisation} from "./organisationSlice";
import {useForm} from "react-hook-form";

export default function OrganisationFormV2(props) {

    const dispatch = useDispatch();
    let organisation = null;
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);

    //load organisation
    if (props.organisation_id && organisation_list) {
        let temp_org = organisation_list.filter((org) => {
            return org.id === props.organisation_id
        })
        if (temp_org.length > 0) {
            organisation = (temp_org[0])
        }
    }

    const handleClose = () => {
        dispatch(closeOrganisationForm());
    }

    const handleDelete = () => {
        dispatch(deleteOrganisation({session_id: props.session.id, organisation_id: organisation.id}))
        handleClose();
    }

    // set title
    const title = (organisation === null) ? "Add new Organisation" : "Edit Organisation";

    //Form Hook
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();

    //set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = organisation ? organisation.name : '';
        defaultValues.enabled = organisation ? organisation.enabled : false;
        defaultValues.id = organisation ? organisation.id : undefined;
        reset({...defaultValues});
    }, [organisation, props.show_organisation_form]);


    //on submit store or update
    const onSubmit = data => {
        dispatch(updateOrganisation({session_id: props.session.id, data: data}))
    };


    if (!props.show_organisation_form)
        return (<div/>);
    return (
        <div>

            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                                <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                <span className="label-2">Name</span>
                                <input {...register("name", {required: true})} /><br/>
                                {errors.name && <span>This field is required <br/></span>}

                                <label className="label-2">Enabled</label>
                                <input name="enabled" type="checkbox" {...register('enabled')}  />

                                <input {...register("id")} type="hidden"/>

                            </div>
                            <div className="modal-footer">
                                <input type="submit" className={"btn btn-outline-primary"}/>

                                {organisation !== null &&
                                    <button onClick={handleDelete} type="button"
                                            className="btn btn-outline-secondary">Delete</button>
                                }
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );

}