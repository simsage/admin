import React from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Api from "../common/api";

import '../css/logs.css';


export class Logs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onError : props.onError,
            openDialog: props.openDialog,
            closeDialog: props.closeDialog,
            timer_value: 0,
        };
        this.messagesEndRef = React.createRef();
        this.timer = null;
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
    componentWillUnmount() {
        if (this.timer != null) {
            window.clearTimeout(this.timer);
            this.timer = null;
        }
    }
    componentDidUpdate(prevPops, prevState, snapshot) {
        this.scrollToBottom()
        const log_refresh = this.props.log_refresh;
        if (log_refresh > 0) {
            if (this.timer == null) {
                this.timer = window.setTimeout(() => {
                    this.timer = null; if (this.props.getLogs) this.props.getLogs();
                }, log_refresh * 1000);
            }
        }
    }
    scrollToBottom() {
        if (this.isVisible()) {
            this.messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
        }
    }
    getClassForType(type) {
        if (type === 'Debug') return "log-type-debug";
        else if (type === 'Info') return "log-type-info";
        else if (type === 'Error') return "log-type-error";
        else return "log-type-warn";
    }
    getSelectedHourStyle(selected) {
        if (selected) return "log-hour-selector-selected"
         else return "log-hour-selector";
    }
    getHourTitle(hours) {
        if (hours === 1) return "display the next one hour after the selected time";
        else if (hours === 2) return "display the next two hours after the selected time";
        else if (hours === 4) return "display the next four hours after the selected time";
        else return "display the next " + hours + " hours after the selected time";
    }
    setLogHours(hours) {
        this.props.setLogHours(hours);
        this.props.getLogs();
    }
    getSelectedServiceStyle(selected) {
        if (selected) return "log-service-selector-selected"
        else return "log-service-selector";
    }
    setLogService(log_service) {
        this.props.setLogService(log_service);
        this.props.getLogs();
    }
    getSelectedLogStyle(selected) {
        if (selected) return "log-type-selector-selected"
        else return "log-type-selector";
    }
    setLogType(log_type) {
        this.props.setLogType(log_type);
        this.props.getLogs();
    }
    getLogRefreshStyle(selected) {
        if (selected) return "log-refresh-selector-selected"
        else return "log-refresh-selector";
    }
    setLogRefresh(log_refresh) {
        this.props.setLogRefresh(log_refresh);
        this.props.getLogs();
    }
    getLogs() {
        if (this.props.log_list) {
            const log_type = this.props.log_type;
            const log_service = this.props.log_service;
            const list = [];
            for (let i = 0; i < this.props.log_list.length; i++) {
                const item = this.props.log_list[i];
                if ((log_type === 'All' || item.type === log_type) &&
                    (log_service === 'All' || item.service === log_service)) {
                    list.push(item);
                }
            }
            return list;
        }
        return [];
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0;
    }
    render() {
        let date = new Date();
        if (this.props.log_date) {
            date = new Date(this.props.log_date);
        }
        const theme = this.props.theme;
        const hours = this.props.log_hours;
        const log_type = this.props.log_type;
        const log_service = this.props.log_service;
        const log_refresh = this.props.log_refresh;
        if (this.isVisible()) {
            return (
                <div className="log-page">

                    <div className="date-select">
                        <DatePicker
                            className={theme === "light" ? "wide-date-picker-input" : "wide-date-picker-input-dark"}
                            selected={date}
                            dateFormat="yyyy/MM/dd HH:mm"
                            timeFormat="HH:mm"
                            showTimeSelect
                            timeIntervals={60}
                            todayButton="today"
                            onChange={date => {
                                this.props.setLogDate(date);
                                this.props.getLogs();
                            }}/>
                    </div>

                    <div className="log-selectors">
                        <span title={this.getHourTitle(1)} className={this.getSelectedHourStyle(hours === 1)}
                              onClick={() => this.setLogHours(1)}>1 hour</span>
                        <span title={this.getHourTitle(2)} className={this.getSelectedHourStyle(hours === 2)}
                              onClick={() => this.setLogHours(2)}>2 hours</span>
                        <span title={this.getHourTitle(4)} className={this.getSelectedHourStyle(hours === 4)}
                              onClick={() => this.setLogHours(4)}>4 hours</span>
                        <span title={this.getHourTitle(12)} className={this.getSelectedHourStyle(hours === 12)}
                              onClick={() => this.setLogHours(12)}>12 hours</span>
                        <span title={this.getHourTitle(24)} className={this.getSelectedHourStyle(hours === 24)}
                              onClick={() => this.setLogHours(24)}>24 hours</span>
                        <span title={this.getHourTitle(48)} className={this.getSelectedHourStyle(hours === 48)}
                              onClick={() => this.setLogHours(48)}>48 hours</span>
                        <span className="log-spacer">&nbsp;</span>
                        <span title="display all log-types" className={this.getSelectedLogStyle(log_type === "All")}
                              onClick={() => this.setLogType("All")}>all</span>
                        <span title="display only 'info' log-types"
                              className={this.getSelectedLogStyle(log_type === "Info")}
                              onClick={() => this.setLogType("Info")}>info</span>
                        <span title="display only 'debug' log-types"
                              className={this.getSelectedLogStyle(log_type === "Debug")}
                              onClick={() => this.setLogType("Debug")}>debug</span>
                        <span title="display only 'error' log-types"
                              className={this.getSelectedLogStyle(log_type === "Error")}
                              onClick={() => this.setLogType("Error")}>error</span>
                        <span title="display only 'warning' log-types"
                              className={this.getSelectedLogStyle(log_type === "Warn")}
                              onClick={() => this.setLogType("Warn")}>warn</span>
                    </div>

                    <div className="log-selectors">
                        <span title="do not automatically refresh the logs"
                              className={this.getLogRefreshStyle(log_refresh === 0)}
                              onClick={() => this.setLogRefresh(0)}>off</span>
                        <span title="automatically refresh this log every five seconds"
                              className={this.getLogRefreshStyle(log_refresh === 5)}
                              onClick={() => this.setLogRefresh(5)}>5 seconds</span>
                        <span title="automatically refresh this log every 10 seconds"
                              className={this.getLogRefreshStyle(log_refresh === 10)}
                              onClick={() => this.setLogRefresh(10)}>10 seconds</span>
                        <span className="log-spacer">&nbsp;</span>
                        <span title="display logs from all services"
                              className={this.getSelectedServiceStyle(log_service === 'All')}
                              onClick={() => this.setLogService('All')}>all</span>
                        <span title="only display logs from the Auth service"
                              className={this.getSelectedServiceStyle(log_service === 'Auth')}
                              onClick={() => this.setLogService('Auth')}>auth</span>
                        <span title="only display logs from the Conversion service"
                              className={this.getSelectedServiceStyle(log_service === 'Conversion')}
                              onClick={() => this.setLogService('Conversion')}>conv</span>
                        <span title="only display logs from the Crawler service"
                              className={this.getSelectedServiceStyle(log_service === 'Crawler')}
                              onClick={() => this.setLogService('Crawler')}>crawl</span>
                        <span title="only display logs from the Document service"
                              className={this.getSelectedServiceStyle(log_service === 'Document')}
                              onClick={() => this.setLogService('Document')}>doc</span>
                        <span title="only display logs from the Index service"
                              className={this.getSelectedServiceStyle(log_service === 'Index')}
                              onClick={() => this.setLogService('Index')}>index</span>
                        <span title="only display logs from the Knowledgebase service"
                              className={this.getSelectedServiceStyle(log_service === 'KB')}
                              onClick={() => this.setLogService('KB')}>kb</span>
                        <span title="only display logs from the Language service"
                              className={this.getSelectedServiceStyle(log_service === 'Language')}
                              onClick={() => this.setLogService('Language')}>lang</span>
                        <span title="only display logs from the Mind service"
                              className={this.getSelectedServiceStyle(log_service === 'Mind')}
                              onClick={() => this.setLogService('Mind')}>mind</span>
                        <span title="only display logs from the Operator service"
                              className={this.getSelectedServiceStyle(log_service === 'Operator')}
                              onClick={() => this.setLogService('Operator')}>operator</span>
                        <span title="only display logs from the Search service"
                              className={this.getSelectedServiceStyle(log_service === 'Search')}
                              onClick={() => this.setLogService('Search')}>search</span>
                        <span title="only display logs from the Statistics service"
                              className={this.getSelectedServiceStyle(log_service === 'Stats')}
                              onClick={() => this.setLogService('Stats')}>stats</span>
                        <span title="only display logs from the Web service"
                              className={this.getSelectedServiceStyle(log_service === 'Web')}
                              onClick={() => this.setLogService('Web')}>web</span>
                    </div>

                    <div className="log-files">
                        {
                            this.getLogs().map((line) => {
                                return (<div className="log-line" id={line.created}>
                                    <span
                                        className={'log-type-width ' + this.getClassForType(line.type)}>{line.type}</span>
                                    <span className='log-service-width'>{line.service}</span>
                                    <span className='log-time-width'>{Api.unixTimeConvert(line.created)}</span>
                                    <span>{line.message}</span>
                                </div>)
                            })
                        }
                        <div ref={this.messagesEndRef}/>
                    </div>

                </div>
            )
        } else {
            return (<div />)
        }
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        theme: state.appReducer.theme,

        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        selected_organisation_id: state.appReducer.selected_organisation_id,

        log_date: state.appReducer.log_date,
        log_list: state.appReducer.log_list,
        log_hours: state.appReducer.log_hours,
        log_type: state.appReducer.log_type,
        log_service: state.appReducer.log_service,
        log_refresh: state.appReducer.log_refresh,

        user: state.appReducer.user,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Logs);

