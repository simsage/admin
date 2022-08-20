import {useSelector, useDispatch} from "react-redux";
import AccountDropdown from "./account-dropdown";
import {showAccount} from "../features/auth/authSlice";

const Header = (props) => {

    const dispatch = useDispatch();

    const {user, session, accounts_dropdown} = useSelector((state) => state.authReducer);
    let organisation = useSelector((state) => state.authReducer.selected_organisation);

    organisation = (organisation)?organisation:{name:"not set",id:"10"}
    const {firstName, surname} = user? user : {firstName:'not set', surname:'not set'}

    function toggleAccountsMenu(e,accounts_dropdown) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(showAccount())
    }

    return(
        <>
        <div className="navbar d-flex justify-content-between align-items-center px-4">
            <div className=" d-flex align-items-center position-relative">
            </div>
            <div className="d-flex align-items-center">
                <div className="d-none d-lg-flex flex-column text-end me-3">
                    <p className="user-name mb-0">{firstName + " " + surname} - org: {organisation.id} -sess: {session.id}</p>
                    <p className="org-name mb-0">{((organisation !== null && organisation.name !== null) ? organisation.name : "") }</p>
                </div>

                <div className="account" title="this is the sign-out button for now">
                    <button className={(accounts_dropdown ? "active" : "") + " btn nav-btn"}
                            onClick={(e) => toggleAccountsMenu(e,accounts_dropdown)}>
                        <img src="/images/icon/icon_n-account.svg" alt="" className={accounts_dropdown ? "d-none" : ""} />
                        <img src="/images/icon/icon_n-account-active.svg" alt="" className={!accounts_dropdown ? "d-none" : ""} />
                    </button>
                </div>

            </div>


        </div>

    <AccountDropdown
        // onSignOut={(e) => signOut(instance, setIsAccountDropdown, dispatch, e)}
        // onSignIn={(e) => signIn(accounts, ar.session, instance, setIsAccountDropdown, dispatch, e)}
        // isAuthenticated={isAuthenticated}
        // session={ar.session}
        // accounts_dropdown={accounts_dropdown}
    />
    </>
    );
}

export default Header;
