import * as THREE from 'three';

export default class Particles {
  // 表示する星の数
  static readonly COUNT = 3;
  // 星の移動量(y)
  static readonly MOVEY = 0.01;
  // 星を移動する上限(y)
  static readonly MAXY = 0.25;
  // 星の移動量(x)
  static readonly MOVEX = [0.004, -0.004, 0];
  // 星の移動量(z)
  static readonly MOVEZ = [-0.004, -0.004, 0.004];

  position: THREE.Vector3;
  plane: THREE.PlaneGeometry;
  material: THREE.MeshBasicMaterial;
  meshes: THREE.Mesh[] = [];

  // 表示する座標を設定します
  constructor(position: THREE.Vector3) {
    this.position = position;
    this.plane = new THREE.PlaneGeometry(0.05, 0.05);
    const texture = new THREE.TextureLoader().load('textures/Star.png');
    this.material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  }

  // 星を生成し、座標を設定します
  play(object: THREE.Object3D) {
    for (let i = 0; i !== this.meshes.length; ++i) {
      const mesh = this.meshes[i];
      if (mesh != null) {
        object.remove(mesh);
        this.meshes[i] = null;
      }
    }
    this.meshes.length = 0;
    for (let i = 0; i !== Particles.COUNT; ++i) {
      const mesh = new THREE.Mesh(this.plane, this.material);
      mesh.position.set(this.position.x, this.position.y, this.position.z);
      object.add(mesh);

      this.meshes.push(mesh);
    }
  }

  // 星を移動します
  update(object: THREE.Object3D) {
    for (let i = 0; i !== this.meshes.length; ++i) {
      const mesh = this.meshes[i];
      if (mesh != null) {
        if (mesh.position.y < Particles.MAXY) {
          // 星を移動します
          mesh.position.x += Particles.MOVEX[i];
          mesh.position.y += Particles.MOVEY;
          mesh.position.z += Particles.MOVEZ[i];
        } else {
          // 星が上限を超えたら、削除します
          object.remove(mesh);
          this.meshes[i] = null;
        }
      }
    }
  }
}