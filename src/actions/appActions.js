import GraphHelper from '../common/graph-helper'
import Api from '../common/api'

import {
    ADD_CONVERSATION,
    BUSY,
    SET_THEME,
    RESET_SELECTED_KB,
    CLEAR_PREVIOUS_ANSWER,
    CLOSE_ERROR,
    ERROR,
    GET_CRAWLERS,
    GET_DOMAINS,
    GET_DOCUMENTS_PAGINATED,
    GET_HTML5_NOTIFICATIONS,
    GET_KNOWLEDGE_BASES,
    GET_INVENTORIZE_LIST,
    GET_LICENSE,
    SET_ORGANISATION_LIST,
    SET_ORGANISATION_FILTER,
    GET_INVENTORIZE_BUSY,
    GET_OS_MESSAGES,
    GET_STATS,
    SET_USER_LIST,
    SET_USER_FILTER,
    HIDE_NOTIFICATIONS,
    MARK_CONVERSATION_USED,

    OPERATOR_CLEAR_USER,
    OPERATOR_READY,
    PASSWORD_RESET_REQUEST,
    PROCESS_OPERATOR_MESSAGE,
    RESET_DOCUMENT_PAGINATION,
    RESET_PASSWORD,
    SET_SYNSET_PAGE,
    SET_SYNSET_PAGE_SIZE,
    RESTORE_SYSTEM,
    SELECT_KNOWLEDGE_BASE,
    SELECT_EDGE_DEVICE,
    SELECT_ORGANISATION,
    UPDATE_ORGANISATION,
    SELECT_TAB,
    SET_MIND_QUERY_LIST,
    SET_MIND_QUERY_STRING,
    SET_DOCUMENT_FILTER,
    SET_DOCUMENT_PAGE,
    SET_DOCUMENT_PAGE_SIZE,

    SET_MEMORY_FILTER,
    SET_MEMORIES_PAGINATED,
    SET_MEMORIES_PAGE_SIZE,
    SET_MEMORIES_PAGE,
    RESET_MEMORIES_PAGINATION,

    SET_NOTIFICATION_LIST,
    SET_OPERATOR_ANSWER,
    SET_OPERATOR_CONNECTED,
    SET_OPERATOR_QUESTION,
    STOP_CLIENT_TYPING,
    ADD_OPERATOR,
    REMOVE_OPERATOR,
    MAX_OPERATORS,
    SET_REPORT_DATE,
    SET_REPORT_GRAPHS,

    SET_SEMANTICS_PAGINATED,
    SET_SEMANTIC_PAGE_SIZE,
    SET_SEMANTIC_PAGE,
    RESET_SEMANTIC_PAGINATION,
    SET_SEMANTIC_FILTER,

    SET_SEMANTIC_DISPLAY_LIST,

    SET_SYNONYM_FILTER,
    SET_SYNONYMS_PAGINATED,
    RESET_SYNONYM_PAGINATION,
    SET_SYNONYM_PAGE_SIZE,
    SET_SYNONYM_PAGE,

    SET_SYNSET_LIST,
    SET_SYNSET_FILTER,
    RESET_SYNSET_PAGINATION,
    SHOW_NOTIFICATIONS,
    SIGN_IN,
    SIGN_OUT,
    UPDATE_USER,
    UPLOADING_PROGRAM,
    UPLOADING_PROGRAM_FINISHED,

    UPLOADING_WP_ARCHIVE,
    UPLOADING_WP_ARCHIVE_FINISHED,

    SET_LOG_LIST,
    SET_LOG_DATE,
    SET_LOG_HOURS,
    SET_LOG_TYPE,
    SET_LOG_SERVICE,
    SET_LOG_REFRESH,

    // the edge
    GET_EDGE_DEVICES,
    GET_EDGE_DEVICE_COMMANDS,

    // groups
    SET_GROUPS_PAGINATED,
    SET_GROUP_PAGE_SIZE,
    SET_GROUP_PAGE,
    SET_GROUP_FILTER,

} from "./actions";

import {Comms} from "../common/comms";

// not in state system - bad in the state system
let notification_busy = false;

async function _getOrganisationList(current_org_name, current_org_id, _filter, change_organisation, dispatch) {
    dispatch({type: BUSY, busy: true});
    let filter = _filter;
    if (!_filter || _filter.trim() === "") {
        filter = "null";
    }
    await Comms.http_get('/auth/user/organisations/' + encodeURIComponent(filter),
        (response) => {
            const organisation_list = response.data;
            dispatch({type: SET_ORGANISATION_LIST, organisation_list: organisation_list});
            // select an organisation if there is one to select and none yet has been selected
            if (change_organisation && organisation_list && organisation_list.length > 0 && current_org_id.length === 0) {
                dispatch({type: SELECT_ORGANISATION, name: organisation_list[0].name, id: organisation_list[0].id});
                // and get the knowledge bases for this org
                _getKnowledgeBases(organisation_list[0].id, dispatch);
            }
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getKnowledgeBases(organisation_id, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/knowledgebase/' + encodeURIComponent(organisation_id),
        (response) => {
            dispatch({type: GET_KNOWLEDGE_BASES, knowledge_base_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getInventorizeList(organisation_id, kb_id, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/document/parquets/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/0/5',
            (response) => {
                dispatch({type: GET_INVENTORIZE_LIST, inventorize_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getUsers(organisation_id, filter, dispatch) {
    dispatch({type: BUSY, busy: true});
    if (!filter || filter.trim() === '') {
        filter = 'null';
    }
    await Comms.http_get('/auth/users/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(filter),
        (response) => {
            dispatch({type: SET_USER_LIST, user_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getCrawlers(organisation_id, kb_id, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                dispatch({type: GET_CRAWLERS, crawler_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getDomains(organisation_id, kb_id, page, page_size, filter, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/knowledgebase/domains', {
                "organisationId": organisation_id, "kbId": kb_id, "page": page, "pageSize": page_size, "filter": filter
            },
            (response) => {
                dispatch({type: GET_DOMAINS, domain_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_post('/document/documents', {
                "organisationId": organisation_id, "kbId": kb_id,
                "prevUrl": document_previous ? document_previous : 'null',
                "pageSize": document_page_size,
                "filter": document_filter
            },
            (response) => {
                const document_list = response.data.documentList;
                const num_documents = response.data.numDocuments;
                dispatch(({
                    type: GET_DOCUMENTS_PAGINATED,
                    document_list: document_list,
                    num_documents: num_documents,
                    document_filter: document_filter
                }));
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getMemories(organisation_id, kb_id, prev_id, mind_filter, mind_item_page_size, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const data = {
            "organisationId": organisation_id, "kbId": kb_id, "prevId": prev_id ? prev_id : "null",
            "filter": mind_filter, "pageSize": mind_item_page_size
        };
        await Comms.http_put('/mind/memories', data,
            (response) => {
                dispatch({type: SET_MEMORIES_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const data = {
            "organisationId": organisation_id, "kbId": kb_id, "prevId": prev_id ? prev_id : "",
            "filter": synonym_filter, "pageSize": synonym_page_size
        };
        await Comms.http_put('/language/synonyms', data,
            (response) => {
                dispatch({type: SET_SYNONYMS_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/semantics', {
                "organisationId": organisation_id, "kbId": kb_id, "prevWord": prev_word ? prev_word : "",
                "filter": semantic_filter, "pageSize": semantic_page_size
            },
            (response) => {
                dispatch({type: SET_SEMANTICS_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getSemanticDisplayCategories(organisation_id, kb_id, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/language/semantic-display-categories/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                dispatch({type: SET_SEMANTIC_DISPLAY_LIST,
                    semantic_display_category_list: response.data.semanticDisplayCategoryList,
                    defined_semantic_list: response.data.semanticList
                });
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            });
    } else {
        dispatch({type: SET_SEMANTIC_DISPLAY_LIST, semantic_display_category_list: [], defined_semantic_list: []});
    }
}

async function _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/find-syn-sets', {
                "organisationId": organisation_id, "kbId": kb_id,
                "page": page, "pageSize": page_size, "filter": filter
            },
            (response) => {
                dispatch({type: SET_SYNSET_LIST, synset_list: response.data.list, total_size: response.data.totalSize});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getReports(organisation_id, kb_id, year, month, top, dispatch) {
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/stats/stats/' + encodeURIComponent(organisation_id) + '/' +
                                encodeURIComponent(kb_id) + '/' +
                                encodeURIComponent(year) + '/' +
                                encodeURIComponent(month) + '/' +
                                encodeURIComponent(top),
            (response) => {
                const report = response.data;
                const access_frequency = GraphHelper.setupList(report.accessFrequency, "access");
                const general_statistics = GraphHelper.setupMap(report.generalStatistics, "system");
                const query_word_frequency = GraphHelper.setupMap(report.queryWordFrequency, "queries (top " + top + ")");
                const file_type_statistics = GraphHelper.setupMap(report.fileTypeStatistics, "file types");
                dispatch({type: SET_REPORT_GRAPHS, access_frequency: access_frequency,
                                    general_statistics: general_statistics,
                                    query_word_frequency: query_word_frequency,
                                    file_type_statistics: file_type_statistics
                });
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    } else {
        dispatch({type: SET_REPORT_GRAPHS,
            access_frequency: GraphHelper.setupList([]),
            general_statistics: GraphHelper.setupMap([]), query_word_frequency: GraphHelper.setupMap([]),
            file_type_statistics: GraphHelper.setupMap([])});
    }
}

// get list of logs
async function _getLogList(organisation_id, year, month, day, hour, hours, dispatch) {
    if (year && month && day && hour && hours) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/stats/system-logs/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(year) + '/' +
            encodeURIComponent(month) + '/' + encodeURIComponent(day) + '/' + encodeURIComponent(hour) + '/' + encodeURIComponent(hours),
            (response) => {
                const data = response.data;
                dispatch({
                    type: SET_LOG_LIST, log_list: data.logList,
                })
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

async function _getHtmlNotifications(dispatch) {
    if (window.Notification && window.Notification.permission !== "granted" &&
        window.Notification.requestPermission) {
        //if it is not supported request permission
        window.Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            dispatch({type: GET_HTML5_NOTIFICATIONS, status: status});
        })
    }
}


async function _getEdgeDevices(organisation_id, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/edge/' + encodeURIComponent(organisation_id),
        (response) => {
            dispatch({type: GET_EDGE_DEVICES, edge_device_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}


async function _getEdgeDeviceCommands(organisation_id, edge_id, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/edge/command/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id),
        (response) => {
            dispatch({type: GET_EDGE_DEVICE_COMMANDS, edge_device_command_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}


async function _getGroups(organisation_id, dispatch) {
    if (organisation_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/auth/groups/' + encodeURIComponent(organisation_id),
            (response) => {
                dispatch({type: SET_GROUPS_PAGINATED, group_list: response.data.groupList});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}



// setup a page for different tabs
async function _setupPage(selected_tab, dispatch, getState) {
    const organisation_id = getState().appReducer.selected_organisation_id;
    const organisation = getState().appReducer.selected_organisation;
    const kb_id = getState().appReducer.selected_knowledgebase_id;

    // don't reset when you're the operator
    if (selected_tab !== 'operator' &&
        (!organisation_id || organisation_id.length === 0 || !organisation || organisation.length === 0)) {
        dispatch({type: RESET_SELECTED_KB});
    }

    const user_list = getState().appReducer.user_list;
    const group_list = getState().appReducer.group_list;

    if (selected_tab === 'users' && organisation_id !== '') {
        const filter = getState().appReducer.user_filter;

        await _getUsers(organisation_id, filter, dispatch);
        if (!group_list || group_list.length === 0) {
            await _getGroups(organisation_id, dispatch);
        }

    } else if (selected_tab === 'groups' && organisation_id !== '') {
        if (!user_list || user_list.length === 0) {
            const user_filter = getState().appReducer.user_filter;
            await _getUsers(organisation_id, user_filter, dispatch);
        }
        await _getGroups(organisation_id, dispatch);

    } else if (selected_tab === 'organisations') {
        const name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        const filter = getState().appReducer.organisation_filter;
        await _getOrganisationList(name, id, filter, true, dispatch);

    } else if (selected_tab === 'edge devices' && organisation_id !== '') {
        await _getEdgeDevices(organisation_id, dispatch);

    } else if (selected_tab === 'edge commands' && organisation_id !== '') {
        const edge_id = getState().appReducer.selected_edge_device_id;
        if (edge_id && edge_id !== '') {
            await _getEdgeDeviceCommands(organisation_id, edge_id, dispatch);
        }

    } else if (selected_tab === 'knowledge bases') {
        const id = getState().appReducer.selected_organisation_id;
        if (id !== '') {
            await _getKnowledgeBases(id, dispatch);
        }

    } else if (selected_tab === 'document sources' && organisation_id !== '' && kb_id !== '') {
        if (!user_list || user_list.length === 0) {
            const user_filter = getState().appReducer.user_filter;
            await _getUsers(organisation_id, user_filter, dispatch);
        }

        if (!group_list || group_list.length === 0) {
            await _getGroups(organisation_id, dispatch);
        }

        await _getCrawlers(organisation_id, kb_id, dispatch);

    } else if (selected_tab === 'documents' && organisation_id !== '' && kb_id !== '') {
        dispatch({type:RESET_DOCUMENT_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const document_filter = getState().appReducer.document_filter;
        const document_previous = 'null'; // reset
        const document_page_size = getState().appReducer.document_page_size;
        await _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch);

    } else if (selected_tab === 'syn-sets' && organisation_id !== '' && kb_id !== '') {
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
        dispatch({type: RESET_SYNSET_PAGINATION});

    } else if (selected_tab === 'inventory' && organisation_id !== '' && kb_id !== '') {
        await _getInventorizeList(organisation_id, kb_id, dispatch);

    } else if (selected_tab === 'reports' && organisation_id !== '' && kb_id !== '') {
        const top = getState().appReducer.report_num_items;
        const date = new Date(getState().appReducer.report_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        await _getReports(organisation_id, kb_id, year, month, top, dispatch);

    } else if (selected_tab === 'logs' && organisation_id !== '') {
        const date = new Date(getState().appReducer.log_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const hours = getState().appReducer.log_hours;
        await _getLogList(organisation_id, year, month, day, hour, hours, dispatch);

    } else if (selected_tab === 'mind') {
        dispatch({type:RESET_MEMORIES_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        if (organisation_id && kb_id) {
            await _getMemories(organisation_id, kb_id, null, mind_item_filter, mind_item_page_size, dispatch);
        } else {
            dispatch({type: SET_MEMORIES_PAGINATED, data: {mindItemList: [], numMindItems: 0, filter: ''} });
        }

    } else if (selected_tab === 'synonyms') {
        dispatch({type: RESET_SYNONYM_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const synonym_filter = getState().appReducer.synonym_filter;
        const synonym_page_size = getState().appReducer.synonym_page_size;
        if (organisation_id && kb_id) {
            await _getSynonyms(organisation_id, kb_id, "", synonym_filter, synonym_page_size, dispatch);
        } else {
            dispatch({type: SET_SYNONYMS_PAGINATED, data: {synonymList: [], numSynonyms: 0, filter: ""} });
        }

    } else if (selected_tab === 'semantics') {
        dispatch({type: RESET_SEMANTIC_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const semantic_filter = getState().appReducer.semantic_filter;
        const semantic_page_size = getState().appReducer.semantic_page_size;
        if (organisation_id && kb_id) {
            await _getSemantics(organisation_id, kb_id, "", semantic_filter, semantic_page_size, dispatch);
        } else {
            dispatch({type: SET_SEMANTICS_PAGINATED, data: {semanticList: [], numSemantics: 0, filter: ""} });
        }

    } else if (selected_tab === 'active directory') {
        dispatch({type: BUSY, busy: true});
        if (organisation_id && kb_id) {
            await _getDomains(organisation_id, kb_id, 0, 10, '', dispatch);
        } else {
            dispatch({type: GET_DOMAINS, domain_list: []});
        }
    }

}


// application creators / actions
export const appCreators = {

    // do a sign in
    signIn: (email, password, callback) => async (dispatch, getState) => {
        if (email && email.length > 0 && password && password.length > 0) {
            dispatch({type: BUSY, busy: true});
            await Comms.http_post('/auth/sign-in', {"email": email, "password": password},
                (response) => {
                    dispatch({type: SIGN_IN, session: response.data.session, user: response.data.user});
                    if (callback) {
                        callback();
                    }
                },
                (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
            )
        } else {
            dispatch({type: ERROR, title: "Error", error: 'please complete and check all fields'});
        }
    },

    signOut: () => async (dispatch, getState) => {
        appCreators.setLogRefresh(0);   // stop log fetching
        dispatch({type: SIGN_OUT});
    },

    notBusy: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: false});
    },

    setTheme: (theme) => async (dispatch, getState) => {
        dispatch({type: SET_THEME, theme: theme});
    },

    passwordResetRequest: (email) => ({type: PASSWORD_RESET_REQUEST}),

    resetPassword: (email, newPassword, reset_id) => ({type: RESET_PASSWORD, email, newPassword, reset_id}),

    getStats: (year, month, top) => ({type: GET_STATS, year, month, top}),

    getOSMessages: () => ({type: GET_OS_MESSAGES}),

    restoreSystem: (data) => ({type: RESTORE_SYSTEM, data}),

    getLicense: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/auth/license',
            (response) => {
                dispatch(({type: GET_LICENSE, license: response.data}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    installLicense: (license_str) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_post('/auth/license', {"license": license_str},
            (response) => {
                dispatch(({type: GET_LICENSE, license: response.data}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    setError: (title, error) => ({type: ERROR, title, error}),

    closeError: () => ({type: CLOSE_ERROR}),

    // set the active tab
    selectTab: (selected_tab) => async (dispatch, getState) => {
        dispatch(({type: SELECT_TAB, selected_tab}));
        await _setupPage(selected_tab, dispatch, getState);
    },

    setupManager: () => async (dispatch, getState) => {
        dispatch(({type: SELECT_TAB, selected_tab: 'knowledge bases'}));
        await _getOrganisationList('', '', '', true, dispatch);
        await _setupPage('knowledge bases', dispatch, getState);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Notification system

    hideNotifications: () => ({type: HIDE_NOTIFICATIONS}),

    showNotifications: () => ({type: SHOW_NOTIFICATIONS}),

    getNotifications: () => async (dispatch, getState) => {
        if (!notification_busy) {
            notification_busy = true;
            const nl = getState().appReducer.notification_list;
            await Comms.http_get('/stats/stats/os',
                (response) => {
                    const notification_list = Api.merge_notifications(nl, response.data.notificationList);
                    if (notification_list.length !== nl.length) { // update?
                        dispatch(({type: SET_NOTIFICATION_LIST, notification_list}));
                    }
                    notification_busy = false;
                },
                (errStr) => {
                    console.log("error getting os-messages:" + errStr);
                    notification_busy = false;
                }
            )
        }
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Organisations

    // retrieve list of all organisations from server
    getOrganisationList: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        const filter = getState().appReducer.organisation_filter;
        await _getOrganisationList(name, id, filter, true, dispatch);
    },

    // select an organisation for operational stuff
    selectOrganisation: (data) => async (dispatch, getState) => {
        if (data && data.id && data.id.length > 0) {
            dispatch({type: BUSY, busy: true});
            dispatch(({type: SELECT_ORGANISATION, name: data.name, id: data.id}));
            await _getKnowledgeBases(data.id, dispatch);

            const selected_tab = getState().appReducer.selected_tab;
            await _setupPage(selected_tab, dispatch, getState);
        } else {
            dispatch(({type: SELECT_ORGANISATION, name: "", id: ""}));
        }
    },

    setOrganisationFilter: (filter) => ({type: SET_ORGANISATION_FILTER, filter}),

    // organisation save
    updateOrganisation: (organisation) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/auth/organisation',
            organisation,
            (response) => {
                dispatch(({type: UPDATE_ORGANISATION, organisation: response.data}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // organisation remove
    deleteOrganisation: (organisation_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        const filter = getState().appReducer.organisation_filter;
        await Comms.http_delete('/auth/organisation/' + encodeURIComponent(organisation_id),
            (response) => {
                _getOrganisationList(name, id, filter, false, dispatch);
                // did we just delete the active organisation?
                if (id === organisation_id) {
                    dispatch({type: SELECT_ORGANISATION, name: '', id: ''});
                    dispatch({type: GET_KNOWLEDGE_BASES, knowledge_base_list: []});
                }
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Knowledge bases

    // selected a knowledge base for operational stuff
    selectEdgeDevice: (data) => async (dispatch, getState) => {
        if (data && data.id && data.id.length > 0) {
            dispatch({type: BUSY, busy: true});
            const selected_tab = getState().appReducer.selected_tab;
            dispatch({type: SELECT_EDGE_DEVICE, name: data.name, id: data.id});
            await _setupPage(selected_tab, dispatch, getState);
        } else {
            dispatch({type: SELECT_EDGE_DEVICE, name: "", id: ""});
        }
    },

    // selected a knowledge base for operational stuff
    selectKnowledgeBase: (data) => async (dispatch, getState) => {
        if (data && data.id && data.id.length > 0) {
            dispatch({type: BUSY, busy: true});
            const selected_tab = getState().appReducer.selected_tab;
            dispatch({type: SELECT_KNOWLEDGE_BASE, name: data.name, id: data.id});
            await _setupPage(selected_tab, dispatch, getState);
        } else {
            dispatch({type: SELECT_KNOWLEDGE_BASE, name: "", id: ""});
        }
    },

    // retrieve list of all organisations from server
    getKnowledgeBases: () => async (dispatch, getState) => {
        await _getKnowledgeBases(getState().appReducer.selected_organisation_id, dispatch);
    },

    optimizeIndexes: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const data = {'organisationId': organisation_id, 'kbId': kb_id};
        await Comms.http_put('/language/optimize-indexes', data,
            (response) => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    removeOptimizedIndexes: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/language/optimize-indexes/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    removeAllIndexes: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/language/indexes/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteKnowledgeBase: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/knowledgebase/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                _getKnowledgeBases(organisation_id, dispatch);
                dispatch({type: SELECT_KNOWLEDGE_BASE, name: '', id: ''});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateKnowledgeBase: (organisation_id, kb_id, name, email, security_id, enabled, max_queries_per_day,
                          analytics_window_size_in_months, operator_enabled, capacity_warnings,
                          created, index_optimization_schedule, dms_index_schedule) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"kbId": kb_id, "organisationId": organisation_id, "name": name, "email": email,
            "securityId": security_id, "maxQueriesPerDay": max_queries_per_day, "enabled": enabled,
            "analyticsWindowInMonths": analytics_window_size_in_months, "operatorEnabled": operator_enabled,
            "capacityWarnings": capacity_warnings, "created": created, "indexOptimizationSchedule": index_optimization_schedule,
            "dmsIndexSchedule": dms_index_schedule};
        await Comms.http_put('/knowledgebase/', payload,
            (response) => {
                _getKnowledgeBases(organisation_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    createInventory: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_post('/document/inventorize',
            {"kbId": kb_id, "organisationId": organisation_id},
            (response) => {
                _getInventorizeList(organisation_id, kb_id, dispatch);
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    getInventoryList: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await _getInventorizeList(organisation_id, kb_id, dispatch);
    },

    // remove a document (delete) from the system
    deleteInventoryItem: (dateTime) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        if (organisation_id.length > 0 && kb_id.length > 0) {
            dispatch({type: BUSY, busy: true});
            const full_url = '/document/parquet/' + encodeURIComponent(organisation_id) + '/' +
                                encodeURIComponent(kb_id) + '/' + encodeURIComponent(dateTime);
            await Comms.http_delete(full_url,
                (response) => {
                    _getInventorizeList(organisation_id, kb_id, dispatch);
                },
                (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
            )
        }
    },

    getInventoryBusy: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        if (organisation_id.length > 0 && kb_id.length > 0) {
            dispatch({type: BUSY, busy: true});
            await Comms.http_get('/document/inventorize/' + encodeURIComponent(organisation_id),
                (response) => {
                    dispatch({type: GET_INVENTORIZE_BUSY, busy: response.data});
                },
                (errStr) => {
                    dispatch({type: ERROR, title: "Error", error: errStr})
                }
            )
        }
    },

    forceInventoryBusy: () => (dispatch, getState) => {
        dispatch({type: GET_INVENTORIZE_BUSY, busy: true});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Users

    getUsers: (organisation_id) => async (dispatch, getState) => {
        const filter = getState().appReducer.user_filter;
        await _getUsers(organisation_id, filter, dispatch)
    },

    updateUser: (organisation_id, user_id, name, surname, email, password, role_list, kb_list, group_list) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const filter = getState().appReducer.user_filter;
        const signed_in_user = getState().appReducer.user;
        const actual_role_data = [];
        for (const roleStr of role_list) {
            actual_role_data.push({"userId": user_id, "organisationId": organisation_id, "role": roleStr});
        }
        const actual_kb_list_data = [];
        for (const kb of kb_list) {
            actual_kb_list_data.push({"userId": user_id, "organisationId": organisation_id, "kbId": kb.kbId});
        }
        await Comms.http_put('/auth/user/' + encodeURIComponent(organisation_id),
            {"id": user_id,
                "password": password,
                "firstName": name,
                "surname": surname,
                "email": email,
                "roles": actual_role_data,
                "operatorKBList": actual_kb_list_data,
                "groupList": group_list,
            },
            (response) => {
                const user = response.data;
                let had_operator_role = false;
                let has_operator_role = false;
                if (user && signed_in_user && user.id === signed_in_user.id) {
                    for (const role of signed_in_user.roles) {
                        if (role && role.role === 'operator') {
                            had_operator_role = true;
                        }
                    }
                    for (const role of user.roles) {
                        if (role && role.role === 'operator') {
                            has_operator_role = true;
                        }
                    }
                    // we need to ask if they want to receive html events!
                    if (!had_operator_role && has_operator_role) {
                        _getHtmlNotifications(dispatch);
                    }
                    dispatch({type: UPDATE_USER, user: user});
                }
                _getUsers(organisation_id, filter, dispatch)

            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteUser: (organisation_id, user_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const filter = getState().appReducer.user_filter;
        await Comms.http_delete('/auth/organisation/user/' + encodeURIComponent(user_id) + '/' +
            encodeURIComponent(organisation_id),
            (response) => {
                _getUsers(organisation_id, filter, dispatch)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    setUserFilter: (filter) => ({type: SET_USER_FILTER, filter}),

    uploadProgram: (payload) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: UPLOADING_PROGRAM}));
        await Comms.http_put('/knowledgebase/upload', payload,
            (response) => {
                dispatch(({type: UPLOADING_PROGRAM_FINISHED}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        );
    },

    // {"organisationId": "", "kbId": "", "sid": "", "sourceId": 0, "data": ";base64," + data}
    wpUploadArchive: (payload) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: UPLOADING_WP_ARCHIVE}));
        // get the sid
        const kb_list = getState().appReducer.knowledge_base_list;
        let sid = "";
        if (kb_list) {
            for (const kb of kb_list) {
                if (kb.kbId === payload.kbId) {
                    sid = kb.securityId;
                    break;
                }
            }
        }
        payload.sid = sid;
        await Comms.http_post('/crawler/admin/upload/archive', payload,
            (response) => {
                dispatch(({type: UPLOADING_WP_ARCHIVE_FINISHED}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        );
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Crawlers

    getCrawlers: (organisation_id, kb_id) => async (dispatch, getState) => {
        await _getCrawlers(organisation_id, kb_id, dispatch)
    },

    updateCrawler: (crawler) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_post('/crawler/crawler', crawler,
            (response) => {
                _getCrawlers(organisation_id, kb_id, dispatch)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteCrawler: (crawler_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_delete('/crawler/crawler/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(crawler_id),
            (response) => {
                _getCrawlers(organisation_id, kb_id, dispatch)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Active Directory / Domains

    getDomains: (organisation_id, kb_id) => async (dispatch, getState) => {
        await _getDomains(organisation_id, kb_id, 0, 10, "", dispatch);
    },

    updateDomain: (domain) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_put('/knowledgebase/domain', domain,
            (response) => {
                _getDomains(organisation_id, kb_id, 0, 10, "", dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    testDomain: (domain) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/knowledgebase/domain/test', domain,
            (response) => {
                dispatch({type: ERROR, title: "Success", error: "Connected Successfully"});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    deleteDomain: (domain_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_delete('/knowledgebase/domain/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(domain_id),
            (response) => {
                _getDomains(organisation_id, kb_id, 0, 10, "", dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Documents

    getDocuments: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const document_filter = getState().appReducer.document_filter;
        const prev_document_filter = getState().appReducer.prev_document_filter;
        const document_page_size = getState().appReducer.document_page_size;
        let document_previous = getState().appReducer.document_previous;
        // filter criteria changed?
        if (prev_document_filter !== document_filter) {
            dispatch({type:RESET_DOCUMENT_PAGINATION});
            document_previous = null;
        }
        if (organisation_id && kb_id) {
            await _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch);
        }
    },

    // update the document search filter (document_filter)
    setDocumentFilter: (filter) => ({type: SET_DOCUMENT_FILTER, filter}),

    // remove a document (delete) from the system
    deleteDocument: (url, crawler_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const document_filter = getState().appReducer.document_filter;
        const prev_document_filter = getState().appReducer.prev_document_filter;
        const document_page_size = getState().appReducer.document_page_size;
        let document_previous = getState().appReducer.document_previous;
        if (organisation_id && kb_id && url) {
            // filter criteria changed?
            if (prev_document_filter !== document_filter) {
                dispatch({type:RESET_DOCUMENT_PAGINATION});
                document_previous = null;
            }
            const full_url = '/document/document/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + btoa(unescape(encodeURIComponent(url))) + '/' +
                                    encodeURIComponent(crawler_id);
            await Comms.http_delete(full_url,
                (response) => {
                    _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch);
                },
                (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
            )
        }
    },

    // update the document paged set
    setDocumentPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const document_filter = getState().appReducer.document_filter;
        const document_page_size = getState().appReducer.document_page_size;

        const prevPage = getState().appReducer.document_page;
        const document_nav_list = getState().appReducer.document_nav_list;
        const document_list = getState().appReducer.document_list;
        if (page !== prevPage && page >= 0) {
            if (page > prevPage) {
                if (document_list.length > 0) {
                    const prev_url = document_list[document_list.length - 1].url;
                    dispatch(({type: SET_DOCUMENT_PAGE, page, prev_url}));
                    await _getDocuments(organisation_id, kb_id, prev_url, document_page_size, document_filter, dispatch);
                }
            } else if (page < document_nav_list.length) {
                const prev_url = document_nav_list[page];
                dispatch(({type: SET_DOCUMENT_PAGE, page, prev_url}));
                await _getDocuments(organisation_id, kb_id, prev_url, document_page_size, document_filter, dispatch);
            }
        }
    },

    // update the document paged set
    setDocumentPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_DOCUMENT_PAGE_SIZE, page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const document_filter = getState().appReducer.document_filter;
        await _getDocuments(organisation_id, kb_id, null, page_size, document_filter, dispatch);
    },


    // refresh / re-parse etc. a document
    reprocessDocument: (document) => async (dispatch, getState) => {
        const document_filter = getState().appReducer.document_filter;
        const document_previous = getState().appReducer.document_previous;
        const page_size = getState().appReducer.document_page_size;
        dispatch({type: BUSY, busy: true});
        await Comms.http_post('/document/reprocess', {
                "organisationId": document.organisationId, "kbId": document.kbId, "url": document.url
            },
            (response) => {
                _getDocuments(document.organisationId, document.kbId, document_previous, page_size, document_filter, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // mind items

    getMindItems: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const prev_mind_item_filter = getState().appReducer.prev_mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        let prev_id = getState().appReducer.mind_item_previous;
        // filter criteria changed?
        if (prev_mind_item_filter !== mind_item_filter) {
            dispatch({type:RESET_DOCUMENT_PAGINATION});
            prev_id = null;
        }
        if (organisation_id && kb_id) {
            await _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch);
        }
    },

    // update the mind-item paged set
    setMindItemPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mi_filter = getState().appReducer.mind_item_filter;
        const mi_page_size = getState().appReducer.mind_item_page_size;
        const prevPage = getState().appReducer.mind_item_page;
        const mind_item_nav_list = getState().appReducer.mind_item_nav_list;
        const mind_item_list = getState().appReducer.mind_item_list;
        if (page !== prevPage && page >= 0) {
            if (page > prevPage) {
                if (mind_item_list.length > 0) {
                    const prev_id = mind_item_list[mind_item_list.length - 1].id;
                    dispatch(({type: SET_MEMORIES_PAGE, page, prev_id}));
                    await _getMemories(organisation_id, kb_id, prev_id, mi_filter, mi_page_size, dispatch);
                }
            } else if (page < mind_item_nav_list.length) {
                const prev_id = mind_item_nav_list[page];
                dispatch(({type: SET_MEMORIES_PAGE, page, prev_id}));
                await _getMemories(organisation_id, kb_id, prev_id, mi_filter, mi_page_size, dispatch);
            }
        }
    },

    // update the mind-item paged set
    setMindItemPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_MEMORIES_PAGE_SIZE, page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mi_filter = getState().appReducer.mind_item_filter;
        await _getMemories(organisation_id, kb_id, null, mi_filter, page_size, dispatch);
    },


    // update the mind item search filter
    setMindItemFilter: (filter) => ({type: SET_MEMORY_FILTER, filter}),

    // remove a mind item by id
    deleteMemory: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        await Comms.http_delete('/mind/memory/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // remove a mind item by id
    deleteAllMemories: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        await Comms.http_delete('/mind/delete-all/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // save a mind item to simsage
    saveMemory: (memory) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        await Comms.http_put('/mind/memory/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), memory,
            (response) => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    mindQuery: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const bot_query_page_size = getState().appReducer.bot_query_page_size;
        const bot_query = getState().appReducer.bot_query;
        if (bot_query.length > 0) {
            const data = {
                organisationId: organisation_id,
                kbList: [{'kbId': kb_id, 'sid': ''}],
                query: bot_query,
                numResults: bot_query_page_size,
                scoreThreshold: 0.01,
            };
            await Comms.http_put('/mind/query', data,
                (response) => {
                    dispatch({type: SET_MIND_QUERY_LIST, mind_result_list: response.data});
                },
                (errStr) => {
                    dispatch({type: ERROR, title: "Error", error: errStr})
                }
            );
        } else {
            dispatch({type: SET_MIND_QUERY_LIST, mind_result_list: []});
        }
    },

    setBotQueryString: (query) => async (dispatch, getState) => {
        dispatch({type: SET_MIND_QUERY_STRING, bot_query: query});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // synonyms

    getSynonyms: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const synonym_filter = getState().appReducer.synonym_filter;
        const prev_synonym_filter = getState().appReducer.prev_synonym_filter;
        const synonym_page_size = getState().appReducer.synonym_page_size;
        let prev_id = getState().appReducer.synonym_prev_id;
        // filter criteria changed?
        if (prev_synonym_filter !== synonym_filter) {
            dispatch({type: RESET_SYNONYM_PAGINATION});
            prev_id = null;
        }
        if (organisation_id && kb_id) {
            await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch);
        }
    },

    // update the synonym page
    setSynonymPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const synonym_filter = getState().appReducer.synonym_filter;
        const synonym_page_size = getState().appReducer.synonym_page_size;
        const prevPage = getState().appReducer.synonym_page;
        const synonym_nav_list = getState().appReducer.synonym_nav_list;
        const synonym_list = getState().appReducer.synonym_list;
        if (page !== prevPage && page >= 0) {
            if (page > prevPage) {
                if (synonym_list.length > 0) {
                    const prev_id = synonym_list[synonym_list.length - 1].id;
                    dispatch(({type: SET_SYNONYM_PAGE, page, prev_id}));
                    await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch);
                }
            } else if (page < synonym_nav_list.length) {
                const prev_id = synonym_nav_list[page];
                dispatch(({type: SET_SYNONYM_PAGE, page, prev_id}));
                await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch);
            }
        }
    },

    // update the synonym list page-size
    setSynonymPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_SYNONYM_PAGE_SIZE, page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const synonym_filter = getState().appReducer.synonym_filter;
        await _getSynonyms(organisation_id, kb_id, null, synonym_filter, page_size, dispatch);
    },

    deleteSynonym: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const prev_id = getState().appReducer.synonym_prev_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        await Comms.http_delete('/language/delete-synonym/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => {
                _getSynonyms(organisation_id, kb_id, prev_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    saveSynonym: (synonym) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const prev_id = getState().appReducer.synonym_prev_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        Comms.http_put('/language/save-synonym/' + encodeURIComponent(organisation_id) + '/' +
                            encodeURIComponent(kb_id), synonym,
            (response) => {
                _getSynonyms(organisation_id, kb_id, prev_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSynonymFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_SYNONYM_FILTER, synonym_filter: filter});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantics

    getSemantics: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const semantic_filter = getState().appReducer.semantic_filter;
        const prev_semantic_filter = getState().appReducer.prev_semantic_filter;
        const semantic_page_size = getState().appReducer.semantic_page_size;
        let prev_word = getState().appReducer.semantic_prev_word;
        // filter criteria changed?
        if (prev_semantic_filter !== semantic_filter) {
            dispatch({type: RESET_SEMANTIC_PAGINATION});
            prev_word = null;
        }
        if (organisation_id && kb_id) {
            await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch);
        }
    },

    // update the semantic page
    setSemanticPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const semantic_filter = getState().appReducer.semantic_filter;
        const semantic_page_size = getState().appReducer.semantic_page_size;
        const prevPage = getState().appReducer.semantic_page;
        const semantic_nav_list = getState().appReducer.semantic_nav_list;
        const semantic_list = getState().appReducer.semantic_list;
        if (page !== prevPage && page >= 0) {
            if (page > prevPage) {
                if (semantic_list.length > 0) {
                    const prev_word = semantic_list[semantic_list.length - 1].word;
                    dispatch(({type: SET_SEMANTIC_PAGE, page, prev_word: prev_word}));
                    await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch);
                }
            } else if (page < semantic_nav_list.length) {
                const prev_word = semantic_nav_list[page];
                dispatch(({type: SET_SEMANTIC_PAGE, page, prev_word}));
                await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch);
            }
        }
    },

    // update the semantic page-size
    setSemanticPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_SEMANTIC_PAGE_SIZE, page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const semantic_filter = getState().appReducer.semantic_filter;
        await _getSemantics(organisation_id, kb_id, null, semantic_filter, page_size, dispatch);
    },

    deleteSemantic: (word) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const prev_word = getState().appReducer.semantic_prev_word;
        const page_size = getState().appReducer.semantic_page_size;
        await Comms.http_delete('/language/delete-semantic/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(word),
            (response) => {
                _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    findSemantics: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        const prev_word = getState().appReducer.semantic_prev_word;
        await _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch);
    },

    saveSemantic: (semantic) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        const prev_word = '';
        Comms.http_put('/language/save-semantic/' + encodeURIComponent(organisation_id) + '/' +
                        encodeURIComponent(kb_id), semantic,
            (response) => {
                _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSemanticFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_SEMANTIC_FILTER, semantic_filter: filter});
    },

    getSemanticDisplayCategories: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await _getSemanticDisplayCategories(organisation_id, kb_id, dispatch);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantic display categories

    saveSemanticDisplayCategory: (prevDisplayName, displayName, semanticList) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_put('/language/semantic-display-category/',
            {"organisationId": organisation_id, "kbId": kb_id, "prevDisplayName": prevDisplayName,
                    "displayName": displayName, "semanticList": semanticList},
            (response) => {
                _getSemanticDisplayCategories(organisation_id, kb_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    deleteSemanticDisplayCategory: (displayName) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_delete('/language/semantic-display-category/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(displayName),
            (response) => {
                _getSemanticDisplayCategories(organisation_id, kb_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // syn-sets

    deleteSynSet: (lemma) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        await Comms.http_delete('/language/delete-syn-set/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(lemma),
            (response) => {
                _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    findSynSets: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
    },

    saveSynSet: (syn_set) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        Comms.http_put('/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), syn_set,
            (response) => {
                _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSynSetFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_SYNSET_FILTER, synset_filter: filter});
    },

    // update the syn-set page
    setSynSetPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;

        dispatch(({type: SET_SYNSET_PAGE, page: page}));
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
    },

    // update the syn-set pagination size
    setSynSetPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_SYNSET_PAGE_SIZE, page_size: page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const filter = getState().appReducer.synset_filter;

        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch);
    },


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // reports

    setReportDate: (report_date) => ({type: SET_REPORT_DATE, report_date}),

    getReports: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const top = getState().appReducer.report_num_items;
        const date = new Date(getState().appReducer.report_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        await _getReports(organisation_id, kb_id, year, month, top, dispatch);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // operator

    // add a new message to the list
    processOperatorMessage: (message) => ({type: PROCESS_OPERATOR_MESSAGE, message}),

    // set connected status of operator
    setOperatorConnected: (connected) => ({type: SET_OPERATOR_CONNECTED, connected}),

    // add a conversation to the list
    addConversation: (operatorId, item) => ({type: ADD_CONVERSATION, operatorId, item}),

    markConversationItemUsed: (operatorId, id) => ({type: MARK_CONVERSATION_USED, operatorId, id}),

    operatorReady: (operatorId, ready) => ({type: OPERATOR_READY, operatorId, ready}),

    setOperatorAnswer: (operatorId, id, answer) => ({type: SET_OPERATOR_ANSWER, operatorId, id, answer}),

    setOperatorQuestion: (operatorId, id, question) => ({type: SET_OPERATOR_QUESTION, operatorId, id, question}),

    clearPreviousAnswer: (operatorId) => ({type: CLEAR_PREVIOUS_ANSWER, operatorId}),

    clearUser: (operatorId) => ({type: OPERATOR_CLEAR_USER, operatorId}),

    addOperator: () => async (dispatch, getState) => {
        const operators = getState().appReducer.operators;
        if (operators.length < MAX_OPERATORS) {
            dispatch({type: ADD_OPERATOR});
        }
    },

    removeOperator: (id) => ({type: REMOVE_OPERATOR, id: id}),

    stopClientTyping: (operator_id) => ({type: STOP_CLIENT_TYPING, operator_id: operator_id}),

    // POST data to url for operator processing
    sendOperatorMessage: (url, data) => async (dispatch, getState) => {
        await Comms.http_post(url, data,
            (response) => {
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // log list

    getLogs: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const date = new Date(getState().appReducer.log_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const hours = getState().appReducer.log_hours;
        await _getLogList(organisation_id, year, month, day, hour, hours, dispatch);
    },

    setLogDate: (log_date) => ({type: SET_LOG_DATE, log_date}),

    setLogHours: (log_hours) => ({type: SET_LOG_HOURS, log_hours}),

    setLogType: (log_type) => ({type: SET_LOG_TYPE, log_type}),

    setLogService: (log_service) => ({type: SET_LOG_SERVICE, log_service}),

    setLogRefresh: (log_refresh) => async (dispatch, getState) => {
        dispatch({type: SET_LOG_REFRESH, log_refresh})
    },

    restartService: (subSystem) => async (dispatch, getState) => {
        const session = getState().appReducer.session;
        const organisation_id = getState().appReducer.selected_organisation_id;
        await Comms.http_get('/stats/restart-service/' + encodeURIComponent(session.id) + '/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(subSystem),
            (response) => {},
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Edge devices

    // retrieve list of all organisations from server
    getEdgeDevices: () => async (dispatch, getState) => {
        await _getEdgeDevices(getState().appReducer.selected_organisation_id, dispatch);
    },

    deleteEdgeDevice: (organisation_id, edge_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/edge/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id),
            (response) => {
                _getEdgeDevices(organisation_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateEdgeDevice: (organisation_id, edge_id, name, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"edgeId": edge_id, "organisationId": organisation_id, "name": name, "created": created};
        await Comms.http_put('/edge/', payload,
            (response) => {
                _getEdgeDevices(organisation_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateEdgeDeviceCommand: (organisation_id, edge_id, command, parameters, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"edgeId": edge_id, "organisationId": organisation_id, "command": command,
                         "parameters": parameters, "created": created, "executed": 0, "result": ""};
        await Comms.http_put('/edge/command', payload,
            (response) => {
                _getEdgeDeviceCommands(organisation_id, edge_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteEdgeDeviceCommand: (organisation_id, edge_id, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/edge/command/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id) + '/' + encodeURIComponent(created),
            (response) => {
                _getEdgeDeviceCommands(organisation_id, edge_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // html 5 notification permissions

    getHtml5Notifications: () => async (dispatch, getState) => {
        await _getHtmlNotifications(dispatch);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // restore a text file on the server

    restore: (base64_text) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        await Comms.http_put('/backup/restore', {"organisationId": organisation_id,"data": base64_text},
            (response) => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            })
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // groups

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantics

    getGroups: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        if (organisation_id) {
            await _getGroups(organisation_id, dispatch);
        }
    },

    // update the group page
    setGroupPage: (page) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_GROUP_PAGE, page}));
    },

    // update the semantic page-size
    setGroupPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_GROUP_PAGE_SIZE, page_size}));
    },

    deleteGroup: (name) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        await Comms.http_delete('/auth/group/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(name),
            (response) => {
                _getGroups(organisation_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    saveGroup: (name, user_id_list) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const data = {
            organisationId: organisation_id,
            name: name,
            userIdList: user_id_list
        }
        Comms.http_put('/auth/group',
            data,
            (response) => {
                _getGroups(organisation_id, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setGroupFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_GROUP_FILTER, group_filter: filter});
    },


};

