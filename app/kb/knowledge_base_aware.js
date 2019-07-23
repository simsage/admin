import React from 'react';

import {State} from "../common/state";
import {Api} from "../common/api";


export class KnowledgeBaseAware {
    constructor(parent) {
        const org = State.get('organisation', {"organisation": "", "organisation_id": ""});
        const kb = State.get('knowledgebase', {"knowledgebase": "", "knowledgebase_id": ""});

        this.parent = parent;

        this.selected_organisation_id = org["organisation_id"];
        this.selected_organisation = org["organisation"];
        this.organisation_list = [];

        this.selected_knowledgebase = kb["knowledgebase"];
        this.selected_knowledgebase_id = kb["knowledgebase_id"];
        this.knowledge_base_list = [];
    }

    componentDidMount() {
        this.getOrganisationList("null", 100);
        if (this.selected_organisation_id.length > 0) {
            this.getKnowledgeBaseList("null", 100);
        } else {
            this.refresh();
        }
    }

    refresh() {
        if (this.parent) this.parent.forceUpdate();
    }

    getKnowledgeBaseList(prev_page, page_size) {
        if (this.selected_organisation_id.length > 0) {
            this.getKnowledgeBaseListWithId(this.selected_organisation_id, prev_page, page_size)
        }
    }

    getKnowledgeBaseListWithId(id, prev_page, page_size) {
        if (this.selected_organisation_id.length > 0) {
            Api.getKnowledgeBasesPaginated(this.selected_organisation_id, prev_page, page_size,
                (knowledge_base_list) => {
                    console.log('knowledge_base_list size = ' + knowledge_base_list.length);
                    this.knowledge_base_list = knowledge_base_list;
                    this.refresh();
                },
                (errStr) => { console.error('getKnowledgeBaseList:' + errStr); }
            )
        }
    }

    refreshKnowledgeBaseList(prev_page, page_size) {
        this.getKnowledgeBaseList(prev_page, page_size);
    }

    getKnowledgeBaseListFiltered(filter_text, callback) {
        if (filter_text && filter_text.length > 0) {
            const ft_lower = filter_text.toLowerCase();
            const filtered_list = [];
            for (const item of this.knowledge_base_list) {
                if (item.name.toLowerCase().indexOf(ft_lower) >= 0) {
                    filtered_list.push({'label': item.name, 'data': item.kbId});
                }
            }
            callback(filtered_list);
        } else {
            const filtered_list = [];
            for (const item of this.knowledge_base_list) {
                filtered_list.push({'label': item.name, 'data': item.kbId});
            }
            callback(filtered_list);
        }
    }

    selectKnowledgeBase(name, id) {
        State.set('knowledgebase', {"knowledgebase": name, "knowledgebase_id": id});
        this.selected_knowledgebase = name;
        this.selected_knowledgebase_id = id;
        this.refresh();
    }

    // change the name of a kb
    updateKnowledgeBase(name, email, id, prev_page, page_size) {
        if (id && this.selected_knowledgebase_id === id) {
            this.selected_knowledgebase = name;
        }
        this.getKnowledgeBaseList(prev_page, page_size);
    }

    // remove a kb
    deleteKnowledgeBase(id, prev_page, page_size) {
        if (id && this.selected_knowledgebase_id === id) {
            this.selected_knowledgebase_id = "";
            this.selected_knowledgebase = "";
        }
        this.getKnowledgeBaseList(prev_page, page_size);
    }

    // remove an organisation
    deleteOrganisation(id, prev_page, page_size) {
        if (id && this.selected_organisation_id === id) {
            this.selected_organisation_id = "";
            this.selected_organisation = "";
            this.selected_knowledgebase_id = "";
            this.selected_knowledgebase = "";
        }
        this.getOrganisationList(prev_page, page_size);
    }

    // get the list of organisations
    getOrganisationList(prev_page, page_size) {
        Api.getUserOrganisationList(
            (organisation_list) => {
                console.log('organisation_list size = ' + organisation_list.length);
                this.organisation_list = organisation_list;
                this.refresh();
            },
            (errStr) => { console.error('getOrganisationList:' + errStr); }
        );
    }

    selectOrganisation(name, id) {
        State.set('organisation', {"organisation": name, "organisation_id": id});
        this.selected_organisation = name;
        this.selected_organisation_id = id;
        this.selected_knowledgebase_id = "";
        this.selected_knowledgebase = "";
        this.getKnowledgeBaseListWithId(id, "null", 100); // does the refresh
    }

    getOrganisationListFiltered(filter_text, callback) {
        if (filter_text && filter_text.length > 0) {
            const ft_lower = filter_text.toLowerCase();
            const filtered_list = [];
            for (const item of this.organisation_list) {
                if (item.name.toLowerCase().indexOf(ft_lower) >= 0) {
                    filtered_list.push({'label': item.name, 'data': item.id});
                }
            }
            callback(filtered_list);
        } else {
            const filtered_list = [];
            for (const item of this.organisation_list) {
                filtered_list.push({'label': item.name, 'data': item.id});
            }
            callback(filtered_list);
        }
    }


}

export default KnowledgeBaseAware;
