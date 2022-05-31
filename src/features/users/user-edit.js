import {useSelector} from "react-redux";
import {useState} from "react";


export function UserEdit(props){

    console.log(props.open);

    const [showDialog, setShowDialog] = useState(props.open)
    const [user,setUser] = useState(props.user)
    const edit_user_id = (user)?user.id:null;

    // setShowDialog(props.open);

    //[details,roles, groups]
    const [selectedTab, setSelectedTab] = useState('details')

    function cancelForm(e){
        // setUser(null);
        setShowDialog(false);
    }

    // console.log(showDialog);

    if (showDialog === false)
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
                     </div>


        <div className="modal-footer">
            <button className="btn btn-primary btn-block" onClick={() => cancelForm(this)}>Cancel</button>
            <button className="btn btn-primary btn-block" onClick={() => cancelForm(this)}>Save</button>
        </div>

        </div>
    </div>
</div>

    )
}
