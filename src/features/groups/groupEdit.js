import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import {useState, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {closeGroupForm, updateGroup} from "./groupSlice";


export default function GroupEdit(){

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)

    const showGroupForm = useSelector((state) => state.groupReducer.show_group_form);
    const groupName = useSelector( (state) => state.groupReducer.edit_group)
    const group_list_parent = useSelector((state) => state.groupReducer.group_list)
    const group_list = group_list_parent ? group_list_parent.groupList : group_list_parent;
    const user_list = useSelector((state) => state.usersReducer.user_list)

    //group form details
    const [editName, setEditName] = useState('');
    const [activeUsers, setActiveUsers] = useState([]);
    const [availableUsers, setAvailableUsers] = useState(user_list);

    //dummy data
    const edit_group_id = false;
    const mockUserContainerStyles = {display: "inline-block", background: "whitesmoke", border: "2px solid black" ,minHeight:"400px", minWidth:"300px", padding:"1rem"}
    //dummydata End

    // Grab Group details if editing
    let selectedGroup= {}
    useEffect(()=> {
        if (groupName && group_list) {
            let temp_obj = group_list.filter((o) => {
                return o.name === groupName
            })
            if (temp_obj.length > 0) {
                selectedGroup = (temp_obj[0])
                console.log('selectedGroup!', selectedGroup)
            }
        }
        // Populate form if necessary
        if(selectedGroup) {
            let users = selectedGroup.userIdList ? selectedGroup.userIdList : []
            setEditName(selectedGroup.name)

            setActiveUsers(user_list.filter((u) => {
                return users.includes(u.id);
             }))

            setAvailableUsers(user_list.filter((u) => {
                return !users.includes(u.id);
            }))
        }
    }, [showGroupForm])


    const handleSave = () => {
        if( !editName ) { alert('Invalid Name')}
        //begin saving group
        const session_id = session.id;
        const data = {
         name: editName,
         organisationId: organisation_id,
         userIdList: activeUsers.map( u => u.id )
        }
        console.log('Saving...', data);
        dispatch(updateGroup({session_id, data}));
        dispatch(closeGroupForm());
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
                    <div className="modal-header">{edit_group_id ? "Edit Group" : "Add New Group"}</div>
                    <div className="modal-body">
                            <div className="tab-content">
                                <div className="control-row">
                                    <span className="label-2">Group Name</span>
                                    <span className="text">
                                            <form>
                                                <input type="text" className="form-control"
                                                       autoFocus={true}
                                                       autoComplete="false"
                                                       placeholder="Group Name"
                                                       value={editName}
                                                       onChange={(event) => setEditName(event.target.value)}
                                                />
                                                </form>
                                        </span>
                                </div>

                            </div>
                            <div style={{display:"flex", justifyContent:"space-around", margin: "1rem"}}>
                                <div style={mockUserContainerStyles}>
                                    {activeUsers.map(user => {
                                        return (
                                        <li
                                            key={user.id}
                                            onClick ={()=> {
                                                setAvailableUsers([...availableUsers, user])
                                                setActiveUsers(activeUsers.filter( u => u.id !== user.id))
                                            }}
                                                >
                                            {`${user.firstName} ${user.surname} (${user.email})`}
                                        </li>)
                                    })}
                                </div>
                                <div style={mockUserContainerStyles}>
                                    {availableUsers.map(user => {
                                        return (
                                            <li
                                                key={user.id}
                                                onClick ={()=> {
                                                    setActiveUsers([...activeUsers, user])
                                                    setAvailableUsers(availableUsers.filter( u => u.id !== user.id))
                                                }}
                                            >
                                                {`${user.firstName} ${user.surname} (${user.email})`}
                                            </li>)
                                    })}
                                </div>
                            </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-primary btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                        <button className="btn btn-primary btn-block" onClick={(e) => handleSave(e)}>Save</button>
                    </div>

                </div>
            </div>
        </div>

    )
};