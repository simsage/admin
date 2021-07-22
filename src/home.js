import React, {Component} from 'react';
import CssBaseline from "@material-ui/core/CssBaseline";

import {MuiThemeProvider} from '@material-ui/core/styles';
import {darkTheme, lightTheme} from "./theme-ui";

import AppMenu from './auth/app-menu'
import ErrorDialog from './common/error-dialog'
import {MessageDialog} from './common/message-dialog'
import AutoComplete from './common/autocomplete'

import Api from './common/api'
import Comms from './common/comms'

import Organisations from "./organisations/organisations";
import UserManager from "./users/user-manager";
import KnowledgeBases from "./kb/knowledge-bases";
import EdgeDevices from "./edge/edge-devices";
import EdgeDeviceCommands from "./edge/edge-device-commands";
import Inventory from './inventory/inventory'
import DocumentSources from "./documents/document-sources";
import Documents from "./documents/documents";
import Mind from "./mind/mind";
import MindTest from "./mind/mind-test";
import Synonyms from "./synonyms/synonyms";
import Semantics from "./semantics/semantics";
import SynSets from "./synsets/synsets";
import Logs from "./reports/logs";
import Reports from "./reports/reports";
import OperatorTabs from "./operator/operator_tabs";
import Domains from "./ad/domains";

import SockJsClient from 'react-stomp';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "./actions/appActions";

// if not defined, use this one
const default_operator_wait_timeout_in_ms = 10000;


const styles = {
    page: {
        float: 'left',
        minWidth: '1200px',
    },
    pageNav: {
        float: 'left',
        marginTop: '56px',
        marginRight: '50px',
        borderRadius: '10px',
        padding: '5px',
    },
    pageContent: {
        float: 'left',
        marginTop: '10px',
        minWidth: '700px',
    },
    selectedNavItem: {
        marginLeft: '10px',
        textAlign: 'center',
        width: '180px',
        padding: '10px',
        cursor: 'pointer',
        background: '#62C2D6',
        color: '#fff',
        border: '1px solid #666',
        borderRadius: '2px',
        marginBottom: '5px',
    },
    navItem: {
        marginLeft: '10px',
        textAlign: 'center',
        width: '180px',
        padding: '10px',
        border: '1px solid #bbb',
        cursor: 'pointer',
        background: '#f8f8f8',
        color: '#666',
        borderRadius: '2px',
        marginBottom: '5px',
    },
    navItemDark: {
        marginLeft: '10px',
        textAlign: 'center',
        width: '180px',
        padding: '10px',
        border: '1px solid #bbb',
        cursor: 'pointer',
        background: '#666',
        color: '#f8f8f8',
        borderRadius: '2px',
        marginBottom: '5px',
    },
    navItemDisabled: {
        marginLeft: '10px',
        textAlign: 'center',
        width: '180px',
        padding: '10px',
        border: '1px solid #bbb',
        background: '#f8f8f8',
        color: '#e0e0e0',
        borderRadius: '2px',
        marginBottom: '5px',
        cursor: 'not-allowed',
    },
    navItemDisabledDark: {
        marginLeft: '10px',
        textAlign: 'center',
        width: '180px',
        padding: '10px',
        border: '1px solid #555',
        background: '#444',
        color: '#888',
        borderRadius: '2px',
        marginBottom: '5px',
        cursor: 'not-allowed',
    },
    organisationSelect: {
        padding: '5px',
        marginBottom: '40px',
    },
    organisationLabel: {
        marginTop: '-10px',
    },
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '50px',
    },
    divider: {
        height: '5px',
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
    notificationParent: {
        position: 'fixed',
        left: '4px',
        right: '1px',
        bottom: '4px',
    },
    notifications: {
        background: '#fafafa',
        marginRight: '40px',
        color: '#333',
        padding: '16px',
        zIndex: '101',
        boxShadow: '0 0 2px 2px',
        height: '120px',
        overflowY: 'scroll',
    },
    notificationsHidden: {
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '2px',
        padding: '16px',
        zIndex: '101',
    },
    displayAll: {
        float: 'right',
        marginRight: '10px',
    },
    hideAllImage: {
        width: '16px',
    },
    showAllImage: {
        width: '16px',
        marginRight: '-12px',
    },
    info: {
    },
    infoDate: {
        display: 'inline-block',
        width: '200px',
        marginLeft: '20px',
        fontSize: '0.8em',
    },
    infoType: {
        display: 'inline-block',
        width: '100px',
        fontSize: '0.9em',
    },
    infoText: {
        display: 'inline-block',
        width: '70%',
        fontSize: '0.9em',
    },
    busy: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.8',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(255,255,255)"
    },
    busyDark: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.3',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(1.0,1.0,1.0,0.10)"
    },
};

export class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message_callback: null,
            message: '',
            message_title: '',
        }
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
        // do we still have a session?
        if (!Api.defined(Comms.getSession())) {
            // clearState();
            window.location = "/#/";
        } else {
            this.props.getOrganisationList();

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
            return theme === 'light' ? styles.navItemDisabled : styles.navItemDisabledDark;
        }
        return this.props.selected_tab === tab ? styles.selectedNavItem : (theme === 'light' ? styles.navItem : styles.navItemDark);
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
    getNotifications() {
        if (this.props.notification_list.length > this.props.notification_list_display_size) {
            const len = this.props.notification_list.length;
            const list = JSON.parse(JSON.stringify(this.props.notification_list.slice(len - this.props.notification_list_display_size, len)));
            return list.reverse()
        }
        const list = JSON.parse(JSON.stringify(this.props.notification_list));
        return list.reverse();
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
            <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />

                {
                    this.props.busy &&
                    <div style={theme === 'light' ? styles.busy : styles.busyDark} />
                }

                <AppMenu title="" signed_in={true} />

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

                 <div style={styles.page}>

                     <div style={styles.pageNav}>
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div style={this.getStyle('organisations', false)} className="no-select"
                                  onClick={() => this.props.selectTab('organisations')}>organisations</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge bases', false)} className="no-select"
                                  onClick={() => this.props.selectTab('knowledge bases')}>knowledge bases</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('edge devices', false)} className="no-select"
                                  onClick={() => this.props.selectTab('edge devices')}>Edge devices</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             this.props.edge_device_list && this.props.edge_device_list.length > 0 &&
                             <div style={this.getStyle('edge commands', false)} className="no-select"
                                  onClick={() => this.props.selectTab('edge commands')}>Edge commands</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('users', false)} className="no-select"
                                  onClick={() => this.props.selectTab('users')}>user manager</div>
                         }
                         {
                             <div style={this.getStyle('operator', !this.props.operator_connected || !isOperator)}
                                  onClick={() => { if (isOperator) this.props.selectTab('operator')}} className="no-select">operator</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('inventory', false)} className="no-select"
                                  onClick={() => this.props.selectTab('inventory')}>inventory</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('document sources', false)} className="no-select"
                                  onClick={() => this.props.selectTab('document sources')}>document
                                 sources</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('documents', false)} className="no-select"
                                  onClick={() => this.props.selectTab('documents')}>documents</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('active directory', false)} className="no-select"
                                  onClick={() => this.props.selectTab('active directory')}>active directory</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('mind', false)} className="no-select"
                                  onClick={() => this.props.selectTab('mind')}>the mind</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('mind-test', false)} className="no-select"
                                  onClick={() => this.props.selectTab('mind-test')}>test the mind</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('synonyms', false)} className="no-select"
                                  onClick={() => this.props.selectTab('synonyms')}>synonyms</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('semantics')} className="no-select"
                                  onClick={() => this.props.selectTab('semantics')}>semantics</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('syn-sets')} className="no-select"
                                  onClick={() => this.props.selectTab('syn-sets')}>syn-sets</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('reports', false)} className="no-select"
                                  onClick={() => this.props.selectTab('reports')}>reports</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div style={this.getStyle('logs', false)}
                                  onClick={() => this.props.selectTab('logs')}>logs</div>
                         }
                     </div>

                     <div style={styles.pageContent}>

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' &&
                          this.props.selected_tab !== 'logs' &&
                          this.props.selected_tab !== 'operator' && this.props.selected_tab !== 'license' && isAdmin &&
                             <div style={styles.organisationSelect}>
                                 <div style={styles.lhs}>organisation</div>
                                 <div style={styles.rhs}>
                                     <AutoComplete
                                         theme={theme}
                                         label='organisation'
                                         value={this.props.selected_organisation}
                                         onFilter={(text, callback) => this.getOrganisationListFiltered(text, callback)}
                                         minTextSize={1}
                                         onSelect={(label, data) => this.props.selectOrganisation(label, data)}
                                     />
                                 </div>
                             </div>
                         }

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' &&
                          this.props.selected_tab !== 'logs' &&
                          this.props.selected_tab !== 'license' && this.props.selected_tab !== 'operator' && !isAdmin &&
                             <div style={styles.organisationSelect}>
                                 <div style={styles.lhs}>organisation</div>
                                 <div style={styles.rhs}>
                                     <div style={styles.organisationLabel}>{this.props.selected_organisation}</div>
                                 </div>
                             </div>
                         }

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' && this.props.selected_tab !== 'users' &&
                          this.props.selected_tab !== 'operator' && this.props.selected_tab !== 'license' && this.props.selected_tab !== 'knowledge bases' &&
                          this.props.selected_tab !== 'logs' && this.props.selected_tab !== 'edge devices' && this.props.selected_tab !== 'edge commands' &&
                             <div style={styles.knowledgeSelect}>
                                 <div style={styles.lhs}>knowledge base</div>
                                 <div style={styles.rhs}>
                                     <AutoComplete
                                         label='knowledge base'
                                         theme={theme}
                                         value={this.props.selected_knowledgebase}
                                         onFilter={(text, callback) => this.getKnowledgeBaseListFiltered(text, callback)}
                                         minTextSize={1}
                                         onSelect={(label, data) => {
                                             this.props.selectKnowledgeBase(label, data);
                                         }}
                                     />
                                 </div>
                             </div>
                         }

                         { this.props.selected_tab === 'edge commands' &&
                         <div style={styles.knowledgeSelect}>
                             <div style={styles.lhs}>edge device</div>
                             <div style={styles.rhs}>
                                 <AutoComplete
                                     label='edge device'
                                     theme={theme}
                                     value={this.props.selected_edge_device}
                                     onFilter={(text, callback) => this.getEdgeDeviceList(text, callback)}
                                     minTextSize={1}
                                     onSelect={(label, data) => {
                                         this.props.selectEdgeDevice(label, data);
                                     }}
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

                         { this.props.selected_tab === 'mind' &&
                             <Mind
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'mind-test' &&
                             <MindTest
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


                { this.props.notification_list.length > 0 && this.props.show_notifications &&
                    <div style={styles.notificationParent}>
                        <div style={styles.displayAll} onClick={() => { this.props.hideNotifications() }}>
                            <img src="images/double-down-arrow.svg" style={styles.hideAllImage} alt="hide all" title="hide log" />
                        </div>
                        <div style={styles.notifications}>
                            {
                                this.getNotifications().map((notification) => {
                                    return (
                                        <div key={notification.id} style={styles.info}>
                                            <div style={styles.infoDate}>{notification.year}/{Home.pad(notification.month)}/{Home.pad(notification.day)}&nbsp;
                                                {Home.pad(notification.hour)}:{Home.pad(notification.minute)}:
                                                {Home.pad(parseInt(notification.created / 1000) % 60)}.
                                                {Home.pad2(notification.created % 1000)}
                                            </div>
                                            <div style={styles.infoType}>{notification.service}</div>
                                            <div style={styles.infoText}>{notification.message}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

            </MuiThemeProvider>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        notification_list: state.appReducer.notification_list,
        show_notifications: state.appReducer.show_notifications,
        operator_wait_timeout_in_ms: state.appReducer.operator_wait_timeout_in_ms,
        notification_list_display_size: state.appReducer.notification_list_display_size,

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

