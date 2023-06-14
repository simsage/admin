import {useDispatch, useSelector} from "react-redux";
import {clearErrorMessage} from "./organisationSlice";


export default function OrganisationError(){

    const dispatch = useDispatch();

    const show_error_form = useSelector((state) => state.organisationReducer.show_error_form)
    const error_obj = useSelector((state) => state.organisationReducer.error)
    const error= error_obj && error_obj.response ? error_obj.response.data.error : ''


    //handle form close or cancel
    const handleClose = () => {
        dispatch(clearErrorMessage());
    }



    if (!show_error_form)
        return (<div />);
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Oops!</h5>
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
