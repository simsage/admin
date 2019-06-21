import {Comms} from "../common/comms";

// api wrappers
export class Api {

    // generate a guid
    static createGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    // perform a sign-in
    static signIn(email, password, success, fail) {
        if (email && email.length > 0 && password && password.length > 0) {
            Comms.http_post('/auth/sign-in', {"email": email, "password": password},
                (response) => { success(response.data.session, response.data.user) },
                (errStr) => { fail(errStr) }
            )
        }
        else{
            fail('please complete and check all fields');
        }
    };

    // start a password reset request
    static passwordResetRequest(email, success, fail) {
        if (email && email.length > 0) {
            Comms.http_get('/auth/reset-password-request' + encodeURIComponent(email),
                (response) => { success(response.data.session, response.data.user) },
                (errStr) => { fail(errStr) }
            )
        }
        else{
            fail('you must provide your SimSage email address');
        }
    };

    // reset a password (do it)
    static resetPassword(email, newPassword, reset_id, success, fail) {
        if (email && email.length > 0 && newPassword.length > 0) {
            const payload = {"email": email, "password": newPassword, "resetId": reset_id};
            Comms.http_post('/auth/reset-password', payload,
                (response) => { success(response.data.session, response.data.user) },
                (errStr) => { fail(errStr) }
            )
        }
        else{
            fail('please complete and check all fields');
        }
    };

    // get the user object (or null if dne)
    static getUser() {
        var user = localStorage.getItem("user");
        if (user && user.startsWith("{")) {
            return JSON.parse(user);
        }
        return null;
    }

    // update an organisation
    static updateOrganisation(organisation_id, name, success, fail) {
        Comms.http_put('/auth/organisation',
            {"id": organisation_id, "name": name},
            (response) => { success(response) },
            (errStr) => { fail(errStr) }
        )
    };

    // remove an organisation (delete it)
    static deleteOrganisation(organisationId, success, fail) {
        if (organisationId) {
            Comms.http_delete('/auth/organisation/' + encodeURIComponent(organisationId),
                (response) => { success(response) },
                (errStr) => { fail(errStr) }
            )
        }
    }


    // get a paginated list of users
    static getUsersPaginated(organisationId, prev_user_email, page_size, success, fail) {
        Comms.http_get('/auth/users/' + encodeURIComponent(organisationId) + '/' + encodeURIComponent(prev_user_email) + '/' + encodeURIComponent(page_size),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // remove / delete a user
    static removeUserFromOrganisation(user_id, organisation_id, success, fail) {
        Comms.http_delete('/auth/organisation/user/' + encodeURIComponent(user_id) + '/' +
                            encodeURIComponent(organisation_id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // set user's primary organisation
    static setUserPrimaryOrganisation(user_id, organisation_id, success, fail) {
        Comms.http_put('/auth/active/organisation/' + encodeURIComponent(user_id) + '/' + encodeURIComponent(organisation_id),
            {},
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // update a user account
    static updateUser(organisation_id, id, name, surname, email, password, role_list, success, fail) {
        const actual_role_data = [];
        for (const roleStr of role_list) {
            actual_role_data.push({"userId": id, "organisationId": organisation_id, "role": roleStr});
        }
        Comms.http_put('/auth/user/' + encodeURIComponent(organisation_id),
            {"id": id, "password": password, "firstName": name, "surname": surname, "email": email, "roles": actual_role_data},
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // return a list of organisations this user has admin access over
    static getUserOrganisationList(success, fail) {
        Comms.http_get('/auth/user/organisations',
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // get a paginated list of knowledge bases
    static getKnowledgeBasesPaginated(organisationId, prev_kb_id, page_size, success, fail) {
        Comms.http_get('/knowledgebase/' + encodeURIComponent(organisationId) + '/' + encodeURIComponent(prev_kb_id) + '/' + encodeURIComponent(page_size),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // remove / delete a knowledge base by id
    static deleteKnowledgeBase(organisation_id, knowledge_base_id, success, fail) {
        Comms.http_delete('/knowledgebase/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(knowledge_base_id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // update a knowledge base
    static updateKnowledgeBase(organisation_id, id, name, security_id, success, fail) {
        Comms.http_put('/knowledgebase/',
            {"kbId": id, "organisationId": organisation_id, "name": name, "securityId": security_id},
            (response) => { success(response) },
            (errStr) => { fail(errStr) }
        )
    };

    // upload data to the system
    static uploadDocument(payload, success, fail) {
        Comms.http_put('/document/upload', payload,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // save or create a crawler
    static updateCrawler(crawler, success, fail) {
        Comms.http_post('/crawler/crawler', crawler,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // save or create a crawler
    static getCrawlersPaginated(organisationId, kb_id, prev_id, page_size, success, fail) {
        Comms.http_get('/crawler/crawlers/' + encodeURIComponent(organisationId) + '/' +
                            encodeURIComponent(kb_id) + '/' + encodeURIComponent(prev_id) + '/' +
                            encodeURIComponent(page_size),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }


    // delete a crawler
    static deleteCrawler(organisationId, kb_id, id, success, fail) {
        Comms.http_delete('/crawler/crawler/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }


    // perform a semantic search
    static semanticSearch(organisationId, kb_id, keywords, num_results=10, score_threshold=0.1, success, fail) {
        Comms.http_put('/semantic/search', {
                organisationId: organisationId,
                kbId: kb_id,
                keywords: keywords,
                numResults: num_results,
                scoreThreshold: score_threshold,
            },
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }


    // get a paginated list of documents
    static getDocumentsPaginated(organisationId, kb_id, filter, prev_document, page_size, success, fail) {
        Comms.http_post('/document/documents', {"organisationId": organisationId, "kbId": kb_id,
                "prevUrl": prev_document, "pageSize": page_size,
                "filter": filter},
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };


    // remove an organisation (delete it)
    static deleteDocument(organisationId, kbId, url, success, fail) {
        if (organisationId && kbId && url) {
            const full_url = '/document/document/' + encodeURIComponent(organisationId) + '/' +
                encodeURIComponent(kbId) + '/' + encodeURIComponent(url.replace(/\./g, "||"));
            console.log(full_url);
            Comms.http_delete(full_url,
                (response) => { success(response) },
                (errStr) => { fail(errStr) }
            )
        }
    }


    // get all the statistics
    static getStats(organisationId, kbId, year, month, top, success, fail) {
        Comms.http_get('/stats/stats/' + encodeURIComponent(organisationId) + '/' +
                                             encodeURIComponent(kbId) + '/' +
                                             encodeURIComponent(year) + '/' +
                                             encodeURIComponent(month) + '/' +
                                             encodeURIComponent(top),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // find a list of mind items
    static uiMindFind(organisationId, kbId, query, success, fail) {
        Comms.http_put('/bot/ui-find', {"organisationId": organisationId, "kbId": kbId,
                "query": query, "numResults": 10},
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // delete a mind item by id
    static uiMindDelete(organisationId, kbId, id, success, fail) {
        Comms.http_delete('/bot/ui-delete/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kbId) + '/' + encodeURIComponent(id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // save a mind item
    static uiMindSave(organisationId, kbId, mindItem, success, fail) {
        Comms.http_put('/bot/ui-save/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kbId), mindItem,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // find a list of synonyms
    static findSynonyms(organisationId, kbId, query, success, fail) {
        Comms.http_put('/language/find-synonyms', {"organisationId": organisationId, "kbId": kbId,
                "query": query, "numResults": 10},
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // delete a synonym by id
    static deleteSynonym(organisationId, kbId, id, success, fail) {
        Comms.http_delete('/language/delete-synonym/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kbId) + '/' + encodeURIComponent(id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // save a synonym
    static saveSynonym(organisationId, kbId, synonym, success, fail) {
        Comms.http_put('/language/save-synonym/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kbId), synonym,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

    // restore SimSage
    static restore(data, success, fail) {
        console.log(data);
        Comms.http_put('/backup/restore', data,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }

}

export default Api;
