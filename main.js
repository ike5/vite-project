import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
/**
 * Always need three objects:
 * 1. Scene
 * 2. Camera
 * 3. Renderer
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //field of view, aspect ratio, view frustrum
const renderer = new THREE.WebGLRenderer({
  // know which DOM elements to use
  canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); // make full screen canvas
camera.position.setZ(30);

renderer.render(scene, camera);

/**
 * Create an object
 * 1. Geometry {x,y,z} points that make a shape 
 * 2. Material to give color/texture
 * 3. Mesh = geometry + material
 * See https://threejs.org/docs/index.html#api/en/geometries/TorusGeometry 
 */
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe: true} ); //basic requires no light
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 }); //basic requires no light
const torus = new THREE.Mesh(geometry, material);
// renderer.render(scene,camera); //rerender the scene
scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);


const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// Avatar
const ikeTexture = new THREE.TextureLoader().load('profile.jpg');
const ike = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: ikeTexture })
)
scene.add(ike)

// Moon
const moonTexture = new THREE.TextureLoader().load('moon.png');
const normalTexture = new THREE.TextureLoader().load('normal.png');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    map: normalTexture,
  })
)
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);


function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  ike.rotation.y += 0.01;
  ike.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera); // game loop
}

animate();