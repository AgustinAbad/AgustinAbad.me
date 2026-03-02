import * as THREE from "https://unpkg.com/three@0.148.0/build/three.module.js";
import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5; // <- CLAVE

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
document.body.appendChild(renderer.domElement);

// Partículas
const particlesCount = 700;

const positions = new Float32Array(particlesCount * 3);
const basePositions = new Float32Array(particlesCount * 3);
const velocities = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  const i3 = i * 3;

  // posición inicial random
  const x = (Math.random() - 0.5) * 20;
  const y = (Math.random() - 0.5) * 20;
  const z = (Math.random() - 0.5) * 20;

  positions[i3] = x;
  positions[i3 + 1] = y;
  positions[i3 + 2] = z;

  // guardo base para “volver”
  basePositions[i3] = x;
  basePositions[i3 + 1] = y;
  basePositions[i3 + 2] = z;

  // velocidad independiente (drift)
  velocities[i3] = (Math.random() - 0.5) * 0.004;
  velocities[i3 + 1] = (Math.random() - 0.5) * 0.004;
  velocities[i3 + 2] = (Math.random() - 0.5) * 0.004;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
  size: 0.01,
  color: 0x48cae4,
  transparent: true,
  opacity: 0.8,
});

const points = new THREE.Points(geometry, material);
scene.add(points);

// Animate
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();
  const posAttr = geometry.getAttribute("position");

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;

    // drift independiente
    positions[i3] += velocities[i3];
    positions[i3 + 1] += velocities[i3 + 1];
    positions[i3 + 2] += velocities[i3 + 2];

    // “wiggle” suave independiente (frecuencia distinta por i)
    const phase = i * 0.15;
    positions[i3] += Math.sin(t * 0.8 + phase) * 0.002;
    positions[i3 + 1] += Math.cos(t * 0.9 + phase) * 0.002;

    // mantenerlas cerca de su base (efecto elástico)
    positions[i3] += (basePositions[i3] - positions[i3]) * 0.002;
    positions[i3 + 1] += (basePositions[i3 + 1] - positions[i3 + 1]) * 0.002;
    positions[i3 + 2] += (basePositions[i3 + 2] - positions[i3 + 2]) * 0.002;

    // límites suaves (si se van demasiado, las recentra)
    if (Math.abs(positions[i3]) > 6) velocities[i3] *= -1;
    if (Math.abs(positions[i3 + 1]) > 6) velocities[i3 + 1] *= -1;
    if (Math.abs(positions[i3 + 2]) > 6) velocities[i3 + 2] *= -1;
  }

  posAttr.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();
