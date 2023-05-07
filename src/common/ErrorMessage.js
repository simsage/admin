import React from 'react';


export default function ErrorMessage( {error_title, error_text, handleClose} ){

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel" title={error_title}>{error_title}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    title="close this error message" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span title={error_text}
                                    className="label-wide">{error_text}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" title="close this error message"
                                    className="btn btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}