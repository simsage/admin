import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";


export class OrganisationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,

            id: this.props.id,
            name: this.props.name,
            enabled: this.props.enabled,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({
                id: this.state.id,
                name: this.state.name,
                enabled: this.state.enabled,
            });
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
            onSave: props.onSave,
            onError: props.onError,

            id: props.id,
            name: props.name,
            enabled: props.enabled,
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>organisation-edit.js: Something went wrong.</h1>;
        }
        const theme = this.props.theme;
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    open={this.state.open}
                    maxWidth="lg"
                    onClose={() => this.handleCancel()} >

                <DialogTitle id="alert-dialog-title" className={theme}>Edit Organisation</DialogTitle>
                <DialogContent className={theme}>
                    <Grid container spacing={2}>

                        <Grid item xs={1} />
                        <Grid item xs={2}>
                            <div>name</div>
                        </Grid>
                        <Grid item xs={7}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({name: event.target.value})}
                                placeholder="name"
                                variant="standard"
                                fullWidth={true}
                                value={this.state.name}
                            />
                        </Grid>
                        <Grid item xs={2} />


                        <Grid item xs={4} />
                        <Grid item xs={6}>
                            <Checkbox
                                checked={this.state.enabled}
                                onChange={(event) => { this.setState({enabled: event.target.checked}); }}
                                value="enable this organisation?"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                            organisation enabled?
                        </Grid>
                        <Grid item xs={2} />


                    </Grid>
                </DialogContent>
                <DialogActions className={theme}>
                    <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button variant="contained" color="secondary" onClick={() => this.handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default OrganisationEdit;
