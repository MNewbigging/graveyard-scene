import * as THREE from "three";
import { gsap } from "gsap";

import { eventListener } from "../listeners/event-listener";

export class CoffinLidAnimation {
  private playing = false;
  private startPositionX = 0;
  private startRotationY = 0;
  private animationDuration = 2;

  constructor() {
    eventListener.on("intersected-object", this.onIntersectedObject);
  }

  private onIntersectedObject = (object: THREE.Object3D) => {
    // Was the intersected obect the coffin lid?
    if (object.name !== "lid") {
      return;
    }

    // Don't re-play
    if (this.playing) {
      return;
    }

    // Save start values
    this.startPositionX = object.position.x;
    this.startRotationY = object.rotation.y;

    // Move the lid to the side
    this.playing = true;
    gsap.to(object.position, { duration: this.animationDuration, x: 0.2 });
    gsap.to(object.rotation, { duration: this.animationDuration, y: 0.259 });

    // Wait 2 seconds then move it back
    setTimeout(() => {
      gsap.to(object.position, {
        duration: this.animationDuration,
        x: this.startPositionX,
      });
      gsap.to(object.rotation, {
        duration: this.animationDuration,
        y: this.startRotationY,
        onComplete: () => {
          this.playing = false;
        },
      });
    }, 4000);
  };
}
