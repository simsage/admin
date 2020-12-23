import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";


export class SynonymEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            synonym: props.synonym,
            onSave: props.onSave,
            onError: props.onError,
            words: props.synonym && props.synonym.words ? props.synonym.words : "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            const syn = this.state.synonym;
            syn.words = this.state.words;
            this.state.onSave(syn);
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
            synonym: props.synonym,
            onSave: props.onSave,
            onError: props.onError,
            words: props.synonym && props.synonym.words ? props.synonym.words : "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>synonym-edit.js: Something went wrong.</h1>;
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

                <DialogTitle id="alert-dialog-title">Edit Synonym</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>synonyms</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({words: event.target.value})}
                                placeholder="words"
                                multiline={true}
                                rows={5}
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.words}
                            />
                        </Grid>
                        <Grid item xs={1} />

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button variant="outlined" color="secondary" onClick={() => this.handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default SynonymEdit;
