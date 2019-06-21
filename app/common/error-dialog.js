import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';

// display error dialog
export class ErrorDialog extends React.Component {
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
            this.state.callback();
        }
    }
    componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null && nextProps.message) {
            this.setState({
                open: (nextProps.message.length > 0),
                message: nextProps.message,
                title: nextProps.title
            })
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>error-dialog.js: Something went wrong.</h1>;
        }
        return (
            <Dialog className="error-dialog" ref="dialog"
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth="md"
                    onClose={this.handleOk.bind(this)} >

                <DialogTitle id="alert-dialog-title"><InputLabel error={true}>{this.state.title}</InputLabel></DialogTitle>
                <DialogContent>
                    <div>
                        {this.state.message}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" type="submit" color="primary" onClick={() => this.handleOk()}>Ok</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ErrorDialog;
