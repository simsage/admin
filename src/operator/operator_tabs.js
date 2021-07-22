import React from 'react';

import Operator from "./operator";

import {MAX_OPERATORS} from '../actions/actions';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import {AddBox} from "@material-ui/icons";


const styles = {
    tab: {
        backgroundColor: '#ebebeb',
        color: '#000',
    },
    add_button: {
        float: 'right',
        marginTop: '-40px',
        marginRight: '200px',
    },
    add_button_size: {
        width: '32px',
        height: '32px',
    },
    add_text: {
        fontSize: '14px',
        marginTop: '4px',
        float: 'right',
    },
    max_text: {
        fontSize: '14px',
        marginTop: '4px',
        float: 'right',
        color: 'darkgray',
    },
    kbName: {
        float: 'right',
        marginTop: '-36px',
        right: '30px',
    },
    bot_image: {
        width: '24px',
        height: '24px',
    },
    bot_text: {
        float: 'right',
        fontSize: '12px',
        marginTop: '4px',
        marginLeft: '10px',
    }
};


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
            <div>

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
                    <div style={styles.add_button} onClick={() => this.props.addOperator()} title="add Chat">
                        <AddBox className="active-users-icon" />
                        <span style={styles.max_text}>(Max {MAX_OPERATORS} chats)</span>
                        <span style={styles.add_text}>Add Chat&nbsp;</span>
                    </div>
                }

                <div style={styles.kbName}><SupervisedUserCircleIcon className="active-users-icon" /> <span style={styles.bot_text}>{this.props.num_active_connections} active users</span></div>


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

