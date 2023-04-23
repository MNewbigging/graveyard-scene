import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { CoffinLidAnimation } from "../prop-states/coffin-lid-animation";
import { FlameAnimation } from "../prop-states/flame-animation";
import { GameLoader } from "../loaders/game-loader";
import { Intersecter } from "./intersecter";
import { MouseListener } from "../listeners/mouse-listener";
import { addGui } from "../utils/utils";

export class GameState {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private mouseListener = new MouseListener();
  private intersecter: Intersecter;

  private gui = new GUI();
  private flameAnimations: FlameAnimation[] = [];
  private coffingLidAnimation = new CoffinLidAnimation();

  constructor(
    private canvas: HTMLCanvasElement,
    private gameLoader: GameLoader
  ) {
    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 3, 0.5);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    THREE.ColorManagement.legacyMode = false;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor("#262837");
    window.addEventListener("resize", this.onCanvasResize);
    this.onCanvasResize();

    this.intersecter = new Intersecter(
      this.mouseListener,
      this.camera,
      this.scene
    );

    // Camera Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, 3, -2);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight();
    this.scene.add(directLight);

    this.cryptSconceLights();

    // Fog
    //this.scene.fog = new THREE.Fog("#262837", 1, 15);

    // Add scene object
    const graveyard = this.gameLoader.modelLoader.get("graveyard");
    if (graveyard) {
      graveyard.rotateY(Math.PI / 2);
      this.scene.add(graveyard);
    }

    const lid = graveyard?.getObjectByName("lid");
    if (lid) {
      addGui(lid);
    }

    // Start game
    this.update();
  }

  private cryptSconceLights() {
    // Setup objects
    const flame = this.gameLoader.modelLoader.get("flame");
    if (!flame) {
      return;
    }

    const flameLeft = flame.clone();
    flameLeft.position.set(-0.733, 3.32, -0.48);
    this.scene.add(flameLeft);

    const flameRight = flame.clone();
    flameRight.position.set(0.74, 3.32, -0.48);
    this.scene.add(flameRight);

    // Setup lights
    const sconceLeftLight = new THREE.PointLight("#ff8d00");
    sconceLeftLight.decay = 6;
    sconceLeftLight.distance = 20;
    sconceLeftLight.castShadow = true;
    sconceLeftLight.shadow.bias = -0.005;
    sconceLeftLight.shadow.camera.far = 5;
    sconceLeftLight.position.set(-0.73, 3.3, -0.46);
    this.scene.add(sconceLeftLight);

    const sconceRightLight = new THREE.PointLight("#ff8d00");
    sconceRightLight.decay = 6;
    sconceRightLight.distance = 20;
    sconceRightLight.castShadow = true;
    sconceRightLight.shadow.bias = -0.005;
    sconceRightLight.shadow.camera.far = 5;
    sconceRightLight.position.set(0.74, 3.3, -0.46);
    this.scene.add(sconceRightLight);

    // Setup animations
    this.flameAnimations.push(new FlameAnimation(flameLeft, sconceLeftLight));
    this.flameAnimations.push(new FlameAnimation(flameRight, sconceRightLight));
  }

  private onCanvasResize = () => {
    this.renderer.setSize(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      false
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;

    this.camera.updateProjectionMatrix();
  };

  private update = () => {
    requestAnimationFrame(this.update);

    const dt = this.clock.getDelta();

    this.flameAnimations.forEach((anim) => anim.update(dt));

    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  };
}
