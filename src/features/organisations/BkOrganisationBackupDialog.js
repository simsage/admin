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
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Backup Organisation</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span
                                    className="label-wide">Are you sure you want to backup --- {backup_organisation_id}?</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <button onClick={handleBackup} type="button" className="btn btn-primary">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
