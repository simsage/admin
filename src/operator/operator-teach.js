
import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export class OperatorTeach extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            links: '',
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.props.onSave) {
            let links = this.state.links.replace(/\n/g, ' ');
            links = links.replace(/\r/g, ' ');
            links = links.replace(/\t/g, ' ');
            this.props.onSave(true, links);
        }
    }
    handleCancel() {
        if (this.props.onSave) {
            this.props.onSave(false, '');
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>operator-teach.js: Something went wrong.</h1>;
        }
        const theme = this.props.theme;
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    open={this.props.open}
                    fullWidth={true}
                    maxWidth="lg"
                    onClose={() => this.handleCancel()} >

                <DialogTitle id="alert-dialog-title" className={theme}>Teach SimSage?</DialogTitle>
                <DialogContent className={theme}>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>question</div>
                        </Grid>
                        <Grid item xs={9}>
                            {this.props.question}
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>answer</div>
                        </Grid>
                        <Grid item xs={9}>
                            {this.props.answer}
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>links</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={(event) => this.setState({links: event.target.value})}
                                placeholder="links (images and page-links, separated by commas or spaces)"
                                multiline={true}
                                rows={5}
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.links}
                            />
                        </Grid>
                        <Grid item xs={1} />

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

export default OperatorTeach;
