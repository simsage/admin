import React from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/status.css';
import Api from "../common/api";


export class Status extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onError : props.onError,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0;
    }
    render() {
        const status_list = this.props.status_list ? this.props.status_list : [];
        return (
            <div className="status-page">
                {this.isVisible() &&
                    <div>
                        <table className="table">
                            <thead>
                            <tr className='table-header'>
                                <th className='table-header job-id-column-width'>hostname</th>
                                <th className='table-header job-id-column-width'>service</th>
                                <th className='table-header job-id-column-width'>free memory</th>
                                <th className='table-header job-id-column-width'>created</th>
                                <th className='table-header job-id-column-width'>last modified</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                status_list.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>
                                                <div>{item.hostname}</div>
                                            </td>
                                            <td>
                                                <div>{item.service}</div>
                                            </td>
                                            <td>
                                                <div>{Api.formatSizeUnits(item.memoryFreeInBytes ? item.memoryFreeInBytes : 0)}</div>
                                            </td>
                                            <td>
                                                <div>{Api.unixTimeConvert(item.created)}</div>
                                            </td>
                                            <td>
                                                <div>{Api.unixTimeConvert(item.lastModified)}</div>
                                            </td>
                                        </tr>)
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        );
    }
};

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,

        status_list: state.appReducer.status_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Status);

