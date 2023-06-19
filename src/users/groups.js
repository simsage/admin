import React from 'react';

import GroupEdit from "./group-edit";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {Pagination} from "../common/pagination";

import '../css/groups.css';


export class Groups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group_edit: false,
            group: {name: '', userIdList: []},
            openDialog: props.openDialog,
            closeDialog: props.closeDialog,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
    }
    getGroupList() {
        const start = this.props.group_page * this.props.group_page_size;
        const end = start + this.props.group_page_size;
        // filter groups?
        let list = this.props.group_list;
        const filter = this.props.group_filter.trim().toLowerCase();
        if (filter && filter.length > 0) {
            const new_list = [];
            for (const group of list) {
                if (group.name.toLowerCase().indexOf(filter) >= 0) {
                    new_list.push(group);
                }
            }
            list = new_list;
        }
        const final_list = [];
        for (let i = start; i < end; i++) {
            if (i < list.length) {
                final_list.push(list[i]);
            }
        }
        return {list: final_list, size: list.length};
    }
    deleteGroupAsk(group) {
        if (group) {
            this.props.openDialog("are you sure you want to remove \"" + group.name + "\"?",
                "Remove Group", (action) => { this.deleteGroup(action) });
            this.setState({group: group});
        }
    }
    deleteGroup(action) {
        if (action && this.state.group) {
            this.props.deleteGroup(this.state.group.name);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
        this.setState({group_edit: false, group: {}});
    }
    handleSearchTextKeydown(event) {
        if (event.key === "Enter") {
            this.props.getGroups();
        }
    }
    editGroup(group) {
        this.setState({group_edit: true,
            group: {
                name: group.name,
                userIdList: group.userIdList,
            }});
    }
    newGroup() {
        this.setState({group_edit: true,
            group: {
                name: "",
                userIdList: [],
            }});
    }
    save(group) {
        if (group) {
            if (group.name && group.name.trim().length > 0) {
                this.props.saveGroup(group.name, group.userIdList);
                this.setState({group_edit: false, group: {}});
                if (this.state.closeDialog) {
                    this.state.closeDialog();
                }
            } else {
                this.props.setError("Error Saving Group", "group must have a valid name");
            }
        } else {
            this.setState({group_edit: false, group: {}});
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0;
    }
    render() {
        const theme = this.props.theme;
        const groups = this.getGroupList();
        return (
            <div className="group-display">
                <GroupEdit open={this.state.group_edit}
                              theme={theme}
                              group={this.state.group}
                              user_list={this.props.user_list}
                              onSave={(item) => this.save(item)}
                              onError={(err) => this.props.setError("Error", err)} />

                {
                    this.isVisible() &&
                    <div className="filter-find-box">
                        <span className="filter-label">filter</span>
                        <span className="filter-find-text">
                            <input type="text" value={this.props.group_filter} autoFocus={true} className={"filter-text-width " + theme}
                                   onKeyPress={(event) => this.handleSearchTextKeydown(event)}
                                   onChange={(event) => {
                                       this.props.setGroupFilter(event.target.value);
                                   }}/>
                        </span>
                        <span className="filter-find-image">
                            <img className="image-size"
                                 onClick={() => this.props.getGroups()}
                                 src="images/dark-magnifying-glass.svg" title="search" alt="search"/>
                        </span>
                    </div>
                }


                <br clear="both" />

                {
                    this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                                <tr className='table-header'>
                                    <th className='table-header'>group name</th>
                                    <th className='table-header'>actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    groups.list.map((group) => {
                                        return (
                                            <tr key={group.name}>
                                                <td>
                                                    <div className="label user-group-align-left">{group.name}</div>
                                                </td>
                                                <td>
                                                    <div className="link-button" onClick={() => this.editGroup(group)}>
                                                        <img src="images/edit.svg" className="image-size" title="edit group" alt="edit"/>
                                                    </div>
                                                    <div className="link-button" onClick={() => this.deleteGroupAsk(group)}>
                                                        <img src="images/delete.svg" className="image-size" title="remove group" alt="remove"/>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                <tr>
                                    <td/>
                                    <td>
                                        {this.isVisible() &&
                                        <div className="image-button" onClick={() => this.newGroup()}><img
                                            className="image-size" src="images/add.svg" title="new group"
                                            alt="new group"/></div>
                                        }
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <Pagination
                            theme={theme}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={groups.size}
                            rowsPerPage={this.props.group_page_size ? this.props.group_page_size : 10}
                            page={this.props.group_page ? this.props.group_page : 0}
                            backIconButtonProps={{
                                'aria-label': 'Previous Page',
                            }}
                            nextIconButtonProps={{
                                'aria-label': 'Next Page',
                            }}
                            onChangePage={(page) => this.props.setGroupPage(page)}
                            onChangeRowsPerPage={(rows) => this.props.setGroupPageSize(rows)}
                        />

                    </div>
                }

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        group_list: state.appReducer.group_list,
        group_filter: state.appReducer.group_filter,
        group_page: state.appReducer.group_page,
        group_page_size: state.appReducer.group_page_size,

        user_list: state.appReducer.all_user_list,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Groups);

