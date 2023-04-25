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
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">{errorMessage}</span>
                            </div>
                            <div className="control-row">
                                <button onClick={ handleClose } type="button" className="btn btn-primary px-4" data-bs-dismiss="modal">Okay</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
