import * as THREE from "three";

/**
 * This class is given the mesh and light to animate.
 */
export class FlameAnimation {
  private minScale = new THREE.Vector3(1, 1, 1);
  private maxScale = new THREE.Vector3(2, 200, 2);
  private growthSpeed = 20;

  constructor(
    public flameMesh: THREE.Object3D,
    public light: THREE.PointLight
  ) {
    console.log("flameMEsh", flameMesh.scale);
  }

  update(dt: number) {
    // If going up, increase the scale

    this.flameMesh.scale.y += dt * this.growthSpeed;

    // Reached max scale?
    if (this.flameMesh.scale.y >= this.maxScale.y) {
      // Going down
      this.growthSpeed *= -1;
    } else if (this.flameMesh.scale.y <= this.minScale.y) {
      // Going up
      this.growthSpeed *= -1;
    }

    console.log("mesh scale y", this.flameMesh.scale.y);
  }
}
