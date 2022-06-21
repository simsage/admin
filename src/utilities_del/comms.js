import axios from "axios/index";
import {loadState} from "../common/helpers";

// import {loadState} from '../state/stateLoader'


// communications common to all components
export class Comms {

    static http_post(url, session_id, payload, fn_success, fn_fail) {
        const api_base = window.ENV.api_base;
        console.log('POST ' + api_base + url);
        axios.post(api_base + url, payload, Comms.getHeaders(session_id))
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

    static http_put(url, session_id, payload, fn_success, fn_fail) {
        const api_base = window.ENV.api_base;
        console.log('PUT ' + api_base + url);
        axios.put(api_base + url, payload, Comms.getHeaders(session_id))
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

    static http_get(url, session_id, fn_success, fn_fail) {
        const api_base = window.ENV.api_base;
        if (url !== '/stats/stats/os') {
            console.log('GET ' + api_base + url);
        }
        return axios.get(api_base + url, Comms.getHeaders(session_id))
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

    static http_get_jwt(url, jwt, fn_success, fn_fail) {
        const api_base = window.ENV.api_base;
        // if (url !== '/stats/stats/os') {
        //     console.log('GET ' + api_base + url);
        // }
        return axios.get(api_base + url,{
                headers: {"API-Version": window.ENV.api_version, "Content-Type": "application/json", "jwt": jwt,}
            })
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

    static http_delete(url, session_id, fn_success, fn_fail) {
        const api_base = window.ENV.api_base;
        console.log('DELETE ' + api_base + url);
        axios.delete(api_base + url, Comms.getHeaders(session_id))
            .then(function (response) {
                if (fn_success) {
                    fn_success(response);
                }
            })
            .catch(function (error) {
                if (fn_fail) {
                    if (error === undefined || error.response === undefined) {
                        fn_fail('Servers not responding or cannot contact Servers');
                    } else {
                        fn_fail(Comms.get_error(error));
                    }
                }
            });
    };

    // get a url that can be used to backup the system, regime e {all (backup all orgs), specific (backup specified org)}
    static download_backup(organisation_id, regime, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), {}, (response) => {
            const url = window.ENV.api_base + '/backup/backup/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(regime);
            Comms.download_new_window_post(url, response.data);
        });
    };

    // get a url that can be used to backup the system
    static download_mind_dump(organisation_id, kb_id, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), session_id, {}, (response) => {
            const url = window.ENV.api_base + '/backup/mind-dump/' + encodeURIComponent(organisation_id) + '/' + encodeURIComponent(kb_id);
            Comms.download_new_window_post(url, response.data);
        });
    };

    // get a url that can be used to summarize the system
    static download_inventorize_dump(organisation_id, kb_id, dateTime, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), session_id, {}, (response) => {
            const url = window.ENV.api_base + '/document/parquet/' + encodeURIComponent(organisation_id) + '/' +
                encodeURIComponent(kb_id) + '/' + encodeURIComponent(dateTime);
            Comms.download_new_window_post(url, response.data);
        });
    };

    // get a url that can be used to summarize the system using a spreadsheet
    static download_inventorize_dump_spreadhseet(organisation_id, kb_id, dateTime, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), session_id, {}, (response) => {
            const url = window.ENV.api_base + '/document/spreadsheet/' + encodeURIComponent(organisation_id) + '/' +
                encodeURIComponent(kb_id) + '/' + encodeURIComponent(dateTime);
            Comms.download_new_window_post(url, response.data);
        });
    };

    // get a url that can be used to get the query-logs
    static download_query_log(organisation_id, kb_id, year, month, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), session_id, {}, (response) => {
            const url = window.ENV.api_base + '/stats/query-logs/' + encodeURIComponent(organisation_id) + '/' +
                encodeURIComponent(kb_id) + '/' + encodeURIComponent(year) + '/' + encodeURIComponent(month);
            Comms.download_new_window_post(url, response.data);
        });
    };

    // get a url that can be used to get a zip archive of a wp export
    static download_export_archive(organisation_id, kb_id, source_id, session_id) {
        Comms.http_put('/auth/ott/' + encodeURIComponent(organisation_id), session_id, {}, (response) => {
            const url = window.ENV.api_base + '/crawler/wp-archive/download/' + encodeURIComponent(organisation_id) + '/' +
                encodeURIComponent(kb_id) + '/' + encodeURIComponent(source_id);
            Comms.download_new_window_post(url, response.data);
        });
    };

    static toUrl(str) {
        return window.ENV.api_base + str;
    }

    // download the url in a new window, passing SessionId as a query-string parameter (hidden in logs over ssh)
    static download_new_window_post(url, one_time_token) {
        // Create a form
        const mapForm = document.createElement("form");
        mapForm.style = "display: none;";
        mapForm.target = "_blank";
        mapForm.method = "POST";
        mapForm.action = url + "?ott=" + encodeURIComponent(one_time_token);
        // create a fake element so it posts
        const mapInput = document.createElement("input");
        mapInput.type = "text";
        mapInput.name = "name";
        mapInput.value = "value";
        mapForm.appendChild(mapInput);
        document.body.appendChild(mapForm);
        mapForm.submit();
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
        console.log("loadstate",state)
        return state;
        if (state && state.appReducer && state.appReducer.session && state.appReducer.session.id) {
            return state.appReducer.session;
        }
        return null;
    }

    static getHeaders(session_id) {
        if (session_id) {
            return {
                headers: {
                    "API-Version": window.ENV.api_version,
                    "Content-Type": "application/json",
                    "session-id": session_id,
                }
            }
        }
        return {
            headers: {
                "API-Version": window.ENV.api_version,
                "Content-Type": "application/json"
            }
        };
    }

}
export default Comms;
