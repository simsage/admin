import React, {Component} from 'react';

import '../css/common.css';

export class BackupDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            include: true,
            has_error: false,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    cancel() {
        if (this.props.callback) {
            this.props.callback(false, false);
        }
    }
    ok() {
        if (this.props.callback) {
            this.props.callback(true, this.state.include);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>backup-dialog.js: Something went wrong.</h1>;
        }
        if (!this.props.open) {
            return (<div />)
        }
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded message-dialog-height">

                        <div className="modal-header">{this.props.title}</div>
                        <div className="modal-body">
                            <div className="control-row">
                                <div>{this.props.message}</div>
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

export default BackupDialog;
