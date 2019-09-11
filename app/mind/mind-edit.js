import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const image_types = [".jpg", ".jpeg", ".png", ".gif", ".svg"];

export class MindEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            mindItem: props.mindItem,
            onSave: props.onSave,
            onError: props.onError,
            expression: props.mindItem && props.mindItem.expression ? props.mindItem.expression : "",
            answer: MindEdit.getAnswerText(props.mindItem),
            links: MindEdit.getLinks(props.mindItem),
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            const mi = this.state.mindItem;
            mi.expression = this.state.expression;
            mi.actionList = MindEdit.createActions(this.state.answer, this.state.links);
            this.state.onSave(mi);
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
            mindItem: props.mindItem,
            onSave: props.onSave,
            onError: props.onError,
            expression: props.mindItem && props.mindItem.expression ? props.mindItem.expression : "",
            answer: MindEdit.getAnswerText(props.mindItem),
            links: MindEdit.getLinks(props.mindItem),
        })
    }
    static createActions(answer, links_text) {
        const actions = [];
        if (answer.length > 0) {
            // special user/custom commands?
            if (answer.trim().indexOf("exec ") === 0) {
                const commands = answer.split("\n");
                for (let cmd of commands) {
                    const parts = cmd.trim().split(" ");
                    if (parts.length > 1 && parts[0] === "exec") {
                        const parameters = [];
                        for (let i = 2; i < parts.length; i += 1) {
                            if (parts[i].trim().length > 0) {
                                parameters.push(parts[i].trim());
                            }
                        }
                        actions.push({"action": parts[1], parameters: parameters});
                    }
                }
            } else {
                actions.push({"action": "browser.write", parameters: [answer.replace(/\n/g, "<br />")]});
            }
        }
        const links = links_text.split(",");
        for (const link of links) {
            const l = link.trim();
            if (l.length > 0) {
                const l_lwr = link.toLowerCase();
                let is_image = false;
                for (const extn of image_types) {
                    if (l_lwr.indexOf(extn) > 0) {
                        is_image = true;
                    }
                }
                if (is_image) {
                    actions.push({"action": "browser.image", parameters: [l]});
                } else {
                    actions.push({"action": "browser.link", parameters: [l]});
                }
            }
        }
        return actions;
    }
    static getAnswerText(mindItem) {
        let str = "";
        if (mindItem && mindItem.actionList) {
            for (const action of mindItem.actionList) {
                if (action) {
                    if (action.action === "browser.write" && action.parameters) {
                        for (const param of action.parameters) {
                            str = str + param.replace(/<br \/>/g, "\n");
                        }

                        // user custom command?
                    } else if (action.action !== "browser.image" && action.action !== "browser.link" && action.action !== "browser.say") {
                        str = str + "exec " + action.action;
                        for (const param of action.parameters) {
                            str += " ";
                            str += param;
                        }
                        str += "\n";
                    }
                }
            }
        }
        return str;
    }
    static getLinks(mindItem) {
        let str = "";
        if (mindItem && mindItem.actionList) {
            for (const action of mindItem.actionList) {
                if (action && action.action === "browser.image" && action.parameters) {
                    if (str.length > 0) {
                        str += "\n";
                    }
                    for (const param of action.parameters) {
                        str = str + param.replace(/<br \/>/g, "\n");
                    }
                }
                if (action && action.action === "browser.link" && action.parameters) {
                    if (str.length > 0) {
                        str += "\n";
                    }
                    for (const param of action.parameters) {
                        str = str + param.replace(/<br \/>/g, "\n");
                    }
                }
            }
        }
        return str;
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

                <DialogTitle id="alert-dialog-title">Edit Mind Item</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>

                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>expression</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                autoFocus={true}
                                onChange={(event) => this.setState({expression: event.target.value})}
                                placeholder="expression"
                                multiline={true}
                                rows={5}
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.expression}
                            />
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>answer text</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={(event) => this.setState({answer: event.target.value})}
                                placeholder="answer"
                                multiline={true}
                                rows={5}
                                variant="outlined"
                                fullWidth={true}
                                value={this.state.answer}
                            />
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={1}>
                            <div>links (csv)</div>
                        </Grid>
                        <Grid item xs={9}>
                            <TextField
                                onChange={(event) => this.setState({links: event.target.value})}
                                placeholder="links"
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
                <DialogActions>
                    <Button color="primary" onClick={() => this.handleCancel()}>Cancel</Button>
                    <Button variant="outlined" color="secondary" onClick={() => this.handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default MindEdit;
