import {useDispatch, useSelector} from "react-redux";
import {
    closeBackupRestoreMessage, restoreBackup
} from "./organisationSlice";
import Api from "../../common/api";
import {backup_item_list} from "./BkOrganisationBackupDialog";
import {useEffect, useState} from "react";

export default function BkOrganisationBackupRestoreDialog() {

    const dispatch = useDispatch();

    const show_restore_backup_form = useSelector((state) => state.organisationReducer.show_restore_backup_form)
    const selected_backup = useSelector((state) => state.organisationReducer.selected_backup)
    const session = useSelector((state) => state.authReducer.session)

    const [backup_level, setBackupLevel] = useState(null)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupRestoreMessage());
    }

    const handleRestore = () => {
        const backup_list = []
        for (const key in backup_level) {
            if (!backup_level.hasOwnProperty(key)) continue
            if (backup_level[key] !== true) continue
            backup_list.push(key)
        }
        const data = {
            session_id:session.id,
            organisation_id:selected_backup.organisationId,
            backup_id:selected_backup.backupId,
            backup_level: backup_list
        }
        dispatch(restoreBackup(data))
        dispatch(closeBackupRestoreMessage());
    }

    const changeBackupLevel = (name, value) => {
        if (backup_level) {
            let copy = JSON.parse(JSON.stringify(backup_level))
            copy[name] = value
            setBackupLevel(copy)
        }
    }

    useEffect(() => {
        if (selected_backup && selected_backup.backupLevel) {
            const key_list = selected_backup.backupLevel.split(",")
            const key_set = {}
            for (const key of key_list) {
                key_set[key] = true
            }
            setBackupLevel(key_set)
        }
    }, [selected_backup]);

    if (!show_restore_backup_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-1">
                                <span
                                    className="label-wide">Are you sure you want to restore from backup</span>
                            </div>
                            <div className="control-row mb-4">
                                <span
                                    className="label-wide">"{selected_backup.knowledgeBaseName}" ({Api.unixTimeConvert(selected_backup.backupId)})?</span>
                            </div>

                            <div className="row btn-group mt-4 mb-4" role="group"
                                 aria-label="Basic radio toggle button group">
                            {backup_item_list.map((item, i) => {
                                return (
                                    <div className="col-4 form-check form-switch">
                                        <label key={i} title={item.help} className="w-100 btn btn-sm">
                                            <input className="form-check-input me-1" type="checkbox"
                                                   value={item.value}
                                                   checked={backup_level && !!backup_level[item.value]}
                                                   onChange={(e) => changeBackupLevel(item.value, e.target.checked)}
                                            />
                                            {item.label}
                                        </label>
                                    </div>
                                )
                            })}
                            </div>



                            <div className="control-row mb-1 fw-bolder">
                                <span
                                    className="label-wide">this will overwrite any objects / files / documents</span>
                            </div>
                            <div className="control-row mb-4 fw-bolder">
                                <span
                                    className="label-wide">in this knowledge-base!</span>
                            </div>
                            <div className="control-row">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4">Cancel
                                </button>
                                <button onClick={handleRestore} type="button" className="btn btn-danger px-4y">Restore
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
