import React, {useEffect, useState} from "react";
import {UserEdit} from "./UserEdit";
import {useDispatch, useSelector} from "react-redux";
import {
    showAddUserForm,
    showDeleteUserAsk,
    showEditUserForm,
    orderBy,
    showUserBulkForm, getUserListPaginated
} from "./usersSlice";
import {Pagination} from "../../common/pagination";
import {formatRoles, hasRole} from "../../common/helpers";
import UserDeleteAsk from "./UserDeleteAsk";
import {UserBulkForm} from "./UserBulkForm";

export function UsersHome(){

    const [page, setPage] = useState(useSelector((state) => state.usersReducer.page))
    const roles = useState(useSelector((state) => state.usersReducer.roles))

    const [page_size, setPageSize] = useState(useSelector((state) => state.usersReducer.page_size))
    const [selectedUser, setSelectedUser] = useState()
    const [searchFilter,setSearchFilter] = useState('')
    const [orderFilter,setOrderFilter] = useState()
    const [userFilter,setUserFilter] = useState('all-users')

    const theme = null;
    const dispatch = useDispatch();


    const user_account = useSelector((state) => state.authReducer.user)
    const user_list = useSelector((state) => state.usersReducer.user_list)
    const user_list_status = useSelector((state) => state.usersReducer.status)
    const session = useSelector((state)=>state.authReducer.session)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)
    const load_data = useSelector((state) => state.usersReducer.data_status)
    const count = useSelector((state) => state.usersReducer.count)

    const isAdmin = hasRole(user_account, ['admin']);
    const isManager = hasRole(user_account, ['manager']);

    useEffect(()=>{
        dispatch(getUserListPaginated({session_id:session.id, organization_id:selected_organisation_id,page:page,page_size:page_size,filter:null}))
    },[load_data === "load_now",page,page_size])

    function handleSearchTextKeydown(e) {
        if (e.key === "Enter"  && selected_organisation_id) {
            dispatch(getUserListPaginated({session_id:session.id, organization_id:selected_organisation_id,page:page,page_size:page_size,filter:searchFilter === '' ? null : searchFilter}))
            setSearchFilter('');
        }
    }

    function handleSearchTextChange(e) {
        if (selected_organisation_id) {setSearchFilter(e.target.value);}
    }

    function handleAddNewUser(){
        dispatch(showAddUserForm(true))
    }

    function handleEditUser(u) {
        dispatch(showEditUserForm({show:true, user_id: u.id}));
    }

    function handleUserBulk(){
        dispatch(showUserBulkForm());
    }

    function handleOrderBy(e) {
        const val = e.target.value;
        dispatch(orderBy({order_by: val}))
    }

    function deleteUserAsk(u){
        dispatch(showDeleteUserAsk({show:true, user_id:u.id}))
    }


    // is this user entitle to edit the user passed in?
    function canEdit(user, isAdmin, isManager) {
        // admin can edit anyone, always
        //console.log((isAdmin)?"Admin":"Not Admin")
        if (isAdmin) return true;
        // a non admin user can never edit an administrator
        const userIsAdmin = hasRole(user, ['admin']);
        if (userIsAdmin) return false;
        // managers can edit everyone else
        return isManager;
    }
    // is this user entitle to edit the user passed in?
    function canDelete(user, signedInUser, isAdmin, isManager) {
        // one cannot delete the signed-in user
        if (user.email === signedInUser.email) return false;
        // admin can edit anyone, always
        if (isAdmin) return true;
        // a non admin user can never edit an administrator
        const userIsAdmin = hasRole(user, ['admin']);
        if (userIsAdmin) return false;
        // managers can edit everyone else
        return isManager;
    }

    //Filtering out users according to 'Role' drop down.
    function filterRoles(userRoles, role) {
        if(role === 'all-users'){return true}
        const reducedRoleArray = userRoles.map( el => {
            return el.role
        })
        return reducedRoleArray.includes(role);
    }

    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control filter-search-input " + theme}
                               onKeyDown={(e) => handleSearchTextKeydown(e)}
                               onChange={(e) => handleSearchTextChange(e)}
                        />
                    </div>


                    {/*todo Max: implementing the order by; Please see KB - Orderby*/}
                    {/* <div className="form-group me-2">
                        <select  placeholder={"Filter"} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => handleOrderBy(e)}>
                            <option value="first_name">Order by: First Name</option>
                            <option value="last_name">Order by: Last Name</option>
                        </select>
                    </div> */}

                    {/*todo:: Max - implementing the filter by role, similar to order by; Also load the roles from the slice*/}
                    <div className="form-group me-2">
                        <select type="text" placeholder={"Filter"} value={userFilter} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => {setUserFilter(e.target.value);}}>
                            <option value="all-users">All Users</option>
                            <option value="admin">Admin</option>
                            <option value="system administrator">System Administrator</option>
                            <option value="DMS">DMS</option>
                        </select>
                    </div>
                </div>

                <div className="d-flex">
                    <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleAddNewUser()}>
                        + Add User
                    </button>
                    <button className="btn btn-primary text-nowrap ms-2" onClick={() => handleUserBulk()}>
                        + User Bulk
                    </button>
                </div>
            </div>


            <div className="">
                {!user_list &&
                    <div>Loading...</div>
                }
                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Name</td>
                        <td className="small text-black-50 px-4">Email</td>
                        <td className="small text-black-50 px-4">Roles</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>

                    {
                        user_list && user_list.map((user) => {
                            //user does not have chosen role then skip.
                            if(!filterRoles(user.roles, userFilter)){return null}

                            const editYes = canEdit(user, isAdmin, isManager);
                            const deleteYes = canDelete(user, session, isAdmin, isManager);

                            return <tr key={user.id} >
                                <td className="pt-3 px-4 pb-3 fw-500">{user.firstName} {user.surname} <span className="fw-light fst-italic pt-2 text-black-50">{user.email === user_account.email ? '(you)' : ""}</span> </td>
                                <td className="pt-3 px-4 pb-3 fw-light">{user.email}</td>
                                <td className="pt-3 px-4 pb-2">
                                    <div className="d-flex flex-wrap">
                                        { user.roles.map((r,key) => {
                                            if(r.organisationId !== selected_organisation_id){return null}
                                            else {
                                                return <div key={key}
                                                            className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill">{r.role}</div>
                                            }
                                        })}
                                    </div>
                                </td>
                                <td className="pt-3 px-4 pb-0">
                                    <div className="d-flex  justify-content-end">
                                        <button className={(editYes)? "btn text-primary btn-sm": "btn btn-secondary disabled"} onClick={() => handleEditUser(user)}>Edit</button>
                                        <button className={(deleteYes)? "btn text-danger btn-sm" : "d-none"} onClick={ () => deleteUserAsk(user)}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                        })
                    }
                    </tbody>
                </table>
                { user_list &&
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={count}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rows) => setPageSize(rows)}
                    />
                }
            </div>
            <UserEdit user={selectedUser} setSelectedUser={setSelectedUser} filter={searchFilter}/>
            <UserDeleteAsk />
            <UserBulkForm />
        </div>
    )
}