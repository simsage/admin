import React from 'react';

import OperatorTeach from "./operator-teach";
import OperatorPreviousAnswer from './operator-previous-answer'
import Home from '../home'
import Api from '../common/api'

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {MicrophoneIcon} from "../icons/microphone-icon";
import {CupIcon} from "../icons/cup-icon";
import {PersonCrossIcon} from "../icons/person-cross";
import {PersonIcon} from "../icons/person-icon";

import '../css/operator.css';


export class Operator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            operator_reply: '', // operator text
            last_time: 0,
        };
        this.messagesEndRef = React.createRef();
    }
    componentDidMount() {
        window.setInterval(() => this.checkClientTyping(), 1000);
    }
    componentDidCatch(error, info) {
        console.log(error, info);
        this.props.setError(error, info);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom();
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
            kbId: this.props.operator.client_kb_id,
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
        const theme = this.props.theme;
        var add_text = "";
        if (theme !== 'light') {
            add_text = "-dark";
        }
        if (item.is_simsage) {
            if (item.id === this.props.operator.answer_id || item.used) {
                return "operator-text-box-selected" + add_text;
            } else {
                return "operator-text-box" + add_text;
            }
        } else {
            if (item.id === this.props.operator.question_id || item.used) {
                return "user-text-selected" + add_text;
            } else {
                return "user-text" + add_text;
            }
        }
    }
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    render() {
        const isOperator = Home.hasRole(this.props.user, ['operator']);
        const active = this.props.operator.operator_ready && this.props.operator_connected && isOperator;
        const isReady = this.props.operator.operator_ready || !this.props.operator_connected;
        const has_user = this.props.operator.client_id && this.props.operator.client_id.length > 0;
        const operatorButtonStyle = this.props.theme === 'light' ? "operator-buttons-top" : "operator-buttons-top-dark";
        return (
            <div className="operator-display">
                <OperatorTeach
                    open={this.props.operator.question_id !== '' && this.props.operator.answer_id !== ''}
                    theme={this.props.theme}
                    question={this.props.operator.question}
                    onSave={(teach, links) => this.teachSimSage(teach, links)}
                    answer={this.props.operator.answer}
                    />

                <OperatorPreviousAnswer
                    open={this.props.operator.current_question !== '' && this.props.operator.prev_answer !== ''}
                    theme={this.props.theme}
                    question={this.props.operator.current_question}
                    onSave={(use) => this.usePreviousQuestion(use)}
                    answer={this.props.operator.prev_answer}
                />

                <div className={operatorButtonStyle}>
                    <button className="operator-button" disabled={isReady}
                            title={isReady ? "Disabled, click 'Break' top stop any conversations." : "Signal that you are ready to go and converse with customers."}
                            onClick={() => this.readyForChat()}>
                        <MicrophoneIcon />
                        <span className="operator-button-text">Ready</span>
                    </button>

                    <button className="operator-button" disabled={!active}
                            title={!active ? "Disabled, click Ready before you take a break." : "take a break, stop participating in conversations while you have a break."}
                            onClick={() => this.takeBreak()}>
                        <CupIcon />
                        <span className="operator-button-text">Break</span>
                    </button>

                    <button className="operator-button operator-button-margin-left" disabled={!has_user}
                            title={!has_user ? "Disabled, you aren't currently connected to any user." : "The current conversation is abusive or bad spirited, ban this user from the system."}
                            onClick={() => this.banUserConfirm()}>
                        <PersonCrossIcon />
                        <span className="operator-button-text">Ban User</span>
                    </button>

                    <button className="operator-button operator-button-margin-left" disabled={!has_user}
                            title={!has_user ? "Disabled, you aren't currently connected to any users." : "We have finished the current conversation and are ready for a next one."}
                            onClick={() => this.nextUser()}>
                        <PersonIcon />
                        <span className="operator-button-text">End Chat</span>
                    </button>

                    {
                        this.props.operator.client_kb_name && this.props.operator.client_kb_name.length > 0 &&
                        <div className="kb-name">{this.props.operator.client_kb_name}</div>
                    }


                </div>

                <div className="operator-conversation-area">
                    {this.props.operator.conversation_list.map((item) => {
                        return (
                            <div key={item.id} className={item.is_simsage ? "operator-box" : "user-box"} onClick={() => {if (active) this.selectForLearn(item)}}>
                                <div className={item.is_simsage ? "operator-line" : "user-line"}>
                                    <span className="user-label">{item.is_simsage ? "You" : "User"}</span>
                                    <span className="hyphen">-</span>
                                    <span className="time">{Api.unixTimeConvert(item.created)}</span>
                                </div>
                                <div className={this.getAvatarStyle(item)}>{item.primary}</div>
                            </div>
                        )
                    })}
                    {this.props.operator.is_typing &&
                        <div>
                        <img src="../images/dots.gif" className="typing-dots" alt="typing" />
                        </div>
                    }
                    <div ref={this.messagesEndRef} />
                </div>

                <div className="operator-reply-area">
                    <span className="operator-reply-text-box">
                        <input type="text"
                            title={!has_user ? "Disabled, you aren't in a chat with a user." : "Type your reply and press enter, or click the 'Reply' button."}
                            className="operator-reply-text"
                            onChange={(event) => this.setState({operator_reply: event.target.value})}
                            disabled={!has_user}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    this.operatorReply(this.state.operator_reply);
                                }
                                this.isTyping();
                            }}
                            value={this.state.operator_reply}
                        />
                    </span>
                    <span className="operator-reply-button-box">
                        <button disabled={!has_user} className="operator-button"
                                title={!has_user ? "Disabled, you aren't in a chat with a user." : "Send the text you've typed to the user (or press enter in the reply field)."}
                                onClick={() => this.operatorReply(this.state.operator_reply)}>
                            Reply
                        </button>
                    </span>
                </div>

            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        theme: state.appReducer.theme,

        session: state.appReducer.session,
        user: state.appReducer.user,

        operator_connected: state.appReducer.operator_connected,
        num_active_connections: state.appReducer.num_active_connections,

        selected_organisation_id: state.appReducer.selected_organisation_id,
    }
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(Operator);

