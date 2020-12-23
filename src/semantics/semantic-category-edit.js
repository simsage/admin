import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";


const styles = {
    roleBlock: {
        padding: '5px',
        marginTop: '20px',
        float: 'left',
        width: '400px',
        border: '1px solid #888',
        borderRadius: '4px',
        marginLeft: '10px',
    },
    roleLabel: {
        fontSize: '0.8em',
        color: '#aaa',
    },
    roleArea: {
        padding: '20px',
    },
    roleChip: {
        margin: '2px',
    },
}


export class SemanticCategoryEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            displayName: props.synonym && props.synonym.displayName ? props.synonym.displayName : "",
            semanticList: props.synonym && props.synonym.semanticList ? props.synonym.semanticList : [],
            definedSemanticList: props.definedSemanticList,
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
            this.state.onSave(this.state.displayName, this.state.semanticList);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null, null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            displayName: props.synonym && props.synonym.displayName ? props.synonym.displayName : "",
            semanticList: props.synonym && props.synonym.semanticList ? props.synonym.semanticList : [],
            definedSemanticList: props.definedSemanticList,
            onSave: props.onSave,
            onError: props.onError,
        })
    }
    getSemantics() {
        return this.state.semanticList;
    }
    getAvailableSemantics() {
        const list = [];
        const semanticList = this.getSemantics();
        for (const available_semantic of this.state.definedSemanticList) {
            let found = false;
            for (const semantic of semanticList) {
                if (available_semantic === semantic) {
                    found = true;
                }
            }
            if (!found) {
                list.push(available_semantic);
            }
        }
        return list;
    }
    addSemantic(semantic) {
        const semanticList = this.getSemantics();
        semanticList.push(semantic);
        this.setState({semanticList: semanticList});
    }
    removeSemantic(semantic) {
        const semanticList = this.getSemantics();
        const newSemanticList = [];
        for (const s of semanticList) {
            if (s !== semantic) {
                newSemanticList.push(s);
            }
        }
        this.setState({semanticList: newSemanticList});
    }
    render() {
        if (this.state.has_error) {
            return <h1>semantic-category-edit.js: Something went wrong.</h1>;
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

                <DialogTitle id="alert-dialog-title">Edit Semantic Display Category</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>display name</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({displayName: event.target.value})}
                                placeholder="display name"
                                fullWidth={true}
                                value={this.state.displayName}
                            />
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={10}>
                            <div>
                                <div style={styles.roleBlock}>
                                    <div style={styles.roleLabel}>category semantics</div>
                                    <div style={styles.roleArea}>
                                        {
                                            this.getSemantics().map((semantic) => {
                                                return (<Chip key={semantic} color="secondary"
                                                              style={styles.roleChip}
                                                              onClick={() => this.removeSemantic(semantic)}
                                                              label={semantic} variant="outlined" />)
                                            })
                                        }
                                    </div>
                                </div>
                                <div style={styles.roleBlock}>
                                    <div style={styles.roleLabel}>available semantics</div>
                                    <div style={styles.roleArea}>
                                        {
                                            this.getAvailableSemantics().map((semantic) => {
                                                return (<Chip key={semantic} color="primary"
                                                              style={styles.roleChip}
                                                              onClick={() => this.addSemantic(semantic)}
                                                              label={semantic} variant="outlined" />)
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
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

export default SemanticCategoryEdit;
