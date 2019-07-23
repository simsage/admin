import React, {Component} from 'react';
import Button from "@material-ui/core/Button";

const active_colour = '#eed000';
const inactive_colour = '#c0c0c0';

const styles = {
    tableStyle: {
        marginTop: '20px',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '12px',
        width: '90%',
    },
    tHeader: {
        height: '22px',
        marginBottom: '5px',
        backgroundColor: '#f0f0f0',
    },
    tCol: {
        height: '22px',
        marginBottom: '5px',
        backgroundColor: '#f0f0f0',
    },
    tCell: {
        backgroundColor: '#c0c0c0'
    },
    legenda: {
        float: 'left',
        marginTop: '20px',
    },
    activeText: {
        backgroundColor: active_colour,
        float: 'left',
        width: '100px',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '12px',
        fontWeight: '900',
        borderRadius: '2px',
        textAlign: 'center',
        padding: '5px',
    },
    inactiveText: {
        backgroundColor: inactive_colour,
        float: 'left',
        width: '100px',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '12px',
        fontWeight: '900',
        borderRadius: '2px',
        textAlign: 'center',
        padding: '5px',
        marginLeft: '10px',
    },
    button1: {
        float: 'left',
        padding: '5px',
        marginLeft: '100px',
        marginTop: '-10px',
    },
    button2: {
        float: 'left',
        padding: '5px',
        marginLeft: '10px',
        marginTop: '-10px',
    },
};


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
        console.log(error, info);
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
    componentWillReceiveProps(nextProps) {
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
            time_str.split(',').map((item) => {time_map[item] = 1;});
        return time_map;
    }
    gs(cell) {
        if (this.state.time_map[cell] === 1) {
            return {backgroundColor: active_colour}
        } else {
            return {backgroundColor: inactive_colour}
        }
    }
    clearAll() {
        this.setState({time_map: this.setupTimeMap(''), time: ''});
        if (this.state.onSave) {
            this.state.onSave('');
        }
    }
    selectAll() {
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
            });
        }
        this.setState({time_map: tm});
        this.handleSave();
    }
    render() {
        if (this.state.has_error) {
            return <h1>time-select.js: Something went wrong.</h1>;
        }
        return (
            <div>
                <table style={styles.tableStyle}>
                    <tbody>
                    <tr>
                        <td onClick={() => this.select('all')}/>
                        { time_list.map((str, value) => {
                            return (<td key={"time-"+value} onClick={() => this.select('' + value)} style={styles.tHeader}>{str}</td>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('mon')} style={styles.tCol}>Monday</td>
                        { time_list.map((str, value) => {
                             return (<td key={"mon-"+value} onClick={() => this.select('mon-'+value)} style={this.gs('mon-'+value)} />)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('tue')} style={styles.tCol}>Tuesday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"tue-"+value} onClick={() => this.select('tue-'+value)} style={this.gs('tue-'+value)} />)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('wed')} style={styles.tCol}>Wednesday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"wed-"+value} onClick={() => this.select('wed-'+value)} style={this.gs('wed-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('thu')} style={styles.tCol}>Thursday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"thu-"+value} onClick={() => this.select('thu-'+value)} style={this.gs('thu-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('fri')} style={styles.tCol}>Friday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"fri-"+value} onClick={() => this.select('fri-'+value)} style={this.gs('fri-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('sat')} style={styles.tCol}>Saturday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"sat-"+value} onClick={() => this.select('sat-'+value)} style={this.gs('sat-'+value)}/>)
                        })}
                    </tr>
                    <tr>
                        <td onClick={() => this.select('sun')} style={styles.tCol}>Sunday</td>
                        { time_list.map((str, value) => {
                            return (<td key={"sun-"+value} onClick={() => this.select('sun-'+value)} style={this.gs('sun-'+value)}/>)
                        })}
                    </tr>
                    </tbody>
                </table>

                <br />
                <div style={styles.legenda}>
                    <div style={styles.activeText}>active</div>
                    <div style={styles.inactiveText}>inactive</div>
                    <div style={styles.button1}>
                        <Button variant="outlined"
                                color="secondary"
                                onClick={() => this.clearAll()}>
                            clear all
                        </Button>
                    </div>
                    <div style={styles.button2}>
                        <Button variant="outlined"
                                color="secondary"
                                onClick={() => this.selectAll()}>
                            select all
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TimeSelect;
