import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';

import system_config from "../settings";
import {State} from "../common/state";

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
    logo: {
        float: 'left',
        width: '140px',
    },
    projectTitle: {
        fontSize: '1.1em',
        float: 'left',
        marginLeft: '50px',
        marginTop: '25px',
        color: '#888',
    },
    homeImageContainer: {
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
    }
};


export class AppMenu extends Component {
    constructor(props){
        super(props);

        this.state={
            title: props.title,
            showDocumentation: window.location.toString().indexOf('/#/documentation') < 0,
        };
    }
    goWeb() {
        window.location = system_config.web_base;
    }
    render() {
        return (
            <div style={styles.background}>
                <Grid container spacing={24}>
                    <Grid item xs={1}>
                        <img alt="SimSage" title="SimSage: breathe life into your data." style={styles.logo} src="../images/simsage-logo.svg" onClick={() => this.goWeb()} />
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={4}>
                        <span style={styles.projectTitle}>{this.state.title}</span>
                    </Grid>
                    <Grid item xs={5} />
                    <Grid item xs={1}>
                        {
                            !State.isSignedIn() &&
                            <div style={styles.homeImageContainer}>
                                <img src="../images/home.svg" alt="home" title="home" onClick={() => this.goWeb()}
                                     style={styles.homeImage}/>
                                 <div style={styles.versionText}>version {system_config.version}</div>
                            </div>
                        }
                        {
                            State.isSignedIn() &&
                            <div style={styles.signOutImageContainer}>
                                <img src="../images/sign-out.svg" alt="sign-out" title="sign-out" onClick={() => State.signOut()} style={styles.signOutImage}/>
                            </div>
                        }
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default AppMenu;
