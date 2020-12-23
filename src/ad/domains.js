import React, {Component} from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

import {DomainDialog} from './domain_dialog'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const empty_domain= {domainId: '', domainName: '', userName: '', password: '', serverIp: '', basePath: '', portNumber: 389, sslOn: false, schedule: '' };

const styles = {
    pageWidth: {
        width: '900px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    addImage: {
        width: '25px',
        cursor: 'pointer',
        color: "green",
    },
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '40px',
    },
    lhs: {
        float: 'left',
        width: '150px',
        marginTop: '-10px',
        color: '#aaa',
    },
    rhs: {
        float: 'left',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    label: {
        marginTop: '20px',
        color: '#555',
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
    download: {
        cursor: 'pointer',
        fontSize: '0.9em',
        fontWeight: '600',
        height: '24px',
    },
    downloadType: {
        fontSize: '0.9em',
        height: '24px',
    },
    downloadImage: {
        width: '24px',
    },
    labelHeader: {
        marginTop: '20px',
        marginBottom: '5px',
        fontSize: '0.8em',
    },
};

export class Domains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // pagination
            page_size: 5,
            page: 0,
            // dialog
            open: false,
            title: '',
            selected_domain: {},
            domain_ask: null,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    changePage(page) {
        this.setState({page: page});
    }
    changePageSize(page_size) {
        this.setState({page_size: page_size});
    }
    getDomains() {
        const paginated_list = [];
        const first = this.state.page * this.state.page_size;
        const last = first + this.state.page_size;
        for (const i in this.props.domain_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.domain_list[i]);
            }
        }
        return paginated_list;
    }
    addNewDomain() {
        this.setState({open: true, selected_domain: empty_domain, title: 'Create New Domain'});
    }
    onUpdate(domain) {
        this.setState({selected_domain: domain});
    }
    editDomain(domain) {
        if (domain) {
            this.setState({open: true, selected_domain: { ...empty_domain, ...domain}, title: 'Edit Domain'});
        }
    }
    deleteDomainAsk(domain) {
        this.setState({domain_ask: domain});
        this.props.openDialog("are you sure you want to remove the domain named <b>" + domain.domainName + "</b>?",
            "Remove Domain", (action) => { this.deleteDomain(action) });
    }
    deleteDomain(action) {
        if (action && this.state.domain_ask && this.state.domain_ask.domainId) {
            this.props.deleteDomain(this.state.domain_ask.domainId);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    saveDomain(domain) {
        if (domain) {
            domain.organisationId = this.props.selected_organisation_id;
            domain.kbId = this.props.selected_knowledgebase_id;
            this.props.updateDomain(domain);
        }
        this.setState({open: false});
    }
    testDomain(domain) {
        if (domain) {
            domain.organisationId = this.props.selected_organisation_id;
            domain.kbId = this.props.selected_knowledgebase_id;
            this.setState({selected_domain: domain});
            this.props.testDomain(domain);
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        return (
            <div>
                <DomainDialog
                    open={this.state.open}
                    title={this.state.title}
                    organisation_id={this.props.selected_organisation_id}
                    kb_id={this.props.selected_knowledgebase_id}
                    onSave={(domain) => this.saveDomain(domain)}
                    onTest={(domain) => this.testDomain(domain)}
                    onUpdate={(domain) => this.onUpdate(domain)}
                    onError={(title, errStr) => this.props.setError(title, errStr)}
                    error_title={this.props.error_title}
                    error_msg={this.props.error}
                    domain={this.state.selected_domain}
                />

                {
                    this.isVisible() &&

                    <Paper style={styles.pageWidth}>
                        <Table>
                            <TableHead>
                                <TableRow style={styles.tableHeaderStyle}>
                                    <TableCell style={styles.tableHeaderStyle}>name</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>path</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>objects</TableCell>
                                    <TableCell style={styles.tableHeaderStyle}>actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    this.getDomains().map((domain) => {
                                        return (
                                            <TableRow key={domain.domainId}>
                                                <TableCell>
                                                    <div style={styles.label}>{domain.domainName}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{domain.basePath}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.label}>{domain.numObjects}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div style={styles.linkButton} onClick={() => this.editDomain(domain)}>
                                                        <img src="../images/edit.svg" style={styles.downloadImage} title="edit domain" alt="edit"/>
                                                    </div>
                                                    <div style={styles.linkButton} onClick={() => this.deleteDomainAsk(domain)}>
                                                        <img src="../images/delete.svg" style={styles.downloadImage} title="remove domain" alt="remove"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                }
                                <TableRow>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell/>
                                    <TableCell>
                                        {this.props.selected_organisation_id.length > 0 && this.props.selected_knowledgebase_id.length > 0 &&
                                        <div style={styles.imageButton} onClick={() => this.addNewDomain()}><img
                                            style={styles.addImage} src="../images/add.svg" title="add new domain"
                                            alt="add new domain"/></div>
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={this.props.domain_list.length}
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
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        domain_list: state.appReducer.domain_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Domains);
