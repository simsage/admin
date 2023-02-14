import {useForm} from "react-hook-form";
import {restoreOrganisation, updateOrganisation} from "./organisationSlice";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

export default function BkOrganisationRestore() {
    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)
    const session = useSelector((state) => state.authReducer.session)

    //use one org id to load the backups
    const org_id = organisation_list[0]?organisation_list[0].id:null;

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

        console.log("file_name",file_name)
        console.log("file_type",file_type)
        console.log("file_data",file_data)


        if (file_data && file_name && file_type==='text/plain') {
            const payload = {
                organisationId: org_id,
                fileType: file_type,
                base64Text: file_data
            };
            dispatch(restoreOrganisation({session_id:session.id,data:payload}));
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


    // upload() {
    //     if (this.state.binary_data) {
    //         const payload = {
    //             base64Text: this.state.binary_data,
    //             fileType: this.state.file_type,
    //             organisationId: this.props.selected_organisation_id,
    //         };
    //         this.props.uploadBackup(payload, this.props.onUploadDone);
    //     }
    // }


    return (
        <div className="backup-upload">

            <form onSubmit={handleSubmit(onSubmit)} className="upload-container">
            {/*<form onSubmit={(e) => handleSubmit(e)} className="upload-container">*/}
                <div>


                    {/*<input className="upload-control-position"*/}
                    {/*       type="file"*/}
                    {/*       onChange={(e) => handleImageChange(e)}/>*/}

                    <input type="file" {...register("file",{required: true})}  />
                    {errors.file && <span>Please select a backup file <br/></span>}
                    <div className="upload-button">
                        <div className="upload-input">
                            {/*<button className="btn btn-primary btn-block"*/}
                            {/*        disabled={this.state.binary_data === null || this.props.uploading}*/}
                            {/*        onClick={this.upload.bind(this)}>restore</button>*/}
                            {/*{this.props.uploading &&*/}
                            {/*    <div className="upload-wheel"><img src="../images/busy2.gif" alt="busy" className="busy-image" /></div>*/}
                            {/*}*/}

                            <input type="submit" className={"btn btn-outline-primary"}/>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )

}