import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {closeForm} from "../sourceSlice";
import SourceTabs from "./SourceTabs";
import {useEffect, useState} from "react";
import GeneralForm from "./GeneralForm";


export default function SourceForm(props) {

    const theme = '';
    const session = useSelector((state) => state.authReducer.session);

    const selected_source = useSelector((state) => state.sourceReducer.selected_source);
    const selected_source_tab = useSelector((state) => state.sourceReducer.selected_source_tab)
    const selected_source_type = useSelector((state) => state.sourceReducer.selected_source_type)

    const selected_organisation_id = useSelector((state) => state.authReducer.selected_organisation_id);
    const selected_knowledge_base_id = useSelector((state) => state.authReducer.selected_knowledge_base_id);
    const user_list = useSelector((state) => state.usersReducer.user_list);

    const dispatch = useDispatch();

    const show_form = useSelector((state) => state.sourceReducer.show_data_form);
    const title = selected_source ? "Edit Source: " + selected_source.name : "Add Source";

    console.log("user_list", user_list)


    const source_tabs = [
        {label: "general", slug: "general"},
        {label: "rss crawler", slug: "rss-crawler"},
        {label: "metadata", slug: "metadata"},
        {label: "ACLs", slug: "acls"},
        {label: "schedule", slug: "schedule"},
    ]

    // marker for an external node
    const external_node_id = 1000000;

    // a few defaults
    const default_error_threshold = 10;
    const default_num_results = 5;
    const default_num_fragments = 3;
    const default_qna_threshold = 0.8125;

    //Form Hook
    const {register, handleSubmit, watch, formState: {errors, dirtyFields}, reset, control} = useForm();


    const handleClose = () => {
        dispatch(closeForm());
    }

    //on submit store or update
    const onSubmit = data => {
        console.log("data", data)
        // dispatch(addOrUpdate({session_id: session.id, data: data}))
        handleClose()
    };


    //set default value
    useEffect(() => {
        let defaultValues = {};
        //fields
        defaultValues.processingLevel = 'exchange365';

        reset({...defaultValues});

    }, [selected_source, show_form]);


    console.log("processingLevel", watch("processingLevel"))


    if (!show_form)
        return (<div/>);
    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded crawler-page w-100">

                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{title}</h5>
                            <button onClick={handleClose} type="button" className="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                        </div>


                        <div className="modal-body">
                            <SourceTabs source_tabs={source_tabs}/>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {selected_source_tab === 'general' &&
                                    <GeneralForm errors={errors} register={register}/>
                                }


                                <div className="modal-footer">
                                    <button onClick={handleClose} type="button" className="btn btn-secondary"
                                            data-bs-dismiss="modal">Close
                                    </button>
                                    <input type="submit" className={"btn btn-outline-primary"}/>
                                </div>

                            </form>


                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}