import React, {useEffect, useState} from 'react';
import '../css/time-select.css'

const time_list = [
    '00:00','01:00','02:00','03:00','04:00','05:00','06:00','07:00','08:00','09:00','10:00','11:00',
    '12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00'
]

const day_list = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

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

    useEffect(() => {
        if (props.time)
            setTimeMap(setupTimeMap(props.time))
    }, [props.time])

    useEffect(() => {
        if (props.scheduleEnable) {
            setScheduleEnable(props.scheduleEnable)
        }
    }, [props.scheduleEnable])


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


    // get the status of a "cell" in the dow schedule for a given day/hour by string
    // this is used to set the CSS of each hour cell to either active / inactive
    function gs(cell) {
        if (!scheduleEnable)
            return timeMap[cell] === 1 ? "dim-active" : "dim-inactive";
        return timeMap[cell] === 1 ? "active" : "inactive";
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

        const toggleValue = (key) => {
            tm[key] = tm[key] === 1 ? 0 : 1;
        };

        if (item === "all") { // click select all
            for (let i = 0; i < 24; i++) {
                day_list.forEach(dow => {
                    const key = `${dow}-${i}`;
                    toggleValue(key);
                });
            }
        } else if (item.includes('-')) { // single cell toggle
            toggleValue(item);
        } else if (day_list.includes(item)) { // 24 hour selector
            for (let i = 0; i < 24; i++) {
                const key = `${item}-${i}`;
                toggleValue(key);
            }
        } else { // day of week selector
            day_list.forEach(dow => {
                const key = `${dow}-${item}`;
                toggleValue(key);
            });
        }

        setTimeMap(tm);
        handle_save(tm, scheduleEnable);
    }


    // display the current time in GMT (returns a string of the time)
    function display_time() {
        const gmtTime = new Date().toGMTString()
        const day = gmtTime.split(",")[0]
        const time = gmtTime.split(" ")[4].split(":")
        const time_no_seconds = time[0] + ":" + time[1]
        return day + ", " + time_no_seconds
    }

    function handleScheduleEnabler(e) {
        const result = e.target.checked
        setScheduleEnable(result)
        handle_save(timeMap, result)
    }

    return (
        <div className="time-select">
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
                <h6>All times in GMT (now {display_time()})</h6>
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
                            <td key={`${day}-${value}`} onClick={() => select(`${day}-${value}`)}
                                className={`cell-spacing ${gs(`${day}-${value}`)}`} />
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
