import {useDispatch, useSelector} from "react-redux";
import {
    closeBackupDownloadMessage,
    downloadBackup,
} from "./organisationSlice";
import Api from "../../common/api";
import {useEffect} from "react";

export default function BkOrganisationBackupDownloadDialog() {

    const dispatch = useDispatch();

    const show_download_backup_form = useSelector((state) => state.organisationReducer.show_download_backup_form)
    const selected_backup = useSelector((state) => state.organisationReducer.selected_backup)
    const session = useSelector((state) => state.authReducer.session)
    const downloaded_backup = useSelector((state) => state.organisationReducer.downloaded_backup)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupDownloadMessage());
    }

    const handleDownload = () => {
        dispatch(downloadBackup({session:session, organisation_id: selected_backup.organisationId, backup_id:selected_backup.backupId}))
    }

    useEffect(() => {
        if (downloaded_backup && downloaded_backup.backupId && downloaded_backup.data){
            let element = document.createElement('a');
            // let dateStr = Api.unixTimeForFilename(downloaded_backup.backupId);
            let dateStr = 'org'
            const filename = "backup-" +  dateStr + ".txt"

            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(downloaded_backup.data));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);

            dispatch(closeBackupDownloadMessage());
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [downloaded_backup])


    if (!show_download_backup_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span
                                    className="label-wide">Are you sure you want to download backup "{selected_backup.name}" ({Api.unixTimeConvert(selected_backup.backupId)})?</span>
                            </div>
                            <div className="control-row">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4">Cancel</button>
                                <button onClick={handleDownload} type="button" className="btn btn-primary px-4">Download</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
