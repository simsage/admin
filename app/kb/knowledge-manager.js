import React from 'react';

import Grid from '@material-ui/core/Grid';

import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'
import {AutoComplete} from "../common/autocomplete";
import {ProgramUpload} from "../common/program-upload";
import {ProgramConvert} from "../common/program-convert";
import Button from "@material-ui/core/Button";
import RestoreUpload from "../common/restore-upload";
import {Comms} from '../common/comms'
import {Api} from "../common/api";


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


export class KnowledgeManager extends React.Component {
    constructor(props) {
        super(props);
        this.kba = props.kba;
        this.state = {
            has_error: false,
            onError : props.onError,

            busy: false,

            knowledge_base_list: [],
            knowledgeBase: null,

            error_msg: "",
            error_title: "",

            message_title: "",
            message: "",
            message_callback: null,

            selected_organisation_id: props.selectedOrganisationId,
            uploading: false,

            // pagination
            page_size: 100,
            prev_page: 'null',
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg, uploading: false, busy: false});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    programUploaded() {
        this.setState({message_title: "done", message: "program uploaded",
        message_callback: () => { this.setState({message: ""})}});
    }
    programConverted(program) {
        if (program) {
            window.open().document.body.innerHTML += program.replace(/\n/g, "<br />");
        }
    }
    backup() {
        window.open(Comms.get_backup_url(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id), '_blank');
    }
    mindDump() {
        window.open(Comms.get_mind_dump_url(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id), '_blank');
    }
    queryLogDump() {
        window.open(Comms.get_query_log_url(this.kba.selected_organisation_id, this.kba.selected_knowledgebase_id), '_blank');
    }
    restore(data) {
        if (data) {
            this.setState({uploading: true, busy: true});
            Api.restore(data,
                () => {
                    this.setState({uploading: false,
                        busy: false,
                        message_title: "Success",
                        message: "data restored",
                        message_callback: () => { this.setState({message: "", message_title: ""})}
                    });
                },
                (errStr) => {
                    this.showError("Error", errStr);
                })
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>knowledge.js: Something went wrong.</h1>;
        }
        return (
            <div>
                <ErrorDialog
                    callback={() => { this.closeError() }}
                    open={this.state.error_msg.length > 0}
                    message={this.state.error_msg}
                    title={this.state.error_title} />

                <MessageDialog callback={(action) => this.state.message_callback(action)}
                               open={this.state.message.length > 0}
                               message={this.state.message}
                               title={this.state.message_title} />

                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                <div style={styles.knowledgeSelect}>
                    <div style={styles.lhs}>knowledge base</div>
                    <div style={styles.rhs}>
                        <AutoComplete
                            label='knowledge base'
                            value={this.kba.selected_knowledgebase}
                            onFilter={(text, callback) => this.kba.getKnowledgeBaseListFiltered(text, callback)}
                            minTextSize={1}
                            onSelect={(label, data) => this.kba.selectKnowledgeBase(label, data)}
                        />
                    </div>
                </div>

                <Grid container spacing={8} style={styles.gridWidth}>

                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Upload a SimSage spreadsheet or program</div>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={8}>
                        <ProgramUpload kbId={this.kba.selected_knowledgebase_id}
                                       organisationId={this.kba.selected_organisation_id}
                                       onUploadDone={() => this.programUploaded()}
                                       onError={(errStr) => this.showError("Error", errStr)}/>
                    </Grid>
                    }



                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Convert a SimSage spreadsheet to a SimSage program for review</div>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={8}>
                        <ProgramConvert kbId={this.kba.selected_knowledgebase_id}
                                        organisationId={this.kba.selected_organisation_id}
                                        onUploadDone={(program) => this.programConverted(program)}
                                        onError={(errStr) => this.showError("Error", errStr)}/>
                    </Grid>
                    }



                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Export SimSage Mind CSV</div>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={3}>
                        <Button color="primary" variant="outlined" style={styles.exportButton}
                                onClick={() => this.mindDump()}>Export</Button>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={7}/>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Export Query-logs CSV</div>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={3}>
                        <Button color="primary" variant="outlined" style={styles.exportButton}
                                onClick={() => this.queryLogDump()}>Export</Button>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={7}/>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={2}/>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={2}>
                        <Button color="primary" variant="outlined"
                                onClick={() => this.backup()}>Backup</Button>
                    </Grid>
                    }
                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={8}>
                        <RestoreUpload doUpload={(data) => this.restore(data)}
                                       uploading={this.state.uploading}
                                       kbId={this.kba.selected_knowledgebase_id}
                                       organisationId={this.kba.selected_organisation_id}
                                       onError={(err) => this.showError("Error", err)} />
                    </Grid>
                    }


                    {this.kba.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                </Grid>


            </div>
        )
    }
}

export default KnowledgeManager;
