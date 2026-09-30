import React from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import "@videojs/http-streaming";
import "videojs-http-source-selector";
import "video.js/dist/video-js.css";

interface VideoJSProps {
  options: any; // videojs options are quite complex, keeping any for flexibility or use videojs.PlayerOptions
  onReady?: (player: Player) => void;
}

const VideoJS = (props: VideoJSProps) => {
  const videoRef = React.useRef<HTMLDivElement>(null);
  const playerRef = React.useRef<Player | null>(null);
  const { options, onReady } = props;

  React.useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("video-js");
      videoElement.classList.add("vjs-big-play-centered");

      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);

        const player = (playerRef.current = videojs(
          videoElement,
          options,
          () => {
            onReady && onReady(player);
          }
        ));

        // Initialize the httpSourceSelector plugin
        player.ready(() => {
          // @ts-ignore
          if (typeof player.httpSourceSelector === 'function') {
            // @ts-ignore
            player.httpSourceSelector();
          }
        });
      }
    } else {
      const player = playerRef.current;
      if (player) {
        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }
  }, [options]);

  React.useEffect(() => {
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};

export default VideoJS;
