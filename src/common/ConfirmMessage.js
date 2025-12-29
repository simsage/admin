import React from 'react';

export default function ConfirmMessage( {message, close} ){

    if (!message || message.length === 0) {
        return <div/>
    }

    /**
     * check if we need to sign-out or just close the message
     */
    const on_close = (apply) => {
        if (close) close(apply)
    }

    return (
        <div className="modal"  tabIndex="-1" role="dialog" style={{display: "inline", zIndex: 1061}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5rounded">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel" title={message}>Are you Sure?</h5>
                        <button onClick={() => on_close(false)} type="button" className="btn-close" data-bs-dismiss="modal"
                                title="close this message" aria-label="Close"></button>
                    </div>
                    <div className="modal-body overflow-hidden">
                        <div className="control-row">
                            <span title={message} className="label-wide">{message}</span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={() => on_close(false)} type="button" title="close this message"
                                className="btn btn-primary">
                            Cancel
                        </button>
                        <button onClick={() => on_close(true)} type="button" title="close this message"
                                className="btn btn-primary">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
