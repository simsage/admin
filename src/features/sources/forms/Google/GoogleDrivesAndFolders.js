import Api from "../../../../common/api"
import React, {useEffect, useState} from "react"
import {BsFillFolderSymlinkFill, BsFillPersonFill} from "react-icons/bs"
import CustomSelect from "../../../../components/CustomSelect";
import FolderTagsInput from "./FolderTagsInput";

export function GoogleDrivesAndFolders(props) {

    const [initialized, setInitialized] = useState(false)
    const [driveEmail, setDriveEmail] = useState('')
    const [driveId, setDriveId] = useState('')
    const [folderCsv, setFolderCsv] = useState('')
    const [folderCsvExclude, setFolderCsvExclude] = useState('')
    const [isExclusive, setIsExclusive] = useState(false)
    const [crawlRootFiles, setCrawlRootFiles] = useState(true)
    const [crawlShortcuts, setCrawlShortcuts] = useState(false)
    const [mode, setMode] = useState('all')
    const [sourceCreated, setSourceCreated] = useState(false)
    const [isSharedDrive, setSharedDrive] = useState(false)
    const [current_drive_index, setCurrentDriveIndex] = useState(-1)

    // set up
    useEffect(() => {
        if (!initialized && props && props.driveDetails) {
            setInitialized(true)
            const drive_id = props.driveDetails.driveId
            setDriveEmail(props.driveDetails.driveEmail ?? '')
            setDriveId(drive_id)
            setFolderCsv(props.driveDetails.folderCsv ?? '')
            setFolderCsvExclude(props.driveDetails.folderExcludeCsv ?? '')
            setIsExclusive(!!props.driveDetails.isExclusive)
            setCrawlRootFiles(!!props.driveDetails.crawlRootFiles)
            setCrawlShortcuts(!!props.driveDetails.crawlShortcuts)
            setMode(props.driveDetails.mode ?? 'all')
            setSourceCreated(props.sourceCreated === true)
            setCurrentDriveIndex(props.driveIndex)
            setSharedDrive(!!drive_id && drive_id.trim().length > 0)
        }
    }, [props, initialized]);

    const modes = [
        {"key": "all", "value": "Crawl Everything"},
        {"key": "include", "value": "Include Folders..."},
        {"key": "exclude", "value": "Exclude Folders..."}
    ]

    // this item is disabled if this is an existing source, not adding a new item, in exclude mode
    const disabled = sourceCreated && mode === "exclude" &&
        current_drive_index >= 0 && props.driveDetails.mode === "exclude"

    const updateDriveConfig = (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Initialize folderCsv and folderExcludeCsv as empty strings
        let updatedFolderCsv = ""
        let updatedFolderExcludeCsv = ""
        let mode_to_use = mode

        // Set the appropriate folder list based on the selected mode
        if (mode_to_use === "include") {
            updatedFolderCsv = folderCsv

        }

        if (mode_to_use === "exclude") {
            updatedFolderExcludeCsv = folderCsvExclude
            setIsExclusive(false)
        }

        // no folders?  effectively the same as "all"
        if (updatedFolderCsv.length === 0 && updatedFolderExcludeCsv.length === 0) {
            mode_to_use = "all"
        }

        // Update the drive configuration
        props.setDriveValue({
            driveEmail: isSharedDrive ? "" : driveEmail,
            driveId: isSharedDrive ? driveId : "",
            isExclusive: isExclusive,
            folderCsv: updatedFolderCsv,
            folderExcludeCsv: updatedFolderExcludeCsv,
            crawlRootFiles: crawlRootFiles,
            crawlShortcuts: crawlShortcuts,
            mode: mode_to_use
        })
    }

    // ready to apply / save ?
    const isValid = () => {
        return (
                (isSharedDrive && Api.definedAndNotBlank(driveId)) ||
                (!isSharedDrive && Api.definedAndNotBlank(driveEmail))
            )
            &&
            (
                (mode === "include" && folderCsv && folderCsv.length > 0) ||
                (mode === "exclude" && folderCsvExclude && folderCsvExclude.length > 0) ||
                (mode === "all")
            )
    }


    return <div
        className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}
    >
        <div className={"modal-dialog modal-lg"} role="document">
            <div className="modal-content">
                <div className="modal-header px-5 pt-4">
                    <h4 className="mb-0">{"Drive details"}</h4>
                </div>

                <div className="modal-body p-10">
                    <div className="row mb-3">
                        <div className="control-row row">
                            {!isSharedDrive &&
                                <div className="control-row col-4">
                                    <label className="label-2 small required"><BsFillPersonFill size={16}/>
                                        &nbsp;User Email
                                    </label>
                                    <input
                                        disabled={disabled}
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
                                <div className="control-row col-4">
                                    <label className="label-2 small required"><BsFillFolderSymlinkFill
                                        size={16}/>&nbsp;Drive
                                        Id</label>
                                    <input
                                        disabled={disabled}
                                        tabIndex={0}
                                        value={driveId}
                                        onChange={(e) => {
                                            setDriveId(e.target.value)
                                            e.preventDefault()
                                        }}
                                        autoFocus={true}
                                        className="form-control"
                                    />
                                </div>
                            }
                            <div className="control-row col-3">
                                <label className="label-left small">Crawl Mode</label>
                                <CustomSelect
                                    defaultValue={(mode) ? mode : "all"}
                                    disabled={disabled}
                                    onChange={(key) => setMode(key)}
                                    options={modes}
                                />
                            </div>

                            <div className="control-row col-md-2 pt-4">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        name={"driveType"}
                                        value={"SharedDrive"}
                                        checked={isSharedDrive}
                                        disabled={disabled}
                                        type={"checkbox"}
                                        onChange={() => setSharedDrive(!isSharedDrive)}
                                    />
                                    <label className="label-2 small">
                                        <i>{isSharedDrive ? 'Shared Drive' : 'User Drive'}</i>
                                    </label>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="row mb-3">
                        {mode === "include" &&
                            <div className="control-row col-12">
                                <label className="small d-flex justify-content-between">Folders (inclusive)</label>
                                <FolderTagsInput
                                    disabled={false}
                                    value={folderCsv ?? ''}
                                    onChange={setFolderCsv}
                                />
                            </div>
                        }
                        {mode === "exclude" &&
                            <div className="control-row col-12 py-2">
                                <label className="small d-flex justify-content-between">Folders (exclusive)</label>
                                <FolderTagsInput
                                    disabled={disabled}
                                    value={folderCsvExclude ?? ''}
                                    onChange={setFolderCsvExclude}
                                />
                            </div>
                        }
                        <div className="col-md-6 pt-4 d-flex align-items-center">
                            <div className="form-check form-switch me-4"
                                 title="If checked, SimSage will crawl shortcuts.">
                                <input
                                    className="form-check-input"
                                    name={"crawlShortCuts"}
                                    value={"crawlShortCuts"}
                                    checked={crawlShortcuts}
                                    disabled={disabled}
                                    type={"checkbox"}
                                    onChange={() => setCrawlShortcuts(!crawlShortcuts)}
                                />
                                <label className="label-2 small">
                                    <i>Crawl Google shortcuts</i>
                                </label>
                            </div>
                            {mode === "include" &&
                                <div className="form-check form-switch"
                                     title="If checked, SimSage will exclude the sub-directories if applicable to specified folders">
                                    <input
                                        className="form-check-input"
                                        name={"exclusiveCrawling"}
                                        value={"Exclusive"}
                                        checked={isExclusive}
                                        type={"checkbox"}
                                        onChange={() => setIsExclusive(!isExclusive)}
                                    />
                                    <label className="label-2 small">
                                        <i>Exclude Folder Subdirectories</i>
                                    </label>
                                </div>
                            }
                        </div>

                    </div>
                    <ul className="alert alert-warning small py-2 mt-3 ps-4" role="alert">
                        <li>Exclude Folders can only be set once.</li>
                        { !disabled &&
                        <li>Please refer to each folder by it's ID.</li>
                        }
                        { !disabled &&
                        <li>Changing the <i>mode</i> will reset the crawler.</li>
                        }
                        {!isSharedDrive && mode === "include" &&
                            <li>
                                'Crawl local drive root' will crawl files specifically located in URL ending 'my-drive'.
                            </li>
                        }
                    </ul>
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