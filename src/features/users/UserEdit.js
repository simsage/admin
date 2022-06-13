import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {showAddUserForm} from "./usersSlice";


export function UserEdit(props){

    const show_user_form = useSelector((state) => state.usersReducer.show_user_form)
    const [user,setUser] = useState(props.user)
    const edit_user_id = (user)?user.id:null;
    const dispatch = useDispatch();

    // setShowDialog(props.open);

    //[details,roles, groups]
    const [selectedTab, setSelectedTab] = useState('details')

    function handleClose(e){
        dispatch(showAddUserForm(false))
    }

    function handleSave(e){
        dispatch(showAddUserForm(false))
    }



    // console.log(showDialog);

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
