import {useDispatch, useSelector} from "react-redux";
import {backupKnowledgeBase, closeBackupForm} from "./organisationSlice";
import {useEffect, useState} from "react";

const checked_by_default = ['users', 'sources', 'documents', 'logs', 'statistics', 'language']

export const backup_item_list = [
    {
        value: "users",
        label: "users",
        help: "Backup Users"
    },
    {
        value: "sources",
        label: "sources",
        help: "Backup sources and related data"
    },
    {
        value: "documents",
        label: "documents",
        help: "Backup documents, document text, and relationships"
    },
    {
        value: "logs",
        label: "logs",
        help: "Backup query logs"
    },
    {
        value: "statistics",
        label: "statistics",
        help: "Backup usage statistics"
    },
    {
        value: "language",
        label: "language",
        help: "Backup language related items: synonyms, LLM, syn-sets, semantics"
    },
    {
        value: "sentences",
        label: "sentences",
        help: "Backup binary/parsed sentences"
    },
    {
        value: "similar",
        label: "similar items",
        help: "Backup similarity data"
    },
    {
        value: "preview images",
        label: "preview images",
        help: "Backup preview images"
    },
    {
        value: "indexes",
        label: "indexes",
        help: "Backup indexes"
    },
]

export default function BkOrganisationBackupDialog() {

    const dispatch = useDispatch();

    const {backup_kb} = useSelector((state) => state.organisationReducer)
    const session = useSelector((state) => state.authReducer.session)

    const [backup_level, setBackupLevel] = useState(null)

    useEffect(() => {
        if (backup_level === null) {
            const key_list = backup_item_list.map((item) => item.value)
            const key_set = {}
            for (const key of key_list) {
                if (checked_by_default.includes(key)) {
                    key_set[key] = true
                }
            }
            setBackupLevel(key_set)
        }
    }, [backup_level]);

    //handle form close or cancel
    const handleClose = () => {
        dispatch(closeBackupForm());
    }

    const handleBackup = () => {
        const backup_list = []
        for (const key in backup_level) {
            if (!backup_level.hasOwnProperty(key)) continue
            if (backup_level[key] !== true) continue
            backup_list.push(key)
        }
        const data = {
            session_id:session.id,
            organisation_id: backup_kb?.organisationId ?? '',
            kb_id: backup_kb?.kbId ?? '',
            backup_level: backup_list
        }
        dispatch(backupKnowledgeBase(data))
        dispatch(closeBackupForm());
    }

    const changeBackupLevel = (name, value) => {
        if (backup_level) {
            let copy = JSON.parse(JSON.stringify(backup_level))
            copy[name] = value
            setBackupLevel(copy)
        }
    }

    if (!backup_kb)
        return (<div/>)

    return (
        <div>
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline", background: "#202731bb"}}>
                <div className={"modal-dialog modal-dialog-centered"} role="document">
                    <div className="modal-content p-4">
                        <div className="modal-body text-center">
                            <div className="control-row mb-4">
                                <span
                                    className="label-wide">What do you want to backup from {backup_kb.name}?</span>
                                <div className="col-12"
                                     title={"Backup Level: select one of the below levels"}>
                                    <div className="row btn-group mt-4 mb-2" role="group"
                                         aria-label="Basic radio toggle button group">
                                        {backup_item_list.map((item, i) => {
                                            return (
                                                <div key={i} className="col-4 form-check form-switch">
                                                    <label key={i} title={item.help} className="w-100 btn btn-sm">
                                                        <input className="form-check-input me-1" type="checkbox"
                                                            value={item.value}
                                                            checked={backup_level && !!backup_level[item.value]}
                                                            onChange={(e) => changeBackupLevel(item.value, e.target.checked)}
                                                        />
                                                        {item.label}
                                                    </label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                            </div>
                            <div className="control-row">
                                <button onClick={handleClose} type="button" className="btn btn-white px-4"
                                        data-bs-dismiss="modal">Cancel
                                </button>
                                <button onClick={handleBackup} type="button" className="btn btn-primary px-4">Backup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
