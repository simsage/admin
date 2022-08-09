import {Chip} from "../../components/Chip";
import Api from "../../common/api";
import {useState} from 'react'


export default function GroupEdit(){
    //dummy data
    let [showGroupForm, setShowGroupForm] = useState(true);
    const edit_group_id = false;
    const [selectedTab, setSelectedTab] = useState('');
    const [editName, setEditName] = useState('');
    const [activeUsers, setActiveUsers] = useState(['Test1', 'Test2', 'Test3']);
    const [avaliableUsers, setAvaliableUsers] = useState(['Test4', 'Test5', 'Test6']);
    const mockUserContainerStyles = {display: "inline-block", background: "whitesmoke", border: "2px solid black" ,minHeight:"400px", minWidth:"300px", padding:"1rem"}
    //dummydata End

    function handleSave(e){
        console.log('hello')
        setShowGroupForm(false);
    }
    function handleClose(e){
        setShowGroupForm(false);
    }
    //dummy data end
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
                                        return <li
                                        onClick={(e) => {
                                            setAvaliableUsers([...avaliableUsers, e.target.innerText])
                                        }}
                                        >{user}</li>
                                    })}
                                </div>
                                <div style={mockUserContainerStyles}>
                                    {avaliableUsers.map(user => {
                                        return <li
                                            onClick={(e) => {
                                                setActiveUsers([...activeUsers, e.target.innerText])
                                            }}
                                        >{user}</li>
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