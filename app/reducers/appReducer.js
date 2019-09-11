
import Api from '../common/api'

import {

    SIGN_IN,
    SIGN_OUT,

    BUSY,
    ERROR,
    CLOSE_ERROR,

    SELECT_TAB,
    GET_LICENSE,

    HIDE_NOTIFICATIONS,
    SHOW_NOTIFICATIONS,
    NOTIFICATION_BUSY,
    SET_NOTIFICATION_LIST,

    GET_ORGANISATION_LIST,
    SELECT_ORGANISATION,

    SELECT_KNOWLEDGE_BASE,
    GET_KNOWLEDGE_BASES,

    GET_USERS,

    GET_CRAWLERS,

    UPLOADING_PROGRAM,
    UPLOADING_PROGRAM_FINISHED,

    GET_DOCUMENTS_PAGINATED,
    SET_DOCUMENT_FILTER,
    SET_DOCUMENT_PAGE,

    MIND_FIND,
    SET_MIND_ITEM_FILTER,
    SET_BOT_QUERY_LIST,
    SET_BOT_QUERY_STRING,

    SET_SYNONYM_LIST,
    SET_SYNONYM_FILTER,

    SET_SEMANTIC_LIST,
    SET_SEMANTIC_FILTER,

    SET_REPORT_DATE,
    SET_REPORT_GRAPHS,

} from "../actions/actions";

import {initializeState} from './stateLoader'

export const reducer = (state, action) => {
    state = state || initializeState();

    // output what we've received
    console.debug("applicationReducer:" + action.type);
    if (action.type === ERROR) {
        console.log("ERROR: (" + JSON.stringify(action) + ")");
    }

    switch (action.type) {

        // set an error
        case ERROR: {
            return {
                ...state,
                error_title: action.title,
                error: action.error,
                busy: false,
                uploading: false,
            };
        }

        // close any error messages
        case CLOSE_ERROR: {
            return {
                ...state,
                error_title: "",
                error: "",
                busy: false,
            };
        }

        case BUSY: {
            return {
                ...state,
                busy: action.busy,
            };
        }

        // sign-in a user
        case SIGN_IN: {
            return {
                ...state,
                session: action.session,
                user: action.user,
                busy: false,
            };
        }

        case GET_LICENSE: {
            return {
                ...state,
                license: action.license,
                busy: false,
            };
        }

        case GET_ORGANISATION_LIST: {
            return {
                ...state,
                organisation_list: action.organisation_list,
                busy: false,
            };
        }

        case GET_KNOWLEDGE_BASES: {
            return {
                ...state,
                knowledge_base_list: action.knowledge_base_list,
                busy: false,
            };
        }

        case SELECT_ORGANISATION: {
            return {
                ...state,
                selected_organisation_id: action.id,
                selected_organisation: action.name,
                selected_knowledgebase_id: "",
                selected_knowledgebase: "",
            }
        }

        case SELECT_KNOWLEDGE_BASE: {
            return {
                ...state,
                selected_knowledgebase_id: action.id,
                selected_knowledgebase: action.name,
            }
        }

        // sign-out a user
        case SIGN_OUT: {
            return {
                ...state,
                session: null,
                user: null,
                busy: false,
            }
        }

        case SELECT_TAB: {
            return {
                ...state,
                selected_tab: action.selected_tab,
            }
        }

        case HIDE_NOTIFICATIONS: {
            return {
                ...state,
                show_notifications: false,
            }
        }

        case SHOW_NOTIFICATIONS: {
            return {
                ...state,
                show_notifications: true,
            }
        }

        case SET_NOTIFICATION_LIST: {
            return {
                ...state,
                notification_list: action.notification_list,
                notification_busy: false,
            }
        }

        case NOTIFICATION_BUSY: {
            return {
                ...state,
                notification_busy: action.busy,
            };
        }

        case GET_USERS: {
            return {
                ...state,
                user_list: action.user_list,
                busy: false,
            };
        }

        case GET_CRAWLERS: {
            return {
                ...state,
                crawler_list: action.crawler_list,
                busy: false,
            };
        }

        case UPLOADING_PROGRAM: {
            return {
                ...state,
                uploading: true,
            };
        }

        case UPLOADING_PROGRAM_FINISHED: {
            return {
                ...state,
                uploading: false,
            };
        }

        case GET_DOCUMENTS_PAGINATED: {
            return {
                ...state,
                document_list: action.document_list,
                num_documents: action.num_documents,
            };
        }

        case SET_DOCUMENT_FILTER: {
            return {
                ...state,
                document_filter: action.filter,
            };
        }

        case SET_DOCUMENT_PAGE: {
            const document_nav_list = state.document_nav_list;
            if (action.page >= document_nav_list.length) {
                document_nav_list.push(action.prev_url);
            }
            return {
                ...state,
                document_page: action.page,
                document_previous: action.prev_url,
                document_nav_list: document_nav_list,
            }
        }

        case MIND_FIND: {
            return {
                ...state,
                mind_item_list: action.mind_item_list,
            };
        }

        case SET_MIND_ITEM_FILTER: {
            return {
                ...state,
                mind_item_filter: action.filter,
            };
        }

        case SET_BOT_QUERY_LIST: {
            return {
                ...state,
                bot_query_result_list: action.bot_query_result_list,
            };
        }

        case SET_BOT_QUERY_STRING: {
            return {
                ...state,
                bot_query: action.bot_query,
            };
        }

        case SET_SYNONYM_LIST: {
            return {
                ...state,
                synonym_list: action.synonym_list,
            };
        }

        case SET_SYNONYM_FILTER: {
            return {
                ...state,
                synonym_filter: action.synonym_filter,
            };
        }

        case SET_SEMANTIC_LIST: {
            return {
                ...state,
                semantic_list: action.semantic_list,
            };
        }

        case SET_SEMANTIC_FILTER: {
            return {
                ...state,
                semantic_filter: action.semantic_filter,
            };
        }

        case SET_REPORT_DATE: {
            return {
                ...state,
                report_date: Api.toIsoDate(action.report_date),
            };
        }

        case SET_REPORT_GRAPHS: {
            return {
                ...state,
                bot_access_frequency: action.bot_access_frequency,
                search_access_frequency: action.search_access_frequency,
                general_statistics: action.general_statistics,
                query_word_frequency: action.query_word_frequency,
                file_type_statistics: action.file_type_statistics,
            }
        }

    }

    return state;
};

