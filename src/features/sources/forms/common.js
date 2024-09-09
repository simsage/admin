import {useState} from "react";
import Api from "../../../common/api";


export const DOCUMENTATION = {
    AWS: "resources/simsage-aws-crawler-setup.pdf",
    ZENDESK: "resources/simsage-zendesk-crawler-setup.pdf",
    XML: "resources/simsage-xml-crawler-setup.pdf",
    BOX: "resources/simsage-box-crawler-setup.pdf",
    CONFLUENCE: "resources/simsage-confluence-crawler-setup.pdf",
    DISCOURSE: "resources/simsage-discourse-crawler-setup.pdf",
    DROPBOX: "resources/simsage-dropbox-setup.pdf",
    EGNYTE: "resources/simsage-egnyte-crawler-setup.pdf",
    EXCHANGE365: "resources/simsage-exchange365-crawler-setup.pdf",
    MS_FILESHARE: "resources/simsage-microsoft-fileshare-setup.pdf",
    GOOGLE_DRIVE: "resources/simsage-google-drive-setup.pdf",
    IMANAGE: "resources/imanage-setup.pdf",
    JIRA: "resources/simsage-jira-crawler-setup.pdf",
    ALFRESCO: "resources/simsage-alfresco-crawler-setup.pdf",
    ONE_DRIVE: "resources/simsage-sharepoint365-crawler-setup.pdf",
    SFTP: "resources/simsage-sftp-crawler-setup.pdf",
    SHAREPOINT365: "resources/simsage-sharepoint365-crawler-setup.pdf",
    SLACK: "resources/simsage-slack-crawler-setup.pdf",
    STRUCTURED: "resources/simsage-structured-data-setup.pdf",
    WEB: "resources/simsage-web-crawler-setup.pdf"
}

/**
 *
 * @param props
 * @param json
 * @returns {{l_form_data: *, selected_source: *, source_saved: (*|boolean), specific_json: unknown, setSpecificJson: (value: unknown) => void}}
 */
export function useSelectedSource(props, json = "{}") {
    const selected_source = props.source
    const source_saved = selected_source && selected_source.sourceId > 0
    const specific_json_from_form_data = (props.form_data && props.form_data.specificJson) ?
        props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : json

    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data))
    const l_form_data = props.form_data

    return { selected_source, source_saved, specific_json, setSpecificJson, l_form_data }
}


/**
 * @returns {boolean} error message elaborating on which credentials are missing
 * @param prop
 */
export function invalid_credential(prop) {
    return prop === "" || prop === null || prop === undefined || prop === 0 || prop.length === 0
}


/**
 * check box/dropbox folder items are valid - this list is allowed to be empty
 *  but all items must all start with / if set
 *
 * @param folder_list
 * @returns {boolean}
 */
export function validDropBoxFolderList(folder_list) {
    if (folder_list && folder_list.length > 0) {
        for (const i of folder_list.split(",")) {
            const item = i.trim();
            if (item.length > 0) {
                if (!item.startsWith("/"))
                    return false;
            }
        }
        return true;
    }
    return true;
}

export function is_valid_metadata(list) {
    //  "key": "none", "display": null, "metadata": "", "field2": "", "db1": "", "db2":"", "sort": ""
    const metadata_name_map = {};
    let sort_counter = 0;
    let empty_sort_field_counter = 0;
    let default_sort_counter = 0;
    if (!Api.defined(list)) {
        list = [];
    }
    for (const item of list) {
        const name = item.metadata;
        const extName = item.extMetadata;
        if (!name || name.trim().length === 0) {
            return "SimSage metadata field empty"
        }
        if (!extName || extName.trim().length === 0) {
            item.extMetadata = name;
        }
        if (!metadata_name_map[name]) {
            metadata_name_map[name] = 1;
        } else {
            metadata_name_map[name] += 1;
        }
    }
    for (const key in metadata_name_map) {
        if (metadata_name_map.hasOwnProperty(key)) {
            const counter = metadata_name_map[key];
            if (counter > 1) {
                return "metadata name \"" + key + "\" is used more than once."
            }
        }
    }
    if (sort_counter > 0) { // has sort
        if (empty_sort_field_counter > 0) {
            return "sort-by fields cannot be empty"
        }
        if (default_sort_counter !== 1) {
            return "you must specify the default UI sort field"
        }
    }
    return true;
}