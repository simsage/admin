import React from 'react';

import '../css/mind.css';


export class BotSingleSearchResult extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            has_error: false,
            item: props.item,
            openDocument: props.openDocument,
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        // see if we have data to start this dialog
        if (nextProps) {
            this.setState({
                item: nextProps.item,
                openDocument: nextProps.openDocument,
            })
        }
    }
    componentDidCatch(error, info) {
        this.setState({ has_error: true });
    }
    static highlight(str) {
        if (str && str.replace) {
            str = str.replace(/{hl1:}/g, "<span class='hl1'>");
            str = str.replace(/{hl2:}/g, "<span class='hl2'>");
            str = str.replace(/{hl3:}/g, "<span class='hl3'>");
            str = str.replace(/{:hl1}/g, "</span>");
            str = str.replace(/{:hl2}/g, "</span>");
            str = str.replace(/{:hl3}/g, "</span>");
            str = str.replace(/\n/g, "<br />");
        }
        return str;
    }

    toText(memory) {
        return memory.text.replace("<br />", "\n");
    }

    render() {
        if (this.state.has_error) {
            return <h1>bot-single-search-result: Something went wrong.</h1>;
        }
        const item = this.state.item;
        return (
            <div className="mind-search-results">
                <span className="mind-score">{item.score.toFixed(2)}</span>
                <span className="mind-id">{"id:" + item.url}</span>
                <span className="mind-result-text">{this.toText(item)}</span>


                <div className="image-list-container">
                    {
                        item.imageList && item.imageList.map((image) => {
                            return (<div key={image} className="image-holder"><img alt="search result" src={image} className="preview-image-size" /></div>);
                        })
                    }
                </div>

                <br clear="both" />

                <div className="url-list-container">
                    {
                        item.urlList && item.urlList.map((url) => {
                            return (<div className="url-style" key={url}><a href={url} rel="noopener noreferrer" target={"_blank"}>{url}</a></div>);
                        })
                    }
                </div>

            </div>
        );
    }

}

export default BotSingleSearchResult;

