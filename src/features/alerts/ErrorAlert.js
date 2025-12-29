import {useDispatch, useSelector} from "react-redux";
import {closeAlert} from "./alertSlice";

export default function ErrorAlert(props){

    const show_alert = useSelector((state) => state.alertReducer.show_alert)
    const title = useSelector((state) => state.alertReducer.title)
    const message = useSelector((state) => state.alertReducer.message)

    const dispatch = useDispatch()

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeAlert());
    }

    if (!show_alert)
        return (<div />);

    return(
        <div>
            <div id={"error_alert"} className="modal alert-warning" tabIndex="-1" role="dialog" style={{display: "inline", 'zIndex':9999}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                {
                                    message.split("\n").map((str, i) => {
                                        return (
                                            <div key={i} className="label-wide mb-2">{str}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleClose } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}