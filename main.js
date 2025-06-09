import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

function radians(degrees) {
    return degrees * 0.0174532925;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight)

const ySpaceScale = 20;

// spheres
for (let i = 2; i < ySpaceScale - 2; i += 2) {
    const geometry = new THREE.SphereGeometry( 0.5 );
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
    const cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;
    cube.position.set(0, -i, 0);
    cube.rotation.x += 1;
    cube.rotation.y += 1;
    scene.add( cube );
}

// cone
var cone = new THREE.Object3D();
const loader = new GLTFLoader().setPath('public/models/');
loader.load('Cone.glb', (gltf) => {
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            // child.recieveShadow = true;
            cone = child;
            cone.position.set(0, -0.2, 0);
        }
    });
    scene.add(gltf.scene);

    var duplicateCone = cone.clone();
    duplicateCone.position.set( 0.2, -ySpaceScale - 0.56, -0.3 );
    duplicateCone.rotation.y = -1;
    scene.add( duplicateCone );
})

// wall
const walls = new THREE.Object3D();
{
    const geometry = new THREE.PlaneGeometry( 12, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0x666666 } );
    const wall = new THREE.Mesh( geometry, material );
    wall.receiveShadow = true;
    wall.position.set(-3, 0, -3);
    walls.add(wall);
}
{
    const geometry = new THREE.PlaneGeometry( 6, 1 );
    const material = new THREE.MeshPhongMaterial( { color: 0x666666 } );
    const wall = new THREE.Mesh( geometry, material );
    wall.receiveShadow = true;
    wall.position.set(3, 0, 0);
    wall.rotateY(radians(-90));
    walls.add(wall);
}
{
    const geometry = new THREE.PlaneGeometry( 12, 6 );
    const material = new THREE.MeshPhongMaterial( { color: 0x666666 } );
    const wall = new THREE.Mesh( geometry, material );
    wall.receiveShadow = true;
    wall.position.set(-3, -0.5, 0);
    wall.rotateX(radians(-90));
    walls.add(wall);
}
walls.position.set(0, -ySpaceScale / 2 + 2.5, 0);
walls.rotateY(radians(15));
walls.scale.set(1, ySpaceScale + 7, 1);
scene.add( walls );

const sunLight = new THREE.DirectionalLight(0xFFFFFF, 3);
sunLight.position.set(-5, 5, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.camera.top = 1;
sunLight.shadow.camera.bottom = 1 - ySpaceScale;
scene.add( sunLight );

const ambientLight = new THREE.AmbientLight(0xDDDDFF, 0.2);
scene.add( ambientLight );

camera.position.y = 0;
camera.position.z = 2;
function setScroll(){
    camera.position.y = -((document.documentElement.scrollTop || document.body.scrollTop) /
    ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) * ySpaceScale;
}
document.body.onscroll = () => {
    setScroll();
}
setScroll();

document.addEventListener('mousemove', function(event) {
    setScroll()
    let y = camera.position.y
    camera.position.x = -event.clientX / window.innerWidth + 0.5
    camera.position.y += event.clientY / window.innerHeight - 0.5
    camera.lookAt(new THREE.Vector3(0, y, 0))
});

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    setScroll();
}
window.addEventListener('resize', onWindowResize, false)

function render() {
    renderer.render( scene, camera );
}

var latitude = 52.43861988511611;
var longitude = 16.868680971938506;
navigator.geolocation.getCurrentPosition((position) => {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
})
function mainLoop() {
    const date = new Date();
    const sunpos = window.SunCalc.getPosition(date, latitude, longitude);
    sunLight.position.z = Math.cos(sunpos.altitude) * Math.cos(sunpos.azimuth);
    sunLight.position.x = -Math.cos(sunpos.altitude) * Math.sin(sunpos.azimuth);
    sunLight.position.y = Math.sin(sunpos.altitude);
    sunLight.intensity = Math.max(0, sunLight.position.y) * 3;

    cone.rotation.y += 0.02;
    cone.rotation.z += 0.02;

    render();
}

renderer.setAnimationLoop( mainLoop );