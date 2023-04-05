import {useDispatch, useSelector} from "react-redux";
import {closeUserBulkForm} from "./usersSlice";

import UserBulk from "./UserBulk";

export function UserBulkForm( ){

    const dispatch = useDispatch();

    const show_user_bulk_form = useSelector((state) => state.usersReducer.show_user_bulk_form)

    function handleClose(e){
        dispatch(closeUserBulkForm())
    }

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
            <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                <div className="modal-content">
                    <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Add Bulk Users</h4>
                        </div>
                    <div className="modal-body px-5 py-4">
                        <div className="control-row">
                            <a  className="pointer-cursor" onClick={exportToCsv}>
                                Download Bulk user template
                            </a>
                        </div>
                        <br/>
                        <div className="control-row">
                            <UserBulk/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-white px-4 btn-block" onClick={(e) => handleClose(e)}>Cancel</button>
                    </div>

                </div>
            </div>
        </div>

    )
}
