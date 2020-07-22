import React from 'react';

import Button from '@material-ui/core/Button';

import {Bar, Line} from 'react-chartjs-2'

import {GraphHelper} from "../common/graph-helper";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Comms from "../common/comms";

const top = 20;
const graphHeight = 350;
const graphWidth = 400;

const styles = {
    pageWidth: {
        width: '900px',
    },
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '50px',
    },
    lhs: {
        float: 'left',
        width: '150px',
        marginTop: '-10px',
        color: '#aaa',
    },
    rhs: {
        float: 'left',
    },
    label: {
        marginTop: '20px',
        color: '#555',
    },
    barGraphs: {
        float: 'left',
        margin: '20px',
        minWidth: '440px',
        width: '900px',
    },
    barGraph: {
        float: 'left',
        width: '410px',
        height: '450px',
        margin: '10px',
    },
    downloadButton: {
        float: 'right',
    },
    dateSelect: {
        float: 'right',
        marginTop: '3px',
        marginRight: '5px',
    },
};


export class Reports extends React.Component {
    constructor(props) {
        super(props);
        const date = new Date();
        this.state = {
            has_error: false,
            onError : props.onError,

            reportDate: new Date(),

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
        const date = new Date(this.state.reportDate);
        const year = date.getFullYear();
        const month1 = date.getMonth() + 1;
        window.open(Comms.get_query_log_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, year, month1), '_blank');
    }
    render() {
        const date = new Date(this.props.report_date);
        return (
            <div style={styles.pageWidth}>
                <br clear="both" />
                <div style={styles.downloadButton}>
                    <Button variant="outlined" onClick={() => this.downloadReport()}>download report</Button>
                </div>
                <div style={styles.dateSelect}>
                    <DatePicker
                        className="date-picker-input"
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

                <div style={styles.barGraphs}>
                    {
                        this.props.selected_knowledgebase_id && this.props.general_statistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.selected_knowledgebase_id && this.props.file_type_statistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.selected_knowledgebase_id && this.props.query_word_frequency.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('queries')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.selected_knowledgebase_id && this.props.access_frequency.labels.length > 0 &&
                        <div style={styles.barGraph}>
                            <Line data={this.props.access_frequency}
                                  options={GraphHelper.getGraphOptions('access count')} width={graphWidth}
                                  height={graphHeight}/>
                        </div>
                    }

                </div>

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        selected_organisation_id: state.appReducer.selected_organisation_id,

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

