import {useSelector} from "react-redux";

import UserBulk from "./UserBulk";

export function UserBulkForm( ){

    const show_user_bulk_form = useSelector((state) => state.usersReducer.show_user_bulk_form)

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType })

        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const exportToCsv = e => {
        e.preventDefault()

        // Headers for each column
        let headers = ['firstname,surname,email,groups,roles']

        downloadFile({
            data: [...headers].join('\n'),
            fileName: 'importUsers.csv',
            fileType: 'text/csv',
        })
    }

    if (show_user_bulk_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    {/* <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Add Bulk Users</h4>
                    </div> */}
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <span className="label-wide me-2 fw-500">Import Bulk Users</span>
                            <div className="link-primary text-decoration-underline pointer-cursor small fst-italic" onClick={exportToCsv}>
                                (Download Bulk User template)
                            </div>
                        </div>
                        <div className="control-row">
                            <UserBulk/>
                        </div>

                    </div>

                </div>
            </div>
        </div>

    )
}
