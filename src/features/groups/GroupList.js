import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {showAddGroupForm, showEditGroupForm, showErrorMessage, showGroupDeleteAsk} from "./groupSlice";
import {Pagination} from "../../common/pagination";
import {hasRole} from "../../common/helpers";
import GroupEdit from "./groupEdit";
import GroupDeleteAsk from "./GroupDeleteAsk";
import groupError from "./GroupErrorDialog";
import api from "../../common/api";



export default function GroupList(){

    // const [page, setPage] = useState(useSelector((state) => state.groupReducer.page))
    // const [page_size, setPageSize] = useState(useSelector((state) => state.groupReducer.page_size))
    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const theme = null;
    const dispatch = useDispatch();
    const load_data = useSelector((state) => state.groupReducer.data_status)


    const user = useSelector((state) => state.authReducer.user)
    const group_list = useSelector((state) => state.groupReducer.group_list)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)


    const isAdmin = hasRole(user, ['admin']);
    const isManager = hasRole(user, ['manager']);
    const [filter, setFilter] = useState('');

    useEffect(()=>{
            // dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[load_data === 'load_now',page, page_size, selected_organisation_id])

    function filterGroups() {
        let filteredGroup = []
        group_list.forEach( grp => {
            if(grp.name.toLowerCase().includes(filter.toLowerCase())) {
                filteredGroup.push(grp)
            }
        })
        return filteredGroup
    }

    //filterGroups();

    function getGroups(access) {
        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        let index = 0;
        const iterable_list = filter.length > 0 ? filterGroups() : group_list


        for (const i in iterable_list) {
            // paginate all users - but only those that have roles in this organisation
            const group = iterable_list[i];
            if (access ) { // Has access to view groups.
                if (index >= first && index < last) {
                    paginated_list.push(group);
                }
                index += 1; // one more user in this set of roles
            }
        }
        return paginated_list;
    }

    function handleEditGroup(group) {
        dispatch(showEditGroupForm({show:true, name:group.name}));
    }
    function handleAddGroup() {
        dispatch(showAddGroupForm(true));
    }

    function deleteGroupAsk(group){
        if (group.userIdList.length === 0) {
            dispatch(showGroupDeleteAsk({show: true, group: group}))
        } else {
            const message = 'Please remove users from group before deleting'
            dispatch(showErrorMessage(message))
        }
    }

    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} autoFocus={true} className={"form-control filter-search-input " + theme} value={filter} onChange={(e) => {setFilter(e.target.value)}}
                        />
                    </div>
                </div>

                <div className="form-group col ms-auto">
                    <button className="btn btn-primary text-nowrap" onClick={() => handleAddGroup()}>
                        + Add Group
                    </button>
                </div>
            </div>


            <div className="">
                {!group_list &&
                    <div>Loading...</div>
                }

                <table className="table">
                    <thead>
                    <tr>
                        <td className="small text-black-50 px-4">Name</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        getGroups((isAdmin || isManager)).map(group => {
                            //const editYes = canEdit(group, isAdmin, isManager);
                            const editYes = isAdmin || isManager;
                            //const deleteYes = canDelete(group, session.user, isAdmin, isManager);
                            const deleteYes = isAdmin || isManager;
                            return (
                                <tr key={group.name} >
                                    <td className="pt-3 px-4 pb-2 d-flex">
                                        <div className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill">{group.name}</div>
                                    </td>
                                    <td className="pt-3 px-4 pb-0">
                                        <div className="d-flex  justify-content-end">
                                            <button className={(editYes)? "btn text-primary btn-sm": "btn btn-secondary disabled"} onClick={() => handleEditGroup(group)}>Edit</button>
                                            <button className={(deleteYes)? "btn text-danger btn-sm" : "d-none"} onClick={ () => deleteGroupAsk(group)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }


                    </tbody>
                </table>
                { group_list &&
                    <Pagination
                        rowsPerPageOptions={[5, 10, 25]}
                        theme={theme}
                        component="div"
                        count={group_list.length}
                        rowsPerPage={page_size}
                        page={page}
                        backIconButtonProps={{'aria-label': 'Previous Page',}}
                        nextIconButtonProps={{'aria-label': 'Next Page',}}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(rows) => setPageSize(rows)}
                    />
                }

            </div>
            <GroupEdit/>
            <GroupDeleteAsk/>

        </div>
    )
}