import {useForm} from "react-hook-form";
import {updateOrganisation} from "./organisationSlice";
import {useState} from "react";

export default function BkOrganisationRestore() {
    const [file_name, setFilename] = useState();
    const [file_type, setFileType] = useState();
    const [file_data, setFileData] = useState();

    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();

    const onSubmit = data => {
        console.log("BkOrganisationRestore onSubmit")
        // dispatch(updateOrganisation({session_id: props.session.id, data: data}))
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
        <div className="backup-upload">


            <form onSubmit={(e) => handleSubmit(e)} className="upload-container">
                <div>
                    <input className="upload-control-position"
                           type="file"
                           onChange={(e) => this._handleImageChange(e)}/>


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