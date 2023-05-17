import OrganisationFormV2 from "./OrganisationFormV2";
import {useSelector} from "react-redux";

export default function OrganisationEdit() {

    let organisation = null;
    const show_organisation_form = useSelector((state) => state.organisationReducer.show_organisation_form);
    const session = useSelector((state) => state).authReducer.session;
    const organisation_id = useSelector((state) => state.organisationReducer.edit_organisation_id);
    const organisation_list = useSelector((state) => state.organisationReducer.organisation_list)


    if (organisation_id && organisation_list) {
        let temp_org = organisation_list.filter((org) => {
            return org.id === organisation_id
        })
        if (temp_org.length > 0) {
            organisation = (temp_org[0])
        }
    }


    if (organisation === null)
        return (<div/>);
    return (
        <OrganisationFormV2
            show_organisation_form={show_organisation_form}
            session={session}
            organisation={organisation}
            organisation_id={organisation_id}
        />
    );
}
