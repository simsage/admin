import React, {Component} from 'react';

import Api from '../common/api'
import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/sign-in.css';


export class ResetPasswordRequest extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',

            error_title: '',
            error_msg: '',

            has_error: false,  // error trapping
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleClick(event) {
        const self = this;
        //To be done:check for empty values before hitting submit
        if(this.state.email.length > 0) {
            Api.passwordResetRequest(this.state.email,
                (response) => {
                    self.showError('Success', "we've emailed you a link for resetting your password.");
                },
                (error) => {
                    self.showError('Error', error);
                }
            );
        }
        else{
            this.showError('Error', 'Input field value is missing');
        }
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    render() {
        if (this.state.has_error) {
            return <h1>ResetPasswordRequest: Something went wrong.</h1>;
        }
        return (
            <div>

                <AppMenu title="administration" loggedIn={false} />

                <ErrorDialog title={this.state.error_title}
                             theme={this.props.theme}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)} />

                <div>

                    <div className="auth-wrapper">
                        <div className="auth-inner">
                            <div>
                                <h3>Reset Password</h3>

                                <div>Please enter your email address and we'll email you a link to reset your password.</div>
                                <br />

                                <div className="form-group">
                                    <input type="text" className="form-control"
                                        autoFocus
                                        placeholder="Enter your email Address"
                                        onChange = {(event) => this.setState({email: event.target.value})} />
                                </div>

                                <div className="form-group submit-adjust">
                                    <button className="btn btn-primary btn-block" onClick={(event) => this.handleClick(event)}>
                                        Submit
                                    </button>
                                </div>

                                <p className="forgot-password text-right">
                                    Click here to return to <span className="forgot-password-link" onClick={() => window.location = '/#/'}>sign-in</span>
                                </p>

                            </div>
                        </div>
                    </div>

                </div>

            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        theme: state.appReducer.theme,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(ResetPasswordRequest);
