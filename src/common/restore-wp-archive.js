import React from 'react';

const styles = {
    uploadContainer: {
        float: 'left',
        width: '90%',
        minWidth: '90%',
        padding: '1px',
        marginLeft: '10px',
        background: 'white',
        display: 'inline-block',
        fontWeight: 700,
        fontSize: '10pt',
        cursor: 'pointer',
    },
    formWidth: {
        marginTop: '-20px',
        float: 'left',
    },
    uploadControl: {
        marginTop: '10px',
        float: 'left',
    },
    imageButton: {
        float: 'left',
        marginLeft: '10px',
        paddingTop: '10px',
        color: '#888',
        cursor: 'pointer',
    },
    restoreImage: {
        width: '25px',
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
            <div>
                <form onSubmit={(e) => this._handleSubmit(e)} style={styles.uploadContainer}>
                    <div style={styles.formWidth}>
                        <input style={styles.uploadControl}
                               type="file"
                               onChange={(e) => this._handleImageChange(e)}/>
                        {
                            this.state.data && this.state.data.length > 0 && this.state.fileType === "application/zip" &&
                            <span style={styles.imageButton} onClick={() => this.upload()}><img
                                style={styles.restoreImage} src="../images/restore.svg"
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
