import {useState} from "react";


export const DOCUMENTATION = {
    AWS: "resources/simsage-aws-crawler-setup.pdf",
    ZENDESK: "resources/simsage-zendesk-crawler-setup.pdf",
    XML: "resources/simsage-xml-crawler-setup.pdf",
    BOX: "resources/simsage-box-crawler-setup.pdf",
    CONFLUENCE: "resources/simsage-confluence-crawler-setup.pdf",
    DISCOURSE: "resources/simsage-discourse-crawler-setup.pdf",
    DROPBOX: "resources/simsage-dropbox-setup.pdf",
    EGNYTE: "resources/simsage-egnyte-crawler-setup.pdf",
    EXCHANGE365: "resources/simsage-exchange365-setup.pdf",
    MS_FILESHARE: "resources/simsage-microsoft-fileshare-setup.pdf",
    GOOGLE_DRIVE: "resources/simsage-google-drive-setup.pdf",
    IMANAGE: "resources/imanage-setup.pdf",
    JIRA: "resources/simsage-jira-crawler-setup.pdf",
    ONE_DRIVE: "resources/simsage-sharepoint365-setup.pdf",
    SFTP: "resources/simsage-jira-crawler-setup.pdf",
    SHAREPOINT365: "resources/simsage-sharepoint365-setup.pdf",
    SLACK: "resources/simsage-slack-crawler-setup.pdf",
    STRUCTURED: "resources/simsage-structured-data-setup.pdf",
    WEB: "resources/simsage-web-crawler-setup.pdf"
}


export function useSelectedSource(props, json = "{}") {
    const selected_source = props.source;
    const source_saved = selected_source && selected_source.sourceId > 0;
    const specific_json_from_form_data =
        (props.form_data && props.form_data.specificJson) ?
            props.form_data.specificJson : selected_source.specificJson ? selected_source.specificJson : json;

    const [specific_json, setSpecificJson] = useState(JSON.parse(specific_json_from_form_data));
    const l_form_data = props.form_data;

    return { selected_source, source_saved, specific_json, setSpecificJson, l_form_data };
}