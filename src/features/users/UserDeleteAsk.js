import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteUser, getUserList} from "./usersSlice";


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
        dispatch(closeDeleteForm());
    }


    if (!show_delete_form)
        return (<div />);
    const message = user  ? ` User: ${user.firstName} ${user.surname}` : ` all of the users items`;
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">delete {message}?</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">Are you sure you wish to delete {message}?</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button onClick={ handleDelete } type="button" className="btn btn-primary">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
