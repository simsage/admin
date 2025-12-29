import React from 'react';
import {QueryBuilderBootstrap} from "@react-querybuilder/bootstrap";
import {QueryBuilder} from "react-querybuilder";
import 'react-querybuilder/dist/query-builder.css';

const fields = [
    { name: 'body', label: 'Document Content' },
    { name: 'title', label: 'metadata: Title' },
    { name: 'url', label: 'metadata: URL' },
    { name: 'author', label: 'metadata: Author' },
    { name: 'last_modified', label: 'Last Modified date' },
    { name: 'created', label: 'Created date' },
];

const getOperators = (fieldName) => {
    if (fieldName === 'last_modified' || fieldName === 'created') {
        return [
            { name: 'days', label: 'more than this many days old' },
            { name: 'weeks', label: 'more than this many weeks old' },
            { name: 'months', label: 'more than this many months old' },
            { name: 'years', label: 'more than this many years old' },
            { name: 'days-', label: 'less than this many days old' },
            { name: 'weeks-', label: 'less than this many weeks old' },
            { name: 'months-', label: 'less than this many months old' },
            { name: 'years-', label: 'less than this many years old' },
        ]
    }
    return [
        { name: 'contains', label: 'contains word' },
        { name: 'beginsWith', label: 'starts with' },
        { name: 'endsWith', label: 'ends with' },
        { name: '=', label: 'is exactly' },
        { name: 'not_contains', label: 'does not contain word' },
        { name: 'not_beginsWith', label: 'does not start with' },
        { name: 'not_endsWith', label: 'does not end with' },
        { name: '!=', label: 'is not equal to' },
    ];
};

export function RuleBuilder(props) {

    return (
        <div className="px-5 py-4" style={{maxHeight: "600px", overflow: "auto"}}>

            <div style={{width: "80%"}}>
                <QueryBuilderBootstrap>
                    <QueryBuilder
                        fields={fields}
                        query={props.query}
                        onQueryChange={q => props.onUpdate(q)}
                        getOperators={getOperators}
                        controlClassnames={{ queryBuilder: 'queryBuilder-branches' }}
                    />
                </QueryBuilderBootstrap>
            </div>

            {/*<pre>*/}
            {/*    <code>{JSON.stringify(formatQuery(props.query, 'json'))}</code>*/}
            {/*</pre>*/}

        </div>
    )
}
