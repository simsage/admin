import React from 'react';

import Grid from '@material-ui/core/Grid';

import {Api} from './api'

const styles = {
    searchResult: {
        marginLeft: '80px',
    },
    searchMessage: {
    },
    searchFooter: {
        float: 'left',
    },
    searchInsideNav: {
        marginTop: '5px',
        marginLeft: '2px',
        marginRight: '10px',
        float: 'left',
    },
    insideNavButtonStyle: {
        width: '16px',
        float: 'left',
        backgroundColor: '#d0d0d0',
        marginRight: '3px',
        padding: '2px',
        color: '#808080',
        borderRadius: '2px',
        cursor: 'pointer',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
    insideNavButtonStyleDisabled: {
        width: '16px',
        float: 'left',
        backgroundColor: '#d0d0d030',
        marginRight: '3px',
        padding: '2px',
        color: '#80808030',
        borderRadius: '2px',
        cursor: 'arrow',
        webkitUserSelect: 'none',
        mozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
    },
    tinmanContainer: {
        float: 'left',
        width: '80%',
    },
    tinmanLeft: {
        float: 'left',
    },
    tinmanScore: {
        fontSize: '0.8em',
    },
    tinmanText: {
        fontSize: '0.9em',
    },
    tinmanImageSize: {
        width: '50px',
        height: '50px',
    },
    imageBox: {
        float: 'left',
        marginTop: '20px',
    },
    imageHolder: {
        float: 'left',
        marginRight: '5px',
    },
    imageSize: {
        maxWidth: '150px',
        maxHeight: '150px',
        borderRadius: '5px',
    },
    urlBox: {
        marginTop: '5px',
        float: 'left',
    },
    urlStyle: {
        float: 'left',
        fontSize: '0.8em',
        color: '#009',
        marginRight: '10px',
        marginLeft: '70px',
        cursor: 'pointer',
    },
    graph_size: {
        width: '600px',
    },
    spacer: {
        height: '10px',
    }
};


export class BotSingleSearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            has_error: false,
            item: props.item,
            openDocument: props.openDocument,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps) {
            this.setState({
                item: nextProps.item,
                openDocument: nextProps.openDocument,
            })
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    static highlight(str) {
        if (str && str.replace) {
            str = str.replace(/{hl1:}/g, "<span class='hl1'>");
            str = str.replace(/{hl2:}/g, "<span class='hl2'>");
            str = str.replace(/{hl3:}/g, "<span class='hl3'>");
            str = str.replace(/{:hl1}/g, "</span>");
            str = str.replace(/{:hl2}/g, "</span>");
            str = str.replace(/{:hl3}/g, "</span>");
            str = str.replace(/\n/g, "<br />");
        }
        return str;
    }

    static setupGraph(list, x_name, y_name) {
        if (list && list.length) {
            let labels = [];
            let values = [];
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item[x_name] && item[y_name]) {
                    labels.push(item[x_name].toFixed(2));
                    values.push(item[y_name]);
                }
            }
            return {
                labels: labels,
                datasets: [
                    {
                        label: "data",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(192,75,75,0.4)',
                        borderColor: 'rgba(192,75,75,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderColor: 'rgba(192,75,75,1)',
                        pointHoverBackgroundColor: 'rgba(192,75,75,1)',
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

    static updateResults(queryResultList) {
        if (queryResultList) {
            queryResultList.map((item, i) => {
                if (item) {
                    item.imageList = [];
                    item.urlList = [];
                    item.sayList = [];
                    item.graphList = [];
                    const text_list = [];
                    if (item.actionList && item.actionList.length > 0) {

                        const actions = item.actionList;
                        for (let i = 0; i < actions.length; i++) {
                            const action = actions[i];
                            if (action['action'] === 'browser.write') {
                                for (let j = 0; j < action['parameters'].length; j++) {
                                    const param = action['parameters'][j];
                                    text_list.push(param);
                                }
                            }
                            else if (action['action'] === 'browser.say') {
                                for (let j = 0; j < action['parameters'].length; j++) {
                                    const param = action['parameters'][j];
                                    item.sayList.push(param);
                                }
                            }
                            else if (action['action'] === 'browser.image') {
                                for (let j = 0; j < action['parameters'].length; j++) {
                                    const param = action['parameters'][j];
                                    item.imageList.push(param);
                                }
                            }
                            else if (action['action'] === 'browser.url') {
                                for (let j = 0; j < action['parameters'].length; j++) {
                                    const param = action['parameters'][j];
                                    item.urlList.push(param);
                                }
                            }
                            else { // custom user command
                                text_list.push(action['action']);
                                text_list.push("(");
                                for (let j = 0; j < action['parameters'].length; j++) {
                                    if (j > 0) {
                                        text_list.push(",");
                                    }
                                    const param = action['parameters'][j];
                                    if (item.context && item.context[param] !== undefined) {
                                        text_list.push(item.context[param]);
                                    } else {
                                        text_list.push(param);
                                    }
                                }
                                text_list.push(")\n");
                            }
                        }
                        item.display = text_list.join(' ');

                        // context?
                        if (item.context) {
                            const list = [];
                            Object.keys(item.context).forEach(function(key) {
                                const value = item.context[key];
                                list.push(key + ' = ' + value);
                            });
                            if (list.length > 0) {
                                item.display += "context: {" + list.join(', ') + "}"
                            }
                        }

                    } else { // nothing?
                        item.display = '';
                    }
                    item.key = Api.createGuid(); // uid
                    item.index = 0; // index of the text used for multi-text search results
                }
            })
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>bot-single-search-result: Something went wrong.</h1>;
        }
        const self = this;
        const item = this.state.item;
        return (
            <Grid container spacing={0} style={styles.gridWidth}>
                <Grid item xs={1}>
                    <div style={styles.tinmanScore}>{item.score.toFixed(2)}</div>
                </Grid>
                <Grid item xs={11}>
                    <div style={styles.tinmanText} dangerouslySetInnerHTML={{__html: BotSingleSearchResult.highlight(item.display)}}/>
                </Grid>
                <Grid item xs={12}>
                    {
                        item.imageList.map((image) => {
                            return (<div key={image} style={styles.imageHolder}><img alt="image" src={image} style={styles.imageSize} /></div>);
                        })
                    }
                </Grid>
                <Grid item xs={12}>
                    {
                        item.urlList.map((url) => {
                            return (<div style={styles.urlStyle} key={url}><a href={url} target={"_blank"}>{url}</a></div>);
                        })
                    }
                </Grid>
                <Grid item xs={12}>
                    <div style={styles.spacer}>&nbsp;</div>
                </Grid>
            </Grid>
        )
    }

}

export default BotSingleSearchResult;

