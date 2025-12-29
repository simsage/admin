import {useDispatch, useSelector} from "react-redux";
import React, {useState, useEffect} from "react";
import {getGroupList, setGroupTextFilter, showAddGroupForm, showEditGroupForm, showGroupDeleteAsk} from "./groupSlice";
import {Pagination} from "../../common/pagination";
import {hasRole} from "../../common/helpers";
import GroupEdit from "./groupEdit";
import GroupDeleteAsk from "./GroupDeleteAsk";
import api from "../../common/api";



export default function GroupList(){
    const ICON = "images/icon/icon_sso_GOOGLE.svg"

    const [page, setPage] = useState(api.initial_page);
    const [page_size, setPageSize] = useState(api.initial_page_size);

    const dispatch = useDispatch();
    const load_data = useSelector((state) => state.groupReducer.data_status)
    const session = useSelector((state) => state.authReducer.session)
    const group_text_filter = useSelector((state) => state.groupReducer.group_text_filter)
    const theme = useSelector((state) => state.homeReducer.theme);

    const user = useSelector((state) => state.authReducer.user)
    const {group_list, group_count} = useSelector((state) => state.groupReducer)
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)

    const isAdmin = hasRole(user, ['admin']);
    const isManager = hasRole(user, ['manager']);


    useEffect(() => {
        if (!session || !selected_organisation_id) return
        dispatch(getGroupList({
            session_id: session.id,
            organization_id: selected_organisation_id,
            page: page,
            page_size: page_size,
            filter: group_text_filter === '' ? null : group_text_filter
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load_data === "load_now", page, page_size])

    function handleSearchTextChange(e) {
        if (selected_organisation_id) {
            dispatch(setGroupTextFilter({"group_text_filter": e.target.value}))
        }
    }

    function handleSearchTextKeydown(e) {
        if (!session || !selected_organisation_id) return
        if (e.key === "Enter") {
            dispatch(getGroupList({
                session_id: session.id,
                organization_id: selected_organisation_id,
                page: page,
                page_size: page_size,
                filter: group_text_filter === '' ? null : group_text_filter
            }))
        }
    }

    function handleEditGroup(group) {
        let group_name = group.displayName
        if (!group_name || group_name.trim() === "") {
            group_name = group.name;
        }
        dispatch(showEditGroupForm({show: true, name: group_name, userIdList: group.userIdList, ssoSource: group.ssoSource}));
    }
    function handleAddGroup() {
        dispatch(showAddGroupForm(true));
    }

    function deleteGroupAsk(group){
        dispatch(showGroupDeleteAsk({show: true, group: group}))
    }

    return(
        <div className="section px-5 pt-4">
            <div className="d-flex justify-content-between w-100 mb-4">
                <div className="d-flex w-100">
                    <div className="form-group me-2">
                        <input type="text" placeholder={"Filter..."} autoFocus={true}
                               className={"form-control filter-search-input "}
                               value={group_text_filter}
                               onKeyDown={(e) => handleSearchTextKeydown(e)}
                               onChange={(e) => handleSearchTextChange(e)}
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

                <table className={theme === "light" ? "table" : "table-dark"}>
                    <thead>
                    <tr>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}>Name</td>
                        <td className={"small " + (theme==="light" ? "text-black-50" : "text-white-50") + " px-4"}></td>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        group_list.map(group => {
                            const editYes = isAdmin || isManager;
                            const deleteYes = isAdmin || isManager;
                            let group_name = group.displayName
                            if (!group_name || group_name.trim() === "") {
                                group_name = group.name;
                            }
                            return (
                                <tr key={group.name} >
                                    <td className="pt-3 px-4 pb-2 d-flex">
                                        <div
                                            className="small text-capitalize table-pill px-3 py-1 me-2 mb-2 rounded-pill">
                                            {group.ssoSource &&
                                                <img alt="icon" src={ICON} className={"sso_icon"}
                                                     title="SSO Group"/>}
                                            {group_name}
                                        </div>
                                    </td>
                                    <td className="pt-3 px-4 pb-0">
                                        <div className="d-flex  justify-content-end">
                                            <button className={(editYes)? "btn text-primary btn-sm": "btn btn-secondary disabled"}
                                                onClick={() => handleEditGroup(group)}>{group.ssoSource?"View":"Edit"}
                                        </button>
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
                        component="div"
                        count={group_count}
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