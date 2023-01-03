import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {getGroupList, showAddGroupForm, showEditGroupForm, showGroupDeleteAsk} from "./groupSlice";
import {Pagination} from "../../common/pagination";
import {hasRole} from "../../common/helpers";
import GroupEdit from "./groupEdit";
import GroupDeleteAsk from "./GroupDeleteAsk";



export default function GroupHome(){

    const [page, setPage] = useState(useSelector((state) => state.groupReducer.page))
    const [page_size, setPageSize] = useState(useSelector((state) => state.groupReducer.page_size))
    const theme = null;
    const dispatch = useDispatch();
    const load_data = useSelector((state) => state.groupReducer.data_status)


    const user = useSelector((state) => state.authReducer.user)
    const group_list_parent = useSelector((state) => state.groupReducer.group_list)
    const group_list = group_list_parent ? group_list_parent.groupList : group_list_parent;
    const group_list_status = useSelector((state) => state.groupReducer.status)
    const session = useSelector((state)=>state.authReducer.session)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)


    const isAdmin = hasRole(user, ['admin']);
    const isManager = hasRole(user, ['manager']);

    useEffect(()=>{
        // if(group_list_status === undefined && group_list === undefined){
            console.log("session useEffect",session)
            console.log("selected_organisation",selected_organisation_id)
            dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
        // }
        console.log('use effect ran',load_data);
    },[load_data === "load_now"])

    function getGroups(access) {
        //console.log("HERE TO SEE ACCESS:", access);

        const paginated_list = [];
        const first = page * page_size;
        const last = first + parseInt(page_size);
        let index = 0;
        for (const i in group_list) {
            // paginate all users - but only those that have roles in this organisation
            const group = group_list[i];
            if (access ) { // Has access to view groups.
                if (index >= first && index < last) {
                    paginated_list.push(group);
                }
                index += 1; // one more user in this set of roles
            }
        }
        console.log('we are here', paginated_list)
        return paginated_list;
    }

    function handleEditGroup(group) {
        console.log('Opening..', group.name)
        dispatch(showEditGroupForm({show:true, name:group.name}));
    }
    function handleAddGroup() {
        dispatch(showAddGroupForm(true));
    }

    function deleteGroupAsk(group){
        dispatch(showGroupDeleteAsk({show:true, group:group}))
    }

    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} autoFocus={true} className={"form-control " + theme}
                        />
                        <button className="btn btn-primary text-nowrap" onClick={() => dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))}>refresh</button>
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
                        <td className="small">Name</td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        getGroups((isAdmin || isManager)).map(group => {
                            console.log('hello we made it to here')
                            //const editYes = canEdit(group, isAdmin, isManager);
                            const editYes = true;
                            //const deleteYes = canDelete(group, session.user, isAdmin, isManager);
                            const deleteYes = false;
                            return (
                                console.log(group)
                            // <tr key={group.name} >
                            //     <td className=""> {group.name}</td>
                            //     <td>
                            //         <button
                            //         className={(editYes)? "btn btn-primary": "btn btn-secondary disabled"}
                            //         onClick={() => handleEditGroup(group)}
                            //         >Edit icon</button>
                            //     </td>
                            //     <td><button className={(deleteYes)? "btn btn-outline-danger" :"btn btn-secondary" } onClick={() => deleteGroupAsk(group)}>Delete icon </button></td>
                            // </tr>
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