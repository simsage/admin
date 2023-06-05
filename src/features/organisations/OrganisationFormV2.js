import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeOrganisationForm, deleteOrganisation, updateOrganisation} from "./organisationSlice";
import {useForm} from "react-hook-form";
import {OrganisationTab} from "./OrganisationFormTab";
import {Chip} from "../../components/Chip";
import {getGroupList} from "../groups/groupSlice";
import api from "../../common/api";

export default function OrganisationFormV2(props) {
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const selected_organisation_id = props.organisation_id;
    // const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)
    let organisation = props.organisation;


    const [selected_tab, setSelectedTab] = useState('general');
    const group_data_status = useSelector((state) => state.groupReducer.data_status);
    //group_list_full should be in ['Admin','Managers',..] format
    const group_list_full = useSelector((state) => state.groupReducer.group_list).map(g => {return g.name});
    console.log("group: _list_full", group_list_full);
    // const available_roles = useSelector((state) => state.usersReducer.roles);
    const roles_list_full = api.getPrettyRoles(useSelector((state) => state.usersReducer.roles));

    //filters
    const [selected_role_filter, setRoleFilter] = useState('');
    const [available_role_filter, setAvailableRoleFilter] = useState('');
    const [available_group_filter, setAvailableGroupFilter] = useState('');
    const [selected_group_filter, setSelectedGroupFilter] = useState('');

    const [selected_roles, setSelectedRoles] = useState(organisation ? api.getPrettyRoles(organisation.autoCreateSSORoleList) : []);
    const [selected_groups, setSelectedGroups] = useState(organisation ? organisation.autoCreateSSOACLList : []);


    const handleClose = () => {
        dispatch(closeOrganisationForm());
        setSelectedRoles([])
        setSelectedGroups([])
        setSelectedTab('general');
    }

    const handleDelete = () => {
        dispatch(deleteOrganisation({session_id: props.session.id, organisation_id: organisation.id}))
        handleClose();
    }

// set title
    const title = (organisation === null) ? "New Organisation" : "Edit Organisation";

//Form Hook
    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
        // watch,
    } = useForm();

//set default value depends on organisation and show_organisation_form
    useEffect(() => {
        let defaultValues = {};
        defaultValues.name = organisation ? organisation.name : '';
        defaultValues.enabled = organisation ? organisation.enabled : false;
        defaultValues.id = organisation ? organisation.id : undefined;
        defaultValues.autoCreateSSOUsers = organisation ? organisation.autoCreateSSOUsers : false;
        defaultValues.autoCreateSSODomainListStr = organisation ? organisation.autoCreateSSODomainList.toString() : "";
        defaultValues.autoCreateSSORoleList = organisation ? organisation.autoCreateSSORoleList : [];
        defaultValues.autoCreateSSOACLList = organisation ? organisation.autoCreateSSOACLList : [];

        reset({...defaultValues});
    }, [organisation, props.show_organisation_form, reset]);


    useEffect(() => {
        if (selected_organisation_id !== null) {
            console.log("selected_organisation_org", selected_organisation_id)
            dispatch(getGroupList({session_id: session.id, organization_id: selected_organisation_id}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group_data_status === 'load_now', organisation])

//on submit store or update
    const onSubmit = data => {
        data.autoCreateSSORoleList = selected_roles.map(role => { return role.role });
        data.autoCreateSSOACLList = selected_groups;
        //convert domain string to array
        data.autoCreateSSODomainList = data.autoCreateSSODomainListStr.split(',');

        //form data
        const {autoCreateSSODomainListStr, ...form_data} = data;
        console.log("org data", form_data)

        dispatch(updateOrganisation({session_id: props.session.id, data: form_data}))
        setSelectedRoles([])
        setSelectedGroups([])
        setSelectedTab('general');
    };

    function handleTabChange(slug) {
        setSelectedTab(slug);
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////
// SimSage role management


    const getAvailableRoles = () => {
        const roleNames = selected_roles ? selected_roles.map(r => r.role) : [];
        let temp_available_rolls = roles_list_full.filter(role => {
            if (!roleNames.includes(role.role)) {
                return role
            }
        })

        let l = available_role_filter.length > 0 ? temp_available_rolls.filter(role => {
                return role.label.toLowerCase().includes(available_role_filter.toLowerCase())
            })
            :
            temp_available_rolls;

        return l;

    }


    function getSelectedRoles() {
        console.log("roles: getSelectedRoles", selected_roles);

        let l = selected_role_filter.length > 0 ? selected_roles.filter(role => {
                return role.label.toLowerCase().includes(selected_role_filter.toLowerCase())
            })
            :
            selected_roles;

        return l;

    }


    function addRoleToUser(role) {
        setSelectedRoles([...(selected_roles || []), role])
    }


    function removeRoleFromUser(role) {
        const temp_list = selected_roles.filter(r => {
            return r.role !== role.role
        })
        setSelectedRoles(temp_list)
    }


/////////////////////////////////////////////////////////////////////////////////////////////////////
// group/ACL management
//
//     function addGroupToUser(group) {
//         setSelectedGroups([...(selected_groups || []), group])
//         // setAutoCreateSSOACLList([...(autoCreateSSOACLList || []) , groupToAdd])
//     }
//
//     function removeGroupFromUser(group) {
//
//         const temp_list = selected_groups.filter(g => {
//             return g !== group
//         })
//         setSelectedGroups(temp_list)
//
//     }

/////////////////////////////////////////////////////////////////////////////////////////////////////
// group/ACL management
//
//     function addGroupToUser(group) {
//         setSelectedGroups([...(selected_groups || []), group])
//         // setAutoCreateSSOACLList([...(autoCreateSSOACLList || []) , groupToAdd])
//     }
//
//     function removeGroupFromUser(group) {
//
//         const temp_list = selected_groups.filter(g => {
//             return g !== group
//         })
//         setSelectedGroups(temp_list)
//
//     }
//
//     const getAvailableGroups = () => {
//
//         let temp_list = []
//         available_groups.forEach((group) => {
//             if (!selected_groups.includes(group)) {
//                 temp_list.push(group)
//             }
//         })
//
//         return available_group_filter.length > 0 ? temp_list.filter(group => {
//                 return group.toLowerCase().includes(available_group_filter.toLowerCase())
//             })
//             :
//             temp_list;
//
//     }
//
//     function getSelectedGroups() {
//         let temp_list = [];
//         if (selected_group_filter.length > 0) {
//             temp_list = selected_groups.filter((group) => {
//                 return Api.getPrettyRole(group).toLowerCase().includes(selected_group_filter.toLowerCase())
//             })
//         } else {
//             temp_list = selected_groups
//         }
//         return temp_list;
//     }


    const getAvailableGroups = () => {
        // const groupNames = selected_groups ? selected_groups.map(g => g.name) : []
        const availableGroups = group_list_full.filter(grp => {
            return !selected_groups.includes(grp)

        })
        return available_group_filter.length > 0 ? availableGroups.filter(grp => {
                return grp.toLowerCase().includes(available_group_filter.toLowerCase())
            })
            :
            availableGroups
    }

    function getSelectedGroups() {
        return selected_groups.length > 0 ? selected_groups.filter(grp => {
                return grp.toLowerCase().includes(selected_group_filter.toLowerCase())
            })
            :
            selected_groups
    }

    function addGroupToUser(groupToAdd) {
        setSelectedGroups([...(selected_groups || []), groupToAdd])
    }

    function removeGroupFromUser(groupToRemove) {
        setSelectedGroups(selected_groups.filter(grp => {
            return grp !== groupToRemove
        }))
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////

    console.log("group: selected_groups",selected_groups)

    if (!props.show_organisation_form)
        return (<div/>);

    return (
        <div>

            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="modal-header px-5 pt-4 bg-light">
                                <h4 className="modal-title" id="staticBackdropLabel">{title}</h4>
                                {/* <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body p-0">

                                <div className="nav nav-tabs overflow-auto">
                                    <OrganisationTab selected_tab={selected_tab} onTabChange={handleTabChange}/>
                                </div>

                                {selected_tab === 'general' &&
                                    <div className="tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>
                                        <div className="mb-4">

                                            <div className={"mb-3 name" + (errors.name ? " error " : "")}>
                                                <label className="label-2 small">Name</label>
                                                <input
                                                    className="form-control" {...register("name", {required: true})} />
                                                {errors.name &&
                                                    <span
                                                        className="text-danger fst-italic small">This field is required </span>}
                                            </div>

                                            <div className="form-check form-switch">
                                                <input className="form-check-input"
                                                       type="checkbox" {...register('enabled')}/>
                                                <label className="form-check-label">Enabled</label>
                                            </div>

                                            <div>
                                                <input {...register("id")} type="hidden"/>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {selected_tab === 'sso' &&
                                    <div className="time-tab-content px-5 py-4 overflow-auto"
                                         style={{maxHeight: "600px", minHeight: "400px"}}>

                                        <div className="form-check form-switch">
                                            <input className="form-check-input"
                                                   type="checkbox" {...register('autoCreateSSOUsers')}/>
                                            <label className="form-check-label">allow single sign-on users to be
                                                auto-created with a default set of group ACLs and SimSage
                                                role(s).</label>
                                        </div>

                                        <div className="form-group col-12">
                                            <label className="small">domain csv</label>
                                            <textarea className="form-control"
                                                      placeholder="valid domain names separated by commas (e.g. simsage.co.uk)"
                                                      rows="3"
                                                      {...register("autoCreateSSODomainListStr", {required: false})}
                                            />
                                        </div>

                                        <div className="tab-content container px-5 py-4 overflow-auto"
                                             style={{maxHeight: "450px"}}>
                                            <div className="row pb-5">
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">SimSage Roles</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={selected_role_filter}
                                                               onChange={(e) => setRoleFilter(e.target.value)}/>
                                                        {
                                                            getSelectedRoles().map((role, i) => {
                                                                return (<Chip key={i} color="secondary"
                                                                              onClick={() => removeRoleFromUser(role)}
                                                                              label={role.label}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">Available</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={available_role_filter}
                                                               onChange={(e) => setAvailableRoleFilter(e.target.value)}/>
                                                        {
                                                            getAvailableRoles().map((role, i) => {
                                                                return (<Chip key={i} color="primary"
                                                                              onClick={() => addRoleToUser(role)}
                                                                              label={role.label}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {organisation &&
                                        <div className="tab-content container px-5 py-4 overflow-auto"
                                             style={{maxHeight: "300px"}}>
                                            <div className="row pb-5">
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">SimSage Groups</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={selected_group_filter}
                                                               onChange={(e) => setSelectedGroupFilter(e.target.value)}/>
                                                        {
                                                            getSelectedGroups().map((grp, i) => {
                                                                return (

                                                                    <Chip key={i} color="secondary"
                                                                          onClick={() => removeGroupFromUser(grp)}
                                                                          label={grp} variant="outlined"/>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="role-block col-6">
                                                    <h6 className="role-label text-center">Available</h6>
                                                    <div className="role-area bg-light border rounded h-100">
                                                        <input className="mb-3 px-2 py-2 w-100 border-0 border-bottom"
                                                               placeholder="Filter..." value={available_group_filter}
                                                               onChange={(e) => setAvailableGroupFilter(e.target.value)}/>
                                                        {
                                                            getAvailableGroups().map((grp, i) => {
                                                                return (<Chip key={i} color="primary"
                                                                              onClick={() => addGroupToUser(grp)}
                                                                              label={grp}
                                                                              variant="outlined"/>)
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                }

                            </div>
                            <div className="modal-footer px-5 pb-3">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <input type="submit" value="Save" className={"btn btn-primary px-4"}/>

                                {organisation !== null &&
                                    <button onClick={handleDelete} type="button"
                                            className="btn btn-danger px-4">Delete</button>
                                }
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );

}