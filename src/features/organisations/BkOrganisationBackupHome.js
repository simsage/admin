import {useDispatch, useSelector} from "react-redux";
import React from "react";
import Api from "../../common/api";
import {hasRole} from "../../common/helpers";
import BkOrganisationRestore from "./BkOrganisationRestore";
import {showDeleteBackupForm} from "./organisationSlice";

export default function BkOrganisationBackupHome() {
    const organisation_backup_list = useSelector((state) => state.organisationReducer.organisation_backup_list)

    const user = useSelector((state) => state.authReducer.user);
    const isAdmin = hasRole(user, ['admin']);

    const dispatch = useDispatch();

    function getBackupList() {
        return organisation_backup_list;
    }

    function handleDownloadBackup(backup_id) {
        console.log("handleDownloadBackup")
        return "handleDownloadBackup"
    }

    function handleDeleteBackup(backup_id) {
        console.log("handleDeleteBackup")
        dispatch(showDeleteBackupForm({show_form: true, backup_id:backup_id}))
    }

    console.log("organisation_backup_list", organisation_backup_list.length)
    if (!organisation_backup_list.length)
        return (<div>
            No data BkOrganisationBackupHome
        </div>);
    return (
        <div>
            <table className="table">
                <thead>
                <tr className="secondary-table-header">
                    <th className="table-header table-width-70">backup date and time</th>
                    <th className="table-header table-width-70">organisation name</th>
                    <th className="table-header">actions</th>
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
                                    <button className={"btn btn-outline-primary"}
                                            title="download backup"
                                            onClick={() => handleDownloadBackup(item.id)}>Download Backup
                                    </button>
                                    &nbsp;

                                    <button className={"btn btn-outline-primary"}
                                            title="delete backup"
                                            onClick={() => handleDeleteBackup(item.id)}>Delete Backup
                                    </button>

                                </td>
                            </tr>

                        );
                    })
                }

                {isAdmin &&
                    <div>
                        <BkOrganisationRestore />
                    </div>
                }
                </tbody>
            </table>

        </div>
    );

}