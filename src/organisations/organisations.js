import React from 'react';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Home} from "../home";
import {OrganisationEdit} from "./organisation-edit"
import {Pagination} from "../common/pagination";

import '../css/organisations.css';
import BackupDialog from "../common/backup-dialog";


export class Organisations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_organisation: false,

            edit_organisation_id: "",
            name: "",
            max_tpm: 0,
            analytics_window_size_in_months: 12,
            enabled: true,
            bot_enabled: true,
            analytics_enabled: true,
            operator_enabled: true,
            language_enabled: true,

            // organisation id view dialog
            copied_visible: '',
            view_organisation_id: false,

            backup_organisation_id: "",
            callback: null,
            title: "",
            message: "",

            organisation: null,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    addNewOrganisation() {
        this.setState({edit_organisation: true,
                             organisation: null,
                             id: "",
                             name: "",
                             enabled: true,
        })
    }
    editOrganisation(organisation) {
        if (organisation) {
            this.setState({edit_organisation: true,
                                 organisation: organisation,
                                 id: organisation.id,
                                 name: organisation.name,
                                 enabled: Api.defined(organisation.enabled) ? organisation.enabled : true,
            })
        }
    }
    deleteOrganisationAsk(organisation) {
        if (organisation && this.props.openDialog) {
            this.props.openDialog("are you sure you want to remove \"" + organisation.name + "\" ?",
                                  "Remove Organisation", (action) => { this.deleteOrganisation(action) });
            this.setState({organisation: organisation})
        }
    }
    deleteOrganisation(action) {
        if (action) {
            this.props.deleteOrganisation(this.state.organisation.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    changePage(page) {
        this.props.setOrganisationPage(page);
    }
    changePageSize(page_size) {
        this.props.setOrganisationPageSize(page_size);
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getOrganisationList();
        }
    }
    getOrganisations() {
        const paginated_list = [];
        const first = this.props.organisation_page * this.props.organisation_page_size;
        const last = first + parseInt(this.props.organisation_page_size);
        for (const i in this.props.organisation_list) {
            if (i >= first && i < last) {
                if (this.props.organisation_list.hasOwnProperty(i))
                    paginated_list.push(this.props.organisation_list[i]);
            }
        }
        return paginated_list;
    }
    save(organisation) {
        if (organisation) {
            if (organisation.name.length > 0) {
                this.props.updateOrganisation({
                    id: Api.defined(organisation.id) ? organisation.id : '',
                    name: organisation.name,
                    enabled: organisation.enabled,
                });
                this.setState({edit_organisation: false, organisation: null});
            } else {
                this.props.setError("Incomplete Data", "Please complete all fields.  Must have a name.");
            }
        } else {
            this.setState({edit_organisation: false, organisation: null});
        }
    }
    backupAsk(backup_organisation_id) {
        if (backup_organisation_id) {
            this.setState({message: "are you sure you want to back up organisation: " + backup_organisation_id + "?",
                                 title: "Backup Organisation",
                                 callback: (action, include) => this.backup(action, include),
                                 backup_organisation_id: backup_organisation_id});
        }
    }
    backup(action, include) {
        if (action && this.state.backup_organisation_id) {
            this.props.binaryBackupToFile(this.state.backup_organisation_id, include);
        }
        this.setState({callback: null, backup_organisation_id: ""});
    }
    restore() {
        const filename = window.prompt("Filename or organisationId on NFS node to restore");
        if (filename && filename.trim().length > 0)
            this.props.restoreBackupFromFile(filename.trim());
    }
    viewIds(organisation) {
        this.setState({view_organisation_id: true, organisation: organisation});
    }
    startCopiedVisible(org_id) {
        this.setState({copied_visible: org_id});
        window.setTimeout(() => { this.setState({copied_visible: ""})}, 1000);
    }
    render() {
        const theme = this.props.theme;
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        return (
            <div className="organisation-display">

                <BackupDialog
                    open={this.state.callback !== null}
                    message={this.state.message}
                    title={this.state.title}
                    callback={(action, include_binaries) => this.state.callback(action, include_binaries)}
                />

                <OrganisationEdit open={this.state.edit_organisation}
                                  id={this.state.id}
                                  theme={theme}
                                  name={this.state.name}
                                  enabled={this.state.enabled}
                                  onError={(title, err) => this.props.showError(title, err)}
                                  onSave={(data) => this.save(data)} />

                <div className="filter-find-box">
                    <span className="filter-label">filter</span>
                    <span className="filter-find-text">
                            <input type="text" value={this.props.user_filter} autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setOrganisationFilter(event.target.value)
                                   }}/>
                        </span>
                    <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getOrganisationList()}
                                 src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                        </span>
                </div>

                <br clear="both" />

                <div>
                    <table className="table">
                        <thead>
                            <tr className='table-header'>
                                <th className='table-header table-width-70'>organisation</th>
                                <th className='table-header'>actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.getOrganisations().map((organisation) => {
                                    return (
                                        <tr key={organisation.id}>
                                            <td>
                                                <div className="org-label">{organisation.name}</div>
                                            </td>
                                            <td>
                                                <div className="linkButton"
                                                     onClick={() => { this.viewIds(organisation); }}>
                                                    <img src="../images/id.svg" className="image-size"
                                                         title="view knowledge base ids" alt="ids"/>
                                                </div>
                                                <div className="linkButton" onClick={() => this.editOrganisation(organisation)}>
                                                    <img src="../images/edit.svg" className="image-size" title="edit organisation" alt="edit"/>
                                                </div>
                                                <div className="linkButton" onClick={() => this.deleteOrganisationAsk(organisation)}>
                                                    <img src="../images/delete.svg" className="image-size" title="remove organisation" alt="remove"/>
                                                </div>
                                                {isAdmin &&
                                                <div className="linkButton" onClick={() => this.backupAsk(organisation.id)}>
                                                    <img src="../images/backup.svg" className="image-size" title="backup this organisation"
                                                         alt={"backup " + organisation.name} />
                                                </div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            <tr>
                                <td colSpan={2}>
                                    <div className="imageButton" onClick={() => this.addNewOrganisation()}><img
                                        className="addImage" src="../images/add.svg" title="add new organisation"
                                        alt="add new organisation"/></div>
                                    <br />
                                    {isAdmin &&
                                        <div className="linkButton" onClick={() => this.restore()}>
                                            <img src="../images/backup.svg" className="image-size" title="restore an organisation from file" alt="restore" />
                                        </div>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.organisation_list.length}
                        rowsPerPage={this.props.organisation_page_size}
                        page={this.props.organisation_page}
                        onChangePage={(page) => this.changePage(page)}
                        onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                    />

                </div>


                {
                    this.state.view_organisation_id &&
                    <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                        <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                            <div className="modal-content organisation-id-modal shadow p-3 mb-5 bg-white rounded">
                                <div
                                    className="modal-header">{this.state.organisation != null ? this.state.organisation.name : ""} organisation-id
                                </div>
                                <div className="modal-body">
                                    <div>
                                        <div className="organisationIdLabel">
                                            organisation id
                                        </div>
                                        <div
                                            className="floatLeft">{this.state.organisation ? this.state.organisation.id : ""}</div>
                                        <span className="copyImageSpan" title={'copy organisation id'}>
                                            <img
                                                src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                className="clipboardImage" alt={'copy'}
                                                onClick={() => {
                                                    if (Api.writeToClipboard(this.state.organisation ? this.state.organisation.id : ""))
                                                        this.startCopiedVisible(this.state.organisation.id);
                                                }}/>
                                            {this.state.organisation != null && this.state.copied_visible === this.state.organisation.id &&
                                            <div className="copiedStyle">copied</div>
                                            }
                                        </span>
                                        <br clear='both'/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary btn-block"
                                            onClick={() => this.setState({view_organisation_id: false})}>Close
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                }


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
        organisation_list: state.appReducer.organisation_list,
        organisation_page: state.appReducer.organisation_page,
        organisation_page_size: state.appReducer.organisation_page_size,
        session: state.appReducer.session,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Organisations);

