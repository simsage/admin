import Api from "./api";

export function getFullname(user){
    return user.firstName + ' ' + user.surname
}

export const local_storage_key = window.ENV.local_storage_key;

export function loadState() {
    try {
        let serializedState = localStorage.getItem(local_storage_key);
        if (serializedState === null || window.location.href.endsWith("/#/")) {
            // return {"appReducer": initializeState()};
            //TODO::Add initialize state here
            return {"appReducer": {}};
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {"appReducer": {}};
    }
}


export function saveState(state) {
    try {
        let serializedState = JSON.stringify(state);
        localStorage.setItem(local_storage_key, serializedState);
        // console.log("saveState")
    } catch (err) {
    }
}


export function clearState() {
    try {
        // saveState(initializeState());
        saveState({});
    } catch (err) {
    }
}


export function  hasRole(user, role_name_list) {
    if (user && user.roles) {
        for (const role of user.roles) {
            if (role_name_list.indexOf(role.role) >= 0) {
                return true;
            }
        }
    }
    return false;
}


export function formatRoles(organisationId, roles) {
    let roles_str = "";
    for (const role of roles) {
        // admin always displays
        if (role.organisationId === organisationId || role.role === "admin") {
            // make sure we add the admin role only once
            if (role.role === "admin" && roles_str.indexOf("admin") === -1) {
                if (roles_str.length > 0) {
                    roles_str += ", ";
                }
                roles_str += Api.getPrettyRole(role.role);
            } else if (role.role !== "admin") {  // any other role just add
                if (roles_str.length > 0) {
                    roles_str += ", ";
                }
                roles_str += Api.getPrettyRole(role.role);
            }
        }
    }
    return roles_str;
}

