import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {closeTestMessage} from "./sourceSlice";
// import {showTestForm} from "../text_to_search/TextToSearchSlice";

const SourceTest = () => {
    const dispatch = useDispatch();

    const test_result = useSelector((state) => state.sourceReducer.test_result)
    const error_title  = useSelector((state) => state.sourceReducer.error_title)
    const error_message = useSelector((state) => state.sourceReducer.error_message)

    const title = test_result === 'Success' ? 'Connection Successful!' : error_title;
    const message = test_result === 'Success' ? 'SimSage can successfully see your endpoint / tenant with the information you have provided.' : error_message;

    const close = () => {
        dispatch(closeTestMessage())
    }

    return (
        <div>
            <div className="modal"  tabIndex="-1" role="dialog" style={{display: "inline", zIndex: 1061}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel" title={title}>{title}</h5>
                            <button onClick={close} type="button" className="btn-close" data-bs-dismiss="modal"
                                    title="close this error message" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span title={message}
                                      className="label-wide">{message}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={close} type="button" title="close this error message"
                                    className="btn btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SourceTest;