import {useDispatch, useSelector} from "react-redux";
import {closeError} from "../auth/authSlice";
import {closeAlert} from "./alertSlice";

export default function AlertDialog(props){

    const show_alert = useSelector((state) => state.alertReducer.show_alert)
    const alert_type = useSelector((state) => state.alertReducer.alert_type)

    const dispatch = useDispatch()

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeAlert());
    }

    if (!show_alert)
        return (<div />);

    return(
        <>
            {alert_type === 'alert-error' &&
                <div>Alert error</div>
            }

            {alert_type === 'alert-danger' &&
                <div>Alert danger</div>
            }

            {alert_type === 'alert-success' &&
                <div>Alert success</div>
            }

            {alert_type === 'alert-warning' &&
                <div>Alert warning</div>
            }
        </>
    )
}