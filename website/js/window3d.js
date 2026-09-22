import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('window3d-canvas');
const heroSection = document.querySelector('.hero');
if (!canvas || !heroSection) {
  // Nothing to render without the hero background canvas.
} else {
  init();
}

function init() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) {
    return; // WebGL not available — the CSS gradient background remains visible.
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(1.6, 0.4, 5.6);
  camera.lookAt(-0.6, -0.1, 0);

  const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.4);
  keyLight.position.set(4, 5, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 15;
  keyLight.shadow.camera.left = -3;
  keyLight.shadow.camera.right = 3;
  keyLight.shadow.camera.top = 3;
  keyLight.shadow.camera.bottom = -3;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x9fc4ff, 0.6);
  fillLight.position.set(-4, 2, -2);
  scene.add(fillLight);

  const ambient = new THREE.AmbientLight(0x3a5f8a, 0.35);
  scene.add(ambient);

  // Anchor everything to the right side of the hero, away from the text column.
  const sceneAnchor = new THREE.Group();
  sceneAnchor.position.set(2.5, -0.2, -0.6);
  scene.add(sceneAnchor);

  // ----- Wall the window sits in -----
  const wall = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3, 0.15), new THREE.MeshStandardMaterial({ color: 0x24425f, roughness: 0.9 }));
  wall.position.set(0, 0, -0.4);
  wall.receiveShadow = true;
  sceneAnchor.add(wall);

  // ----- PVC frame materials -----
  const pvcMat = new THREE.MeshPhysicalMaterial({
    color: 0xf5f6f7,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.25,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdcebf5,
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 0.05,
    ior: 1.5,
    envMapIntensity: 1.2,
    clearcoat: 0.3,
    transparent: true,
  });

  const frameGroup = new THREE.Group();
  sceneAnchor.add(frameGroup);

  const frameDepth = 0.12;
  const frameW = 2.6;
  const frameH = 2.2;
  const barThick = 0.11;

  function addFrameBar(width, height, x, y) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, frameDepth), pvcMat);
    bar.position.set(x, y, 0);
    bar.castShadow = true;
    bar.receiveShadow = true;
    frameGroup.add(bar);
  }
  // Outer fixed frame (top, bottom, left, right)
  addFrameBar(frameW, barThick, 0, frameH / 2 - barThick / 2);
  addFrameBar(frameW, barThick, 0, -frameH / 2 + barThick / 2);
  addFrameBar(barThick, frameH, -frameW / 2 + barThick / 2, 0);
  addFrameBar(barThick, frameH, frameW / 2 - barThick / 2, 0);

  // ----- Opening sash (hinged on the left side of the frame) -----
  const sashPivot = new THREE.Group();
  sashPivot.position.set(-frameW / 2 + barThick, 0, frameDepth / 2);
  sceneAnchor.add(sashPivot);

  const sashGroup = new THREE.Group();
  sashPivot.add(sashGroup);

  const sashW = frameW - barThick * 2.2;
  const sashH = frameH - barThick * 2.2;
  const sashBarThick = 0.09;
  const sashDepth = 0.1;

  function addSashBar(width, height, x, y) {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, sashDepth), pvcMat);
    bar.position.set(x + sashW / 2, y, sashDepth / 2 + 0.01);
    bar.castShadow = true;
    bar.receiveShadow = true;
    sashGroup.add(bar);
  }
  addSashBar(sashW, sashBarThick, 0, sashH / 2 - sashBarThick / 2);
  addSashBar(sashW, sashBarThick, 0, -sashH / 2 + sashBarThick / 2);
  addSashBar(sashBarThick, sashH, -sashW / 2 + sashBarThick / 2, 0);
  addSashBar(sashBarThick, sashH, sashW / 2 - sashBarThick / 2, 0);

  const glassW = sashW - sashBarThick * 2.4;
  const glassH = sashH - sashBarThick * 2.4;
  const glass = new THREE.Mesh(new THREE.BoxGeometry(glassW, glassH, 0.02), glassMat);
  glass.position.set(sashW / 2, 0, sashDepth / 2 + 0.01);
  glass.castShadow = true;
  glass.receiveShadow = true;
  sashGroup.add(glass);

  // Handle
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xc9ccd1, roughness: 0.3, metalness: 0.7 });
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.22, 4, 8), handleMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(sashW - 0.18, 0, sashDepth / 2 + 0.05);
  sashGroup.add(handle);

  // ----- Resize -----
  function resize() {
    const rect = heroSection.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // On narrow (mobile) screens there's no room for the text column beside
    // the window, so bring the window toward the center of the frame.
    const aspect = w / h;
    const t = THREE.MathUtils.clamp(THREE.MathUtils.inverseLerp(1.4, 0.6, aspect), 0, 1);
    const lookX = THREE.MathUtils.lerp(-0.6, 1.6, t);
    const camX = THREE.MathUtils.lerp(1.6, 2.2, t);
    camera.position.x = camX;
    camera.lookAt(lookX, -0.1, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // ----- Scroll-driven opening -----
  const maxOpenAngle = THREE.MathUtils.degToRad(78);
  let targetAngle = 0;
  let currentAngle = 0;

  function updateScrollProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? THREE.MathUtils.clamp(window.scrollY / scrollable, 0, 1) : 0;
    // Opens over the first ~40% of the page scroll, then stays open.
    const openProgress = THREE.MathUtils.clamp(progress / 0.4, 0, 1);
    targetAngle = -openProgress * maxOpenAngle;
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (prefersReducedMotion) {
    currentAngle = targetAngle;
  }

  function animate() {
    requestAnimationFrame(animate);
    currentAngle += (targetAngle - currentAngle) * 0.08;
    sashPivot.rotation.y = currentAngle;
    renderer.render(scene, camera);
  }
  animate();
}
