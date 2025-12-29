import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeSecurityPrompt} from "./knowledgeBaseSlice";
import Api from "../../common/api";

export function KnowledgeBaseSecurityDialog({setSecurityId}) {
    const dispatch = useDispatch();

    const show_securityID_prompt = useSelector((state) => state.kbReducer.show_securityID_prompt)


    const handleClose = () => dispatch(closeSecurityPrompt())

    const handleSubmit = () => {
        const id = Api.createGuid();
        setSecurityId(id);
        dispatch(closeSecurityPrompt())
    }


    if (!show_securityID_prompt)
        return <div/>

    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", zIndex: 1062}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5rounded">

                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Are you sure you want to refresh the
                            Security ID?</h5>
                        <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="control-row">
                            <span className="label-wide">
                                This ID can not be recovered and can affect the knowledgeBase if update incorrectly
                            </span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button onClick={handleClose} type="button" className="btn btn-primary">Close</button>
                        <button onClick={handleSubmit} type="button" className="btn btn-primary">Refresh</button>
                    </div>
                </div>
            </div>
        </div>
    </div>)

}