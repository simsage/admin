import {useDispatch, useSelector} from "react-redux";
import {closeErrorMessage} from "./groupSlice";

export default function GroupError(){

    const dispatch = useDispatch();

    const show_error_message = useSelector((state) => state.groupReducer.show_error_message)
    const errorMessage = useSelector((state) => state.groupReducer.error_message)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeErrorMessage());
    }

    if (!show_error_message)
        return (<div />);

    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Alert</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{errorMessage}</span>
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
