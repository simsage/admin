import React from 'react';

import Button from '@material-ui/core/Button';

import {Bar} from 'react-chartjs-2'
import {Line} from 'react-chartjs-2'

import {GraphHelper} from "../common/graph-helper";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {parseISODate} from "luxon/src/impl/regexParser";

const top = 20;
const graphHeight = 350;
const graphWidth = 400;

const styles = {
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
    busy: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.8',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(255,255,255)"
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
        this.props.getReports();
    }
    downloadReport() {
        const date = new Date(this.state.reportDate);
        const year = date.getFullYear();
        const month1 = date.getMonth() + 1;

        const rows = [];
        GraphHelper.processList(rows, this.props.bot_access_frequency, "bot access " + year + "/" + month1);
        GraphHelper.processList(rows, this.props.search_access_frequency, "search access " + year + "/" + month1);
        GraphHelper.processSet(rows, this.props.general_statistics, "system statistics");
        GraphHelper.processSet(rows, this.props.query_word_frequency, "query frequency");
        GraphHelper.processSet(rows, this.props.file_type_statistics, "file types");

        let csvContent = "data:text/csv;charset=utf-8,"
            + rows.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        let month = "" + month1;
        if (month1 < 10) {
            month = "0" + month;
        }
        link.setAttribute("download", "SimSage-stats-" + year + "-" + month + ".csv");
        document.body.appendChild(link); // Required for FF
        link.click(); // This will download the data file named "my_data.csv".
    }
    render() {
        const date = new Date(this.props.report_date);
        return (
            <div>
                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

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
                        this.props.general_statistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.file_type_statistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.query_word_frequency.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('queries')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.props.bot_access_frequency.labels.length > 0 &&
                        <div style={styles.barGraph}>
                            <Line data={this.props.bot_access_frequency}
                                  options={GraphHelper.getGraphOptions('bot access count')} width={graphWidth}
                                  height={graphHeight}/>
                        </div>
                    }

                    {
                        this.props.search_access_frequency.labels.length > 0 &&
                        <div style={styles.barGraph}>
                            <Line data={this.props.search_access_frequency}
                                  options={GraphHelper.getGraphOptions('search access count')} width={graphWidth}
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
        bot_access_frequency: state.appReducer.bot_access_frequency,
        search_access_frequency: state.appReducer.search_access_frequency,
        general_statistics: state.appReducer.general_statistics,
        query_word_frequency: state.appReducer.query_word_frequency,
        file_type_statistics: state.appReducer.file_type_statistics,

        busy: state.appReducer.busy,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Reports);

