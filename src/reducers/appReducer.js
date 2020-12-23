import Api from '../common/api'

import {
    ADD_CONVERSATION,
    BUSY,
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
    GET_INVENTORIZE_BUSY,
    GET_LICENSE,
    GET_ORGANISATION_LIST,
    SET_ORGANISATION_FILTER,
    SET_USER_LIST,
    SET_USER_FILTER,
    HIDE_NOTIFICATIONS,
    MARK_CONVERSATION_USED,
    MIND_FIND,
    SET_MIND_ITEMS_PAGINATED,
    SET_MIND_ITEM_PAGE_SIZE,
    SET_MIND_ITEM_PAGE,
    RESET_MIND_ITEM_PAGINATION,
    OPERATOR_CLEAR_USER,
    OPERATOR_READY,
    ADD_OPERATOR,
    REMOVE_OPERATOR,
    PROCESS_OPERATOR_MESSAGE,
    RESET_DOCUMENT_PAGINATION,
    SELECT_KNOWLEDGE_BASE,
    SELECT_ORGANISATION,
    UPDATE_ORGANISATION,
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
    STOP_CLIENT_TYPING,
    SET_REPORT_DATE,
    SET_REPORT_GRAPHS,

    SET_SEMANTIC_FILTER,
    SET_SEMANTICS_PAGINATED,
    RESET_SEMANTIC_PAGINATION,
    SET_SEMANTIC_PAGE_SIZE,
    SET_SEMANTIC_PAGE,

    SET_SEMANTIC_DISPLAY_LIST,

    SET_SYNONYM_FILTER,
    SET_SYNONYMS_PAGINATED,
    RESET_SYNONYM_PAGINATION,
    SET_SYNONYM_PAGE_SIZE,
    SET_SYNONYM_PAGE,

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
    UPLOADING_WP_ARCHIVE,
    UPLOADING_WP_ARCHIVE_FINISHED,
    SET_LOG_LIST,
} from "../actions/actions";
import {initializeState} from './stateLoader'

// operator message types
const mt_ActiveConnections = "active connections";
const mt_Disconnect = "disconnect";
const mt_Error = "error";
const mt_Message = "message";
const mt_Typing = "typing";
const mt_TeachingSuccessful = "teaching success";

// remove all client attributes from an operator
function clear_operator(op) {
    if (op) {
        op.conversation_list = [];
        op.client_id = '';
        op.client_kb_id = '';
        op.client_kb_name = '';
        op.question_id = '';
        op.question = '';
        op.answer_id = '';
        op.answer = '';
        op.prev_answer = '';
        op.current_question = '';
        op.is_typing = false;
        op.typing_time = 0;
    }
}

export const reducer = (state, action) => {
    state = state || initializeState();

    // output what we've received
    if (window.ENV.debug) {
        console.debug("applicationReducer:" + action.type);
    }
    if (action.type === ERROR) {
        console.log("ERROR: (" + JSON.stringify(action) + ")");
    }

    switch (action.type) {

        default: {
            break;
        }

        // set an error
        case ERROR: {
            // is this an "invalid session id"
            if (action.error.indexOf("invalid session id") >= 0) {
                // wipe session and user objects - this is now a logout event
                window.location = "/#/";
                return {
                    ...state,
                    session: null,
                    user: null,
                    error_title: action.title,
                    error: action.error,
                    busy: false,
                    uploading: false,
                };
            } else {
                return {
                    ...state,
                    error_title: action.title,
                    error: action.error,
                    busy: false,
                    uploading: false,
                }
            }
        }

        case RESET_SELECTED_KB: {
            return {
                ...state,
                selected_organisation_id: "",
                selected_organisation: null,
                selected_knowledgebase_id: "",
                selected_knowledgebase: null,
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
            // set the selected organisation-id (used by operators
            let selected_organisation_id = '';
            let selected_organisation = '';
            if (action.user && action.user.roles) {
                for (const role of action.user.roles) {
                    if (role && role.organisationId && selected_organisation_id === '') {
                        selected_organisation_id = role.organisationId;
                    }
                }
            }
            // redirect sign-in to either orgs or operator (depending on access)
            return {
                ...state,
                session: action.session,
                user: action.user,
                selected_tab: is_admin_or_manager ? 'organisations' : 'operator',
                selected_organisation_id: selected_organisation_id,
                selected_organisation: selected_organisation,
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

        case SET_ORGANISATION_FILTER: {
            return {
                ...state,
                organisation_filter: action.filter,
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

        case UPDATE_ORGANISATION: {
            const new_list = [];
            const organisation = action.organisation;
            let found = false;
            for (const org of state.organisation_list) {
                if (org.id === organisation.id) {
                    new_list.push(organisation);
                    found = true;
                } else {
                    new_list.push(org);
                }
            }
            if (!found) {
                new_list.push(organisation);
            }
            return {
                ...state,
                organisation_list: new_list,
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

        case SET_USER_LIST: {
            return {
                ...state,
                user_list: action.user_list,
                busy: false,
            };
        }

        case SET_USER_FILTER: {
            return {
                ...state,
                user_filter: action.filter,
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

        case UPLOADING_WP_ARCHIVE: {
            return {
                ...state,
                uploading: true,
            };
        }

        case UPLOADING_WP_ARCHIVE_FINISHED: {
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
                document_page: 0,
                document_previous: null,
                document_nav_list: ['null'],
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

        case SET_MIND_ITEMS_PAGINATED: {
            return {
                ...state,
                mind_item_list: action.data.mindItemList,
                num_mind_items: action.data.numMindItems,
                prev_mind_item_filter: action.data.filter,
                busy: false,
            };
        }

        case SET_MIND_ITEM_FILTER: {
            return {
                ...state,
                mind_item_filter: action.filter,
            };
        }

        case SET_MIND_ITEM_PAGE: {
            const mind_item_nav_list = state.mind_item_nav_list;
            if (action.page >= mind_item_nav_list.length) {
                mind_item_nav_list.push(action.prev_id);
            }
            return {
                ...state,
                mind_item_page: action.page,
                mind_item_previous: action.prev_id,
                mind_item_nav_list: mind_item_nav_list,
                busy: false,
            }
        }

        case SET_MIND_ITEM_PAGE_SIZE: {
            return {
                ...state,
                mind_item_page: 0,
                mind_item_previous: null,
                mind_item_nav_list: ['null'],
                mind_item_page_size: action.page_size,
            }
        }

        case RESET_MIND_ITEM_PAGINATION: {
            return {
                ...state,
                mind_item_page: 0,
                mind_item_previous: null,
                mind_item_nav_list: ['null'],
                busy: false,
            }
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

        case SET_SYNONYMS_PAGINATED: {
            return {
                ...state,
                synonym_list: action.data.synonymList,
                num_synonyms: action.data.numSynonyms,
                prev_synonym_filter: action.data.filter,
                busy: false,
            };
        }

        case SET_SYNONYM_PAGE: {
            const synonym_nav_list = state.synonym_nav_list;
            if (action.page >= synonym_nav_list.length) {
                synonym_nav_list.push(action.prev_id);
            }
            return {
                ...state,
                synonym_page: action.page,
                synonym_prev_id: action.prev_id,
                synonym_nav_list: synonym_nav_list,
                busy: false,
            }
        }

        case SET_SYNONYM_PAGE_SIZE: {
            return {
                ...state,
                synonym_page: 0,
                synonym_prev_id: null,
                synonym_nav_list: ['null'],
                synonym_page_size: action.page_size,
            }
        }

        case RESET_SYNONYM_PAGINATION: {
            return {
                ...state,
                synonym_page: 0,
                synonym_prev_id: null,
                synonym_nav_list: ['null'],
                busy: false,
            }
        }

        case SET_SYNONYM_FILTER: {
            return {
                ...state,
                synonym_filter: action.synonym_filter,
            };
        }


        case SET_SEMANTICS_PAGINATED: {
            return {
                ...state,
                semantic_list: action.data.semanticList,
                num_semantics: action.data.numSemantics,
                prev_semantic_filter: action.data.filter,
                busy: false,
            };
        }

        case SET_SEMANTIC_PAGE: {
            const semantic_nav_list = state.semantic_nav_list;
            if (action.page >= semantic_nav_list.length) {
                semantic_nav_list.push(action.prev_word);
            }
            return {
                ...state,
                semantic_page: action.page,
                semantic_prev_word: action.prev_word,
                semantic_nav_list: semantic_nav_list,
                busy: false,
            }
        }

        case SET_SEMANTIC_PAGE_SIZE: {
            return {
                ...state,
                semantic_page: 0,
                semantic_prev_id: null,
                semantic_nav_list: ['null'],
                semantic_page_size: action.page_size,
            }
        }

        case RESET_SEMANTIC_PAGINATION: {
            return {
                ...state,
                semantic_page: 0,
                semantic_prev_id: null,
                semantic_nav_list: ['null'],
                busy: false,
            }
        }


        case SET_SEMANTIC_DISPLAY_LIST: {
            return {
                ...state,
                semantic_display_category_list: action.semantic_display_category_list,
                defined_semantic_list: action.defined_semantic_list,
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
                synset_page: 0,
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
                access_frequency: action.access_frequency,
                general_statistics: action.general_statistics,
                query_word_frequency: action.query_word_frequency,
                file_type_statistics: action.file_type_statistics,
                busy: false,
            }
        }

        case SET_OPERATOR_ANSWER: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    op.answer_id = action.id;
                    op.answer = action.answer;
                }
                new_list.push(op);
            }
            return {
                ...state,
                operators: new_list,
            }
        }

        case SET_OPERATOR_QUESTION: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    op.question_id = action.id;
                    op.question = action.question;
                }
                new_list.push(op);
            }
            return {
                ...state,
                operators: new_list,
            }
        }

        case OPERATOR_READY: {
            if (action.ready) {
                const new_list = [];
                for (const op of state.operators) {
                    if (op.id === action.operatorId) {
                        op.operator_ready = true;
                    }
                    new_list.push(op);
                }
                return {
                    ...state,
                    operators: new_list,
                }
            } else {

                const new_list = [];
                for (const op of state.operators) {
                    if (op.id === action.operatorId) {
                        const emptyOperator = Api.createOperator();
                        emptyOperator.id = action.operatorId;
                        new_list.push(emptyOperator);
                    } else {
                        new_list.push(op);
                    }
                }
                return {
                    ...state,
                    operators: new_list,
                }
            }
        }

        // next-user / ban-user set
        case OPERATOR_CLEAR_USER: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    const emptyOperator = Api.createOperator();
                    emptyOperator.id = action.operatorId; // don't wipe these
                    emptyOperator.operator_ready = op.operator_ready;
                    new_list.push(emptyOperator);
                } else {
                    new_list.push(op);
                }
            }
            return {
                ...state,
                operators: new_list,
            }
        }

        case ADD_OPERATOR: {
            const new_list = JSON.parse(JSON.stringify(state.operators));
            new_list.push(Api.createOperator());
            return {
                ...state,
                operators: new_list,
            }
        }

        case REMOVE_OPERATOR: {
            const new_list = [];
            for (const operator of state.operators) {
                if (operator.id !== action.id) {
                    new_list.push(operator);
                }
            }
            return {
                ...state,
                operators: new_list
            }
        }

        case STOP_CLIENT_TYPING: {
            const operator_id = action.operator_id; // client's id
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === operator_id) {
                    op.is_typing = false;
                    op.typing_time = 0;
                }
                new_list.push(op);
            }
            return {
                ...state,
                operators: new_list,
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
            if (data.messageType === mt_Disconnect) {
                const new_list = [];
                for (const op of state.operators) {
                    if (op.id === data.operatorId) {
                        clear_operator(op);
                    }
                    new_list.push(op);
                }
                if (data.disconnectedByClient) {
                    return {
                        ...state,
                        operators: new_list,
                        error_title: "Disconnected",
                        error: "the client has terminated this conversation.",
                    }
                } else {
                    return {
                        ...state,
                        operators: new_list,
                    }
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

            // an is-typing message arrives
            if (data.messageType === mt_Typing) {
                // find the organisation
                const new_list = [];
                for (const op of state.operators) {
                    if (op.id === data.toId) {
                        op.is_typing = data.fromIsTyping;
                        op.typing_time = Api.getSystemTime() + 2000;
                    }
                    new_list.push(op);
                }
                return {
                    ...state,
                    operators: new_list,
                }
            }

            // a message (response) arrives
            if (data.messageType === mt_Message) {

                if (!data.kbId || data.kbId.length === 0) {
                    // bad - must have a knowledgebase id
                    return {
                        ...state,
                        error_title: "error",
                        error: "message does not include a valid knowledge-base id.",
                        busy: false,
                        uploading: false,
                    }

                } else if (!data.assignedOperatorId || data.assignedOperatorId.length === 0) {
                    // bad - must have an operator-id so we can assign it
                    return {
                        ...state,
                        error_title: "error",
                        error:  "message does not include a valid assigned-operator-id.",
                        busy: false,
                        uploading: false,
                    }

                } else {

                    // find the organisation
                    let operator = null;
                    for (const op of state.operators) {
                        if (op.id === data.assignedOperatorId) {
                            operator = op;
                            break;
                        }
                    }

                    if (operator != null) {

                        // get the history list (complete / abs list)
                        let conversation_list = []; // always change the list (must update!)
                        if (operator.conversation_list.length === 0 && data.conversationList && data.conversationList.length > 0) {
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

                        } else if (data.text && data.text.length > 0) {
                            // otherwise - get the conversation from what just was said by the user
                            conversation_list = JSON.parse(JSON.stringify(operator.conversation_list)); // copy existing list
                            // add new item
                            conversation_list.push({
                                id: conversation_list.length + 1, primary: data.text,
                                secondary: "user", used: false, is_simsage: false
                            });
                        } else {
                            // the list didn't change
                            conversation_list = operator.conversation_list;
                        }

                        // html 5 notifications enabled?
                        if (data.text && data.text.length > 0 &&
                            window.Notification && window.Notification.permission === "granted") {  // we have notification permission?
                            const title = "the Operator needs your Attention"; // title
                            const options = {
                                body: "A new question just came in.  Click here to open the operator window.  \"" + data.text + "\""
                            };
                            const notification = new Notification(title, options);  // display notification
                            notification.onclick = function () {
                                window.focus();
                            }
                        }

                        if (data.previousAnswer && data.previousAnswer.length > 0) {
                            operator.prev_answer = data.previousAnswer;
                        }

                        if (data.clientId.length > 5) {
                            operator.client_id = data.clientId;
                            operator.client_kb_id = data.kbId;
                        }

                        // set the name of the knowledge base connected to
                        if (data.kbName && data.kbName.length > 0) {
                            operator.client_kb_name = data.kbName;
                        }

                        // set potentially changed items
                        operator.conversation_list = conversation_list;
                        operator.is_typing = false;
                        operator.typing_time = 0;

                        // create the new organisation list
                        const new_list = [];
                        for (const op of state.operators) {
                            if (op.id !== data.organisationId) {
                                new_list.push(op);
                            } else {
                                new_list.push(operator);
                            }
                        }

                        return {
                            ...state,
                            operators: new_list,
                        }

                    } // organisation != null
                    else {
                        console.log("organisation id not found:" + data.organisationId);
                    }

                } // else

            } // if mt_message

            return {
                ...state,
            }
        }

        case SET_OPERATOR_CONNECTED: {
            const new_list = [];
            for (const op of state.operators) {
                op.operator_ready = false;
                clear_operator(op);
                new_list.push(op);
            }
            return {
                ...state,
                operator_connected: action.connected,
                num_active_connections: 0,
                operators: new_list,
            }
        }

        case CLEAR_PREVIOUS_ANSWER: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    op.current_question = '';
                    op.prev_answer = '';
                }
                new_list.push(op);
            }
            return {
                ...state,
                operators: new_list,
            }
        }

        case ADD_CONVERSATION: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    op.conversation_list.push(action.item);
                }
                new_list.push(op);
            }
            return {
                ...state,
                operators: new_list,
            }
        }

        case MARK_CONVERSATION_USED: {
            const new_list = [];
            for (const op of state.operators) {
                if (op.id === action.operatorId) {
                    const message_list = op.conversation_list;
                    for (const message of message_list) {
                        if (message.id === action.id) {
                            message.used = true;
                        }
                    }
                    op.conversation_list = message_list;
                }
                new_list.push(op);
            }
            // copy list to make a new one
            return {
                ...state,
                operators: new_list,
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

