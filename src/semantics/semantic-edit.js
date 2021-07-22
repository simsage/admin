import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";


const styles = {
    labelAdjustment: {
        marginTop: '17px',
    }
};

export class SemanticEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            semantic: props.semantic,
            onSave: props.onSave,
            onError: props.onError,
            word: props.semantic && props.semantic.word ? props.semantic.word: "",
            semantic_str: props.semantic && props.semantic.semantic ? props.semantic.semantic: "",
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({"word": this.state.word, "prevWord": "", "semantic": this.state.semantic_str});
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
            semantic: props.semantic,
            onSave: props.onSave,
            onError: props.onError,
            word: props.semantic && props.semantic.word ? props.semantic.word: "",
            semantic_str: props.semantic && props.semantic.semantic ? props.semantic.semantic: "",
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>semantic-edit.js: Something went wrong.</h1>;
        }
        const theme = this.props.theme;
        return (
            <Dialog aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    open={this.state.open}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    fullWidth={true}
                    maxWidth="lg"
                    onClose={() => this.handleCancel()} >

                <DialogTitle id="alert-dialog-title" className={theme}>Edit Semantic</DialogTitle>
                <DialogContent className={theme}>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div style={styles.labelAdjustment}>word</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({word: event.target.value})}
                                placeholder="word"
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.word}
                            />
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div style={styles.labelAdjustment}>semantic</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={(event) => this.setState({semantic_str: event.target.value})}
                                placeholder="semantic"
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.semantic_str}
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

export default SemanticEdit;
