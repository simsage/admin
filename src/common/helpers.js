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
