import * as THREE from 'three';

const canvas = document.getElementById('window3d-canvas');
const heroSection = document.querySelector('.hero');
if (canvas && heroSection) {
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
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 50);
  camera.position.set(0, 0, 6.2);

  const rig = new THREE.Group();
  scene.add(rig);

  const loader = new THREE.TextureLoader();

  function makePlane(url, targetHeight) {
    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    rig.add(mesh);
    loader.load(url, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const aspect = texture.image.width / texture.image.height;
      mesh.scale.set(targetHeight * aspect, targetHeight, 1);
      material.map = texture;
      material.needsUpdate = true;
    });
    return mesh;
  }

  // Photo 1: the real closed PVC window (background removed).
  const closedMesh = makePlane('images/dritare-mbyllur.webp', 3.6);
  closedMesh.position.z = 0.02;
  closedMesh.material.opacity = 1;

  // Photo 2: cutaway of the internal PVC profile structure (background removed).
  const structureMesh = makePlane('images/dritare-struktura.webp', 3.1);
  structureMesh.position.z = 0;
  structureMesh.material.opacity = 0;

  // Soft dark contact-shadow blob beneath the window for grounding.
  const shadowGeo = new THREE.CircleGeometry(1.6, 32);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18, depthWrite: false });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.position.set(0, -2.05, -0.05);
  shadowMesh.scale.set(1, 0.28, 1);
  rig.add(shadowMesh);

  // ----- Resize -----
  function resize() {
    const rect = heroSection.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    // Shift the rig toward screen-right on wide viewports (clear of the text
    // column) and toward center on narrow/mobile viewports.
    const aspect = w / h;
    const t = THREE.MathUtils.clamp(THREE.MathUtils.inverseLerp(1.4, 0.6, aspect), 0, 1);
    rig.position.x = THREE.MathUtils.lerp(1.35, 0, t);
  }
  window.addEventListener('resize', resize);
  resize();

  // ----- Scroll-driven crossfade + 3D tilt -----
  let targetProgress = 0;
  let currentProgress = 0;

  function updateScrollProgress() {
    // Tie the transition to how far the hero itself has scrolled past, not
    // the whole page, so it completes while the hero is still on screen.
    const heroHeight = heroSection.offsetHeight || 1;
    const scrolledPastHero = -heroSection.getBoundingClientRect().top;
    targetProgress = THREE.MathUtils.clamp(scrolledPastHero / (heroHeight * 0.55), 0, 1);
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  if (prefersReducedMotion) {
    currentProgress = targetProgress;
  }

  function animate() {
    requestAnimationFrame(animate);
    currentProgress += (targetProgress - currentProgress) * 0.07;
    const p = currentProgress;

    // Crossfade the two photos.
    closedMesh.material.opacity = 1 - p;
    structureMesh.material.opacity = p;

    // Subtle 3D tilt + zoom-in that sells the "opening into the structure" feel.
    rig.rotation.y = THREE.MathUtils.lerp(-0.05, 0.32, p);
    rig.rotation.x = THREE.MathUtils.lerp(0, -0.05, p);
    const scale = THREE.MathUtils.lerp(1, 1.12, p);
    rig.scale.set(scale, scale, scale);

    renderer.render(scene, camera);
  }
  animate();
}
