import React from 'react';

import Grid from '@material-ui/core/Grid';

import {MessageDialog} from '../common/message-dialog'
import {ErrorDialog} from '../common/error-dialog'
import {AutoComplete} from "../common/autocomplete";
import {DocumentUpload} from "../common/document-upload";
import {SemanticSearch} from "../common/semantic-search";

const id_style = "<div style='width: 170px; float: left; height: 24px;'>"

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
        border: '0.1px solid #f0f0f0',
        width: '100%',
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


export class SemanticSearchManager extends React.Component {
    constructor(props) {
        super(props);
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
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    documentUploaded() {
        this.setState({message_title: "done", message: "document uploaded",
        message_callback: () => { this.setState({message: ""})}});
    }
    render() {
        if (this.state.has_error) {
            return <h1>semanticsearch-manager.js: Something went wrong.</h1>;
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
                            value={this.props.selected_knowledgebase}
                            onFilter={(text, callback) => this.props.getKnowledgeBaseListFiltered(text, callback)}
                            minTextSize={1}
                            onSelect={(label, data) => this.props.selectKnowledgeBase(label, data)}
                        />
                    </div>
                </div>

                <Grid container spacing={1} style={styles.gridWidth}>

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={4}>
                        <div style={styles.label}>Upload a document for semantic-search.</div>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={8}>
                        <DocumentUpload kbId={this.props.selected_knowledgebase_id}
                                        organisationId={this.props.selected_organisation_id}
                                        onUploadDone={() => this.documentUploaded()}
                                        onError={(errStr) => this.showError("Error", errStr)}/>
                    </Grid>
                    }

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={2}>
                        <div style={styles.label}>Semantic Search</div>
                    </Grid>
                    }
                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={10}>
                        <SemanticSearch onError={(title, err) => this.showError(title, err)}
                                        kbId={this.props.selected_knowledgebase_id}
                                        organisationId={this.props.selected_organisation_id} />
                    </Grid>
                    }

                    {this.props.selected_knowledgebase_id &&
                    <Grid item xs={12}><div style={styles.hr} /></Grid>
                    }


                </Grid>


            </div>
        )
    }
}

export default SemanticSearchManager;
