import React from 'react';

import Grid from '@material-ui/core/Grid';

import ProgramUpload from "../common/program-upload";
import Button from "@material-ui/core/Button";

import Comms from '../common/comms';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    knowledgeSelect: {
        padding: '5px',
        marginBottom: '40px',
    },
    lhs: {
        float: 'left',
        width: '150px',
        marginTop: '-10px',
        color: '#aaa',
    },
    rhs: {
        float: 'left',
    },
    label: {
        marginTop: '20px',
        color: '#555',
    },
    gridWidth: {
        width: '800px',
    },
    hr: {
        border: '0.5px solid #f0f0f0',
        width: '100%',
    },
    exportButton: {
        marginTop: '20px',
    },
};


export class KnowledgeManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    programUploaded() {
    }
    programConverted(program) {
        if (program) {
            window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
        }
    }
    backup() {
        window.open(Comms.get_backup_url(this.props.selected_organisation_id, this.props.selected_knowledgebase_id), '_blank');
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
    render() {
        return (
            <div>
                <Grid container spacing={1} style={styles.gridWidth}>

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Upload a SimSage spreadsheet or program</div>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={8}>
                        <ProgramUpload kbId={this.props.selected_knowledgebase_id}
                                       organisationId={this.props.selected_organisation_id}
                                       onUploadDone={() => this.programUploaded()}
                                       onError={(errStr) => this.props.setError("Error", errStr)}/>
                    </Grid>
                    }


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={4}>*/}
                    {/*    <div style={styles.label}>Convert a SimSage spreadsheet to a SimSage program for review</div>*/}
                    {/*</Grid>*/}
                    {/*}*/}
                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={8}>*/}
                    {/*    <ProgramConvert kbId={this.props.selected_knowledgebase_id}*/}
                    {/*                    organisationId={this.props.selected_organisation_id}*/}
                    {/*                    onUploadDone={(program) => this.programConverted(program)}*/}
                    {/*                    onError={(errStr) => this.props.setError("Error", errStr)}/>*/}
                    {/*</Grid>*/}
                    {/*}*/}

                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={12}><div style={styles.hr} /></Grid>*/}
                    {/*}*/}


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Export SimSage Spreadsheet</div>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={3}>
                        <Button color="primary" variant="outlined" style={styles.exportButton}
                                onClick={() => this.mindDump()}>Export</Button>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={7}/>
                    }


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Export Query-logs CSV</div>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={3}>
                        <Button color="primary" variant="outlined" style={styles.exportButton}
                                onClick={() => this.queryLogDump()}>Export</Button>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={7}/>
                    }


                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={2}/>*/}
                    {/*}*/}
                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={2}>*/}
                    {/*    <Button color="primary" variant="outlined"*/}
                    {/*            onClick={() => this.backup()}>Backup</Button>*/}
                    {/*</Grid>*/}
                    {/*}*/}
                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={8}>*/}
                    {/*    <RestoreUpload doUpload={(data) => this.restore(data)}*/}
                    {/*                   uploading={this.state.uploading}*/}
                    {/*                   kbId={this.props.selected_knowledgebase_id}*/}
                    {/*                   organisationId={this.props.selected_organisation_id}*/}
                    {/*                   onError={(err) => this.props.setError("Error", err)} />*/}
                    {/*</Grid>*/}
                    {/*}*/}

                    {/*{this.props.selected_knowledgebase_id &&*/}
                    {/*<Grid item xs={12}><div style={styles.hr} /></Grid>*/}
                    {/*}*/}


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
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
        knowledge_base_list: state.appReducer.knowledge_base_list,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(KnowledgeManager);

