import React, { Component } from 'react';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Button from '@material-ui/core/Button';
import uiTheme from "../theme-ui";
import Grid from '@material-ui/core/Grid';

import AppMenu from '../auth/app-menu';
import ErrorDialog from '../common/error-dialog';


const styles = {
    page: {
        fontSize: '1.0em',
        fontFamily: 'Tahoma',
    },

    content: {
        marginTop: '20px',
        marginLeft: '20%',
    },

    link: {
        texcolor: '#c0c0c0'
    },

    bottomLink: {
        textAlign: 'center',
        marginTop: '50px',
    },
};


export class OpenSourceLicenses extends Component {
    constructor(props){
        super(props);
        this.state={
            error_title: '',
            error_msg: '',
            has_error: false,  // error trapping
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    showError(title, error_msg) {
        this.setState({error_title: title, error_msg: error_msg});
    }
    closeError() {
        this.setState({error_msg: ''});
    }
    render() {
        if (this.state.has_error) {
            return <h1>license: Something went wrong.</h1>;
        }
        return (
            <div style={styles.page}>
                <MuiThemeProvider theme={uiTheme}>

                    <AppMenu title="open source licenses" loggedIn={false} />

                    <ErrorDialog title={this.state.error_title}
                                 message={this.state.error_msg}
                                 callback={this.closeError.bind(this)} />

                    <Grid container spacing={8}>

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://github.com/JetBrains/kotlin-web-site/blob/master/LICENSE" target="_blank">Kotlin license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Spring license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Jackson license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://hazelcast.org/" target="_blank">Hazelcast license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://github.com/JodaOrg/joda-time/blob/master/LICENSE.txt" target="_blank">Joda-time license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">commons-io license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">commons-fileupload license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache http-client license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache http-mime license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://github.com/explosion/spaCy/blob/master/LICENSE" target="_blank">spaCy license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Apache Tika license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Google API license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">Google Cloud license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.datastax.com/terms/datastax-dse-driver-license-terms" target="_blank">DataStax Driver license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://oss.oracle.com/licenses/CDDL+GPL-1.1" target="_blank">javax-mail license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://junit.org/junit4/license.html" target="_blank">junit license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://bouncycastle.org/licence.html" target="_blank">bouncycastle license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://jsoup.org/license" target="_blank">jsoup license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank">snakeyaml license</a></div>
                        </Grid>
                        <Grid item xs={3} />

                        <Grid item xs={3} />
                        <Grid item xs={6}>
                            <div style={styles.bottomLink}>
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

export default OpenSourceLicenses;
