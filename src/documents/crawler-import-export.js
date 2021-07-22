import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";


export class CrawlerImportExport extends Component {
    constructor(props) {
        super(props);
        var data = (props.crawler) ? JSON.stringify(props.crawler) : "";
        if (data === "{}") {
            data = "";
        }
        this.state = {
            has_error: false,
            open: props.open,
            data: data,
            onSave: props.onSave,
            onError: props.onError,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave(this.state.data);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        var data = (props.crawler) ? JSON.stringify(props.crawler) : "";
        if (data === "{}") {
            data = "";
        }
        this.setState({
            open: props.open,
            data: data,
            onSave: props.onSave,
            onError: props.onError,
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>mind-edit.js: Something went wrong.</h1>;
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

                <DialogTitle id="alert-dialog-title" className={this.props.theme}>{this.props.export_upload ? "Import Crawler" : "Export Crawler"}</DialogTitle>
                <DialogContent className={this.props.theme}>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>data</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({data: event.target.value})}
                                placeholder="crawler data"
                                variant="filled"
                                spellCheck={false}
                                fullWidth={true}
                                multiline={true}
                                rows={10}
                                value={this.state.data}
                            />
                        </Grid>
                        <Grid item xs={1} />

                    </Grid>
                </DialogContent>
                <DialogActions className={this.props.theme}>
                    {this.props.export_upload &&
                    <div>
                        <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                        <Button variant="contained" color="secondary" onClick={() => this.handleSave()}>Import</Button>
                    </div>
                    }
                    {!this.props.export_upload &&
                    <div>
                        <Button color="primary" onClick={() => this.handleCancel()}>Close</Button>
                    </div>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

export default CrawlerImportExport;
