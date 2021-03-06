import Api from '../common/api'

import {
    ADD_CONVERSATION,
    BUSY,
    SET_THEME,
    CLEAR_PREVIOUS_ANSWER,
    CLOSE_ERROR,
    ERROR,
    GET_KNOWLEDGE_BASES,
    SET_KB_PAGE,
    SET_KB_PAGE_SIZE,
    GET_LICENSE,
    SET_ORGANISATION_FILTER,
    SET_ORGANISATION_PAGE,
    SET_ORGANISATION_PAGE_SIZE,
    GET_INVENTORIZE_BUSY,
    GET_OS_MESSAGES,
    GET_STATS,
    SET_USER_FILTER,
    SET_USER_PAGE,
    SET_USER_PAGE_SIZE,
    HIDE_NOTIFICATIONS,
    MARK_CONVERSATION_USED,
    RESET_SESSION,

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
    SET_MEMORIES_PAGE_SIZE,
    SET_MEMORIES_PAGE,

    SET_NOTIFICATION_LIST,
    SET_OPERATOR_ANSWER,
    SET_OPERATOR_CONNECTED,
    SET_OPERATOR_QUESTION,
    STOP_CLIENT_TYPING,
    ADD_OPERATOR,
    REMOVE_OPERATOR,
    MAX_OPERATORS,
    SET_REPORT_DATE,

    SET_SEMANTIC_PAGE_SIZE,
    SET_SEMANTIC_PAGE,
    RESET_SEMANTIC_PAGINATION,
    SET_SEMANTIC_FILTER,

    SET_SYNONYM_FILTER,
    RESET_SYNONYM_PAGINATION,
    SET_SYNONYM_PAGE_SIZE,
    SET_SYNONYM_PAGE,

    SET_SYNSET_FILTER,
    SHOW_NOTIFICATIONS,
    SIGN_IN,
    SIGN_OUT,
    UPDATE_USER,
    UPLOADING_PROGRAM,
    UPLOADING_PROGRAM_FINISHED,

    UPLOADING_WP_ARCHIVE,
    UPLOADING_WP_ARCHIVE_FINISHED,

    SET_LOG_DATE,
    SET_LOG_HOURS,
    SET_LOG_TYPE,
    SET_LOG_SERVICE,
    SET_LOG_REFRESH,

    // groups
    SET_GROUP_PAGE_SIZE,
    SET_GROUP_PAGE,
    SET_GROUP_FILTER,

} from "./actions";

import {Comms} from "../common/comms";

import {get_session_id, _getOrganisationList, _getKnowledgeBases, _getUsers, _getCrawlers, _getDomains, _getDocuments,
        _getMemories, _getSynonyms, _getSemantics, _getSimSageStatus} from "./action_utils";

import {_getSynSets, _getReports, _getLogList, _getEdgeDevices, _getEdgeDeviceCommands, _getGroups, _getCategoryList,
        _setupPage, _getInventorizeList, _getHtmlNotifications, _getSemanticDisplayCategories} from "./action_utils";

// not in state system - bad in the state system
let notification_busy = false;


// application creators / actions
export const appCreators = {

    signIn: (jwt, on_success, on_fail) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        if (Api.sessionHasExpired(getState().appReducer.session_age))
            dispatch({type: RESET_SESSION});

        await new Promise(resolve => setTimeout(resolve, 3000));

        await Comms.http_get_jwt('/auth/admin/authenticate/msal', jwt,
            (response) => {
                dispatch({type: SIGN_IN, data: response.data})
                if (on_success)
                    on_success(response.data);
            },
            (errStr) => {
                console.error(errStr);
                dispatch({type: ERROR, title: "Error", error: errStr})
                if (on_fail) {
                    on_fail();
                }
            }, jwt
        )
    },

    signOut: (callback) => async (dispatch) => {
        appCreators.setLogRefresh(0);   // stop log fetching
        await Comms.http_delete('/auth/sign-out',
            () => {
                dispatch({type: SIGN_OUT});
                if (callback)
                    callback();
            },
            (errStr) => {
                console.error(errStr);
                if (callback)
                    callback();
            }
        )
    },

    notBusy: () => async (dispatch) => {
        dispatch({type: BUSY, busy: false});
    },

    setTheme: (theme) => async (dispatch) => {
        dispatch({type: SET_THEME, theme: theme});
    },

    passwordResetRequest: () => ({type: PASSWORD_RESET_REQUEST}),

    resetPassword: (email, newPassword, reset_id) => ({type: RESET_PASSWORD, email, newPassword, reset_id}),

    getStats: (year, month, top) => ({type: GET_STATS, year, month, top}),

    getOSMessages: () => ({type: GET_OS_MESSAGES}),

    restoreSystem: (data) => ({type: RESTORE_SYSTEM, data}),

    getLicense: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_get('/auth/license', session_id,
            (response) => {
                dispatch(({type: GET_LICENSE, license: response.data}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    installLicense: (license_str) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/auth/license', session_id, {"license": license_str},
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

    setupManager: (session_id) => async (dispatch, getState) => {
        dispatch(({type: SELECT_TAB, selected_tab: 'knowledge bases'}));
        const filter = getState().appReducer.organisation_filter;

        const org_name = getState().appReducer.selected_organisation;
        const org_id = getState().appReducer.selected_organisation_id;
        await _getOrganisationList( org_name, org_id, filter, true, dispatch, getState, session_id);
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
            const session_id = get_session_id(getState);
            await Comms.http_get('/stats/stats/os', session_id,
                (response) => {
                    const notification_list = Api.merge_notifications(nl, response.data.notificationList);
                    if (notification_list.length !== nl.length) { // update?
                        dispatch(({type: SET_NOTIFICATION_LIST, notification_list}));
                    }
                    notification_busy = false;
                },
                (errStr) => {
                    console.error("error getting os-messages:" + errStr);
                    notification_busy = false;
                }
            )
        }
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Organisations

    // retrieve list of all organisations from server
    getOrganisationList: (session_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});

        const name = getState().appReducer.selected_organisation;
        const id = getState().appReducer.selected_organisation_id;
        const filter = getState().appReducer.organisation_filter;
        await _getOrganisationList(name, id, filter, true, dispatch, getState, session_id);
    },

    // select an organisation for operational stuff
    selectOrganisation: (data) => async (dispatch, getState) => {
        if (data && data.id && data.id.length > 0) {
            dispatch({type: BUSY, busy: true});
            dispatch(({type: SELECT_ORGANISATION, name: data.name, id: data.id}));
            await _getKnowledgeBases(data.id, dispatch, getState);
            const selected_tab = getState().appReducer.selected_tab;
            await _setupPage(selected_tab, dispatch, getState);
        } else {
            dispatch(({type: SELECT_ORGANISATION, name: "", id: ""}));
        }
    },

    setOrganisationFilter: (filter) => ({type: SET_ORGANISATION_FILTER, filter}),
    setOrganisationPage: (page) => ({type: SET_ORGANISATION_PAGE, page}),
    setOrganisationPageSize: (page_size) => ({type: SET_ORGANISATION_PAGE_SIZE, page_size}),

    // organisation save
    updateOrganisation: (organisation) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_put('/auth/organisation', session_id,
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
        await Comms.http_delete('/auth/organisation/' + encodeURIComponent(organisation_id), get_session_id(getState),
            () => {
                _getOrganisationList(name, id, filter, false, dispatch, getState);
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
            const session_id = get_session_id(getState);
            await _setupPage(selected_tab, dispatch, getState, session_id);
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
            const session_id = get_session_id(getState);
            await _setupPage(selected_tab, dispatch, getState, session_id);
        } else {
            dispatch({type: SELECT_KNOWLEDGE_BASE, name: "", id: ""});
        }
    },

    // retrieve list of all organisations from server
    getKnowledgeBases: () => async (dispatch, getState) => {
        await _getKnowledgeBases(getState().appReducer.selected_organisation_id, dispatch, getState);
    },

    setKbPage: (page) => ({type: SET_KB_PAGE, page}),
    setKbPageSize: (page_size) => ({type: SET_KB_PAGE_SIZE, page_size}),

    optimizeIndexes: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const data = {'organisationId': organisation_id, 'kbId': kb_id};
        const session_id = get_session_id(getState);
        await Comms.http_put('/language/optimize-indexes', session_id, data,
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    tuneGraph: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_get('/language/tune-graph/' + encodeURIComponent(organisation_id) + '/' +
                encodeURIComponent(kb_id), session_id,
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    removeOptimizedIndexes: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/optimize-indexes/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            session_id, () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    resetCrawlers: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/reset-crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            session_id, () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteKnowledgeBase: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        await Comms.http_delete('/knowledgebase/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            get_session_id(getState), () => {
                _getKnowledgeBases(organisation_id, dispatch, getState);
                dispatch({type: SELECT_KNOWLEDGE_BASE, name: '', id: ''});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateKnowledgeBase: (organisation_id, kb_id, name, email, security_id, enabled, max_queries_per_day,
                          analytics_window_size_in_months, operator_enabled, capacity_warnings,
                          created, dms_index_schedule, enable_similarity, similarity_threshold, success) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"kbId": kb_id, "organisationId": organisation_id, "name": name, "email": email,
            "securityId": security_id, "maxQueriesPerDay": max_queries_per_day, "enabled": enabled,
            "analyticsWindowInMonths": analytics_window_size_in_months, "operatorEnabled": operator_enabled,
            "capacityWarnings": capacity_warnings, "created": created, "dmsIndexSchedule": dms_index_schedule,
            "enableDocumentSimilarity": enable_similarity, "documentSimilarityThreshold": similarity_threshold};
        await Comms.http_put('/knowledgebase/', get_session_id(getState), payload,
            () => {
                _getKnowledgeBases(organisation_id, dispatch, getState);
                if (success)
                    success();
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    createInventory: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_post('/document/inventorize', session_id,
            {"kbId": kb_id, "organisationId": organisation_id},
            () => {
                _getInventorizeList(organisation_id, kb_id, dispatch, getState);
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    createIndexInventory: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_post('/document/inventorize/indexes', session_id,
            {"kbId": kb_id, "organisationId": organisation_id},
            () => {
                _getInventorizeList(organisation_id, kb_id, dispatch, getState);
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    getInventoryList: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await _getInventorizeList(organisation_id, kb_id, dispatch, getState);
    },

    // remove a document (delete) from the system
    deleteInventoryItem: (dateTime) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        if (organisation_id.length > 0 && kb_id.length > 0) {
            dispatch({type: BUSY, busy: true});
            const full_url = '/document/parquet/' + encodeURIComponent(organisation_id) + '/' +
                                encodeURIComponent(kb_id) + '/' + encodeURIComponent(dateTime);
            const session_id = get_session_id(getState);
            await Comms.http_delete(full_url, session_id,
                () => {
                    _getInventorizeList(organisation_id, kb_id, dispatch, getState);
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
            const session_id = get_session_id(getState);
            await Comms.http_get('/document/inventorize/' + encodeURIComponent(organisation_id), session_id,
                (response) => {
                    dispatch({type: GET_INVENTORIZE_BUSY, busy: response.data});
                },
                (errStr) => {
                    dispatch({type: ERROR, title: "Error", error: errStr})
                }
            )
        }
    },

    forceInventoryBusy: () => (dispatch) => {
        dispatch({type: GET_INVENTORIZE_BUSY, busy: true});
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Users

    getUsers: (organisation_id) => async (dispatch, getState) => {
        const filter = getState().appReducer.user_filter;
        await _getUsers(organisation_id, filter, dispatch, getState)
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
        const session_id = get_session_id(getState);
        await Comms.http_put('/auth/user/' + encodeURIComponent(organisation_id), session_id,
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
                _getUsers(organisation_id, filter, dispatch, getState)

            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteUser: (organisation_id, user_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const filter = getState().appReducer.user_filter;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/auth/organisation/user/' + encodeURIComponent(user_id) + '/' +
            encodeURIComponent(organisation_id), session_id,
            () => {
                _getUsers(organisation_id, filter, dispatch, getState)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    setUserFilter: (filter) => ({type: SET_USER_FILTER, filter}),
    setUserPage: (page) => ({type: SET_USER_PAGE, page}),
    setUserPageSize: (page_size) => ({type: SET_USER_PAGE_SIZE, page_size}),

    uploadProgram: (payload) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: UPLOADING_PROGRAM}));
        const session_id = get_session_id(getState);
        await Comms.http_put('/knowledgebase/upload', session_id, payload,
            () => {
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
        const session_id = get_session_id(getState);
        await Comms.http_post('/crawler/admin/upload/archive', session_id, payload,
            () => {
                dispatch(({type: UPLOADING_WP_ARCHIVE_FINISHED}));
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        );
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Crawlers

    getCrawlers: (organisation_id, kb_id) => async (dispatch, getState) => {
        await _getCrawlers(organisation_id, kb_id, dispatch, getState)
    },

    updateCrawler: (crawler, on_success) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_post('/crawler/crawler', session_id, crawler,
            () => {
                _getCrawlers(organisation_id, kb_id, dispatch, getState);
                if (on_success)
                    on_success();
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteCrawler: (crawler_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/crawler/crawler/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(crawler_id), session_id,
            () => {
                _getCrawlers(organisation_id, kb_id, dispatch, getState)
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // zip up all files in a source and store them locally on their server
    zipSource: (crawler) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/document/zip/source/', session_id, {
                "organisationId": crawler.organisationId, "kbId": crawler.kbId, "sourceId": crawler.sourceId
            },
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // start a crawler on the platform
    startCrawler: (crawler) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/crawler/start/', session_id, {
                "organisationId": crawler.organisationId, "kbId": crawler.kbId, "sourceId": crawler.sourceId
            },
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // process all files for a crawler on the platform
    processAllFilesForCrawler: (crawler) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/crawler/process-all-files', session_id, {
                "organisationId": crawler.organisationId, "kbId": crawler.kbId, "sourceId": crawler.sourceId
            },
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // test a specific crawler's connectivity
    testCrawler: (source_id, success, fail) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_get('/crawler/crawler/test/' + encodeURIComponent(organisation_id) + '/' +
                                encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id), session_id,
            (response) => {
                dispatch({type: BUSY, busy: false});
                success(response.data)
            },
            (errStr) => {
                dispatch({type: BUSY, busy: false});
                if (fail)
                    fail(errStr);
            })
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Active Directory / Domains

    getDomains: (organisation_id, kb_id) => async (dispatch, getState) => {
        await _getDomains(organisation_id, kb_id, 0, 10, "", dispatch, getState);
    },

    updateDomain: (domain) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_put('/knowledgebase/domain', session_id, domain,
            () => {
                _getDomains(organisation_id, kb_id, 0, 10, "", dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    testDomain: (domain) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_put('/knowledgebase/domain/test', session_id, domain,
            () => {
                dispatch({type: ERROR, title: "Success", error: "Connected Successfully"});
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    deleteDomain: (domain_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/knowledgebase/domain/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(domain_id), session_id,
            () => {
                _getDomains(organisation_id, kb_id, 0, 10, "", dispatch, getState);
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
            await _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch, getState);
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
            const session_id = get_session_id(getState);
            await Comms.http_delete(full_url, session_id,
                () => {
                    _getDocuments(organisation_id, kb_id, document_previous, document_page_size, document_filter, dispatch, getState);
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
                    await _getDocuments(organisation_id, kb_id, prev_url, document_page_size, document_filter, dispatch, getState);
                }
            } else if (page < document_nav_list.length) {
                const prev_url = document_nav_list[page];
                dispatch(({type: SET_DOCUMENT_PAGE, page, prev_url}));
                await _getDocuments(organisation_id, kb_id, prev_url, document_page_size, document_filter, dispatch, getState);
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
        await _getDocuments(organisation_id, kb_id, null, page_size, document_filter, dispatch, getState);
    },


    // refresh / re-parse etc. a document
    reprocessDocument: (document) => async (dispatch, getState) => {
        const document_filter = getState().appReducer.document_filter;
        const document_previous = getState().appReducer.document_previous;
        const page_size = getState().appReducer.document_page_size;
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/document/reprocess', session_id, {
                "organisationId": document.organisationId, "kbId": document.kbId, "url": document.url
            },
            () => {
                _getDocuments(document.organisationId, document.kbId, document_previous, page_size, document_filter, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // bot items

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
            await _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch, getState);
        }
    },

    // update the bot-item paged set
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
                    await _getMemories(organisation_id, kb_id, prev_id, mi_filter, mi_page_size, dispatch, getState);
                }
            } else if (page < mind_item_nav_list.length) {
                const prev_id = mind_item_nav_list[page];
                dispatch(({type: SET_MEMORIES_PAGE, page, prev_id}));
                await _getMemories(organisation_id, kb_id, prev_id, mi_filter, mi_page_size, dispatch, getState);
            }
        }
    },

    // update the bot-item paged set
    setMindItemPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_MEMORIES_PAGE_SIZE, page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mi_filter = getState().appReducer.mind_item_filter;
        await _getMemories(organisation_id, kb_id, null, mi_filter, page_size, dispatch, getState);
    },


    // update the bot item search filter
    setMindItemFilter: (filter) => ({type: SET_MEMORY_FILTER, filter}),

    // remove a bot item by id
    deleteMemory: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/mind/memory/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(id), session_id,
            () => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // remove a bot item by id
    deleteAllMemories: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/mind/delete-all/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id), session_id,
            () => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    // save a bot item to SimSage
    saveMemory: (memory) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const mind_item_filter = getState().appReducer.mind_item_filter;
        const mind_item_page_size = getState().appReducer.mind_item_page_size;
        const prev_id = getState().appReducer.mind_item_previous;
        const session_id = get_session_id(getState);
        await Comms.http_put('/mind/memory/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), session_id, memory,
            () => {
                _getMemories(organisation_id, kb_id, prev_id, mind_item_filter, mind_item_page_size, dispatch, getState);
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
            const session_id = get_session_id(getState);
            await Comms.http_put('/mind/query', session_id, data,
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

    setBotQueryString: (query) => async (dispatch) => {
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
            await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch, getState);
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
                    await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch, getState);
                }
            } else if (page < synonym_nav_list.length) {
                const prev_id = synonym_nav_list[page];
                dispatch(({type: SET_SYNONYM_PAGE, page, prev_id}));
                await _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch, getState);
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
        await _getSynonyms(organisation_id, kb_id, null, synonym_filter, page_size, dispatch, getState);
    },

    deleteSynonym: (id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const prev_id = getState().appReducer.synonym_prev_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/delete-synonym/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(id), session_id,
            () => {
                _getSynonyms(organisation_id, kb_id, prev_id, filter, page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    deleteAllSynonyms: (organisation_id, kb_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const prev_id = getState().appReducer.synonym_prev_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/delete-all-synonyms/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id),
            session_id,
            () => {
                _getSynonyms(organisation_id, kb_id, prev_id, filter, page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    saveSynonym: (synonym) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const prev_id = getState().appReducer.synonym_prev_id;
        const filter = getState().appReducer.synonym_filter;
        const page_size = getState().appReducer.synonym_page_size;
        const session_id = get_session_id(getState);
        Comms.http_put('/language/save-synonym/' + encodeURIComponent(organisation_id) + '/' +
                            encodeURIComponent(kb_id), session_id, synonym,
            () => {
                _getSynonyms(organisation_id, kb_id, prev_id, filter, page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSynonymFilter: (filter) => async (dispatch) => {
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
            await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch, getState);
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
                    await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch, getState);
                }
            } else if (page < semantic_nav_list.length) {
                const prev_word = semantic_nav_list[page];
                dispatch(({type: SET_SEMANTIC_PAGE, page, prev_word}));
                await _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch, getState);
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
        await _getSemantics(organisation_id, kb_id, null, semantic_filter, page_size, dispatch, getState);
    },

    deleteSemantic: (word) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const prev_word = getState().appReducer.semantic_prev_word;
        const page_size = getState().appReducer.semantic_page_size;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/delete-semantic/' + encodeURIComponent(organisation_id) + '/' +
                                    encodeURIComponent(kb_id) + '/' + encodeURIComponent(word), session_id,
            () => {
                _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch, getState);
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
        await _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch, getState);
    },

    saveSemantic: (semantic) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const filter = getState().appReducer.semantic_filter;
        const page_size = getState().appReducer.semantic_page_size;
        const prev_word = '';
        const session_id = get_session_id(getState);
        Comms.http_put('/language/save-semantic/' + encodeURIComponent(organisation_id) + '/' +
                        encodeURIComponent(kb_id), session_id, semantic,
            () => {
                _getSemantics(organisation_id, kb_id, prev_word, filter, page_size, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSemanticFilter: (filter) => async (dispatch) => {
        dispatch({type: SET_SEMANTIC_FILTER, semantic_filter: filter});
    },

    getSemanticDisplayCategories: () => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await _getSemanticDisplayCategories(organisation_id, kb_id, dispatch, getState);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantic display categories

    saveSemanticDisplayCategory: (prevDisplayName, displayName, semanticList) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_put('/language/semantic-display-category/', session_id,
            {"organisationId": organisation_id, "kbId": kb_id, "prevDisplayName": prevDisplayName,
                    "displayName": displayName, "semanticList": semanticList},
            () => {
                _getSemanticDisplayCategories(organisation_id, kb_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    deleteSemanticDisplayCategory: (displayName) => async (dispatch, getState) => {
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/semantic-display-category/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(displayName), session_id,
            () => {
                _getSemanticDisplayCategories(organisation_id, kb_id, dispatch, getState);
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
        const session_id = get_session_id(getState);
        await Comms.http_delete('/language/delete-syn-set/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(lemma), session_id,
            () => {
                _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
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
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
    },

    saveSynSet: (syn_set) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        const session_id = get_session_id(getState);
        Comms.http_put('/language/save-syn-set/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), session_id, syn_set,
            () => {
                _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setSynSetFilter: (filter) => async (dispatch) => {
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
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
    },

    // update the syn-set pagination size
    setSynSetPageSize: (page_size) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_SYNSET_PAGE_SIZE, page_size: page_size}));

        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const filter = getState().appReducer.synset_filter;

        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
    },

    addDefaultSynSets: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const page = getState().appReducer.synset_page;
        const page_size = getState().appReducer.synset_page_size;
        const filter = getState().appReducer.synset_filter;
        const session_id = get_session_id(getState);
        Comms.http_put('/language/default-syn-sets/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id), session_id, {},
            () => {
                _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
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
        await _getReports(organisation_id, kb_id, year, month, top, dispatch, getState);
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
        const session_id = get_session_id(getState);
        await Comms.http_post(url, session_id, data,
            () => {
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
        const log_date = getState().appReducer.log_date;
        let date = new Date();
        if (!log_date) {
            date = new Date(getState().appReducer.log_date);
        }
        let year = date.getFullYear();
        if (year < 2000) {
            date = new Date();
            year = date.getFullYear();
        }
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const hours = getState().appReducer.log_hours;
        await _getLogList(organisation_id, year, month, day, hour, hours, dispatch, getState);
    },

    setLogDate: (log_date) => ({type: SET_LOG_DATE, log_date}),

    setLogHours: (log_hours) => ({type: SET_LOG_HOURS, log_hours}),

    setLogType: (log_type) => ({type: SET_LOG_TYPE, log_type}),

    setLogService: (log_service) => ({type: SET_LOG_SERVICE, log_service}),

    setLogRefresh: (log_refresh) => async (dispatch) => {
        dispatch({type: SET_LOG_REFRESH, log_refresh})
    },

    restartService: (subSystem) => async (dispatch, getState) => {
        const session = getState().appReducer.session;
        const organisation_id = getState().appReducer.selected_organisation_id;
        const session_id = get_session_id(getState);
        await Comms.http_get('/stats/restart-service/' + encodeURIComponent(session.id) + '/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(subSystem),
            session_id, () => {},
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Edge devices

    // retrieve list of all organisations from server
    getEdgeDevices: () => async (dispatch, getState) => {
        await _getEdgeDevices(getState().appReducer.selected_organisation_id, dispatch, getState, getState);
    },

    deleteEdgeDevice: (organisation_id, edge_id) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_delete('/edge/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id), session_id,
            () => {
                _getEdgeDevices(organisation_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateEdgeDevice: (organisation_id, edge_id, name, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"edgeId": edge_id, "organisationId": organisation_id, "name": name, "created": created};
        const session_id = get_session_id(getState);
        await Comms.http_put('/edge/', session_id, payload,
            () => {
                _getEdgeDevices(organisation_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    updateEdgeDeviceCommand: (organisation_id, edge_id, command, parameters, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const payload = {"edgeId": edge_id, "organisationId": organisation_id, "command": command,
                         "parameters": parameters, "created": created, "executed": 0, "result": ""};
        const session_id = get_session_id(getState);
        await Comms.http_put('/edge/command', session_id, payload,
            () => {
                _getEdgeDeviceCommands(organisation_id, edge_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    deleteEdgeDeviceCommand: (organisation_id, edge_id, created) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_delete('/edge/command/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id) + '/' + encodeURIComponent(created),
            session_id, () => {
                _getEdgeDeviceCommands(organisation_id, edge_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
        )
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // html 5 notification permissions

    getHtml5Notifications: () => async (dispatch) => {
        await _getHtmlNotifications(dispatch);
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // restore a text file on the server

    restore: (base64_text) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const session_id = get_session_id(getState);
        await Comms.http_put('/backup/restore', session_id, {"organisationId": organisation_id,"data": base64_text},
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            })
    },

    // back up a single organisation with all its kbs to file
    binaryBackupToFile: (organisation_id, include_binaries) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const session_id = get_session_id(getState);
        await Comms.http_post('/backup/binary-backup-to-file/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(include_binaries),
            session_id, {},
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            })
    },

    // restore a single organisation with all its kbs from a file
    restoreBackupFromFile: (filename) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const session_id = get_session_id(getState);
        await Comms.http_post('/backup/restore-backup-from-file', session_id,
            {
                "organisationId": organisation_id,
                "filename": filename
            },
            () => {
                dispatch({type: BUSY, busy: false});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            })
    },

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // semantics

    getGroups: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        if (organisation_id) {
            await _getGroups(organisation_id, dispatch, getState);
        }
    },

    // update the group page
    setGroupPage: (page) => async (dispatch) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_GROUP_PAGE, page}));
    },

    // update the semantic page-size
    setGroupPageSize: (page_size) => async (dispatch) => {
        dispatch({type: BUSY, busy: true});
        dispatch(({type: SET_GROUP_PAGE_SIZE, page_size}));
    },

    deleteGroup: (name) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const session_id = get_session_id(getState);
        await Comms.http_delete('/auth/group/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(name),
            session_id, () => {
                _getGroups(organisation_id, dispatch, getState);
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
        const session_id = get_session_id(getState);
        Comms.http_put('/auth/group', session_id,
            data,
            () => {
                _getGroups(organisation_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    setGroupFilter: (filter) => async (dispatch) => {
        dispatch({type: SET_GROUP_FILTER, group_filter: filter});
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // document categorization

    saveCategory: (category) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const data = {
            organisationId: organisation_id,
            kbId: kb_id,
            metadata: category.metadata,
            displayName: category.displayName,
            categorizationList: category.categorizationList,
        }
        const session_id = get_session_id(getState);
        Comms.http_put('/language/categorization', session_id,
            data,
            () => {
                _getCategoryList(organisation_id, kb_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    deleteCategory: (metadata) => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        const session_id = get_session_id(getState);
        Comms.http_delete('/language/categorization/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' +
                            encodeURIComponent(metadata), session_id,
            () => {
                _getCategoryList(organisation_id, kb_id, dispatch, getState);
            },
            (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr})}
        )
    },

    getCategoryList: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        const kb_id = getState().appReducer.selected_knowledgebase_id;
        await _getCategoryList(organisation_id, kb_id, dispatch, getState);
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // SimSage status

    getSimSageStatus: () => async (dispatch, getState) => {
        dispatch({type: BUSY, busy: true});
        const organisation_id = getState().appReducer.selected_organisation_id;
        await _getSimSageStatus(organisation_id, dispatch, getState);
    },

};

