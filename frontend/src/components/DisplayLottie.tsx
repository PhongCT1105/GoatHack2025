// src/components/DisplayLottie.tsx

import React, { Component, Suspense } from "react";
import Lottie from "lottie-react";

interface DisplayLottieProps {
  animationData: object; // You can specify a more specific type for the animation data here if needed.
}

export default class DisplayLottie extends Component<DisplayLottieProps> {
  render() {
    const { animationData } = this.props;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Lottie
          animationData={defaultOptions.animationData}
          loop={defaultOptions.loop}
        />
      </Suspense>
    );
  }
}
