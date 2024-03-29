import {useForm} from "react-hook-form";
import {restoreOrganisation} from "./organisationSlice";
import {useDispatch, useSelector} from "react-redux";

export default function BkOrganisationRestore(props) {

    const {register, handleSubmit,  formState: {errors}} = useForm();
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const session = useSelector((state) => state.authReducer.session)

    //use one org id to load the backups
    const org_id = organisation_list[0] ? organisation_list[0].id : null;

    const dispatch = useDispatch();

    const onSubmit = data => {
        const formData = new FormData();
        formData.append("file", data.file[0]);

        const reader = new FileReader();
        const file = data.file[0];

        reader.onloadend = () => {
            const file_name = file['name'];
            const file_type = file['type'];
            const file_data = reader.result;
            if (file_data && file_name && file_type === 'text/plain') {
                const payload = {
                    organisationId: org_id,
                    fileType: file_type,
                    base64Text: file_data
                };
                dispatch(restoreOrganisation({session_id: session.id, data: payload}));
                props?.onClose(false);
            }

        };
        reader.readAsDataURL(file)

    };

    return (

        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">

                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span className="label-wide me-2 fw-500">Restore Organisation</span>
                            </div>

                            <div className="control-row">   
                                <div className="backup-upload">

                                    <form onSubmit={handleSubmit(onSubmit)} className="upload-container">
                                        <input type="file" className="bg-light p-4 w-100 border rounded" {...register("file", {required: true})}  />
                                        {errors.file && 
                                        <div className="text-end text-danger small fst-italic mb-4 mt-2">Please select a backup file</div>}
                                        <div className="upload-button mt-4">
                                            <div className="control-row upload-input">

                                                <button type="button" className="btn btn-white px-4" onClick={() => props.onClose(false)} 
                                                        data-bs-dismiss="modal">Cancel
                                                </button>
                                                <input type="submit" className={"btn btn-primary px-4"}/>
                                            </div>
                                        </div>
                                    </form>     
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}