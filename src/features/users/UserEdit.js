import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {showAddUserForm} from "./usersSlice";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import {hasRole} from "../../common/helpers";

export function UserEdit(props){

    console.log("user",props.user);

    const show_user_form = useSelector((state) => state.usersReducer.show_user_form);
    const [user,setUser] = useState(props.user);
    const roles = useSelector((state) => state.usersReducer.roles);
    // const edit_user_id = (user)?user.id:null;
    const dispatch = useDispatch();
    const kb_list = useSelector((state)=> state.kbReducer.kb_list)
    // setShowDialog(props.open);


    // only allow roles that apply to this organisation that this user has
    // const filtered_roles = user.roles.filter(x => x.organisationId === this.props.selected_organisation_id);
    // const filtered_roles = (props.user.roles && props.user.roles.length > 0)?props.user.roles:[];
    const role_list = [];
    // for (const role of filtered_roles) {
    //     role_list.push(role.role);
    // }
    const user_kb_list = [];
    // if (props.user.operatorKBList) {
    //     for (const operatorKB of props.user.operatorKBList) {
    //         for (const available_kb of kb_list) {
    //             if (available_kb.kbId === operatorKB.kbId) {
    //                 user_kb_list.push(available_kb);
    //             }
    //         }
    //     }
    // }

    //[details,roles, groups]
    const [selectedTab, setSelectedTab] = useState('details');
    const [edit_password_2, setPassword_2] = useState('');
    const [edit_user_id, setUserId] = useState((props.user)?props.user.id:'');
    const [edit_email, setEmail] = useState((props.user)?props.user.email:'');
    const [edit_first_name, setFirstname] = useState((props.user)?props.user.firstName:'');
    const [edit_surname, setSurname] = useState((props.user)?props.user.surname:'');
    const [edit_password, setPassword] = useState('');
    const [edit_roles, setRoles] = useState((role_list)?role_list:[]);
    const [edit_kb_list, setKbList] = useState((user_kb_list)?user_kb_list:[]);
    const [edit_groups, setGroups] = useState((props.user)?props.user.id:[]);



    function handleClose(e){
        dispatch(showAddUserForm(false))
    }

    function handleSave(e){
        dispatch(showAddUserForm(false))
    }

    /*
     console.log(showDialog);
    */

    function fillNames() {
        function capitalizeFirstLetter(string) {
            if (string.length > 0) {
                return string.slice(0, 1).toUpperCase() + string.slice(1);
            }
            return string;
        }        // if there is an email address and there is no first-surname - try and use the email address to complete
        if (edit_email.length > 0 && edit_email.indexOf('@') > 0) {
            const firstPart = edit_email.split('@')[0];
            const firstNameSurname = firstPart.split('.');
            let newFirst = "";
            let newSur = "";
            if (edit_first_name.length === 0) {
                newFirst = capitalizeFirstLetter(firstNameSurname[0]);
            }
            if (edit_surname.length === 0 && firstNameSurname.length > 1) {
                newSur = capitalizeFirstLetter(firstNameSurname[1]);
            }
            if (newFirst.length > 0 && newSur.length > 0) {
                setFirstname(newFirst);
                setSurname(newSur);
            } else if (newFirst.length > 0) {
                setFirstname(newFirst);
            } else if (newSur.length > 0) {
                setSurname(newSur);
            }
        }
    }

    function close(save) {
        let do_save = true;
        if (save) {
            if (edit_password_2 !== edit_password) {
                do_save = false;
                if (this.props.onError) {
                    this.props.onError("Error", "passwords do not match");
                }
            }
        }
        if (do_save) {
            if (this.props.onClose) {
                if (save) {
                    this.props.onClose(save, {
                        user_id: edit_user_id,
                        email: edit_email,
                        first_name: edit_first_name,
                        surname: edit_surname,
                        password: edit_password,
                        roles: edit_roles,
                        kb_list: edit_kb_list,
                        groups: edit_groups,
                    });
                } else {
                    this.props.onClose(save, {});
                }
            }
        }
    }

    function removeRoleFromUser(role) {
        const new_roles = [];
        for (const e_role of edit_roles) {
            if (role !== e_role) {
                new_roles.push(e_role);
            }
        }
        setRoles(new_roles)
    }
    function addRoleToUser(role) {
        const roles = JSON.parse(JSON.stringify(edit_roles));
        let found = false;
        for (const e_role of edit_roles) {
            if (role === e_role) {
                found = true;
            }
        }
        if (!found) {
            roles.push(role);
            this.setState({edit_roles: roles});
        }
    }
    function getAvailableRoles() {
        const list = [];
        const isAdmin = hasRole(props.user, ['admin']);
        for (const available_role of roles) {
            let found = false;
            for (const role of edit_roles) {
                if (available_role === role) {
                    found = true;
                }
            }
            if (!found) {
                if (available_role === 'admin' && isAdmin) {
                    list.push(available_role);
                } else if (available_role !== 'admin') {
                    list.push(available_role);
                }
            }
        }
        return list;
    }

    function hasOperatorRole(edit_roles) {
        if (edit_roles) {
            for (const role of edit_roles) {
                if (role === "operator") {
                    return true;
                }
            }
        }
        return false;
    }

    function removeKBFromUser(kb) {
        const new_kbs = [];
        for (const ekb of edit_kb_list) {
            if (kb.kbId !== ekb.kbId) {
                new_kbs.push(ekb);
            }
        }
        setKbList(new_kbs)
    }
    function addKBToUser(kb) {
        const kbs = JSON.parse(JSON.stringify(edit_kb_list));
        kbs.push(kb);
        setKbList(kbs);
    }
    function getAvailableKnowledgeBases() {
        const list = [];

        for (const available_kb of kb_list) {
            let found = false;
            for (const kb of edit_kb_list) {
                if (available_kb.kbId === kb.kbId) {
                    found = true;
                }
            }
            if (!found) {
                list.push(available_kb);
            }
        }
        return list;
    }

    if (show_user_form === false)
        return (<div />);
    return (

        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline"}}>
             <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                 <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                     <div className="modal-header">{edit_user_id ? "Edit User" : "Add New User"}</div>
                     <div className="modal-body">

                         <ul className="nav nav-tabs">
                             <li className="nav-item nav-cursor">
                                 <div className={"nav-link " + (selectedTab === 'details' ? 'active' : '')}
                                     onClick={() => setSelectedTab( 'details')}>user details</div>
                            </li>
                            <li className="nav-item nav-cursor">
                                <div className={"nav-link " + (selectedTab === 'roles' ? 'active' : '')}
                                     onClick={() => setSelectedTab('roles')}>roles</div>
                            </li>
                            <li className="nav-item nav-cursor">
                                <div className={"nav-link " + (selectedTab === 'groups' ? 'active' : '')}
                                     onClick={() => setSelectedTab('groups')}>groups</div>
                            </li>
                        </ul>


                         {
                             selectedTab === 'details' &&
                             <div className="tab-content">

                                 <div className="control-row">
                                     <span className="label-2">email --{edit_email}--</span>
                                     <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="email"
                                                       value={edit_email}
                                                       onBlur={() => fillNames()}
                                                       onChange={(event) => setEmail(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                 </div>

                                 <div className="control-row">
                                     <span className="label-2">first name</span>
                                     <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="first name"
                                                       value={edit_first_name}
                                                       onChange={(e) => setFirstname(e.target.value)}
                                                />
                                            </form>
                                        </span>
                                 </div>

                                 <div className="control-row">
                                     <span className="label-2">surname</span>
                                     <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoComplete="false"
                                                       placeholder="surname"
                                                       value={edit_surname}
                                                       onChange={(event) => setSurname(event.target.value)}
                                                />
                                            </form>
                                        </span>
                                 </div>

                                 <div className="control-row">
                                     <span className="label-2">password</span>
                                     <span className="text">
                                            <form>
                                                <input type="password" className="form-control"
                                                       autoComplete="false"
                                                       placeholder={edit_user_id ? "leave blank not to change" : "password"}
                                                       value={edit_password}
                                                       onChange={(event) => setPassword(event.target.value)}
                                                />
                                            </form>
                                        </span>
                                 </div>

                                 <div className="control-row">
                                     <span className="label-2">verify password</span>
                                     <span className="text">
                                            <form>
                                                <input type="password" className="form-control"
                                                       autoComplete="false"
                                                       placeholder={edit_user_id ? "leave blank not to change" : "verify password"}
                                                       value={edit_password_2}
                                                       onChange={(event) => setPassword_2(event.target.value)}
                                                />
                                            </form>
                                        </span>
                                 </div>

                             </div>
                         }

                         {
                             selectedTab === 'roles' &&
                             <div className="tab-content">
                                 <div>
                                     <div className="role-block">
                                         <div className="role-label">SimSage roles</div>
                                         <div className="role-area">
                                             {
                                                 edit_roles.map((role, i) => {

                                                     return (<Chip key={i} color="secondary"
                                                                   onClick={() => removeRoleFromUser(role)}
                                                                   label={Api.getPrettyRole(role)} variant="outlined"/>)
                                                 })
                                             }
                                         </div>
                                     </div>
                                     <div className="role-block">
                                         <div className="role-label">available SimSage roles</div>
                                         <div className="role-area">
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

                                 <br style={{clear: 'both'}} />

                                 {/*{UserEdit.hasOperatorRole(edit_roles) &&*/}
                                 {hasOperatorRole(edit_roles) &&
                                 <div>
                                     <div className="role-block">
                                         <div className="role-label">operator's knowledge bases</div>
                                         <div className="role-area">
                                             {
                                                 edit_kb_list.map((kb, i) => {
                                                     return (<Chip key={i} color="secondary"
                                                                   onClick={() => removeKBFromUser(kb)}
                                                                   label={kb.name} variant="outlined"/>)
                                                 })
                                             }
                                         </div>
                                     </div>
                                     <div className="role-block">
                                         <div className="role-label">operator available knowledge bases</div>
                                         <div className="role-area">
                                             {
                                                 getAvailableKnowledgeBases().map((kb, i) => {
                                                     return (<Chip key={i} color="primary"
                                                                   onClick={() => addKBToUser(kb)}
                                                                   label={kb.name} variant="outlined"/>)
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
                             <div className="tab-content">

                                 {/*<GroupSelector*/}
                                 {/*    group_list={this.props.all_groups}*/}
                                 {/*    include_users={false}*/}
                                 {/*    organisation_id={this.props.organisation_id}*/}
                                 {/*    user_list={this.props.all_users}*/}
                                 {/*    selected_group_list={edit_groups}*/}
                                 {/*    onChange={(groups) => setGroups( groups)}*/}
                                 {/*/>*/}

                             </div>
                         }

                     </div>


        <div className="modal-footer">
            <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
            <button className="btn btn-primary btn-block" onClick={(e) => handleSave(e)}>Save</button>
        </div>

        </div>
    </div>
</div>

    )
}
