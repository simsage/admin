import React, { Component } from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import uiTheme from "../theme-ui";
import Grid from '@material-ui/core/Grid';

import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog'
import State from '../common/state'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { appCreators } from "../actions/appActions";


const styles = {
    hr: {
        color: '#eee',
        background: '#eee',
        width: '30%',
        height: '1px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '20px',
        marginBottom: '20px',
    },
    spinner: {
        position: 'relative',
        top: '-8px',
        left: '40px',
        width: '32px',
    },
    spinnerInvisible: {
        display: 'none',
        position: 'relative',
        top: '-8px',
        left: '40px',
        width: '32px',
    },
    page: {
        textAlign: 'center',
        fontSize: '1.0em',
        fontFamily: 'Tahoma',
    },
    recaptcha: {
        display: 'flex',
        justifyContent: 'center',
        width: "100%"
    },
    passwordText: {
        marginBottom: '10px',
    },
    helpText: {
        marginTop: '10px',
        fontSize: '0.9em',
        color: '#555',
        marginBottom: '2px',
    },
    copyright: {
        position: 'absolute',
        bottom: '0px',
        height: '25px',
        widht: '100%',
        color: '#aaa',
        fontSize: '0.8em',
        left: '40%',
    },
    license: {
        marginTop: '20px',
    },
    busy: {
        display: 'block',
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: '9999',
        borderRadius: '10px',
        opacity: '0.8',
        backgroundSize: '100px',
        background: "url('../images/busy.gif') 50% 50% no-repeat rgb(255,255,255)"
    },

};

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
        State.clearAll();
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    handleClick() {
        this.props.signIn(this.state.email, this.state.password);
    }
    onKeyPress(event) {
        if (event.key === "Enter") {
            this.handleClick();
        }
    }
    render() {
        return (
            <div style={styles.page}>
                <MuiThemeProvider theme={uiTheme}>
                    <div>
                        <AppMenu title="administration" signed_in={false} />
                        <ErrorDialog title={this.props.error_title}
                                     message={this.props.error}
                                     callback={() => this.props.closeError()} />

                        {
                            this.props.busy &&
                            <div style={styles.busy} />
                        }

                        <Grid container spacing={1}>

                            <Grid item xs={12}>
                                <div style={styles.hr}/>
                            </Grid>

                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <TextField
                                    disabled={this.props.busy}
                                    autoFocus
                                    placeholder="Enter your email"
                                    label="email"
                                    onChange = {(event) => this.setState({email: event.target.value})}
                                    onKeyPress = {this.onKeyPress.bind(this)}
                                />
                            </Grid>
                            <Grid item xs={3} />


                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <TextField
                                    disabled={this.props.busy}
                                    type="password"
                                    placeholder="Enter your Password"
                                    label="Password"
                                    onChange = {(event) => this.setState({password: event.target.value})}
                                    onKeyPress = {this.onKeyPress.bind(this)}
                                    style={styles.passwordText}
                                />
                            </Grid>
                            <Grid item xs={3} />

                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <Button variant="contained" color="primary" className="button-style"
                                              disabled={this.props.busy} onClick={() => this.handleClick()}>Sign-in
                                </Button>
                            </Grid>
                            <Grid item xs={3} />

                            <Grid item xs={12}>
                                <div style={styles.hr}/>
                            </Grid>

                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <div style={styles.helpText}>forgotten your password?</div>
                            </Grid>
                            <Grid item xs={3} />


                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <Button variant="contained" onClick={() => window.location = '/#/reset-password-request'}
                                        disabled={this.props.busy}  className="button-style">Reset my Password</Button>
                            </Grid>
                            <Grid item xs={3} />


                            <Grid item xs={12} />

                            <Grid item xs={3} />
                            <Grid item xs={6}>
                                <div style={styles.license}>
                                    <Button variant="contained" onClick={() => window.location = '/#/os-license'}
                                            disabled={this.props.busy} className="button-style">open source licenses</Button>
                                </div>
                            </Grid>
                            <Grid item xs={3} />

                        </Grid>

                    </div>
                </MuiThemeProvider>
            </div>
        );
    }

}



const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(SignIn);
