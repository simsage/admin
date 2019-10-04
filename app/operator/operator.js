import React from 'react';

import Button from '@material-ui/core/Button';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import FreeBreakfastIcon from '@material-ui/icons/FreeBreakfast';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import SimSageIcon from '@material-ui/icons/Adb';
import PersonIcon from '@material-ui/icons/Person';

import TextField from "@material-ui/core/TextField";
import OperatorTeach from "./operator-teach";
import OperatorPreviousAnswer from './operator-previous-answer'
import Home from '../home'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    buttonsTop: {
        marginTop: '-50px',
    },
    topButton: {
        marginLeft: '10px',
    },
    conversations: {
        marginTop: '10px',
        backgroundColor: '#fafafa',
        width: '1024px',
        height: '500px',
        borderRadius: '10px',
        overflowY: 'auto',
    },
    avatarBackground: {
        backgroundColor: '#ccc',
    },
    simSageIcon: {
        color: '#66aa66',
    },
    simSageIconSelected: {
        color: '#dd6666',
    },
    personIcon: {
        color: '#666cc6',
    },
    personIconSelected: {
        color: '#dd6666',
    },
    kbName: {
        float: 'right',
        marginTop: '4px',
        marginRight: '100px',
        fontSize: '0.9em'
    }
};


export class Operator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            operator_reply: '', // operator text
        };
    }
    componentDidCatch(error, info) {
        console.log(error, info);
        this.props.setError(error, info);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.listRef) {
            this.listRef.scrollTop = this.listRef.scrollHeight;
        }
    }
    readyForChat() {
        const data = {
            sessionId: this.props.session.id,
            organisationId: this.props.selected_organisation_id,
            userId: this.props.user.id,
        };
        this.props.sendMessage('/ws/ops/ready', data);
        this.props.operatorReady(true);
    }
    takeBreak() {
        const data = {
            sessionId: this.props.session.id,
            organisationId: this.props.selected_organisation_id,
            clientId: this.props.client_id,
        };
        this.props.sendMessage('/ws/ops/take-break', data);
        this.props.operatorReady(false);
    }
    nextUser() {
        const data = {
            sessionId: this.props.session.id,
            organisationId: this.props.selected_organisation_id,
            clientId: this.props.client_id,
        };
        this.props.sendMessage('/ws/ops/next-user', data);
        this.props.clearUser();
    }
    banUserConfirm() {
        if (this.props.client_id && this.props.client_id.length > 0) {
            this.props.openDialog("are you sure you want to ban this user?",
                "Ban User", (action) => {
                    this.banUser(action)
                });
        }
    }
    banUser(act) {
        if (act) {
            const data = {
                sessionId: this.props.session.id,
                organisationId: this.props.selected_organisation_id,
                clientId: this.props.client_id,
            };
            this.props.sendMessage('/ws/ops/ban-user', data);
            this.props.clearUser();
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    operatorReply(text) {
        if (this.props.client_id.length > 0 && text.length > 0) {
            const data = {
                sessionId: this.props.session.id,
                organisationId: this.props.selected_organisation_id,
                clientId: this.props.client_id,
                kbId: this.props.client_kb_id,
                text: text,
            };
            this.props.sendMessage('/ws/ops/chat', data);

            // add a new conversation to the list
            this.props.addConversation({id: this.props.conversation_list.length + 1, primary: text,
                                        secondary: "You", used: false, is_simsage: true});

            this.setState({operator_reply: ''});
        }
    }
    selectForLearn(item) {
        if (item && item.is_simsage) {
            if (item.id === this.props.answer_id)
                this.props.setOperatorAnswer('', '');
            else
                this.props.setOperatorAnswer(item.id, item.primary);
        } else if (item) {
            if (item.id === this.props.question_id)
                this.props.setOperatorQuestion('', '');
            else
                this.props.setOperatorQuestion(item.id, item.primary);
        }
    }
    teachSimSage(teach) {
        if (teach) {
            if (this.props.client_id.length > 0 && this.props.question.length > 0 && this.props.answer.length > 0) {
                const data = {
                    sessionId: this.props.session.id,
                    organisationId: this.props.selected_organisation_id,
                    clientId: this.props.client_id,
                    kbId: this.props.client_kb_id,
                    text: this.props.question,
                    answer: this.props.answer,
                };
                this.props.sendMessage('/ws/ops/teach', data);

                // mark these two items as used
                const conversation_list = this.props.conversation_list;
                for (const item of conversation_list) {
                    if (item.id === this.props.question_id || item.id === this.props.answer_id) {
                        this.props.markConversationItemUsed(item.id);
                    }
                }
            }
        }
        this.props.setOperatorAnswer('', '');
        this.props.setOperatorQuestion('', '');
    }
    usePreviousQuestion(use) {
        if (use && this.props.prev_answer.length > 0) {
            this.operatorReply(this.props.prev_answer);
        }
        this.props.clearPreviousAnswer();
    }
    getAvatarStyle(item) {
        if (item.is_simsage) {
            if (item.id === this.props.answer_id || item.used) {
                return styles.simSageIconSelected;
            } else {
                return styles.simSageIcon;
            }
        } else {
            if (item.id === this.props.question_id || item.used) {
                return styles.personIconSelected;
            } else {
                return styles.personIcon;
            }
        }
    }
    render() {
        const isOperator = Home.hasRole(this.props.user, ['operator']);
        const active = this.props.operator_ready && this.props.operator_connected && isOperator;
        const has_user = this.props.client_id && this.props.client_id.length > 0;
        return (
            <div>
                <OperatorTeach
                    open={this.props.question_id !== '' && this.props.answer_id !== ''}
                    question={this.props.question}
                    onSave={(teach) => this.teachSimSage(teach)}
                    answer={this.props.answer}
                    />

                <OperatorPreviousAnswer
                    open={this.props.current_question !== '' && this.props.prev_answer !== ''}
                    question={this.props.current_question}
                    onSave={(use) => this.usePreviousQuestion(use)}
                    answer={this.props.prev_answer}
                />

                <div style={styles.buttonsTop}>
                    <Button variant="contained" style={styles.topButton} disabled={this.props.operator_ready || !this.props.operator_connected}
                            color="secondary" title="Signal that you are ready to go and converse with customers."
                            onClick={() => this.readyForChat()}>
                        <KeyboardVoiceIcon />
                        Ready
                    </Button>

                    <Button variant="contained" style={styles.topButton} disabled={!active}
                            color="secondary" title="take a break, stop participating in conversations while you have a break."
                            onClick={() => this.takeBreak()}>
                        <FreeBreakfastIcon />
                        Break
                    </Button>

                    <Button variant="contained" style={styles.topButton} disabled={!has_user}
                            color="secondary" title="We have finished the current conversation and are ready for a next one."
                            onClick={() => this.nextUser()}>
                        <SupervisedUserCircleIcon />
                        Next User
                    </Button>

                    <Button variant="contained" style={styles.topButton} disabled={!has_user}
                            color="secondary" title="The current conversation is abusive or bad spirited, ban this user from the system."
                            onClick={() => this.banUserConfirm()}>
                        <PersonAddDisabledIcon />
                        Ban User
                    </Button>

                    <div style={styles.kbName}>bot connections: <b>{this.props.num_active_connections}</b></div>

                    {
                        this.props.client_kb_name && this.props.client_kb_name.length > 0 &&
                        <div style={styles.kbName}>{this.props.client_kb_name}</div>
                    }

                </div>


                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <div>
                            <List style={styles.conversations} dense={true} ref={ (list) => { this.listRef = list }}>
                                {this.props.conversation_list.map((item) => {
                                    return (
                                        <ListItem key={item.id} onClick={() => {if (active) this.selectForLearn(item)}}>
                                            <ListItemAvatar>
                                                <Avatar style={styles.avatarBackground}>
                                                    { item.is_simsage && <SimSageIcon style={this.getAvatarStyle(item)} /> }
                                                    { !item.is_simsage && <PersonIcon style={this.getAvatarStyle(item)}/> }
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={item.primary}
                                                secondary={item.secondary}
                                            />
                                        </ListItem>
                                    )
                                }
                                )}
                            </List>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={1} />
                    <Grid item xs={9}>
                        <TextField
                            onChange={(event) => this.setState({operator_reply: event.target.value})}
                            disabled={!has_user}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    this.operatorReply(this.state.operator_reply);
                                }
                            }}
                            label="your reply"
                            fullWidth={true}
                            value={this.state.operator_reply}
                        />
                    </Grid>
                    <Grid item xs={2} style={{marginTop: '12px'}}>
                        <Button variant="outlined"
                                disabled={!has_user}
                                color="secondary"
                                onClick={() => this.operatorReply(this.state.operator_reply)}>
                            Reply
                        </Button>
                    </Grid>
                </Grid>

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        session: state.appReducer.session,
        user: state.appReducer.user,

        operator_connected: state.appReducer.operator_connected,
        conversation_list: state.appReducer.conversation_list,
        num_active_connections: state.appReducer.num_active_connections,
        operator_ready: state.appReducer.operator_ready,
        question_id: state.appReducer.question_id,
        question: state.appReducer.question,
        answer_id: state.appReducer.answer_id,
        answer: state.appReducer.answer,
        client_id: state.appReducer.client_id,
        client_kb_id: state.appReducer.client_kb_id,
        client_kb_name: state.appReducer.client_kb_name,

        current_question: state.appReducer.current_question,
        prev_answer: state.appReducer.prev_answer,

        selected_organisation_id: state.appReducer.selected_organisation_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Operator);

