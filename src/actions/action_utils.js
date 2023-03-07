import {
    BUSY,
    ERROR,
    GET_CRAWLERS,
    GET_DOMAINS,
    GET_EDGE_DEVICE_COMMANDS,
    GET_EDGE_DEVICES,
    GET_HTML5_NOTIFICATIONS,
    GET_INVENTORIZE_LIST,
    GET_KNOWLEDGE_BASES,
    RESET_MEMORIES_PAGINATION,
    RESET_SELECTED_KB,
    RESET_SEMANTIC_PAGINATION,
    RESET_SYNONYM_PAGINATION,
    RESET_SYNSET_PAGINATION,
    SELECT_ORGANISATION,
    SET_CATEGORIZATION_LIST,
    SET_GROUPS_PAGINATED,
    SET_LOG_LIST,
    SET_BACKUP_LIST,
    SET_MEMORIES_PAGINATED,
    SET_ORGANISATION_LIST,
    SET_REPORT_GRAPHS,
    SET_SEMANTICS_PAGINATED,
    SET_SYNONYMS_PAGINATED,
    SET_SYNSET_LIST,
    SET_USER_LIST,
    SIMSAGE_STATUS,
    SET_TEXT2SEARCH_PAGINATED
} from "./actions";

import GraphHelper from "../common/graph-helper";
import {Comms} from "../common/comms";
import {Api} from "../common/api";

// helper - get the session id or log errors - can return null
export function get_session_id(getState) {
    if (getState) {
        const session_id = getState().appReducer.session && getState().appReducer.session.id ? getState().appReducer.session.id : null;
        if (session_id === null) {
            console.error("session_id null");
        }
        return session_id;
    } else {
        console.error("getState in call get_session_id() not-defined");
        return null;
    }
}

export async function _getOrganisationList(current_org_name, current_org_id, _filter, change_organisation, dispatch, getState, session_id) {
    dispatch({type: BUSY, busy: true});
    session_id = session_id ? session_id : get_session_id(getState)
    let filter = _filter;
    if (!_filter || _filter.trim() === "") {
        filter = "null";
    }
    await Comms.http_get('/auth/user/organisations/' + encodeURIComponent(filter), session_id,
        (response) => {
            const organisation_list = response.data;
            dispatch({type: SET_ORGANISATION_LIST, organisation_list: organisation_list});
            // select an organisation if there is one to select and none yet has been selected
            if (change_organisation && organisation_list && organisation_list.length > 0 && current_org_id.length === 0) {
                dispatch({type: SELECT_ORGANISATION, name: organisation_list[0].name, id: organisation_list[0].id});
                // and get the knowledge bases for this org
                _getKnowledgeBases(organisation_list[0].id, dispatch, getState);
            }
            _getBackupList(current_org_id, dispatch, getState);
        },
        (errStr) => {
            dispatch({type: ERROR, title: "Error", error: errStr})
        }
    )
}

export async function _getKnowledgeBases(organisation_id, dispatch, getState) {
    dispatch({type: BUSY, busy: true});
    const session_id = get_session_id(getState)
    await Comms.http_get('/knowledgebase/' + encodeURIComponent(organisation_id), session_id,
        (response) => {
            dispatch({type: GET_KNOWLEDGE_BASES, knowledge_base_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}

export async function _getInventorizeList(organisation_id, kb_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        const appReducer = getState().appReducer
        const page = appReducer.inventorize_page
        const pageSize = appReducer.inventorize_page_size
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/document/parquets/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' + page + '/' + pageSize, session_id,
            (response) => {
                dispatch({type: GET_INVENTORIZE_LIST, inventorize_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getUsers(organisation_id, page, page_size, filter, dispatch, getState) {
    if (organisation_id) {
        const session_id = get_session_id(getState)
        dispatch({type: BUSY, busy: true});
        if (!filter || filter.trim() === '') {
            filter = 'null';
        }
        await Comms.http_get('/auth/users-paginated/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(page) + '/' + encodeURIComponent(page_size) + '/' + encodeURIComponent(filter), session_id,
            (response) => {
                console.log("_getUsers: response.data", response.data);
                dispatch({type: SET_USER_LIST, user_list: response.data.userList, user_count: response.data.userCount});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getCrawlers(organisation_id, kb_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/crawler/crawlers/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id), session_id,
            (response) => {
                dispatch({type: GET_CRAWLERS, crawler_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getDomains(organisation_id, kb_id, page, page_size, filter, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/knowledgebase/domains', session_id, {
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

export async function _getMemories(organisation_id, kb_id, prev_id, mind_filter, mind_item_page_size, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const data = {
            "organisationId": organisation_id, "kbId": kb_id, "prevId": prev_id ? prev_id : "null",
            "filter": mind_filter, "pageSize": mind_item_page_size
        };
        await Comms.http_put('/mind/memories', session_id, data,
            (response) => {
                dispatch({type: SET_MEMORIES_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getSynonyms(organisation_id, kb_id, prev_id, synonym_filter, synonym_page_size, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const data = {
            "organisationId": organisation_id, "kbId": kb_id, "prevId": prev_id ? prev_id : "",
            "filter": synonym_filter, "pageSize": synonym_page_size
        };
        await Comms.http_put('/language/synonyms', session_id, data,
            (response) => {
                dispatch({type: SET_SYNONYMS_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getSemantics(organisation_id, kb_id, prev_word, semantic_filter, semantic_page_size, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/semantics', session_id, {
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

export async function _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/language/find-syn-sets', session_id, {
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

export async function _getText2SearchList(organisation_id, kb_id, prev_word, text2search_filter, text2search_page_size, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const data = {
            "organisationId": organisation_id, "kbId": kb_id,
            "prevWord": prev_word && prev_word !== "null" ? prev_word : "", "filter": text2search_filter, "pageSize": text2search_page_size
        };
        await Comms.http_put('/semantic/text-to-search', session_id, data,
            (response) => {
                dispatch({type: SET_TEXT2SEARCH_PAGINATED, data: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getReports(organisation_id, kb_id, year, month, top, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/stats/stats/' + encodeURIComponent(organisation_id) + '/' +
            encodeURIComponent(kb_id) + '/' +
            encodeURIComponent(year) + '/' +
            encodeURIComponent(month) + '/' +
            encodeURIComponent(top), session_id,
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
export async function _getLogList(organisation_id, hours, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && hours) {
        dispatch({type: BUSY, busy: true});

        let gmtDate = Api.getGMTDate();
        let date = new Date(gmtDate.valueOf()); // get now
        let year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours(); // time/hour now 0..23

        await Comms.http_get('/stats/system-logs/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(year) + '/' +
            encodeURIComponent(month) + '/' + encodeURIComponent(day) + '/' + encodeURIComponent(hour) + '/' + encodeURIComponent(hours), session_id,
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

// get list of backups
export async function _getBackupList(organisation_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id) {
        dispatch({type: BUSY, busy: true});

        await Comms.http_get('/backup/backups/' + encodeURIComponent(organisation_id), session_id,
            (response) => {
                const data = response.data;
                dispatch({
                    type: SET_BACKUP_LIST, backup_list: data,
                })
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}

export async function _getHtmlNotifications(dispatch) {
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


export async function _getEdgeDevices(organisation_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/edge/' + encodeURIComponent(organisation_id), session_id,
        (response) => {
            dispatch({type: GET_EDGE_DEVICES, edge_device_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}


export async function _getEdgeDeviceCommands(organisation_id, edge_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    dispatch({type: BUSY, busy: true});
    await Comms.http_get('/edge/command/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(edge_id), session_id,
        (response) => {
            dispatch({type: GET_EDGE_DEVICE_COMMANDS, edge_device_command_list: response.data});
        },
        (errStr) => { dispatch({type: ERROR, title: "Error", error: errStr}) }
    )
}


export async function _getGroups(organisation_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_get('/auth/groups/' + encodeURIComponent(organisation_id), session_id,
            (response) => {
                dispatch({type: SET_GROUPS_PAGINATED, group_list: response.data.groupList,
                          all_user_list: response.data.userList});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}


export async function _getCategorizationListPaginated(organisation_id, kb_id, prev_categorization_label, page_size, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0 && kb_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        const prev = prev_categorization_label && prev_categorization_label.length > 0 && prev_categorization_label !== "null" ? prev_categorization_label : "null";
        await Comms.http_get('/language/categorization/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) +
                                '/' + encodeURIComponent(prev) + '/' + encodeURIComponent(page_size), session_id,
            (response) => {
                dispatch({type: SET_CATEGORIZATION_LIST, categorization_list: response.data.categorizationList, num_categorizations: response.data.totalCategorizationCount});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}


export async function _getSimSageStatus(organisation_id, dispatch, getState) {
    const session_id = get_session_id(getState)
    if (session_id && organisation_id.length > 0) {
        dispatch({type: BUSY, busy: true});
        await Comms.http_put('/stats/status/' + encodeURIComponent(organisation_id), session_id, {},
            (response) => {
                dispatch({type: SIMSAGE_STATUS, status_list: response.data});
            },
            (errStr) => {
                dispatch({type: ERROR, title: "Error", error: errStr})
            }
        )
    }
}


// setup a page for different tabs
export async function _setupPage(selected_tab, dispatch, getState, session_id) {
    const appReducer = getState().appReducer;
    const organisation_id = appReducer.selected_organisation_id;
    const organisation = appReducer.selected_organisation;
    const kb_id = appReducer.selected_knowledgebase_id;
    const kb_list = appReducer.knowledge_base_list;

    // don't reset when you're the operator
    if (selected_tab !== 'operator' &&
        (!organisation_id || organisation_id.length === 0 || !organisation || organisation.length === 0)) {
        dispatch({type: RESET_SELECTED_KB});
    }

    const user_list = appReducer.user_list;
    const group_list = appReducer.group_list;

    // load knowledge-bases if we have none and there is a selected organisation
    if (organisation_id !== '' && (!kb_list || kb_list.length === 0)) {
        await _getKnowledgeBases(organisation_id, dispatch, getState);
    }

    if (selected_tab === 'users' && organisation_id !== '') {
        const filter = appReducer.user_filter;
        const page = appReducer.user_page;
        const page_size = appReducer.user_page_size;

        await _getUsers(organisation_id, page, page_size, filter, dispatch, getState);
        if (!group_list || group_list.length === 0) {
            await _getGroups(organisation_id, dispatch, getState);
        }

    } else if (selected_tab === 'groups' && organisation_id !== '') {
        if (!user_list || user_list.length === 0) {
            const page = appReducer.user_page;
            const page_size = appReducer.user_page_size;
            const user_filter = appReducer.user_filter;
            await _getUsers(organisation_id, page, page_size, user_filter, dispatch, getState);
        }
        await _getGroups(organisation_id, dispatch, getState);

    } else if (selected_tab === 'organisations') {
        const name = appReducer.selected_organisation;
        const id = appReducer.selected_organisation_id;
        const filter = appReducer.organisation_filter;
        await _getOrganisationList(name, id, filter, true, dispatch, getState, session_id);

    } else if (selected_tab === 'knowledge bases' && organisation_id !== '') {
        await _getKnowledgeBases(organisation_id, dispatch, getState);

    } else if (selected_tab === 'edge devices' && organisation_id !== '') {
        await _getEdgeDevices(organisation_id, dispatch, getState);

    } else if (selected_tab === 'edge commands' && organisation_id !== '') {
        const edge_id = appReducer.selected_edge_device_id;
        if (edge_id && edge_id !== '') {
            await _getEdgeDeviceCommands(organisation_id, edge_id, dispatch, getState);
        }

    } else if (selected_tab === 'document sources' && organisation_id !== '' && kb_id !== '') {
        if (!user_list || user_list.length === 0) {
            const user_filter = appReducer.user_filter;
            const page = appReducer.user_page;
            const page_size = appReducer.user_page_size;
            await _getUsers(organisation_id, page, page_size, user_filter, dispatch, getState);
        }

        if (!group_list || group_list.length === 0) {
            await _getGroups(organisation_id, dispatch, getState);
        }

        await _getCrawlers(organisation_id, kb_id, dispatch, getState);

    } else if (selected_tab === 'syn-sets' && organisation_id !== '' && kb_id !== '') {
        const page = appReducer.synset_page;
        const page_size = appReducer.synset_page_size;
        const filter = appReducer.synset_filter;
        await _getSynSets(organisation_id, kb_id, page, page_size, filter, dispatch, getState);
        dispatch({type: RESET_SYNSET_PAGINATION});

    } else if (selected_tab === 'inventory' && organisation_id !== '' && kb_id !== '') {
        await _getInventorizeList(organisation_id, kb_id, dispatch, getState);

    } else if (selected_tab === 'reports' && organisation_id !== '' && kb_id !== '') {
        const top = appReducer.report_num_items;
        const date = new Date(appReducer.report_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        await _getReports(organisation_id, kb_id, year, month, top, dispatch, getState);

    } else if (selected_tab === 'bot') {
        dispatch({type:RESET_MEMORIES_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const mind_item_filter = appReducer.mind_item_filter;
        const mind_item_page_size = appReducer.mind_item_page_size;
        if (organisation_id && kb_id) {
            await _getMemories(organisation_id, kb_id, null, mind_item_filter, mind_item_page_size, dispatch, getState);
        } else {
            dispatch({type: SET_MEMORIES_PAGINATED, data: {mindItemList: [], numMindItems: 0, filter: ''} });
        }

    } else if (selected_tab === 'synonyms') {
        dispatch({type: RESET_SYNONYM_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const synonym_filter = appReducer.synonym_filter;
        const synonym_page_size = appReducer.synonym_page_size;
        if (organisation_id && kb_id) {
            await _getSynonyms(organisation_id, kb_id, "", synonym_filter, synonym_page_size, dispatch, getState);
        } else {
            dispatch({type: SET_SYNONYMS_PAGINATED, data: {synonymList: [], numSynonyms: 0, filter: ""} });
        }

    } else if (selected_tab === 'semantics') {
        dispatch({type: RESET_SEMANTIC_PAGINATION});
        dispatch({type: BUSY, busy: true});
        const semantic_filter = appReducer.semantic_filter;
        const semantic_page_size = appReducer.semantic_page_size;
        if (organisation_id && kb_id) {
            await _getSemantics(organisation_id, kb_id, "", semantic_filter, semantic_page_size, dispatch, getState);
        } else {
            dispatch({type: SET_SEMANTICS_PAGINATED, data: {semanticList: [], numSemantics: 0, filter: ""} });
        }

    } else if (selected_tab === 'categories') {
        dispatch({type: BUSY, busy: true});
        if (organisation_id && kb_id) {
            const prev = appReducer.prev_categorization_label;
            const page_size = appReducer.categorization_page_size;
            await _getCategorizationListPaginated(organisation_id, kb_id, prev, page_size, dispatch, getState);
        } else {
            dispatch({type: SET_CATEGORIZATION_LIST, categorization_list: []});
        }

    } else if (selected_tab === 'text2search') {
        dispatch({type: BUSY, busy: true});
        console.log("organisation_id && kb_id", organisation_id, kb_id);
        if (organisation_id && kb_id) {
            const text2search_filter = appReducer.text2search_filter;
            const text2search_page_size = appReducer.text2search_page_size;
            const prev_page = appReducer.text2search_prev_id;
            await _getText2SearchList(organisation_id, kb_id, prev_page, text2search_filter, text2search_page_size, dispatch, getState);
        } else {
            dispatch({type: SET_TEXT2SEARCH_PAGINATED, data: []});
        }


    } else if (selected_tab === 'active directory') {
        dispatch({type: BUSY, busy: true});
        if (organisation_id && kb_id) {
            await _getDomains(organisation_id, kb_id, 0, 10, '', dispatch, getState);
        } else {
            dispatch({type: GET_DOMAINS, domain_list: []});
        }

    } else if (selected_tab === 'status') {
        dispatch({type: BUSY, busy: true});
        if (organisation_id) {
            await _getSimSageStatus(organisation_id, dispatch, getState);
        } else {
            dispatch({type: SIMSAGE_STATUS, status_list: []});
        }

    } else if (selected_tab === 'logs') {
        if (organisation_id) {
            const hours = appReducer.log_hours;
            await _getLogList(organisation_id, hours, dispatch, getState);
        }

    } else if (selected_tab === 'backups') {
        if (organisation_id) {
            await _getBackupList(organisation_id, dispatch, getState);
        }
    }


}

