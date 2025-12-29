import {useDispatch, useSelector} from "react-redux";
import React from "react";
import Api, {convert_gmt_to_local} from "../../common/api";
import {showDeleteBackupForm, showDownloadBackupForm, showRestoreBackupForm} from "./organisationSlice";

export default function BkOrganisationBackupHome() {
    const organisation_backup_list = useSelector((state) => state.organisationReducer.organisation_backup_list)

    const dispatch = useDispatch();
    const theme = useSelector((state) => state.homeReducer.theme);

    function getBackupList() {
        return organisation_backup_list;
    }

    function handleDownloadBackup(backup) {
        dispatch(showDownloadBackupForm({show_form: true, selected_backup:backup}))
    }

    function handleDeleteBackup(backup) {
        dispatch(showDeleteBackupForm({show_form: true, selected_backup:backup}))
    }

    function handleRestoreBackup(backup) {
        dispatch(showRestoreBackupForm({show_form: true, selected_backup:backup}))
    }

    const type_to_string = (backup) => {
        if (backup.backupLevel && backup.backupLevel.split(",").length === 10) {
            return "everything (full backup)"
        }
        if (backup.backupLevel && backup.backupLevel.length > 40) {
            return backup.backupLevel.substring(0, 40) +  " ..."
        }
        return backup.backupLevel
    }

    const type_to_full_string = (backup) => {
        return "this backup contains: " + backup.backupLevel.replace(",", ", ")
    }

    if (!organisation_backup_list.length) {
        return (
            <div className="mt-4">No backups available</div>
        )
    }

    return (
        <div className="mt-4">

            <table className={theme === "light" ? "table" : "table-dark"}>
                <thead>
                <tr className="secondary-table-header">
                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Backup date/time</td>
                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>KnowledgeBase</td>
                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Contains</td>
                    <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}></td>
                </tr>
                </thead>

                <tbody>
                {organisation_backup_list.length &&
                    getBackupList().map((item) => {
                        const name = item.knowledgeBaseName ? item.knowledgeBaseName : item.kbId
                        return (

                            <tr key={item.id}>

                                <td className="pt-3 px-4 pb-3">
                                    {Api.unixTimeConvert(convert_gmt_to_local(item.backupId))}
                                </td>

                                <td className="pt-3 px-4 pb-3" title={"knowledge-base " + name}>
                                    {name}
                                </td>

                                <td className="pt-3 px-4 pb-3" title={type_to_full_string(item)}>
                                    {type_to_string(item)}
                                </td>

                                <td>
                                    <div className="d-flex  justify-content-end">
                                        &nbsp;
                                        <button className={"btn text-primary btn-sm"}
                                                title="download backup"
                                                onClick={() => handleDownloadBackup(item)}>Download
                                        </button>
                                        &nbsp;

                                        <button className={"btn text-danger btn-sm"}
                                                title="restore this backup"
                                                onClick={() => handleRestoreBackup(item)}>Restore
                                        </button>

                                        <button className={"btn text-danger btn-sm"}
                                                title="delete backup"
                                                onClick={() => handleDeleteBackup(item)}>Delete
                                        </button>

                                    </div>
                                </td>
                            </tr>

                        );
                    })
                }

                </tbody>
            </table>

        </div>
    );

}