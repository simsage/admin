import React, {useEffect, useState} from 'react';
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import {formatCountSize} from "./chart-utils";


export default function DocumentBreakdown(props) {

    // props.data = {"yyyy/MM": number, ...}
    const [data, setData] = useState([]);

    const COLORS = [
        '#1851A8', '#3986A8', '#80ba90', '#82aacf',
        '#8dcde8', '#9cd499', '#f3d589', '#82aacf',
    ];

    // Returns the color for the extension to show in chart
    const getColorForExtension = (index) => {
        if (!COLORS || COLORS.length === 0) return "black"
        return COLORS[index % COLORS.length]
    }

    useEffect(() => {
        if (props.data) {
            const keys = Object.keys(props.data).sort();
            let total = 0;
            for (const key of keys) {
                const value = parseInt(props.data[key]);
                if (value > 0)
                    total += value;
            }
            const threshold = (total / 50.0) + 1;

            const new_data = [];
            for (const key of keys) {
                const value = parseInt(props.data[key]);
                if (value > threshold) {
                    const pretty_value = formatCountSize(value) + " documents";
                    if (props.keyLookup && props.keyLookup.hasOwnProperty(key)) {
                        new_data.push({"value": value, "name": props.keyLookup[key] + " " + pretty_value});
                    } else {
                        new_data.push({"value": value, "name": key + " " + pretty_value});
                    }
                }
            }

            let sub_total = 0;
            let sub_list = [];
            for (const key of keys) {
                const value = parseInt(props.data[key]);
                if (value > 0 && value <= threshold) {
                    sub_total += value;
                    let key_str = key;
                    if (props.keyLookup && props.keyLookup.hasOwnProperty(key)) {
                        key_str = props.keyLookup[key];
                    }
                    sub_list.push(key_str + " " + value);
                }
            }

            if (sub_total > 0) {
                new_data.push({"value": sub_total, "name": sub_list.join(", ") + " documents"});
            }

            setData(new_data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.data])

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
            <ResponsiveContainer width="100%" height="100%">
                <div>{props.name}</div>
                <PieChart width={400} height={400}>
                    <Pie
                        dataKey="value"
                        startAngle={0}
                        endAngle={360}
                        data={data}
                        animationDuration={0.1}
                        cx="30%"
                        cy="30%"
                        outerRadius={80}
                        fill="#8884d8"
                        label
                    >
                        {data.map((entry, index) => {
                            return <Cell key={`cell-${index}`}
                                         fill={getColorForExtension(index)}/>
                        })}
                    </Pie>
                    <Tooltip formatter={(value) => {
                        return props.displayStyle === formatCountSize(parseInt(value.toString()))
                    }}/>
                </PieChart>
            </ResponsiveContainer>
        </>
    );
}
