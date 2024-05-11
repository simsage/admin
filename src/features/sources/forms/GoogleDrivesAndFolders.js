import Api from "../../../common/api";
import React, {useState} from "react";
import {BsFillFolderSymlinkFill, BsFillPersonFill} from "react-icons/bs";

export function GoogleDrivesAndFolders(props) {

    const [driveEmail, setDriveEmail] = useState(props.driveDetails.driveEmail)
    const [driveId, setDriveId] = useState(props.driveDetails.driveId)
    const [folderCsv, setFolderCsv] = useState(props.driveDetails.folderCsv)

    const [isSharedDrive, setSharedDrive] = useState(!!driveId && driveId.trim().length > 0)

    const updateDriveConfig = (e) => {
        e.preventDefault()
        e.stopPropagation()

        props.setDriveValue({
            driveEmail: isSharedDrive ? "" : driveEmail,
            driveId: isSharedDrive ? driveId : "",
            folderCsv: folderCsv
        })
    }

    const isValid = () => {
        return (isSharedDrive && Api.definedAndNotBlank(driveId)) ||
            (!isSharedDrive && Api.definedAndNotBlank(driveEmail))
    }

    const driveTypeChange = (src) => {
        setSharedDrive(src.value === "SharedDrive")
    }

    return <div className="modal user-display" tabIndex="-1" role="dialog"
                style={{display: "inline", background: "#202731bb"}}>


        <div className={"modal-dialog modal-lg"} role="document">
            <div className="modal-content">
                <div className="modal-header px-5 pt-4 bg-light">
                    <h4 className="mb-0">{"Drive details"}</h4>
                </div>
                <div className="modal-body p-10">

                    <div className="row mb-3">
                        {!isSharedDrive &&
                            <div className="control-row col-6">
                                <label className="label-2 small required"><BsFillPersonFill size={16}/>&nbsp;User Email</label>
                                <input
                                    tabIndex={0}
                                    value={driveEmail}
                                    onChange={(e) => {
                                        setDriveEmail(e.target.value)
                                        e.preventDefault()
                                    }}
                                    autoFocus={true}
                                    className="form-control"/>
                            </div>
                        }

                        {isSharedDrive &&
                            <div className="control-row col-6">
                                <label className="label-2 small required"><BsFillFolderSymlinkFill size={16}/>&nbsp;Drive
                                    Id</label>
                                <input
                                    tabIndex={0}
                                    value={driveId}
                                    onChange={(e) => {
                                        setDriveId(e.target.value)
                                        e.preventDefault()
                                    }}
                                    autoFocus={true}
                                    className="form-control"/>

                            </div>
                        }

                        <div className="control-row col-6">
                            <label className="label-2 small">&nbsp; Type</label>
                            <br/>
                            <input
                                className="form-check-input"
                                name={"isSharedDrive"}
                                value={"SharedDrive"}
                                checked={isSharedDrive}
                                type={"radio"}
                                onChange={(e) => {
                                    driveTypeChange(e.target)
                                }}/>
                            <label className="label-2 small">&nbsp;Shared Drive</label>
                            <span>&nbsp;/&nbsp;</span>
                            <input
                                className="form-check-input"
                                name={"isSharedDrive"}
                                value={"UserDrive"}
                                checked={!isSharedDrive}
                                type={"radio"}
                                onChange={(e) => {
                                    driveTypeChange(e.target)
                                }}/>
                            <label className="label-2 small">&nbsp;User Drive</label>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="control-row col-12">
                            <label className="small d-flex justify-content-between">
                                Folder list
                                <span className="fst-italic fw-light small">(list of folders to filter by, case insensitive, comma separated).
                                <span className="text-danger ms-1">Optional</span></span>
                            </label>
                            <textarea
                                tabIndex={1}
                                value={folderCsv}
                                rows={3}
                                onChange={(e) => {
                                    setFolderCsv(e.target.value)
                                    e.preventDefault()
                                }}
                                autoFocus={true}
                                className="form-control"/>
                        </div>

                    </div>


                </div>

                <div className="modal-footer px-5 pb-3">
                    <button className="btn btn-primary btn-block px-4"
                            onClick={props.handleClosed}>Cancel
                    </button>
                    <button className="btn btn-primary btn-block px-4"
                            disabled={!isValid()}
                            onClick={updateDriveConfig}>Apply
                    </button>
                </div>
            </div>


        </div>
    </div>

}