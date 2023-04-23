import * as THREE from "three";

import { MouseListener } from "../listeners/mouse-listener";
import { eventListener } from "../listeners/event-listener";

export class Intersecter {
  private raycaster = new THREE.Raycaster();

  constructor(
    private mouseListener: MouseListener,
    private camera: THREE.Camera,
    private scene: THREE.Scene
  ) {
    document.addEventListener("pointerdown", this.onPointerDown);
  }

  private onPointerDown = () => {
    // Raycast and see if it hit something
    this.raycaster.setFromCamera(this.mouseListener.pointer, this.camera);

    const intersects = this.raycaster.intersectObjects(this.scene.children);

    eventListener.fire("intersected-object", intersects[0].object);
  };
}
