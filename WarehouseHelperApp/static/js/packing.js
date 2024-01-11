import * as THREE from "./three.module.js";
import { OrbitControls } from "./classes/OrbitControls.js";
import Item from "./classes/Item.js";

let controls;
let renderer;
let itemMaterial;
let light;
let scene;
let camera;
let viewportWidth = 300;
let viewportHeight = 300;
let container = document.querySelector("#" + PACKING_CONTAINER_ID);

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 60, viewportWidth / viewportHeight, 0.1, 10000);
camera.lookAt(scene.position);

light = new THREE.PointLight(0xffffff);
light.position.set(0,150,100);
scene.add(light);

itemMaterial = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.6 } );

renderer = new THREE.WebGLRenderer( { antialias: true } ); // WebGLRenderer CanvasRenderer
renderer.setClearColor( 0xf0f0f0 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( viewportWidth, viewportHeight);
container.append( renderer.domElement );

controls = new OrbitControls( camera, renderer.domElement );

let palletX = 800;
let palletY = 144;
let palletZ = 1200;
let palletMaxX = palletX;
let palletMaxY = 2000;
let palletMaxZ = palletZ;
let exampleItems = [
    new Item(0, 0, 0, 100, 200, 300)
];

camera.position.set(1300, 1300, 1300);

let boundaryGeometry = new THREE.BoxGeometry(palletMaxX, palletMaxY, palletMaxZ);
let edgesGeometry = new THREE.EdgesGeometry(boundaryGeometry);
let edgesMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
let wireframe = new THREE.LineSegments(edgesGeometry, edgesMaterial);
wireframe.position.set(0, palletY, 0);
wireframe.name = "boundary";
scene.add(wireframe);

let palletGeometry = new THREE.BoxGeometry(palletX, palletY, palletZ);
let palletMaterial = new THREE.MeshBasicMaterial( { color: 0xCB975F } );
let pallet = new THREE.Mesh(palletGeometry, palletMaterial);
pallet.position.set(0, -(palletMaxY - palletY) / 2, 0);
scene.add(pallet);

animate();