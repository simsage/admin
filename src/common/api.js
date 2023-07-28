import {Comms} from "../common/comms";

// api wrappers
export class Api {

    static initial_page_size = 10;
    static initial_page = 0;

    static defined(value) {
        return (value !== null && value !== undefined);
    }


    static pretty_version() {
        const parts = window.ENV.version.split(".");
        console.log("parts = " + parts.length)
        if (parts.length === 3 || parts.length === 4) {
            return parts[0] + "." + parts[1] + " (build " + parts[2] + ")";
        }
        return window.ENV.version;
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

    // create an empty operator packet
    static createOperator() {
        return {id: Api.createGuid(),
            conversation_list: [], operator_ready: false,
            question_id: '', question: '', answer_id: '', answer: '',
            // operator connected clients
            client_id: '', client_kb_id: '', client_kb_name: '', is_typing: false, typing_time: 0,
            // operator previous answer
            current_question: '', prev_answer: '',
        }
    };

    static formatSizeUnits(bytes) {
        if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
        else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
        else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
        else if (bytes > 1)           { bytes = bytes + " bytes"; }
        else if (bytes === 1)          { bytes = bytes + " byte"; }
        else                          { bytes = "0 bytes"; }
        return bytes;
    };

    // convert unix timestamp to string if it's for a reasonable time in the future
    static unixTimeConvert(timestamp){
        if (timestamp > 1000) {
            const a = new Date(timestamp);
            const year = a.getUTCFullYear();
            const month = a.getUTCMonth() + 1;
            const date = a.getUTCDate();
            const hour = a.getUTCHours();
            const min = a.getUTCMinutes();
            const sec = a.getUTCSeconds();
            return year + '/' + Api.pad2(month) + '/' + Api.pad2(date) + ' ' + Api.pad2(hour) + ':' + Api.pad2(min) + ':' + Api.pad2(sec);
        }
        return "";
    }

    // get current time in milli-seconds
    static getSystemTime() {
        return new Date().getTime();
    }

    // convert a date object to an iso date string
    static toIsoDate(date) {
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '-' + Api.pad2(month) + '-' + Api.pad2(day) + 'T00:00:00.000';
    }

    // convert a date object to an iso date string
    static toIsoDateTime(date) {
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let offset_hours = 0; // date.getTimezoneOffset() / 60;
        let hour = date.getHours() + offset_hours;
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        return year + '-' + Api.pad2(month) + '-' + Api.pad2(day) + 'T' + Api.pad2(hour) + ':00:00.000';
    }

    // convert a date object to an iso date string
    static toPrettyDateTime(date) {
        if (!date || isNaN(date))
            return "invalid date";
        if (!date || !date.getFullYear) {
            date = new Date()
        }
        const year = date.getFullYear();
        if (isNaN(year))
            return "invalid date";
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if (isNaN(month))
            return "invalid date";
        let offset_hours = 0; // date.getTimezoneOffset() / 60;
        let hour = date.getHours() + offset_hours;
        if (hour < 0) hour += 24;
        if (hour >= 24) hour -= 24;
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        return year + '/' + Api.pad2(month) + '/' + Api.pad2(day) + ' ' + Api.pad2(hour) + ":" + Api.pad2(mins) + ":" + Api.pad2(secs);
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

    // get color component (fg) of the global theme
    static getThemeColour(theme) {
        if (theme === 'light')
            return "#2a2a2e";
        else
            return "#e0e0e0";
    }

    // get background component (bg) of the global theme
    static getThemeBackground(theme) {
        if (theme === 'light')
            return "#ffffff";
        else
            return "#2a2a2e";
    }

    // start a password reset request
    static passwordResetRequest(email, success, fail) {
        if (email && email.length > 0) {
            Comms.http_post('/auth/reset-password-request', {"email": email},
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

    // write text to the clipboard, if we can
    static writeToClipboard(text) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            return true;
        }
        return false;
    }

    //return array of pretty roles
    static getPrettyRoles(roles){
        const pretty_roles = roles.map(role => {
            return {'role':role, 'label':this.getPrettyRole(role)}
        })

        return pretty_roles;
        // return ['admin', 'operator', 'dms', 'manager', 'discover', 'search'];
    }

    // pretty print a role
    static getPrettyRole(role) {
        // 'admin', 'operator', 'dms', 'manager'
        if (role === 'admin') return "System Administrator";
        else if (role === 'operator') return "Knowledgebase Operator";
        else if (role === 'dms') return "DMS User";
        else if (role === 'manager') return "Organisational Manager";
        else if (role === 'discover') return "Discover User";
        else if (role === 'search') return "Search User";
        else return role;
    }

}

export default Api;
