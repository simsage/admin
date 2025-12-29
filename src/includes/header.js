import {useSelector, useDispatch} from "react-redux";
import AccountDropdown from "./account-dropdown";
import {
    clearAllNotifications,
    clearFinishedNotifications,
    clearNotifications,
    getNotifications,
    showAccount,
    toggleNotifications
} from "../features/auth/authSlice";
import {useEffect} from "react";
import {age} from "../common/api";

const Header = () => {

    const dispatch = useDispatch();

    const {user, accounts_dropdown, session, selected_organisation_id,
            show_notifications, notification_list, bottom_notification_list,
            show_bottom_notifications
          } = useSelector((state) => state.authReducer);

    const session_id = session?.id ?? "";
    let organisation = useSelector((state) => state.authReducer.selected_organisation);
    const theme = useSelector((state) => state.homeReducer.theme);

    organisation = (organisation)?organisation:{name:"not set",id:"10"}
    const {firstName, surname} = user? user : {firstName:'not set', surname:'not set'}

    // display "how long ago" in English this task finished.
    // epoch is in server time, so only use GMT here (Date.now())
    function time_ago(epoch) {
        const age_str = age(epoch, Date.now())
        if (age_str !== "") {
            return age_str + " ago"
        }
        return ""
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (session_id.length > 0 && selected_organisation_id.length > 0) {
                dispatch(getNotifications({session_id: session_id, organisation_id: selected_organisation_id}))
            }
        }, 5000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session_id, selected_organisation_id]);

    useEffect(() => {
        if (show_bottom_notifications) {
            setTimeout(() => {
                dispatch(clearFinishedNotifications())
            }, 5000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show_bottom_notifications]);

    function toggleAccountsMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(showAccount())
    }

    function onToggleNotifications(e) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleNotifications())
    }

    const onClearNotifications = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (session_id.length > 0 && selected_organisation_id.length > 0) {
            dispatch(clearNotifications({session_id: session_id, organisation_id: selected_organisation_id}))
        }
    }

    const onClearAllNotifications = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (session_id.length > 0 && selected_organisation_id.length > 0) {
            dispatch(clearAllNotifications({session_id: session_id, organisation_id: selected_organisation_id}))
        }
    }

    const onClearBottomNotifications = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(clearFinishedNotifications())
    }

    const full_name = (firstName ? firstName : "") + " " + (surname ? surname : "");
    const org_name = (organisation && organisation.name) ? organisation.name : "";

    const error = () => {
        return (
            <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="2" fill="none"/>
                <line x1="12" y1="7" x2="12" y2="13" stroke="red" strokeWidth="2"/>
                <circle cx="12" cy="16" r="1" fill="red"/>
            </svg>
        )
    }

    const green_tick = () => {
        return (
            <svg width="16px" height="16px" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false">
                <path
                    d="M9 2C5.1 2 2 5.1 2 9s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM7.6 12.5L4.1 9l1-1 2.5 2.5 5.3-5.3 1 1-6.3 6.3z"
                    fill="var(--cm-sys-color-status-success, #188038)"></path>
            </svg>
        )
    }

    const circle = () => {
        return (
            <svg className="circle" width="16px" height="16px" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#3498db" strokeWidth="5" fill="none"
                        strokeDasharray="180, 251" strokeDashoffset="0"/>
            </svg>
        )
    }

    const bell = () => {
        return (
            <svg width="40px" height="40px" viewBox="0 0 100 100">
                <path transform="translate(25, 25) scale(2)" fill={theme==="light" ? "#20273180":"#ffffff80"} stroke="none"
                      d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
            </svg>
        )
    }

    const busy_bell = () => {
        return (
            <svg width="40px" height="40px" viewBox="0 0 100 100">
                <circle className="circle" cx="50" cy="50" r="40" stroke="#3498db" strokeWidth="5" fill="none"
                        strokeDasharray="180, 251" strokeDashoffset="0"/>
                <path transform="translate(25, 25) scale(2)" fill={theme==="light" ? "#20273180":"#ffffff80"} stroke="none"
                      d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path>
            </svg>
        )
    }

    const notifications_busy = notification_list.filter((item) => item.finished === 0).length > 0

    return (
        <>
            <div className="navbar d-flex justify-content-between align-items-center px-4">
                <div className=" d-flex align-items-center position-relative">
                </div>
                <div className="d-flex align-items-center">

                    <div className="d-none d-lg-flex flex-column text-end me-3">
                        <div className={theme === "light" ? "notification" : "notification-dark"} title="notifications"
                             onClick={(event) => onToggleNotifications(event)}>
                            <div className="notification-icon">
                                {notifications_busy ? busy_bell() : bell()}
                            </div>
                        </div>
                        {show_notifications &&
                            <div className="menu-container">
                                <div className={theme==="light" ? "notification-contents" : "notification-contents-dark"}>
                                    {notification_list.length === 0 &&
                                        <div className="mt-3 ms-2">no new notifications</div>
                                    }
                                    {notification_list.length !== 0 &&
                                        <div>
                                            <button className="btn btn-link mt-2 ms-2"
                                                    onClick={(event) => onClearNotifications(event)}>
                                                clear completed
                                            </button>
                                            <button className="btn btn-link mt-2 ms-2"
                                                    onClick={(event) => onClearAllNotifications(event)}>
                                                clear all
                                            </button>
                                        </div>
                                    }
                                    <hr/>
                                    <div className={"notification-list"}>
                                    {
                                        notification_list.map((notification, i) => {
                                            return (
                                                <a href="#/" key={i}>
                                                    {notification.errorStr !== "" ? error() : (notification.finished > 0 ? green_tick() : circle())}&nbsp;
                                                    {notification.taskName}&nbsp;
                                                    {notification.errorStr !== "" ? (", " + notification.errorStr) : ""}
                                                    {notification.finished > 0 ? ("| " + time_ago(notification.finished)) : ""}</a>
                                            )
                                        })
                                    }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className="d-none d-lg-flex flex-column text-end me-3">
                        <p className="user-name mb-0" title={"you are signed in as " + full_name}>{full_name}</p>
                        <p className="org-name mb-0" title={"your primary organisation is " + org_name}>{org_name}</p>
                    </div>

                    <div className="account" title="Sign out and Organisation menu">
                        <button className={(accounts_dropdown ? "active" : "") + (theme === "light" ? " btn nav-btn" : " btn nav-btn-dark")}
                                onClick={(e) => toggleAccountsMenu(e, accounts_dropdown)}>
                            <img src={theme === "light" ? "images/icon/icon_n-account.svg" : "images/icon/icon_n-account-dark.svg"} alt=""
                                 className={accounts_dropdown ? "d-none" : ""}/>
                            <img src={theme === "light" ? "images/icon/icon_n-account.svg" : "images/icon/icon_n-account-dark.svg"} alt=""
                                 className={!accounts_dropdown ? "d-none" : ""}/>
                        </button>
                    </div>

                </div>


            </div>

            <AccountDropdown/>


            { show_bottom_notifications &&
            <div
                 className="notification-bottom alert position-fixed bottom-0 start-50 translate-middle-x mb-4"
                 role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000">
                <div className="toast-body" onClick={(event) => onClearBottomNotifications(event)}>
                    {
                        bottom_notification_list.map((item, i) => {
                            return (
                                <div key={i}>finished {item.taskName}</div>
                            )
                        })
                    }
                </div>
            </div>
            }

        </>
    );
}

export default Header;
