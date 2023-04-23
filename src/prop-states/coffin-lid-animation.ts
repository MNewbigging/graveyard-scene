import * as THREE from "three";

import { eventListener } from "../listeners/event-listener";

export class CoffinLidAnimation {
  constructor() {
    eventListener.on("intersected-object", this.onIntersectedObject);
  }

  private onIntersectedObject = (object: THREE.Object3D) => {
    // Was the intersected obect the coffin lid?
    if (object.name !== "lid") {
      return;
    }

    console.log("hit lid");
  };
}
