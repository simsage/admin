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
    const title = (organisation === null) ? "New Organisation" : "Edit Organisation";

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

            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="modal-title" id="staticBackdropLabel">{title}</h4>
                                {/* <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body p-0">
                                <div className="px-5 py-4">
                                    <div className="mb-4">
                                        {console.log("error", errors)}
                                        <div className={"mb-3 name" + (errors.name ? " error " : "")}>
                                            <label className="label-2 small">Name</label>
                                            <input className="form-control" {...register("name", {required: true})} />
                                            {errors.name && <span className="text-danger fst-italic small">This field is required </span>}
                                        </div>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" {...register('enabled')}/>
                                            <label className="form-check-label">Enabled</label>
                                        </div>

                                        <div>
                                            <input {...register("id")} type="hidden"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
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