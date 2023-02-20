import {useDispatch, useSelector} from "react-redux";
import React, {useState} from "react";
import {closeOrganisationForm} from "./organisationSlice";
import Api from "../../common/api";

export function OrganisationViewId(props) {

    const organisation_id = useSelector((state) => state.organisationReducer.edit_organisation_id)
    const show_organisation_id = useSelector((state) => state.organisationReducer.show_organisation_id)
    const dispatch = useDispatch();
    const [copied_id, setCopiedId] = useState('')


    const handleClose = () => {
        dispatch(closeOrganisationForm());
    }

    const handleCopyIds = (selected_id) => {
        console.log("selected_id", selected_id)
        let is_copied = Api.writeToClipboard(selected_id)
        console.log("is_copied", is_copied)
        if(is_copied) setCopiedId(selected_id)
    }

    if (!show_organisation_id)
        return (<div />);
    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">View Organisation ID</h5>
                        <button onClick={handleClose} type="button" className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            <table>
                                <tbody>

                                <tr>
                                    <td>organisation id: &nbsp;&nbsp;</td>
                                    <td className="id-width">{organisation_id}</td>
                                    <td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                                    <td>
                                        <button onClick={() => handleCopyIds(organisation_id)}
                                                className={"btn btn-outline-primary"}>copy
                                        </button>

                                    </td>
                                    <td>&nbsp;&nbsp;</td>
                                    <td>
                                        {(copied_id === organisation_id) &&
                                            <div className="copied-style">copied</div>
                                        }
                                    </td>
                                </tr>
                                </tbody>

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
    </div>);
}