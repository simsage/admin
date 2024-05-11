import {useDispatch, useSelector} from "react-redux";

import UserBulk from "./UserBulk";
import {closeUserBulkForm} from "./usersSlice";

export function UserBulkForm() {

    const show_user_bulk_form = useSelector((state) => state.usersReducer.show_user_bulk_form)

    const dispatch = useDispatch();

    const handleFormClose = () => {
        dispatch(closeUserBulkForm())
    }

    if (show_user_bulk_form === false)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{ display: "inline", background: "#202731bb" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content p-4">
                    <div className="modal-header">
                        <h5 className="modal-title">Import Bulk Users</h5>
                        <button className="btn-close" aria-label="Close" onClick={() => handleFormClose()} />
                    </div>
                    <div className="modal-body text-center">
                        <div className="modal-body text-center">
                            <UserBulk />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}
