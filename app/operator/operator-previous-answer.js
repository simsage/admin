import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

const styles = {
    questionStyle: {
        display: 'inline-block',
        fontWeight: '600',
    },
    answerStyle: {
        fontSize: '0.95em',
    }
};

export class OperatorPreviousAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            open: nextProps.open,
        })
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave(true);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(false);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>operator-previous-answer.js: Something went wrong.</h1>;
        }
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    open={this.state.open}
                    fullWidth={true}
                    maxWidth="lg"
                    onClose={() => this.handleCancel()} >

                <DialogTitle id="alert-dialog-title">Use Previous Answer?</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={10}>
                            <div>SimSage has a previous answer to the question: <div style={styles.questionStyle}>{this.props.question}</div></div>
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={2}>
                            <div>SimSage's answer was:</div>
                        </Grid>
                        <Grid item xs={8}>
                            <div style={styles.answerStyle}>{this.props.answer}</div>
                        </Grid>
                        <Grid item xs={1} />

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button variant="outlined" color="secondary" onClick={() => this.handleSave()}>Use this Answer</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default OperatorPreviousAnswer;
