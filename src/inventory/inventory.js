import React from 'react';

import Grid from '@material-ui/core/Grid';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from "@material-ui/core/Paper";

import Comms from '../common/comms';
import Api from '../common/api';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    label: {
        marginTop: '20px',
        marginBottom: '20px',
        color: '#555',
    },
    gridWidth: {
        width: '900px',
    },
    hr: {
        border: '0.5px solid #f0f0f0',
        width: '100%',
    },
    snapshotItem: {
        marginBottom: '5px',
    },
    refreshImage: {
        float: 'right',
        width: '24px',
        cursor: 'pointer',
    },
    addImage: {
        float: 'right',
        marginTop: '-8px',
        width: '24px',
        cursor: 'pointer',
    },
    addImageDisabled: {
        float: 'right',
        marginTop: '-8px',
        width: '24px',
        backgroundColor: '#aaaaaa',
        borderRadius: '12px',
        cursor: 'pointer',
    },
    tableHeaderStyle: {
        background: '#555',
        fontSize: '0.95em',
        color: '#fff',
    },
    linkButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    downloadImage: {
        width: '24px',
    },
    tableWidth: {
        width: '100%',
    }
};


export class Inventory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date_time: 0,
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
    }
    programUploaded() {
    }
    programConverted(program) {
        if (program) {
            window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
        }
    }
    inventorizeDump(dateTime) {
        window.open(Comms.get_inventorize_dump_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, dateTime), '_blank');
    }
    inventorizeDumpSpreadsheet(dateTime) {
        window.open(Comms.get_inventorize_dump_spreadhseet_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id, dateTime), '_blank');
    }
    deleteInventorizeAsk(dateTime) {
        this.setState({date_time: dateTime});
        this.props.openDialog("are you sure you want to remove the report dated <b>" + Api.unixTimeConvert(dateTime) + "</b>?",
            "Remove Inventory Report", (action) => { this.deleteReport(action) });
    }
    deleteReport(action) {
        if (action) {
            this.props.deleteInventoryItem(this.state.date_time);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    mindDump() {
        window.open(Comms.get_mind_dump_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id), '_blank');
    }
    queryLogDump() {
        window.open(Comms.get_query_log_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id), '_blank');
    }
    restore(data) {
        if (data) {
            this.setState({uploading: true});
            Api.restore(data,
                () => {
                    this.setState({uploading: false,
                        message_title: "Success",
                        message: "data restored",
                        message_callback: () => { this.setState({message: "", message_title: ""})}
                    });
                },
                (errStr) => {
                    this.props.setError("Error", errStr);
                })
        }
    }
    isVisible() {
        return this.props.selected_organisation_id && this.props.selected_organisation_id.length > 0 &&
            this.props.selected_organisation && this.props.selected_organisation.length > 0 &&
            this.props.selected_knowledgebase_id && this.props.selected_knowledgebase_id.length > 0;
    }
    render() {
        return (
            <div>
                <Grid container spacing={1} style={styles.gridWidth}>

                    {this.isVisible() &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }

                    {this.isVisible() &&
                    <Grid item xs={12}>
                        <div style={styles.label}>Manage snapshots of your document inventory.
                            {this.props.inventorize_busy &&
                                <span>  SimSage is busy creating a new snapshot.</span>
                            }
                        </div>
                    </Grid>
                    }

                    {this.isVisible() &&
                        <Grid item xs={12}>

                                <Paper>
                                    <Table style={styles.tableWidth}>
                                        <TableHead>
                                            <TableRow style={styles.tableHeaderStyle}>
                                                <TableCell style={styles.tableHeaderStyle}>created</TableCell>
                                                <TableCell style={styles.tableHeaderStyle}>action</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            { this.props.inventorize_list && this.props.inventorize_list.timeList && this.props.inventorize_list.timeList.map((item) => {
                                                return (
                                                    <TableRow key={item}>
                                                        <TableCell>
                                                            <div style={styles.snapshotItem}>
                                                                content snapshot {Api.unixTimeConvert(item)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div style={styles.linkButton} onClick={() => this.inventorizeDump(item)}>
                                                                <img src="../images/parquet.png" style={styles.downloadImage} title="download as parquet-file" alt="download parquet"/>
                                                            </div>
                                                            <div style={styles.linkButton} onClick={() => this.inventorizeDumpSpreadsheet(item)}>
                                                                <img src="../images/xlsx.svg" style={styles.downloadImage} title="download as spreadsheet-xlsx" alt="download spreadsheet"/>
                                                            </div>
                                                            <div style={styles.linkButton} onClick={() => this.deleteInventorizeAsk(item)}>
                                                                <img src="../images/delete.svg" style={styles.downloadImage} title="remove report" alt="remove"/>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow>
                                                <TableCell/>
                                                <TableCell>
                                                    {this.props.selected_organisation_id.length > 0 && !this.props.inventorize_busy &&
                                                    <div style={styles.imageButton} onClick={() => {
                                                        this.props.createInventory();
                                                        this.props.forceInventoryBusy();
                                                    }}><img
                                                        style={styles.addImage} src="../images/add.svg" title="create a new snapshot" alt="create new snapshot"/></div>
                                                    }
                                                    {this.props.selected_organisation_id.length > 0 && this.props.inventorize_busy &&
                                                        <div style={styles.imageButton}>
                                                            <img style={styles.addImageDisabled} src="../images/add.svg" title="SimSage is currently busy processing an inventory.  Please try again later." alt="create new snapshot"/>
                                                        </div>
                                                    }
                                                    {this.props.selected_organisation_id.length > 0 &&
                                                    <img src="../images/refresh.svg" alt="refresh"
                                                         title="refresh the inventory list"
                                                         onClick={() => {
                                                             this.props.getInventoryList();
                                                             this.props.getInventoryBusy();
                                                         }}
                                                         style={styles.refreshImage}/>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                </Paper>
                        </Grid>
                    }


                </Grid>


            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_organisation: state.appReducer.selected_organisation,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        inventorize_list: state.appReducer.inventorize_list,
        knowledge_base_list: state.appReducer.knowledge_base_list,
        inventorize_busy: state.appReducer.inventorize_busy,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Inventory);

