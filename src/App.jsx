import "./App.css";
import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
const Vis = () => {
  const { useRef, useLayoutEffect, useState, useEffect } = React;
  const mount = useRef(null);
  const [isAnimating, setAnimating] = useState(true);
  const [legColor, setlegColor] = useState(null);
  const [splintColor, setsplintColor] = useState(null);

  const controlsAnimation = useRef(null);

  let width = screen.width;
  let height = screen.height;
  let frameId;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor("#262837");
  camera.position.z = 4;
  renderer.setSize(width, height);
  const renderScene = () => {
    renderer.render(scene, camera);
  };
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  const gltfloader = new GLTFLoader();
  //Light
  const pointLight = new THREE.AmbientLight(0xffffff, 3);
  scene.add(pointLight);

  function createsplint(color) {
    let pos_x = 0,
      pos_y = 0,
      pos_z = 0,
      scale_x = 0.4,
      scale_y = 0.4,
      scale_z = 0.4;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/js/libs/draco/"),
      gltfloader.setDRACOLoader(dracoLoader),
      gltfloader.load("./src/last.glb", function (gltf) {
        if (color) {
          gltf.scene.children[0].material.color.set(color);
        }
        (gltf.scene.rotation.y = 3.1),
          gltf.scene.position.set(pos_x, pos_y, pos_z),
          gltf.scene.scale.set(scale_x, scale_y, scale_z),
          (gltf.scene.castShadow = !0),
          (gltf.scene.receiveShadow = !0),
          scene.add(gltf.scene),
          (gltf.scene.userData.ground = !0);
      });
  }

  function createleg(color) {
    let pos_x = 0,
      pos_y = 0,
      pos_z = 0,
      scale_x = 0.38,
      scale_y = 0.38,
      scale_z = 0.38;
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/js/libs/draco/"),
      gltfloader.setDRACOLoader(dracoLoader),
      gltfloader.load("./src/leg.gltf", function (gltf) {
        if (color) {
          gltf.scene.children[0].material.color.set(color);
        }
        (gltf.scene.rotation.y = 3.1),
          gltf.scene.position.set(pos_x, pos_y, pos_z),
          gltf.scene.scale.set(scale_x, scale_y, scale_z),
          (gltf.scene.castShadow = !0),
          (gltf.scene.receiveShadow = !0),
          scene.add(gltf.scene),
          (gltf.scene.userData.ground = !0);
      });
  }

  const handleResize = () => {
    width = mount.current.clientWidth;
    height = mount.current.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderScene();
  };

  const animate = () => {
    renderScene();
    frameId = window.requestAnimationFrame(animate);
  };

  const start = () => {
    if (!frameId) {
      frameId = requestAnimationFrame(animate);
    }
  };

  useLayoutEffect(() => {
    //add splint
    createsplint();

    //create leg
    createleg();

    start();
    mount.current.appendChild(renderer.domElement);
    window.addEventListener("resize", handleResize);
    // controlsAnimation.current = { start };
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.current.removeChild(renderer.domElement);
    };
  });

  return (
    <div>
      <div
        className="vis"
        ref={mount}
        onClick={() => setAnimating(!isAnimating)}
      />
      <div id="options">
        <label id="click">leg:</label>
        <input
          id="myColor"
          type="color"
          defaultValue="#f6b73c"
          className="colors"
          onChange={(e) => {
            createleg(e.target.value);
          }}
        />
        <label id="click1">splint:</label>
        <input
          id="myColor1"
          type="color"
          className="colors"
          defaultValue="#ffffff"
          onChange={(e) => {
            createsplint(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Vis;
