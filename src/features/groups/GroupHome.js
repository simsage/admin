import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {getGroupList} from "./groupSlice";
import {Pagination} from "../../common/pagination";
import {hasRole} from "../../common/helpers";



export default function GroupHome(){

    const [page, setPage] = useState(useSelector((state) => state.groupReducer.page))
    const [page_size, setPageSize] = useState(useSelector((state) => state.groupReducer.page_size))
    const theme = null;
    const dispatch = useDispatch();


    const user = useSelector((state) => state.authReducer.user)
    const group_list = useSelector((state) => state.groupReducer.group_list)
    const group_list_status = useSelector((state) => state.groupReducer.status)
    const session = useSelector((state)=>state.authReducer.session)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)


    const isAdmin = hasRole(user, ['admin']);
    const isManager = hasRole(user, ['manager']);

    useEffect(()=>{
        if(group_list_status === undefined && group_list === undefined){
            console.log("session useEffect",session)
            console.log("selected_organisation",selected_organisation_id)
            dispatch(getGroupList({session_id:session.id, organization_id:selected_organisation_id}))
        }
    },[])

    function getGroups(access) {
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
        return paginated_list;
    }

    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-beteween w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} autoFocus={true} className={"form-control " + theme}
                        />
                    </div>
                </div>

                <div className="form-group col ms-auto">
                    <button className="btn btn-primary text-nowrap">
                        + Add Group
                    </button>
                </div>
            </div>


            <div className="section">
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
                            //const editYes = canEdit(group, isAdmin, isManager);
                            const editYes = false;
                            //const deleteYes = canDelete(group, session.user, isAdmin, isManager);
                            const deleteYes = false;
                            return <tr key={group.id} >
                                <td className="label"> {group.name}</td>
                                <td><button className={(editYes)? "btn btn-primary": "btn btn-secondary disabled"} >Edit icon</button></td>
                                <td><button className={(deleteYes)? "btn btn-outline-danger" :"btn btn-secondary disabled" }>Delete icon </button></td>
                            </tr>
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

        </div>
    )
}