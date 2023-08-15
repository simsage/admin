import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteUser} from "./usersSlice";


export default function UserDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;

    const show_delete_form = useSelector((state) => state.usersReducer.show_delete_form)
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const user_id = useSelector( (state) => state.usersReducer.edit_id);
    const user_list = useSelector((state) => state.usersReducer.user_list)


    const user = !user_list ? '' : user_list.filter( u => {
        return u.id === user_id
    })[0]


    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        dispatch(deleteUser({session_id:session_id, user_id: user_id, organisation_id: organisation_id}))
        //dispatch(closeDeleteForm());
    }


    if (!show_delete_form)
        return (<div />);
    const message = user  ? ` user: ${user.firstName} ${user.surname}` : ` all of the users items`;
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
                                <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Cancel</button>
                                <button onClick={ handleDelete } type="button" className="btn btn-danger px-4">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
