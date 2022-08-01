import React, {Component} from 'react';


export class CrawlerImportExport extends Component {
    constructor(props) {
        super(props);
        var data = (props.crawler) ? JSON.stringify(props.crawler) : "";
        if (data === "{}") {
            data = "";
        }
        this.state = {
            has_error: false,
            open: props.open,
            data: data,
            onSave: props.onSave,
            onError: props.onError,
        };
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    handleSave() {
        if (this.state.onSave) {
            this.state.onSave(this.state.data);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
    }
    UNSAFE_componentWillReceiveProps(props) {
        var data = (props.crawler) ? JSON.stringify(props.crawler) : "";
        if (data === "{}") {
            data = "";
        }
        this.setState({
            open: props.open,
            data: data,
            onSave: props.onSave,
            onError: props.onError,
        })
    }
    render() {
        if (this.state.has_error) {
            return <h1>mind-edit.js: Something went wrong.</h1>;
        }
        if (!this.state.open) {
            return (<div />);
        }
        return (
            <div className="modal" tabIndex="-1" role="dialog" style={{display: "inline"}}>
                <div className={"modal-dialog modal-dialog-centered modal-xl"} role="document">
                    <div className="modal-content shadow p-3 mb-5 bg-white rounded">

                        <div className="modal-header">{this.props.export_upload ? "Import Crawler" : "Export Crawler"}</div>
                        <div className="modal-body">
                            <div>

                                <div>data</div>
                                <div>
                                    <textarea
                                        autoFocus={true}
                                        style={{width: "100%"}}
                                        onChange={(event) => this.setState({data: event.target.value})}
                                        placeholder="crawler data"
                                        spellCheck={false}
                                        rows={10}
                                        value={this.state.data}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            {this.props.export_upload &&
                            <div>
                                <button className="btn btn-primary btn-block" style={{marginRight: "8px"}} onClick={() => this.handleCancel()}>Cancel</button>
                                <button className="btn btn-primary btn-block" onClick={() => this.handleSave()}>Import</button>
                            </div>
                            }
                            {!this.props.export_upload &&
                            <div>
                                <button className="btn btn-primary btn-block" onClick={() => this.handleCancel()}>Close</button>
                            </div>
                            }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default CrawlerImportExport;
