import React, {Component} from 'react';

import Api from '../common/api';

import '../css/crawler.css';


export class CrawlerNFS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,

            onSave: props.onSave,
            onError: props.onError,

            // nfs drive properties
            nfs_local_folder: props.nfs_local_folder ? props.nfs_local_folder : '',
            specific_json: props.specific_json,
        };

    }
    componentWillUnmount() {
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps !== null) {
            this.setState({
                nfs_local_folder: Api.defined(nextProps.nfs_local_folder) ? nextProps.nfs_local_folder : '',
                specific_json: nextProps.specific_json,
                onSave: nextProps.onSave,
                onError: nextProps.onError,
            });
        }
    }
    construct_data(data) {
        return {
            ...this.state.specific_json,
            nfs_local_folder: Api.defined(data.nfs_local_folder) ? data.nfs_local_folder : this.state.nfs_local_folder,
        };
    }
    change_callback(data) {
        this.setState(data);
        if (this.state.onSave) {
            const c_data = this.construct_data(data);
            this.state.onSave(c_data);
        }
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-nfs.js: Something went wrong.</h1>;
        }
        return (
            <div className="crawler-page">

                <div className="form-group">
                    <span className="left-column">
                        <span className="small-label-right">local folder</span>
                        <span className="big-text">
                            <form>
                                <input type="text" className="form-control nfs-width"
                                    placeholder="local folder"
                                    value={this.state.nfs_local_folder}
                                    onChange={(event) => {this.change_callback({nfs_local_folder: event.target.value})}}
                                />
                            </form>
                        </span>
                    </span>
                </div>

            </div>
        );
    }
}

export default CrawlerNFS;
