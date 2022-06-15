import React from 'react';

// display error dialog
export class ErrorDialog extends React.Component {
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
        console.log(error, info);
    }
    handleOk() {
        this.setState({open: false});
        if (this.state.callback) {
            this.state.callback();
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null && nextProps.message) {
            this.setState({
                open: (nextProps.message.length > 0),
                message: nextProps.message,
                title: nextProps.title
            })
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>error-dialog.js: Something went wrong.</h1>;
        }
        if (!this.state.open) {
            return (<div />)
        }
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", zIndex: "9999"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <div>{this.state.title}</div>
                        </div>
                        <div className="modal-body">
                            <div>
                                {this.state.message}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary btn-block" onClick={() => this.handleOk()}>Ok</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
};

export default ErrorDialog;
