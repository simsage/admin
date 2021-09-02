import React from 'react';

import '../css/single-search-result.css';


export class SingleSearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            has_error: false,
            item: this.props.item,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            item: nextProps.item,
        });
    }

    componentDidCatch(error, info) {
        this.setState({ has_error: true });
        console.log(error, info);
    }

    // helper - highlight SimSage matching keywords at various levels
    static highlight(str) {
        if (str && str.replace) {
            str = str.replace(/{hl1:}/g, "<span class='hl1'>");
            str = str.replace(/{hl2:}/g, "<span class='hl2'>");
            str = str.replace(/{:hl1}/g, "</span>");
            str = str.replace(/{:hl2}/g, "</span>");
            str = str.replace(/\n/g, "<br />");
        }
        return str;
    }
    prevFragment() {
        const item = this.state.item;
        if (item && item.textIndex > 0) {
            item.textIndex -= 1;
            this.setState({item: item});
        }
    }
    nextFragment() {
        const item = this.state.item;
        if (item && item.textIndex + 1 < item.textList.length) {
            item.textIndex += 1;
            this.setState({item: item});
        }
    }
    getPreviewSource(item) {
        return "http://localhost:8080/api/document/preview/" + this.props.organisationId + "/" +
                    this.props.kbId + "/" + this.props.clientId + "/" + item.urlId + "/-1"
    }
    getBinarySource(item) {
        return "http://localhost:8080/api/document/binary/" + this.props.organisationId + "/" +
            this.props.kbId + "/" + this.props.clientId + "/" + item.urlId;
    }
    render() {
        if (this.state.has_error) {
            return <h1>single-search-result: Something went wrong.</h1>;
        }
        const item = this.state.item;
        return (
            <div className="single-search-result-page">

                <div className="title"><a href={this.getPreviewSource(item)} target="_blank" rel="noreferrer">{item.title}</a></div>
                <div>
                    {item.textIndex > 0 &&
                    <span className="prev-fragment" onClick={() => this.prevFragment()}>&lt;</span>
                    }
                    {item.textIndex === 0 &&
                    <span className="prev-fragment-disabled">&lt;</span>
                    }
                    {item.textIndex + 1 < item.textList.length &&
                    <span className="next-fragment" onClick={() => this.nextFragment()}>&gt;</span>
                    }
                    {item.textIndex + 1 >= item.textList.length &&
                    <span className="next-fragment-disabled">&gt;</span>
                    }
                </div>

                <div className="text" dangerouslySetInnerHTML={{__html: SingleSearchResult.highlight(item.textList[item.textIndex])}}/>

                <div className="preview-image">
                    <img src={this.getPreviewSource(item)} alt={item.title} className="preview-image" title={item.title} />
                </div>

                <div>
                    <span className="author">{item.author}</span>
                    <span className="url'" onClick={() => { if (this.props.openDocument) this.props.openDocument(item.url)} }>{item.url}</span>
                </div>
                <div className="spacer" />
            </div>
        )
    }

}

export default SingleSearchResult;

