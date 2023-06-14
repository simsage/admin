import React from "react";

const SourceTest = () => {

    const title = 'Testing';
    const message = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. A ad doloribus error ipsam non nulla perferendis ratione velit veritatis voluptate? Consequatur dolores doloribus ducimus excepturi laudantium, modi reiciendis ullam veniam.';

    const close = () => {

    }

    return (
        <div className="popover">
            <div className="popover" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel" title={title}>{title}</h5>
                            <button onClick={close} type="button" className="btn-close" data-bs-dismiss="modal"
                                    title="close this error message" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span title={message}
                                      className="label-wide">{message}</span>
                            </div>
                            <div className="control-row">
                                <span className="label-wide small text">Please try again. If the problem persists contact the SimSage Customer Support Team</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={close} type="button" title="close this error message"
                                    className="btn btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SourceTest;