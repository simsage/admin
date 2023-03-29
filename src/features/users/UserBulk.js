import {useForm} from "react-hook-form";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bulkUpdateUser} from "./usersSlice";

export default function UserBulk() {
    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();
    const selected_organisation_id = useSelector((state)=>state.authReducer.selected_organisation_id)
    const session = useSelector((state) => state.authReducer.session)



    const dispatch = useDispatch();

    const onSubmit = data => {
        console.log("UserBulk onSubmit")
        const formData = new FormData();
        formData.append("file", data.file[0]);
        console.log("data",data);

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


        if (file_data && file_name && file_type==='text/csv') {
            const payload = {
                base64Text: file_data,
                fileType: file_type,
                organisationId: selected_organisation_id


            };
            console.log("payload data ", payload)
            //dispatch(restoreOrganisation({session_id:session.id,data:payload}));
            dispatch(bulkUpdateUser({session_id:session.id, payload:payload}))
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