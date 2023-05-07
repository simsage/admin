import {useDispatch, useSelector} from "react-redux";
import {closeDeleteForm, deleteAllMindItems, deleteMindItem} from "./botSlice";
import AlertBox from "../../common/AlertBox";


export default function BotDeleteAsk(){

    const dispatch = useDispatch();
    const session = useSelector((state) => state.authReducer.session);
    const session_id = session.id;
    const show_delete_form = useSelector((state) => state.botReducer.show_delete_form)
    const memory = useSelector( (state) => state.botReducer.edit);
    const organisation_id = useSelector((state) => state.authReducer.selected_organisation_id)
    const knowledgeBase_id = useSelector((state) => state.authReducer.selected_knowledge_base_id)

    //handle form close or cancel
    const handleClose = () => {
    dispatch(closeDeleteForm());
    }

    const handleDelete = () => {
        console.log("delete", memory);
        const data = {"session_id": session_id, "organisation_id": organisation_id, "knowledge_base_id": knowledgeBase_id, "id": memory.id };
        console.log("delete data",data)
        if( typeof memory === 'string' && memory.toLowerCase() === 'all') {
            dispatch(deleteAllMindItems( {session_id, organisation_id, knowledgeBase_id}));
            dispatch(closeDeleteForm());
        }
        else {
            dispatch(deleteMindItem(data));
            dispatch(closeDeleteForm());
        }
    }

    if (!show_delete_form)
        return (<div />);

    const object = memory && memory.id ? ` Bot item: ${memory.id}` : ` all of the Bot items`;
    const title = `delete ${object}`
    const message = `Are you sure you wish to delete ${object}`;

    return(
        <AlertBox title={title} message ={message} handleClose={handleClose} handleOk={handleDelete}/>
    );
}
