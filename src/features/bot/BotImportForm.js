import {useDispatch, useSelector} from "react-redux";
import {closeBotImportForm} from "./botSlice";

import {BotImport} from "./BotImport";

const BotImportForm = () => {

    const dispatch = useDispatch();

    const show_bot_import_form = useSelector((state) => state.botReducer.show_bot_import_form)



    const downloadFile = (e) => {
        let a = e.target
        const helloWorldExcelContent = "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"
        a.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + helloWorldExcelContent;
    }

    if (show_bot_import_form === false)
        return (<div/>);
    return (
        <div className="modal user-display" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
            <div className={"modal-dialog modal-dialog-centered"} role="document">
                <div className="modal-content p-4">
                    {/* <div className="modal-header px-5 pt-4 bg-light">
                        <h4 className="mb-0">Import Bulk Bot Items</h4>
                    </div> */}
                    <div className="modal-body text-center">
                        <div className="control-row mb-4">
                            <span className="label-wide me-2">Import Bulk Bot items</span>
                            <a className="link-primary text-decoration-underline pointer-cursor small fst-italic" download="Import Bot Items.xlsx" onClick={downloadFile}>(Download Bulk Bot template)</a>
                        </div>
                        <div className="control-row">
                            <BotImport/>
                        </div>


                    </div>
                    

                </div>
            </div>
        </div>

    )
}

export default BotImportForm;