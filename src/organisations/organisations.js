import React from 'react';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Comms from "../common/comms";
import {Home} from "../home";
import {OrganisationEdit} from "./organisation-edit"
import RestoreUpload from "../common/restore-upload";
import {Pagination} from "../common/pagination";

import '../css/organisations.css';


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

            organisation: null,

            // pagination
            page_size: 5,
            page: 0,
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
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
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
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getOrganisationList();
        }
    }
    getOrganisations() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
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
    backupAll() {
        Comms.download_backup(this.props.selected_organisation_id, 'all');
    }
    backup(organisationId) {
        Comms.download_backup(organisationId, 'specific');
    }
    restore(data) {
        if (data && data.data && data.data.length > 0) {
            this.props.restore(data.data);
        }
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
                            <input type="text" value={this.props.user_filter} autoFocus={true} className={theme}
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
                                                <div className="linkButton" onClick={() => this.backup(organisation.id)}>
                                                    <img src="../images/backup.svg" className="image-size" title={"backup this organisation"}
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
                                    {isAdmin &&
                                    <div className="imageButton" onClick={() => this.backupAll()}><img
                                        className="addImage" src="../images/backup.svg"
                                        title="backup all organisations"
                                        alt="backup all organisations"/></div>
                                    }
                                    <div className="imageButton" onClick={() => this.addNewOrganisation()}><img
                                        className="addImage" src="../images/add.svg" title="add new organisation"
                                        alt="add new organisation"/></div>
                                    <br />
                                    {isAdmin &&
                                    <RestoreUpload doUpload={(data) => this.restore(data)}
                                                   organisationId={this.props.selected_organisation_id}
                                                   onError={(err) => this.props.setError("Error", err)} />
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.organisation_list.length}
                        rowsPerPage={this.state.page_size}
                        page={this.state.page}
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
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Organisations);

