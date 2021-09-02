import React, {Component} from 'react';

import Api from '../common/api'
import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/sign-in.css';

const queryString = require('query-string');


export class ResetPasswordResponse extends Component {
    constructor(props){
        super(props);

        const parsed = queryString.parse(props.location.search);

        let email = '';
        let reset_id = '';
        if (parsed['email']) {
            email = parsed['email'];
        }
        if (parsed['resetid']) {
            reset_id = parsed['resetid'];
        }

        this.state={
            email: email,
            reset_id: reset_id,
            password: '',

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
        if(this.state.email.length > 0 && this.state.reset_id.length > 0 && this.state.password.length > 5) {
            Api.resetPassword(this.state.email, this.state.password, this.state.reset_id,
                (response) => {
                    self.showError('Success', "Password reset.  You can now sign-in using your new password.");
                    self.setState({reset_id: '', email: '', password: ''});
                },
                (error) => {
                    self.showError('Error', error);
                }
            );
        }
        else{
            this.showError('Error', 'Input field value(s) missing or incorrect.');
        }
    }
    onKeyPress(event) {
        if (event.key === "Enter") {
            this.handleClick(event);
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
            return <h1>ResetPasswordResponse: Something went wrong.</h1>;
        }
        return (
            <div>

                <AppMenu title="" loggedIn={false} />

                <ErrorDialog title={this.state.error_title}
                             theme={this.props.theme}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)} />

                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h3>Reset Password</h3>

                            <form>
                                <input type="text" className="form-control margin-bottom"
                                       placeholder="Enter your email Address"
                                       autoComplete={false}
                                        value={this.state.email}
                                        onChange = {(event) => this.setState({email: event.target.value})} />
                            </form>

                            <form>
                                <input type="text" className="form-control margin-bottom"
                                        placeholder="Enter the reset-id we sent you"
                                        autoComplete={false}
                                        value={this.state.reset_id}
                                        onChange = {(event) => this.setState({reset_id: event.target.value})} />
                            </form>

                            <form>
                                <input type="password" className="form-control margin-bottom"
                                        placeholder="Enter your new Password"
                                        autoFocus={true}
                                        autoComplete={false}
                                        onChange = {(event) => this.setState({password: event.target.value})}
                                        onKeyPress = {this.onKeyPress.bind(this)} />
                            </form>

                            <div>
                                <button className="btn btn-primary btn-block"
                                              onClick={(event) => this.handleClick(event)}>
                                    Reset Password
                                </button>
                            </div>

                            <p className="forgot-password text-right">
                                Click here to return to <span className="forgot-password-link" onClick={() => window.location = '/#/'}>sign-in</span>
                            </p>

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
)(ResetPasswordResponse);
