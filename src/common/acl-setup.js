import React, {useEffect, useState} from "react";

export default function AclSetup(props) {
    const [has_error, setHasError] = useState(false)
    const [acl_list, setACLList] = useState(props.acl_list ? props.acl_list : [])
    const [selected_filter, setSelectedFilter] = useState('')
    const [available_filter, setAvailableFilter] = useState('')

    function handleOnChange(acl_list) {
        if (props.onChange) {
            props.onChange(acl_list);
        }
    }

    function removeAcl(acl) {
        const new_acls = [];
        for (const s_acl of acl_list) {
            if (s_acl.acl !== acl.acl) {
                new_acls.push(s_acl);
            }
        }
        setACLList(new_acls);
        handleOnChange(new_acls);
    }


    function addAcl(group) {
        const new_acls = JSON.parse(JSON.stringify(acl_list));
        const acl = {"acl": group.name, "access": "R", isUser: group.isUser ? group.isUser : false};
        let exists = false;
        for (const s_acl of acl_list) {
            if (s_acl.acl === group.name) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            new_acls.push(acl);
            setACLList(new_acls);
            handleOnChange(new_acls);
        }
    }

    function getAllGroups() {
        return props.group_list ? props.group_list : [];
    }

    function getAllUsers() {
        return props.user_list ? props.user_list : [];
    }

    function getAvailableGroupsOrUsers() {
        const list = [];
        const filter = available_filter.trim().toLowerCase();
        for (let group of getAllGroups()) {
            let found = false;
            for (const s_acl of acl_list) {
                if (group.name === s_acl.acl) {
                    found = true;
                }
            }
            if (!found) { // still available (i.e. not found)?
                if (filter.length === 0 || group.name.toLowerCase().indexOf(filter) >= 0) {
                    //todo: Cannot add property isUser - check this with rock
                    // group.isUser = false;
                    list.push(group);
                }
            }
        }
        for (const user of getAllUsers()) {
            let found = false;
            for (const s_acl of acl_list) {
                if (user.email === s_acl.acl) {
                    found = true;
                }
            }
            if (!found) { // still available (i.e. not found)?
                const user_name = user.email;
                if (filter.length === 0 || user_name.toLowerCase().indexOf(filter) >= 0) {
                    list.push({
                        organisationId: props.organisation_id,
                        name: user_name,
                        isUser: true,
                        userIdList: []
                    });
                }
            }
        }
        return list;
    }

    function getAcls() {
        const temp_acl_list = acl_list;
        const selected_acl_list = [];
        const filter = selected_filter.trim().toLowerCase();
        const seen_set = {};
        for (const acl of acl_list) {
            if (acl && acl.acl) {
                if (filter.length === 0 || acl.acl.toLowerCase().indexOf(filter) >= 0) {
                    if (!seen_set.hasOwnProperty(acl.acl)) {
                        seen_set[acl.acl] = true;
                        selected_acl_list.push(acl);
                    }
                }
            }
        }
        return selected_acl_list;
    }

    function invertAccess(event, acl, attribute) {
        event.preventDefault();
        event.stopPropagation();
        let acl_copy = JSON.parse(JSON.stringify(acl));
        const acl_list = acl_list;
        if (acl_copy && acl_copy.access && acl_copy.access.indexOf(attribute) >= 0) {
            acl_copy.access = acl_copy.access.replace(attribute, "");
        } else {
            acl_copy.access += attribute;
        }
        const updated_acl_list = [];
        for (const all_acl of acl_list) {
            if (all_acl && all_acl.acl) {
                if (all_acl.acl === acl.acl) {
                    updated_acl_list.push(acl_copy);
                } else {
                    updated_acl_list.push(all_acl);
                }
            }
        }

        setACLList(updated_acl_list);
        handleOnChange(updated_acl_list);
    }

    function getAccess(acl, attribute) {
        return attribute;
    }

    function getTitle(acl, attribute) {
        let str = "do not have ";
        if (acl && acl.access && acl.access.indexOf(attribute) >= 0) {
            str = "have ";
        }
        if (attribute === "R") str += "read access";
        else if (attribute === "W") str += "write access";
        else if (attribute === "D") str += "delete access";
        else if (attribute === "M") str += "the ability to change permissions";
        return str;
    }

    function getAclClassName(acl, attribute) {
        if (acl && ((acl.access && acl.access.indexOf(attribute) >= 0) || (acl.acl === 'R'))) {
            return "acl-access";
        } else {
            return "acl-no-access";
        }
    }

    if (has_error) {
        return <h1>acl-setup.js: Something went wrong.</h1>;
    }

    console.log("Siva acl_list", acl_list)
    return (
        <div className="row pb-5">

            <div className="role-block col-6">
                <h6 className="role-label text-center">ACLs </h6>
                {/* <span className="filter-text-box"><input type="text" className="filter-text" value={selected_filter}
                                                                 onChange={(event) => { setState({selected_filter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => setState({selected_filter: ''})}>&times;</span>
                        </span> */}
                <div className="role-area bg-light border rounded h-100">
                    <div className='mb-3 w-100 border-0 border-bottom d-flex align-items-center bg-white'>
                        <input type="text" className="filter-text w-100 px-2 py-2 border-0" placeholder="Filter..."
                               value={selected_filter}
                               onChange={(event) => {
                                   setSelectedFilter(event.target.value)
                               }}/>
                        <span className="clear px-3" title="clear filter"
                              onClick={() => setSelectedFilter('')}>&times;</span>
                    </div>
                    {
                        getAcls().map((acl, i) => {
                            return (<div key={i} className="role-chip d-flex justify-content-between align-items-center"
                                         title={(acl.isUser ? "user " : "group ") + acl.acl}>
                                    <span className="w-100" onClick={() => removeAcl(acl)}>
                                        <span className="user-group-image-box"><img className="user-group-image me-3"
                                                                                    src={acl.isUser ? "images/user.svg" : "images/group.svg"}
                                                                                    alt="user"/></span><span>{acl.acl}</span>
                                    </span>
                                <div className="d-flex flex-nowrap">
                                    <span className={getAclClassName(acl, "R")}
                                          title={getTitle(acl, "R")}>{getAccess(acl, "R")}</span>
                                    <span className={getAclClassName(acl, "W")} title={getTitle(acl, "W")}
                                          onClick={(event) => invertAccess(event, acl, "W")}>{getAccess(acl, "W")}</span>
                                    <span className={getAclClassName(acl, "D")} title={getTitle(acl, "D")}
                                          onClick={(event) => invertAccess(event, acl, "D")}>{getAccess(acl, "D")}</span>
                                    <span className={getAclClassName(acl, "M")} title={getTitle(acl, "M")}
                                          onClick={(event) => invertAccess(event, acl, "M")}>{getAccess(acl, "M")}</span>
                                </div>
                            </div>)
                        })
                    }
                </div>
            </div>

            <div className="role-block col-6">
                <h6 className="role-label text-center">Available</h6>
                {/* <span className="available-filter-label">filter </span>
                        <span className="filter-text-box"><input type="text" className="filter-text" value={state.available_filter}
                                                                 onChange={(event) => { setState({available_filter: event.target.value})}} />
                            <span className="clear" title="clear filter" onClick={() => setState({available_filter: ''})}>&times;</span>
                        </span> */}
                <div className="role-area bg-light border rounded h-100">
                    <div className='mb-3 w-100 border-0 border-bottom d-flex align-items-center bg-white'>
                        <input type="text" className="filter-text w-100 px-2 py-2 border-0" placeholder="Filter..."
                               value={available_filter}
                               onChange={(event) => {
                                   setAvailableFilter(event.target.value)
                               }}/>
                        <span className="clear px-3" title="clear filter"
                              onClick={() => setAvailableFilter('')}>&times;</span>
                    </div>
                    {
                        getAvailableGroupsOrUsers().map((u_group, i) => {
                            return (<div key={i} className="role-chip" onClick={() => addAcl(u_group)}
                                         title={(u_group.isUser ? "user " : "group ") + u_group.name}>
                                <span className="user-group-image-box me-3"><img className="user-group-image"
                                                                                 src={u_group.isUser ? "images/user.svg" : "images/group.svg"}
                                                                                 alt="user"/></span><span>{u_group.name}</span>
                            </div>)
                        })
                    }
                </div>
            </div>

        </div>
    );
}