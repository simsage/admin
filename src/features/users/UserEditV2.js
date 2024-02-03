import SubNav from "../../includes/sub-nav";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {closeUserForm, updateUser} from "./usersSlice";
import {useForm} from "react-hook-form";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import {getGroupList} from "../groups/groupSlice";

export function UserEditV2() {

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const error_message = useSelector((state) => state.usersReducer.error)
    const show_user_form = useSelector((state) => state.usersReducer.show_user_form);
    const user_id = useSelector((state) => state.usersReducer.edit_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);

    let available_roles = useSelector((state) => state.usersReducer.roles);
    const group_list_full = useSelector(((state) => state.groupReducer.group_list))

    const [selected_tab, setSelectedTab] = useState('details');
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUser, setSelectedUser] = useState({})
    const [sso] = useState(false);

    //filters
    const [roleFilter, setRoleFilter] = useState('');
    const [availableRoleFilter, setAvailableRoleFilter] = useState('');
    const [availableGroupFilter, setAvailableGroupFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [role_error, setRoleError] = useState(true);

    const isUserAdmin = useSelector((state) => state.authReducer.is_admin)


    available_roles = available_roles.filter((role) => {
        return isUserAdmin ? role : role !== 'admin'
    })


    //Form
    const {
        register,
        trigger,
        handleSubmit,
        formState: {errors},
        reset,
        watch
    } = useForm();


    // Form validation for Roles and KBs
    useEffect(() => {
        roleValidation()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roles])


    function roleValidation() {
        if (roles.length < 1) {
            setRoleError(true);
        } else {
            setRoleError(false)
        }
    }


    useEffect(() => {
        dispatch(getGroupList({session_id: session.id, organization_id: organisation_id}))
        if (user_id) {
            const temp_user = (user_list.filter((user) => user.id === user_id));
            setSelectedUser(temp_user.length === 1 ? temp_user[0] : {})
        } else {
            setSelectedUser({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id])

    useEffect(() => {
        if (user_id) {
            setRoles(!selectedUser.roles ? [] : selectedUser.roles.filter(roleObj => {
                return roleObj.organisationId === organisation_id
            }))
            setGroups(selectedUser.groupList)
        } else {
            setRoles([])
            setGroups([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedUser, user_id])

    const sub_nav = [
        {label: "Details", slug: "details"},
        {label: "Roles", slug: "roles"},
        {label: "Groups", slug: "groups"},
    ]


    //Roles functions

    const getAvailableRoles = () => {
        const roleNames = roles ? roles.map(r => r.role) : [];
        let tempRoleList = [];
        available_roles.forEach(ar => {
            if (!roleNames.includes(ar)) {
                tempRoleList.push(ar);
            }
        })

        return availableRoleFilter.length > 0 ? tempRoleList.filter(role => {
                return Api.getPrettyRole(role).toLowerCase().includes(availableRoleFilter.toLowerCase())
            })
            :
            tempRoleList;
    }

    function getUserRoles() {
        return roleFilter.length > 0 ? roles.filter(role => {
                return Api.getPrettyRole(role.role).toLowerCase().includes(roleFilter.toLowerCase())
            })
            :
            roles
    }

    function addRoleToUser(roleToAdd) {
        setRoles([...(roles || []), {
            organisation_id: organisation_id,
            role: roleToAdd
        }])
    }

    function removeRoleFromUser(roleToRemove) {
        setRoles(roles.filter(r => {
            return r.role !== roleToRemove.role
        }))
    }

    //Groups functions

    const getAvailableGroups = () => {
        const groupNames = groups ? groups.map(g => g.name) : []
        const availableGroups = group_list_full.filter(grp => {
            return !groupNames.includes(grp.name)
        })
        return availableGroupFilter.length > 0 ? availableGroups.filter(grp => {
                return grp.name.toLowerCase().includes(availableGroupFilter.toLowerCase())
            })
            :
            availableGroups
    }

    function getGroups() {
        return groupFilter.length > 0 ? groups.filter(grp => {
                return grp.name.toLowerCase().includes(groupFilter.toLowerCase())
            })
            :
            groups
    }

    function addGroupToUser(groupToAdd) {
        setGroups([...(groups || []), groupToAdd])
    }

    function removeGroupFromUser(groupToRemove) {
        setGroups(groups.filter(grp => {
            return grp.name !== groupToRemove.name
        }))
    }


    function changeNav(slug) {
        trigger(["firstName", "surname", 'email', 'password', 'password_repeat', 'jwtMatchNameValueCSV']).then(
            (is_valid) => {
                if (is_valid) {
                    setSelectedTab(slug);
                }
            });
    }

    function handleClose() {
        // defaultValues()
        dispatch(closeUserForm())
        setSelectedTab('details')
    }


    const onSubmit = data => {
        if (!role_error) {
            const session_id = session.id;
            data = {
                ...data,
                groupList: groups,
                id: user_id,
                roles: roles,
            }
            dispatch(updateUser({session_id, organisation_id, data}));
        } else {
            setSelectedTab('roles')
        }
    }


//set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {}

        defaultValues.email = selectedUser ? selectedUser.email : '';
        defaultValues.firstName = selectedUser ? selectedUser.firstName : '';
        defaultValues.surname = selectedUser ? selectedUser.surname : '';
        defaultValues.password = selectedUser ? selectedUser.password : '';
        defaultValues.password_repeat = selectedUser ? selectedUser.password : '';
        defaultValues.jwtMatchNameValueCSV = selectedUser ? selectedUser.jwtMatchNameValueCSV : '';

        // Role
        // Group
        // kb

        reset({...defaultValues});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_user_form, selectedUser]);

    let pwd = watch("password");

    if (show_user_form === false)
        return (<div/>);

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{user_id ? "Edit User" : "New User"}</h4>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="modal-body p-0">

                            <div className="nav nav-tabs overflow-auto">
                                <SubNav sub_nav={sub_nav} active_item={selected_tab} onClick={changeNav}/>
                            </div>
                            {
                                selected_tab === 'details' &&
                                <>
                                    <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>

                                        <div className="row mb-3">
                                            <div className="control-row col-6">
                                                <label className="label-2 small required">First name</label>
                                                <input
                                                    autoFocus={true}
                                                    className="form-control" {...register("firstName", {required: true})} />
                                                {errors.firstName &&
                                                    <span className="text-danger fst-italic small">First name is required </span>}
                                                {error_message && error_message.includes('firstName') &&
                                                    <span
                                                        className="text-danger fst-italic small">{error_message}</span>}

                                            </div>

                                            <div className="control-row col-6">
                                                <label className="label-2 small required">Last name</label>
                                                <input
                                                    className="form-control" {...register("surname", {required: true})} />
                                                {errors.surname && <span className="text-danger fst-italic small">Last name is required </span>}
                                                {error_message && error_message.includes('surname') &&
                                                    <span
                                                        className="text-danger fst-italic small">{error_message}</span>}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="control-row col-6">
                                                <label className="label-2 small required">Email</label>
                                                <input
                                                    autoComplete="false"
                                                    className="form-control"
                                                    {...register("email", {
                                                        required: true
                                                    })}
                                                    // onBlur={() => fillNames()}

                                                />
                                                {errors.email && <span className="text-danger fst-italic small"> Email is required</span>}
                                                {error_message && error_message.includes('email') &&
                                                    <span
                                                        className="text-danger fst-italic small">{error_message}</span>}
                                            </div>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="control-row col-12">
                                                <label className="label-2 small">JWT match criteria</label>
                                                <input
                                                    autoComplete="false"
                                                    className="form-control"
                                                    placeholder="optional csv list of name=value fields for JWT matching"
                                                    {...register("jwtMatchNameValueCSV", {required: false})}
                                                />
                                            </div>
                                        </div>

                                        {!user_id && !sso &&
                                            <div className="row mb-3">
                                                <div className="control-row col-6">
                                                    <label className="label-2 small required">Password</label>
                                                    <input type="password" className="form-control"
                                                           autoComplete="false"
                                                           name="password"
                                                           {...register('password', {
                                                               required: {
                                                                   value: "true",
                                                                   message: "Password is required "
                                                               }
                                                               ,
                                                               minLength: {
                                                                   value: 8,
                                                                   message: "Password must have at least 8 characters"
                                                               }
                                                           })}
                                                    />
                                                    {errors.password && <span
                                                        className="text-danger fst-italic small">{errors.password.message}</span>}
                                                    {error_message && error_message.includes('password') && <span
                                                        className="text-danger fst-italic small">{error_message}</span>}
                                                </div>
                                                <div className="control-row col-6">
                                                    <label className="label-2 small required">Confirm Password</label>
                                                    <input type="password" className="form-control"
                                                           autoComplete="false"
                                                           name="password_repeat"
                                                           {...register('password_repeat', {
                                                               required: {
                                                                   value: "true",
                                                                   message: "Confirm your password "
                                                               }
                                                               ,
                                                               validate: {
                                                                   always: (value) =>
                                                                       value === pwd || "The passwords do not match"
                                                               },
                                                           })}

                                                    />
                                                    {errors.password_repeat && <span
                                                        className="text-danger fst-italic small">{errors.password_repeat.message}</span>}

                                                </div>
                                            </div>
                                        }

                                    </div>
                                </>
                            }
                            {
                                selected_tab === 'roles' &&
                                <div className="tab-content container px-5 py-4 overflow-auto"
                                     style={{maxHeight: "600px"}}>
                                    <div className="row pb-5">
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">SimSage Roles</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={roleFilter}
                                                       onChange={(e) => setRoleFilter(e.target.value)}/>
                                                {
                                                    roles && getUserRoles().map((role, i) => {
                                                        return (<Chip key={i} color="secondary"
                                                                      onClick={() => removeRoleFromUser(role)}
                                                                      label={Api.getPrettyRole(role.role)}
                                                                      variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                            {role_error && <span
                                                className="text-danger fst-italic small">To proceed, a user needs to be assigned at least one role.</span>}
                                        </div>
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">Available</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={availableRoleFilter}
                                                       onChange={(e) => setAvailableRoleFilter(e.target.value)}/>
                                                {
                                                    getAvailableRoles().map((role, i) => {
                                                        return (<Chip key={i} color="primary"
                                                                      onClick={() => addRoleToUser(role)}
                                                                      label={Api.getPrettyRole(role)}
                                                                      variant="outlined"/>)
                                                    })
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            }


                            {
                                selected_tab === 'groups' &&
                                <div className="tab-content container px-5 py-4 overflow-auto"
                                     style={{maxHeight: "600px"}}>
                                    <div className="row pb-5">
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">SimSage Groups</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={groupFilter}
                                                       onChange={(e) => setGroupFilter(e.target.value)}/>
                                                {
                                                    groups && getGroups().map((grp, i) => {
                                                        return (

                                                            <Chip key={i} color="secondary"
                                                                  onClick={() => removeGroupFromUser(grp)}
                                                                  label={grp.name} variant="outlined"/>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">Available</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={availableGroupFilter}
                                                       onChange={(e) => setAvailableGroupFilter(e.target.value)}/>
                                                {
                                                    getAvailableGroups().map((grp, i) => {
                                                        return (<Chip key={i} color="primary"
                                                                      onClick={() => addGroupToUser(grp)}
                                                                      label={grp.name}
                                                                      variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                        </div>


                        <div className="modal-footer px-5 pb-3">
                            <button className="btn btn-white btn-block px-4" onClick={() => handleClose()}>Cancel
                            </button>
                            <input className="btn btn-primary btn-block px-4" type="submit" value={"Save"}/>
                        </div>
                    </form>
                </div>


            </div>
        </div>

    )
}
