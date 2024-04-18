import * as THREE from 'three';
// we can see actor/object from diferent angles need 
// a orbitControls
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as dat from 'dat.gui';
import star from '../img/star.jpg';
import galaxy from '../img/galaxy.jpg';
const renderer=new   THREE.WebGLRenderer();
renderer.shadowMap.enabled=true;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
 const axesHelper=new THREE.AxesHelper(5);
 scene.add(axesHelper);
const orbit=new OrbitControls(camera,renderer.domElement);

renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

//  Three phase of  element 1> skeloton 2> material which is cover 3>> shape or mesh
const geometry = new THREE.BoxGeometry(2,2,2);
const material=new THREE.MeshBasicMaterial({ color:0x00ff00,});
const cube=new THREE.Mesh(geometry,material);
scene.add(cube);
// By default, when we call scene.add(),
//  the thing we add will be added to the
//  coordinates (0,0,0). This would cause both the camera 
// and the cube to be inside each other. To avoid this, 
// we simply move the camera out a bit.


// lets create other element
const planeGeometry=new THREE.PlaneGeometry(30,30);
const planeMaterial=new THREE.MeshBasicMaterial({
    color:0xFFFFFF,
    side:THREE.DoubleSide, // now i see from both side 

});
const plane=new THREE.Mesh(planeGeometry,planeMaterial);
scene.add(plane);
plane.receiveShadow=true;

const gridHelper=new THREE.GridHelper(30); // by pass parameter .GridHelper(30,100) 30 is size ,100 is per side segment squre and also pass color parmenter
scene.add(gridHelper);

// let's create new  element
const sphareGeometry=new THREE.SphereGeometry(4,50,50);
const sphareMaterial=new THREE.MeshBasicMaterial({
    color:0x0000FF,
    wireframe:false,
});
//  const sphareMaterial=new THREE.MeshStandardMaterial({
//     color:0xFFFFFF,
//  });
const sphare=new THREE.Mesh(sphareGeometry,sphareMaterial);
scene.add(sphare); //  by adding in secen our previous cube is hide but  we need to wireFrame:true  
// sphare.position.x=-10;
sphare.position.set(-10,10,10);
sphare.castShadow=true;

// const ambientLight=new THREE.AmbientLight(0x333333); 
// scene.add(ambientLight);

// const directionLight=new THREE.DirectionalLight(0xFFFFFF,0.8);
// directionLight.position.set(-30,50,10);
// directionLight.castShadow=true;
// scene.add(directionLight);
// const dlHelper=new THREE.DirectionalLightHelper(directionLight,5);
// scene.add(dlHelper);

const spotLight=new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100,100,0);
spotLight.castShadow=true;
spotLight.angle=0.2;

const slHelper=new THREE.SpotLightHelper(spotLight);
scene.add(slHelper);

// scene.fog=new THREE.Fog(0xFFFFFF,0,200);
scene.fog=new THREE.FogExp2(0xFFFFFF,0.01);// intensict low 

// renderer.setClearColor(0xFF6767);
const textureLoader=new THREE.TextureLoader();
scene.background=textureLoader.load(star);

// crete new elemet with add image
const box2Geometry=new THREE.BoxGeometry(4,4,4);
const box2Material=new THREE.MeshBasicMaterial({
    // map:textureLoader.load(galaxy)
});
const box2MultiMaterial=[
    new THREE.MeshBasicMaterial({map:textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(galaxy)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(star)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(galaxy)}),
    new THREE.MeshBasicMaterial({map:textureLoader.load(galaxy)}),
]
// const box2=new THREE.Mesh(box2Geometry,box2Material);
 const box2=new THREE.Mesh(box2Geometry,box2MultiMaterial);
box2.material.map=textureLoader.load(galaxy);
scene.add(box2);
box2.position.set(0,0,15);

const gui=new dat.GUI();
const options={
    sphareColor:'#ffea00',
    wireframe:false,
    speed:0.01

}
gui.addColor(options,'sphareColor').onChange(function (e){
    sphare.material.color.set(e);
    
});

gui.add(options,'wireframe').onChange(function (e){
    sphare.material.wireframe=e;
})

gui.add(options,'speed',0,0.1);


camera.position.set(0,0,35);
orbit.update();

let step=0;
const mousePosition=new THREE.Vector2();

window.addEventListener('mousemove',(e)=>{
   mousePosition.x=(e.clientX/window.innerWidth)*2-1;
   mousePosition.y=(e.clientX/window.innerHeight)*2+1;
});

const rayCaster=new THREE.Raycaster();
const spaharId=sphare.id;

function animate(){
    requestAnimationFrame(animate);
    
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

    step+=options.speed;
    sphare.position.z=10*Math.abs(Math.sin(step))
   
    rayCaster.setFromCamera(mousePosition,camera);
    const  intersects=rayCaster.intersectObjects(scene.children);
    console.log(intersects);
    for(let i=0;i<intersects.length;i++){
         if(intersects[i].object.id===spaharId){
             intersects[i].object.material.color.set(0xFF0000);
            
         }
         if(intersects[i].object.name==='theBox'){

         }
    }

    renderer.render(scene,camera);
}

animate();