import {useSelector} from "react-redux";
import KnowledgeBaseForm from "./KnowledgeBaseForm";

export default function KnowledgeBaseEdit(){
    const show_kb_form = useSelector((state)=>state.kbReducer.show_form);

    if (!show_kb_form)
        return <div/>

    return <KnowledgeBaseForm />
}
