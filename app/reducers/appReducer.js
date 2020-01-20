import Api from '../common/api'

import {
    ADD_CONVERSATION,
    BUSY,
    CLEAR_PREVIOUS_ANSWER,
    CLOSE_ERROR,
    ERROR,
    GET_CRAWLERS,
    GET_DOMAINS,
    GET_DOCUMENTS_PAGINATED,
    GET_HTML5_NOTIFICATIONS,
    GET_KNOWLEDGE_BASES,
    GET_INVENTORIZE_LIST,
    GET_INVENTORIZE_BUSY,
    GET_LICENSE,
    GET_ORGANISATION_LIST,
    GET_USERS,
    HIDE_NOTIFICATIONS,
    MARK_CONVERSATION_USED,
    MIND_FIND,
    OPERATOR_CLEAR_USER,
    OPERATOR_READY,
    PROCESS_OPERATOR_MESSAGE,
    RESET_DOCUMENT_PAGINATION,
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
    SET_SYNSET_FILTER,
    SET_SYNSET_LIST,
    SET_SYNSET_PAGE,
    SET_SYNSET_PAGE_SIZE,
    RESET_SYNSET_PAGINATION,
    SHOW_NOTIFICATIONS,
    SIGN_IN,
    SIGN_OUT,
    UPDATE_USER,
    UPLOADING_PROGRAM,
    UPLOADING_PROGRAM_FINISHED,
    SET_LOG_LIST,
} from "../actions/actions";
import {initializeState} from './stateLoader'

// operator message types
const mt_ActiveConnections = "active connections";
const mt_Error = "error";
const mt_Message = "message";
const mt_TeachingSuccessful = "teaching success";

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
            // if we're an operator - we need to change tabs
            let is_admin_or_manager = false;
            if (action.user && action.user.roles) {
                const admin_manager = ['admin', 'manager'];
                for (const role of action.user.roles) {
                    if (admin_manager.indexOf(role.role) >= 0) {
                        is_admin_or_manager = true;
                    }
                }
            }
            return {
                ...state,
                session: action.session,
                user: action.user,
                selected_tab: is_admin_or_manager ? 'organisations' : 'operator',
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

        case GET_INVENTORIZE_LIST: {
            return {
                ...state,
                inventorize_list: action.inventorize_list,
                busy: false,
            };
        }

        case GET_INVENTORIZE_BUSY: {
            return {
                ...state,
                inventorize_busy: action.busy,
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
                busy: false,
            }
        }

        case SELECT_KNOWLEDGE_BASE: {
            return {
                ...state,
                selected_knowledgebase_id: action.id,
                selected_knowledgebase: action.name,
                busy: false,
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
                busy: false,
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
            }
        }

        case GET_USERS: {
            return {
                ...state,
                user_list: action.user_list,
                busy: false,
            };
        }

        case UPDATE_USER: {
            return {
                ...state,
                user: action.user,
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

        case GET_DOMAINS: {
            return {
                ...state,
                domain_list: action.domain_list,
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
                busy: false,
            };
        }

        case GET_DOCUMENTS_PAGINATED: {
            return {
                ...state,
                document_list: action.document_list,
                num_documents: action.num_documents,
                prev_document_filter: action.document_filter,
                busy: false,
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
                busy: false,
            }
        }

        case SET_DOCUMENT_PAGE_SIZE: {
            return {
                ...state,
                document_page_size: action.page_size,
            }
        }

        case RESET_DOCUMENT_PAGINATION: {
            return {
                ...state,
                document_page: 0,
                document_previous: null,
                document_nav_list: ['null'],
                busy: false,
            }
        }

        case MIND_FIND: {
            return {
                ...state,
                mind_item_list: action.mind_item_list,
                busy: false,
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
                busy: false,
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
                busy: false,
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
                busy: false,
            };
        }

        case SET_SEMANTIC_FILTER: {
            return {
                ...state,
                semantic_filter: action.semantic_filter,
            };
        }

        case SET_SYNSET_LIST: {
            return {
                ...state,
                synset_list: action.synset_list,
                synset_total_size: action.total_size,
                busy: false,
            };
        }

        case SET_SYNSET_FILTER: {
            return {
                ...state,
                synset_filter: action.synset_filter,
            };
        }

        case SET_SYNSET_PAGE: {
            return {
                ...state,
                synset_page: action.page,
                busy: false,
            }
        }

        case SET_SYNSET_PAGE_SIZE: {
            return {
                ...state,
                synset_page_size: action.page_size,
            }
        }

        case RESET_SYNSET_PAGINATION: {
            return {
                ...state,
                synset_page: 0,
                busy: false,
            }
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
                busy: false,
            }
        }

        case SET_OPERATOR_ANSWER: {
            return {
                ...state,
                answer_id: action.id,
                answer: action.answer,
            }
        }

        case SET_OPERATOR_QUESTION: {
            return {
                ...state,
                question_id: action.id,
                question: action.question,
            }
        }

        case OPERATOR_READY: {
            if (action.ready) {
                return {
                    ...state,
                    operator_ready: true,
                }
            } else {
                return {
                    ...state,
                    operator_ready: false,
                    conversation_list: [],
                    num_active_connections: 0,
                    question_id: '',
                    question: '',
                    answer_id: '',
                    answer: '',
                    client_id: '',
                    client_kb_id: '',
                    client_kb_name: '',
                    current_question: '',
                    prev_answer: '',
                }
            }
        }

        // next-user / ban-user set
        case OPERATOR_CLEAR_USER: {
            return {
                ...state,
                conversation_list: [],
                question_id: '',
                question: '',
                answer_id: '',
                answer: '',
                client_id: '',
                client_kb_id: '',
                client_kb_name: '',
                current_question: '',
                prev_answer: '',
            }
        }

        // receive a message for the operator - process it
        case PROCESS_OPERATOR_MESSAGE: {
            const data = action.message; // the data / message

            // log certain messages
            if (data.messageType !== mt_ActiveConnections) {
                // log any message for debugging (except active connection counts)
                console.debug('operator received data:' + JSON.stringify(data));
            }
            // an error has occurred - show it
            if (data.messageType === mt_Error && data.error.length > 0) {
                return {
                    ...state,
                    error_title: "error",
                    error: data.error,
                    busy: false,
                    uploading: false,
                }
            }
            if (data.messageType === mt_TeachingSuccessful) {
                // needed by javascript interface - not this app
                return {
                    ...state
                }
            }
            if (data.messageType === mt_ActiveConnections) {
                // set number of active connections as told by platform
                return {
                    ...state,
                    num_active_connections: data.connectionCount,
                }
            }
            // a message (response) arrives
            if (data.messageType === mt_Message) {

                if (!data.kbId || data.kbId.length === 0) {
                    // bad - must have a knowledgebase id
                    return {
                        ...state,
                        error_title: "error",
                        error:  "client text does not include a valid knowledge-base id.",
                        busy: false,
                        uploading: false,
                    }

                } else {

                    // get the history list (complete / abs list)
                    let conversation_list = []; // always change the list (must update!)
                    let current_question = ''; // the current question asked from the user
                    if (state.conversation_list.length === 0 && data.conversationList && data.conversationList.length > 0) {
                        // does the message come with some of the conversation data of previous attempts
                        conversation_list = []; // reset the list - we have data
                        let count = conversation_list.length + 1; // unique ids assigned for REACT
                        for (const index in data.conversationList) {
                            if (data.conversationList.hasOwnProperty(index)) {
                                let ci = data.conversationList[index];
                                const is_simsage = ci.origin !== "user";
                                conversation_list.push({
                                    id: count, primary: ci.conversationText,
                                    secondary: is_simsage ? "You" : "user", used: false, is_simsage: is_simsage
                                });
                                count += 1;
                            }
                        }

                        const last_item = data.conversationList[data.conversationList.length - 1];
                        if (!last_item.is_simsage) {
                            current_question = last_item.primary;
                        }

                    } else if (data.text && data.text.length > 0) {
                        // otherwise - get the conversation from what just was said by the user
                        conversation_list = JSON.parse(JSON.stringify(state.conversation_list)); // copy existing list
                        // add new item
                        conversation_list.push({id: conversation_list.length + 1, primary: data.text,
                                                secondary: "user", used: false, is_simsage: false});
                        current_question = data.text;
                    } else {
                        // the list didn't change
                        conversation_list = state.conversation_list;
                    }

                    // html 5 notifications enabled?
                    if (data.text && data.text.length > 0 &&
                        window.Notification && window.Notification.permission === "granted") {  // we have notification permission?
                        const title = "the Operator needs your Attention"; // title
                        const options = {
                            body: "A new question just came in.  Click here to open the operator window.  \"" + data.text + "\""
                        };
                        const notification = new Notification(title, options);  // display notification
                        notification.onclick = function() { window.focus(); }
                    }

                    let prev_answer = state.prev_answer;
                    if (data.previousAnswer && data.previousAnswer.length > 0) {
                        prev_answer = data.previousAnswer;
                    }

                    let client_id = state.client_id;
                    let client_kb_id = state.client_kb_id;
                    if (data.clientId.length > 5) {
                        client_id = data.clientId;
                        client_kb_id = data.kbId;
                    }

                    // set the name of the knowledge base connected to
                    let client_kb_name = state.client_kb_name;
                    if (data.kbName && data.kbName.length > 0) {
                        client_kb_name = data.kbName;
                    }

                    return {
                        ...state,
                        conversation_list: conversation_list,
                        current_question: current_question,
                        client_kb_name: client_kb_name,
                        client_id: client_id,
                        client_kb_id: client_kb_id,
                        prev_answer: prev_answer,
                    }
                }

            } // if mt_message

            return {
                ...state,
            }
        }

        case SET_OPERATOR_CONNECTED: {
            return {
                ...state,
                operator_ready: false,
                operator_connected: action.connected,
                conversation_list: [],
                num_active_connections: 0,
                question_id: '',
                question: '',
                answer_id: '',
                answer: '',
                client_id: '',
                client_kb_id: '',
                client_kb_name: '',
                current_question: '',
                prev_answer: '',
            }
        }

        case CLEAR_PREVIOUS_ANSWER: {
            return {
                ...state,
                current_question: '',
                prev_answer: '',
            }
        }

        case ADD_CONVERSATION: {
            // copy list to make a new one
            const message_list = JSON.parse(JSON.stringify(state.conversation_list));
            message_list.push(action.item);
            return {
                ...state,
                conversation_list: message_list,
            }
        }

        case MARK_CONVERSATION_USED: {
            // copy list to make a new one
            const message_list = JSON.parse(JSON.stringify(state.conversation_list));
            for (const message of message_list) {
                if (message.id === action.id) {
                    message.used = true;
                }
            }
            return {
                ...state,
                conversation_list: message_list,
            }
        }


        case GET_HTML5_NOTIFICATIONS: {
            return {
                ...state,
                html5_notifications: action.status,
            }
        }


        case SET_LOG_LIST: {
            return {
                ...state,
                log_list: action.log_list,
                selected_log: action.selected_log,
                active_components: action.active_components,
                busy: false,
            }
        }


    }

    return state;
};

