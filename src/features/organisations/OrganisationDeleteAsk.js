import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteOrganisation} from "./organisationSlice";


export default function OrganisationDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session?.id;

    const show_delete_form = useSelector((state) => state.organisationReducer.show_delete_form)
    //const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const org_to_delete = useSelector((state) => state.organisationReducer.edit_organisation_id)


    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    function handleDelete() {
        dispatch(deleteOrganisation({session_id: session_id, organisation_id: org_to_delete.id}))
        dispatch(closeDeleteForm());
    }


    if (!show_delete_form)
        return (<div />);
    const message = org_to_delete.name
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">Are you sure you wish to delete {message}?</span>
                            </div>
                            <div className="control-row">
                                <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Close</button>
                                <button onClick={ handleDelete } type="button" className="btn btn-danger px-4">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
