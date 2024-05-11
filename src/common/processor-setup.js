import React, {Component} from 'react';

import '../css/acl-setup.css';
import Api from "./api";
import {Editor} from "@monaco-editor/react";
import {configureMonacoYaml} from "monaco-yaml";
import {configureMonaco} from "./monaco";


// create acls from groups
export class ProcessorSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            onSave: props.onSave,
            processorConfig: Api.defined(props.processorConfig) ? props.processorConfig : '',
        };
    }
    UNSAFE_componentWillReceiveProps(props, context) {
        this.setState({
            processorConfig: props.processorConfig ? props.processorConfig: "",
        })
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }

    change_callback(data) {

        this.setState(data);
        if (this.state.onSave) {
            this.state.onSave(Api.defined(data.processorConfig) ? data.processorConfig : '');
        }
    }

    render() {
        if (this.state.has_error) {
            return <h1>acl-setup.js: Something went wrong.</h1>;
        }
        return (
            <div className="row mb-3">

                <div className="form-group">
                    <div className="">
                        <label className="label-2 small">Processor Configuration</label>

                            <Editor
                                className={"monaco_yaml"}
                                beforeMount={configureMonaco}
                                path="processor.yml"
                                height="400px"
                                placeholder="Processor Configuration YAML..."
                                language="yaml"
                                value={this.state.processorConfig}
                                onChange={(value, event) => {
                                    this.change_callback({processorConfig: value})
                                }}
                            />

                    </div>
                </div>

            </div>
        );
    }
}

export default ProcessorSetup;
