import React, {Component} from 'react';

import {ThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import uiTheme from "../theme-ui";
import Grid from '@material-ui/core/Grid';

import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';


const styles = {
    page: {
        textAlign: 'center',
        fontSize: '1.0em',
        fontFamily: 'Tahoma',
    },
};


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
            <div style={styles.page}>
                <ThemeProvider theme={uiTheme}>

                    <AppMenu title="administration" loggedIn={false} />

                    <ErrorDialog title={this.state.error_title}
                                 message={this.state.error_msg}
                                 callback={this.closeError.bind(this)} />

                    <Grid container spacing={3}>

                        <Grid item xs={12} />
                        <Grid item xs={12} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div className="sign-in-help-text">Please enter your email address and we'll email you a link to reset your password.</div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                placeholder="Enter your email Address"
                                label="Email Address"
                                onChange = {(event) => this.setState({email: event.target.value})} />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" className="button-style" onClick={(event) => this.handleClick(event)}>
                                Submit
                            </Button>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={12} />
                        <Grid item xs={12} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div className="sign-in-help-text">Click here to return to sign-in</div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div>
                                <Button variant="contained" onClick={() => window.location = '/'} className="button-style">Return to Sign-in</Button>
                            </div>
                        </Grid>
                        <Grid item xs={3} />

                    </Grid>

                </ThemeProvider>
            </div>
        );
    }
}

export default ResetPasswordRequest;
