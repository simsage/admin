import {useDispatch, useSelector} from "react-redux";
import {closeAlert} from "./alertSlice";

export default function WarningAlert(props){

    console.log("WarningAlert1: load page")
    const show_alert = useSelector((state) => state.alertReducer.show_alert)
    // const alert_type = useSelector((state) => state.alertReducer.alert_type)
    // const title = useSelector((state) => state.alertReducer.title)
    const message = useSelector((state) => state.alertReducer.message)

    const dispatch = useDispatch()

    //handle form close or cancel
    const handleCancel = () => {
        console.log("handleCancel")
        dispatch(closeAlert());
    }

    const handleOk = () => {
        console.log("Ok")
        props.onOk();
    }


    if (!show_alert)
        return (<div />);

    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide">
                                    {/* {alert_type}: */}
                                    {message}</span>
                            </div>
                            <div className="control-row">
                                <button onClick={ (e) => handleCancel(e) } type="button" className="btn btn-white px-4" data-bs-dismiss="modal">Close</button>
                                <button onClick={ handleOk } type="button" className="btn btn-danger px-4">Delete</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}