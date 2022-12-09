import React from 'react';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Home} from "../home";

import '../css/backup.css';
import BackupUpload from "../common/backup-upload";


export class Backups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            backup: null,
        }
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    deleteBackupAsk(backup) {
        if (backup && backup.backupId && this.props.openDialog) {
            this.props.openDialog("are you sure you want to remove backup \"" + backup.name +
                "\" (" + Api.unixTimeConvert(backup.backupId) + ") ?",
                                  "Remove Backup", (action) => { this.deleteBackup(action) });
            this.setState({backup: backup})
        }
    }
    deleteBackup(action) {
        if (action && this.state.backup && this.state.backup.backupId) {
            this.props.deleteBackup(this.state.backup.backupId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    getBackups() {
        const paginated_list = [];
        if (this.props.backup_list) {
            for (const i in this.props.backup_list) {
                if (this.props.backup_list.hasOwnProperty(i))
                    paginated_list.push(this.props.backup_list[i]);
            }
        }
        return paginated_list;
    }
    getBackup(backup) {
        if (backup && backup.backupId) {
            let dateStr = Api.unixTimeForFilename(backup.backupId);
            const filename = "backup-" +  dateStr + ".txt"
            this.props.getBackup(backup.backupId, (backup_response) => {
                if (backup_response && backup_response.data) {
                    var element = document.createElement('a');
                    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(backup_response.data));
                    element.setAttribute('download', filename);
                    element.style.display = 'none';
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            });
        }
    }
    uploadStarted() {
        if (this.props.openDialog && this.props.closeDialog) {
            this.props.openDialog("SimSage has started the restore process.  " +
                "Please check the log files of the auth node to see when this process has finished.",
                "Restoring Backup", (action) => { this.props.closeDialog() });
        }
    }
    restore() {
    }
    render() {
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        return (
            <div className="backup-page">

                <div>
                    <table className="table">
                        <thead>
                            <tr className='secondary-table-header'>
                                <th className='table-header table-width-70'>backup date and time</th>
                                <th className='table-header table-width-70'>organisation name</th>
                                <th className='table-header'>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.getBackups().map((backup) => {
                                    return (
                                        <tr key={backup.backupId}>
                                            <td>
                                                <div className="org-label">{Api.unixTimeConvert(backup.backupId)}</div>
                                            </td>
                                            <td>
                                                <div className="org-label">{backup.name ? backup.name : "full backup" }</div>
                                            </td>
                                            <td>
                                                <div className="action-row">
                                                <span className="linkButton padding-right" onClick={() => this.getBackup(backup)}>
                                                    <img src="../images/download.svg" className="image-size" title="download backup" alt="download"/>
                                                </span>
                                                <span className="linkButton" onClick={() => this.deleteBackupAsk(backup)}>
                                                    <img src="../images/delete.svg" className="image-size" title="remove backup" alt="remove"/>
                                                </span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={3}>
                                    {isAdmin &&
                                        <BackupUpload kbId={this.props.selected_knowledgebase_id}
                                                       organisationId={this.props.selected_organisation_id}
                                                       onUploadDone={() => this.uploadStarted()}
                                                       onError={(errStr) => this.props.setError("Error", errStr)}/>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>


            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        user: state.appReducer.user,
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        backup_list: state.appReducer.backup_list,
        session: state.appReducer.session,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Backups);

