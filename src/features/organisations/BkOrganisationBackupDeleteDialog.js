import {useDispatch, useSelector} from "react-redux";
import {
    closeBackupDeleteMessage, deleteBackup
} from "./organisationSlice";
import Api from "../../common/api";

export default function BkOrganisationBackupDeleteDialog() {

    const dispatch = useDispatch();

    const show_delete_backup_form = useSelector((state) => state.organisationReducer.show_delete_backup_form)
    const selected_backup = useSelector((state) => state.organisationReducer.selected_backup)
    const session = useSelector((state) => state.authReducer.session)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupDeleteMessage());
    }

    const handleDelete = () => {
        const data = {
            session_id: session.id,
            organisation_id: selected_backup.organisationId,
            kb_id: selected_backup.kbId,
            backup_id: selected_backup.backupId
        }
        dispatch(deleteBackup(data))
        dispatch(closeBackupDeleteMessage());
    }

    if (!show_delete_backup_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span
                                    className="label-wide">Are you sure you want to remove backup "{selected_backup.name}" ({Api.unixTimeConvert(selected_backup.backupId)})?</span>
                            </div>
                            <div className="control-row">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4">Cancel</button>
                                <button onClick={handleDelete} type="button" className="btn btn-danger px-4y">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
