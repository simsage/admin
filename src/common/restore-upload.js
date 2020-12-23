import React from 'react';

const styles = {
    uploadContainer: {
        float: 'left',
        width: '400px',
        minWidth: '400px',
        // border: '1px solid lightgray',
        padding: '1px',
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
        marginTop: '10px',
    },
    imageButton: {
        float: 'left',
        marginRight: '20px',
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

    UNSAFE_componentWillReceiveProps(nextProps) {
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
            <div>
                <form onSubmit={(e) => this._handleSubmit(e)} style={styles.uploadContainer}>
                    <div style={styles.formWidth}>
                        {
                            this.state.data && this.state.data.length > 0 && this.state.fileType === "text/plain" &&
                            <div style={styles.imageButton} onClick={() => this.upload()}><img
                                style={styles.restoreImage} src="../images/restore.svg"
                                title={"Click here to restore data from \"" + this.state.filename + "\""}
                                alt="restore data from file"/></div>
                        }
                        <input style={styles.uploadControl}
                               type="file"
                               onChange={(e) => this._handleImageChange(e)}/>
                    </div>
                </form>
            </div>
        )
    }
}

export default RestoreUpload;
