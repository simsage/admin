import React, {Component} from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/sign-in-error.css';

export class SignInError extends Component {
    tryAgain() {
        this.props.closeError();
        window.setTimeout(() => window.location="/", 500);
    }
    render() {
        const error = this.props.error ? this.props.error : "";
        const error_length = (error.length / 2) * 7;
        const error_left = (Math.round(window.innerWidth / 2) - error_length) + "px";
        if (error.toLowerCase().indexOf("cannot contact servers") > 0) {
            return (
                <div>
                    <div className="offset-top">
                        <div className="big-title-left">
                            <h1>An error occurred.</h1>
                        </div>
                        <div className="small-title-left">
                            <h3>the SimSage server is offline</h3>
                        </div>
                        <div className="sub-header clickable-cursor">
                            <span onClick={() => this.tryAgain()}>click here to try and connect again</span>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <div className="offset-top">
                        <div className="big-title-left">
                            <h1>An error occurred.</h1>
                        </div>
                        <div className="small-title-left">
                            <h3>You are not authorized to use this application.</h3>
                        </div>
                        <div style={{position: "absolute", left: error_left}}>
                            {this.props.error}
                        </div>
                    </div>
                </div>
            )
        }
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
)(SignInError);
