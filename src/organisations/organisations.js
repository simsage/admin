import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import Comms from "../common/comms";
import {Home} from "../home";
import {OrganisationEdit} from "./organisation-edit"
import Grid from "@material-ui/core/Grid";
import RestoreUpload from "../common/restore-upload";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";


const styles = {
    pageWidth: {
        width: '900px'
    },
    label: {
        color: '#555',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    editBox: {
        width: '500px',
        marginBottom: '15px',
    },
    roleBlock: {
        padding: '5px',
        marginTop: '20px',
        float: 'left',
        width: '400px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    roleLabel: {
        fontSize: '0.8em',
        color: '#aaa',
    },
    roleArea: {
        padding: '20px',
    },
    roleChip: {
        margin: '2px',
    },
    addImage: {
        width: '25px',
    },
    textFieldBox: {
        float: 'left',
    },
    imageBox: {
        float: 'left',
    },
    imageSize: {
        marginTop: '20px',
        width: '20px',
    },
    dlImageSize: {
        width: '24px',
    },

    searchBox: {
        boxShadow: 'none',
    },
    floatLeftLabel: {
        float: 'left',
        marginRight: '6px',
        marginTop: '4px',
        fontSize: '0.9em',
        fontWeight: '500',
    },
    floatLeft: {
        float: 'left',
    },
    searchFloatLeft: {
        float: 'left',
    },
    findBox: {
        padding: '10px',
        marginBottom: '5px',
        float: 'right',
    },
    search: {
        marginTop: '2px',
        marginLeft: '15px',
        width: '18px',
        color: '#000',
    },
    copiedStyle: {
        fontSize: '10px',
        marginLeft: '25px',
        marginTop: '-22px',
        position: 'absolute',
        float: 'left',
        zIndex: '99',
    },
    organisationIdLabel: {width: '170px', float: 'left', height: '24px'},
    copyImageSpan: {float: 'left', marginTop: '-5px', marginLeft: '10px'},
    clipboardImage: {width: '24px', height: '24px;'},
};


export class Organisations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            edit_organisation: false,

            edit_organisation_id: "",
            edit_name: "",
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
                             edit_organisation_id: "",
                             edit_name: "",
                             max_tpm: 0,
                             analytics_window_size_in_months: 12,
                             enabled: true,
                             bot_enabled: true,
                             analytics_enabled: true,
                             operator_enabled: true,
                             language_enabled: true,
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
                                 max_tpm: Api.defined(organisation.maxTransactionsPerMonth) ? organisation.maxTransactionsPerMonth : 0,
                                 analytics_window_size_in_months: Api.defined(organisation.analyticsWindowInMonths) ? organisation.analyticsWindowInMonths : 12,
                                 enabled: Api.defined(organisation.enabled) ? organisation.enabled : true,
                                 bot_enabled: Api.defined(organisation.botEnabled) ? organisation.botEnabled : true,
                                 analytics_enabled: Api.defined(organisation.analyticsEnabled) ? organisation.analyticsEnabled : true,
                                 operator_enabled: Api.defined(organisation.operatorEnabled) ? organisation.operatorEnabled : true,
                                 language_enabled: Api.defined(organisation.languageEnabled) ? organisation.languageEnabled : true,
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
                    id: Api.defined(organisation.id) ? organisation.id : '', name: organisation.name,
                    maxTransactionsPerMonth: organisation.max_tpm,
                    analyticsWindowInMonths: organisation.analytics_window_size_in_months, enabled: organisation.enabled,
                    botEnabled: organisation.bot_enabled, analyticsEnabled: organisation.analytics_enabled,
                    operatorEnabled: organisation.operator_enabled, languageEnabled: organisation.language_enabled,
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
        window.open(Comms.get_backup_url(this.props.selected_organisation_id, 'all'), '_blank');
    }
    backup(organisationId) {
        window.open(Comms.get_backup_url(organisationId, 'specific'), '_blank');
    }
    restore(data) {
        if (data && data.data && data.data.length > 0) {
            this.props.restore(data.data);
        }
    }
    downloadHtml(html, organisation) {
        window.open(Comms.get_html_url(html, organisation.id), '_blank');
    }
    viewIds(organisation) {
        this.setState({view_organisation_id: true, organisation: organisation});
    }
    startCopiedVisible(org_id) {
        this.setState({copied_visible: org_id});
        window.setTimeout(() => { this.setState({copied_visible: ""})}, 1000);
    }
    render() {
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        return (
            <div>
                <OrganisationEdit open={this.state.edit_organisation}
                                    id={this.state.id}
                                    name={this.state.name}
                                    enabled={this.state.enabled}
                                    onError={(title, err) => this.props.showError(title, err)}
                                    onSave={(data) => this.save(data)} />

                <div style={styles.searchBox}>
                    <Grid item xs={12}>
                        <div style={styles.findBox}>
                            <div style={styles.floatLeftLabel}>filter</div>
                            <div style={styles.searchFloatLeft}>
                                <input type="text" value={this.props.user_filter} autoFocus={true} style={styles.text}
                                       onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                       onChange={(event) => {
                                           this.props.setOrganisationFilter(event.target.value)
                                       }}/>
                            </div>
                            <div style={styles.floatLeft}>
                                <img style={styles.search}
                                     onClick={() => this.props.getOrganisationList()}
                                     src="../images/dark-magnifying-glass.svg" title="filter" alt="filter"/>
                            </div>
                        </div>
                    </Grid>
                </div>

                <br clear="both" />

                <Paper style={styles.pageWidth}>
                    <Table>
                        <TableHead>
                            <TableRow style={styles.tableHeaderStyle}>
                                <TableCell style={styles.tableHeaderStyle}>organisation</TableCell>
                                <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.getOrganisations().map((organisation) => {
                                    return (
                                        <TableRow key={organisation.id}>
                                            <TableCell>
                                                <div style={styles.label}>{organisation.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div style={styles.linkButton}
                                                     onClick={() => { this.viewIds(organisation); }}>
                                                    <img src="../images/id.svg" style={styles.dlImageSize}
                                                         title="view knowledge base ids" alt="ids"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.editOrganisation(organisation)}>
                                                    <img src="../images/edit.svg" style={styles.dlImageSize} title="edit organisation" alt="edit"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.deleteOrganisationAsk(organisation)}>
                                                    <img src="../images/delete.svg" style={styles.dlImageSize} title="remove organisation" alt="remove"/>
                                                </div>
                                                <div style={styles.linkButton} onClick={() => this.downloadHtml("search", organisation)}>
                                                    <img src="../images/search.svg" style={styles.dlImageSize} title="download this organisation's search interface (html)" alt="download search interface"/>
                                                </div>
                                                {isAdmin &&
                                                <div style={styles.linkButton} onClick={() => this.backup(organisation.id)}>
                                                    <img src="../images/backup.svg" style={styles.dlImageSize} title={"backup this organisation"}
                                                         alt={"backup " + organisation.name} />
                                                </div>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                            <TableRow>
                                <TableCell colSpan={2}>
                                    {isAdmin &&
                                    <div style={styles.imageButton} onClick={() => this.backupAll()}><img
                                        style={styles.addImage} src="../images/backup.svg"
                                        title="backup all organisations"
                                        alt="backup all organisations"/></div>
                                    }
                                    <div style={styles.imageButton} onClick={() => this.addNewOrganisation()}><img
                                        style={styles.addImage} src="../images/add.svg" title="add new organisation"
                                        alt="add new organisation"/></div>
                                    <br />
                                    {isAdmin &&
                                    <RestoreUpload doUpload={(data) => this.restore(data)}
                                                   organisationId={this.props.selected_organisation_id}
                                                   onError={(err) => this.props.setError("Error", err)} />
                                    }
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.props.organisation_list.length}
                        rowsPerPage={this.state.page_size}
                        page={this.state.page}
                        backIconButtonProps={{
                            'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'Next Page',
                        }}
                        onChangePage={(event, page) => this.changePage(page)}
                        onChangeRowsPerPage={(event) => this.changePageSize(event.target.value)}
                    />

                </Paper>


                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.view_organisation_id}
                        disableBackdropClick={true}
                        disableEscapeKeyDown={true}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={() => this.setState({view_details: false})} >
                    <DialogTitle>{this.state.organisation != null ? this.state.organisation.name : ""} organisation-id</DialogTitle>
                    <DialogContent>
                        <div>
                            <div style={styles.organisationIdLabel}>
                                organisation id
                            </div>
                            <div style={styles.floatLeft}>{this.state.organisation ? this.state.organisation.id : ""}</div>
                            <span style={styles.copyImageSpan} title={'copy organisation id'}>
                                <img src='../images/clipboard-copy.svg' style={styles.clipboardImage} alt={'copy'}
                                     onClick={() => { navigator.clipboard.writeText(this.state.organisation ? this.state.organisation.id : "");
                                                      this.startCopiedVisible(this.state.organisation.id);
                                     }}/>
                                {this.state.organisation != null && this.state.copied_visible === this.state.organisation.id &&
                                    <div style={styles.copiedStyle}>copied</div>
                                }
                            </span>
                            <br clear='both' />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color="secondary" onClick={() => this.setState({view_organisation_id: false})}>Close</Button>
                    </DialogActions>
                </Dialog>


            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        user: state.appReducer.user,

        organisation_list: state.appReducer.organisation_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Organisations);

