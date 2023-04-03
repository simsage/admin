import React, {Component} from 'react';

import '../css/acl-setup.css';
import Api from "./api";


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
        console.log(error, info);
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
            <div>

                <div className="form-group">
                    <div className="full-column-2">
                        <span >Processor config</span>
                    </div>
                    <div className="full-column-2">
                        <span className="bigger-text">
                            <form>
                                <textarea className="textarea-width"
                                       spellCheck={false}
                                       rows={15}
                                       placeholder="Json for the processor configuration"
                                       value={this.state.processorConfig}
                                       onChange={(event) => {
                                           this.change_callback({processorConfig: event.target.value})
                                       }}
                                />
                            </form>
                        </span>
                    </div>
                </div>

            </div>
        );
    }
}

export default ProcessorSetup;
