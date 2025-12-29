import React, {useEffect, useState} from "react";
import {RuleBuilder} from "../../../components/RuleBuilder";
import {DOCUMENTATION} from "./common";
import {BsFilePdf} from "react-icons/bs";

const emptyQuery = {
    combinator: 'and',
    rules: []
};

export default function CrawlerRulesForm(props) {

    const [rule_set, setRuleSet] = useState([]);

    // this crawler doesn't need the verify system
    useEffect(() => {
        if (!props.rules || props.rules === "") {
            setRuleSet([])
        } else {
            setRuleSet(JSON.parse(props.rules))
        }
    }, [props.rules])

    const new_rule = () => {
        const new_rule_set = JSON.parse(JSON.stringify(rule_set));
        new_rule_set.push({description: "", hashTag: "", query: emptyQuery});
        setRuleSet(new_rule_set)
        props.onUpdate(new_rule_set)
    }

    const delete_rule = (index) => {
        const new_rule_set = JSON.parse(JSON.stringify(rule_set))
        if (index >= 0 && index < new_rule_set.length) {
            new_rule_set.splice(index, 1)
            setRuleSet(new_rule_set)
            props.onUpdate(new_rule_set)
        }
    }

    const update_rule = (index, field_value) => {
        const new_rule_set = JSON.parse(JSON.stringify(rule_set))
        if (index >= 0 && index < new_rule_set.length) {
            new_rule_set[index] = {...new_rule_set[index], ...field_value}
            setRuleSet(new_rule_set)
            props.onUpdate(new_rule_set)
        }
    }

    return (
        <div className="px-5 py-4" style={{maxHeight: "600px", overflow: "auto"}}>

            <div className="row mb-3">
                <div className="col-6 d-flex alert alert-warning small py-2" role="alert">
                    HashTags start with #, one hashtag per rule.<br/>
                    Days, weeks, months, and years must be numbers.<br/>
                    Word values must be small, not sentences (~ 100 characters).<br/>
                    Lowercase word values match all cases, mixed-case words only match exact.
                </div>
                <div className="col-2 offset-1">
                </div>
                <div className="col-2 offset-1">
                    <a href={DOCUMENTATION.RULES_ENGINE} id="dlS3" target="_blank" rel="noreferrer"
                       title="Download the SimSage Rules Engine guide"
                       className="d-flex align-items-center flex-column text-center small alert alert-primary small py-2">
                        <BsFilePdf size={25}/>
                        <span className="me-2 mt-2"/>Rules Engine
                    </a>
                    <div className="mt-4">
                        <button type="button" className="btn btn-primary btn-small"
                                title="+ Add Rule" onClick={new_rule}
                                data-bs-dismiss="modal">+ Add Rule
                        </button>
                    </div>
                </div>
            </div>

            {
                rule_set.map((rule, index) => {
                    return (
                        <div key={index}>
                            <div className="row border-top">
                                <div className="col-4 d-flex mt-2">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="rule description"
                                           value={rule.description}
                                           title="A short description of what this rule is supposed to do"
                                           onChange={(event) => {
                                               update_rule(index, {"description": event.target.value})
                                           }}/>
                                </div>
                                <div className="col-2 d-flex mt-2">
                                    <input type="text"
                                           className="form-control"
                                           placeholder="#hashtag"
                                           value={rule.hashTag}
                                           title="the hashtag to add when this rule succeeds"
                                           onChange={(event) => {
                                               update_rule(index, {"hashTag": event.target.value})
                                           }}/>
                                </div>
                                <div className="col-4 d-flex mt-2">
                                    <div className="link-button d-flex justify-content-end">
                                        <button onClick={() => delete_rule(index)} type="button"
                                                className="btn text-danger btn-sm" title="remove this rule"
                                                data-bs-dismiss="modal">Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <RuleBuilder
                                    query={rule.query}
                                    onUpdate={(value) =>
                                        update_rule(index, {"query": value})
                                    }
                                />
                            </div>
                        </div>
                    )
                })
            }

        </div>
    )
}
