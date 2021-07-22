import React, {Component} from 'react';

import {MuiThemeProvider} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {darkTheme, lightTheme} from "../theme-ui";
import Grid from '@material-ui/core/Grid';

import Api from '../common/api'
import AppMenu from './app-menu';
import ErrorDialog from '../common/error-dialog';
import {CssBaseline} from "@material-ui/core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";


const styles = {
    center: {
        textAlign: 'center',
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
        const theme = this.props.theme;
        return (
            <MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
                <CssBaseline />

                <AppMenu title="administration" loggedIn={false} />

                <ErrorDialog title={this.state.error_title}
                             theme={this.props.theme}
                             message={this.state.error_msg}
                             callback={this.closeError.bind(this)} />

                <Grid container spacing={3}>

                    <Grid item xs={12} />
                    <Grid item xs={12} />

                    <Grid item xs={3} />
                    <Grid item xs={6} style={styles.center}>
                        <div className="sign-in-help-text no-select">Please enter your email address and we'll email you a link to reset your password.</div>
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={3} />
                    <Grid item xs={6} style={styles.center}>
                        <TextField
                            autoFocus
                            placeholder="Enter your email Address"
                            label="Email Address"
                            onChange = {(event) => this.setState({email: event.target.value})} />
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={3} />
                    <Grid item xs={6} style={styles.center}>
                        <Button variant="contained" color="primary" className="button-style" onClick={(event) => this.handleClick(event)}>
                            Submit
                        </Button>
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={12} />
                    <Grid item xs={12} />

                    <Grid item xs={3} />
                    <Grid item xs={6} style={styles.center}>
                        <div className="sign-in-help-text no-select">Click here to return to sign-in</div>
                    </Grid>
                    <Grid item xs={3} />

                    <Grid item xs={3} />
                    <Grid item xs={6} style={styles.center}>
                        <div>
                            <Button variant="contained" onClick={() => window.location = '/#/'} className="button-style">Return to Sign-in</Button>
                        </div>
                    </Grid>
                    <Grid item xs={3} />

                </Grid>

            </MuiThemeProvider>
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
