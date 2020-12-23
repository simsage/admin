import React, {Component} from 'react';

import {ThemeProvider} from '@material-ui/core/styles';
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
                <ThemeProvider theme={uiTheme}>

                    <AppMenu title="open source licenses" loggedIn={false} />

                    <ErrorDialog title={this.state.error_title}
                                 message={this.state.error_msg}
                                 callback={this.closeError.bind(this)} />

                    <br />
                    <br />

                    <Grid container spacing={2}>

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://github.com/JetBrains/kotlin-web-site/blob/master/LICENSE" rel="noopener noreferrer" target="_blank">Kotlin license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://github.com/JetBrains/kotlin-web-site/blob/master/LICENSE" rel="noopener noreferrer" target="_blank">Kotlinx Coroutines Core license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Spring license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Jackson license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://github.com/JodaOrg/joda-time/blob/master/LICENSE.txt" rel="noopener noreferrer" target="_blank">Joda-time license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">commons-io license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">commons-fileupload license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache http-client license</a></div>
                        </Grid>
                        <Grid item xs={1} />


                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache http-mime license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://github.com/explosion/spaCy/blob/master/LICENSE" rel="noopener noreferrer" target="_blank">spaCy license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Tika license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Google API license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Google Cloud license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Google OAuth license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.isc.org/licenses/" rel="noopener noreferrer" target="_blank">jBcrypt license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.datastax.com/terms/datastax-dse-driver-license-terms" rel="noopener noreferrer" target="_blank">DataStax Driver license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Cassandra license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache ActiveMQ license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://oss.oracle.com/licenses/CDDL+GPL-1.1" rel="noopener noreferrer" target="_blank">javax-mail license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://junit.org/junit4/license.html" rel="noopener noreferrer" target="_blank">junit license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://jsoup.org/license" rel="noopener noreferrer" target="_blank">jSoup license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">snakeyaml license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html" rel="noopener noreferrer" target="_blank">javax WebSocket Client license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.eclipse.org/legal/epl-2.0/" rel="noopener noreferrer" target="_blank">Tyrus WebSocket Client license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">snappy java license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Spark license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Avro license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Parquet license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Apache Hadoop license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.apache.org/licenses/LICENSE-2.0.html" rel="noopener noreferrer" target="_blank">Java Native Access license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://opensource.org/licenses/lgpl-license" rel="noopener noreferrer" target="_blank">JCIFS-ng license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://mit-license.org/" rel="noopener noreferrer" target="_blank">Microsoft SQL JDBC license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://opensource.org/licenses/BSD-2-Clause" rel="noopener noreferrer" target="_blank">Postgres SQL JDBC license</a></div>
                        </Grid>
                        <Grid item xs={5}>
                            <div style={styles.link}><a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html" rel="noopener noreferrer" target="_blank">MySQL JDBC license</a></div>
                        </Grid>
                        <Grid item xs={1} />

                        <Grid item xs={1} />
                        <Grid item xs={10}>
                            <div style={styles.bottomLink}>
                                <Button variant="contained" onClick={() => window.location = "/"} className="button-style">Return to Sign-in</Button>
                            </div>
                        </Grid>
                        <Grid item xs={1} />

                    </Grid>

                </ThemeProvider>
            </div>
        );
    }
}

export default OpenSourceLicenses;
