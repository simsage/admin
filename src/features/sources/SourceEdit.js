import {useSelector} from "react-redux";
import SourceForm from "./SourceForm";
import "../../css/crawler.css"
import React from "react";
import SourceTest from "./SourceTest";
// import {closeTestMessage} from "./sourceSlice";


export default function SourceEdit() {

    // const dispatch = useDispatch();

    // const theme = '';
    const show_form = useSelector((state) => state.sourceReducer.show_data_form);
    // const error = useSelector((state) => state.sourceReducer.error);
    const test_result = useSelector((state) => state.sourceReducer.test_result);
    // const handleClose = () => {
    //     dispatch(closeTestMessage())
    // }



    if (!show_form)
        return (<div/>);
    return (
        <>


            <SourceForm/>
            {test_result &&
                <SourceTest/>
            }

            {/*{error &&*/}
            {/*    <ErrorMessage error={error} close={handleClose}/>*/}
            {/*}*/}

            {/*<AlertDialogHome />*/}
        </>

    );
};