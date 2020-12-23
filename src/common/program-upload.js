import React, {Component} from 'react';
import Button from "@material-ui/core/Button";

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

const styles = {
    uploadContainer: {
        margin: '10px',
        width: '450px',
        minWidth: '450px',
        height: '20px',
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

export class ProgramUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            file_type: '',
            filter: '',
            binary_data: null,
        };
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
        if (this.state.binary_data) {
            const payload = {
                base64Text: this.state.binary_data,
                fileType: this.state.file_type,
                kbId: this.props.selected_knowledgebase_id,
                organisationId: this.props.selected_organisation_id,
            };
            this.props.uploadProgram(payload);
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
                                        disabled={this.state.binary_data === null || this.props.uploading}
                                        onClick={this.upload.bind(this)}>upload</Button>
                                {this.props.uploading &&
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

const mapStateToProps = function(state) {
    return {
        uploading: state.appReducer.uploading,
        selected_organisation_id: state.appReducer.selected_organisation_id,
        selected_knowledgebase_id: state.appReducer.selected_knowledgebase_id,
    };
};

export default connect(
    mapStateToProps,
    dispatch => bindActionCreators(appCreators, dispatch)
)(ProgramUpload);

