import React, {Component} from 'react';

import TextField from '@material-ui/core/TextField';

import Api from '../common/api';


const styles = {
    formContent: {
        marginTop: '20px',
        marginLeft: '20px',
    },
    textField: {
        marginRight: '10px',
        width: '700px',
    },
    dlText: {
        marginTop: '-2px',
        width: '150px',
        float: 'left',
    },
    manualBox: {
        float: 'right',
        marginRight: '100px',
    },
    manualImage: {
        float: 'left',
        width: '40px',
    },
};


export class CrawlerDropbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // dropbox properties
            clientToken: props.clientToken ? props.clientToken : '',
            folderList: props.folderList ? props.folderList : '',
            specific_json: props.specific_json,
        };

    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState(this.construct_data({tenantId: nextProps.tenantId,
                clientToken: Api.defined(nextProps.clientToken) ? nextProps.clientToken : '',
                folderList: Api.defined(nextProps.folderList) ? nextProps.folderList : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            }));
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            clientToken: Api.defined(data.clientToken) ? data.clientToken : this.state.clientToken,
            folderList: Api.defined(data.folderList) ? data.folderList : this.state.folderList,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dropbox.js: Something went wrong.</h1>;
        }
        return (
            <div style={styles.formContent}>
                <TextField
                    placeholder="client token"
                    label="client token"
                    value={this.state.clientToken}
                    onChange={(event) => {this.change_callback({clientToken: event.target.value})}}
                    style={styles.textField}
                />

                <div style={styles.manualBox}>
                    <a href="../resources/simsage-dropbox-setup.pdf" id="dlDropbox" target="_blank" title="download the SimSage Dropbox setup guide">
                        <div style={styles.dlText}>download Dropbox configuration instructions</div>
                        <img src="../images/pdf-icon.png" alt="dropbox setup guide" style={styles.manualImage}/></a>
                </div>

                <br />
                <br />

                <TextField
                    placeholder="specific folders to crawl (separated by commas), leave empty to crawl all."
                    label="specific folders to crawl (separated by commas), leave empty to crawl all."
                    multiline={true}
                    rows={5}
                    value={this.state.folderList}
                    onChange={(event) => {this.change_callback({folderList: event.target.value})}}
                    style={styles.textField}
                />
                <br />

            </div>
        );
    }
}

export default CrawlerDropbox;
