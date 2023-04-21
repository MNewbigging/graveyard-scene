import * as THREE from "three";
import GUI from "lil-gui";

export function addGui(object: THREE.Object3D, name = "") {
  const gui = new GUI();

  gui
    .add(object.position, "x")
    .name(name + " pos x")
    .min(-100)
    .max(100)
    .step(0.01);
  gui
    .add(object.position, "y")
    .name(name + " pos y")
    .min(-100)
    .max(100)
    .step(0.01);
  gui
    .add(object.position, "z")
    .name(name + " pos z")
    .min(-100)
    .max(100)
    .step(0.01);

  gui
    .add(object.rotation, "y")
    .name(name + " rot y")
    .min(0)
    .max(Math.PI * 2)
    .step(0.001);

  gui.add(object.scale, "x").name(name + " scale x");
}
