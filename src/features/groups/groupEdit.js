import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {closeGroupForm, updateGroup} from "./groupSlice";
import {getGroupEditInformation} from "../users/usersSlice";
import '../../css/group-edit.css';
import {Pagination} from "../../common/pagination";

export default function GroupEdit() {

    const ICON = "images/icon/icon_sso_GOOGLE.svg"

    const dispatch = useDispatch();

    const session = useSelector((state) => state.authReducer.session);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const page_size = 7;

    const showGroupForm = useSelector((state) => state.groupReducer.show_group_form);
    const groupName = useSelector((state) => state.groupReducer.edit_group)
    const ssoSource = useSelector((state) => state.groupReducer.sso_source)
    const readOnly = !!ssoSource
    const edit_group_user_id_list = useSelector((state) => state.groupReducer.edit_group_user_id_list)
    const {
        active_user_list, active_user_list_size, available_user_list, available_user_list_size,
    } = useSelector((state) => state.usersReducer)

    //group form details
    const [editName, setEditName] = useState('');
    const [activeUserFilter, setActiveUserFilter] = useState('');
    const [availableUserFilter, setAvailableUserFilter] = useState('');
    const [activeUserPage, setActiveUserPage] = useState(0);
    const [availableUserPage, setAvailableUserPage] = useState(0);
    // list of items with - or + prefixes (remove or add) for userIds
    const [groupIdChangeList, setGroupIdChangeList] = useState([]);

    function remove_active_user(id) {
        const plusID = "+" + id;
        if (groupIdChangeList.indexOf(plusID) >= 0) {
            setGroupIdChangeList(groupIdChangeList.filter(e => e !== plusID));
        } else if (groupIdChangeList.indexOf("-" + id) < 0) {
            groupIdChangeList.push("-" + id);
            setGroupIdChangeList(groupIdChangeList);
        }
    }

    function add_active_user(id) {
        const minusID = "-" + id;
        if (groupIdChangeList.indexOf(minusID) >= 0) {
            setGroupIdChangeList(groupIdChangeList.filter(e => e !== minusID));
        } else if (groupIdChangeList.indexOf("+" + id) < 0) {
            groupIdChangeList.push("+" + id);
            setGroupIdChangeList(groupIdChangeList);
        }
    }

    function current_to_list() {
        let current_user_id_list = [];
        for (const user_id of edit_group_user_id_list) {
            const minusID = "-" + user_id;
            if (groupIdChangeList.indexOf(minusID) < 0) {
                current_user_id_list.push(user_id);
            }
        }
        for (const group_id of groupIdChangeList) {
            if (group_id.length > 1 && group_id[0] === '+') {
                current_user_id_list.push(group_id.substring(1));
            }
        }
        current_user_id_list.sort();
        return current_user_id_list;
    }


    // Grab Group details if editing
    useEffect(() => {
        if (showGroupForm) {
            dispatch(getGroupEditInformation({
                session_id: session.id,
                organization_id: organisation_id,
                active_users_page: activeUserPage,
                active_users_filter: activeUserFilter,
                active_users_id_list: current_to_list(),
                available_users_page: availableUserPage,
                available_users_filter: availableUserFilter,
                page_size: page_size
            }))
        }
        if (!editName || editName.length === 0 || !showGroupForm)
            setEditName(groupName);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showGroupForm, "" + current_to_list(), activeUserPage, activeUserFilter, availableUserPage, availableUserFilter])

    const getAvailableUsers = () => {
        let num_pages = parseInt("" + (available_user_list_size / page_size))
        if (available_user_list_size % page_size !== 0) {
            num_pages += 1
        }
        return {
            "list": available_user_list,
            "size": available_user_list_size,
            "page_size": page_size,
            "num_pages": num_pages
        }
    }

    const getActiveUsers = () => {
        let num_pages = parseInt("" + (active_user_list_size / page_size));
        if (active_user_list_size % page_size !== 0) {
            num_pages += 1
        }
        return {"list": active_user_list, "size": active_user_list_size, "page_size": page_size, "num_pages": num_pages}
    }

    const handleSave = () => {
        const session_id = session.id
        const data = {
            name: editName,
            originalName: groupName,
            organisationId: organisation_id,
            userIdList: current_to_list()
        }
        dispatch(updateGroup({session_id, data}))
        clear()
    }


     const handleClose = () => {
        dispatch(closeGroupForm())
        clear()
     }


    const clear = () => {
        setGroupIdChangeList([])
        setAvailableUserPage(0)
        setActiveUserPage(0)
        setActiveUserFilter('')
        setAvailableUserFilter('')
    }

    if (showGroupForm === false) {
        return <div/>
    }

    // get the data structures
    const available_user_data = getAvailableUsers();
    const active_user_data = getActiveUsers();


    return (
        <div className="modal user-display" tabIndex="-1" role="dialog"
             style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content dialog-height">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">{groupName ? readOnly ? "View Group" : "Edit Group" : "New Group"}</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="tab-content container px-5 py-4 overflow-auto" style={{maxHeight: "600px"}}>
                            <div className="row pb-5">
                                <div className={readOnly ? "role-block col-12" : "role-block col-6"}>
                                    <h6 className={readOnly ? "role-label" : "role-label text-center"}>Group</h6>
                                    <span className="text">
                                            {ssoSource &&
                                                <img src={ICON} alt="icon" className={"sso_icon_group_view"}
                                                     title="SSO Group"/>}

                                        {readOnly && <span>{editName}</span>}
                                        {!readOnly && <input type="text"
                                                             className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                             autoFocus={true}
                                                             autoComplete="false"
                                                             placeholder="Add a Group Name..."
                                                             value={editName}
                                                             disabled={readOnly}
                                                             onChange={(event) => setEditName(event.target.value)}
                                        />}
                                        </span>
                                </div>
                                {!readOnly &&
                                    <div className="role-block col-6">
                                        <span className="role-label text-center">
                                        {available_user_list_size + " users in this organisation"}
                                        </span>
                                    </div>}

                            </div>
                            <div className="row pb-5">
                                <div
                                    className={readOnly ? "role-block col-12 role-height" : "role-block col-6 role-height"}>

                                    <h6 className={readOnly ? "role-label" : "role-label text-center"}>in this
                                        Group</h6>

                                    <div className="role-area bg-light border rounded h-100">
                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                               placeholder="Find..." value={activeUserFilter}
                                               onChange={(e) => setActiveUserFilter(e.target.value)}
                                        />
                                        {active_user_data && active_user_data.list && active_user_data.list.map(user => {
                                            return (
                                                <div className="role-chip"
                                                     key={user.id}
                                                     onClick={() => {
                                                         if (!readOnly) remove_active_user(user.id)
                                                     }}
                                                >
                                                    {`${user.firstName} ${user.surname} (${user.email})`}
                                                </div>)
                                        })}
                                    </div>
                                    <Pagination
                                        rowsPerPageOptions={[7]}
                                        component="div"
                                        count={active_user_data.size}
                                        theme={null}
                                        rowsPerPage={active_user_data.page_size}
                                        page={activeUserPage}
                                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                                        onChangePage={(page) => setActiveUserPage(page)}
                                    />
                                </div>
                                {!readOnly &&
                                    <div className="role-block col-6 role-height">
                                        <h6 className="role-label text-center">Available</h6>
                                        <div className="role-area bg-light border rounded h-100">
                                            <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                   placeholder="Find..." value={availableUserFilter}
                                                   onChange={(e) => setAvailableUserFilter(e.target.value)}
                                            />
                                            {available_user_data && available_user_data.list && available_user_data.list.map(user => {
                                                return (
                                                    <div className="role-chip"
                                                         key={user.id}
                                                         onClick={() => {
                                                             add_active_user(user.id)
                                                         }}
                                                    >
                                                        {`${user.firstName} ${user.surname} (${user.email})`}
                                                    </div>)
                                            })}
                                        </div>
                                        <Pagination
                                            rowsPerPageOptions={[7]}
                                            component="div"
                                            count={available_user_data.size}
                                            theme={null}
                                            rowsPerPage={available_user_data.page_size}
                                            page={availableUserPage}
                                            backIconButtonProps={{'aria-label': 'Previous Page',}}
                                            nextIconButtonProps={{'aria-label': 'Next Page',}}
                                            onChangePage={(page) => setAvailableUserPage(page)}
                                        />
                                    </div>}
                            </div>


                        </div>
                    </div>
                    <div className="modal-footer px-5 pb-3">
                        <button className="btn btn-white btn-block px-4"
                                onClick={(e) => handleClose(e)}>{readOnly ? "Close" : "Cancel"}</button>
                        {!readOnly && <button className="btn btn-primary btn-block px-4"
                                              onClick={(e) => handleSave(e)}>Save</button>}
                    </div>

                </div>
            </div>
        </div>

    )
}