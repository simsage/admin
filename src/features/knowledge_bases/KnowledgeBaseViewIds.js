import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import Api from "../../common/api";
import {setViewIds} from "./knowledgeBaseSlice";


/**
 * ViewIds
 * @returns {JSX.Element}
 * @constructor
 */
export default function KnowledgeBaseViewIds() {

    const dispatch = useDispatch();

    const kb_id = useSelector((state) => state.kbReducer.view_id).kb_id
    const kb_list = useSelector((state) => state.kbReducer.kb_list)

    const [copied_id, setCopiedId] = useState('')
    let kb = null;

    if (kb_id && kb_list) {
        let temp_obj = kb_list.filter((obj) => {
            return obj.kbId === kb_id
        })
        if (temp_obj.length > 0) {
            kb = (temp_obj[0])
        }
    }

    const handleCopyIds = (selected_id) => {
        console.log("selected_id", selected_id)
        let is_copied = Api.writeToClipboard(selected_id)
        console.log("is_copied", is_copied)
        if(is_copied) setCopiedId(selected_id)
    }

    const handleClose = () => {
        dispatch(setViewIds(''))
    }

    const organisationId = kb && kb.organisationId ? kb.organisationId : "";
    const kbId = kb && kb.kbId ? kb.kbId : "";
    const securityId = kb && kb.securityId ? kb.securityId : "";
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{kb && kb.name ? kb.name : ""} </h5>
                            <button onClick={handleClose} type="button" className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <table>
                                    <tr>
                                        <td>organisation id</td>
                                        <td>{organisationId}</td>
                                        <td>
                                            <button onClick={() => handleCopyIds(organisationId)}
                                                    className={"btn btn-outline-primary"}>copy
                                            </button>

                                        </td>
                                        <td>
                                            {(copied_id === organisationId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>knowledge id</td>
                                        <td>{kbId}</td>
                                        <td>
                                            <button onClick={() => handleCopyIds(kbId)}
                                                    className={"btn btn-outline-primary"}>copy
                                            </button>

                                        </td>
                                        <td>
                                            {(copied_id === kbId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>security id</td>
                                        <td>{securityId}</td>
                                        <td>
                                            <button onClick={() => handleCopyIds(securityId)}
                                                    className={"btn btn-outline-primary"}>copy
                                            </button>

                                        </td>
                                        <td>
                                            {(copied_id === securityId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td>
                                    </tr>
                                </table>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button onClick={handleClose} type="button" className="btn btn-secondary"
                                    data-bs-dismiss="modal">Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

