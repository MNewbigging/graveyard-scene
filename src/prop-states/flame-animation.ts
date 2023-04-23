import * as THREE from "three";

import { randomRange } from "../utils/utils";

/**
 * This class is given the mesh and light to animate.
 */
export class FlameAnimation {
  private minScale = 0.8;
  private maxScale = 1.8;
  private growthSpeed = 0.25;

  constructor(
    public flameMesh: THREE.Object3D,
    public light: THREE.PointLight
  ) {}

  update(dt: number) {
    // Scale on the y
    this.flameMesh.scale.y += dt * this.growthSpeed;

    // Reached scale limit in this direction?
    if (
      Math.sign(this.growthSpeed) === 1 &&
      this.flameMesh.scale.y >= this.maxScale
    ) {
      this.reset();
    } else if (
      Math.sign(this.growthSpeed) === -1 &&
      this.flameMesh.scale.y <= this.minScale
    ) {
      this.reset();
    }

    // Adjust light intensity
    this.light.intensity = this.flameMesh.scale.y - 0.3;
  }

  private reset() {
    // New growth speed
    const newSpeed = randomRange(0.2, 0.45);
    this.growthSpeed = newSpeed * Math.sign(this.growthSpeed);

    // New min and max values
    this.minScale = randomRange(0.85, 1.2);
    this.maxScale = randomRange(1.4, 1.8);

    // Flip growth direction
    this.growthSpeed *= -1;
  }
}
