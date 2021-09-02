import React, {Component} from 'react';

import {DomainDialog} from './domain_dialog'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/domains.css';
import {Pagination} from "../common/pagination";

const empty_domain= {domainId: '', domainName: '', userName: '', password: '', serverIp: '', basePath: '', portNumber: 389, sslOn: false, schedule: '' };


export class Domains extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // pagination
            page_size: 5,
            page: 0,
            // dialog
            open: false,
            title: 'Create new domain',
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
        this.setState({open: true, selected_domain: empty_domain, title: 'Create new domain'});
    }
    onUpdate(domain) {
        this.setState({selected_domain: domain});
    }
    editDomain(domain) {
        if (domain) {
            this.setState({open: true, selected_domain: { ...empty_domain, ...domain}, title: 'Edit domain'});
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
        const theme = this.props.theme;
        return (
            <div>
                <DomainDialog
                    open={this.state.open}
                    title={this.state.title}
                    theme={theme}
                    organisation_id={this.props.selected_organisation_id}
                    kb_id={this.props.selected_knowledgebase_id}
                    edge_device_list={this.props.edge_device_list}
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

                    <div className="page-width">
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th scope="col" className='table-header'>name</th>
                                    <th scope="col" className='table-header'>path</th>
                                    <th scope="col" className='table-header'>objects</th>
                                    <th scope="col" className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody className={theme === 'light' ? "table-light" : "table-dark"}>
                                {
                                    this.getDomains().map((domain) => {
                                        return (
                                            <tr key={domain.domainId}>
                                                <td>
                                                    <div className="label">{domain.domainName}</div>
                                                </td>
                                                <td>
                                                    <div className="label">{domain.basePath}</div>
                                                </td>
                                                <td>
                                                    <div className="label">{domain.numObjects}</div>
                                                </td>
                                                <td>
                                                    <div className="label-button" onClick={() => this.editDomain(domain)}>
                                                        <img src="../images/edit.svg" className="download-image" title="edit domain" alt="edit"/>
                                                    </div>
                                                    <div className="label-button" onClick={() => this.deleteDomainAsk(domain)}>
                                                        <img src="../images/delete.svg" className="download-image" title="remove domain" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td/>
                                    <td/>
                                    <td>
                                        {this.props.selected_organisation_id.length > 0 && this.props.selected_knowledgebase_id.length > 0 &&
                                        <div className="image-button" onClick={() => this.addNewDomain()}><img
                                            className="add-image" src="../images/add.svg" title="add new domain"
                                            alt="add new domain"/></div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Pagination
                            theme={theme}
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
                            onChangePage={(page) => this.changePage(page)}
                            onChangeRowsPerPage={(rows) => this.changePageSize(rows)}
                        />

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

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        edge_device_list: state.appReducer.edge_device_list,
        domain_list: state.appReducer.domain_list,
        theme: state.appReducer.theme,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Domains);
