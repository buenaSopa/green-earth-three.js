import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//---------------------basic setup------------------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// camera.position.set(0,0,30)
camera.position.x = 0-window.scrollY/500
camera.position.z = 20-window.scrollY/500

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

//---------------------resize------------------

const sizes = { 
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', ()=>{
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

})

//---------------------create torus------------------

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347, wireframe: false} );
const torus = new THREE.Mesh( geometry, material)

//scene.add(torus)

//---------------------create light------------------

const pointLight = new THREE.PointLight(0xffffffff, 2)
pointLight.position.set(10, 10, 20)

const ambientLight = new THREE.PointLight(0xffffffff, 1)
scene.add(pointLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 5)
// scene.add(lightHelper, gridHelper)

//---------------------create controller------------------

//const controls = new OrbitControls( camera, renderer.domElement );


//---------------------add stars------------------
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star);
}

//Array(200).fill().forEach(addStar);

//---------------------add space backgroud------------------

const spaceTexture = new THREE.TextureLoader().load('./space.jpg')
scene.background = spaceTexture



//---------------------add earth------------------

const earthTexture = new THREE.TextureLoader().load('./earth-day.jpg')
const earthNormal = new THREE.TextureLoader().load('./earth-normal.jpg')

const earth = new THREE.Mesh(
  new THREE.SphereGeometry(10, 16, 16),
  new THREE.MeshStandardMaterial({
    map: earthTexture, 
    normalMap: earthNormal,
    roughness:3
  })
)
earth.position.set(0,0,0)

const cloudTexture = new THREE.TextureLoader().load('./earth-clouds.png')


const cloud = new THREE.Mesh(
  new THREE.SphereGeometry(10.2, 16, 16), 
  new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true
  })
)

earth.add(cloud)

scene.add(earth)

//---------------------scrolling effect------------------

// function moveCamera() {
//   const t = document.body.getBoundingClientRect().top;
//   //camera.position.z = Math.abs(t) * -1 * 0.1;
//   // camera.position.x = t * -0.0002;
//   // camera.rotation.y = t * -0.0002;
//   console.log(t * 0.1)
// }

// document.body.onscroll = moveCamera

function updateCamera() {
  let root = document.getElementById('main')
  camera.position.z = 20+window.scrollY/50
  earth.rotation.y = window.scrollY/200;
  cloud.rotation.y = window.scrollY/200;
  console.log(window.scrollY)

}

window.addEventListener("scroll", updateCamera)

//---------------------main loop------------------

function animate() {
  requestAnimationFrame( animate );
  //earth.rotation.x += 0.001;
  earth.rotation.y += 0.0005;
  cloud.rotation.y += 0.0006;
  

  //earth.rotation.z += 0.01;
  //controls.update()
  renderer.render(scene, camera);
}

animate()
