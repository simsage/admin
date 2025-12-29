import React from "react";

export function ShowInvalidSession(props) {

    const show_alert = props.show_alert;
    const message = props.message;
    const title = props.title;


    function handleClose(){
        props.onClick();
    }

    if (!show_alert)
        return (<div />);
    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5rounded">

                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                        <button onClick={handleClose} type="button" className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <table>
                                <tbody>

                                <tr>
                                    <td className="id-width">{message}</td>
                                </tr>
                                </tbody>

                            </table>
                        </div>

                    </div>
                    <div className="modal-footer">
                        <button onClick={handleClose} type="button" className="btn btn-secondary"
                                data-bs-dismiss="modal">Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}