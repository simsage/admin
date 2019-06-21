import React from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import uiTheme from "../theme-ui";

import {State} from '../common/state'
import {Api} from '../common/api'
import AppMenu from '../auth/app-menu'
import ErrorDialog from '../common/error-dialog'

import Organisations from "./organisations";
import Users from "./users";
import KnowledgeBases from "./knowledgebases";
import Knowledge from "./knowledge";
import Documents from "./documents";
import AutoComplete from '../common/autocomplete'
import KnowledgeBaseAware from "./knowledge_base_aware";
import Crawlers from "../crawlers/crawlers";
import Mind from "./mind";
import Synonyms from "./synonyms";
import Reports from "./reports";


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
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentDidMount() {
        State.checkSession();
        this.kba.componentDidMount();
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
    render() {
        if (this.state.has_error) {
            return <h1>home.js: Something went wrong.</h1>;
        }
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
                             <div style={this.getStyle('users')}
                                  onClick={() => this.setState({selected_tab: 'users'})}>user manager</div>
                         }
                         {
                             Home.hasRole(this.state.user, ['admin', 'manager']) &&
                             <div style={this.getStyle('knowledge bases')}
                                  onClick={() => this.setState({selected_tab: 'knowledge bases'})}>knowledge bases</div>
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
                             Home.hasRole(this.state.user, ['reporter']) &&
                             <div style={this.getStyle('reports')}
                                  onClick={() => this.setState({selected_tab: 'reports'})}>reports</div>
                         }
                     </div>

                     <div style={styles.pageContent}>

                         {this.state.selected_tab !== 'organisations' &&
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
                                            onError={(title, errStr) => this.showError(title, errStr)} />
                         }

                         { this.state.selected_tab === 'users' &&
                            <Users onError={(title, errStr) => this.showError(title, errStr)}
                                   kba={this.kba} />
                         }

                         { this.state.selected_tab === 'knowledge bases' &&
                            <KnowledgeBases onError={(title, errStr) => this.showError(title, errStr)}
                                            kba={this.kba} />
                         }

                         { this.state.selected_tab === 'knowledge' &&
                             <Knowledge onError={(title, errStr) => this.showError(title, errStr)}
                                        kba={this.kba} />
                         }

                         { this.state.selected_tab === 'document sources' &&
                            <Crawlers onError={(title, errStr) => this.showError(title, errStr)}
                                      kba={this.kba} />
                         }

                         { this.state.selected_tab === 'documents' &&
                             <Documents onError={(title, errStr) => this.showError(title, errStr)}
                                        kba={this.kba} />
                         }

                         { this.state.selected_tab === 'mind' &&
                             <Mind onError={(title, errStr) => this.showError(title, errStr)}
                                   kba={this.kba} />
                         }

                         { this.state.selected_tab === 'synonyms' &&
                             <Synonyms onError={(title, errStr) => this.showError(title, errStr)}
                                       kba={this.kba} />
                         }

                         { this.state.selected_tab === 'reports' &&
                             <Reports onError={(title, errStr) => this.showError(title, errStr)}
                                      kba={this.kba} />
                         }

                         {
                             this.state.selected_tab === 'invalid' &&
                             <div>You do not have access to this application</div>
                         }

                     </div>

                 </div>


            </MuiThemeProvider>
        )
    }
}

export default Home;
