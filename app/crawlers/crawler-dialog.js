import React, {Component} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import TimeSelect from '../common/time-select'

import CrawlerGeneral from './crawler-general'
import CrawlerFile from './crawler-file'
import CrawlerWeb from "./crawler-web";


const styles = {
    formContent: {
        overflowY: 'scroll',
        height: '400px',
    },
    tab: {
        backgroundColor: '#f8f8f8',
        color: '#000',
    },
    timeTabContent: {
        marginLeft: '20px',
    }
};

// time schedule all selected
const defaultAllTimesSelected = 'mon-0,tue-0,wed-0,thu-0,fri-0,sat-0,sun-0,mon-1,tue-1,wed-1,thu-1,fri-1,sat-1,sun-1,mon-2,tue-2,wed-2,thu-2,fri-2,sat-2,sun-2,mon-3,tue-3,wed-3,thu-3,fri-3,sat-3,sun-3,mon-4,tue-4,wed-4,thu-4,fri-4,sat-4,sun-4,mon-5,tue-5,wed-5,thu-5,fri-5,sat-5,sun-5,mon-6,tue-6,wed-6,thu-6,fri-6,sat-6,sun-6,mon-7,tue-7,wed-7,thu-7,fri-7,sat-7,sun-7,mon-8,tue-8,wed-8,thu-8,fri-8,sat-8,sun-8,mon-9,tue-9,wed-9,thu-9,fri-9,sat-9,sun-9,mon-10,tue-10,wed-10,thu-10,fri-10,sat-10,sun-10,mon-11,tue-11,wed-11,thu-11,fri-11,sat-11,sun-11,mon-12,tue-12,wed-12,thu-12,fri-12,sat-12,sun-12,mon-13,tue-13,wed-13,thu-13,fri-13,sat-13,sun-13,mon-14,tue-14,wed-14,thu-14,fri-14,sat-14,sun-14,mon-15,tue-15,wed-15,thu-15,fri-15,sat-15,sun-15,mon-16,tue-16,wed-16,thu-16,fri-16,sat-16,sun-16,mon-17,tue-17,wed-17,thu-17,fri-17,sat-17,sun-17,mon-18,tue-18,wed-18,thu-18,fri-18,sat-18,sun-18,mon-19,tue-19,wed-19,thu-19,fri-19,sat-19,sun-19,mon-20,tue-20,wed-20,thu-20,fri-20,sat-20,sun-20,mon-21,tue-21,wed-21,thu-21,fri-21,sat-21,sun-21,mon-22,tue-22,wed-22,thu-22,fri-22,sat-22,sun-22,mon-23,tue-23,wed-23,thu-23,fri-23,sat-23,sun-23';

export class CrawlerDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,

            onSave: props.onSave,  // save callback
            onError: props.onError,

            selectedTab: 'general',

            // general tab items
            id: '',
            name: '',
            filesPerSecond: '',
            crawlerType: '',
            // time schedule
            schedule: '',

            // file crawler settings
            file_username: '',
            file_password: '',
            file_server: '',
            file_domain: '',
            file_share_name: '',
            file_share_path: '',

            // web crawler settings
            web_base_url: '',
            web_extension_filter: '',
            web_css: '',

            has_error: false,
        };
    }

    componentWillUnmount() {
    }

    componentDidCatch(error, info) {
        this.setState({has_error: true});
        console.log(error, info);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== null) {
            if (nextProps.crawler && nextProps.crawler) {

                const crawler = nextProps.crawler;

                let file_username = '';
                let file_password = '';
                let file_domain = '';
                let file_server = '';
                let file_share_name = '';
                let file_share_path = '';

                if (crawler.crawlerType === "file") {
                    if (crawler.specificJson && crawler.specificJson.length > 0) {
                        const obj = JSON.parse(crawler.specificJson);
                        file_username = obj['username'];
                        file_password = obj['password'];
                        file_domain = obj['domain'];
                        file_server = obj['server'];
                        file_share_name = obj['shareName'];
                        file_share_path = obj['sharePath'];
                    }
                }

                let web_base_url = '';
                let web_extension_filter = '';
                let web_css = '';
                if (crawler.crawlerType === "web") {
                    if (crawler.specificJson && crawler.specificJson.length > 0) {
                        const obj = JSON.parse(crawler.specificJson);
                        web_base_url = obj['baseUrlList'];
                        web_extension_filter = obj['validExtensions'];
                        web_css = obj['webCss'];
                    }
                }

                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onError: nextProps.onError,

                    id: crawler.id ? crawler.id : '',
                    name: crawler.name,
                    crawlerType: crawler.crawlerType,
                    filesPerSecond: crawler.filesPerSecond,
                    schedule: (crawler.schedule ? crawler.schedule : defaultAllTimesSelected),

                    file_username: file_username,
                    file_password: file_password,
                    file_domain: file_domain,
                    file_server: file_server,
                    file_share_name: file_share_name,
                    file_share_path: file_share_path,

                    web_base_url: web_base_url,
                    web_extension_filter: web_extension_filter,
                    web_css: web_css,

                });
            } else {
                this.setState({
                    open: nextProps.open,
                    title: nextProps.title,

                    onSave: nextProps.onSave,
                    onError: nextProps.onError,
                });
            }
        }
    }
    showError(title, error_msg) {
        if (this.props.onError) {
            this.props.onError(title, error_msg);
        }
    }
    handleCancel() {
        if (this.state.onSave) {
            this.state.onSave(null);
        }
        this.setState({open: false});
    };
    handleSave() {
        if (this.state.crawlerType === 'file' && (
            this.state.name.length === 0 ||
            this.state.file_username.length === 0 ||
            this.state.file_server.length === 0 ||
            this.state.file_share_name.length === 0)) {

            this.showError('invalid parameters', 'you must supply crawler-type, name, username, server and share path as a minimum.');

        } else if (this.state.crawlerType === 'web' && (
                this.state.web_base_url.length === 0 ||
                (!this.state.web_base_url.startsWith("http://") && !this.state.web_base_url.startsWith("https://")) )) {

            this.showError('invalid parameters', 'you must supply a base url of type http:// or https://');

        } else if (this.state.crawlerType !== 'web' && this.state.crawlerType !== 'file') {

            this.showError('invalid parameters', 'you must select a crawler-type first.');

        } else {

            let specificJson = {};
            if (this.state.crawlerType === 'file') {
                specificJson = JSON.stringify({
                    username: this.state.file_username,
                    password: this.state.file_password,
                    domain: this.state.file_domain,
                    server: this.state.file_server,
                    shareName: this.state.file_share_name,
                    sharePath: this.state.file_share_path,
                });
            } else if (this.state.crawlerType === 'web') {
                specificJson = JSON.stringify({
                    baseUrlList: this.state.web_base_url,
                    validExtensions: this.state.web_extension_filter,
                    webCss: this.state.web_css,
                });
            }

            // check parameters
            if (this.state.onSave) {
                this.state.onSave({
                    id: this.state.id,
                    name: this.state.name,
                    crawlerType: this.state.crawlerType,
                    filesPerSecond: parseInt(this.state.filesPerSecond),
                    schedule: this.state.schedule,
                    specificJson: specificJson,
                });
            }
        }
    };
    updateSchedule(time) {
        if (time !== null) {
            this.setState({schedule: time})
        }
    }
    update_control_data(data) {
        this.setState(data);
    }
    render() {
        if (this.state.has_error) {
            return <h1>crawler-dialog.js: Something went wrong.</h1>;
        }
        const t_value = this.state.selectedTab;
        return (
            <div>
                <Dialog aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                        open={this.state.open}
                        fullWidth={true}
                        maxWidth="md"
                        onClose={this.handleCancel.bind(this)} >
                    <DialogTitle id="alert-dialog-title">{this.state.title}</DialogTitle>
                    <div>
                        <div>
                            <Tabs value={this.state.selectedTab} onChange={(event, value)=> this.setState({selectedTab: value})}>
                                <Tab label="general" value="general" style={styles.tab} />
                                {this.state.crawlerType === "file" && <Tab label="file-crawler" value="file crawler" style={styles.tab} />}
                                {this.state.crawlerType === "web" && <Tab label="web-crawler" value="web crawler" style={styles.tab} />}
                                <Tab label="schedule" value="schedule" style={styles.tab} />
                            </Tabs>

                            <div style={styles.formContent}>
                                {t_value === 'general' &&
                                                            <CrawlerGeneral
                                                                name={this.state.name}
                                                                filesPerSecond={this.state.filesPerSecond}
                                                                crawlerType={this.state.crawlerType}
                                                                onError={(title, errStr) => this.showError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'file crawler' &&
                                                            <CrawlerFile
                                                                file_username={this.state.file_username}
                                                                file_password={this.state.file_password}
                                                                file_server={this.state.file_server}
                                                                file_domain={this.state.file_domain}
                                                                file_share_name={this.state.file_share_name}
                                                                file_share_path={this.state.file_share_path}
                                                                onError={(title, errStr) => this.showError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                                            }
                                {t_value === 'web crawler' &&
                                                            <CrawlerWeb
                                                                web_base_url={this.state.web_base_url}
                                                                web_css={this.state.web_css}
                                                                web_extension_filter={this.state.web_extension_filter}
                                                                onError={(title, errStr) => this.showError(title, errStr)}
                                                                onSave={(crawler) => this.update_control_data(crawler)}/>
                                }
                                {t_value === 'schedule' &&
                                                            <div style={styles.timeTabContent}>
                                                                <TimeSelect time={this.state.schedule}
                                                                            onSave={(time) => this.updateSchedule(time)}/>
                                                            </div>
                                }
                            </div>


                            </div>
                    </div>
                    <DialogActions>
                        <Button onClick={this.handleCancel.bind(this)}>cancel</Button>
                        <Button onClick={this.handleSave.bind(this)}>save</Button>
                    </DialogActions>

                </Dialog>
            </div>
        );
    }
}

export default CrawlerDialog;
