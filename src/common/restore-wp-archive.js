import React from 'react';

import '../css/restore-wp-archive.css'


export class RestoreWPArchive extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filename: '',
            fileType: '',
            data: '',
            organisationId: props.organisationId,
            kbId: props.kbId,
            sourceId: props.sourceId,
            onError: props.onError,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            organisationId: nextProps.organisationId,
            kbId: nextProps.kbId,
            sourceId: nextProps.sourceId,
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
                kbId: this.state.kbId,
                sid: "",
                sourceId: this.state.sourceId,
                data: this.state.data,
            };
            if (this.props.doUpload) {
                this.props.doUpload(payload);
            }
        }
    }

    render() {
        return (
            <div className="restore-wp">
                <form onSubmit={(e) => this._handleSubmit(e)} className="upload-container">
                    <div className="form-width">
                        <input className="upload-control"
                               type="file"
                               onChange={(e) => this._handleImageChange(e)}/>
                        {
                            this.state.data && this.state.data.length > 0 && this.state.fileType === "application/zip" &&
                            <span className="image-button" onClick={() => this.upload()}><img
                                className="image-size" src="images/restore.svg"
                                title={"Click here to upload WordPress Archive \"" + this.state.filename + "\""}
                                alt="restore data from file"/></span>
                        }
                    </div>
                </form>
            </div>
        )
    }
}

export default RestoreWPArchive;
