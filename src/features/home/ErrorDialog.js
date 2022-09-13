import {useDispatch, useSelector} from "react-redux";
import {closeError} from "../auth/authSlice";

export default function ErrorDialog() {

    const dispatch = useDispatch();

    const is_error = useSelector((state) => state.authReducer.is_error)
    const title = useSelector((state) => state.authReducer.error_title)
    const text = useSelector((state) => state.authReducer.error_text)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeError());
    }

    if (!is_error)
        return (<div />);
    return(
      <div>
          <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
              <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                  <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                      <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                          <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                  aria-label="Close"></button>
                      </div>
                      <div className="modal-body">
                          <div className="control-row">
                              <span className="label-wide">{text}</span>
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
