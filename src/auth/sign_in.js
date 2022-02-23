import React, {Component} from 'react';

import ErrorDialog from '../common/error-dialog';
import {clearState} from '../reducers/stateLoader';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/sign-in.css';
import '../css/spinner.css';


// sign-in screen
export class SignIn extends Component {
    constructor(props) {
        super(props);

        this.state={
            email: '',
            password: '',
        }
    }
    componentDidMount() {
        clearState();
        this.props.notBusy();
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    handleClick() {
        this.props.signIn(this.state.email, this.state.password, () => {
            this.props.history.push("/home");
        });
    }
    onKeyPress(event) {
        if (event.key === "Enter") {
            this.handleClick();
        }
    }
    render() {
        return (
            <div>
                <ErrorDialog title={this.props.error_title}
                             theme={this.props.theme}
                             message={this.props.error}
                             callback={() => this.props.closeError()} />

            </div>
        );
    }

}

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
        busy: state.appReducer.busy,
        theme: state.appReducer.theme,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(SignIn);
