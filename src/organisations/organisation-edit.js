import React, {Component} from 'react';


export class OrganisationEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,

            id: this.props.id,
            name: this.props.name,
            enabled: this.props.enabled,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave({
                id: this.state.id,
                name: this.state.name,
                enabled: this.state.enabled,
            });
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            onSave: props.onSave,
            onError: props.onError,

            id: props.id,
            name: props.name,
            enabled: props.enabled,
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>organisation-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open)
            return (<div />);
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-lg"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">Edit Organisation</div>
                        <div className="modal-body">
                            <div>

                                <div className="control-row">
                                    <span className="label-2">name</span>
                                    <span className="text">
                                        <input type="text" className="form-control"
                                               autoFocus={true}
                                               onChange={(event) => this.setState({name: event.target.value})}
                                               placeholder="name"
                                               value={this.state.name}
                                        />
                                    </span>
                                </div>


                                <div className="control-row">
                                    <span className="checkbox-only">
                                        <input type="checkbox"
                                            checked={this.state.enabled}
                                            onChange={(event) => { this.setState({enabled: event.target.checked}); }}
                                            value="enable this organisation?"
                                        />
                                    </span>
                                    <span>organisation enabled?</span>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>Cancel</button>
                            <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>Save</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default OrganisationEdit;
