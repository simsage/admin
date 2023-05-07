import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteGroup, getGroupList} from "./groupSlice";


export default function GroupDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const show_delete_form = useSelector((state) => state.groupReducer.show_delete_form)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const group = useSelector( (state) => state.groupReducer.edit_group);


    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        dispatch(deleteGroup({session_id: session_id, organisation_id:organisation_id, name: group.name}))
        dispatch(closeDeleteForm());
        dispatch(getGroupList({session_id:session.id, organization_id:organisation_id}))
    }


    if (!show_delete_form)
        return (<div />);
    const message = group  ? ` Group: ${group.name}` : ` all of the users items`;
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
