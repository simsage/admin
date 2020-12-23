import React, {Component} from 'react';

import {ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import uiTheme from "../theme-ui";
import Grid from '@material-ui/core/Grid';

import Api from '../common/api'
import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';

const queryString = require('query-string');

const styles = {
    input: {
        width: '350px'
    },
    page: {
        textAlign: 'center',
        fontSize: '1.0em',
        fontFamily: 'Tahoma',
    },
    spacer: {
        height: '10px',
    }
};


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
            <div style={styles.page}>
                <ThemeProvider theme={uiTheme}>

                    <AppMenu title="" loggedIn={false} />

                    <ErrorDialog title={this.state.error_title}
                                 message={this.state.error_msg}
                                 callback={this.closeError.bind(this)} />

                    <Grid container spacing={1}>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Enter your email Address"
                                label="Email Address"
                                style={styles.input}
                                value={this.state.email}
                                onChange = {(event) => this.setState({email: event.target.value})} />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Enter the reset-id we sent you"
                                label="Reset Id"
                                style={styles.input}
                                value={this.state.reset_id}
                                onChange = {(event) => this.setState({reset_id: event.target.value})} />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={12}><br /></Grid>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                type="password"
                                placeholder="Enter your new Password"
                                label="Enter your new Password"
                                autoFocus={true}
                                style={styles.input}
                                onChange = {(event) => this.setState({password: event.target.value})}
                                onKeyPress = {this.onKeyPress.bind(this)}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={12}>
                            <div style={styles.spacer}>&nbsp;</div>
                        </Grid>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div>
                                <Button variant="contained" className="button-style"
                                              onClick={(event) => this.handleClick(event)}>
                                    Reset Password
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={12}><br /></Grid>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div className="sign-in-help-text">Click here to return to sign-in</div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div>
                                <Button variant="contained" className="button-style" onClick={() => window.location = '/'}>
                                    Return to Sign-in
                                </Button>
                            </div>
                        </Grid>
                        <Grid item xs={3} />

                    </Grid>

                </ThemeProvider>
            </div>
        );
    }
}

export default ResetPasswordResponse;
