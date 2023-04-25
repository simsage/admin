import React from 'react';


export default function AlertBox( {title, message, handleClose, handleOk} ){

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">{message}?</span>
                            </div>

                            <div className="control-row">
                                <button onClick={ handleClose } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Close</button>
                                <button onClick={ handleOk } type="button" className="btn btn-danger px-4">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}