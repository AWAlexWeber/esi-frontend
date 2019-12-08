// Loading the react components
import React from 'react';

// CSS
import "../../css/CCTV/cctv.css"
import "../../css/CCTV/cctv_tokens.css"

export default class CCTVTokens extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "NAPHE | CCTV";
    }

    render() {

        return (
            <div className = "cctv">
                CCTV Tokens
            </div>
        )
    }
}