import React from 'react';
import Button from "@material-ui/core/Button";

import {Comms} from "./comms"

const styles = {
    uploadContainer: {
        margin: '10px',
        width: '450px',
        minWidth: '450px',
        height: '40px',
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
    },
    uploadControl: {
        marginTop: '5px',
        float: 'left',
    },
    uploadButton: {
        float: 'left',
        height: '30px',
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

export class ProgramConvert extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            file_type: '',
            filter: '',
            binary_data: null,
            uploading: false,
            pageSize: 10,

            kbId: props.kbId,
            organisationId: props.organisationId,

            onUploadDone: props.onUploadDone,
            onError: props.onError,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({filter: nextProps.filter, kbId: nextProps.kbId});
        }
    }

    _handleImageChange(e) {
        e.preventDefault();

        const self = this;
        const reader = new FileReader();
        const file = e.target.files[0];
        const filename = file['name'];
        const file_type = file['type'];

        reader.onloadend = () => {
            self.setState({
                filename: filename,
                file_type: file_type,
                binary_data: reader.result
            });
        };
        reader.readAsDataURL(file)
    }

    upload() {
        const self = this;
        if (this.state.binary_data) {
            self.setState({uploading: true});
            const payload = {
                base64Text: this.state.binary_data,
                fileType: this.state.file_type,
                kbId: this.state.kbId,
                organisationId: this.state.organisationId,
            };
            Comms.http_put('/knowledgebase/convert/spreadsheet', payload,
                (response) => {
                        self.setState({uploading: false});
                        if (self.state.onUploadDone) {
                            self.state.onUploadDone(response.data);
                        }
                    },
                (errorStr) => {
                    self.setState({uploading: false});
                    console.log(errorStr);
                    if (self.state.onError) {
                        self.state.onError(errorStr);
                    }
                }
            );
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
                                <Button variant='contained'
                                        color='primary'
                                        style={styles.uploadButton}
                                        disabled={this.state.binary_data === null || this.state.uploading}
                                        onClick={this.upload.bind(this)}>convert</Button>
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

export default ProgramConvert;
