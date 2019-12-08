// Loading the react components
import React from 'react';

// CSS
import "../../css/CCTV/cctv.css"

export default class CCTV extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        document.title = "NAPHE | CCTV";
    }

    render() {

        return (
            <div className = "cctv">
                <div className = "cctv_left_holder">
                    <div className = "cctv_left_title">
                        All CCTV Streams
                    </div>
                </div>

                <CCTVScreen />
            </div>
        )
    }
}

class CCTVScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "cctv_view_holder">

            </div>
        )
    }
}