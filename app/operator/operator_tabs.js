import React from 'react';

import Operator from "./operator";

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';

import {MAX_OPERATORS} from '../actions/actions';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    add_button: {
        float: 'right',
        width: '20px',
        marginTop: '-40px',
    }
};


export class OperatorTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: '1',
        };
    }
    componentDidCatch(error, info) {
        console.log(error, info);
        this.props.setError(error, info);
    }
    render() {
        return (
            <div>

                <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                    {
                        this.props.operators && this.props.operators.map((operator, index) => {
                            return (<Tab label={'operator ' + (index + 1)} key={'tab' + (index + 1)} value={'' + (index + 1)} style={styles.tab} />);
                        })
                    }
                </Tabs>
                {
                    this.props.operators && this.props.operators.length < MAX_OPERATORS &&
                    <Button variant="contained" onClick={() => this.props.addOperator()}
                            title="add operator"
                            style={styles.add_button}>+</Button>
                }

                {
                    this.props.operators && this.props.operators.map((operator, index) => {
                        if ('' + (index + 1) === this.state.selectedTab) {
                            return (<Operator
                                    key={'display' + (index + 1)}
                                    operator={operator}
                                    isFirst={index === 0}
                                    onCloseTab={() => this.setState({selectedTab: '1'})}
                                    sendMessage={(endpoint, data) => this.props.sendMessage(endpoint, data)}
                                    openDialog={(message, title, callback) => this.props.openDialog(message, title, callback)}
                                    closeDialog={() => this.props.closeDialog()} />);
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

        session: state.appReducer.session,
        user: state.appReducer.user,

        operators: state.appReducer.operators,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(OperatorTabs);

