import React, {useState} from "react";

export function OneDriveUserAndLibraries(props) {

    const [driveUser, setDriveUser] = useState(props.driveDetails.driveUser)
    const [libraryCsv, setLibraryCsv] = useState(props.driveDetails.libraryCsv)
    const [isGroup, setIsGroup] = useState(props.driveDetails.isGroup)


    const updateSiteConfig = (e) => {
        e.preventDefault()
        e.stopPropagation()

        props.setDriveValue({
            driveUser: driveUser,
            libraryCsv: libraryCsv,
            isGroup:isGroup
        })
    }

    const isValid = () => {
        // return (isSharedDrive && Api.definedAndNotBlank(driveId)) ||
        //     (!isSharedDrive && Api.definedAndNotBlank(driveEmail))
        return true
    }

    const groupUserChange = (src) => {
        setIsGroup(src.value === "Group")
    }

    return <div className="modal user-display" tabIndex="-1" role="dialog"
                style={{display: "inline", background: "#202731bb"}}>


        <div className={"modal-dialog modal-lg"} role="document">
            <div className="modal-content">
                <div className="modal-header px-5 pt-4 bg-light">
                    <h4 className="mb-0">{"Drive User/Group Details"}</h4>
                </div>
                <div className="modal-body p-10">

                    <div className="row mb-3">
                        <div className="control-row col-6">
                            <label className="label-2 small required">
                                {isGroup && "Domain Group"}
                                {!isGroup && "User Email"}
                            </label>
                            <input
                                tabIndex={0}
                                value={driveUser}
                                onChange={(e) => {
                                    setDriveUser(e.target.value)
                                    e.preventDefault()
                                }}
                                autoFocus={true}
                                className="form-control"/>
                        </div>

                        <div className="control-row col-6">
                            <label className="label-2 small">&nbsp; Type</label>
                            <br/>
                            <input
                                className="form-check-input"
                                name={"isGroup"}
                                value={"Group"}
                                checked={isGroup}
                                type={"radio"}
                                onChange={(e) => {
                                    groupUserChange(e.target)
                                }}/>
                            <label className="label-2 small">&nbsp;Domain Group</label>
                            <span>&nbsp;/&nbsp;</span>
                            <input
                                className="form-check-input"
                                name={"isGroup"}
                                value={"User"}
                                checked={!isGroup}
                                type={"radio"}
                                onChange={(e) => {
                                    groupUserChange(e.target)
                                }}/>
                            <label className="label-2 small">&nbsp;User</label>
                        </div>


                    </div>

                    <div className="row mb-3">
                        <div className="control-row col-12">
                            <label className="small d-flex justify-content-between">
                                Libraries
                                <span className="fst-italic fw-light small">(list of Libraries to crawl (leave empty for all), case insensitive, comma separated).
                                <span className="text-danger ms-1">Optional</span></span>
                            </label>
                            <textarea
                                tabIndex={1}
                                value={libraryCsv}
                                rows={3}
                                onChange={(e) => {
                                    setLibraryCsv(e.target.value)
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
                            onClick={updateSiteConfig}>Apply
                    </button>
                </div>
            </div>


        </div>
    </div>

}