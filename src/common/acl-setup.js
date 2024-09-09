import React, {useEffect, useState} from "react";

import '../css/acl-setup.css';
import {getACLEditInformation} from "../features/groups/groupSlice";
import {useDispatch, useSelector} from "react-redux";
import {Pagination} from "./pagination";

export default function ACLSetup(props) {

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const select_crud = props.select_acl_crud // use RWDM / CRUD selector?

    const {available_group_list, available_group_list_size,
        active_group_list, active_group_list_size} = useSelector((state) => state.groupReducer)

    // fixed
    const page_size = props.page_size ? props.page_size : 10;
    const selected_organisation_id = props.organisation_id;
    const session_id = session.id;

    const [active_page, setActivePage] = useState(0)
    const [active_filter, setActiveFilter] = useState('')
    const [initialized, setInitialized] = useState(false)

    const [available_page, setAvailablePage] = useState(0)
    const [available_filter, setAvailableFilter] = useState('')
    const [acl_map, setACLMap] = useState(new Map())

    // set initial active group
    useEffect(() => {
        let use_acl_map = acl_map
        if (!initialized) {
            let new_acl_map = new Map()
            for (const acl of props.active_acl_list) {
                if (acl && acl.acl && acl.access) {
                    new_acl_map.set(acl.acl, acl.access)
                }
            }
            setACLMap(new_acl_map)
            use_acl_map = new_acl_map
            setInitialized(true)
        }

        const acl_list = [];
        for (const acl of use_acl_map.keys()) {
            acl_list.push(acl)
        }

        dispatch(getACLEditInformation({
            session_id: session_id,
            organization_id: selected_organisation_id,
            active_groups_page: active_page,
            active_groups_filter: active_filter,
            active_groups_list: acl_list,
            available_groups_page: available_page,
            available_groups_filter: available_filter,
            page_size: page_size
        }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acl_map, initialized, selected_organisation_id, session_id, active_page, available_page, active_filter, available_filter]);


    function setFilter1(e, text) {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        } else if (text !== null) {
            setActiveFilter(text)
        }
    }

    function clearFilter1() {
        setActiveFilter('')
    }

    function setFilter2(e, text) {
        if (e && e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
        } else if (text !== null) {
            setAvailableFilter(text)
        }
    }

    function clearFilter2() {
        setAvailableFilter('')
    }

    // convert a map of ACLs to a list of ACLs
    function to_acl_list(map) {
        const acl_list = []
        if (map && map.keys) {
            for (const key of map.keys()) {
                acl_list.push({acl: key, access: map.get(key), isUser: false})
            }
        }
        return acl_list
    }

    function removeGroup(group) {
        let new_map = new Map(acl_map)
        new_map.delete(group.name)
        setACLMap(new_map)
        if (props.on_update)
            props.on_update(to_acl_list(new_map))
    }

    function addGroup(group) {
        let new_map = new Map(acl_map)
        new_map.set(group.name, "R")
        setACLMap(new_map)
        if (props.on_update)
            props.on_update(to_acl_list(new_map))
    }

    function invertAccess(event, acl, attribute) {
        event.preventDefault();
        event.stopPropagation();
        let new_map = new Map(acl_map)
        let acl_access = new_map.get(acl) ?? ""
        if (acl_access && acl_access.indexOf(attribute) >= 0) {
            acl_access = acl_access.replace(attribute, "");
        } else {
            if (!acl_access) acl_access = ""
            acl_access += attribute;
        }
        new_map.set(acl, acl_access)
        setACLMap(new_map)
        if (props.on_update)
            props.on_update(to_acl_list(new_map))
    }

    function getAccess(acl, attribute) {
        // let acl_access = acl_map.get(acl) ?? ""
        // return acl_access.indexOf(attribute) >= 0 ? attribute : "";
        return attribute
    }

    function getTitle(acl, attribute) {
        let str = "do not have ";
        let acl_access = acl_map.get(acl) ?? ""
        if (acl_access && acl_access.indexOf(attribute) >= 0) {
            str = "have ";
        }
        if (attribute === "R") str += "read access";
        else if (attribute === "W") str += "write access";
        else if (attribute === "D") str += "delete access";
        else if (attribute === "M") str += "the ability to change permissions";
        return str;
    }

    function getAclClassName(acl, attribute) {
        let acl_access = acl_map.get(acl) ?? ""
        if ((acl_access && acl_access.indexOf(attribute) >= 0) || (acl.acl === 'R')) {
            return "acl-access";
        } else {
            return "acl-no-access";
        }
    }

    return (
        <div className="row pb-5">
            <div className="role-block col-6">
                <h6 className="role-label text-center">{props.left_title ? props.left_title : "ACLs"} </h6>
                <div className="role-area bg-light border rounded h-100">
                    <div className='mb-3 w-100 border-0 border-bottom d-flex align-items-center bg-white'>
                        <input type="text" className="filter-text w-100 px-2 py-2 border-0" placeholder="Filter..."
                               value={active_filter}
                               onKeyDown={(event) => setFilter1(event, null)}
                               onChange={(event) => setFilter1(event, event.target.value)}/>
                        <span className="clear px-3" title="clear filter" onClick={() => clearFilter1()}>&times;</span>
                    </div>
                    {
                        active_group_list.map((acl, i) => {
                            return (<div key={i} className="role-chip d-flex justify-content-between align-items-center"
                                         title={"group " + acl.displayName ? acl.displayName : acl.name}>
                                    <span className="w-100" onClick={() => removeGroup(acl)}>
                                        <span className="user-group-image-box"><img className="user-group-image me-3"
                                                                                    src={"images/group.svg"}
                                                                                    alt="group"/></span><span>{acl.displayName ? acl.displayName : acl.name}</span>
                                    </span>
                                { select_crud &&
                                <div className="d-flex flex-nowrap">
                                    <span className={getAclClassName(acl.name, "R")}
                                          title={getTitle(acl.name, "R")}>{getAccess(acl.name, "R")}</span>
                                    <span className={getAclClassName(acl.name, "W")} title={getTitle(acl.name, "W")}
                                          onClick={(event) => invertAccess(event, acl.name, "W")}>{getAccess(acl.name, "W")}</span>
                                    <span className={getAclClassName(acl.name, "D")} title={getTitle(acl, "D")}
                                          onClick={(event) => invertAccess(event, acl.name, "D")}>{getAccess(acl.name, "D")}</span>
                                    <span className={getAclClassName(acl.name, "M")} title={getTitle(acl, "M")}
                                          onClick={(event) => invertAccess(event, acl.name, "M")}>{getAccess(acl.name, "M")}</span>
                                </div>
                                }
                            </div>)
                        })
                    }
                </div>
                <Pagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={active_group_list_size}
                    theme={null}
                    rowsPerPage={page_size}
                    page={active_page}
                    backIconButtonProps={{'aria-label': 'Previous Page',}}
                    nextIconButtonProps={{'aria-label': 'Next Page',}}
                    onChangePage={(page) => setActivePage(page)}
                />
            </div>

            <div className="role-block col-6">
                <h6 className="role-label text-center">{props.right_title ? props.right_title : "Available"}</h6>
                <div className="role-area bg-light border rounded h-100">
                    <div className='mb-3 w-100 border-0 border-bottom d-flex align-items-center bg-white'>
                        <input type="text" className="filter-text w-100 px-2 py-2 border-0" placeholder="Filter..."
                               value={available_filter}
                               onKeyDown={(event) => setFilter2(event, null)}
                               onChange={(event) => setFilter2(event, event.target.value)}/>
                        <span className="clear px-3" title="clear filter" onClick={() => clearFilter2()}>&times;</span>
                    </div>
                    {
                        available_group_list.map((u_group, i) => {
                            return (<div key={i} className="role-chip" onClick={() => addGroup(u_group)}
                                         title={"group " + u_group.name}>
                                <span className="user-group-image-box me-3"><img className="user-group-image"
                                                                                 src={"images/group.svg"}
                                                                                 alt="group"/></span>
                                <span>
                                    {u_group.displayName ? u_group.displayName : u_group.name}
                                </span>
                            </div>)
                        })
                    }
                </div>
                <Pagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={available_group_list_size}
                    theme={null}
                    rowsPerPage={page_size}
                    page={available_page}
                    backIconButtonProps={{'aria-label': 'Previous Page',}}
                    nextIconButtonProps={{'aria-label': 'Next Page',}}
                    onChangePage={(page) => setAvailablePage(page)}
                />
            </div>

        </div>
    )
}