import React from 'react';
import YouTube from 'react-youtube';

// CSS
import "../../css/home.css"

export default class HomeYoutubeCarousel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const opts = {
            height: '100%',
            width: '100%',
            playerVars: {
                autoplay: 0
            }
        };
      

        return (
            <div className = "home-youtube-holder">
                <YouTube
                    videoId="KQszW5t4H04"
                    opts={opts}
                />
            </div>
        )
    }
}