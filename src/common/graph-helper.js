
export class GraphHelper {

    // labelList: array of strings
    // valueList: array of same size of values (data)
    static setupDoughnut(labelList, valueList) {
        return {
            labels: labelList,
            datasets: [{
                data: valueList,
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#56CE56'
                ],
                hoverBackgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#56CE56'
                ]
            }]
        };
    }

    // setup items in a hash-map separated by frequencies
    static setupMap(map, description) {
        if (map) {
            const stat_list = [];
            const size_list = [100, 10000, 100000, -1];
            const seen = new Set();
            for (const i in size_list) {
                const cf = size_list[i];
                let labels = [];
                let values = [];
                for (const key in map) {

                    if (map.hasOwnProperty(key)) {
                        let value = map[key];
                        if ((value === -1 || value < cf) && !seen.has(key)) {
                            seen.add(key);
                            labels.push(key);
                            values.push(value.toFixed(2));
                        }
                    }
                }
                if (labels.length > 0) {
                    stat_list.push({
                        id: i,
                        labels: labels,
                        title: description,
                        datasets: [
                            {
                                label: description,
                                fill: false,
                                lineTension: 0.1,
                                backgroundColor: 'rgba(98,194,214,1)',
                                borderColor: 'rgba(98,194,214,1)',
                                pointBackgroundColor: '#fff',
                                pointBorderColor: 'rgba(98,194,214,1)',
                                pointHoverBackgroundColor: 'rgba(98,194,214,1)',
                                pointHoverBorderColor: 'rgba(220,220,220,1)',
                                borderCapStyle: 'butt',
                                borderDash: [],
                                borderDashOffset: 0.0,
                                borderJoinStyle: 'miter',
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                pointHoverBorderWidth: 2,
                                pointRadius: 1,
                                pointHitRadius: 10,
                                data: values
                            }
                        ]
                    });
                }
            }
            return stat_list
        }
        return [];
    }

    // setup a list of values
    static setupList(list, label, scale = 1.0) {
        if (list && list.length) {
            let labels = [];
            let values = [];
            const day_map = {};
            let numGtZero = 0;
            for (let i = 0; i <= 30; i++) {
                day_map[i + 1] = list[i];
                if (list[i] > 0) {
                    numGtZero += 1;
                }
            }
            if (numGtZero === 0) {
                return {labels: []};
            }
            for (let i = 1; i <= 31; i++) {
                labels.push('' + i);
                if (day_map.hasOwnProperty(i) && day_map[i] > 0) {
                    values.push(day_map[i] / scale);
                } else {
                    values.push(0.0);
                }
            }
            return {
                labels: labels,
                datasets: [
                    {
                        label: label,
                        fill: false,
                        lineTension: 0.4,
                        backgroundColor: 'rgba(154,202,147,1)',
                        borderColor: 'rgba(154,202,147,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(154,202,147,1)',
                        pointHoverBackgroundColor: 'rgba(154,202,147,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: values
                    }
                ]
            };
        }
        return {labels: []};
    }

    // setup a list of values {user, system, idle}
    static setupCpuList(list, num_points = 50, scale = 1.0) {
        if (list && list.length) {
            let labels = [];
            let values1 = [];
            let values2 = [];

            let listStart = 0;
            if (list.length > num_points) {
                listStart = list.length - num_points;
            }
            for (let i = listStart; i < listStart + num_points; i++) {
                labels.push('');
                if (i < list.length) {
                    values1.push(list[i].idle / scale);
                    values2.push((list[i].user + list[i].system) / scale);
                } else {
                    values1.push(0.0);
                    values2.push(0.0);
                }
            }
            return {
                labels: labels,
                datasets: [
                    {
                        label: "busy",
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(192, 75,120,0.7)',
                        borderColor: 'rgba(192, 75,120,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(192, 75, 120,1)',
                        pointHoverBackgroundColor: 'rgba(192, 75,120,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: values2
                    },
                    {
                        label: "idle",
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,120,0.4)',
                        borderColor: 'rgba(75,192,120,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(75, 192,120,1)',
                        pointHoverBackgroundColor: 'rgba(75,192,120,1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 0,
                        data: values1
                    },
                ]
            };
        }
        return {labels: []};
    }

    // setup the options for a graph
    static getGraphOptions(title) {
        return {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            hover: {
                mode: 'label'
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: false,
                        labelString: ''
                    }
                }],
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true,
                        steps: 10,
                        stepValue: 5,
                    }
                }]
            },
            title: {
                display: true,
                text: title
            }
        };
    }

    // setup the doughnut options for a graph
    static getDoughnutOptions(title) {
        return {
            responsive: true,
            legend: {
                position: 'bottom',
            },
            hover: {
                mode: 'label'
            },
            title: {
                display: true,
                text: title
            }
        };
    }

    // process a list of data (main_list) and put it into processList()
    static processList(list, main_list, title) {

        if (main_list && main_list.labels && main_list.datasets &&
            main_list.datasets.length === 1 && main_list.datasets[0].data) {

            list.push(["", ""]);
            list.push([title, ""]);
            for (let i = 0; i < main_list.labels.length; i++) {
                list.push(["" + main_list.labels[i], "" + main_list.datasets[0].data[i]]);
            }
        }
    }

    // process a set of data (main_list) and put it into list
    static processSet(list, main_set, title) {
        for (const temp_list of main_set) {
            GraphHelper.processList(list, temp_list, title);
        }
    }

}


export default GraphHelper;
