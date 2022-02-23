import React from 'react';

import {Bar, Line} from 'react-chartjs-2'

import {GraphHelper} from "../common/graph-helper";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Comms from "../common/comms";

import '../css/reports.css';


const graphHeight = 350;
const graphWidth = 400;


export class Reports extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onError : props.onError,

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidMount() {
    }
    downloadReport() {
        if (this.props.session && this.props.session.id) {
            const date = new Date(this.props.report_date);
            const year = date.getFullYear();
            const month1 = date.getMonth() + 1;
            Comms.download_query_log(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, year, month1, this.props.session.id);
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        const date = new Date(this.props.report_date);
        const theme = this.props.theme;
        return (
            <div className="report-page">
                { this.isVisible() &&
                <div>
                <br clear="both" />
                <div className="download-button">
                    <button className="btn btn-primary btn-block"  onClick={() => this.downloadReport()}>download report</button>
                </div>
                <div className="date-select">
                    <DatePicker
                        className={theme === "light" ? "date-picker-input" : "date-picker-input-dark"}
                        selected={date}
                        dateFormat="yyyy/MM"
                        todayButton="today"
                        showMonthYearPicker
                        onChange={date => {
                            this.props.setReportDate(date);
                            this.props.getReports();
                        }} />
                </div>
                <br clear="both" />
                </div>
                }

                <div className="bar-graphs">
                    {
                        this.isVisible() && this.props.general_statistics.map( (stats) => {
                            return (<div key={stats.id} className="bar-graph">
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.isVisible() && this.props.file_type_statistics.map( (stats) => {
                            return (<div key={stats.id} className="bar-graph">
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.isVisible() && this.props.query_word_frequency.map( (stats) => {
                            return (<div key={stats.id} className="bar-graph">
                                <Bar data={stats} options={GraphHelper.getGraphOptions('queries')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.isVisible() && this.props.access_frequency.labels.length > 0 &&
                        <div className="bar-graph">
                            <Line data={this.props.access_frequency}
                                  options={GraphHelper.getGraphOptions('access count')} width={graphWidth}
                                  height={graphHeight}/>
                        </div>
                    }

                </div>

            </div>
        );
    }
};

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        session: state.appReducer.session,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,

        report_date: state.appReducer.report_date,
        access_frequency: state.appReducer.access_frequency,
        general_statistics: state.appReducer.general_statistics,
        query_word_frequency: state.appReducer.query_word_frequency,
        file_type_statistics: state.appReducer.file_type_statistics,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Reports);

