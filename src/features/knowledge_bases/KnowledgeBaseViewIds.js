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
        let is_copied = Api.writeToClipboard(selected_id)
        if(is_copied) setCopiedId(selected_id)
    }

    const handleClose = () => {
        dispatch(setViewIds(''))
    }

    // get the ids safely
    const organisationId = kb && kb.organisationId ? kb.organisationId : "";
    const kbId = kb && kb.kbId ? kb.kbId : "";
    const securityId = kb && kb.securityId ? kb.securityId : "";

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content">

                        <div className="modal-header px-5 pt-4 bg-light">
                            <h4 className="mb-0" id="staticBackdropLabel">{kb && kb.name ? kb.name : ""} </h4>
                            {/* <button onClick={handleClose} type="button" className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button> */}
                        </div>
                        <div className="modal-body p-0">
                            <div className="px-5 py-4">
                                <table>
                                    <tbody>

                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Organisation ID</td>
                                        <td className="w-100 text-nowrap">{organisationId}</td>
                                        <td className="px-4 position-relative">
                                            <button onClick={() => handleCopyIds(organisationId)}
                                                    className={"btn text-primary btn-sm"}>Copy
                                            </button>
                                            {(copied_id === organisationId) &&
                                                <div className="copied-style small position-absolute top-50 start-50 translate-middle text-white bg-dark px-2 py-1 rounded">Copied!</div>
                                            }
                                        </td>
                                        {/* <td>
                                            {(copied_id === organisationId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Knowledge ID</td>
                                        <td className="w-100 text-nowrap">{kbId}</td>
                                        <td className="px-4 position-relative">
                                            <button onClick={() => handleCopyIds(kbId)}
                                                    className={"btn text-primary btn-sm"}>Copy
                                            </button>
                                            {(copied_id === kbId) &&
                                                <div className="copied-style small position-absolute top-50 start-50 translate-middle text-white bg-dark px-2 py-1 rounded">Copied!</div>
                                            }
                                        </td>
                                        {/* <td>
                                            {(copied_id === kbId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td> */}
                                    </tr>
                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Security ID</td>
                                        <td className="w-100 text-nowrap">{securityId}</td>
                                        <td className="px-4 position-relative">
                                            <button onClick={() => handleCopyIds(securityId)}
                                                    className={"btn text-primary btn-sm"}>Copy
                                            </button>
                                            {(copied_id === securityId) &&
                                                <div className="copied-style small position-absolute top-50 start-50 translate-middle text-white bg-dark px-2 py-1 rounded">Copied!</div>
                                            }
                                        </td>
                                        {/* <td>
                                            {(copied_id === securityId) &&
                                                <div className="copied-style">copied</div>
                                            }
                                        </td> */}
                                    </tr>
                                    </tbody>

                                </table>
                            </div>

                        </div>
                        <div className="modal-footer px-5 pb-4">
                            <button onClick={handleClose} type="button" className="btn btn-primary px-4"
                                    data-bs-dismiss="modal">Done
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

