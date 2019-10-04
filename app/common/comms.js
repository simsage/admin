import axios from "axios/index";
import system_config from "../settings";

import {loadState} from '../reducers/stateLoader'


// communications common to all components
export class Comms {

    static http_post(url, payload, fn_success, fn_fail) {
        const api_base = system_config.api_base;
        console.log('POST ' + api_base + url);
        axios.post(api_base + url, payload, Comms.getHeaders())
            .then(function (response) {
                if (fn_success) {
                    fn_success(response);
                }
            })
            .catch(function (error) {
                if (fn_fail) {
                    if (error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(Comms.get_error(error));
                    }
                }
            });
    };

    static http_put(url, payload, fn_success, fn_fail) {
        const api_base = system_config.api_base;
        console.log('PUT ' + api_base + url);
        axios.put(api_base + url, payload, Comms.getHeaders())
            .then(function (result) {
                if (fn_success) {
                    fn_success(result);
                }
            })
            .catch(function (error) {
                if (fn_fail) {
                    if (error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(Comms.get_error(error));
                    }
                }
            });
    };

    static http_get(url, fn_success, fn_fail) {
        const api_base = system_config.api_base;
        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }
        return axios.get(api_base + url, Comms.getHeaders())
            .then(function (response) {
                if (fn_success) {
                    fn_success(response);
                }
            })
            .catch((error) => {
                if (fn_fail) {
                    if (error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(Comms.get_error(error));
                    }
                }
            });
    };

    // get a url that can be used to backup the system
    static get_backup_url(organisation_id, kb_id) {
        let session = Comms.getSession();
        return system_config.api_base + '/backup/backup/' + encodeURIComponent(session.id) + '/' +
                encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
    };

    // get a url that can be used to backup the system
    static get_mind_dump_url(organisation_id, kb_id) {
        let session = Comms.getSession();
        return system_config.api_base + '/backup/mind-dump/' + encodeURIComponent(session.id) + '/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
    };

    // get a url that can be used to download a crawler
    static get_crawler_url(organisation_id, kb_id, crawler_id) {
        let session = Comms.getSession();
        return system_config.api_base + '/crawler/download/' + encodeURIComponent(session.id) + '/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id) + '/' + encodeURIComponent(crawler_id);
    };

    // get a url that can be used to download the bot html
    static get_html_url(html, organisation_id, kb_id) {
        let session = Comms.getSession();
        return system_config.api_base + '/knowledgebase/download/' + html + '/' + encodeURIComponent(session.id) + '/' +
                            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
    };

    // get a url that can be used to get the query-logs
    static get_query_log_url(organisation_id, kb_id) {
        let session = Comms.getSession();
        return system_config.api_base + '/stats/query-logs/' + encodeURIComponent(session.id) + '/' +
            encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
    };

    static http_delete(url, fn_success, fn_fail) {
        const api_base = system_config.api_base;
        console.log('DELETE ' + api_base + url);
        axios.delete(api_base + url, Comms.getHeaders())
            .then(function (response) {
                if (fn_success) {
                    fn_success(response);
                }
            })
            .catch(function (error) {
                if (fn_fail) {
                    if (error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(Comms.get_error(error));
                    }
                }
            });
    };

    static toUrl(str) {
        return system_config.api_base + str;
    }

    // convert js response to its error output equivalent
    static get_error(error) {
        if (typeof error === "string" && error.indexOf("{") === 0) {
            const obj = JSON.parse(error);
            if (obj && obj["response"] && obj["response"]["data"] && obj["response"]["data"]["error"]) {
                return obj["response"]["data"]["error"];
            } else {
                return error;
            }
        } else {
            if (error && error["response"] && error["response"]["data"] && error["response"]["data"]["error"]) {
                return error["response"]["data"]["error"];
            } else {
                return error;
            }
        }
    }

    // get a pretty formatted ISO date string (date only)
    static getISODate() {
        const a = new Date();
        const year = a.getFullYear();
        const month = a.getMonth() + 1;
        const date = a.getDate();
        return year + '-' + month + '-' + date;
    };

    static getSession() {
        const state = loadState();
        if (state && state.appReducer && state.appReducer.session) {
            return state.appReducer.session;
        }
        return null;
    }

    static getHeaders() {
        let session = Comms.getSession();
        if (session && session.id) {
            return {
                headers: {
                    "API-Version": system_config.api_version,
                    "Content-Type": "application/json",
                    "Session-Id": session.id,
                }
            }
        }
        return {
            headers: {
                "API-Version": system_config.api_version,
                "Content-Type": "application/json"
            }
        };
    }

}

export default Comms;
