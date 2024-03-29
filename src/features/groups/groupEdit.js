import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {closeGroupForm, updateGroup} from "./groupSlice";
import {getUserListPaginated} from "../users/usersSlice";

export default function GroupEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const showGroupForm = useSelector((state) => state.groupReducer.show_group_form);
    const groupName = useSelector( (state) => state.groupReducer.edit_group)
    const group_list = useSelector((state) => state.groupReducer.group_list)
    //const group_list = group_list_parent ? group_list_parent.groupList : group_list_parent;
    const full_user_list = useSelector((state) => state.usersReducer.user_list)
    // const user_count = useSelector((state) => state.usersReducer.count)

    //group form details
    const [editName, setEditName] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [userFilter, setUserFilter] =useState('');

    //Get all users
    useEffect(()=> {
        dispatch(getUserListPaginated({session_id:session.id, organization_id:organisation_id,filter: null }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // Grab Group details if editing
    useEffect(()=> {
        let selectedGroup= {}
        if (groupName && group_list) {
            let temp_obj = group_list.filter((o) => {
                return o.name === groupName
            })
            if (temp_obj.length > 0) {
                selectedGroup = (temp_obj[0])
            }
        }
        // Populate form if necessary
        if(selectedGroup) {
            let users = selectedGroup.userIdList ? selectedGroup.userIdList : []
            setEditName(selectedGroup.name)

            setActiveUsers(full_user_list.filter((u) => {
                return users.includes(u.id);
             }))

            setAvailableUsers(full_user_list.filter((u) => {
                return !users.includes(u.id);
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showGroupForm])


    const getAvailableUsers = () => {
        if(userFilter.length < 1){
            return availableUsers
        } else {
            return availableUsers.filter(obj => {
                return (obj.firstName.toLowerCase().includes(userFilter.toLowerCase())) || (obj.surname.toLowerCase().includes(userFilter.toLowerCase())) || (obj.email.toLowerCase().includes(userFilter.toLowerCase()))
            })
        }

    }

    const handleSave = () => {
        // if( !editName ) { alert('Invalid Name')}
        //begin saving group
        const session_id = session.id;
        const data = {
         name: editName,
         organisationId: organisation_id,
         userIdList: activeUsers.map( u => u.id )
        }
        dispatch(updateGroup({session_id, data}));
        // dispatch(closeGroupForm());
        // dispatch(getGroupList({session_id:session.id, organization_id: organisation_id}))
    }


    function handleClose(){
        dispatch(closeGroupForm());
    }

    if (showGroupForm === false)
        return (<div />);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{groupName ? "Edit Group" : "New Group"}</h4>
                        </div>
                    <div className="modal-body p-0">
                            <div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
                                  <div className="row pb-5">
                                    <div className="role-block col-6">
                                        <h6 className="role-label text-center">Group</h6>
                                        
                                        <div  className="role-area bg-light border rounded h-100">
                                        <span className="text">
                                                <form>
                                                    <input type="text" className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                        autoFocus={true}
                                                        autoComplete="false"
                                                        placeholder="Add a Group Name..."
                                                        value={editName}
                                                        onChange={(event) => setEditName(event.target.value)}
                                                    />


                                                    </form>
                                            </span>
                                            {activeUsers.map(user => {
                                                return (
                                                <div className="role-chip"
                                                    key={user.id}
                                                    onClick ={()=> {
                                                        setAvailableUsers([...availableUsers, user])
                                                        setActiveUsers(activeUsers.filter( u => u.id !== user.id))
                                                    }}
                                                        >
                                                    {`${user.firstName} ${user.surname} (${user.email})`}
                                                </div>)
                                            })}
                                        </div>
                                    </div>
                                    <div className="role-block col-6">
                                        <h6 className="role-label text-center">Available</h6>
                                        <div  className="role-area bg-light border rounded h-100">
                                            <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                   placeholder="Filter..." value={userFilter}
                                                   onChange={(e) => setUserFilter(e.target.value)}
                                                   />
                                            {availableUsers && getAvailableUsers().map(user => {
                                                return (
                                                    <div className="role-chip"
                                                        key={user.id}
                                                        onClick ={()=> {
                                                            setActiveUsers([...activeUsers, user])
                                                            setAvailableUsers(availableUsers.filter( u => u.id !== user.id))
                                                        }}
                                                    >
                                                        {`${user.firstName} ${user.surname} (${user.email})`}
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                </div>


                            </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block px-4" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
};