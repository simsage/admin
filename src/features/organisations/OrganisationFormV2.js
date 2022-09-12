import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    closeOrganisationForm, deleteOrganisation,
    getOrganisationList,
    updateOrganisation
} from "./organisationSlice";
import {useForm} from "react-hook-form";

export default function OrganisationFormV2(props) {

    const dispatch = useDispatch();
    let organisation = null;
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list);


    const handleClose = () => {
        dispatch(closeOrganisationForm());
    }

    const handleDelete = () => {
        dispatch(deleteOrganisation({session_id: props.session.id, organisation_id: props.organisation.id}))
        dispatch(closeOrganisationForm());
    }


    if (props.organisation_id && organisation_list) {
        let temp_org = organisation_list.filter((org) => {
            return org.id === props.organisation_id
        })
        if (temp_org.length > 0) {
            organisation = (temp_org[0])
        }
    }

    console.log("Form", organisation)
    const title = (organisation === null) ? "Add new Organisation" : "Edit Organisation";

    //Form Hook
    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm();

    const name = organisation?organisation.name:'';

    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = name;
        reset({ ...defaultValues });
    }, [organisation]);

    const onSubmit = data => {
        data = {...data,id:props.organisation_id,enabled:true}
        console.log("data",data)
        dispatch(updateOrganisation({session_id:props.session.id,data:data}))
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
                            <h5 className="modal-title" id="staticBackdropLabel">{title} -- Form</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <span className="label-2">name{organisation?organisation.name:''}</span>
                                <input defaultValue="test 2" {...register("name", { required: true })} />
                                {errors.name && <span>This field is required</span>}


                        </div>
                        <div className="modal-footer">
                            <input type="submit" />

                            {/*<button onClick={handleClose} type="button" className="btn btn-secondary"*/}
                            {/*        data-bs-dismiss="modal">Close*/}
                            {/*</button>*/}
                            {/*<button onClick={handleSave} type="button" className="btn btn-secondary"*/}
                            {/*        data-bs-dismiss="modal">Save*/}
                            {/*</button>*/}
                            {/*<br/>*/}
                            {/*{organisation !== null &&*/}
                            {/*    <button onClick={handleDelete} type="button"*/}
                            {/*            className="btn btn-outline-secondary">Delete</button>*/}
                            {/*}*/}
                        </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );

}