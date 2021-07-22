import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';

import {Switch} from "@material-ui/core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    background: {
        margin: '5px',
        backgroundColor: '#fefefe',
        padding: '15px',
        height: '55px',
        fontFamily: 'Tahoma',
        fontWeight: '500',
        color: '#888',
        borderRadius: '4px',
    },
    logo_box: {
        position: 'absolute',
        left: '10px',
        top: '10px'
    },
    logo: {
        float: 'left',
        width: '200px',
    },
    projectTitle: {
        fontSize: '1.1em',
        float: 'left',
        marginLeft: '50px',
        marginTop: '25px',
    },
    homeImageContainer: {
        float: 'left',
    },
    themeSelect: {
        marginRight: '20px',
        marginTop: '4px',
        float: 'left',
    },
    themeSelectLoggedIn: {
        marginTop: '-10px',
        marginRight: '10px',
        float: 'left',
    },
    homeImage: {
        width: '32px',
    },
    signOutImageContainer: {
        paddingTop: '5px',
    },
    signOutImage: {
        width: '22px',
    },
    bookButton: {
        float: 'right',
        marginRight: '20px',
    },
    bookImage: {
        width: '32px',
    },
    versionText: {
        fontSize: '0.8em',
        marginLeft: '-20px',
    }
};


export class AppMenu extends Component {
    constructor(props){
        super(props);

        this.state={
            title: props.title,
            signed_in: props.signed_in,
            showDocumentation: window.location.toString().indexOf('/#/documentation') < 0,
        };
    }
    componentDidMount() {
        if (this.props.theme === 'light') {
            document.getElementById('ss-body').className = 'light';
        } else {
            document.getElementById('ss-body').className = 'dark';
        }
    }
    goWeb() {
        window.location = window.ENV.web_base;
    }
    signOut() {
        this.props.signOut();
        window.location = "/#/";
    }
    // get the right logo file depending on the theme
    getLogo() {
        if (this.props.theme === 'dark') {
            return "../images/simsage-logo-white-no-strapline.svg";
        }
        return "../images/simsage-logo-no-strapline.svg"; // default
    }
    flipTheme() {
        if (this.props.theme !== 'light') {
            this.props.setTheme('light');
            document.getElementById('ss-body').className = 'light';
        } else {
            this.props.setTheme('dark');
            document.getElementById('ss-body').className = 'dark';
        }
    }
    render() {
        const theme = this.props.theme;
        return (
            <div className={theme + " menu-padding no-select"}>
                <div style={styles.logo_box}>
                    <img alt="SimSage" title="Search less; find more." style={styles.logo} src={this.getLogo()} onClick={() => this.goWeb()} />
                </div>
                <Grid container spacing={1}>
                    <Grid item xs={2} />
                    <Grid item xs={4}>
                        <span style={styles.projectTitle}>{this.state.title}</span>
                    </Grid>
                    <Grid item xs={4} />
                    <Grid item xs={2}>
                        {
                            <div style={this.state.signed_in ? styles.themeSelectLoggedIn : styles.themeSelect}>
                                <Switch
                                    checked={this.props.theme === 'light'}
                                    onChange={() => this.flipTheme()}
                                    title="change the SimSage theme from dark to light or vice versa"
                                    color="primary"
                                    name="checkedTheme"
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </div>
                        }
                        {
                            !this.state.signed_in &&
                            <span style={styles.homeImageContainer}>
                                <img src={theme === 'light' ? "../images/home.svg" : "../images/home-light.svg"} alt="home" title="home" onClick={() => this.goWeb()}
                                     style={styles.homeImage}/>
                                 <div style={styles.versionText}>version {window.ENV.version}</div>
                            </span>
                        }
                        {
                            this.state.signed_in &&
                            <span style={styles.signOutImageContainer}>
                                <img src={theme === 'light' ? "../images/sign-out.svg" : "../images/sign-out-light.svg"} alt="sign-out" title="sign-out"
                                     onClick={() => { this.signOut() }} style={styles.signOutImage}/>
                            </span>
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    return {
        theme: state.appReducer.theme,
    }
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(AppMenu);
