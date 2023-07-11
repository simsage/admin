export default function ShowErrorForm(props){

    const show_error_form = props.show_error_form
    const error = props.error

    const handleClose = () => {
        // alert("alert called")
        props.closeForm();
    }



    if (!show_error_form)
        return (<div />);
    return(
        <div className="org_error">
            <div className="modal" tabIndex="1" role="dialog" style={{display: "inline", zIndex: 2}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Error</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{error}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
