import {useForm} from "react-hook-form";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bulkUpdateUser} from "./usersSlice";

export default function UserBulk() {
    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();

    const {register, handleSubmit, formState: {errors}} = useForm();
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session)

    const dispatch = useDispatch();

    const onSubmit = data => {
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const reader = new FileReader();
        const file = data.file[0];

        reader.onloadend = () => {
            setFilename(file['name'])
            setFileType(file['type'])
            setFileData(reader.result)
        };
        reader.readAsDataURL(file)

        if (file_data && file_name && file_type === 'text/csv') {
            const payload = {
                base64Text: file_data,
                fileType: file_type,
                organisationId: selected_organisation_id


            };
            dispatch(bulkUpdateUser({session_id: session.id, payload: payload}))
        }
    };

    const downloadFile = ({data, fileName, fileType}) => {
        const blob = new Blob([data], {type: fileType})

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

    return (
        <div className="backup-upload">
            <form onSubmit={handleSubmit(onSubmit)} className="upload-container">
                <div className="mb-3">
                    <input type="file" className={`form-control ${errors.file ? "is-invalid" : ""}`}
                           {...register("file", {required: true})}
                    />
                    {errors.file && <small className="invalid-feedback d-block">Please select a backup file</small>}
                </div>
                <div className="upload-button mt-4 d-flex justify-content-between">
                    <button className="btn-secondary px-4 btn" onClick={exportToCsv}>Download Template</button>
                    <input type="submit" className={"btn btn-primary px-4"}/>
                </div>
            </form>
        </div>
    )


}