import * as THREE from 'three';

import BLEGATTClient from './blegattclient';
import Particles from './particles';
import { WEBGL } from './WebGL.js';

class Main {
  plugin = new BLEGATTClient();

  buttonA = new Particles(new THREE.Vector3( 0.4, 0.01, 0));
  buttonB = new Particles(new THREE.Vector3(-0.4, 0.01, 0));

  prevButtonAState = 0;
  prevButtonBState = 0;

  scene: THREE.Scene = null;
  camera: THREE.PerspectiveCamera = null;
  renderer: THREE.WebGLRenderer = null;
  object: THREE.Group = null;

  start() {
    this.init(window.innerWidth, window.innerHeight);
    this.update();
  }

  update() {
    requestAnimationFrame(this.update.bind(this));

    // 加速度センサの値を取得します
    const ax = this.plugin.accelerometerDataX;
    const ay = this.plugin.accelerometerDataY;
    const az = this.plugin.accelerometerDataZ;

    // x軸、z軸方向の傾きを求めます
    const roll = Math.atan2(-ax, -az);
    const pitch = Math.atan2(-ay, Math.sqrt(ax * ax + az * az));

    // 求めた傾きを設定します
    const euler = new THREE.Euler(pitch, 0, -roll);
    this.object.setRotationFromEuler(euler);

    // Aボタンの状態(0:押されていない、1:押されている)を取得します
    let buttonAState = this.plugin.buttonAState;
    if ((this.prevButtonAState === 0) && (buttonAState === 1)) {
      // Aボタンが押されたら、ParticleSystemを実行します
      this.buttonA.play(this.object);
    }
    this.prevButtonAState = buttonAState;

    // Bボタンの状態(0:押されていない、1:押されている)を取得します
    let buttonBState = this.plugin.buttonBState;
    if ((this.prevButtonBState === 0) && (buttonBState === 1)) {
      // Bボタンが押されたら、ParticleSystemを実行します
      this.buttonB.play(this.object);
    }
    this.prevButtonBState = buttonBState;

    this.buttonA.update(this.object);
    this.buttonB.update(this.object);

    this.renderer.render(this.scene, this.camera);
  }

  init(w: number, h: number) {
    // シーンを作成します
    this.scene = new THREE.Scene();

    // カメラを作成します
    this.camera = new THREE.PerspectiveCamera(15, w / h, 0.3, 1000);
    this.camera.position.set(0, 2, -5);
    this.camera.rotateY(THREE.MathUtils.degToRad(180));
    this.camera.rotateX(THREE.MathUtils.degToRad(-21));

    // レンダラーを作成し、Canvas要素を追加します
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(w, h);
    document.body.appendChild(this.renderer.domElement);

    // micro:bitの表面と裏面からなるオブジェクトを作成します
    this.object = new THREE.Group();

    // micro:bitの表面となる平面を作成します
    const frontGeometry = new THREE.PlaneGeometry(1, 0.8);
    frontGeometry.rotateX(THREE.MathUtils.degToRad(-90));
    frontGeometry.rotateY(THREE.MathUtils.degToRad(180));
    frontGeometry.translate(0, 0.01, 0);

    const frontTexture = new THREE.TextureLoader().load('./textures/Front.jpg');
    const frontMaterial = new THREE.MeshBasicMaterial({ map: frontTexture, side: THREE.FrontSide });
    const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
    this.object.add(frontMesh);

    // micro:bitの裏面となる平面を作成します
    const backGeometry = new THREE.PlaneGeometry(1, 0.8);
    backGeometry.rotateX(THREE.MathUtils.degToRad(90));
    backGeometry.translate(0, -0.01, 0);

    const backTexture = new THREE.TextureLoader().load('./textures/Back.jpg');
    const backMaterial = new THREE.MeshBasicMaterial({ map: backTexture, side: THREE.FrontSide });
    const backMesh = new THREE.Mesh(backGeometry, backMaterial);
    this.object.add(backMesh);

    this.scene.add(this.object);
  }
}

if (!WEBGL.isWebGLAvailable()) {
  var warning = WEBGL.getWebGLErrorMessage();
  document.getElementById('container').appendChild(warning);
} else {
  let main = new Main();

  const connect = document.getElementById('connect');
  connect.addEventListener('click', () => {
    main.plugin.connectDevice();
  });

  const disconnect = document.getElementById('disconnect');
  disconnect.addEventListener('click', () => {
    main.plugin.disconnectDevice();
  });

  main.start();
}
