import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {setViewIds} from "./knowledgeBaseSlice";
import {CopyButton} from "../../components/CopyButton";


/**
 * ViewIds
 * @returns {JSX.Element}
 * @constructor
 */
export default function KnowledgeBaseViewIds() {

    const dispatch = useDispatch();

    const kb_id = useSelector((state) => state.kbReducer.view_id).kb_id
    const kb_list = useSelector((state) => state.kbReducer.kb_list)

    let kb = null;

    if (kb_id && kb_list) {
        let temp_obj = kb_list.filter((obj) => {
            return obj.kbId === kb_id
        })
        if (temp_obj.length > 0) {
            kb = (temp_obj[0])
        }
    }

    const handleClose = () => dispatch(setViewIds(''))

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
                        </div>
                        <div className="modal-body">
                            <div className="px-5 py-5">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Organisation ID</td>
                                        <td className="w-100 text-nowrap">{organisationId}</td>
                                        <td className="px-4 position-relative">
                                            <CopyButton reference={organisationId} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Knowledge ID</td>
                                        <td className="w-100 text-nowrap">{kbId}</td>
                                        <td className="px-4 position-relative my-3">
                                            <CopyButton reference={kbId} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-nowrap pe-4 fw-500">Security ID</td>
                                        <td className="w-100 text-nowrap">{securityId}</td>
                                        <td className="px-4 position-relative my-3">
                                            <CopyButton reference={securityId} />
                                        </td>
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

