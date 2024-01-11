import * as THREE from "./three.module.js";
import { OrbitControls } from "./classes/OrbitControls.js";
import { TextGeometry } from "./classes/TextGeometry.js";
import { FontLoader } from "./classes/FontLoader.js";
import Item from "./classes/Item.js";

let controls;
let renderer;
let itemMaterial;
let itemTextMaterial;
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

itemMaterial = new THREE.MeshNormalMaterial( { transparent: true, opacity: 0.6 } );
itemTextMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } );

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
    new Item(0, 0, 0, 0, 500, 500, 300, '-z'),
    new Item(1, 500, 0, 0, 200, 100, 300, '-z'),
    new Item(1, 700, 0, 0, 100, 200, 300, '+y'),
    new Item(1, 500, 100, 0, 200, 100, 300, '-z'),
    new Item(0, 0, 500, 0, 500, 500, 300, '-z'),
    new Item(0, 0, 0, 300, 500, 300, 500, '-x'),
    new Item(0, 500, 0, 300, 300, 500, 500, '+x'),
    new Item(0, 0, 300, 300, 500, 300, 500, '-x')
];

camera.position.set(1300, 1300, 1300);

animate();

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

let loader = new FontLoader();
loader.load('static/fonts/helvetiker_regular.typeface.json', function (font) {
    exampleItems.forEach((item, i) => {
        let itemGeometry = new THREE.BoxGeometry(item.sizeX, item.sizeY, item.sizeZ);
        let itemCube = new THREE.Mesh(itemGeometry, itemMaterial);
        let itemX = -(palletMaxX - item.sizeX) / 2 + item.x;
        let itemY = -(palletMaxY - item.sizeY) / 2 + item.y + palletY;
        let itemZ = -(palletMaxZ - item.sizeZ) / 2 + item.z;
        itemCube.position.set(itemX, itemY, itemZ);
        itemCube.name = "item_" + i;
        scene.add(itemCube);

        let itemTextGeometry = new TextGeometry(item.id, {
            font: font,
            size: 3,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0.5,
            bevelSize: 0.3,
            bevelOffset: 0,
            bevelSegments: 5
        });
        let itemText = new THREE.Mesh(itemTextGeometry, itemTextMaterial);
        itemText.position.set(itemX, itemY, itemZ);
        itemText.name = "item_text_" + i;
        scene.add(itemText);
    });
});
