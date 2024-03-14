import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class CameraStream extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.video = document.createElement('video');
      this.video.playsInline = true; // Ensure inline playback
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  connectedCallback() {
      this.shadowRoot.appendChild(this.renderer.domElement);
      this.initializeCamera();
      this.setupScene();
      this.animate();

      window.addEventListener('resize', this.onWindowResize, false);
  }

  initializeCamera() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            this.video.srcObject = stream;
            this.video.play();
        })
        .catch(error => {
            console.error('Access to camera was denied!', error);
        });
  }

  setupScene() {
      const texture = new THREE.VideoTexture(this.video);
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
      this.camera.position.z = 5;
  }

  onWindowResize = () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate = () => {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
  }
}

customElements.define('camera-stream', CameraStream);