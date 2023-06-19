import React, {Component} from 'react';

import '../css/time-select.css'

const time_list = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
                   '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

const day_list = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// time schedule all selected
const defaultAllTimesSelected = 'mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-7,tue-7,wed-7,thu-7,fri-7,sat-7,sun-7,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23';

// display error dialog
export class TimeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onSave: props.onSave,  // save callback
            time: props.time,
            time_map: this.setupTimeMap(props.time),
            has_error: false,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    handleSave() {
        let time = '';
        for (let key in this.state.time_map) {
            if (this.state.time_map[key] === 1) {
                if (time.length > 0) {
                    time += ',';
                }
                time += key;
            }
        }
        if (this.state.onSave) {
            this.state.onSave(time);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            const time_map = this.setupTimeMap(nextProps.time);
            this.setState({
                time: nextProps.time,
                onSave: nextProps.onSave,
                time_map: time_map,
            })
        }
    }
    setupTimeMap(time_str) {
        // "mon-1,tue-3" etc.
        let time_map = {};
        if (time_str)
            time_str.split(',').map((item) => {time_map[item] = 1; return time_map[item];});
        return time_map;
    }
    gs(cell) {
        if (this.state.time_map[cell] === 1) {
            return "active";
        } else {
            return "inactive";
        }
    }
    clearAll(e) {
        e.preventDefault();
        this.setState({time_map: this.setupTimeMap(''), time: ''});
        if (this.state.onSave) {
            this.state.onSave('');
        }
    }
    selectAll(e) {
        e.preventDefault();
        this.setState({time_map: this.setupTimeMap(defaultAllTimesSelected), time: defaultAllTimesSelected});
        if (this.state.onSave) {
            this.state.onSave(defaultAllTimesSelected);
        }
    }
    select(item) {
        let tm = this.state.time_map;
        if (item === "all") {
            // invert all
            for (let i = 0; i < 24; i++) {
                day_list.map( (dow) => {
                    const str = dow + '-' + i;
                    if (tm[str] === 1) {
                        tm[str] = 0;
                    } else {
                        tm[str] = 1;
                    }
                    return tm[str];
                });
            }
        } else if (item.indexOf('-') > 0) {
            // single cell selector
            if (tm[item] === 1) {
                tm[item] = 0;
            } else {
                tm[item] = 1;
            }

        } else if (day_list.indexOf(item) >= 0) {
            // 24 hour selector
            for (let i = 0; i < 24; i++) {
                const str = item + '-' + i;
                if (tm[str] === 1) {
                    tm[str] = 0;
                } else {
                    tm[str] = 1;
                }
            }
        } else {
            // day of week selector
            day_list.map( (dow) => {
                const str = dow + '-' + item;
                if (tm[str] === 1) {
                    tm[str] = 0;
                } else {
                    tm[str] = 1;
                }
                return tm[str];
            });
        }
        this.setState({time_map: tm});
        this.handleSave();
    }
    // return a pretty version of GMT time (eg. Tue, 10:21)
    timeStr() {
        const gmtTime = new Date().toGMTString();
        const day = gmtTime.split(",")[0];
        const time = gmtTime.split(" ")[4].split(":");
        const time_no_seconds = time[0] + ":" + time[1];
        return day + ", " + time_no_seconds;
    }
    render() {
        if (this.state.has_error) {
            return <h1>time-select.js: Something went wrong.</h1>;
        }
        return (
            <div className="time-select">
                <div className="labelTop text-center">
                    <h6>All times in GMT (now {this.timeStr()})</h6>
                </div>
                <table className="tableStyle">
                    <tbody>
                    <tr>
                        <td onClick={() => this.select('all')}/>
                        { time_list.map((str, value) => {
                            return (<td key={"time-"+value} onClick={() => this.select('' + value)} className="cell-spacing tHeader">{str}</td>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('mon')} className="tCol">Monday</td>
                        { time_list.map((str, value) => {
                             return (<td key={"mon-"+value} onClick={() => this.select('mon-'+value)} className={"cell-spacing " + this.gs('mon-'+value)} />)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('tue')} className="tCol">Tuesday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"tue-"+value} onClick={() => this.select('tue-'+value)} className={"cell-spacing " + this.gs('tue-'+value)} />)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('wed')} className="tCol">Wednesday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"wed-"+value} onClick={() => this.select('wed-'+value)} className={"cell-spacing " +this.gs('wed-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('thu')} className="tCol">Thursday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"thu-"+value} onClick={() => this.select('thu-'+value)} className={"cell-spacing " + this.gs('thu-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('fri')} className="tCol">Friday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"fri-"+value} onClick={() => this.select('fri-'+value)} className={"cell-spacing " + this.gs('fri-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('sat')} className="tCol">Saturday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"sat-"+value} onClick={() => this.select('sat-'+value)} className={"cell-spacing " + this.gs('sat-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('sun')} className="tCol">Sunday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"sun-"+value} onClick={() => this.select('sun-'+value)} className={"cell-spacing " + this.gs('sun-'+value)}/>)
                        })}
                    </tr>
                    </tbody>
                </table>

                <div className="legenda d-flex justify-content-center w-100">
                    {/* <div className="activeText">Active</div>
                    <div className="inactiveText">Inactive</div> */}
                    <button className="inactiveText btn-sm" onClick={(e) => this.clearAll(e)}>
                        Clear All
                    </button>
                    <button className="activeText btn-sm" onClick={(e) => this.selectAll(e)}>
                        Select All
                    </button>
                </div>
            </div>
        );
    }
}

export default TimeSelect;
