import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
    showAddUserForm,
    showDeleteUserAsk,
    showEditUserForm,
    showUserBulkForm,
    getUserListPaginated,
    showPasswordResetForm,
    setUserTextFilter,
} from "./usersSlice"
import { Pagination } from "../../common/pagination"
import Api from "../../common/api"
import { hasRole } from "../../common/helpers"
import UserDeleteAsk from "./UserDeleteAsk"
import { UserBulkForm } from "./UserBulkForm"
import api from "../../common/api"
import { UserEdit } from "./UserEdit"
import { UserPasswordResetForm } from "./UserPasswordResetForm"
import { UserErrorDialog } from "./UserErrorDialog"
import CustomSelect from "../../components/CustomSelect"

export function UsersHome() {
    const user_roles = useSelector((state) => state.usersReducer.roles)
    const user_text_filter = useSelector((state) => state.usersReducer.user_text_filter)
    const [page, setPage] = useState(api.initial_page)
    const [page_size, setPageSize] = useState(api.initial_page_size)

    const [userFilter, setUserFilter] = useState("all-users")

    const theme = null
    const dispatch = useDispatch()
    const user_account = useSelector((state) => state.authReducer.user)
    const user_list = useSelector((state) => state.usersReducer.user_list)
    const session = useSelector((state) => state.authReducer.session)
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const load_data = useSelector((state) => state.usersReducer.data_status)

    const isAdmin = hasRole(user_account, ["admin"])
    const isManager = hasRole(user_account, ["manager"])

    const show_user_form = useSelector((state) => state.usersReducer.show_user_form)
    const show_password_reset_form = useSelector((state) => state.usersReducer.show_password_reset_form)
    const show_delete_form = useSelector((state) => state.usersReducer.show_delete_form)
    const show_user_bulk_form = useSelector((state) => state.usersReducer.show_user_bulk_form)

    useEffect(() => {
        if (!session || !selected_organisation_id) return
        dispatch(
            getUserListPaginated({
                session_id: session.id,
                organization_id: selected_organisation_id,
                page: 0,
                page_size: 100000, // Fetch all users initially
                filter: user_text_filter ? user_text_filter : null,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now"])

    function handleSearchTextKeydown(e) {
        if (!session || !selected_organisation_id) return
        if (e.key === "Enter") {
            dispatch(
                getUserListPaginated({
                    session_id: session.id,
                    organization_id: selected_organisation_id,
                    page: 0,
                    page_size: 100000, // Fetch all users on search
                    filter: user_text_filter === "" ? null : user_text_filter,
                })
            )
        }
    }

    function handlePageSizeChange(num) {
        setPageSize(num)
        setPage(0)
    }

    function handleSearchTextChange(e) {
        if (selected_organisation_id) {
            dispatch(setUserTextFilter({ user_text_filter: e.target.value }))
        }
    }

    function handleAddNewUser() {
        dispatch(showAddUserForm(true))
    }

    function handleEditUser(u) {
        if (!session || !selected_organisation_id) return;
        dispatch(showEditUserForm({ show: true, user_id: u.id }))
    }

    function handlePasswordReset(u) {
        dispatch(showPasswordResetForm({ show: true, user_id: u.id }))
    }

    function handleUserBulk() {
        dispatch(showUserBulkForm())
    }

    function deleteUserAsk(u) {
        dispatch(showDeleteUserAsk({ show: true, user_id: u.id }))
    }

    function canEdit(user, isAdmin, isManager) {
        if (isAdmin) return true
        const userIsAdmin = hasRole(user, ["admin"])
        if (userIsAdmin) return false
        return isManager
    }

    function canDelete(user, signedInUser, isAdmin, isManager) {
        if (user.email === signedInUser.email) return false
        if (isAdmin) return true
        const userIsAdmin = hasRole(user, ["admin"])
        if (userIsAdmin) return false
        return isManager
    }

    function canView(user, signedInUser, isAdmin) {
        const sameOrg = user.roles.filter((role) => {
            return role.organisationId === signedInUser.organisationId;
        })

        if (user.email === signedInUser.email) return true;
        else if (sameOrg.length) return true;
        else return !!isAdmin
    }

    function filterRoles(userRoles, role) {
        if (role === "all-users") {
            return true
        }

        return userRoles.some(
            (role_obj) => role_obj.organisationId === selected_organisation_id && role_obj.role === role
        )
    }

    function getUserList() {
        let x_user_list = []
        for (const user of user_list) {
            if (filterRoles(user.roles, userFilter) && canView(user, session, isAdmin, isManager)) {
                x_user_list.push(user)
            }
        }
        return x_user_list
    }

    const filteredUserList = getUserList()
    const paginatedUserList = filteredUserList.slice(page * page_size, (page + 1) * page_size)

    const total_size = filteredUserList.length

    const userOptions = [
        { key: "all-users", value: "All Users" },
        ...user_roles.map((role, _) => ({ key: role, value: Api.getPrettyRole(role) }))
    ]

    return (
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input
                            type="text"
                            placeholder={"Filter..."}
                            value={user_text_filter}
                            autoFocus={true}
                            className={"form-control filter-search-input " + theme}
                            onKeyDown={(e) => handleSearchTextKeydown(e)}
                            onChange={(e) => handleSearchTextChange(e)}
                        />
                    </div>
                    <div className="form-group me-2" style={{ minWidth: "200px" }}>
                        <CustomSelect
                            label="User Role Select..."
                            defaultValue={userFilter}
                            onChange={(value) => setUserFilter(value)}
                            options={userOptions}
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="d-flex">
                    <button className="btn btn-outline-primary text-nowrap ms-2" onClick={() => handleUserBulk()}>
                        Import
                    </button>
                    <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddNewUser()}>
                        + Add User
                    </button>
                </div>
            </div>

            <div>
                {!user_list && <div>Loading...</div>}
                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Name</td>
                        <td className="small text-black-50 px-4">Email</td>
                        <td className="small text-black-50 px-4">Roles</td>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedUserList.map((user) => {
                        const editYes = canEdit(user, isAdmin, isManager);
                        const deleteYes = canDelete(user, session, isAdmin, isManager);

                        const user_roles = user.roles.map((role) => {
                            return role.role;
                        });
                        const isUser_an_Admin = user_roles.includes("admin");

                        return (
                            <tr key={user.id}>
                                <td className="pt-3 px-4 pb-3 fw-500">
                                    {user.firstName} {user.surname}{" "}
                                    <span className="fw-light fst-italic pt-2 text-black-50">
                      {user.email === user_account.email ? "(you)" : ""}
                    </span>
                                </td>
                                <td className="pt-3 px-4 pb-3 fw-light">{user.email}</td>
                                <td className="pt-3 px-4 pb-2">
                                    <div className="d-flex flex-wrap">
                                        {isUser_an_Admin ? (
                                            <div
                                                key="-1"
                                                className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill"
                                            >
                                                {api.getPrettyRole("System Administrator")}
                                            </div>
                                        ) : (
                                            <></>
                                        )}

                                        {user.roles.map((r, key) => {
                                            if (r.organisationId !== selected_organisation_id) {
                                                return <div key={r + key} />;
                                            } else {
                                                if (r.role !== "admin") {
                                                    return (
                                                        <div
                                                            key={r + key}
                                                            className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill"
                                                        >
                                                            {r.role}
                                                        </div>
                                                    );
                                                } else {
                                                    return <div key={r + key}></div>;
                                                }
                                            }
                                        })}
                                    </div>
                                </td>
                                <td className="pt-3 px-4 pb-0">
                                    <div className="d-flex  justify-content-end">
                                        <button
                                            disabled={editYes ? "" : "true"}
                                            className={editYes ? "btn text-primary btn-sm" : "btn text-secondary btn-sm"}
                                            onClick={() => handlePasswordReset(user)}
                                        >
                                            Reset password
                                        </button>
                                        <button
                                            disabled={editYes ? "" : "true"}
                                            className={editYes ? "btn text-primary btn-sm" : "btn text-secondary btn-sm "}
                                            onClick={() => handleEditUser(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={deleteYes ? "btn text-danger btn-sm" : "btn text-secondary btn-sm d-none"}
                                            onClick={() => deleteUserAsk(user)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                {paginatedUserList.length > 0 && (
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={total_size}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{ "aria-label": "Previous Page" }}
                        nextIconButtonProps={{ "aria-label": "Next Page" }}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rows) => handlePageSizeChange(rows)}
                    />
                )}
            </div>
            {show_user_form && <UserEdit />}
            {show_delete_form && <UserDeleteAsk />}
            {show_user_bulk_form && <UserBulkForm />}
            {show_password_reset_form && <UserPasswordResetForm />}
            <UserErrorDialog />
        </div>
    );
}
