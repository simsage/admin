import GraphHelper from '../common/graph-helper'
import Api from '../common/api'

import {
    ADD_CONVERSATION,
    BUSY,
    CLEAR_PREVIOUS_ANSWER,
    CLOSE_ERROR,
    ERROR,
    GET_CRAWLERS,
    GET_DOCUMENTS_PAGINATED,
    GET_HTML5_NOTIFICATIONS,
    GET_KNOWLEDGE_BASES,
    GET_INVENTORIZE_LIST,
    GET_LICENSE,
    GET_ORGANISATION_LIST,
    GET_INVENTORIZE_BUSY,
    GET_OS_MESSAGES,
    GET_STATS,
    GET_USERS,
    HIDE_NOTIFICATIONS,
    MARK_CONVERSATION_USED,
    MIND_FIND,
    OPERATOR_CLEAR_USER,
    OPERATOR_READY,
    PASSWORD_RESET_REQUEST,
    PROCESS_OPERATOR_MESSAGE,
    RESET_DOCUMENT_PAGINATION,
    RESET_PASSWORD,
    RESTORE_SYSTEM,
    SELECT_KNOWLEDGE_BASE,
    SELECT_ORGANISATION,
    SELECT_TAB,
    SET_BOT_QUERY_LIST,
    SET_BOT_QUERY_STRING,
    SET_DOCUMENT_FILTER,
    SET_DOCUMENT_PAGE,
    SET_DOCUMENT_PAGE_SIZE,
    SET_MIND_ITEM_FILTER,
    SET_NOTIFICATION_LIST,
    SET_OPERATOR_ANSWER,
    SET_OPERATOR_CONNECTED,
    SET_OPERATOR_QUESTION,
    SET_REPORT_DATE,
    SET_REPORT_GRAPHS,
    SET_SEMANTIC_FILTER,
    SET_SEMANTIC_LIST,
    SET_SYNONYM_FILTER,
    SET_SYNONYM_LIST,
    SHOW_NOTIFICATIONS,
    SIGN_IN,
    SIGN_OUT,
    UPDATE_USER,
    UPLOADING_PROGRAM,
    UPLOADING_PROGRAM_FINISHED,
    SET_LOG_LIST,
} from "./actions";

import {Comms} from "../common/comms";

// not in state system - bad in the state system
let notification_busy = false;

async function _getOrganisationList(current_org_name, current_org_id, change_organisation, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/auth/user/organisations',
        (response) => {
            const organisation_list = response.data;
            dispatch({type: GET_ORGANISATION_LIST, organisation_list: organisation_list});
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
    if (kb_id && organisation_id) {
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

async function _getUsers(organisation_id, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/auth/users/' + encodeURIComponent(organisation_id),
        (response) => {
            dispatch({type: GET_USERS, user_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getCrawlers(organisation_id, kb_id, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
        (response) => {
            dispatch({type: GET_CRAWLERS, crawler_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch) {
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
            dispatch(({type: GET_DOCUMENTS_PAGINATED, document_list: document_list, num_documents: num_documents, document_filter: document_filter}));
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getMindItems(organisation_id, kb_id, mind_filter, mind_page_size, dispatch) {
    dispatch({type: BUSY, busy: true});
    await Comms.http_put('/bot/ui-find', {"organisationId": organisation_id, "kbId": kb_id,
            "query": mind_filter, "numResults": mind_page_size},
        (response) => {
            dispatch({type: MIND_FIND, mind_item_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

async function _getSynonyms(organisation_id, kb_id, synonym_filter, synonym_page_size, dispatch) {
    if (synonym_filter) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/find-synonyms', {
                "organisationId": organisation_id, "kbId": kb_id,
                "query": synonym_filter, "numResults": synonym_page_size
            },
            (response) => {
                dispatch({type: SET_SYNONYM_LIST, synonym_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    } else {
        dispatch({type: SET_SYNONYM_LIST, synonym_list: []});
    }
}

async function _getSemantics(organisation_id, kb_id, semantic_filter, semantic_page_size, dispatch) {
    if (semantic_filter) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/find-semantics', {
                "organisationId": organisation_id, "kbId": kb_id,
                "query": semantic_filter, "numResults": semantic_page_size
            },
            (response) => {
                dispatch({type: SET_SEMANTIC_LIST, semantic_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    } else {
        dispatch({type: SET_SEMANTIC_LIST, semantic_list: []});
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
                const bot_access_frequency = GraphHelper.setupList(report.botAccessFrequency, "bot access");
                const search_access_frequency = GraphHelper.setupList(report.searchAccessFrequency, "search access");
                const general_statistics = GraphHelper.setupMap(report.generalStatistics, "system");
                const query_word_frequency = GraphHelper.setupMap(report.queryWordFrequency, "queries (top " + top + ")");
                const file_type_statistics = GraphHelper.setupMap(report.fileTypeStatistics, "file types");
                dispatch({type: SET_REPORT_GRAPHS, bot_access_frequency: bot_access_frequency,
                    search_access_frequency: search_access_frequency, general_statistics: general_statistics,
                    query_word_frequency: query_word_frequency, file_type_statistics: file_type_statistics
                });
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
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

// application creators / actions
export const appCreators = {

    // do a sign in
    signIn: (email, password) => async (dispatch, getState) => {
        if (email && email.length > 0 && password && password.length > 0) {
            dispatch({type: BUSY, busy: true});
            await Comms.http_post('/auth/sign-in', {"email": email, "password": password},
                (response) => {
                    dispatch({type: SIGN_IN, session: response.data.session, user: response.data.user});
                    window.location = '/#/home';
                },
                (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
            )
        } else {
            dispatch({type: ERROR, title: "Error", error: 'please complete and check all fields'});
        }
    },

    signOut: () => ({type: SIGN_OUT}),

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
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        if (selected_tab === 'users' && organisation_id !== '') {
            await _getUsers(organisation_id, dispatch);
        }
        if (selected_tab === 'document sources' && organisation_id !== '' && kb_id !== '') {
            await _getCrawlers(organisation_id, kb_id, dispatch);
        }
        // todo: get stats
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
        await _getOrganisationList(name, id, true, dispatch);
    },

    // select an organisation for operational stuff
    selectOrganisation: (name, id) => async (dispatch, getState) => {
        if (id && id.length > 0) {
            dispatch({type: BUSY, busy: true});
            dispatch(({type: SELECT_ORGANISATION, name, id}));
            await _getKnowledgeBases(id, dispatch);
            const tab = getState().appReducer.selected_tab;
            if (tab === "users") {
                await _getUsers(id, dispatch);
            }
        }
    },

    // organisation save
    updateOrganisation: (organisation_id, name) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        await Comms.http_put('/auth/organisation',
            {"id": organisation_id, "name": name},
            (response) => {
                _getOrganisationList(organisation_name, id, false, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // organisation remove
    deleteOrganisation: (organisation_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        await Comms.http_delete('/auth/organisation/' + encodeURIComponent(organisation_id),
            (response) => {
                _getOrganisationList(name, id, false, dispatch);
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
    selectKnowledgeBase: (name, id) => async (dispatch, getState) => {
        if (id && id.length > 0) {
            dispatch({type: BUSY, busy: true});
            const tab = getState().appReducer.selected_tab;
            const organisation_id = getState().appReducer.selected_organisation_id;
            dispatch({type: SELECT_KNOWLEDGE_BASE, name, id});
            if (tab === 'document sources') {
                await _getCrawlers(organisation_id, id, dispatch);

            } else if (tab === 'documents') {
                const organisation_id = getState().appReducer.selected_organisation_id;
                const kb_id = getState().appReducer.selected_knowledgebase_id;
                const document_filter = getState().appReducer.document_filter;
                const document_previous = 'null'; // reset
                const document_page_size = getState().appReducer.document_page_size;
                await _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch);
                dispatch({type:RESET_DOCUMENT_PAGINATION});

            } else if (tab === 'inventory') {
                await _getInventorizeList(organisation_id, id, dispatch);
            }
        }
    },

    // retrieve list of all organisations from server
    getKnowledgeBases: () => async (dispatch, getState) => {
        await _getKnowledgeBases(getState().appReducer.selected_organisation_id, dispatch);
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

    updateKnowledgeBase: (organisation_id, kb_id, name, email, security_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/knowledgebase/',
            {"kbId": kb_id, "organisationId": organisation_id, "name": name, "email": email, "securityId": security_id},
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
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        if (organisation_id && kb_id) {
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
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        await Comms.http_get('/document/inventorize/' + encodeURIComponent(organisation_id),
            (response) => {
                dispatch({type: GET_INVENTORIZE_BUSY, busy: response.data});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    forceInventoryBusy: () => (dispatch, getState) => {
        dispatch({type: GET_INVENTORIZE_BUSY, busy: true});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Users

    getUsers: (organisation_id) => async (dispatch, getState) => {
        await _getUsers(organisation_id, dispatch)
    },

    updateUser: (organisation_id, user_id, name, surname, email, password, role_list, kb_list) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
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
            {"id": user_id, "password": password, "firstName": name, "surname": surname, "email": email, "roles": actual_role_data,
                "operatorKBList": actual_kb_list_data},
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
                _getUsers(organisation_id, dispatch)

            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteUser: (organisation_id, user_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/auth/organisation/user/' + encodeURIComponent(user_id) + '/' +
            encodeURIComponent(organisation_id),
            (response) => {
                _getUsers(organisation_id, dispatch)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


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
    // Documents

    getDocuments: () => async (dispatch, getState) => {
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
                                    encodeURIComponent(kb_id) + '/' + btoa(url) + '/' + encodeURIComponent(crawler_id);
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
        const document_previous = getState().appReducer.document_previous;
        await _getDocuments(organisation_id, kb_id,document_previous, page_size, document_filter, dispatch);
    },


    // refresh / re-parse etc. a document
    refreshDocument: (document) => async (dispatch, getState) => {
        const document_filter = getState().appReducer.document_filter;
        const document_previous = getState().appReducer.document_previous;
        const page_size = getState().appReducer.document_page_size;
        dispatch({type: BUSY, busy: true});
        await Comms.http_post('/document/refresh', {
                "organisationId": document.organisationId, "kbId": document.kbId, "url": document.url
            },
            (response) => {
                _getDocuments(document.organisationId, document.kbId, document_previous, page_size, document_filter, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    // refresh / re-parse etc. a document
    refreshDocuments: (source_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await Comms.http_post('/document/refresh/all', {
                "organisationId": organisation_id, "kbId": kb_id, "source": source_id
            },
            (response) => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // mind items

    mindFind: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_page_size = getState().appReducer.mind_page_size;
        if (organisation_id && kb_id && mind_item_filter) {
            await _getMindItems(organisation_id, kb_id, mind_item_filter, mind_page_size, dispatch);
        } else {
            dispatch({type: MIND_FIND, mind_item_list: []});
        }
    },

    // update the mind item search filter
    setMindItemFilter: (filter) => ({type: SET_MIND_ITEM_FILTER, filter}),

    // remove a mind item by id
    deleteMindItem: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_page_size = getState().appReducer.mind_page_size;
        await Comms.http_delete('/bot/ui-delete/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => {
                _getMindItems(organisation_id, kb_id, mind_item_filter, mind_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // remove a mind item by id
    deleteAllMindItems: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_page_size = getState().appReducer.mind_page_size;
        await Comms.http_delete('/bot/ui-delete-all/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            (response) => {
                _getMindItems(organisation_id, kb_id, mind_item_filter, mind_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // save a mind item to simsage
    saveMindItem: (mindItem) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_page_size = getState().appReducer.mind_page_size;
        await Comms.http_put('/bot/ui-save/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), mindItem,
            (response) => {
                _getMindItems(organisation_id, kb_id, mind_item_filter, mind_page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    botQuery: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const bot_query_page_size = getState().appReducer.bot_query_page_size;
        const bot_query_threshold = getState().appReducer.bot_query_threshold;
        const bot_query = getState().appReducer.bot_query;
        if (bot_query.length > 0) {
            const data = {
                organisationId: organisation_id,
                kbId: kb_id,
                query: bot_query,
                numResults: bot_query_page_size,
                scoreThreshold: bot_query_threshold,
            };
            await Comms.http_put('/bot/query', data,
                (response) => {
                    dispatch({type: SET_BOT_QUERY_LIST, bot_query_result_list: response.data});
                },
                (errStr) => {
                    dispatch({type: ERROR, title: "Error", error: errStr})
                }
            );
        } else {
            dispatch({type: SET_BOT_QUERY_LIST, bot_query_result_list: []});
        }
    },

    setBotQueryString: (query) => async (dispatch, getState) => {
        dispatch({type: SET_BOT_QUERY_STRING, bot_query: query});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // synonyms

    deleteSynonym: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        await Comms.http_delete('/language/delete-synonym/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => {
                _getSynonyms(organisation_id, kb_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    findSynonyms: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        await _getSynonyms(organisation_id, kb_id, filter, page_size, dispatch);
    },

    saveSynonym: (synonym) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        Comms.http_put('/language/save-synonym/' + encodeURIComponent(organisation_id) + '/' +
                            encodeURIComponent(kb_id), synonym,
            (response) => {
                _getSynonyms(organisation_id, kb_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSynonymFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_SYNONYM_FILTER, synonym_filter: filter});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantics

    deleteSemantic: (word) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        await Comms.http_delete('/language/delete-semantic/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(word),
            (response) => {
                _getSemantics(organisation_id, kb_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    findSemantics: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        await _getSemantics(organisation_id, kb_id, filter, page_size, dispatch);
    },

    saveSemantic: (semantic) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        Comms.http_put('/language/save-semantic/' + encodeURIComponent(organisation_id) + '/' +
                        encodeURIComponent(kb_id), semantic,
            (response) => {
                _getSemantics(organisation_id, kb_id, filter, page_size, dispatch);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSemanticFilter: (filter) => async (dispatch, getState) => {
        dispatch({type: SET_SEMANTIC_FILTER, semantic_filter: filter});
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
    addConversation: (item) => ({type: ADD_CONVERSATION, item}),

    markConversationItemUsed: (id) => ({type: MARK_CONVERSATION_USED, id}),

    operatorReady: (ready) => ({type: OPERATOR_READY, ready}),

    setOperatorAnswer: (id, answer) => ({type: SET_OPERATOR_ANSWER, id, answer}),

    setOperatorQuestion: (id, question) => ({type: SET_OPERATOR_QUESTION, id, question}),

    clearPreviousAnswer: () => ({type: CLEAR_PREVIOUS_ANSWER}),

    clearUser: () => ({type: OPERATOR_CLEAR_USER}),

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // log list

    getLogList: (subSystem) => async (dispatch, getState) => {
        // /stats/get-logs/{sessionId}/{organisationId}/{subSystem}/{top}
        dispatch({type: BUSY, busy: true});
        const session = getState().appReducer.session;
        const organisation_id = getState().appReducer.selected_organisation_id;
        const top = getState().appReducer.log_size;
        await Comms.http_get('/stats/get-logs/' + encodeURIComponent(session.id) + '/' +
                             encodeURIComponent(organisation_id) + '/' +
                             encodeURIComponent(subSystem) + '/' +
                             encodeURIComponent(top),
            (response) => {
                const data = response.data;
                dispatch({type: SET_LOG_LIST, log_list: data.logs, selected_log: subSystem,
                            active_components: { "auth": data.auth,
                                    "conversion": data.conversion, "crawler": data.crawler, "document": data.document,
                                    "index": data.index, "knowledgebase": data.knowledgebase, "language": data.language,
                                    "mind": data.mind, "operator": data.operator, "search": data.search,
                                    "stats": data.stats, "web": data.web}
                });
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // html 5 notification permissions

    getHtml5Notifications: () => async (dispatch, getState) => {
        await _getHtmlNotifications(dispatch);
    },


};

