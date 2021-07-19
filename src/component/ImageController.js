import React from "react";
import ReactDOM from "react-dom";

/*
    This class exntirely exists as a way of grabbing renders or icons from the eve image server.
    We have multiple classes for a couple of sets of use cases.
*/

export class URLImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = {this.props.className}>
                <img className = {this.props.imgClassName} src={this.props.url} />
            </div>
        )
    }
}

export class ImageRender extends URLImage {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <URLImage className = {this.props.className} url = {"https://images.evetech.net/types/"+ this.props.invType + "/render"} />
        )
    }
}

export class ImageIcon extends URLImage {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <URLImage className = {this.props.className} url = {"https://images.evetech.net/types/"+ this.props.invType + "/icon"} />
        )
    }
}