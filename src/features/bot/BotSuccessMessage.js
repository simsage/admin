import {useDispatch, useSelector} from "react-redux";
import {closeForm} from "./botSlice";

export default function BotSuccessMessage(){

    const dispatch = useDispatch();

    const show_add_info_form = useSelector((state) => state.botReducer.show_add_info_form)

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeForm());
    }

    if (!show_add_info_form)
        return (<div />);
    return(
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">New bot item now processing!</h5>
                            <button onClick={ handleClose } type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <div className="small text">Depending on the size of your knowledge base this might take some time.</div>
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
