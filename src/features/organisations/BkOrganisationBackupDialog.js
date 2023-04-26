import {useDispatch, useSelector} from "react-redux";
import {backupOrganisation, closeBackupForm} from "./organisationSlice";

export default function BkOrganisationBackupDialog(props) {

    const dispatch = useDispatch();

    const show_backup_form = useSelector((state) => state.organisationReducer.show_backup_form)
    const backup_organisation_id = useSelector((state) => state.organisationReducer.backup_organisation_id)
    const session = useSelector((state) => state.authReducer.session)

    //handle form close or cancel
    const handleClose = () => {
        console.log("BkOrganisationBackupDialog handleClose")
        dispatch(closeBackupForm());
    }

    const data = {
        session_id:session.id,
        organisation_id:backup_organisation_id
    }

    const handleBackup = () => {
        console.log("handleBackup");
        dispatch(backupOrganisation(data))
        dispatch(closeBackupForm());
    }


    if (!show_backup_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span
                                    className="label-wide">Are you sure you want to backup {backup_organisation_id}?</span>
                            </div>
                            <div className="control-row">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <button onClick={handleBackup} type="button" className="btn btn-primary px-4">Backup</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
