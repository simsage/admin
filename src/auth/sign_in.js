import React, {Component} from 'react';

import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';
import {clearState} from '../reducers/stateLoader';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/sign-in.css';


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
            window.location = '/#/home';
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
                <AppMenu signed_in={false} />
                <ErrorDialog title={this.props.error_title}
                             theme={this.props.theme}
                             message={this.props.error}
                             callback={() => this.props.closeError()} />

                {
                    this.props.busy &&
                    <div className={this.props.theme === 'light' ? "busy" : "busyDark"} />
                }


                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <div>
                            <h3>Sign In</h3>

                            <div className="form-group">
                                <label>Email address</label>
                                <input type="email" className="form-control" placeholder="Enter email" autoFocus={true}
                                       value={this.state.email}
                                       onKeyPress={(event) => this.onKeyPress(event)}
                                       onChange = {(event) => this.setState({email: event.target.value}) }
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Enter password"
                                       value={this.state.password}
                                       onKeyPress={(event) => this.onKeyPress(event)}
                                       onChange = {(event) => this.setState({password: event.target.value}) }
                                />
                            </div>

                            <div className="form-group spacer-height">
                            </div>

                            <button type="submit" className="btn btn-primary btn-block" onClick={() => this.handleClick()}>Submit</button>

                            <p className="forgot-password text-right">
                                Forgot <span className="forgot-password-link" onClick={() => window.location = '/#/reset-password-request'}>password?</span>
                            </p>

                            <p className="forgot-password text-right">
                                <span className="forgot-password-link" onClick={() => window.location = '/#/foss-license'}>open-source licenses</span>
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
