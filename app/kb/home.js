import React from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import uiTheme from "../theme-ui";

import system_config from "../settings";
import {State} from '../common/state'
import {Api} from '../common/api'
import AppMenu from '../auth/app-menu'
import ErrorDialog from '../common/error-dialog'

import Organisations from "./organisations";
import UserManager from "./user-manager";
import KnowledgeBases from "./knowledgebases";
import KnowledgeManager from "./knowledge-manager";
import Documents from "./documents";
import AutoComplete from '../common/autocomplete'
import KnowledgeBaseAware from "./knowledge_base_aware";
import DocumentSources from "../crawlers/document-sources";
import Mind from "./mind";
import Synonyms from "./synonyms";
import Semantics from "./semantics";
import Reports from "./reports";
import License from "./license";

const maxDisplay = 7;

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
    notifications: {
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '2px',
        background: '#fde073',
        color: '#333',
        padding: '16px',
        zIndex: '101',
        boxShadow: '0 0 2px 2px',
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
    },
    displayAllImage: {
        width: '16px',
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

export class Home extends React.Component {
    constructor(props) {
        super(props);

        this.kba = new KnowledgeBaseAware(this);

        this.state = {
            error_title: '',
            user: Api.getUser(),
            error_msg: '',
            has_error: false,
            selected_tab: Home.getTab(Api.getUser()),

            // getting-os busy
            graph_refresh_rate: 2500,
            // list of notifications from the system
            notification_list: [],
            show_notifications: false,
            os_get_busy: false,
            dialog_open: false,
        };
        this.timer = null;
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentDidMount() {
        State.checkSession();
        this.kba.componentDidMount();
        if (this.timer === null) {
            this.timer = setInterval(() => this.refresh(), this.state.graph_refresh_rate);
        }
    }
    componentWillUnmount() {
        if (this.timer !== null) {
            console.log("stopping stats collection");
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    // get the stats system wide
    refresh() {
        if (!this.state.os_get_busy && !this.state.dialog_open) {
            this.setState({os_get_busy: true});
            Api.getOSMessages(
                (osStats) => {

                    let notification_list = this.state.notification_list;
                    let show_notifications = this.state.show_notifications;
                    const old_size = notification_list.length;
                    notification_list = Home.merge_notifications(notification_list, osStats.notificationList);
                    if (old_size < notification_list.length) {
                        show_notifications = true;
                    }
                    this.setState({
                        notification_list: notification_list,
                        show_notifications: show_notifications,
                        os_get_busy: false,
                    });
                },
                (errStr) => {
                    this.setState({os_get_busy: false});
                    console.error(errStr);
                });
        }
    }

    // merge two notifications lists together and return the resulting unique list of items
    static merge_notifications(original, list) {
        const seen = {};
        const new_list = [];
        for (const item of original) {
            seen[item.id] = true;
            new_list.push(item);
        }
        for (const item of list) {
            if (!seen.hasOwnProperty(item.id)) {
                seen[item.id] = true;
                new_list.push(item);
            }
        }
        return new_list;
    }

    hasNotifications() {
        return this.state.notification_list.length > 0;
    }

    getNotifications() {
        if (this.hasNotifications()) {
            if (this.state.notification_list.length > maxDisplay) {
                const len = this.state.notification_list.length;
                return this.state.notification_list.slice(len - maxDisplay, len);
            }
            return this.state.notification_list;
        }
        return "";
    }



    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    selectOrganisation(name, id) {
        this.kba.selectOrganisation(name, id);
    }
    getStyle(tab) {
        return this.state.selected_tab === tab ? styles.selectedNavItem : styles.navItem;
    }
    openDialog() {
        this.setState({dialog_open: true});
    }
    closeDialog() {
        this.setState({dialog_open: false});
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
    render() {
        if (this.state.has_error) {
            return <h1>home.js: Something went wrong.</h1>;
        }
        const selected_organisation_id = this.kba.selected_organisation_id;
        return (
            <MuiThemeProvider theme={uiTheme}>

                <AppMenu title="" />

                <ErrorDialog title={this.state.error_title}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)} />

                 <div style={styles.page}>

                     <div style={styles.pageNav}>
                         {
                             Home.hasRole(this.state.user, ['admin']) &&
                             <div style={this.getStyle('organisations')} onClick={() => this.setState({selected_tab: 'organisations'})}>organisations</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge bases')}
                                  onClick={() => this.setState({selected_tab: 'knowledge bases'})}>knowledge bases</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin']) &&
                             <div style={this.getStyle('users')}
                                  onClick={() => this.setState({selected_tab: 'users'})}>user manager</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge')}
                                  onClick={() => this.setState({selected_tab: 'knowledge'})}>knowledge manager</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('document sources')}
                                  onClick={() => this.setState({selected_tab: 'document sources'})}>document
                                 sources</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('documents')}
                                  onClick={() => this.setState({selected_tab: 'documents'})}>documents</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('mind')}
                                  onClick={() => this.setState({selected_tab: 'mind'})}>the mind</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('synonyms')}
                                  onClick={() => this.setState({selected_tab: 'synonyms'})}>synonyms</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('semantics')}
                                  onClick={() => this.setState({selected_tab: 'semantics'})}>semantics</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('reports')}
                                  onClick={() => this.setState({selected_tab: 'reports'})}>reports</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('license')}
                                  onClick={() => this.setState({selected_tab: 'license'})}>license</div>
                         }
                         {/*{*/}
                         {/*    Home.hasRole(this.state.user, ['admin']) &&*/}
                         {/*    <div style={this.getStyle('os')}*/}
                         {/*         onClick={() => this.setState({selected_tab: 'os'})}>o.s.</div>*/}
                         {/*}*/}
                     </div>

                     <div style={styles.pageContent}>

                         {this.state.selected_tab !== 'organisations' && this.state.selected_tab !== 'os' &&
                          this.state.selected_tab !== 'license' &&
                             <div style={styles.organisationSelect}>
                                 <div style={styles.lhs}>organisation</div>
                                 <div style={styles.rhs}>
                                     <AutoComplete
                                         label='organisation'
                                         value={this.kba.selected_organisation}
                                         onFilter={(text, callback) => this.kba.getOrganisationListFiltered(text, callback)}
                                         minTextSize={1}
                                         onSelect={(label, data) => this.kba.selectOrganisation(label, data)}
                                     />
                                 </div>
                             </div>
                         }

                         { this.state.selected_tab === 'organisations' &&
                             <Organisations kba={this.kba}
                                            openDialog={() => this.openDialog()}
                                            closeDialog={() => this.closeDialog()}
                                            onError={(title, errStr) => this.showError(title, errStr)} />
                         }

                         { this.state.selected_tab === 'users' &&
                            <UserManager onError={(title, errStr) => this.showError(title, errStr)}
                                         selected_organisation_id={selected_organisation_id}
                                         openDialog={() => this.openDialog()}
                                         closeDialog={() => this.closeDialog()}
                                         kba={this.kba} />
                         }

                         { this.state.selected_tab === 'knowledge bases' &&
                            <KnowledgeBases onError={(title, errStr) => this.showError(title, errStr)}
                                            openDialog={() => this.openDialog()}
                                            closeDialog={() => this.closeDialog()}
                                            kba={this.kba} />
                         }

                         { this.state.selected_tab === 'knowledge' &&
                             <KnowledgeManager onError={(title, errStr) => this.showError(title, errStr)}
                                               openDialog={() => this.openDialog()}
                                               closeDialog={() => this.closeDialog()}
                                               kba={this.kba} />
                         }

                         { this.state.selected_tab === 'document sources' &&
                            <DocumentSources onError={(title, errStr) => this.showError(title, errStr)}
                                             openDialog={() => this.openDialog()}
                                             closeDialog={() => this.closeDialog()}
                                             kba={this.kba} />
                         }

                         { this.state.selected_tab === 'documents' &&
                             <Documents onError={(title, errStr) => this.showError(title, errStr)}
                                        openDialog={() => this.openDialog()}
                                        closeDialog={() => this.closeDialog()}
                                        kba={this.kba} />
                         }

                         { this.state.selected_tab === 'mind' &&
                             <Mind onError={(title, errStr) => this.showError(title, errStr)}
                                   openDialog={() => this.openDialog()}
                                   closeDialog={() => this.closeDialog()}
                                   kba={this.kba} />
                         }

                         { this.state.selected_tab === 'synonyms' &&
                             <Synonyms onError={(title, errStr) => this.showError(title, errStr)}
                                       openDialog={() => this.openDialog()}
                                       closeDialog={() => this.closeDialog()}
                                       kba={this.kba} />
                         }

                         { this.state.selected_tab === 'semantics' &&
                             <Semantics onError={(title, errStr) => this.showError(title, errStr)}
                                        openDialog={() => this.openDialog()}
                                        closeDialog={() => this.closeDialog()}
                                       kba={this.kba} />
                         }

                         { this.state.selected_tab === 'reports' &&
                             <Reports onError={(title, errStr) => this.showError(title, errStr)}
                                      openDialog={() => this.openDialog()}
                                      closeDialog={() => this.closeDialog()}
                                      kba={this.kba} />
                         }

                         { this.state.selected_tab === 'license' &&
                             <License
                                 openDialog={() => this.openDialog()}
                                 closeDialog={() => this.closeDialog()}
                                 onError={(title, errStr) => this.showError(title, errStr)} />
                         }

                         {/*{ this.state.selected_tab === 'os' &&*/}
                         {/*    <OS onError={(title, errStr) => this.showError(title, errStr)}*/}
                         {/*        kba={this.kba} />*/}
                         {/*}*/}

                         {
                             this.state.selected_tab === 'invalid' &&
                             <div>You do not have access to this application</div>
                         }

                     </div>

                 </div>


                { this.hasNotifications() && this.state.show_notifications &&
                    <div style={styles.notifications}>
                        <div style={styles.displayAll} onClick={() => { this.setState({show_notifications: false}) }}>
                            <img src="../images/double-down-arrow.svg" style={styles.displayAllImage} alt="hide all" title="hide log" />
                        </div>
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
                }

                { this.hasNotifications() && !this.state.show_notifications &&
                    <div style={styles.notificationsHidden}>
                        <div style={styles.displayAll} onClick={() => { this.setState({show_notifications: true}) }}>
                            <img src="../images/double-up-arrow.svg" style={styles.displayAllImage} alt="show all" title="show logs" />
                        </div>
                    </div>
                }

            </MuiThemeProvider>
        )
    }
}

export default Home;
