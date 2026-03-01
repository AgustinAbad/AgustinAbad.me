// Interactive background with Three.js and GSAP

const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x020204, 1);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 30;

// Store mouse position
const mouse = { x: 0, y: 0 };
const targetMouse = { x: 0, y: 0 };

// Create floating particles/spheres
const particles = [];
const particleCount = 100;

const geometry = new THREE.IcosahedronGeometry(0.5, 2);
const material = new THREE.MeshPhongMaterial({
    color: 0x6366f1,
    wireframe: false,
    emissive: 0x4f46e5,
    emissiveIntensity: 0.3
});

for (let i = 0; i < particleCount; i++) {
    const mesh = new THREE.Mesh(geometry, material.clone());
    mesh.position.x = (Math.random() - 0.5) * 60;
    mesh.position.y = (Math.random() - 0.5) * 60;
    mesh.position.z = (Math.random() - 0.5) * 40;
    
    mesh.scale.set(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
    
    mesh.userData = {
        originalPosition: mesh.position.clone(),
        velocity: {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        }
    };
    
    scene.add(mesh);
    particles.push(mesh);
    
    // Animate with GSAP
    gsap.to(mesh.rotation, {
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        duration: Math.random() * 10 + 10,
        repeat: -1,
        ease: 'none'
    });
}

// Add soft lighting
const light1 = new THREE.PointLight(0x6366f1, 0.5, 100);
light1.position.set(20, 20, 20);
scene.add(light1);

const light2 = new THREE.PointLight(0x8b5cf6, 0.3, 100);
light2.position.set(-20, -20, 20);
scene.add(light2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Mouse events
document.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Smooth mouse movement with lerp
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Smooth mouse following
    mouse.x = lerp(mouse.x, targetMouse.x, 0.1);
    mouse.y = lerp(mouse.y, targetMouse.y, 0.1);
    
    // Update particles
    particles.forEach((particle, index) => {
        // Floating movement
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;
        
        // Bounce off boundaries
        if (Math.abs(particle.position.x) > 30) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 30) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 20) particle.userData.velocity.z *= -1;
        
        // Subtle attraction to mouse
        const dx = mouse.x * 20 - particle.position.x;
        const dy = mouse.y * 20 - particle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 15) {
            const angle = Math.atan2(dy, dx);
            const force = (15 - distance) * 0.002;
            particle.position.x += Math.cos(angle) * force;
            particle.position.y += Math.sin(angle) * force;
        }
    });
    
    renderer.render(scene, camera);
}
animate();
