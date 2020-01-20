import Api from '../common/api'

//
// this defines the initial state of the entire application - the state store
//
export function initializeState() {
    return {
        // which tab is selected in the app
        selected_tab: 'organisations',

        // notification system
        notification_list: [],
        show_notifications: false,
        notification_time_in_ms: 5000,
        notification_list_display_size: 50,

        // organisational data
        selected_organisation_id: "",
        selected_organisation: "",
        organisation_list: [],

        // kb status
        selected_knowledgebase: null,
        selected_knowledgebase_id: "",
        knowledge_base_list: [],

        // inventory items for a given kb
        inventorize_list: [],
        inventorize_busy: false,

        // the users
        user_list: [],

        // crawlers
        crawler_list: [],

        // system busy
        busy: false,

        // program busy uploading
        uploading: false,

        // session and user objects
        session: null,
        user: null,

        // system license
        license: null,

        // documents
        document_list: [],
        document_previous: null,
        document_filter: '',
        prev_document_filter: '',   // see what the last filter was (reset pagination if changed)
        document_page: 0,
        document_page_size: 5,
        num_documents: 0,
        // nav-list with page 0 id
        document_nav_list: ["null"],

        // mind items
        mind_item_list: [],
        mind_page_size: 10,
        mind_item_filter: '',

        // mind query (aka. bot query)
        bot_query: "",
        bot_query_result_list: [],
        bot_query_page_size: 10,
        bot_query_threshold: 0.01,

        // synonyms
        synonym_filter: "",
        synonym_list: [],
        synonym_page_size: 1000,

        // semantics
        semantic_filter: "",
        semantic_list: [],
        semantic_page_size: 1000,

        // syn-sets
        synset_filter: "",
        synset_list: [],
        synset_page: 0,
        synset_page_size: 10,
        synset_total_size: 0,

        // reports
        report_date: Api.toIsoDate(new Date()),
        report_num_items: 20,
        bot_access_frequency: {labels: []},
        search_access_frequency: {labels: []},
        general_statistics: [],
        query_word_frequency: [],
        file_type_statistics: [],

        // operator
        conversation_list: [],
        operator_connected: false,
        num_active_connections: 0,
        operator_ready: false,
        // operator teaching
        question_id: '',
        question: '',
        answer_id: '',
        answer: '',
        // operator connected clients
        client_id: '',
        client_kb_id: '',
        client_kb_name: '',
        // operator previous answer
        current_question: '',
        prev_answer: '',

        // html5 notification permissions asked already?
        html5_notifications: '',

        // list of log files
        log_size: 100,
        log_list: [],
        selected_log: 'web',
        active_components: {}, // what processes are active

        // ad domain manager
        domain_list: [],

        // application error messages
        error_title: "Error",
        error: "",
    }
}


export function loadState() {
    try {
        let serializedState = localStorage.getItem("https://simsage.nz:state");

        if (serializedState === null) {
            return initializeState();
        }

        return JSON.parse(serializedState);
    }
    catch (err) {
        return initializeState();
    }
}


export function saveState(state) {
    try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem("https://simsage.nz:state", serializedState);
    }
    catch (err) {
    }
}


export function clearState(state) {
    try {
        localStorage.removeItem("https://simsage.nz:state");
    }
    catch (err) {
    }
}

