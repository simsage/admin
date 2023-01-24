import {useDispatch} from "react-redux";
import { showAddGroupForm }  from "./groupSlice";
import GroupEdit from "./groupEdit";


export default function GroupIntro(){

    const dispatch = useDispatch();

    function handleAddNewGroup(){
        console.log("handleAddNewGroup")
        dispatch(showAddGroupForm(true))
    }

    return(
        <div className="col-6">
            <div className={"sb-item"}>

                <h1 >Welcome, let’s get started</h1>
                <p>Something about Groups. Lorem ipsum dolor sit amet,
                    consectetur adipiscing elit. Malesuada convallis sit eget
                    massa adipiscing. Pellentesque eu tristique neque elementum
                    risus dolor eu sodales sem. Nec, a sed rhoncus sem nunc.
                    Imperdiet lacus sem rutrum at id faucibus pellentesque.</p>
                <button  type="button" className="btn btn-primary" onClick={() => handleAddNewGroup()}>
                    + Add
                </button>
                <br />
                <br />
                <br />
                <br />
                <br />

            </div>
            <GroupEdit/>
        </div>
    );
}