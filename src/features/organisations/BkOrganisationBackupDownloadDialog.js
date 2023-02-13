import {useDispatch, useSelector} from "react-redux";
import {
    closeBackupDeleteMessage, closeBackupDownloadMessage,
    deleteBackup, downloadBackup,
} from "./organisationSlice";
import Api from "../../common/api";

export default function BkOrganisationBackupDownloadDialog(props) {

    const dispatch = useDispatch();

    const show_download_backup_form = useSelector((state) => state.organisationReducer.show_download_backup_form)
    const selected_backup = useSelector((state) => state.organisationReducer.selected_backup)
    const session = useSelector((state) => state.authReducer.session)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupDownloadMessage());
    }

    const handleDownload = () => {
        console.log("selected_backup", selected_backup.name)
        console.log("selected_backup", selected_backup.backupId)
        dispatch(downloadBackup({session:session, organisation_id: selected_backup.organisationId, backup_id:selected_backup.backupId}))
        dispatch(closeBackupDownloadMessage());
    }


    const handleDelete = () => {

        const data = {
            session_id:session.id,
            organisation_id:selected_backup.organisationId,
            backup_id:selected_backup.backupId
        }
        console.log("data",data)
        dispatch(deleteBackup(data))
        dispatch(closeBackupDeleteMessage());
    }

    if (!show_download_backup_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Download Backup
                                - {selected_backup.name}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span
                                    className="label-wide">Are you sure you want to download backup "{selected_backup.name}" ({Api.unixTimeConvert(selected_backup.backupId)})?</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" className="btn btn-primary">Cancel</button>
                            <button onClick={handleDownload} type="button" className="btn btn-primary">Download</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
