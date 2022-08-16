import React, {useEffect, useState} from "react";
import KnowledgeBaseIntro from "./KnowledgeBaseIntro";
import {useDispatch, useSelector} from "react-redux";
import KnowledgeBaseList from "./KnowledgeBaseList";
import {getOrganisationList} from "../organisations/organisationSlice";
import {getKBList, setViewIds} from "./knowledgeBaseSlice";
import KnowledgeBaseEdit from "./KnowledgeBaseEdit";
import Api from "../../common/api";


export default function KnowledgeBaseHome() {


    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)
    const filter = null;
    const selected_organisation = useSelector((state) => state.authReducer.selected_organisation)
    const kb_list = useSelector((state) => state.kbReducer.kb_list);
    const status = useSelector((state) => state.kbReducer.status);
    const kb_show_form = useSelector((state) => state.kbReducer.show_form)
    const kb_view_id = useSelector((state) => state.kbReducer.view_id)


    console.log("kb_show_form", kb_show_form)
    console.log("kb_view_ids 1", kb_view_id)

    console.log("kb_view_ids", kb_view_id)
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
            {/*show view list*/}
            {kb_view_id !== '' &&
                <ViewIds/>
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

        return (
            <div>
                <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                    <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                        <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">{kb.name} </h5>
                                <button onClick={handleClose} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div>
                                    <table>
                                        <tr>
                                            <td>organisation id</td>
                                            <td>{kb.kbId}</td>
                                            <td>
                                                <button onClick={() => handleCopyIds(kb.kbId)}
                                                        className={"btn btn-outline-primary"}>copy
                                                </button>

                                            </td>
                                            <td>
                                                {(copied_id === kb.kbId) &&
                                                    <div className="copied-style">copied</div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>knowledge id</td>
                                            <td>{kb.organisationId}</td>
                                            <td>
                                                <button onClick={() => handleCopyIds(kb.organisationId)}
                                                        className={"btn btn-outline-primary"}>copy
                                                </button>

                                            </td>
                                            <td>
                                                {(copied_id === kb.organisationId) &&
                                                    <div className="copied-style">copied</div>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>security id</td>
                                            <td>{kb.securityId}</td>
                                            <td>
                                                <button onClick={() => handleCopyIds(kb.securityId)}
                                                        className={"btn btn-outline-primary"}>copy
                                                </button>

                                            </td>
                                            <td>
                                                {(copied_id === kb.securityId) &&
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