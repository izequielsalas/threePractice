import { lightPosition } from 'three/src/nodes/TSL.js';
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

console.log('Script loaded');
/*Canvas*/
const canvas = document.querySelector('#bg');
if (!canvas) {
  console.error('Canvas not found!');
} else {
  console.log('Canvas found:', canvas);
}

/*Scene*/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas });

/*Point Light*/
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
scene.add(pointLight);

/*Ambient Light*/
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

/*Helpers*/
const lightHelper = new THREE.PointLightHelper(pointLight);
//scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200,50);
//scene.add(gridHelper);

//git

/*Stars*/
function addStar(){
  const geometry = new THREE.SphereGeometry(.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry,material);

  const[x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);

};

Array(200).fill().forEach(addStar);

/*Texture loading with proper error handling*/
const textureLoader = new THREE.TextureLoader();

textureLoader.load(
  // Resource URL
  'space.jpg',
  
  // onLoad callback
  function(texture) {
    console.log('Texture loaded successfully');
    scene.background = texture;
  },
  
  // onProgress callback
  function(progress) {
    console.log('Loading progress:', progress);
  },
  
  // onError callback
  function(error) {
    console.error('Error loading texture:', error);
    console.log('Make sure space.jpg exists and you\'re running a local server');
    
    // Fallback: create a simple gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f23');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    
    const fallbackTexture = new THREE.CanvasTexture(canvas);
    scene.background = fallbackTexture;
    console.log('Using fallback gradient background');
  }
);

/*Avatar*/
const isaacTexture = new THREE.TextureLoader().load('IsaacHeadshot_whiteShirt.jpeg');

const isaac = new THREE.Mesh(

  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map: isaacTexture})

);
scene.add(isaac);

/* Moon */
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({map: moonTexture, normalMap: normalTexture})
  
);
moon.position.z = 30;
moon.position.setX(-10);
scene.add(moon);

/*Orbit Controller*/
const controls = new OrbitControls(camera, renderer.domElement);


/*Rendering*/
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

//console.log('Renderer created');

//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true });
//const torus = new THREE.Mesh(geometry, material);
//scene.add(torus);


const geometry = new THREE.TorusGeometry( 10, 3, 100, 16 ); 
const material = new THREE.MeshStandardMaterial( { color: 0xff0000, wireframe: true } ); 
const torusKnot = new THREE.Mesh( geometry, material ); scene.add( torusKnot );


console.log('Torus added to scene');

function moveCamera(){
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += .05;
  moon.rotation.y += .075;
  moon.rotation.z += .05;

  isaac.rotation.y += .01;
  isaac.rotation.z += .01;

  camera.position.x = t * -.01;
  camera.position.y = t * -.01;
  camera.position.z = t * -.01;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  torusKnot.rotation.x += 0.01;
  torusKnot.rotation.y += 0.01;
  torusKnot.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
console.log('Animation started');