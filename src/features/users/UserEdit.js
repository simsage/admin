import {useDispatch, useSelector} from "react-redux";
import {useState, useEffect} from "react";
import {closeUserForm, updateUser} from "./usersSlice";
import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import {hasRole} from "../../common/helpers";

export function UserEdit(props){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const show_user_form = useSelector((state) => state.usersReducer.show_user_form);
    const user_id = useSelector( (state) => state.usersReducer.edit_id);
    const user_list = useSelector( (state)=> state.usersReducer.user_list );
    const available_roles = useSelector( (state) => state.usersReducer.roles);
    const available_KBs = useSelector((state) => state.kbReducer.kb_list);

    //user form details
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [kbs, setKBs] = useState([]);



    // Grab user details if editing
     let selectedUser = {}
    useEffect(()=> {
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
        if(selectedUser){
            setEmail(selectedUser.email)
            setFirstName(selectedUser.firstName)
            setLastName(selectedUser.surname)
            setRoles(selectedUser.roles)
            setGroups(selectedUser.groupList)
            setKBs(selectedUser.operatorKBList)
        }
    }, [show_user_form])

    //[details,roles, groups]
    const [selectedTab, setSelectedTab] = useState('details');




    function handleClose(e){
        dispatch(closeUserForm())
    }

    //Valid email check --##Need to add in validation here.
    function validEmail(address){
        const valid = true ? true: false;
        return valid;
    }

    const handleSave = () => {
        //Check for valid updates
        if( !validEmail(email) ) { alert('Invalid Email') }
        if( !firstName ) { alert('Invalid Name') }
        if( !lastName ) { alert('Invalid Last Name') }
        //begin updating user
        const session_id = session.id;
        const data = {
           id: user_id,
           email: email,
           firstName: firstName,
           surname: lastName,
           roles: roles,
           groupList: groups,
           operatorKBList: kbs
        }
        console.log('Saving...', data);
        dispatch(updateUser({session_id,organisation_id, data}));
        dispatch(closeUserForm());
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

    const getAvailableRoles = () => {
        const roleNames = roles.map( r => r.role);
        let tempRoleList = [];
        available_roles.forEach( ar => {
            if(!roleNames.includes(ar)){
                tempRoleList.push(ar);
            }
        })
        return tempRoleList;
    }

    function getKbName(kbID) {
        const temp_list = available_KBs.filter( (obj) => {return obj.kbId == kbID})
        if(temp_list.length < 1) return "No KBs"
        return temp_list[0].name
    }

    const getAvailableKnowledgeBases = () => {
        const userKbName = kbs.map(kb => getKbName(kb.kbId))
        const availableKbNames = available_KBs.map( kb => kb.name)
        console.log('TEST, ', userKbName)
        console.log('TEST2 ', availableKbNames)
        let tempKBsList = [];
        availableKbNames.forEach( kb => {
            if(!userKbName.includes(kb)){
                tempKBsList.push(kb);
            }
        })
        console.log('TEST3 ', tempKBsList)
        return tempKBsList;
    }


    if (show_user_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
             <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                 <div className="modal-content">
                     <div className="modal-header">{user_id ? "Edit User" : "Add New User"}</div>
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
                                     <span className="label-2">email</span>
                                     <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="email"
                                                       value={email}
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
                                                       value={firstName}
                                                       onChange={(e) => setFirstName(e.target.value)}
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
                                                       value={lastName}
                                                       onChange={(event) => setLastName(event.target.value)}
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
                                                  roles.map((role, i) => {
                                                     return (<Chip key={i} color="secondary"
                                                                   // onClick={() => removeRoleFromUser(role)}
                                                                   label={Api.getPrettyRole(role.role)} variant="outlined"/>)
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
                                                                   // onClick={() => addRoleToUser(role)}
                                                                   label={Api.getPrettyRole(role)} variant="outlined"/>)
                                                 })
                                             }
                                         </div>
                                     </div>
                                 </div>

                                 <br style={{clear: 'both'}} />

                                 {/*{UserEdit.hasOperatorRole(edit_roles) &&*/}
                                 {/*{hasOperatorRole(edit_roles) &&*/}
                                 <div>
                                     <div className="role-block">
                                         <div className="role-label">operator's knowledge bases</div>
                                         <div className="role-area">
                                             {
                                                 kbs.map((kb, i) => {
                                                     return (<Chip key={i} color="secondary"
                                                                   // onClick={() => removeKBFromUser(kb)}
                                                                   label={getKbName(kb.kbId)} variant="outlined"/>)
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
                                                                   // onClick={() => addKBToUser(kb)}
                                                                   label={kb} variant="outlined"/>)
                                                 })
                                             }
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         }


                         {/*{*/}
                         {/*    selectedTab === 'groups' &&*/}
                         {/*    <div className="tab-content">*/}

                         {/*        /!*<GroupSelector*!/*/}
                         {/*        /!*    group_list={this.props.all_groups}*!/*/}
                         {/*        /!*    include_users={false}*!/*/}
                         {/*        /!*    organisation_id={this.props.organisation_id}*!/*/}
                         {/*        /!*    user_list={this.props.all_users}*!/*/}
                         {/*        /!*    selected_group_list={edit_groups}*!/*/}
                         {/*        /!*    onChange={(groups) => setGroups( groups)}*!/*/}
                                 {/*/>*/}

                         {/*    </div>*/}
                         {/*}*/}

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
