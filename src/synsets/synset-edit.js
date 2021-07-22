import React, {Component} from 'react';

import {Api} from '../common/api'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const styles = {
    container: {
        float: "left",
        marginBottom: "10px",
    },
    textFieldStyle: {
        float: "left",
        width: "700px",
    },
    imageButton: {
        float: 'right',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    addImage: {
        width: '25px',
    },
    deleteButton: {
        float: 'left',
        padding: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    deleteImageSize: {
        width: '24px',
    },
};

export class SynSetEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            synSet: props.synSet,
            onSave: props.onSave,
            onError: props.onError,
            word: Api.defined(props.synSet) && Api.defined(props.synSet.word) ? props.synSet.word : "",
            cloud_list: SynSetEdit.getWordCloudList(props.synSet),
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    static getWordCloudList(synSet) {
        let list = [];
        if (Api.defined(synSet) && Api.defined(synSet.wordCloudCsvList)) {
            list = synSet.wordCloudCsvList;
        }
        while (list.length < 2) {
            list.push("");
        }
        return list;
    }
    handleSave() {
        if (this.state.onSave) {
            const syn = this.state.synSet;
            syn.word = this.state.word.trim();
            syn.wordCloudCsvList = this.state.cloud_list;

            const index = syn.word.indexOf(' ');
            if (index >= 0) {
                this.state.onError("syn-sets must be a single words without spaces.")
            } else {
                this.state.onSave(syn);
            }
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            synSet: props.synSet,
            onSave: props.onSave,
            onError: props.onError,
            word: Api.defined(props.synSet) && Api.defined(props.synSet.word) ? props.synSet.word : "",
            cloud_list: SynSetEdit.getWordCloudList(props.synSet),
        })
    }
    updateWC(index, str) {
        const cl = this.state.cloud_list;
        cl[index] = str;
        this.setState({cloud_list: cl});
    }
    newSyn() {
        const cl = this.state.cloud_list;
        cl.push("");
        this.setState({cloud_list: cl});
    }
    deleteSyn(index) {
        const newList = [];
        const cl = this.state.cloud_list;
        for (let i = 0; i < cl.length; i++) {
            if (i !== index) {
                newList.push(cl[i]);
            }
        }
        this.setState({cloud_list: newList});
    }
    render() {
        if (this.state.has_error) {
            return <h1>synset-edit.js: Something went wrong.</h1>;
        }
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    open={this.state.open}
                    fullWidth={true}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    maxWidth="lg"
                    onClose={() => this.handleCancel()} >

                <DialogTitle id="alert-dialog-title" className={this.props.theme}>Edit syn-set "{this.state.word}"</DialogTitle>
                <DialogContent className={this.props.theme}>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={2}>
                            <div>syn-set</div>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                style={styles.textFieldStyle}
                                onChange={(event) => this.setState({word: event.target.value})}
                                placeholder={"syn-set"}
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.word}
                            />
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={2}>
                            <div>word-clouds</div>
                        </Grid>
                        <Grid item xs={8}>
                            { this.state.cloud_list.map((item, index) => {
                            return (<div id={index}>
                                    <div style={styles.container}>
                                        <TextField
                                            style={styles.textFieldStyle}
                                            onChange={(event) => this.updateWC(index, event.target.value)}
                                            placeholder={"word-cloud for syn-set " + (index + 1)}
                                            multiline={true}
                                            rows={2}
                                            variant="outlined"
                                            fullWidth={true}
                                            value={item}
                                        />
                                        {
                                            index > 1 &&
                                            <div style={styles.deleteButton}
                                                 onClick={() => this.deleteSyn(index)}>
                                                <img src={this.props.theme === 'light' ? "../images/delete.svg" : "../images/delete-dark.svg"} style={styles.deleteImageSize}
                                                     title="remove syn" alt="remove syn"/>
                                            </div>
                                        }
                                    </div>
                                    <div style={{clear:'both'}}/>
                                    </div>)})}
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={9} />
                        <Grid item xs={1}>
                            <div style={styles.imageButton} onClick={() => this.newSyn()}><img
                                style={styles.addImage} src={this.props.theme === 'light' ? "../images/add.svg" : "../images/add-dark.svg"} title="add a new syn item"
                                alt="add a new syn"/></div>
                        </Grid>
                        <Grid item xs={1} />

                    </Grid>

                </DialogContent>
                <DialogActions className={this.props.theme}>
                    <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={() => this.handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default SynSetEdit;
