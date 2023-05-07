import {useDispatch} from "react-redux";
import SynsetEdit from "./SynsetEdit";
import {showAddSynSetForm} from "./synsetSlice";


export default function SynsetIntro(){

    const dispatch = useDispatch();

    function handleAddNewMemory(){
        console.log("handleAddNewSynSet")
        dispatch(showAddSynSetForm())
    }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about Syn-sets. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button  type="button" className="btn btn-primary" onClick={() => handleAddNewMemory()}>
                    + Add
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            <SynsetEdit/>
        </div>
    );
}