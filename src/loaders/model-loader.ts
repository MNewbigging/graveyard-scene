import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ModelLoader {
  loading = false;
  readonly models = new Map<string, THREE.Object3D>();

  private loadingManager = new THREE.LoadingManager();

  get(modelName: string) {
    return this.models.get(modelName)?.clone();
  }

  load(onLoad: () => void) {
    // Setup loading manager
    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      console.log(
        `Loading model: ${url}. \n Loaded ${itemsLoaded} of ${itemsTotal}.`
      );
    };

    this.loadingManager.onLoad = () => {
      this.loading = false;
      onLoad();
    };

    // Start loading
    this.loading = true;

    // If you need a texture atlas for the models, load it here first
    // remember to set texture.encoding = THREE.sRGBEncoding;
    // Then pass it to load models and on each model,
    // traverse each loaded model and assign material.map to atlas to each mesh child node

    this.loadModels();
  }

  private loadModels() {
    // GLTF Files
    const gltfLoader = new GLTFLoader(this.loadingManager);

    const sceneUrl = new URL("/graveyardScene.glb", import.meta.url).href;
    gltfLoader.load(sceneUrl, (gltf) => {
      // Traverse the gltf scene
      gltf.scene.traverse((child) => {
        const node = child as THREE.Mesh;
        if (node.isMesh) {
          // I could have arrays of meshes I want to cast/receive instead of doing all...
          node.castShadow = true;
          node.receiveShadow = true;
        }

        if (node.material) {
          const mat = node.material as THREE.MeshStandardMaterial;
          mat.metalness = 0;
          mat.roughness = 0.8;
        }

        // End traverse
      });

      this.models.set("graveyard", gltf.scene);
    });

    // FBX Files
    const fbxLoader = new FBXLoader(this.loadingManager);
    const flameMaterial = new THREE.MeshStandardMaterial({
      color: "#FDD6A3",
      emissive: "#FFFF19",
    });
    const flameUrl = new URL("/flame.fbx", import.meta.url).href;
    fbxLoader.load(flameUrl, (object) => {
      object.traverse((child) => {
        const node = child as THREE.Mesh;
        if (node.isMesh) {
          // Setup the flame material
          node.material = flameMaterial;
        }
      });

      this.models.set("flame", object);
    });
  }
}
