import React from 'react';

import Button from '@material-ui/core/Button';

import {Bar} from 'react-chartjs-2'
import {Line} from 'react-chartjs-2'

import {GraphHelper} from "../common/graph-helper";
import {AutoComplete} from "../common/autocomplete";
import {Api} from "../common/api";

import system_config from "../settings";

import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { InlineDatePicker, MuiPickersUtilsProvider } from "material-ui-pickers";


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
    downloadButton: {
        marginRight: '50px',
        float: 'right',
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
    dateSelect: {
        float: 'right',
        width: '80px',
        marginTop: '-15px',
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
        this.kba = props.kba;
        this.utils = new DateFnsUtils();
        const date = new Date();
        this.state = {
            has_error: false,
            onError : props.onError,

            busy: false,

            reportDate: "" + date.getFullYear() + "/" + (date.getMonth() + 1),

            openDialog: props.openDialog,
            closeDialog: props.closeDialog,

            botAccessFrequency: {labels: []},
            searchAccessFrequency: {labels: []},

            generalStatistics: [],
            queryWordFrequency: [],
            fileTypeStatistics: [],
        };
    }
    componentDidCatch(error, info) {
    }
    componentWillReceiveProps(nextProps) {
        this.kba = nextProps.kba;
        this.setState({
            openDialog: nextProps.openDialog,
            closeDialog: nextProps.closeDialog,
        });
    }
    componentDidMount() {
        this.getReports(this.state.reportDate);
    }
    getReports(reportDate) {
        const date = new Date(reportDate + "/01");
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        if (this.kba.selected_organisation_id.length > 0 && this.kba.selected_knowledgebase_id.length > 0) {
            this.setState({busy: true});
            Api.getStats(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id, year, month, top,
                (report) => {
                    this.setState({
                        busy: false,
                        botAccessFrequency: GraphHelper.setupList(report.botAccessFrequency, "bot access"),
                        searchAccessFrequency: GraphHelper.setupList(report.searchAccessFrequency, "search access"),
                        generalStatistics: GraphHelper.setupMap(report.generalStatistics, "system"),
                        queryWordFrequency: GraphHelper.setupMap(report.queryWordFrequency, "queries (top " + top + ")"),
                        fileTypeStatistics: GraphHelper.setupMap(report.fileTypeStatistics, "file types"),
                    });
                },
                (errStr) => {
                    if (this.state.onError) {
                        this.setState({busy: false});
                        this.state.onError("Error", errStr);
                    }
                });
        }
    }
    downloadReport() {
        const date = new Date(this.state.reportDate);
        const year = date.getFullYear();
        const month1 = date.getMonth() + 1;

        const rows = [];
        GraphHelper.processList(rows, this.state.botAccessFrequency, "bot access " + year + "/" + month1);
        GraphHelper.processList(rows, this.state.searchAccessFrequency, "search access " + year + "/" + month1);
        GraphHelper.processSet(rows, this.state.generalStatistics, "system statistics");
        GraphHelper.processSet(rows, this.state.queryWordFrequency, "query frequency");
        GraphHelper.processSet(rows, this.state.fileTypeStatistics, "file types");

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
        if (this.state.has_error) {
            return <h1>reports.js: Something went wrong.</h1>;
        }
        return (
            <div>

                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                <div style={styles.knowledgeSelect}>
                    <div style={styles.lhs}>knowledge base</div>
                    <div style={styles.rhs}>
                        <AutoComplete
                            label='knowledge base'
                            value={this.kba.selected_knowledgebase}
                            onFilter={(text, callback) => this.kba.getKnowledgeBaseListFiltered(text, callback)}
                            minTextSize={1}
                            onSelect={(label, data) => {
                                this.kba.selectKnowledgeBase(label, data);
                                this.getReports(this.state.reportDate);
                            }}
                        />
                    </div>
                </div>

                <br clear="both" />
                <div style={styles.dateSelect}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <InlineDatePicker
                            margin="normal"
                            value={this.state.reportDate === "" ? null : this.state.reportDate + "/01"}
                            views={['year', 'month']}
                            format={this.state.reportDate ? this.utils.format(new Date(this.state.reportDate + "/01"), system_config.date_format) : system_config.date_format}
                            onChange={date => {
                                this.setState({reportDate: date});
                                this.getReports(date);
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div style={styles.downloadButton}>
                    <Button variant="outlined" onClick={() => this.downloadReport()}>download report</Button>
                </div>
                <br clear="both" />

                <div style={styles.barGraphs}>
                    {
                        this.state.generalStatistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.state.fileTypeStatistics.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.state.queryWordFrequency.map( (stats) => {
                            return (<div key={stats.id} style={styles.barGraph}>
                                <Bar data={stats} options={GraphHelper.getGraphOptions('queries')} width={graphWidth} height={graphHeight}/>
                            </div>)
                        })
                    }

                    {
                        this.state.botAccessFrequency.labels.length > 0 &&
                        <div style={styles.barGraph}>
                            <Line data={this.state.botAccessFrequency}
                                  options={GraphHelper.getGraphOptions('bot access count')} width={graphWidth}
                                  height={graphHeight}/>
                        </div>
                    }

                    {
                        this.state.searchAccessFrequency.labels.length > 0 &&
                        <div style={styles.barGraph}>
                            <Line data={this.state.searchAccessFrequency}
                                  options={GraphHelper.getGraphOptions('search access count')} width={graphWidth}
                                  height={graphHeight}/>
                        </div>
                    }

                </div>

            </div>
        )
    }
}

export default Reports;
