import React, {Component} from 'react';

import {Api} from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Pagination} from "../common/pagination";

import '../css/kb.css';

// document management system indexer default schedule (none)
const defaultDmsIndexSchedule = '';


export class KnowledgeBases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'general',

            edit_knowledgebase: false,
            edit_knowledgebase_id: "",
            knowledgeBase: null,
            optimize_all_indexes: false,

            edit_kb_id: "",
            edit_name: "",
            edit_email: "",
            edit_security_id: "",
            edit_enabled: true,
            edit_max_queries_per_day: "0",
            edit_analytics_window_size_in_months: "0",
            edit_operator_enabled: true,
            edit_capacity_warnings: true,
            edit_created: 0,
            edit_dms_index_schedule: defaultDmsIndexSchedule,

            // view ids
            view_ids: false,
            copied_visible: '',
            kb: null,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    changePage(page) {
        this.props.setKbPage(page);
    }
    changePageSize(page_size) {
        this.props.setKbPageSize(page_size);
    }
    addNewKnowledgeBase() {
        this.setState({edit_knowledgebase: true, knowledgeBase: null,
            edit_knowledgebase_id: "",
            edit_name: "",
            edit_email: "",
            edit_enabled: true,
            edit_max_queries_per_day: "0",
            edit_analytics_window_size_in_months: "0",
            edit_operator_enabled: true,
            edit_capacity_warnings: true,
            edit_created: 0,
            edit_security_id: Api.createGuid(),
            edit_dms_index_schedule: defaultDmsIndexSchedule,
        })
    }
    refreshSecurityId() {
        this.setState({edit_security_id: Api.createGuid()})
    }
    editKnowledgeBase(knowledgeBase) {
        if (knowledgeBase) {
            this.setState({edit_knowledgebase: true, knowledgeBase: knowledgeBase,
                edit_knowledgebase_id: knowledgeBase.kbId,
                edit_name: knowledgeBase.name,
                edit_email: knowledgeBase.email,
                edit_security_id: knowledgeBase.securityId,
                edit_enabled: knowledgeBase.enabled,
                edit_max_queries_per_day: knowledgeBase.maxQueriesPerDay,
                edit_analytics_window_size_in_months: knowledgeBase.analyticsWindowInMonths,
                edit_operator_enabled: knowledgeBase.operatorEnabled,
                edit_capacity_warnings: knowledgeBase.capacityWarnings,
                edit_dms_index_schedule: '', // no longer used
                edit_created: knowledgeBase.created,
            })
        }
    }
    deleteKnowledgeBaseAsk(knowledgeBase) {
        if (knowledgeBase) {
            this.props.openDialog("are you sure you want to remove \"" + knowledgeBase.name + "\" ?", "Remove Knowledge base", (action) => { this.deleteKnowledgeBase(action) });
            this.setState({knowledgeBase: knowledgeBase});
        }
    }
    deleteKnowledgeBase(action) {
        if (action) {
            this.props.deleteKnowledgeBase(this.props.selected_organisation_id, this.state.knowledgeBase.kbId, () => {
                this.props.openDialog("SimSage has started removing this knowledge-base.  This might take some time.",
                                      "Removing Knowledge base", () => {this.props.closeDialog()});
            });
        } else if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    editCancel() {
        this.setState({edit_knowledgebase: false, knowledgeBase: null});
    }
    editOk() {
        if (this.state.edit_name.length > 0) {
            this.props.updateKnowledgeBase(this.props.selected_organisation_id, this.state.edit_knowledgebase_id,
                                           this.state.edit_name, this.state.edit_email, this.state.edit_security_id,
                                           this.state.edit_enabled, this.state.edit_max_queries_per_day,
                                           this.state.edit_analytics_window_size_in_months, this.state.edit_operator_enabled,
                                           this.state.edit_capacity_warnings, this.state.edit_created,
                () => {
                    this.setState({edit_knowledgebase: false, knowledgeBase: null});
                });
        } else {
            this.props.setError("Incomplete Data", "Please complete all fields.");
        }
    }
    viewIds(knowledge_base) {
        this.setState({view_ids: true, kb: knowledge_base});
    }
    getKnowledgeBases() {
        const paginated_list = [];
        const first = this.props.kb_page * this.props.kb_page_size;
        const last = first + parseInt(this.props.kb_page_size);
        for (const i in this.props.knowledge_base_list) {
            if (i >= first && i < last) {
                paginated_list.push(this.props.knowledge_base_list[i]);
            }
        }
        return paginated_list;
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0;
    }
    startCopiedVisible(org_id) {
        this.setState({copied_visible: org_id});
        window.setTimeout(() => { this.setState({copied_visible: ""})}, 1000);
    }
    optimizeIndexesAsk(knowledgeBase, optimize_all_indexes) {
        if (knowledgeBase) {
            const index_text = optimize_all_indexes ? "ALL INDEXES (full optimization)" : "the changed indexes";
            this.props.openDialog("are you sure you want to optimize " + index_text + " for \"" + knowledgeBase.name + "\" ?", "Optimize Knowledge base", (action) => { this.optimizeIndexes(action) });
            this.setState({knowledgeBase: knowledgeBase, optimize_all_indexes: optimize_all_indexes});
        }
    }
    optimizeIndexes(action) {
        if (action) {
            this.props.optimizeIndexes(this.props.selected_organisation_id, this.state.knowledgeBase.kbId,
                                       this.state.optimize_all_indexes);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    render() {
        const theme = this.props.theme;
        return (
                <div className="kb-page">
                    { this.isVisible() &&

                    <div>

                        <div>
                            <table className="table">
                                <thead>
                                    <tr className='table-header'>
                                        <th className='table-header table-width-20'>knowledge base</th>
                                        <th className='table-header table-width-20'>email queries to</th>
                                        <th className='table-header'>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.getKnowledgeBases().map((knowledge_base) => {
                                            return (
                                                <tr key={knowledge_base.kbId}>
                                                    <td>
                                                        <div className="kb-label">{knowledge_base.name}</div>
                                                    </td>
                                                    <td>
                                                        <div className="kb-label">{knowledge_base.email}</div>
                                                    </td>
                                                    <td>
                                                        <div className="link-button"
                                                             onClick={() => this.viewIds(knowledge_base)}>
                                                            <img src="../images/id.svg" className="image-size"
                                                                 title="view knowledge base ids" alt="ids"/>
                                                        </div>
                                                        <div className="link-button"
                                                             onClick={() => this.editKnowledgeBase(knowledge_base)}>
                                                            <img src="../images/edit.svg" className="image-size"
                                                                 title="edit knowledge base" alt="edit"/>
                                                        </div>
                                                        <div className="link-button"
                                                             onClick={() => this.deleteKnowledgeBaseAsk(knowledge_base)}>
                                                            <img src="../images/delete.svg" className="image-size"
                                                                 title="remove knowledge base" alt="remove"/>
                                                        </div>
                                                        <div className="link-button"
                                                                onClick={() => this.optimizeIndexesAsk(knowledge_base, true)}>
                                                            <img src="../images/optimize-indexes.svg" className="image-size"
                                                                 title="optimize indexes" alt="optimize indexes"/>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <td/>
                                        <td/>
                                        <td>
                                            {this.props.selected_organisation_id.length > 0 &&
                                            <div className="kb-image-button" onClick={() => this.addNewKnowledgeBase()}>
                                                <img
                                                    className="image-size" src="../images/add.svg" title="add new user"
                                                    alt="add new user"/></div>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Pagination
                                rowsPerPageOptions={[5, 10, 25]}
                                theme={theme}
                                component="div"
                                count={this.props.knowledge_base_list.length}
                                rowsPerPage={this.props.kb_page_size}
                                page={this.props.kb_page}
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


                        {
                            this.state.edit_knowledgebase &&
                            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                                    <div className="modal-content shadow p-3 mb-5 bg-white rounded kb-height">
                                        <div
                                            className="modal-header">{this.state.edit_knowledgebase_id ? "Edit Knowledge Base" : "Add New Knowledge Base"}</div>
                                        <div className="modal-body">
                                            <div>

                                                <div className="control-row">
                                                    <span className="label-2">name</span>
                                                    <span className="text">
                                                        <input type="text"
                                                               autoFocus={true}
                                                               className="edit-box"
                                                               placeholder="knowledge base name"
                                                               value={this.state.edit_name}
                                                               onChange={(event) => this.setState({edit_name: event.target.value})}
                                                        />
                                                    </span>
                                                </div>

                                                <div className="control-row">
                                                    <span className="label-2">email questions to</span>
                                                    <span className="text">
                                                        <input type="text"
                                                               className="edit-box"
                                                               placeholder="email questions to"
                                                               value={this.state.edit_email}
                                                               onChange={(event) => this.setState({edit_email: event.target.value})}
                                                        />
                                                    </span>
                                                </div>

                                                <div className="control-row">
                                                    <span className="label-2">security id</span>
                                                    <span className="text">
                                                    <input type="text"
                                                           className="sid-box"
                                                           disabled={true}
                                                           placeholder="security id"
                                                           value={this.state.edit_security_id}
                                                           onChange={(event) => this.setState({edit_security_id: event.target.value})}
                                                    />
                                                    </span>
                                                    <img title="generate new security id" alt="refresh"
                                                         src={theme === 'light' ? "../images/refresh.svg" : "../images/refresh-dark.svg"}
                                                         onClick={() => this.refreshSecurityId()}
                                                         className="image-size" />
                                                </div>

                                                <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={this.state.edit_enabled}
                                                               onChange={(event) => {
                                                                   this.setState({edit_enabled: event.target.checked});
                                                               }}
                                                               value="enable this knowledge-base?"
                                                        />
                                                    </span>
                                                    <span>knowledge-base enabled?</span>
                                                </div>


                                                <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={this.state.edit_operator_enabled}
                                                               onChange={(event) => {
                                                                   this.setState({edit_operator_enabled: event.target.checked});
                                                               }}
                                                               value="enable operator access?"
                                                        />
                                                    </span>
                                                    <span>operator enabled?</span>
                                                </div>


                                                <div className="control-row">
                                                    <span className="checkbox-only">
                                                        <input type="checkbox"
                                                               checked={this.state.edit_capacity_warnings}
                                                               onChange={(event) => {
                                                                   this.setState({edit_capacity_warnings: event.target.checked});
                                                               }}
                                                               value="enable capacity warnings?"
                                                        />
                                                    </span>
                                                    <span>capacity-warnings on?</span>
                                                </div>


                                                <div className="control-row">
                                                    <span className="label-wide">maximum number of queries per day (0 is no limits)</span>
                                                    <span className="text">
                                                        <input type="text"
                                                               onChange={(event) => this.setState({edit_max_queries_per_day: event.target.value})}
                                                               placeholder="max transactions per month"
                                                               value={this.state.edit_max_queries_per_day}
                                                        />
                                                    </span>
                                                </div>


                                                <div className="control-row">
                                                    <span className="label-wide">maximum analytics retention period in months (0 is no limits)</span>
                                                    <span className="text">
                                                        <input type="text"
                                                               onChange={(event) => this.setState({edit_analytics_window_size_in_months: event.target.value})}
                                                               placeholder="max analytics retention period in months"
                                                               value={this.state.edit_analytics_window_size_in_months}
                                                        />
                                                    </span>
                                                </div>

                                            </div>

                                        </div>
                                        <div className="modal-footer">
                                            <button className="btn btn-primary btn-block"  onClick={() => this.editCancel()}>Cancel</button>
                                            <button className="btn btn-primary btn-block"  onClick={() => this.editOk()}>Save</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                    </div>
                }

                {
                    this.state.view_ids &&
                    <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                        <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                            <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                                <div className="modal-header">{this.state.kb != null ? this.state.kb.name : ""} IDS</div>
                                <div className="modal-body">
                                    <div>
                                        <div className="dialog-line-height">
                                            <div className="organisation-id-label">
                                                organisation id
                                            </div>
                                            <div className="float-left">{this.props.selected_organisation_id ? this.props.selected_organisation_id : ""}</div>
                                            <span className="copy-image-span" title={'copy organisation id'}>
                                                <img
                                                    src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                    className="clipboard-image" alt={'copy'}
                                                    onClick={() => {
                                                        if (Api.writeToClipboard(this.props.selected_organisation_id ? this.props.selected_organisation_id : ""))
                                                            this.startCopiedVisible(this.props.selected_organisation_id);
                                                    }}/>
                                                            {this.props.selected_organisation_id && this.state.copied_visible === this.props.selected_organisation_id &&
                                                            <div className="copied-style">copied</div>
                                                            }
                                            </span>
                                            <br clear='both'/>
                                        </div>

                                        <div className="dialog-line-height">
                                            <div className="organisation-id-label">
                                                knowledge base id
                                            </div>
                                            <div className="float-left">{this.state.kb ? this.state.kb.kbId : ""}</div>
                                            <span className="copy-image-span" title={'copy knowledge base id'}>
                                                <img
                                                    src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                    className="clipboard-image" alt={'copy'}
                                                    onClick={() => {
                                                        if (Api.writeToClipboard(this.state.kb ? this.state.kb.kbId : ""))
                                                            this.startCopiedVisible(this.state.kb.kbId);
                                                    }}/>
                                                            {this.state.kb && this.state.copied_visible === this.state.kb.kbId &&
                                                            <div className="copied-style">copied</div>
                                                            }
                                            </span>
                                            <br clear='both'/>
                                        </div>

                                        <div className="dialog-line-height">
                                            <div className="organisation-id-label">
                                                security id
                                            </div>
                                            <div
                                                className="float-left">{this.state.kb ? this.state.kb.securityId : ""}</div>
                                            <span className="copy-image-span" title={'copy security id'}>
                                                <img
                                                    src={theme === 'light' ? '../images/clipboard-copy.svg' : '../images/clipboard-copy-dark.svg'}
                                                    className="clipboard-image" alt={'copy'}
                                                    onClick={() => {
                                                        if (Api.writeToClipboard(this.state.kb ? this.state.kb.securityId : ""))
                                                            this.startCopiedVisible(this.state.kb.securityId);
                                                    }}/>
                                                            {this.state.kb && this.state.copied_visible === this.state.kb.securityId &&
                                                            <div className="copied-style">copied</div>
                                                            }
                                            </span>
                                            <br clear='both'/>
                                        </div>

                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-primary btn-block" onClick={() => this.setState({view_ids: false})}>Close</button>
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
        theme: state.appReducer.theme,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        kb_page: state.appReducer.kb_page,
        kb_page_size: state.appReducer.kb_page_size,
        user: state.appReducer.user,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(KnowledgeBases);
