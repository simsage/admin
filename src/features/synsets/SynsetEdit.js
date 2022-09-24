import {useSelector} from "react-redux";
import SynsetForm from "./SynsetForm";

export default function SynsetEdit(props) {
    const synset_show_form = useSelector((state) => state.synsetReducer.show_data_form)

    console.log("synset_show_form",synset_show_form)
    if (synset_show_form === false)
        return (<div/>);
    return (

        <SynsetForm />
    )
}