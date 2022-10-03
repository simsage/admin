import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {closeForm} from "../sourceSlice";
import SourceTabs from "./SourceTabs";


export default function SourceForm(props){

    const theme = '';
    const session = useSelector((state) => state.authReducer.session);

    const selected_source = useSelector((state)=> state.sourceReducer.selected_source);
    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);

    const dispatch = useDispatch();

    const show_form = useSelector((state)=> state.sourceReducer.show_data_form);
    const title = selected_source?"Edit Source: "+selected_source.name:"Add Source";

    console.log("user_list",user_list)
    //react-form
    const {register, handleSubmit, watch, formState: {errors}, reset} = useForm();


    const handleClose = () => {
        dispatch(closeForm());
    }

    //on submit store or update
    const onSubmit = data => {
        console.log("data", data)
        // dispatch(addOrUpdate({session_id: session.id, data: data}))
        handleClose()
    };



    if (!show_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded crawler-page">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>


                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="modal-body">
                                <SourceTabs />
                                <div className={"crawler-page"}>
                                    <div className="control-row">
                                        <span className="label-3">name</span>
                                        <input {...register("name", {required: true})} />
                                        {errors.name && <span className=""> Name is required <br/></span>}
                                    </div>

                                    <div className="control-row">
                                        <span className="label-3">email questions to</span>
                                        <input {...register("email", {required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i})} />
                                        {errors.email && <span> Email is required <br/></span>}
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <input type="hidden" {...register("kbId")} />
                                <button onClick={handleClose} type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Close
                                </button>
                                <input type="submit" className={"btn btn-outline-primary"}/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}