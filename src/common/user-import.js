import React, {Component} from 'react';

import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {appCreators} from "../actions/appActions";

import '../css/spreadsheet-upload.css';


export class UserImport extends Component {
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
        if (this.state.binary_data && this.props.uploadUsers) {
            const payload = {
                base64Text: this.state.binary_data,
                fileType: this.state.file_type,
            };
            this.props.uploadUsers(payload);
            if (this.props.onUploadDone) {
                this.props.onUploadDone();
            }
        }
    }

    render() {
        return (
            <div className="spreadsheet-upload">
                <div>
                    <input className="upload-control-position"
                           type="file"
                           onChange={(e) => this._handleImageChange(e)}/>
                    <div className="upload-button">
                        <div className="upload-input" title={"user-import csv (with header) format:\nfirstname,surname,email,\"group1,group2\",\"DMS,ADMIN\""}>
                            <button className="btn btn-primary btn-block"
                                    disabled={this.state.binary_data === null || this.props.uploading}
                                    onClick={this.upload.bind(this)}>import csv</button>
                            {this.props.uploading &&
                            <div className="upload-wheel"><img src="images/busy2.gif" alt="busy" className="busy-image" /></div>
                            }
                            <span className="help-button">
                                <img className="help-button-img" src="images/help.svg" alt="help" />
                            </span>
                        </div>
                    </div>
                </div>
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
)(UserImport);

