import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeUserForm, updateUser} from "./usersSlice";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import SubNav from "../../includes/sub-nav";
import {useForm} from "react-hook-form";

export function UserEdit() {

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const sub_nav = [
        {label: "Details", slug: "details"},
        {label: "Roles", slug: "roles"},
        {label: "Groups", slug: "groups"},
    ]

    function changeNav(slug) {
        console.log(slug)
        setSelectedTab(slug);
    }

    // const {formState: {errors},} = useForm();


    const show_user_form = useSelector((state) => state.usersReducer.show_user_form);
    const user_id = useSelector((state) => state.usersReducer.edit_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);
    const available_roles = useSelector((state) => state.usersReducer.roles);
    const available_KBs = useSelector((state) => state.kbReducer.kb_list);
    const group_list_full = useSelector(((state) => state.groupReducer.group_list))
    //const group_list_full = group_list_parent ? group_list_parent.groupList : group_list_parent;




    //user form details
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [kbs, setKBs] = useState([]);
    const [showKbs, setShowKBs] = useState(false);
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');


    //filters
    const [roleFilter, setRoleFilter] = useState('');
    const [availableRoleFilter, setAvailableRoleFilter] = useState('');
    const [availableGroupFilter, setAvailableGroupFilter] = useState('');
    const [groupFilter, setGroupFilter] = useState('');
    const [availableKbFilter, setAvailableKbFilter] = useState('');
    const [kbFilter, setKbFilter] = useState('');

    // Grab user details if editing
    let selectedUser = {}
    useEffect(() => {
        if (user_id && user_list) {
            let temp_obj = user_list.filter((o) => {
                return o.id === user_id
            })
            if (temp_obj.length > 0) {
                selectedUser = (temp_obj[0])
                console.log('selectedUser!', selectedUser)
            }
        }
        //Populate form if necessary
        if (Object.keys(selectedUser).length) {
            setEmail(selectedUser.email)
            setFirstName(selectedUser.firstName)
            setLastName(selectedUser.surname)
            setRoles(!selectedUser.roles ? [] : selectedUser.roles.filter(roleObj => {
                return roleObj.organisationId === organisation_id
            }))
            setGroups(selectedUser.groupList)
            setKBs(!selectedUser.operatorKBList ? [] : selectedUser.operatorKBList.filter(KBObj => {
                return KBObj.organisationId === organisation_id
            }))
            setShowKBs(!selectedUser.roles ? [] : selectedUser.roles.filter(roleObj => {
                return roleObj.organisationId === organisation_id
            }).map(r => r.role).includes('operator'))
        }
    }, [show_user_form])

    //[details,roles, groups]
    const [selectedTab, setSelectedTab] = useState('details');

    function handleClose(e) {
        defaultValues()
        dispatch(closeUserForm())
    }

    function defaultValues() {
        setEmail('')
        setFirstName('')
        setLastName('')
        setRoles([])
        setGroups([])
        setKBs([])
        setShowKBs(false)
        setPassword('');
        setConfPassword('');
    }

    //Valid email check --##Need to add in validation here.
    function validEmail(email) {
        if (email && typeof email === "string") {
            const email_str = email.trim();
            const len = email_str.length;
            const at_pos = email_str.indexOf('@');
            const last_dot = email_str.lastIndexOf('.');
            if (at_pos === -1 || last_dot === -1)
                return false;
            if (last_dot < at_pos)
                return false;
            return (last_dot + 2 < len);
        }
        return false;
    }

    const handleSave = () => {
        let form_error = false;
        //Check for valid updates
        if (!validEmail(email)) {
            alert('Invalid Email')
            form_error = true;
        }
        if (!firstName) {
            alert('Invalid Name');
            form_error = true;
        }
        if (!lastName) {
            alert('Invalid Last Name');
            form_error = true;
        }
        if (showKbs && kbs.length < 1) {
            alert("A knowledge operator must have at least 1 Knowledge base assigned");
            form_error = true;
        }
        if (password !== confPassword) {
            alert("Please ensure the passwords match");
            form_error = true;
            return;
        }
        //begin updating user
        if (!form_error) {
            const session_id = session.id;
            const data = {
                email: email,
                firstName: firstName,
                groupList: groups,
                id: user_id,
                operatorKBList: kbs,
                password: password,
                roles: roles,
                surname: lastName
            }
            console.log('Saving...', data);
            dispatch(updateUser({session_id, organisation_id, data}));
            dispatch(closeUserForm());
        }
    }


    function fillNames() {
        function capitalizeFirstLetter(string) {
            if (string.length > 0) {
                return string.slice(0, 1).toUpperCase() + string.slice(1);
            }
            return string;
        }        // if there is an email address and there is no first-surname - try and use the email address to complete
        if (email.length > 0 && email.indexOf('@') > 0) {
            const firstPart = email.split('@')[0];
            const firstNameSurname = firstPart.split('.');
            let newFirst = "";
            let newSur = "";
            if (firstName.length === 0) {
                newFirst = capitalizeFirstLetter(firstNameSurname[0]);
            }
            if (lastName.length === 0 && firstNameSurname.length > 1) {
                newSur = capitalizeFirstLetter(firstNameSurname[1]);
            }
            if (newFirst.length > 0 && newSur.length > 0) {
                setFirstName(newFirst);
                setLastName(newSur);
            } else if (newFirst.length > 0) {
                setFirstName(newFirst);
            } else if (newSur.length > 0) {
                setLastName(newSur);
            }
        }
    }


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

        if (roleToAdd === "operator") setShowKBs(true);
    };

    function removeRoleFromUser(roleToRemove) {
        setRoles(roles.filter(r => {
            return r.role !== roleToRemove.role
        }))
        if (roleToRemove.role === "operator") setShowKBs(false);
    };


    //Knowledge base functions
    function getKbName(kbID) {
        console.log('test2', kbID)
        console.log('tets3', available_KBs)
        const temp_list = available_KBs.filter((obj) => {
            return obj.kbId === kbID
        })
        console.log('test4', temp_list)
        if (temp_list.length < 1) return "No KBs"
        return temp_list[0].name
    }

    function getKbs() {
        return kbFilter.length > 0 ? kbs.filter(kb => {
                console.log('pre-test', kb)
                console.log('testing', getKbName(kb.kbId))
                return getKbName(kb.kbId).toLowerCase().includes(kbFilter.toLowerCase())
            })
            :
            kbs
    }


    const getAvailableKnowledgeBases = () => {
        const userKbName = kbs ? kbs.map(kb => getKbName(kb.kbId)) : [];
        const availableKbNames = available_KBs.map(kb => kb.name)
        let tempKBsList = [];
        availableKbNames.forEach(kb => {
            if (!userKbName.includes(kb)) {
                tempKBsList.push(kb);
            }
        })
        return availableKbFilter.length > 0 ? tempKBsList.filter(kb => {
                return kb.toLowerCase().includes(availableKbFilter.toLowerCase())
            })
            :
            tempKBsList
    }


    function addKbToUser(kb) {
        const kbObj = available_KBs.filter(k => {
            return k.name === kb;
        })
        setKBs([...(kbs || []), {
            userId: user_id,
            organisationId: organisation_id,
            kbId: kbObj[0].kbId
        }])

    };

    function removeKbFromUser(kb) {
        setKBs(kbs.filter(k => {
            return k.kbId !== kb
        }))
    };

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
    };

    function removeGroupFromUser(groupToRemove) {
        setGroups(groups.filter(grp => {
            return grp.name !== groupToRemove.name
        }))
    };


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
                    <div className="modal-body p-0">

                        <div className="nav nav-tabs overflow-auto">
                            <SubNav sub_nav={sub_nav} active_item={selectedTab} onClick={changeNav}/>
                        </div>

                        {
                            selectedTab === 'details' &&
                            <div className="tab-content px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>

                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <span className="label-2 small">First Name</span>
                                        <span className="text">
                                                <form>
                                                    <input type="text" className="form-control"
                                                           autoComplete="false"
                                                           placeholder=""
                                                           value={firstName}
                                                           onChange={(e) => setFirstName(e.target.value)}
                                                    />
                                                </form>
                                            </span>
                                    </div>

                                    <div className="control-row col-6">
                                        <span className="label-2 small">Last Name</span>
                                        <span className="text">
                                                <form>
                                                    <input type="text" className="form-control"
                                                           autoComplete="false"
                                                           placeholder=""
                                                           value={lastName}
                                                           onChange={(event) => setLastName(event.target.value)}
                                                    />
                                                </form>
                                            </span>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <span className="label-2 small">Email</span>
                                        <span className="text">
                                                <form>
                                                    <input type="text" className="form-control"
                                                           autoFocus={true}
                                                           autoComplete="false"
                                                           placeholder="example@email.com"
                                                           value={email}
                                                           onBlur={() => fillNames()}
                                                           onChange={(event) => setEmail(event.target.value)}
                                                    />
                                                    </form>
                                            </span>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="control-row col-6">
                                        <span className="label-2 small">Password</span>
                                        <span className="text">
                                                <form>
                                                    <input type="password" className="form-control"
                                                           autoFocus={true}
                                                           autoComplete="false"
                                                           placeholder="********"
                                                           value={password}
                                                           onChange={(event) => setPassword(event.target.value)}
                                                    />
                                                    </form>
                                            </span>
                                    </div>
                                    <div className="control-row col-6">
                                        <span className="label-2 small">Confirm Password</span>
                                        <span className="text">
                                                <form>
                                                    <input type="password" className="form-control"
                                                           autoFocus={true}
                                                           autoComplete="false"
                                                           placeholder="********"
                                                           value={confPassword}
                                                           onChange={(event) => setConfPassword(event.target.value)}
                                                    />
                                                    </form>
                                            </span>
                                    </div>
                                </div>
                            </div>


                        }

                        {
                            selectedTab === 'roles' &&
                            <div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
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
                                                                  label={Api.getPrettyRole(role.role)} variant="outlined"/>)
                                                })
                                            }
                                        </div>
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
                                                                  label={Api.getPrettyRole(role)} variant="outlined"/>)
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                {showKbs &&
                                    <div className="row pb-5">
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">Operator's Knowledge Bases</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={kbFilter}
                                                       onChange={(e) => setKbFilter(e.target.value)}/>
                                                {
                                                    kbs && getKbs().map((kb, i) => {
                                                        return (<Chip key={i} color="secondary"
                                                                      onClick={() => removeKbFromUser(kb.kbId)}
                                                                      label={getKbName(kb.kbId)} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <div className="role-block col-6">
                                            <h6 className="role-label text-center">Available</h6>
                                            <div className="role-area bg-light border rounded h-100">
                                                <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                       placeholder="Filter..." value={availableKbFilter}
                                                       onChange={(e) => setAvailableKbFilter(e.target.value)}/>
                                                {
                                                    getAvailableKnowledgeBases().map((kb, i) => {
                                                        return (<Chip key={i} color="primary"
                                                                      onClick={() => addKbToUser(kb)}
                                                                      label={kb} variant="outlined"/>)
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                        }


                        {
                            selectedTab === 'groups' &&
                            <div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
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
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
