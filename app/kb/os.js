import React from 'react';

import {Doughnut} from 'react-chartjs-2'
import {Line} from 'react-chartjs-2'

import {GraphHelper} from "../common/graph-helper";
import system_config from "../settings"

const graphHeight = 250;
const graphWidth = 300;

// num of data points to show in the graph
const num_points = 50;

const styles = {
    barGraphs: {
        float: 'left',
        minWidth: '440px',
        width: '1100px',
        marginTop: '-20px',
    },
    barGraph: {
        float: 'left',
        width: '310px',
        height: '250px',
        margin: '10px',
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


export class OS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onError : props.onError,
        };
        this.timer = null;
    }
    componentDidCatch(error, info) {
    }
    render() {
        if (this.state.has_error) {
            return <h1>os.js: Something went wrong.</h1>;
        }
        const cpuGraph = GraphHelper.setupCpuList(system_config.cpu_stats, num_points);
        const mem = system_config.memory_usage;
        const du = system_config.disk_usage;
        return (
            <div style={styles.barGraphs}>

                {  mem && (mem.total > 0 || mem.system > 0) &&
                    <div style={styles.barGraph}>
                        <Doughnut data={GraphHelper.setupDoughnut(['free', 'used'], [(mem.total - mem.used) / 1024000000.0, mem.used / 1024000000.0])}
                                  options={GraphHelper.getDoughnutOptions('memory usage in GB')}
                                  width={graphWidth} height={graphHeight}/>
                    </div>
                }

                {
                    cpuGraph.labels.length > 0 &&
                    <div style={styles.barGraph}>
                        <Line data={cpuGraph}
                              options={GraphHelper.getGraphOptions('cpu')}
                              width={graphWidth} height={graphHeight}/>
                    </div>
                }

                {
                    du.map((item) => {
                        return (<div style={styles.barGraph} key={item.disk}>
                                    <Doughnut data={GraphHelper.setupDoughnut(['size', 'used'], [item.size / 1024000000.0, item.used / 1024000000.0])}
                                              options={GraphHelper.getDoughnutOptions('drive: ' + item.disk + ' in GB')}
                                              width={graphWidth} height={graphHeight}/>
                                </div>)
                    })
                }

            </div>
        )
    }
}

export default OS;
