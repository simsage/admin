import {useDispatch, useSelector} from "react-redux";
import {clearOrgErrorMessage} from "./organisationSlice";


export default function OrganisationError(){

    const dispatch = useDispatch();

    const show_error_form = useSelector((state) => state.organisationReducer.show_error_form)
    const error_title = useSelector((state) => state.organisationReducer.error_title);
    const error_message = useSelector((state) => state.organisationReducer.error_message);


    //handle form close or cancel
    const handleClose = () => {
        dispatch(clearOrgErrorMessage());
    }


    if (!show_error_form)
        return (<div />);

    return(
        <div className="org_error">
            <div className="modal" tabIndex="1" role="dialog" style={{display: "inline", zIndex: 1061}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{error_title}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{error_message}</span>
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
