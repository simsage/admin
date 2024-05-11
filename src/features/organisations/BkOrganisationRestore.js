import { useForm } from "react-hook-form";
import { restoreOrganisation } from "./organisationSlice";
import { useDispatch, useSelector } from "react-redux";

export default function BkOrganisationRestore(props) {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const organisationList = useSelector((state) => state.organisationReducer.organisation_list);
    const session = useSelector((state) => state.authReducer.session);
    const orgId = organisationList.length > 0 ? organisationList[0].id : null;
    const dispatch = useDispatch();

    const onSubmit = (data) => {
        const file = data.file[0];
        if (!file || file.type !== "text/plain") {
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            const payload = {
                organisationId: orgId,
                fileType: file.type,
                base64Text: reader.result,
            };
            dispatch(restoreOrganisation({ session_id: session.id, data: payload }));
            props?.onClose(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: "inline", background: "#202731bb" }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content p-4">
                    <div className="modal-header">
                        <h5 className="modal-title">Restore Organisation</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={() => props.onClose(false)}></button>
                    </div>
                    <div className="modal-body text-center">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-3">
                                <label htmlFor="fileInput" className="form-label">Choose backup file</label>
                                <input type="file" className={`form-control ${errors.file ? "is-invalid" : ""}`} id="fileInput" {...register("file", { required: true })} />
                                {errors.file && <small className="invalid-feedback d-block">Please select a backup file</small>}
                            </div>
                            <button type="submit" className="btn btn-primary">Restore</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

}
