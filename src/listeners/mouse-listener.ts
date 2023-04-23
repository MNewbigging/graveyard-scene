import * as THREE from "three";

export class MouseListener {
  pointer = new THREE.Vector2();

  constructor() {
    window.addEventListener("mousemove", this.onMouseMove);
  }

  private onMouseMove = (event: MouseEvent) => {
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  };
}
