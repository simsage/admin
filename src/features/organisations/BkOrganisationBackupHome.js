import {useSelector} from "react-redux";
import React from "react";

export default function BkOrganisationBackupHome() {
    const organisation_backup_list = useSelector((state) => state.organisationReducer.organisation_backup_list)


    function getBackupList() {
        return organisation_backup_list;
    }


    function handleDownloadBackup(backup_id){
        console.log("handleDownloadBackup")
        return "handleDownloadBackup"
    }

    function handleDeleteBackup(backup_id){
        console.log("handleDeleteBackup")
        return "handleDeleteBackup"
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

                                <td className="pt-3 px-4 pb-3"
                                    title={item.enabled ? item.name + " is enabled" : item.name + " is disabled"}>
                                    {item.enabled ? "yes" : "no"}
                                </td>

                                <td className="pt-3 px-4 pb-3" title={"organisation " + item.name}>
                                    {item.name}
                                </td>

                                <td>
                                    <button className={"btn btn-outline-primary"}
                                            title="download backup"
                                            onClick={() => handleDownloadBackup(item.id)}>Download Backup
                                    </button>

                                    <button className={"btn btn-outline-primary"}
                                            title="delete backup"
                                            onClick={() => handleDeleteBackup(item.id)}>Delete Backup
                                    </button>

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