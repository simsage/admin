import React, {useEffect, useState} from "react";
import {UserEdit} from "./UserEdit";
import {useDispatch, useSelector} from "react-redux";
import {getUserList, showAddUserForm} from "./usersSlice";
import {Pagination} from "../../common/pagination";

export function UsersHome(){


    const [page, setPage] = useState(useSelector((state) => state.usersReducer.page))
    const [page_size, setPageSize] = useState(useSelector((state) => state.usersReducer.page_size))
    const [selectedUser, setSelectedUser] = useState()
    const [searchFilter,setSearchFilter] = useState()
    const [orderFilter,setOrderFilter] = useState()
    const [userFilter,setUserFilter] = useState()

    const theme = null;
    const dispatch = useDispatch();

    const user_list = useSelector((state) => state.usersReducer.user_list)
    // const page_size = useSelector((state) => state.usersReducer.page_size)
    // const page = useSelector((state) => state.usersReducer.page)
    const status = useSelector((state) => state.usersReducer.status)
    const session = useSelector((state)=>state.authReducer.session)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)

    useEffect(()=>{
        if(status === undefined && user_list === undefined){
            console.log("session useEffect",session)
            console.log("selected_organisation",selected_organisation_id)
            dispatch(getUserList({session_id:session.id, organization_id:selected_organisation_id,filter:null}))
        }
    },[])
    console.log("users  ",user_list)

    function handleSearchTextKeydown(e) {
        if (e.key === "Enter" && this.props.selected_organisation_id) {
            this.props.getUsers(this.props.selected_organisation_id);
        }
    }

    function handleAddNewUser(){
        dispatch(showAddUserForm(true))
    }

    function handleEditUser(user) {
        setSelectedUser(user)
        dispatch(showAddUserForm(true))
    }


    function getUsers() {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);

        for (const i in user_list) {
            if (i >= first && i < last) {
                paginated_list.push(user_list[i]);
            }
        }
        return paginated_list;
    }


    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} value={searchFilter} autoFocus={true} className={"form-control " + theme}
                            onKeyPress={(e) => handleSearchTextKeydown(e)}
                            onChange={(e) => setSearchFilter(e.target.value)}/>
                    </div>
                    <div className="form-group me-2">
                        <select  placeholder={"Filter"} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => setOrderFilter(e.target.value)}>
                            <option value="alphabetical">Alphabetical</option>
                            <option value="">Join</option>
                        </select>

                    </div>
                    <div className="form-group me-2">
                        <select type="text" placeholder={"Filter"} value={userFilter} autoFocus={true} className={"form-select filter-text-width " + theme}
                                onChange={(e) => setUserFilter(e.target.value)}>
                            <option value="all-users">All Users</option>
                            <option value="">Admin</option>
                            <option value="">System Administrator</option>
                            <option value="">DMS</option>
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


            <div className="section">
                {!user_list &&
                <div>Error</div>
                }

                <table className="table">
                    <thead>
                        <tr>
                            <td className="small">Name</td>
                            <td className="small">Email</td>
                            <td className="small">Roles</td>
                        </tr>
                    </thead>
                    <tbody>

                    {
                        getUsers().map((user) => {
                            //Todo:: implement canEdit canDelete
                            const canEdit = true;
                            const canDelete = true;

                            return <tr key={user.id} >

                                <td className="label">{user.firstName} {user.surname}</td>
                                <td className="label">{user.email}</td>
                                <td className="label">
                                    { user.roles.map((role,key) => {
                                        return <span key={key}>{role.role}<br/></span>
                                    })}
                                </td>
                                <td><button className={"btn btn-primary"} onClick={() => handleEditUser(user)}>Edit icon</button></td>
                                <td><button className={"btn btn-outline-danger"}>Delete icon</button></td>
                            </tr>
                        })
                    }
                    </tbody>

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


                    {/*<tbody>*/}
                    {/*{*/}
                    {/*    this.getUsers(isAdmin).map((user) => {*/}
                    {/*        const canEdit = Home.canEdit(user, isAdmin, isManager);*/}
                    {/*        const canDelete = Home.canDelete(user, this.props.user, isAdmin, isManager);*/}
                    {/*        return (*/}
                    {/*            <tr key={user.id}>*/}
                    {/*                <td>*/}
                    {/*                    <div className="label">{user.email}</div>*/}
                    {/*                </td>*/}
                    {/*                <td>*/}
                    {/*                    <div className="label">{user.firstName}</div>*/}
                    {/*                </td>*/}
                    {/*                <td>*/}
                    {/*                    <div className="label">{user.surname}</div>*/}
                    {/*                </td>*/}
                    {/*                <td>*/}
                    {/*                    <div className="role-label">{UserManager.formatRoles(this.props.selected_organisation_id, user.roles)}</div>*/}
                    {/*                </td>*/}
                    {/*                <td>*/}
                    {/*                    { !canEdit &&*/}
                    {/*                    <div className="disabled-link-button" title="cannot edit this user">*/}
                    {/*                        <img src="../images/edit.svg" className="dl-image-size-disabled"*/}
                    {/*                             title="cannot edit this user" alt="cannot edit this user"/>*/}
                    {/*                    </div>*/}
                    {/*                    }*/}
                    {/*                    { canEdit &&*/}
                    {/*                    <div className="link-button" title="Edit this user"*/}
                    {/*                         onClick={() => this.editUser(user)}>*/}
                    {/*                        <img src="../images/edit.svg" className="dl-image-size"*/}
                    {/*                             title="edit user" alt="edit"/>*/}
                    {/*                    </div>*/}
                    {/*                    }*/}
                    {/*                    {*/}
                    {/*                        !canDelete &&*/}
                    {/*                        <div className="disabled-link-button" title="cannot remove this user">*/}
                    {/*                            <img src="../images/delete.svg" className="dl-image-size-disabled"*/}
                    {/*                                 title="cannot remove this user" alt="cannot remove this user"/>*/}
                    {/*                        </div>*/}
                    {/*                    }*/}
                    {/*                    {*/}
                    {/*                        canDelete &&*/}
                    {/*                        <div className="link-button" title="Remove this user"*/}
                    {/*                             onClick={() => this.deleteUserAsk(user, isAdmin)}>*/}
                    {/*                            <img src="../images/delete.svg" className="dl-image-size"*/}
                    {/*                                 title={isAdmin ? "remove user" : "remove user roles"} alt="remove"/>*/}
                    {/*                        </div>*/}
                    {/*                    }*/}
                    {/*                </td>*/}
                    {/*            </tr>*/}
                    {/*        )*/}
                    {/*    })*/}
                    {/*}*/}
                    {/*<tr>*/}
                    {/*    <td />*/}
                    {/*    <td />*/}
                    {/*    <td />*/}
                    {/*    <td />*/}
                    {/*    <td>*/}
                    {/*        {this.props.selected_organisation_id.length > 0 && (isAdmin || isManager) &&*/}
                    {/*        <div className="image-button" onClick={() => this.addNewUser()}>*/}
                    {/*            <img className="add-image" src="../images/add.svg" title="add new user" alt="add new user"/>*/}
                    {/*        </div>*/}
                    {/*        }*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                    {/*<tr>*/}
                    {/*    <td colSpan={5}>*/}
                    {/*        <Pagination*/}
                    {/*            rowsPerPageOptions={[5, 10, 25]}*/}
                    {/*            component="div"*/}
                    {/*            count={this.numUsers(this.props.selected_organisation_id, isAdmin)}*/}
                    {/*            rowsPerPage={this.props.user_page_size}*/}
                    {/*            page={this.props.user_page}*/}
                    {/*            onChangePage={(page) => this.changePage(page)}*/}
                    {/*            onChangeRowsPerPage={(rows) => this.changePageSize(rows)}*/}
                    {/*        />*/}
                    {/*    </td>*/}
                    {/*</tr>*/}
                    {/*</tbody>*/}
                </table>

            </div>

            <UserEdit user={selectedUser}/>
        </div>
    )
}