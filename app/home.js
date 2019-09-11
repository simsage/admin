import React, { Component } from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import uiTheme from "./theme-ui";

import AppMenu from './auth/app-menu'
import ErrorDialog from './common/error-dialog'
import {MessageDialog} from './common/message-dialog'
import AutoComplete from './common/autocomplete'

import Api from './common/api'
import Comms from './common/comms'

import Organisations from "./organisations/organisations";
import UserManager from "./users/user-manager";
import KnowledgeBases from "./kb/knowledge-bases";
import KnowledgeManager from "./kb/knowledge-manager";
import DocumentSources from "./documents/document-sources";
import Documents from "./documents/documents";
import Mind from "./mind/mind";
import Synonyms from "./synonyms/synonyms";
import Semantics from "./semantics/semantics";
import Reports from "./reports/reports";
import License from "./license/license";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appCreators } from "./actions/appActions";

const styles = {
    page: {
        float: 'left',
    },
    pageNav: {
        float: 'left',
        marginRight: '50px',
        background: '#fdfdfd',
        borderRadius: '10px',
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
        background: '#a0a0a0',
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
    organisationSelect: {
        padding: '5px',
        marginBottom: '40px',
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
        position: 'absolute',
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
    infoText: {
        display: 'inline-block',
        width: '80%',
        fontSize: '0.9em',
    }
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
            window.location = "/";
        } else {
            this.props.getOrganisationList();

            // switch tabs for non admin users to knowledge base default
            if (!Home.hasRole(this.props.user, ['admin']) && this.props.selected_tab === "organisations") {
                this.props.selectTab('knowledge bases');
            }

            // get state every notification_time_in_ms interval
            const self = this;
            setInterval(() => { self.props.getNotifications(); }, this.props.notification_time_in_ms);
        }
    }
    getStyle(tab) {
        return this.props.selected_tab === tab ? styles.selectedNavItem : styles.navItem;
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
    openDialog(message, message_title, message_callback) {
        this.setState({dialog_open: true, message: message, message_title: message_title, message_callback: message_callback});
    }
    closeDialog() {
        this.setState({dialog_open: false, message: "", message_title: "", message_callback: null});
    }
    render() {
        return (
            <MuiThemeProvider theme={uiTheme}>

                <AppMenu title="" signed_in={true} />

                <ErrorDialog title={this.props.error_title}
                             message={this.props.error}
                             callback={() => this.props.closeError()} />

                <MessageDialog callback={(action) => {if (this.state.message_callback) this.state.message_callback(action)}}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

                 <div style={styles.page}>

                     <div style={styles.pageNav}>
                         {
                             Home.hasRole(this.props.user, ['admin']) &&
                             <div style={this.getStyle('organisations')} onClick={() => this.props.selectTab('organisations')}>organisations</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge bases')}
                                  onClick={() => this.props.selectTab('knowledge bases')}>knowledge bases</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('users')}
                                  onClick={() => this.props.selectTab('users')}>user manager</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge')}
                                  onClick={() => this.props.selectTab('knowledge')}>knowledge manager</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('document sources')}
                                  onClick={() => this.props.selectTab('document sources')}>document
                                 sources</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('documents')}
                                  onClick={() => this.props.selectTab('documents')}>documents</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('mind')}
                                  onClick={() => this.props.selectTab('mind')}>the mind</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('synonyms')}
                                  onClick={() => this.props.selectTab('synonyms')}>synonyms</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('semantics')}
                                  onClick={() => this.props.selectTab('semantics')}>semantics</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('reports')}
                                  onClick={() => this.props.selectTab('reports')}>reports</div>
                         }
                         {
                             Home.hasRole(this.props.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('license')}
                                  onClick={() => this.props.selectTab('license')}>license</div>
                         }
                     </div>

                     <div style={styles.pageContent}>

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' &&
                          this.props.selected_tab !== 'license' &&
                             <div style={styles.organisationSelect}>
                                 <div style={styles.lhs}>organisation</div>
                                 <div style={styles.rhs}>
                                     <AutoComplete
                                         label='organisation'
                                         value={this.props.selected_organisation}
                                         onFilter={(text, callback) => this.getOrganisationListFiltered(text, callback)}
                                         minTextSize={1}
                                         onSelect={(label, data) => this.props.selectOrganisation(label, data)}
                                     />
                                 </div>
                             </div>
                         }

                         {this.props.selected_tab !== 'organisations' && this.props.selected_tab !== 'os' && this.props.selected_tab !== 'users' &&
                          this.props.selected_tab !== 'license' && this.props.selected_tab !== 'knowledge bases' &&
                             <div style={styles.knowledgeSelect}>
                                 <div style={styles.lhs}>knowledge base</div>
                                 <div style={styles.rhs}>
                                     <AutoComplete
                                         label='knowledge base'
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

                         { this.props.selected_tab === 'users' &&
                            <UserManager
                                openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'knowledge' &&
                             <KnowledgeManager
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

                         { this.props.selected_tab === 'mind' &&
                             <Mind
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

                         { this.props.selected_tab === 'reports' &&
                             <Reports
                                 openDialog={(message, title, callback) => this.openDialog(message, title, callback)}
                                 closeDialog={() => this.closeDialog()} />
                         }

                         { this.props.selected_tab === 'license' &&
                             <License
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
                                            <div style={styles.infoText}>{notification.message}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }

                { this.props.notification_list.length > 0 && !this.props.show_notifications &&
                    <div style={styles.notificationsHidden}>
                        <div style={styles.displayAll} onClick={() => { this.props.showNotifications() }}>
                            <img src="images/double-up-arrow.svg" style={styles.showAllImage} alt="show all" title="show logs" />
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
        notification_time_in_ms: state.appReducer.notification_time_in_ms,
        notification_list_display_size: state.appReducer.notification_list_display_size,

        user: state.appReducer.user,
        selected_tab: state.appReducer.selected_tab,

        organisation_list: state.appReducer.organisation_list,
        knowledge_base_list: state.appReducer.knowledge_base_list,

        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase: state.appReducer.selected_knowledgebase,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Home);

