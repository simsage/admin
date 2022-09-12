
    import {useEffect, useState} from "react";
    import {useDispatch, useSelector} from "react-redux";
    import {
        closeOrganisationForm, deleteOrganisation,
        getOrganisationList,
        updateOrganisation
    } from "./organisationSlice";

    export default function OrganisationForm(){

        const theme = null;
        const dispatch = useDispatch();

        let organisation = null;
        let [name,setName] = useState('');
        let [enabled,setEnabled] = useState(false);

        const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form)
        const organisation_id = useSelector((state) => state.organisationReducer.edit_organisation_id)
        const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
        const session = useSelector((state) => state).authReducer.session;



        useEffect(()=>{
            if(organisation_id && organisation_list) {
                let temp_org = organisation_list.filter((org) => {return org.id === organisation_id})
                if(temp_org.length > 0) {
                    organisation = (temp_org[0])
                    setName(organisation.name);
                    setEnabled(organisation.enabled);
                }
            }
        },[show_organisation_form])

        const title = (organisation_id===null)? "Add new Organisation":"Edit Organisation";

        const handleClose = () => {
            setName('')
            dispatch(closeOrganisationForm());
        }

        const handleDelete = () =>{
            dispatch(deleteOrganisation ({session_id:session.id, organisation_id:organisation_id}))
            dispatch(closeOrganisationForm());
        }

        const handleSave = () => {
            const session_id = session.id
            let org_id = '';
            if(organisation_id !== null) org_id = organisation_id;
            console.log("organisation_id",org_id)
            const data = {name:name, enabled:enabled, id:org_id}
            dispatch(updateOrganisation({session_id,data}))
            dispatch(getOrganisationList({session:session,filter:null}))
            setName('')
        }

        if (!show_organisation_form)
            return (<div />);
        return(

            <div>
                <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                    <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                        <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">{title} -- Form</h5>
                                <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>

                                    <div className="control-row">
                                        <span className="label-2">name</span>
                                        <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(e) => setName(e.target.value)}
                                               placeholder="name"
                                               value={name}
                                        />
                                    </span>
                                    </div>


                                    <div className="control-row">
                                    <span className="checkbox-only">
                                        <input type="checkbox"
                                               checked={enabled?'checked':''}
                                               onChange={(e) => { setEnabled(e.target.checked); }}
                                               value="enable this organisation?"
                                        />
                                    </span>
                                        <span>organisation enabled?{(enabled)?"true":"false"}</span>
                                    </div>

                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button onClick={ handleSave } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Save</button>
                                <br />
                                <button onClick={ handleDelete } type="button" className="btn btn-outline-secondary">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }