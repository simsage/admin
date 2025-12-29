import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {closeOrganisationForm} from "./organisationSlice";
import {CopyButton} from "../../components/CopyButton";

export function OrganisationViewId() {

    const organisation_id = useSelector((state) => state.organisationReducer.edit_organisation_id)
    const show_organisation_id = useSelector((state) => state.organisationReducer.show_organisation_id)
    const dispatch = useDispatch();


    const handleClose = () => {
        dispatch(closeOrganisationForm());
    }

    if (!show_organisation_id)
        return (<div />);
    return (<div>
        <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">

                    <div className="modal-header px-5 pt-4">
                        <h4 className="mb-0" id="staticBackdropLabel">View Organisation ID</h4>
                    </div>
                    <div className="modal-body p-0">
                        <div className="px-5 py-4">
                            <table>
                                <tbody>

                                <tr>
                                    <td className="text-nowrap pe-4 fw-500">Organisation ID</td>
                                    <td className="w-100 text-nowrap">{organisation_id}</td>
                                    <td className="px-4 position-relative">
                                        <CopyButton reference={organisation_id}/>
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
    </div>);
}