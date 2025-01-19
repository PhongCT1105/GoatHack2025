import { useState, useEffect } from "react";
import uiasound from "../utils/uia.mp3";
import uiastatic from '../utils/uiacatstatic.jpg';
import uiaspin from '../utils/uiacat.gif';

const CatComponent = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [audio] = useState(new Audio(uiasound)); // Create an Audio instance once

  useEffect(() => {
    if (isHovered) {
      audio.currentTime = 0; // Reset the sound to start from the beginning
      audio.play();
    } else {
      audio.pause(); // Pause the sound when not hovered
      audio.currentTime = 0; // Reset the sound to the start
    }

    return () => {
      // Cleanup: Stop and reset the audio if the component unmounts
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isHovered, audio]);

  return (
    <div
      className="relative flex justify-center items-center w-60 h-60 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="transition-transform duration-500 ease-in-out">
        {!isHovered ? (
          // Static cat image
          <img
            src={uiastatic}
            alt="Static Cat"
            className="w-full h-full object-cover"
          />
        ) : (
          // Spinning cat gif on hover
          <img
            src={uiaspin}
            alt="Spinning Cat"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    </div>
  );
};

export default CatComponent;
