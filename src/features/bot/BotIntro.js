import {useDispatch} from "react-redux";
import {showAddMemoryForm, showImportBotForm} from "./botSlice";
import {BotEdit} from "./BotEdit";
import {BotImport} from "./BotImport";

export default function BotIntro(){

    const dispatch = useDispatch();

    function handleAddNewMemory(){
        console.log("handleAddNewMemory")
        dispatch(showAddMemoryForm(true))
    }

    function handleImport(show){
        dispatch(showImportBotForm(show));
    }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about the Bot. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button onClick={() => {handleAddNewMemory()} } type="button" className="btn btn-primary" >
                    + Add
                </button>

                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            <BotEdit />
            {/*<BotImport />*/}
        </div>
    );
}