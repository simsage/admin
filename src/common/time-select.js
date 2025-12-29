import React, {useEffect, useState} from 'react';
import '../css/time-select.css'
import {useSelector} from "react-redux";
import Api from "./api";

const time_list = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'
]

const day_list = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const day_lookup = {'mon':0, 'tue':1, 'wed':2, 'thu':3, 'fri':4, 'sat':5, 'sun':6};
const date_dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const defaultAllTimesSelected = 'mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,' +
    'fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,' +
    'mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,' +
    'thu-6,fri-6,sat-6,sun-6,mon-7,tue-7,wed-7,thu-7,fri-7,sat-7,sun-7,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,' +
    'sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,' +
    'tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,' +
    'wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,' +
    'thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,' +
    'fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,' +
    'sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,' +
    'sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23'


/**
 * Scheduler for sources
 */
export default function TimeSelect(props) {

    const [timeMap, setTimeMap] = useState({})
    const [scheduleEnable, setScheduleEnable] = useState(false)
    const theme = useSelector((state) => state.homeReducer.theme);

    useEffect(() => {
        if (props.time)
            setTimeMap(setupTimeMap(props.time))
    }, [props.time])

    useEffect(() => {
        if (props.scheduleEnable) {
            setScheduleEnable(props.scheduleEnable)
        }
    }, [props.scheduleEnable])


    /**
     * Converts a local day and hour to its GMT/UTC equivalent.
     * @param {number} localDay - The day of the week ('sun', 'mon', etc.).
     * @param {number} localHour - The hour of the day in local time (0-23).
     * @returns {{gmtDay: string, gmtHour: number}} - The corresponding day and hour in GMT.
     */
    function convert_local_to_gmt(localDay, localHour) {
        // The formula to get GMT hour is: localHour + timezoneOffset
        const local_day_number = day_lookup[localDay]; // localDay is a string
        let gmtHour = localHour + Api.tz_offset;
        let gmtDay = local_day_number;
        // Handle day rollover
        if (gmtHour >= 24) {
            // Crossed into the next day
            gmtHour = gmtHour % 24;
            gmtDay = (gmtDay + 1) % 7; // Wrap around from Saturday (6) to Sunday (0)
        } else if (gmtHour < 0) {
            // Crossed into the previous day
            gmtHour = (gmtHour + 24) % 24;
            gmtDay = ((gmtDay - 1) + 7) % 7; // Wrap around from Sunday (0) to Saturday (6)
        }
        return { gmtDay: day_list[gmtDay], gmtHour: gmtHour };
    }


    // use new_time_map to build a string (new schedule) and callback to parent to save
    function handle_save(new_time_map, disabled) {
        if (props.onSave) {
            let time = ''
            for (let key in new_time_map) {
                if (new_time_map[key] === 1) {
                    if (time.length > 0) {
                        time += ','
                    }
                    time += key
                }
            }
            props.onSave(time, disabled)
        }
    }


    // convert a string to a dict of dow -> 1 (i.e. set)
    function setupTimeMap(time_str) {
        // "mon-1,tue-3" etc.
        const new_time_map = {}
        if (time_str)
            time_str.split(',').map((item) => {new_time_map[item] = 1; return new_time_map[item]})

        return new_time_map;
    }


    // clear the entire schedule
    function clearAll(e) {
        e.preventDefault();
        setTimeMap({})
        handle_save({}, scheduleEnable)
    }


    // select all ins schedule
    function selectAll(e) {
        e.preventDefault();
        setTimeMap(setupTimeMap(defaultAllTimesSelected))
        handle_save(setupTimeMap(defaultAllTimesSelected), scheduleEnable)
    }


    // click on an item and change the time-map accordingly
    // select all, select columns, select single values, select rows
    function select(item) {
        if (props.scheduleEnable === false)
            return

        let tm = { ...timeMap };

        const toggleValue = (day, hour) => {
            const { gmtDay, gmtHour } = convert_local_to_gmt(day, hour);
            const key = `${gmtDay}-${gmtHour}`
            tm[key] = tm[key] === 1 ? 0 : 1;
        };

        if (item === "all") { // click select all
            for (let i = 0; i < 24; i++) {
                day_list.forEach(dow => {
                    toggleValue(dow, i);
                });
            }
        } else if (day_list.includes(item)) { // 24 hour selector
            for (let i = 0; i < 24; i++) {
                toggleValue(item, i);
            }
        } else { // day of week selector (7 hour selector)
            day_list.forEach(dow => {
                toggleValue(dow, parseInt(item));
            });
        }

        setTimeMap(tm);
        handle_save(tm, scheduleEnable);
    }


    // click on an item and change the time-map accordingly
    // select all, select columns, select single values, select rows
    function select_day_hour(day, hour) {
        if (props.scheduleEnable === false)
            return
        let tm = { ...timeMap };
        // Convert the local day/hour from the UI to GMT before updating the map
        const { gmtDay, gmtHour } = convert_local_to_gmt(day, hour);
        const key = `${gmtDay}-${gmtHour}`;
        tm[key] = tm[key] === 1 ? 0 : 1;

        setTimeMap(tm);
        handle_save(tm, scheduleEnable);
    }


    // get the status of a "cell" in the dow schedule for a given day/hour by string
    // this is used to set the CSS of each hour cell to either active / inactive
    function get_day_hour_style(day, hour) {
        const { gmtDay, gmtHour } = convert_local_to_gmt(day, hour);
        const key = `${gmtDay}-${gmtHour}`;
        if (!scheduleEnable)
            return timeMap[key] === 1 ? "dim-active" : "dim-inactive";
        return timeMap[key] === 1 ? "active" : "inactive";
    }


    // display the local time (returns a string of the time)
    function display_time() {
        const localDate = new Date()
        const day = date_dow[localDate.getDay()]
        return day + " " +
            String(localDate.getHours()).padStart(2, '0') + ":" +
            String(localDate.getMinutes()).padStart(2, '0')
    }

    function handleScheduleEnabler(e) {
        const result = e.target.checked
        setScheduleEnable(result)
        handle_save(timeMap, result)
    }

    return (
        <div className={theme === "light" ? "time-select" : "time-select-dark"}>
            <div className="form-check form-switch"
                 title="If checked, SimSage perform similarity calculations on all items in this source against all other enabled sources and itself.">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={scheduleEnable}
                    onChange={(e) => handleScheduleEnabler(e)}
                />
                <label className="form-check-label small">Schedule Enabled</label>
            </div>
            <div className="labelTop text-center">
                <h6>now {display_time()}</h6>
            </div>
            <table className="tableStyle">
                <tbody>
                <tr>
                    <td onClick={() => select('all')} />
                    {time_list.map((str, value) => (
                        <td
                            key={"time-" + value}
                            onClick={() => select('' + value)}
                            className="cell-spacing tHeader"
                        >
                            {str}
                        </td>
                    ))}
                </tr>
                {day_list.map((day, _) => (
                    <tr key={day}>
                        <td onClick={() => select(day)} className="tCol">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                        </td>
                        {time_list.map((str, value) => (
                            <td key={`${day}-${value}`} onClick={() => select_day_hour(day, value)}
                                className={`cell-spacing ${get_day_hour_style(day, value)}`} />
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="legenda d-flex justify-content-center w-100"
                 title={!scheduleEnable ? "enable schedule to select/clear " : ""}
            >
                <button className="inactiveText btn-sm" disabled={!scheduleEnable}
                        onClick={(e) => clearAll(e)}>
                    Clear All
                </button>
                <button className="activeText btn-sm"  disabled={!scheduleEnable}
                        onClick={(e) => selectAll(e)}>
                    Select All
                </button>
            </div>
        </div>
    )
}
