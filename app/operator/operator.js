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
import Api from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    buttonsTop: {
        marginTop: '10px',
    },
    topButton: {
        marginLeft: '10px',
    },
    closeButton: {
        marginTop: '-35px',
        marginRight: '30px',
        height: '20px',
        float: 'right',
        cursor: 'pointer',
    },
    conversations: {
        marginTop: '10px',
        backgroundColor: '#fafafa',
        width: '900px',
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
        marginLeft: '5px',
        marginTop: '4px',
        marginRight: '100px',
        fontSize: '0.9em'
    },
    typingDots: {
        width: '60px',
    }
};


export class Operator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            operator_reply: '', // operator text
            last_time: 0,
        };
    }
    componentDidMount() {
        window.setInterval(() => this.checkClientTyping(), 1000);
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
            operatorId: this.props.operator.id,
            organisationId: this.props.selected_organisation_id,
            userId: this.props.user.id,
        };
        this.props.sendOperatorMessage('/ops/ready', data);
        this.props.operatorReady(this.props.operator.id, true);
    }
    isTyping() {
        const last_time = this.state.last_time;
        const curr_time = Api.getSystemTime();
        if (last_time < curr_time) {
            this.setState({last_time: curr_time + 2000});
            if (this.props.operator.client_id && this.props.operator.id) {
                const data = {
                    fromId: this.props.operator.id,
                    toId: this.props.operator.client_id,
                    isTyping: true
                };
                this.props.sendOperatorMessage('/ops/typing', data);
            }
        }
    }
    checkClientTyping() {
        // signal the client is no longer typing?  (on a timer, see mounted)
        if (this.props.operator && this.props.operator.is_typing &&
            this.props.operator.typing_time < Api.getSystemTime()) {
            this.props.stopClientTyping(this.props.operator.id);
        }
    }
    takeBreak() {
        const data = {
            sessionId: this.props.session.id,
            operatorId: this.props.operator.id,
            organisationId: this.props.selected_organisation_id,
            clientId: this.props.operator.client_id,
        };
        this.props.sendOperatorMessage('/ops/take-break', data);
        this.props.operatorReady(this.props.operator.id, false);
    }
    nextUser() {
        const data = {
            sessionId: this.props.session.id,
            operatorId: this.props.operator.id,
            organisationId: this.props.selected_organisation_id,
            clientId: this.props.operator.client_id,
        };
        this.props.sendOperatorMessage('/ops/next-user', data);
        this.props.clearUser(this.props.operator.id);
    }
    banUserConfirm() {
        if (this.props.operator.client_id && this.props.operator.client_id.length > 0) {
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
                operatorId: this.props.operator.id,
                organisationId: this.props.selected_organisation_id,
                clientId: this.props.operator.client_id,
            };
            this.props.sendOperatorMessage('/ops/ban-user', data);
            this.props.clearUser(this.props.operator.id);
        }
        if (this.props.closeDialog) {
            this.props.closeDialog();
        }
    }
    operatorReply(text) {
        if (this.props.operator.client_id.length > 0 && text.length > 0) {
            const data = {
                sessionId: this.props.session.id,
                operatorId: this.props.operator.id,
                organisationId: this.props.selected_organisation_id,
                clientId: this.props.operator.client_id,
                kbId: this.props.operator.client_kb_id,
                text: text,
            };
            this.props.sendOperatorMessage('/ops/chat', data);

            // add a new conversation to the list
            this.props.addConversation(this.props.operator.id, {id: this.props.operator.conversation_list.length + 1, primary: text,
                                        secondary: "You", used: false, is_simsage: true});

            this.setState({operator_reply: ''});
        }
    }
    selectForLearn(item) {
        if (item && item.is_simsage) {
            if (item.id === this.props.operator.answer_id)
                this.props.setOperatorAnswer(this.props.operator.id, '', '');
            else
                this.props.setOperatorAnswer(this.props.operator.id, item.id, item.primary);
        } else if (item) {
            if (item.id === this.props.operator.question_id)
                this.props.setOperatorQuestion(this.props.operator.id, '', '');
            else
                this.props.setOperatorQuestion(this.props.operator.id, item.id, item.primary);
        }
    }
    teachSimSage(teach, links) {
        if (teach) {
            if (this.props.operator.client_id.length > 0 && this.props.operator.question.length > 0 &&
                this.props.operator.answer.length > 0) {
                const data = {
                    sessionId: this.props.session.id,
                    operatorId: this.props.operator.id,
                    organisationId: this.props.selected_organisation_id,
                    clientId: this.props.operator.client_id,
                    kbId: this.props.operator.client_kb_id,
                    text: this.props.operator.question,
                    answer: this.props.operator.answer,
                    links: links,
                };
                this.props.sendOperatorMessage('/ops/teach', data);

                // mark these two items as used
                const conversation_list = this.props.operator.conversation_list;
                for (const item of conversation_list) {
                    if (item.id === this.props.operator.question_id || item.id === this.props.operator.answer_id) {
                        this.props.markConversationItemUsed(this.props.operator.id, item.id);
                    }
                }
            }
        }
        this.props.setOperatorAnswer(this.props.operator.id, '', '');
        this.props.setOperatorQuestion(this.props.operator.id, '', '');
    }
    usePreviousQuestion(use) {
        if (use && this.props.operator.prev_answer.length > 0) {
            this.operatorReply(this.props.operator.prev_answer);
        }
        this.props.clearPreviousAnswer(this.state.operator.id);
    }
    getAvatarStyle(item) {
        if (item.is_simsage) {
            if (item.id === this.props.operator.answer_id || item.used) {
                return styles.simSageIconSelected;
            } else {
                return styles.simSageIcon;
            }
        } else {
            if (item.id === this.props.operator.question_id || item.used) {
                return styles.personIconSelected;
            } else {
                return styles.personIcon;
            }
        }
    }
    render() {
        const isOperator = Home.hasRole(this.props.user, ['operator']);
        const active = this.props.operator.operator_ready && this.props.operator_connected && isOperator;
        const isReady = this.props.operator.operator_ready || !this.props.operator_connected;
        const has_user = this.props.operator.client_id && this.props.operator.client_id.length > 0;
        return (
            <div>
                <OperatorTeach
                    open={this.props.operator.question_id !== '' && this.props.operator.answer_id !== ''}
                    question={this.props.operator.question}
                    onSave={(teach, links) => this.teachSimSage(teach, links)}
                    answer={this.props.operator.answer}
                    />

                <OperatorPreviousAnswer
                    open={this.props.operator.current_question !== '' && this.props.operator.prev_answer !== ''}
                    question={this.props.operator.current_question}
                    onSave={(use) => this.usePreviousQuestion(use)}
                    answer={this.props.operator.prev_answer}
                />

                <div style={styles.buttonsTop}>
                    <Button variant="contained" style={styles.topButton} disabled={isReady}
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
                        this.props.operator.client_kb_name && this.props.operator.client_kb_name.length > 0 &&
                        <div style={styles.kbName}>{this.props.operator.client_kb_name}</div>
                    }


                </div>

                {
                    !this.props.isFirst &&
                    <div style={styles.closeButton}
                         title="Remove this operator"
                         onClick={() => { this.takeBreak(); this.props.onCloseTab(); this.props.removeOperator(this.props.operator.id); }}>x</div>
                }

                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <div>
                            <List style={styles.conversations} dense={true} ref={ (list) => { this.listRef = list }}>
                                {this.props.operator.conversation_list.map((item) => {
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
                                {this.props.operator.is_typing &&
                                    <ListItem>
                                        <img src="../images/dots.gif" style={styles.typingDots} alt="typing" />
                                    </ListItem>
                                }
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
                                this.isTyping();
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
        num_active_connections: state.appReducer.num_active_connections,

        selected_organisation_id: state.appReducer.selected_organisation_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Operator);

