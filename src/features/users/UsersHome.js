import React, {useEffect, useState} from "react";
import {UserEdit} from "./UserEdit";
import {useDispatch, useSelector} from "react-redux";
import {getUserList, showAddUserForm, showDeleteUserAsk, showEditUserForm} from "./usersSlice";
import {Pagination} from "../../common/pagination";
import {formatRoles, hasRole} from "../../common/helpers";
import Api from '../../common/api'
import {getGroupList} from "../groups/groupSlice";
import UserDeleteAsk from "./UserDeleteAsk";

export function UsersHome(){

    const [page, setPage] = useState(useSelector((state) => state.usersReducer.page))
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

    const isAdmin = hasRole(user_account, ['admin']);
    const isManager = hasRole(user_account, ['manager']);

    console.log("isAdmin:",(isAdmin)?" Yes":"No",session)
    console.log("isManager:",(isManager)?" Yes":"No")

    useEffect(()=>{
        if(user_list_status === undefined && user_list === undefined){
            console.log("session useEffect",session)
            console.log("selected_organisation",selected_organisation_id)
            dispatch(getUserList({session_id:session.id, organization_id:selected_organisation_id,filter:null}))
        }
    },[load_data === "load_now"])

    function handleSearchTextKeydown(e) {
        if (e.key === "Enter"  && selected_organisation_id) {
            // console.log(session, selected_organisation_id, searchFilter);
            dispatch(getUserList({session_id:session.id, organization_id:selected_organisation_id,filter:searchFilter === '' ? null : searchFilter}));
            setSearchFilter('');
        }
    }

    function handleSearchTextChange(e) {
        if (selected_organisation_id) {setSearchFilter(e.target.value);}
    }

    function handleAddNewUser(){
        dispatch(getGroupList({session_id: session.id, organization_id: selected_organisation_id}))
        dispatch(showAddUserForm(true))
    }

    function handleEditUser(u) {
        dispatch(getGroupList({session_id: session.id, organization_id: selected_organisation_id}))
        dispatch(showEditUserForm({show:true, user_id: u.id}));
    }

    function deleteUserAsk(u){
        console.log('deleting', u)
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

    function getUsers(isAdmin) {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        let index = 0;
        for (const i in user_list) {
            // paginate all users - but only those that have roles in this organisation
            const user = user_list[i];
            const roleStr = formatRoles(selected_organisation_id, user.roles);
            if (isAdmin || roleStr.length > 0) { // has a role or is admin?
                if (index >= first && index < last) {
                    paginated_list.push(user);
                }
                index += 1; // one more user in this set of roles
            }
        }
        return paginated_list;
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
                        <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control " + theme}
                            onKeyDown={(e) => handleSearchTextKeydown(e)}
                            onChange={(e) => handleSearchTextChange(e)}
                        />
                    </div>
                    <div className="form-group me-2">
                        <select  placeholder={"Filter"} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => setOrderFilter(e.target.value)}>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="">Recently Added</option>
                        </select>

                    </div>
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

                <div className="form-group col ms-auto">
                    <button className="btn btn-primary text-nowrap" onClick={() => handleAddNewUser()}>
                        + Add User
                        {/*<img className="add-image" src="/images/add.svg" title="add new user" alt="add new user"/>*/}
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
                        getUsers().map((user) => {
                            //user does not have chosen role then skip.
                            if(!filterRoles(user.roles, userFilter)){return null}
                            const editYes = canEdit(user, isAdmin, isManager);
                            // const editYes = true;
                            const deleteYes = canDelete(user, session, isAdmin, isManager);

                            return <tr key={user.id} >

                                <td className="pt-3 px-4 pb-3">{user.firstName} {user.surname} <span className="fw-light pt-2">{user.email === user_account.email ? '(you)' : ""}</span> </td>
                                <td className="pt-3 px-4 pb-3 fw-light">{user.email}</td>
                                <td className="pt-3 px-4 pb-0" style={{width:"250px"}}>
                                    <div className="d-flex flex-wrap">
                                        { user.roles.map((role,key) => {
                                            return <span key={key} className="small bg-light px-3 py-1 me-2 mb-2 rounded-pill">{role.role}</span>
                                        })}
                                    </div>
                                </td>
                                <td className="pt-2 px-4 pb-0">
                                    <button className={(editYes)? "btn text-primary btn-sm": "btn btn-secondary disabled"} onClick={() => handleEditUser(user)}>Edit</button>
                                    <button className={(deleteYes)? "btn text-danger btn-sm" : "btn text-danger btn-sm disabled"} onClick={ () => deleteUserAsk(user)}>Delete</button>
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
                        count={user_list.length}
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
        </div>
    )
}