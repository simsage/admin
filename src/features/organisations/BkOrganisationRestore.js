import {useForm} from "react-hook-form";
import {restoreOrganisation, updateOrganisation} from "./organisationSlice";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

export default function BkOrganisationRestore(props) {
    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const session = useSelector((state) => state.authReducer.session)

    //use one org id to load the backups
    const org_id = organisation_list[0] ? organisation_list[0].id : null;

    const dispatch = useDispatch();

    const onSubmit = data => {
        console.log("BkOrganisationRestore onSubmit")
        console.log("BkOrganisationRestore onSubmit")
        const formData = new FormData();
        formData.append("file", data.file[0]);
        console.log(data);

        const reader = new FileReader();
        const file = data.file[0];

        reader.onloadend = () => {
            setFilename(file['name'])
            setFileType(file['type'])
            setFileData(reader.result)
        };
        reader.readAsDataURL(file)

        console.log("file_name", file_name)
        console.log("file_type", file_type)
        console.log("file_data", file_data)


        if (file_data && file_name && file_type === 'text/plain') {
            const payload = {
                organisationId: org_id,
                fileType: file_type,
                base64Text: file_data
            };
            dispatch(restoreOrganisation({session_id: session.id, data: payload}));
        }

    };


    function handleImageChange(e) {
        e.preventDefault();

        const self = this;
        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            setFilename(file['name'])
            setFileType(file['type'])
            setFileData(reader.result)
        };
        reader.readAsDataURL(file)
    }

    return (

        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">
                        <form onSubmit={handleSubmit(onSubmit)} className="upload-container">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Import Organisation</h5>
                                <button onClick={() => props.onClose(false)} type="button" className="btn-close"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>

                            <div className="modal-body">
                                <div className="control-row">
                                    <input type="file" {...register("file", {required: true})}  />
                                    {errors.file && <span>Please select a backup file <br/></span>}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button onClick={() => props.onClose(false)} type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <input type="submit" className={"btn btn-outline-primary"}/>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}