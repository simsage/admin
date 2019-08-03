import React from 'react';
import {Api} from '../common/api'
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";



const styles = {
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
    page: {
        width: '90%',
    },
    textStyle: {
        width: '90%',
        fontSize: '0.9em',
    },
    downloadButton: {
        marginTop: '20px',
        marginLeft: '370px',
    },
    row: {

    },
    header: {
        display: 'inline-block',
        fontSize: '0.95em',
        fontWeight: '600',
        width: '150px',
        marginBottom: '10px',
    },
    text: {
        display: 'inline-block',
        fontSize: '0.9em',
    },
};


export class License extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onError : props.onError,
            busy: false,
            license: {},
            licenseStr: '',
        };
    }
    componentDidMount() {
        this.getLicense();
    }
    componentDidCatch(error, info) {
    }
    getLicense() {
        this.setState({busy: true});
        Api.getLicense((license) => {
                this.setState({license: license, busy: false})
            },
            (errStr) => {
                this.setState({busy: false});
                if (this.state.onError) {
                    this.state.onError("error getting license", errStr);
                }
            })
    }
    installLicense() {
        const licenseStr = this.state.licenseStr;
        if (licenseStr.length > 0) {
            this.setState({busy: true});
            Api.installLicense(licenseStr, () => {
                    this.setState({licenseStr: ''});
                    this.getLicense();
                },
                (errStr) => {
                    this.setState({busy: false});
                    if (this.state.onError) {
                        this.state.onError("error installing license", errStr);
                    }
                })
        } else {
            if (this.state.onError) {
                this.state.onError("invalid license code","invalid (empty)");
            }
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>license.js: Something went wrong.</h1>;
        }
        const license = this.state.license;
        return (
            <div style={styles.page}>

                {
                    this.state.busy &&
                    <div style={styles.busy} />
                }

                {
                    license && license.licenseId && license.issuedTo &&
                        <div>
                            <div style={styles.row}>
                                <div style={styles.header}>licensed to</div>
                                <div style={styles.text}>{license.issuedTo}</div>
                            </div>
                            <div style={styles.row}>
                                <div style={styles.header}>license id</div>
                                <div style={styles.text}>{license.licenseId}</div>
                            </div>
                            <div style={styles.row}>
                                <div style={styles.header}>valid until</div>
                                <div style={styles.text}>{Api.unixTimeConvert(license.validUntil)}</div>
                            </div>
                        </div>
                }

                {
                    (license.licenseId === undefined || license.licenseId === "") &&
                    <div>
                        no license installed
                    </div>
                }

                <br />
                <br />

                <div style={styles.textStyle}>
                    <TextField
                        style={styles.textStyle}
                        autoFocus={true}
                        onChange={(event) => this.setState({licenseStr: event.target.value})}
                        placeholder="license code"
                        multiline={true}
                        rows={10}
                        variant="outlined"
                        fullWidth={true}
                        value={this.state.licenseStr}
                    />
                </div>

                <div style={styles.downloadButton}>
                    <Button variant="outlined" onClick={() => this.installLicense()}>install license</Button>
                </div>

            </div>
        )
    }
}

export default License;
