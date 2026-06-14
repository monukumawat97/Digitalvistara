// Three.js 3D Background System - Digital Vistara
// Renders smooth interactive shapes that react to scroll & cursor offsets

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('three-canvas-container');
  if (!container || typeof THREE === 'undefined') {
    console.warn('Three.js container or library not found. Skipping 3D background.');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 8;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Brand color references
  const colors = [
    0x8B5C7E, // Primary Purple
    0x2F7D5B, // Accent Green
    0xD9CED6, // Soft Lavender
    0xB8B8B8  // Silver Gray
  ];

  // Geometries configurations
  const geometries = [
    new THREE.TorusGeometry(1, 0.3, 16, 100),
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.ConeGeometry(0.8, 1.5, 32),
    new THREE.OctahedronGeometry(1.1, 0)
  ];

  const floatingObjects = [];

  // Generate objects
  for (let i = 0; i < 14; i++) {
    // Choose random geometry and color
    const geometry = geometries[i % geometries.length];
    const color = colors[i % colors.length];

    // Create luxury physical-feeling material (roughness/metalness)
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.15,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.4, // Soft glass-like translucency
      thickness: 0.8
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Randomize position
    mesh.position.x = (Math.random() - 0.5) * 16;
    mesh.position.y = (Math.random() - 0.5) * 12;
    mesh.position.z = (Math.random() - 0.5) * 6;

    // Randomize scale
    const scale = 0.4 + Math.random() * 0.7;
    mesh.scale.set(scale, scale, scale);

    // Speed details
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.008,
      rotY: (Math.random() - 0.5) * 0.008,
      rotZ: (Math.random() - 0.5) * 0.008,
      floatSpeed: 0.001 + Math.random() * 0.002,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y
    };

    scene.add(mesh);
    floatingObjects.push(mesh);
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.7);
  dirLight1.position.set(5, 10, 7);
  scene.add(dirLight1);

  // Colored highlights
  const purpleLight = new THREE.PointLight(0x8B5C7E, 2.5, 18);
  purpleLight.position.set(-8, -5, 3);
  scene.add(purpleLight);

  const greenLight = new THREE.PointLight(0x2F7D5B, 2.5, 18);
  greenLight.position.set(8, 5, 3);
  scene.add(greenLight);

  // Spotlight that follows the user's cursor dynamically in 3D space
  const cursorLight = new THREE.PointLight(0xffffff, 3.5, 15);
  cursorLight.position.set(0, 0, 4);
  scene.add(cursorLight);

  // Mouse move parallax variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (event) => {
    // Standardize positions between -1 and 1
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    // Position cursorLight relative to cursor offsets
    cursorLight.position.x = mouseX * 10;
    cursorLight.position.y = mouseY * 8;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse parallax interpolation (Lerp)
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 1.8;
    camera.position.y = targetY * 1.8;
    camera.lookAt(scene.position);

    // Animate individual floating meshes
    floatingObjects.forEach(obj => {
      // Rotation
      obj.rotation.x += obj.userData.rotX;
      obj.rotation.y += obj.userData.rotY;
      obj.rotation.z += obj.userData.rotZ;

      // Floating wave (sine)
      obj.position.y = obj.userData.baseY + Math.sin(elapsedTime * obj.userData.floatSpeed * 100 + obj.userData.floatOffset) * 0.6;
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
});
