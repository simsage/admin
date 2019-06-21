import React, { Component } from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import uiTheme from "../theme-ui";
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

import AppMenu from './app-menu'
import ErrorDialog from '../common/error-dialog';


const styles = {
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
    licenseAgreementArea: {
        marginTop: '10px',
    },
    licenseAgreementTitle: {
        fontSize: '1.0em',
        color: '#888',
        marginBottom: '10px',
    },
    licenseAgreementIAgree: {
        display: 'inline',
    },
    licenseAgreementLink: {
        display: 'inline',
        color: '#000',
        cursor: 'pointer',
    }
};


export class Register extends Component {
    constructor(props){
        super(props);
        this.state={

            firstname: '',
            surname: '',
            username: '',
            email: '',
            password: '',
            organisationName: '',

            agree: false,  // agree to the license?

            error_title: '',
            error_msg: '',

            info_title: '',
            info_msg: '',

            has_error: false,  // error trapping
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleClick(event){
        const self = this;
        if (!this.state.agree) {
            this.showError('Terms of Service', 'you must agree with our terms of service to use SimSage.  Please read our terms of service and check "I agree"');
        }
        //To be done:check for empty values before hitting submit
        else if (this.state.firstname.length > 0 && this.state.surname.length > 0 && this.state.email.length > 0 &&
            this.state.password.length > 0 && this.state.organisationName.length > 0) {
            const payload={
                "email":this.state.email,
                "firstName": this.state.firstname,
                "surname": this.state.surname,
                "password":this.state.password,
                "organisationName": this.state.organisationName,
            };
            http_post('/create-account', payload,
                (response) => {
                    if(response.data && response.data.email) {
                        self.showInfo("Account Creation Successful", "your knowledgeBase account has been created.  " +
                                      "You can now sign in using your new account.");
                        //self.props.history.push('/home');
                    } else {
                        self.showError('Error', response.data.error);
                    }
                },
                (error) => {
                    self.showError('Error', error);
                }
            );
        }
        else {
            console.log('doh!');
            this.showError('Error', 'please complete and check all fields');
        }
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    showInfo(title, msg) {
        this.setState({info_title: title, info_msg: msg});
    }
    gotoLogin() {
        this.setState({info_msg: ''});
        this.props.history.push('/sign-in');
    }
    render() {
        if (this.state.has_error) {
            return <h1>Register: Something went wrong.</h1>;
        }
        return (
            <div style={styles.page}>
                <MuiThemeProvider theme={uiTheme}>
                    <AppMenu title="administration" />

                    <ErrorDialog title={this.state.error_title}
                                 message={this.state.error_msg}
                                 callback={this.closeError.bind(this)} />
                    <ErrorDialog title={this.state.info_title}
                                 message={this.state.info_msg}
                                 callback={this.gotoLogin.bind(this)} />

                    <Grid container spacing={16}>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <p>Create your SimSage account</p>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                autoFocus
                                placeholder="First Name"
                                label="First Name"
                                onChange = {(event) => this.setState({firstname: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Surname"
                                label="Surname"
                                onChange = {(event) => this.setState({surname: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Organisation Name"
                                label="Organisation Name"
                                onChange = {(event) => this.setState({organisationName: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                placeholder="Email Address"
                                label="Email Address"
                                onChange = {(event) => this.setState({email: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <TextField
                                type = "password"
                                placeholder="Password"
                                label="Password"
                                onChange = {(event) => this.setState({password: event.target.value})}
                            />
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.licenseAgreementTitle}>
                                <Checkbox
                                    checked={this.state.agree}
                                    onChange={(event) => {this.setState({agree: event.target.checked})}}
                                    value="I agree to the terms of service"
                                />
                                <div style={styles.licenseAgreementIAgree}>I agree to the&nbsp;</div>
                                <div style={styles.licenseAgreementLink} onClick={() => window.open("/#/license-agreement", "_blank")}>terms of service</div>
                            </div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" className="button-style"
                                    onClick={(event) => this.handleClick(event)}>Submit</Button>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div className="sign-in-help-text">already have an account?</div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div>
                                <Button variant="contained" onClick={() => window.location = "/#/sign-in"} className="button-style">Return to Sign-in</Button>
                            </div>
                        </Grid>
                        <Grid item xs={3} />

                    </Grid>

                </MuiThemeProvider>
            </div>
        );
    }
}

export default Register;
