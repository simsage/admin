import React from 'react';
import {Api} from '../common/api'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";



const styles = {
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
            license: {},
            licenseStr: '',
        };
    }
    componentDidCatch(error, info) {
        this.props.setError(error, info);
        console.log(error, info);
    }
    componentDidMount() {
        this.props.getLicense();
    }
    installLicense() {
        const licenseStr = this.state.licenseStr;
        if (licenseStr.length > 0) {
            this.props.installLicense(licenseStr);
        } else {
            this.props.setError("invalid license code", "invalid license code (empty)");
        }
    }
    render() {
        const license = this.props.license;
        return (
            <div style={styles.page}>

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
                    (!license || license.licenseId === undefined || license.licenseId === "") &&
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

const mapStateToProps = function(state) {
    return {
        error: state.appReducer.error,
        error_title: state.appReducer.error_title,

        license: state.appReducer.license,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(License);

