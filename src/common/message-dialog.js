import React, {Component} from 'react';

import '../css/common.css';

export class MessageDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: props.title,
            message: props.message,
            callback: props.callback,
            has_error: false,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    handleOk() {
        this.setState({open: false});
        if (this.state.callback) {
            this.state.callback(true);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        // see if we have data to start this dialog
        this.setState({
            open: (props.message.length > 0),
            message: props.message,
            callback: props.callback,
            title: props.title
        })
    }
    cancel() {
        if (this.state.callback) {
            this.state.callback(false);
        }
    }
    ok() {
        if (this.state.callback) {
            this.state.callback(true);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>message-dialog.js: Something went wrong.</h1>;
        }
        if (!this.state.open) {
            return (<div />)
        }
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded message-dialog-height">

                        <div className="modal-header">{this.state.title}</div>
                        <div className="modal-body">
                            <div>
                                <div dangerouslySetInnerHTML={{__html: this.state.message}} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.cancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.ok()}>OK</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default MessageDialog;
