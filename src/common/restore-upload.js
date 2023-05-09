import React from 'react';

import '../css/restore-upload.css';

export class RestoreUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            fileType: '',
            data: '',
            organisationId: props.organisationId,
            onError: props.onError,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, futureProps) {
        this.setState({
            organisationId: nextProps.organisationId,
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
        if (this.state.data) {
            const payload = {
                organisationId: this.state.organisationId,
                data: this.state.data,
            };
            if (this.props.doUpload) {
                this.props.doUpload(payload);
            }
        }
    }

    render() {
        return (
            <div className="restore-upload">
                <form onSubmit={(e) => this._handleSubmit(e)} className="upload-container">
                    <div className="form-offset">
                        {
                            this.state.data && this.state.data.length > 0 && this.state.fileType === "text/plain" &&
                            <div className="restore-image-button" onClick={() => this.upload()}><img
                                className="image-size" src="images/restore.svg"
                                title={"Click here to restore data from \"" + this.state.filename + "\""}
                                alt="restore data from file"/></div>
                        }
                        <input className="upload-margin"
                               type="file"
                               onChange={(e) => this._handleImageChange(e)}/>
                    </div>
                </form>
            </div>
        )
    }
}

export default RestoreUpload;
