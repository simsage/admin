import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {closeErrorForm} from "./categorizationSlice";

export default function CategorizationError(){

    const dispatch = useDispatch();
    const show_error = useSelector((state) => state.categorizationReducer.show_error)
    const error = useSelector((state) => state.categorizationReducer.error)

    const handleOk = () => {
        dispatch(closeErrorForm());
    }

    if (!show_error)
        return (<div />);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Error</h5>
                        </div>
                        <div className="modal-body">
                            <div className="control-row">
                                <span className="label-wide">{error}</span>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={ handleOk } type="button" className="btn btn-primary">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
