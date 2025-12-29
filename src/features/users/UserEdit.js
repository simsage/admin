import SubNav from "../../includes/sub-nav";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {closeUserForm, updateUser} from "./usersSlice";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";

export function UserEdit() {

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const show_user_form = useSelector((state) => state.usersReducer.show_user_form);
    const user_id = useSelector((state) => state.usersReducer.edit_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);
    const theme = useSelector((state) => state.homeReducer.theme);
    const REFRESH_IMAGE = (theme === "light" ? "images/refresh.svg" : "images/refresh-dark.svg")

    let available_roles = useSelector((state) => state.usersReducer.roles);

    const [selected_tab, setSelectedTab] = useState('details');
    const [roles, setRoles] = useState([]);

    const [selected_user, setSelectedUser] = useState(null)

    const [first_name, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [surname, setSurname] = useState('')
    const [sid, setSid] = useState({})

    const [name_error, setNameError] = useState('');
    const [surname_error, setSurnameError] = useState('');
    const [email_error, setEmailError] = useState('');

    //filters
    const [roleFilter, setRoleFilter] = useState('');
    const [availableRoleFilter, setAvailableRoleFilter] = useState('');
    const [role_error, setRoleError] = useState(true);

    const isUserAdmin = useSelector((state) => state.authReducer.is_admin)

    available_roles = available_roles.filter((role) => {
        return isUserAdmin ? role : role !== 'admin'
    })

    const refreshSecurityToken = () => {
        const sid = "sim-" + Api.createGuid().replace(/-/g, "")
        setSid(sid)
    }

    /**
     * Form validation for Roles and KBs
     */
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
        if (user_id) {
            const temp_user = (user_list.filter((user) => user.id === user_id));
            setSelectedUser(temp_user.length === 1 ? temp_user[0] : {})
        } else {
            setSelectedUser({})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user_id])

    useEffect(() => {
        if (user_id && selected_user) {
            setRoles(!selected_user.roles ? [] : selected_user.roles.filter(roleObj => {
                return roleObj.organisationId === organisation_id
            }))
        } else {
            setRoles([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected_user, user_id])

    const sub_nav = [
        {label: "Details", slug: "details"},
        {label: "Roles", slug: "roles"}
    ]

    /**
     * Roles functions
     * @returns {*[]}
     */
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
        }) : tempRoleList;
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

    function changeNav(slug) {
        setSelectedTab(slug);
    }

    function handleClose() {
        setSelectedTab('details')
        dispatch(closeUserForm())
    }

    const validateName = (name) => {
        // Enhanced regex for international names including Latin, Chinese, Arabic, etc.
        const validNamePattern = /^[\p{L}\p{M}'’\-\\.\s]+$/u
        return validNamePattern.test(name)
    }

    const validateEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailPattern.test(email)
    }

    const on_keydown = (e) => {
        if (e && e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    // validate the Details tab items and set or clear errors accordingly
    const validate_form = () => {
        let form_ok = true
        if (first_name.trim().length === 0) {
            setNameError("Name is required")
            form_ok = false
        } else if (!validateName(first_name)) {
            setNameError("Name is invalid")
            form_ok = false
        } else {
            setNameError('')
        }
        if (surname.trim().length === 0) {
            setSurnameError("Surname is required")
            form_ok = false
        } else {
            setSurnameError('')
        }
        if (email.trim().length === 0) {
            setEmailError("Email is required")
            form_ok = false
        } else if (!validateEmail(email.trim())) {
            setEmailError("Email is invalid")
            form_ok = false
        } else {
            setEmailError('')
        }
        return form_ok
    }

    const save = () => {
        if (!role_error) {
            if (!validate_form()) {
                setSelectedTab('details')
            } else {
                const session_id = session.id
                const data = {
                    firstName: first_name,
                    surname: surname,
                    sid: sid,
                    password: Api.createGuid(),
                    email: email,
                    id: user_id,
                    roles: roles,
                }
                dispatch(updateUser({session_id, organisation_id, data}))
            }
        } else {
            setSelectedTab('roles')
        }
    }


    /**
     * Set default value depends on organisation and show_organisation_form
     */
    useEffect(() => {
        if (selected_user) {
            setEmail(selected_user?.email ?? '')
            setFirstName(selected_user?.firstName ?? '')
            setSurname(selected_user?.surname ?? '')
            setSid(selected_user?.sid ?? '')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_user_form, selected_user]);

    if (show_user_form === false)
        return <div/>

    return (
        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4">
                        <h4 className="mb-0">{user_id ? "Edit User" : "New User"}</h4>
                    </div>

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
                                            <input type="text"
                                                   autoFocus={true}
                                                   className={"form-control filter-search-input"}
                                                   value={first_name}
                                                   onKeyDown={(e) => on_keydown(e)}
                                                   onChange={(e) => setFirstName(e.target.value)}
                                            />
                                            {name_error &&
                                                <span className="text-danger fst-italic small">
                                                    {name_error}
                                                </span>
                                            }
                                        </div>

                                        <div className="control-row col-6">
                                            <label className="label-2 small required">Surname</label>
                                            <input type="text"
                                                   className={"form-control filter-search-input"}
                                                   value={surname}
                                                   onKeyDown={(e) => on_keydown(e)}
                                                   onChange={(e) => setSurname(e.target.value)}
                                            />
                                            {surname_error &&
                                                <span className="text-danger fst-italic small">
                                                    {surname_error}
                                                </span>
                                            }
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="control-row col-6">
                                            <label className="label-2 small required">Email</label>
                                            <input type="text"
                                                   className={"form-control filter-search-input"}
                                                   autoComplete="false"
                                                   value={email}
                                                   onKeyDown={(e) => on_keydown(e)}
                                                   onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {email_error &&
                                                <span className="text-danger fst-italic small">
                                                    {email_error}
                                                </span>
                                            }
                                        </div>
                                        <div className="control-row col-6">
                                            <label className="label-2 small">User API Token</label>
                                            <div className="d-flex input-group">
                                                <input type="text"
                                                       className={"form-control filter-search-input"}
                                                       autoComplete="false"
                                                       readOnly="true"
                                                       value={sid}
                                                       onKeyDown={(e) => on_keydown(e)}
                                                />
                                                <span className="input-group-text copied-style"
                                                      title="generate new user API token"
                                                      onClick={() => refreshSecurityToken()}>
                                                    <img src={REFRESH_IMAGE} className="refresh-image"
                                                         alt="refresh" title="refresh"/>
                                                 </span>
                                            </div>
                                        </div>
                                    </div>
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
                                        <div className="role-area border rounded h-100">
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
                                        {role_error &&
                                            <span className="text-danger fst-italic small">
                                                To proceed, a user needs to be assigned at least one role.
                                            </span>
                                        }
                                    </div>
                                    <div className="role-block col-6">
                                        <h6 className="role-label text-center">Available</h6>
                                        <div className="role-area border rounded h-100">
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
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={() => handleClose()}>
                            Cancel
                        </button>
                        <button className="btn btn-primary btn-block px-4" onClick={() => save()}>
                            Save
                        </button>
                    </div>

                </div>
            </div>
        </div>

    )
}
