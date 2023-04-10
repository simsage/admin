import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {closeBotImportForm, closeForm, importBotItems} from "./botSlice";

export function BotImport() {

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();
    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)


    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();


    const onSubmit = data => {

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
        console.log("BotImport onSubmit")

        if (file_data && file_name) {
            const data = {
                organisationId: selected_organisation_id,
                fileType: file_type,
                kbId:selected_knowledge_base_id,
                base64Text: file_data,
            };

            dispatch(importBotItems({session_id:session.id,data:data}));
            dispatch(closeForm())
        }

    };

    function handleClose(e){
        dispatch(closeBotImportForm())
    }




    return (
        <div className="backup-upload">
            <form onSubmit={handleSubmit(onSubmit)} className="upload-container">
                <div>
                    <input className="mb-4 bg-light p-4 w-100 border rounded" type="file" {...register("file", {required: true})}  />
                    {errors.file && <span>Please select a file </span>}
                    <div className="upload-button">
                        <div className="control-row upload-input">
                            <button type="button" className="btn btn-white px-4" onClick={()=>handleClose()}
                                    data-bs-dismiss="modal">Cancel
                            </button>
                            <input type="submit" className={"btn btn-primary px-4"}/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}