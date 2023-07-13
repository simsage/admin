import {useDispatch, useSelector} from "react-redux";
import React from "react";
import Api from "../../common/api";
import {showDeleteBackupForm, showDownloadBackupForm} from "./organisationSlice";

export default function BkOrganisationBackupHome() {
    const organisation_backup_list = useSelector((state) => state.organisationReducer.organisation_backup_list)

    const dispatch = useDispatch();

    function getBackupList() {
        return organisation_backup_list;
    }

    function handleDownloadBackup(backup) {
        dispatch(showDownloadBackupForm({show_form: true, selected_backup:backup}))
    }

    function handleDeleteBackup(backup) {
        dispatch(showDeleteBackupForm({show_form: true, selected_backup:backup}))
    }

    if (!organisation_backup_list.length)
        return (<div>
            No backups available
        </div>);
    return (
        <div>



            <table className="table">
                <thead>
                <tr className="secondary-table-header">
                    <td className="small text-black-50 px-4">Backup date/time</td>
                    <td className="small text-black-50 px-4">Organisation</td>
                    <td className="small text-black-50 px-4"></td>
                </tr>
                </thead>

                <tbody>
                {organisation_backup_list.length &&
                    getBackupList().map((item) => {
                        return (

                            <tr key={item.id}>

                                <td className="pt-3 px-4 pb-3">
                                    {Api.unixTimeConvert(item.backupId)}
                                </td>

                                <td className="pt-3 px-4 pb-3" title={"organisation " + item.name}>
                                    {item.name}
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