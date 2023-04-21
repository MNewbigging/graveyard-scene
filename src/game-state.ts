import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { FlameAnimation } from "./prop-states/flame-animation";
import { GameLoader } from "./loaders/game-loader";
import { addGui } from "./utils/utils";

export class GameState {
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private clock = new THREE.Clock();

  private gui = new GUI();
  private flameAnimations: FlameAnimation[] = [];

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
    this.scene.fog = new THREE.Fog("#262837", 1, 15);

    // Add scene object
    const graveyard = this.gameLoader.modelLoader.get("graveyard");
    if (graveyard) {
      graveyard.rotateY(Math.PI / 2);
      this.scene.add(graveyard);
    }

    // Start game
    this.update();
  }

  private cryptSconceLights() {
    // Setup lights
    const sconceLeftLight = new THREE.PointLight("#ff8d00");
    sconceLeftLight.castShadow = true;
    sconceLeftLight.shadow.bias = -0.005;
    sconceLeftLight.shadow.camera.far = 5;
    sconceLeftLight.position.set(-0.73, 3.3, -0.46);
    this.scene.add(sconceLeftLight);

    const sconceRightLight = new THREE.PointLight("#ff8d00");
    sconceRightLight.castShadow = true;
    sconceRightLight.shadow.bias = -0.005;
    sconceRightLight.shadow.camera.far = 5;
    sconceRightLight.position.set(0.74, 3.3, -0.46);
    this.scene.add(sconceRightLight);

    // Setup animations
    const graveyard = this.gameLoader.modelLoader.get("graveyard");
    if (!graveyard) {
      return;
    }

    const sconceLeftFlame = graveyard.getObjectByName(
      "SM_Prop_Candle_Flame_01"
    );
    if (sconceLeftFlame) {
      console.log("flame", sconceLeftFlame);

      sconceLeftFlame.scale.y = 20;

      this.flameAnimations.push(
        new FlameAnimation(sconceLeftFlame, sconceLeftLight)
      );
    }
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
