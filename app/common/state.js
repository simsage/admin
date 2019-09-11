
// app state management
export class State {

    // clear ALL state
    static clearAll() {
        if (typeof(Storage) !== "undefined") {
            for (let key in localStorage) {
                localStorage.removeItem(key);
            }
        }
    };

    // get/load an object
    static get(variable_name, default_value=null) {
        if (typeof(Storage) !== "undefined") {
            const str = localStorage.getItem(variable_name);
            if (str && str.length && str.length > 0 && str.startsWith("{")) {
                return JSON.parse(str);
            }
        }
        return default_value;
    };

    // set an object
    static set(variable_name, obj) {
        if (typeof(Storage) !== "undefined") {
            if (obj === null || obj === undefined) {
                localStorage.removeItem(variable_name);
            } else {
                localStorage.setItem(variable_name, JSON.stringify(obj));
            }
        }
    };

    // check we have a session object and go back to sign-in if we don't
    static checkSession() {
        const session = State.get("session");
        if (!session) {
            window.location = '/';
        }
    }

    // check we are signed in
    static isSignedIn() {
        return State.get("session") !== null;
    }

    static signOut() {
        State.clearAll();
        window.location = '/';
    }


}

export default State;
