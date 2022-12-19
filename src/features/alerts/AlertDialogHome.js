import {useDispatch, useSelector} from "react-redux";
import {closeError} from "../auth/authSlice";
import {closeAlert} from "./alertSlice";
import ErrorAlert from "./ErrorAlert";
import WarningAlert from "./WarningAlert";

export default function AlertDialogHome(props) {

    const show_alert = useSelector((state) => state.alertReducer.show_alert)
    const alert_type = useSelector((state) => state.alertReducer.alert_type)

    const dispatch = useDispatch()

    console.log("alert_type",alert_type, props)
    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeAlert());
    }

    if (!show_alert)
        return (<div/>);

    return (
        <>
            {alert_type === 'alert-error' &&
                <ErrorAlert/>
            }

            {alert_type === 'alert-warning' &&
                <>
                    <WarningAlert/>
                </>
            }

            {alert_type === 'alert-delete' &&
                <>
                    <WarningAlert onOk={props.onDelete}/>
                </>
            }


            {/*//todo: implement alert-success alert*/}
            {alert_type === 'alert-success' &&
                <ErrorAlert/>
            }


            {/*//todo: implement alert-primary alert*/}
            {alert_type === 'alert-primary' &&
                <ErrorAlert/>
            }

            {/*//todo: implement alert-info alert*/}
            {alert_type === 'alert-info' &&
                <ErrorAlert/>
            }

        </>
    )
}