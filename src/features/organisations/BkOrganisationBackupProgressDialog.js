import {useDispatch, useSelector} from "react-redux";
import {backupOrganisation, closeBackupForm, closeBackupProgressMessage} from "./organisationSlice";

export default function BkOrganisationBackupProgressDialog(props) {

    const dispatch = useDispatch();

    const show_backup_progress_message = useSelector((state) => state.organisationReducer.show_backup_progress_message)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupProgressMessage());
    }

    if (!show_backup_progress_message)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Backup In Progress</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span
                                    className="label-wide">We're now backing up this organisation, please refresh and check the table below for progress.</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" className="btn btn-primary">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
