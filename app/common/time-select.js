import React, {Component} from 'react';

const active_colour = '#eed000';
const inactive_colour = '#f0c0c0';

const styles = {
    tableStyle: {
        marginTop: '20px',
        fontFamily: 'Open Sans, sans-serif',
        fontSize: '9px',
        fontWeight: '900',
        width: '90%',
    },
    tHeader: {
        height: '20px',
        marginBottom: '5px',
        backgroundColor: '#f0f0f0',
    },
    tCol: {
        height: '20px',
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
        fontSize: '9px',
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
        fontSize: '9px',
        fontWeight: '900',
        borderRadius: '2px',
        textAlign: 'center',
        padding: '5px',
        marginLeft: '10px',
    },
};


const time_list = ['00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
                   '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'];

const day_list = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

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
                    <div style={styles.activeText}>kb active</div>
                    <div style={styles.inactiveText}>kb inactive</div>
                </div>
            </div>
        );
    }
}

export default TimeSelect;
