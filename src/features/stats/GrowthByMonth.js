import React, {useEffect, useState} from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    Bar,
    ComposedChart
} from 'recharts';
import {formatCountSize, formatStorageSize} from "./chart-utils";


export default function GrowthByMonth(props) {

    const display_type = props.displayStyle;

    // props.data = {"yyyy/MM": number, ...}
    const [data, setData] = useState([]);

    useEffect(() => {
        if (props.data) {
            const keys = Object.keys(props.data).sort();
            const new_data = [];
            if (keys.length > 1) {
                const first = keys[0].split('/');
                const last = keys[keys.length - 1].split('/');
                if (first.length === 2 && last.length === 2) {
                    const first_year = parseInt(first[0]);
                    const first_month = parseInt(first[1]);
                    const last_year = parseInt(last[0]);
                    const last_month = parseInt(last[1]);
                    let current_year = first_year;
                    let current_month = first_month;
                    let current_total = 0;
                    while (current_year <= last_year) {
                        if (current_year === last_year && current_month > last_month)
                            break;
                        const current_key = "" + current_year + "/" + ((current_month < 10 ) ? ("0" + current_month) :  ("" + current_month));
                        let current_value = 0;
                        if (props.data.hasOwnProperty(current_key)) {
                            current_value = props.data[current_key];
                            current_total += current_value;
                        }
                        new_data.push({name: current_key, size: current_value, total: current_total})
                        current_month += 1
                        if (current_month > 12) {
                            current_month = 1;
                            current_year += 1;
                        }
                    }
                }
                setData(new_data)

            } else if (keys.length === 1) {
                const current_key = keys[0];
                const current_value = props.data[current_key];
                new_data.push({name: current_key, size: current_value, total: current_value})
                setData(new_data)
            } else {
                setData([])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])


    const tickFormatter_x = (value) => {
        const arr = value.toString().split(":")
        if (arr.length === 2) {
            return ""
        }
        return value
    }

    const tickFormatter_y_left = (value) => {
        if (display_type === "bytes")
            return formatStorageSize(value, 0)
        else
            return formatCountSize(value, 0)
    }
    const tickFormatter_y_right = (value) => {
        if (display_type === "bytes")
            return formatStorageSize(value, 0)
        else
            return formatCountSize(value, 0)
    }

    const ticked = data.filter(gd => gd.tick).map(gd => gd.tick)

    if (!data || data.length === 0) {
        return (
            <>
                <br/>
                <div>{props.name}: no data</div>
            </>
        )
    }


    return (
        <>
            <br/>
            <ResponsiveContainer width="80%" height="80%">
                <ComposedChart
                    width={500}
                    height={500}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="name"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>

                    <XAxis xAxisId="0" dataKey="tick"
                           axisLine={false}
                           ticks={ticked}
                           tickFormatter={tickFormatter_x}/>
                    <YAxis width={60} yAxisId="left" tickFormatter={tickFormatter_y_left}/>
                    <YAxis width={60} yAxisId="right" orientation="right"
                           tickFormatter={tickFormatter_y_right}/>

                    <Bar key="A"
                         type="monotone"
                         yAxisId="left"
                         stackId="a"
                         dataKey="size"
                         fill="#9cd499"
                         stroke="#9cd499"
                    />

                    <Area key="B"
                          type="monotone"
                          yAxisId="right"
                          stackId="a"
                          dataKey="total"
                          fill="#82aacf"
                          stroke="#82aacf"
                    />

                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
}
