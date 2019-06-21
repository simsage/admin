import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';


export class MessageDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: props.title,
            message: props.message,
            callback: props.callback,
            has_error: false,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleOk() {
        this.setState({open: false});
        if (this.state.callback) {
            this.state.callback(true);
        }
    }
    componentWillReceiveProps(props) {
        // see if we have data to start this dialog
        this.setState({
            open: (props.message.length > 0),
            message: props.message,
            callback: props.callback,
            title: props.title
        })
    }
    cancel() {
        if (this.state.callback) {
            this.state.callback(false);
        }
    }
    ok() {
        if (this.state.callback) {
            this.state.callback(true);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>message-dialog.js: Something went wrong.</h1>;
        }
        const self = this;
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth="md"
                    onClose={() => this.cancel()} >

                <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                <DialogContent>
                    <div>
                        <div dangerouslySetInnerHTML={{__html: this.state.message}} />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.cancel()}>Cancel</Button>
                    <Button variant="outlined" color="secondary" onClick={() => this.ok()}>OK</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default MessageDialog;
