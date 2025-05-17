import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({ canvas });

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial({color: 0x44aa88});
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

const light = new THREE.DirectionalLight(0xFFFFFF, 3);
light.position.set(-1, 2, 4);
scene.add( light );

camera.position.z = 5;

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

function render() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render( scene, camera );
}

renderer.setAnimationLoop( render );