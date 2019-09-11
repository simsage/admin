import React, {Component} from 'react';
import Button from "@material-ui/core/Button";

import {Api} from "./api"

const styles = {
    uploadContainer: {
        margin: '10px',
        width: '450px',
        minWidth: '450px',
        // border: '1px solid lightgray',
        borderRadius: '15px',
        padding: '12px',
        marginLeft: '10px',
        background: 'white',
        fontWeight: 700,
        fontSize: '10pt',
        cursor: 'pointer',
    },
    formWidth: {
        marginTop: '-20px',
    },
    uploadControl: {
        marginTop: '5px',
        float: 'left',
    },
    uploadButton: {
        float: 'left',
    },
    busyImage: {
        width: '28px',
        height: '28px',
        marginTop: '-10px',
        float: 'left',
    },
    uploadInput: {
        float: 'left',
    },
    uploadWheel: {
        marginLeft: '5px',
        marginTop: '14px',
        height: '28px',
        float: 'left',
    },
};

export class RestoreUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            fileType: '',
            data: '',

            uploading: props.uploading,
            kbId: props.kbId,
            organisationId: props.organisationId,
            doUpload: props.doUpload,
            onError: props.onError,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            uploading: nextProps.uploading,
            kbId: nextProps.kbId,
            organisationId: nextProps.organisationId,
            doUpload: nextProps.doUpload,
            onError: nextProps.onError,
        });
    }

    _handleImageChange(e) {
        e.preventDefault();

        const self = this;
        const reader = new FileReader();
        const file = e.target.files[0];
        const filename = file['name'];
        const fileType = file['type'];

        reader.onloadend = () => {
            self.setState({
                filename: filename,
                fileType: fileType,
                data: reader.result
            });
        };
        reader.readAsDataURL(file)
    }

    upload() {
        const self = this;
        if (this.state.data) {
            const payload = {
                organisationId: this.state.organisationId,
                kbId: this.state.kbId,
                url: this.state.filename,
                fileType: this.state.fileType,
                data: this.state.data,
            };
            if (this.state.doUpload) {
                this.state.doUpload(payload);
            }
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={(e) => this._handleSubmit(e)} style={styles.uploadContainer}>
                    <div style={styles.formWidth}>
                        <input style={styles.uploadControl}
                               type="file"
                               onChange={(e) => this._handleImageChange(e)}/>
                        <div style={styles.uploadButton}>
                            <div style={styles.uploadInput}>
                                <Button variant='outlined'
                                        color='primary'
                                        style={styles.uploadButton}
                                        disabled={this.state.data.length === 0 || this.state.uploading}
                                        onClick={() => this.upload()}>Restore</Button>
                                {this.state.uploading &&
                                <div style={styles.uploadWheel}><img src="../images/busy2.gif" alt="busy" style={styles.busyImage}/></div>
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default RestoreUpload;
