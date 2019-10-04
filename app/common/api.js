import {Comms} from "../common/comms";
import system_config from "../settings";
import {parseISODate} from "luxon/src/impl/regexParser";

// api wrappers
export class Api {

    static defined(value) {
        return (value !== null && value !== undefined);
    }

    // generate a guid
    static createGuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };

    // convert unix timestamp to string
    static unixTimeConvert(timestamp){
        const a = new Date(timestamp);
        const year = a.getFullYear();
        const month = a.getMonth() + 1;
        const date = a.getDate();
        const hour = a.getHours();
        const min = a.getMinutes();
        const sec = a.getSeconds();
        return year + '/' + Api.pad2(month) + '/' + Api.pad2(date) + ' ' + Api.pad2(hour) + ':' + Api.pad2(min) + ':' + Api.pad2(sec);
    }

    // convert a date object to an iso date string
    static toIsoDate(date){
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '-' + Api.pad2(month) + '-' + Api.pad2(day) + 'T00:00:00.000';
    }

    static pad2(item) {
        return ("" + item).padStart(2, '0');
    }

    // setup the timer
    static setupTimer() {
        return true;
    }

    // merge two notifications lists together and return the resulting unique list of items
    static merge_notifications(original, list) {
        const seen = {};
        const new_list = [];
        if (original) {
            for (const item of original) {
                seen[item.id] = true;
                new_list.push(item);
            }
        }
        if (list) {
            for (const item of list) {
                if (!seen.hasOwnProperty(item.id)) {
                    seen[item.id] = true;
                    new_list.push(item);
                }
            }
        }
        return new_list;
    }

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

    // upload data to the system
    static uploadDocument(payload, success, fail) {
        Comms.http_put('/document/upload', payload,
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    };

    // delete a crawler's document
    static deleteCrawlerDocuments(organisationId, kb_id, id, success, fail) {
        Comms.http_delete('/crawler/crawler/document/' + encodeURIComponent(organisationId) + '/' +
            encodeURIComponent(kb_id) + '/' + encodeURIComponent(id),
            (response) => { success(response.data) },
            (errStr) => { fail(errStr) }
        )
    }


    // test a specific crawler's connectivity
    static testCrawler(organisationId, kb_id, id, success, fail) {
        Comms.http_get('/crawler/crawler/test/' + encodeURIComponent(organisationId) + '/' +
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
                botQuery: keywords,         // raw text
                superSearch: keywords,      // super search markup
                numResults: num_results,
                scoreThreshold: score_threshold,
            },
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
