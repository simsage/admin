import React from 'react';

import Operator from "./operator";

import {MAX_OPERATORS} from '../actions/actions';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import {PeopleIcon} from "../icons/people-icon";
import {PlusIcon} from "../icons/plus-icon";

import '../css/operator.css';


export class OperatorTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 1,
        };
    }
    componentDidCatch(error, info) {
        console.log(error, info);
        this.props.setError(error, info);
    }
    takeBreak(operator) {
        if (operator && operator.id) {
            const data = {
                sessionId: this.props.session.id,
                operatorId: operator.id,
                organisationId: this.props.selected_organisation_id,
                clientId: operator.client_id,
            };
            this.props.sendOperatorMessage('/ops/take-break', data);
            this.props.operatorReady(operator.id, false);
        }
    }
    render() {
        const dark = this.props.theme === 'light' ? "" : "-dark";
        return (
            <div className="operator-display">

                <div>
                    {
                        this.props.operators && this.props.operators.map((operator, index) => {
                            return (<span key={'tab' + (index + 1)} className={(index+1) === this.state.selectedTab ? "operator-tab-selected" + dark : "operator-tab" + dark}>
                                        <span title={'Conversation ' + (index+1)}
                                              onClick={()=> this.setState({selectedTab: index+1})}>{'Conversation ' + (index + 1)}
                                        </span>
                                        {index > 0 &&
                                        <span key={'tab_close' + (index + 1)} className="operator-close-conversation-button"
                                              title="Close and remove this conversation."
                                              onClick={() => {
                                                  this.takeBreak(operator);
                                                  this.setState({selectedTab: 1});
                                                  this.props.removeOperator(operator.id);
                                              }}>
                                                <span className="operator-close-conversation-text">&times;</span>
                                            </span>
                                        }
                                    </span>);
                        })
                    }
                </div>
                {
                    this.props.operators && this.props.operators.length < MAX_OPERATORS &&
                    <div className="add-button" onClick={() => this.props.addOperator()} title="add Chat">
                        <PlusIcon />
                        <span className="max-text">(Max {MAX_OPERATORS} chats)</span>
                        <span className="add-text">Add Chat&nbsp;</span>
                    </div>
                }

                <div className="kbName"><PeopleIcon /> <span className="bot_text">{this.props.num_active_connections} active users</span></div>


                {
                    this.props.operators && this.props.operators.map((operator, index) => {
                        if ((index + 1) === this.state.selectedTab) {
                            return (<Operator
                                    key={'display' + (index + 1)}
                                    operator={operator}
                                    isFirst={index === 0}
                                    onCloseTab={() => this.setState({selectedTab: 1})}
                                    openDialog={(message, title, callback) => this.props.openDialog(message, title, callback)}
                                    closeDialog={() => this.props.closeDialog()} />);
                        } else {
                            return (<div key={'display' + (index + 1)} />);
                        }
                    })
                }

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
        num_active_connections: state.appReducer.num_active_connections,
        selected_organisation_id: state.appReducer.selected_organisation_id,

        operators: state.appReducer.operators,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(OperatorTabs);

