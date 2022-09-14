import React, {useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import {setViewIds} from "./knowledgeBaseSlice";
import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import Api from "../../common/api";
import KnowledgeBaseDelete from "./KnowledgeBaseDelete";
import KnowledgeBaseDeleteInfo from "./KnowledgeBaseDeleteInfo";
import KnowledgeBaseOptimize from "./KnowledgeBaseOptimize";


export default function KnowledgeBaseHome() {


    const dispatch = useDispatch();
    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const status = useSelector((state) => state.kbReducer.status);
    const kb_show_form = useSelector((state) => state.kbReducer.show_form)
    const kb_show_delete_form = useSelector((state) => state.kbReducer.show_delete_form)
    const kb_show_delete_info_form = useSelector((state) => state.kbReducer.show_delete_info_form)
    const kb_show_optimize_form = useSelector((state) => state.kbReducer.show_optimize_form)
    const kb_view_id = useSelector((state) => state.kbReducer.view_id)

    return (

        <div className="section px-5 pt-4">

            {status === null &&
                <KnowledgeBaseIntro/>
            }
            {/*Intro message when there is no kb list*/}
            {status !== null && kb_list !== {} && kb_list.length === 0 &&
                <KnowledgeBaseIntro/>
            }
            {/*show kb list*/}
            {status !== null && kb_list !== {} && kb_list.length > 0 &&
                <KnowledgeBaseList/>
            }
            {/*show kb add/edit form*/}
            {kb_show_form === true &&
                <KnowledgeBaseEdit/>
            }
            {kb_show_delete_form === true &&
                <KnowledgeBaseDelete />
            }
            {kb_show_delete_info_form === true &&
                <KnowledgeBaseDeleteInfo />
            }
            {/*show view list*/}
            { (kb_view_id !== null) &&
                <ViewIds/>
            }
            {kb_show_optimize_form === true &&
                <KnowledgeBaseOptimize/>
            }

        </div>
    )


    /**
     * ViewIds
     * @returns {JSX.Element}
     * @constructor
     */
    //TODO:: Could be moved to its own file
    function ViewIds() {

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




}