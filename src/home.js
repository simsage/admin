import React, {Component} from 'react';

import ErrorDialog from './common/error-dialog'
import {MessageDialog} from './common/message-dialog'
import AutoComplete from './common/autocomplete'

import Organisations from "./organisations/organisations";
import UserManager from "./users/user-manager";
import KnowledgeBases from "./kb/knowledge-bases";
import EdgeDevices from "./edge/edge-devices";
import EdgeDeviceCommands from "./edge/edge-device-commands";
import Inventory from './inventory/inventory'
import DocumentSources from "./documents/document-sources";
import Documents from "./documents/documents";
import Bot from "./bot/bot";
import BotTest from "./bot/bot-test";
import Synonyms from "./synonyms/synonyms";
import Semantics from "./semantics/semantics";
import SynSets from "./synsets/synsets";
import Categories from "./categories/categories";
import Logs from "./reports/logs";
import Reports from "./reports/reports";
import OperatorTabs from "./operator/operator_tabs";
import Domains from "./ad/domains";
import Groups from "./users/groups";
import Status from "./reports/status";

import SockJsClient from 'react-stomp';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "./actions/appActions";
import './css/home.css';
import { MsalContext } from "@azure/msal-react";

// if not defined, use this one
const default_operator_wait_timeout_in_ms = 10000;


export class Home extends Component {
    static contextType = MsalContext;

    constructor(props) {
        super(props);
        this.state = {
            message_callback: null,
            message: '',
            message_title: '',
            jwt: null,
            response: null,
        }
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
        const instance = this.context.instance;
        const request = {
            account: this.context.accounts[0]
        };
        // do we have a session object locally? if not - sign-in
        const session = this.props.session;
        if (!session || !session.id) {
            instance.acquireTokenSilent(request).then((response) => {
                // this.setState({response: response});
                this.setState({jwt: response.idToken});
                this.props.signIn(response.idToken,
                    (response) => {
                        this.setupHome(response);
                    },
                    () => {
                        this.props.history.push("/error");
                    });
            }).catch((e) => {
                this.setState({jwt: null});
                this.props.setError("acquire-token", e);
                this.props.history.push("/error");
            });
        }
    }
    setupHome(response) {
        // // do we still have a session?
        // this.props.getOrganisationList(response.session.id);

        // switch tabs for non admin users to knowledge base default
        if (!Home.hasRole(this.props.user, ['admin']) && this.props.selected_tab === "organisations") {
            this.props.setupManager();
        }

        // /ops/refresh every operator_wait_timeout_in_ms interval
        const isAdminOrManager = Home.hasRole(this.props.user, ['admin', 'manager']);
        const isOperator = Home.hasRoleInOrganisation(this.props.user, this.props.selected_organisation_id, ['operator']);
        const self = this;
        let timeout = (this.props.operator_wait_timeout_in_ms && this.props.operator_wait_timeout_in_ms >= 1000) ?
            this.props.operator_wait_timeout_in_ms : default_operator_wait_timeout_in_ms;
        if (isAdminOrManager || isOperator) {
            // refresh notifications and operator at interval
            setInterval(() => { self.refreshOperator(self); }, timeout);
        }

        if (isOperator) {
            // if this user has an operator role at all - we need to ask for events
            if (!this.props.html5_notifications || this.props.html5_notifications.length === 0) {
                this.props.getHtml5Notifications();
            }
        }
    }
    refreshOperator(self) {
        // keep operator alive if they're active and ready
        if (self.props.selected_organisation_id.length > 0 &&
            self.props.operators && self.props.operators.length > 0) {
            const operatorList = [];
            for (const op of self.props.operators) {
                if (op.operator_ready) {
                    operatorList.push({"operatorId": op.id, "isTyping": op.is_typing, "clientId": op.client_id});
                }
            }
            if (operatorList.length > 0) {
                const data = {
                    sessionId: self.props.session.id,
                    organisationId: self.props.selected_organisation_id,
                    operatorList: operatorList,
                };
                this.props.sendOperatorMessage('/ops/refresh', data);
            }
        }
    }
    getStyle(tab, disabled) {
        const theme = this.props.theme;
        if (disabled) {
            return theme === 'light' ? "home-nav-item-disabled no-select" : "home-nav-item-disabled-dark no-select";
        }
        return this.props.selected_tab === tab ? "selected-home-nav-item" : (theme === 'light' ? "home-nav-item" : "home-nav-item-dark");
    }
    static getTab(user) {
        if (Home.hasRole(user, ['admin'])) {
            return "organisations";
        } else if (Home.hasRole(user, ['manager'])) {
            return "users";
        } else if (Home.hasRole(user, ['reporter'])) {
            return "reports";
        } else {
            return "invalid"
        }
    }
    static hasRole(user, role_name_list) {
        if (user && user.roles) {
            for (const role of user.roles) {
                if (role_name_list.indexOf(role.role) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    static hasRoleInOrganisation(user, organisationId, role_name_list) {
        if (user && user.roles) {
            for (const role of user.roles) {
                if (role.organisationId === organisationId && role_name_list.indexOf(role.role) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    // is this user entitle to edit the user passed in?
    static canEdit(user, isAdmin, isManager) {
        // admin can edit anyone, always
        if (isAdmin) return true;
        // a non admin user can never edit an administrator
        const userIsAdmin = Home.hasRole(user, ['admin']);
        if (userIsAdmin) return false;
        // managers can edit everyone else
        return isManager;
    }
    // is this user entitle to edit the user passed in?
    static canDelete(user, signedInUser, isAdmin, isManager) {
        // one cannot delete the signed-in user
        if (user.email === signedInUser.email) return false;
        // admin can edit anyone, always
        if (isAdmin) return true;
        // a non admin user can never edit an administrator
        const userIsAdmin = Home.hasRole(user, ['admin']);
        if (userIsAdmin) return false;
        // managers can edit everyone else
        return isManager;
    }
    static pad(item) {
        return ("" + item).padStart(2, '0');
    }
    static pad2(item) {
        return ("" + item).padStart(3, '0');
    }
    getOrganisationListFiltered(filter_text, callback) {
        if (filter_text && filter_text.length > 0) {
            const ft_lower = filter_text.toLowerCase();
            const filtered_list = [];
            for (const item of this.props.organisation_list) {
                if (item.name.toLowerCase().indexOf(ft_lower) >= 0) {
                    filtered_list.push({'label': item.name, 'data': item.id});
                }
            }
            callback(filtered_list);
        } else {
            const filtered_list = [];
            for (const item of this.props.organisation_list) {
                filtered_list.push({'label': item.name, 'data': item.id});
            }
            callback(filtered_list);
        }
    }
    getKnowledgeBaseListFiltered(filter_text, callback) {
        if (filter_text && filter_text.length > 0) {
            const ft_lower = filter_text.toLowerCase();
            const filtered_list = [];
            for (const item of this.props.knowledge_base_list) {
                if (item.name.toLowerCase().indexOf(ft_lower) >= 0) {
                    filtered_list.push({'label': item.name, 'data': item.kbId});
                }
            }
            callback(filtered_list);
        } else {
            const filtered_list = [];
            for (const item of this.props.knowledge_base_list) {
                filtered_list.push({'label': item.name, 'data': item.kbId});
            }
            callback(filtered_list);
        }
    }
    getEdgeDeviceList(filtered_text, callback) {
        if (this.props.edge_device_list) {
            if (filtered_text && filtered_text.length > 0) {
                const ft_lower = filtered_text.toLowerCase();
                const filtered_list = [];
                for (const item of this.props.edge_device_list) {
                    if (item.name.toLowerCase().indexOf(ft_lower) >= 0) {
                        filtered_list.push({'label': item.name, 'data': item.edgeId});
                    }
                }
                callback(filtered_list);
            } else {
                const filtered_list = [];
                for (const item of this.props.edge_device_list) {
                    filtered_list.push({'label': item.name, 'data': item.edgeId});
                }
                callback(filtered_list);
            }
        }
    }
    openDialog(message, message_title, message_callback) {
        this.setState({dialog_open: true, message: message, message_title: message_title, message_callback: message_callback});
    }
    closeDialog() {
        this.setState({dialog_open: false, message: "", message_title: "", message_callback: null});
    }
    connectionError(error) {
        this.props.setOperatorConnected(false);
        this.props.setError("Operator Connection", error);
    }
    convertOrganisationList(list) {
        const new_list = [];
        for (const item of list) {
            if (item.id && item.name) {
                new_list.push({"id": item.id, "name": item.name});
            }
        }
        return new_list;
    }
    convertKbList(list) {
        const new_list = [];
        for (const item of list) {
            if (item.kbId && item.name) {
                new_list.push({"id": item.kbId, "name": item.name});
            }
        }
        return new_list;
    }
    convertEdgeList(list) {
        const new_list = [];
        for (const item of list) {
            if (item.edgeId && item.name) {
                new_list.push({"id": item.edgeId, "name": item.name});
            }
        }
        return new_list;
    }
    render() {
        const isAdmin = Home.hasRole(this.props.user, ['admin']);
        const isOperator = Home.hasRoleInOrganisation(this.props.user, this.props.selected_organisation_id, ['operator']);
        const operator_id_list = [];
        if (this.props.operators) {
            for (const operator of this.props.operators) {
                if (operator && operator.id) {
                    operator_id_list.push('/chat/' + operator.id);
                }
            }
        }
        const theme = this.props.theme;
        return (
            <div className="home-screen">
                {
                    this.props.busy &&
                    <div className={theme === 'light' ? "busy" : "busyDark"} />
                }

                <ErrorDialog title={this.props.error_title}
                             theme={theme}
                             message={this.props.error}
                             callback={() => this.props.closeError()} />

                <MessageDialog callback={(action) => {if (this.state.message_callback) this.state.message_callback(action)}}
                               open={this.state.message.length > 0}
                               theme={this.props.theme}
                               message={this.state.message}
                               title={this.state.message_title} />

                <SockJsClient url={window.ENV.ws_base} topics={operator_id_list}
                              ref={ (client) => { this.clientRef = client }}
                              onMessage={(msg) => { this.props.processOperatorMessage(msg) }}
                              onConnect={() => this.props.setOperatorConnected(true)}
                              onDisconnect={() => this.props.setOperatorConnected(false)}
                              onError={(error) => this.connectionError(error)} />

                 <div>

                     <div className="page-nav">
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div className={this.getStyle('organisations', false)}
                                  onClick={() => this.props.selectTab('organisations')}>organisations</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('knowledge bases', false)}
                                  onClick={() => this.props.selectTab('knowledge bases')}>knowledge bases</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div className={this.getStyle('status', false)}
                                  onClick={() => this.props.selectTab('status')}>status</div>
                         }
                         {/*{*/}
                         {/*    Home.hasRole(this.props.user, ['admin', 'manager']) &&*/}
                         {/*    <div className={this.getStyle('edge devices', false)}*/}
                         {/*         onClick={() => this.props.selectTab('edge devices')}>Edge devices</div>*/}
                         {/*}*/}
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             this.props.edge_device_list && this.props.edge_device_list.length > 0 &&
                             <div className={this.getStyle('edge commands', false)} 
                                  onClick={() => this.props.selectTab('edge commands')}>Edge commands</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('users', false)} 
                                  onClick={() => this.props.selectTab('users')}>user manager</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('groups', false)} 
                                  onClick={() => this.props.selectTab('groups')}>group manager</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['operator']) &&
                             <div className={this.getStyle('operator', !this.props.operator_connected || !isOperator)}
                                  onClick={() => { if (isOperator) this.props.selectTab('operator')}} >operator</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('inventory', false)} 
                                  onClick={() => this.props.selectTab('inventory')}>inventory</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('document sources', false)} 
                                  onClick={() => this.props.selectTab('document sources')}>document
                                 sources</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('documents', false)} 
                                  onClick={() => this.props.selectTab('documents')}>documents</div>
                         }
                         {/*{*/}
                         {/*    Home.hasRole(this.props.user, ['admin', 'manager']) &&*/}
                         {/*    <div className={this.getStyle('active directory', false)} */}
                         {/*         onClick={() => this.props.selectTab('active directory')}>active directory</div>*/}
                         {/*}*/}
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('bot', false)}
                                  onClick={() => this.props.selectTab('bot')}>bot</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('bot-test', false)}
                                  onClick={() => this.props.selectTab('bot-test')}>test bot</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('synonyms', false)} 
                                  onClick={() => this.props.selectTab('synonyms')}>synonyms</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('semantics')} 
                                  onClick={() => this.props.selectTab('semantics')}>semantics</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('syn-sets')} 
                                  onClick={() => this.props.selectTab('syn-sets')}>syn-sets</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('categories')}
                                  onClick={() => this.props.selectTab('categories')}>categorization</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div className={this.getStyle('reports', false)} 
                                  onClick={() => this.props.selectTab('reports')}>reports</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div className={this.getStyle('logs', false)}
                                  onClick={() => this.props.selectTab('logs')}>logs</div>
                         }
                     </div>

                     <div className="page-content">

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' &&
                          this.props.selected_tab !== 'status' && this.props.selected_tab !== 'operator' &&
                          this.props.selected_tab !== 'license' && isAdmin &&
                             <div className="organisation-select">
                                 <div className="lhs">organisation</div>
                                 <div className="rhs">
                                     <AutoComplete
                                         theme={theme}
                                         label='organisation'
                                         value={this.props.selected_organisation_id}
                                         data_list={this.convertOrganisationList(this.props.organisation_list)}
                                         onSelect={(data) => this.props.selectOrganisation(data)}
                                     />
                                 </div>
                             </div>
                         }

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' &&
                             this.props.selected_tab !== 'status' && this.props.selected_tab !== 'license' &&
                             this.props.selected_tab !== 'operator' && !isAdmin &&
                             <div className="organisation-select">
                                 <div className="lhs">organisation</div>
                                 <div className="rhs">
                                     <div className="organisation-label">{this.props.selected_organisation}</div>
                                 </div>
                             </div>
                         }

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' && this.props.selected_tab !== 'users' &&
                          this.props.selected_tab !== 'groups' && this.props.selected_tab !== 'operator' && this.props.selected_tab !== 'license' &&
                          this.props.selected_tab !== 'knowledge bases' && this.props.selected_tab !== 'logs' && this.props.selected_tab !== 'edge devices' &&
                          this.props.selected_tab !== 'edge commands' &&  this.props.selected_tab !== 'status' &&
                             <div className="knowledgebase-select">
                                 <div className="lhs">knowledge base</div>
                                 <div className="rhs">
                                     <AutoComplete
                                         label='knowledge base'
                                         value={this.props.selected_knowledgebase_id}
                                         data_list={this.convertKbList(this.props.knowledge_base_list)}
                                         onSelect={(data) => this.props.selectKnowledgeBase(data)}
                                         theme={theme}
                                     />
                                 </div>
                             </div>
                         }

                         { this.props.selected_tab === 'edge commands' &&
                         <div className="knowledgebase-select">
                             <div className="lhs">edge device</div>
                             <div className="rhs">
                                 <AutoComplete
                                     label='edge device'
                                     theme={theme}
                                     value={this.props.selected_edge_device_id}
                                     data_list={this.convertEdgeList(this.props.edge_device_list)}
                                     onSelect={(data) => this.props.selectEdgeDevice(data)}
                                 />
                             </div>
                         </div>
                         }

                         { this.props.selected_tab === 'organisations' &&
                             <Organisations
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'knowledge bases' &&
                            <KnowledgeBases
                                openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'edge devices' &&
                             <EdgeDevices
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'edge commands' &&
                            <EdgeDeviceCommands
                             openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                             closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'users' &&
                            <UserManager
                                openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'groups' &&
                             <Groups
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'operator' &&
                             <OperatorTabs
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'inventory' &&
                             <Inventory
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'document sources' &&
                            <DocumentSources
                                openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'documents' &&
                             <Documents
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'active directory' &&
                             <Domains
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'bot' &&
                             <Bot
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'bot-test' &&
                             <BotTest
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'synonyms' &&
                             <Synonyms
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'semantics' &&
                             <Semantics
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'syn-sets' &&
                             <SynSets
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'categories' &&
                             <Categories
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'status' &&
                             <div>
                                 <div className="organisation-select" />
                                 <Status />
                             </div>
                         }

                         { this.props.selected_tab === 'reports' &&
                             <Reports
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'logs' &&
                             <Logs
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         {
                             this.props.selected_tab === 'invalid' &&
                             <div>You do not have access to this application</div>
                         }

                     </div>

                 </div>

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        operator_wait_timeout_in_ms: state.appReducer.operator_wait_timeout_in_ms,

        busy: state.appReducer.busy,
        theme: state.appReducer.theme,

        user: state.appReducer.user,
        selected_tab: state.appReducer.selected_tab,
        session: state.appReducer.session,
        operator_connected: state.appReducer.operator_connected,
        operators: state.appReducer.operators,

        organisation_list: state.appReducer.organisation_list,
        knowledge_base_list: state.appReducer.knowledge_base_list,

        html5_notifications: state.appReducer.html5_notifications,

        selected_organisation: state.appReducer.selected_organisation,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase: state.appReducer.selected_knowledgebase,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,

        // list of edge devices
        edge_device_list: state.appReducer.edge_device_list,
        selected_edge_device: state.appReducer.selected_edge_device,
        selected_edge_device_id: state.appReducer.selected_edge_device_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Home);

