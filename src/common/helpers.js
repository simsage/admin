import Api from "./api";

export const local_storage_key = (window.ENV)?window.ENV.local_storage_key:"";

export function hasRole(user, role_name_list) {
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

