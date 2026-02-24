import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./objects/MyPlane.js";
import { MySphere } from "./objects/MySphere.js";
import { MyPanorama } from "./objects/MyPanorama.js"
import { MyBuilding } from "./objects/MyBuilding.js";

import { MyForest } from "./objects/MyForest.js";
import { MyHeli } from "./objects/MyHeli.js";
import { MyLake } from "./objects/MyLake.js";



/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
    this.defaultCameraPosition = vec3.fromValues(20, 20, 50);
    this.defaultCameraTarget = vec3.fromValues(0, 10, 0);
    this.heliCameraOffset = vec3.fromValues(0, 10, 20); // Position relative to helicopter
    this.cameraTransitionSpeed = 0.198; // How fast the camera moves between positions
    
    this.followingHeli = false;
    this.cameraIsOnHeli = false;
    this.transitioningToDefault = false;  
    this.currentTime = 0;
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.gl.disable(this.gl.CULL_FACE);

    //gui vars
    this.displayAxis = false;
    this.displayPlanetScene = false;
    this.displayFireScene = true;

    this.displayPlane = true;
    this.displayLandscape = true;
    this.displayBuilding = true;
    this.displayTrees = true;
    this.displayHelicopter = true;
    this.displayLake = true;
    
    this.goThirdPerson = false;
    this.speedFactor = 1;
    
    //Initialize scene objects and textures
    this.axis = new CGFaxis(this, 20, 1);
    
    this.plane = new MyPlane(this,true, 64);
    
    this.planet = new MySphere(this, 40, 10);
    this.planet.setOutsideView();
    
    this.planetTexture = new CGFappearance(this);
    this.planetTexture.setAmbient(0.3, 0.3, 0.3, 1); 
    this.planetTexture.setDiffuse(1.0, 1.0, 1.0, 1);  
    this.planetTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.planetTexture.setShininess(10.0);
    this.planetTexture.loadTexture('textures/earth.jpg');   

    this.landscapeTexture = new CGFappearance(this);
    this.landscapeTexture.setAmbient(1, 1, 1, 1); 
    this.landscapeTexture.setDiffuse(1.0, 1.0, 1.0, 1);  
    this.landscapeTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.landscapeTexture.setShininess(10.0);
    this.landscapeTexture.loadTexture('textures/landscape5.png');

    this.landscape = new MyPanorama(this, this.landscapeTexture);
    

    this.groundTexture = new CGFappearance(this);
    this.groundTexture.setAmbient(0.3, 0.3, 0.3, 1); 
    this.groundTexture.setDiffuse(0.2, 0.2, 0.2, 1);  
    this.groundTexture.setSpecular(0, 0, 0, 1);
    this.groundTexture.setShininess(1.0);
    this.groundTexture.loadTexture('textures/ground.png');
    this.groundTexture.setTextureWrap('REPEAT', 'REPEAT');


    this.windowTexture = new CGFappearance(this);
    this.windowTexture.setAmbient(0.8, 0.8, 0.8, 1.0);  
    this.windowTexture.setDiffuse(0.8, 0.8, 0.8, 0.8);  
    this.windowTexture.setSpecular(0.4, 0.4, 0.5, 1.0); 
    this.windowTexture.setShininess(30.0);            
    this.windowTexture.loadTexture('textures/window4.png');
    
    const numberOfFloors = 4;
    this.building = new MyBuilding(this, 13.5 , numberOfFloors, 2, this.windowTexture, [0.5, 0.5, 0.5, 1.0]);
    this.forest = new MyForest(this, 5, 4);

    const buildingHeight = 4 * numberOfFloors;
    this.heli = new MyHeli(this, buildingHeight,this.speedFactor);

    this.lake = new MyLake(this,false,64);

    this.helipadLightResetTime = null;

  }

  initLights() {
      this.lights[0].setPosition(-100, 150, 100, 0);  
      this.lights[0].setDiffuse(0.6, 0.6, 0.6, 1.0);  
      this.lights[0].setAmbient(0.7, 0.7, 0.7, 1.0);  
      this.lights[0].setSpecular(1, 1, 1, 1.0); 
      this.lights[0].setConstantAttenuation(1000.0);
      this.lights[0].enable();
      
      this.lights[0].update();  
    
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.6,
      0.1,
      1000,
      this.defaultCameraPosition,
      this.defaultCameraTarget
    );
  }

  checkKeys() {
   
    if (this.gui.isKeyPressed("KeyW") && this.heli.isInTheSky) { //accelerate
      this.heli.accelerate(0.03);
    }
    if (this.gui.wasKeyReleased("KeyW")) {
      this.heli.isAccelerating = false;
    }

    if (this.gui.isKeyPressed("KeyS") && this.heli.isInTheSky) {//break
      this.heli.isBreaking = true;
      this.heli.accelerate(-0.04);
    } 
    else { //only leans backwards when breaking, not with the air resisitace
      this.heli.isBreaking = false;
    }
    if (this.gui.wasKeyReleased("KeyS")) {
      this.heli.isAccelerating = false;
    }

    if (this.gui.isKeyPressed("KeyA") && this.heli.isInTheSky) {//rotate to the left
       this.heli.isTurning = true;
      this.heli.turn(Math.PI/64);
    }
    if (this.gui.wasKeyReleased("KeyA")) {
      this.heli.isTurning = false;
    }

    if (this.gui.isKeyPressed("KeyD") && this.heli.isInTheSky) {//rotate to the right
      this.heli.isTurning = true;
      this.heli.turn((-Math.PI/64));
    }
    if (this.gui.wasKeyReleased("KeyD")) {
      this.heli.isTurning = false;
    }

    if (this.gui.isKeyPressed("KeyP")) {//take off sequence

      if(this.heli.readyToGoUp){//lake take off
        this.heli.getWaterUP = true;
      }
      else{
        if(!this.heli.isInTheSky && !this.heli.executingManeuver){//landpad takeoff
          this.heli.takeOff();
          this.building.setHelipadStatus("TAKING_OFF");
          this.helipadLightResetTime = performance.now() + 7700;
          console.log("Helipad lights ON");
        }
        else{
          console.log("Already flying");
        }
      }
    }

    if (this.gui.isKeyPressed("KeyL")) {//landing sequence
      
      if(this.heli.isHeliAboveLake){
        console.log("ABOVE THE LAKE");
        let isStopped = (this.heli.velocity.x === 0) && (this.heli.velocity.z === 0);
    
        if(isStopped && !this.heli.executingManeuver && this.heli.isBucketEmpty){
          this.heli.getWater();
        }
        else{
          console.log("GOING TOO FAST FOR THIS MANEUVER");
        }
      }
      else if(!this.heli.executingManeuver && this.heli.isBucketEmpty){ //only lands when not on lake and bucket is empty
        this.heli.land();
        this.heli.isInTheSky = false;
        this.building.setHelipadStatus("LANDING");
        this.helipadLightResetTime = performance.now() + 8000;
      }

    }

    if (this.gui.isKeyPressed("KeyR")) {//reset heli
      this.heli.reset();
      this.followingHeli = false;
      this.transitioningToDefault = true; // Trigger camera return on reset
    }

    if (this.gui.isKeyPressed("KeyO")) {//other
      console.log("O");
      //is burning tree in range of chopper
      if(this.heli.isAboveBurningTree){
        console.log("deleting fire");
        //release water
        this.heli.startReleasingWater();
        this.heli.isBucketEmpty = true;
        
        //wait a bit before putting out fire
        setTimeout(() => { this.forest.putOutTree(this.heli.currentBurningTreeIndex);
          this.heli.isAboveBurningTree = false;
          this.heli.currentBurningTreeIndex = 0; //we can igonre the tree index, since its out and we are out of water too

        }, 2000/this.speedFactor); 
        
      }
     

    }

     if (this.gui.isKeyPressed("KeyV")) {// for some reason u need to press it twice to work
        console.log("V");
        this.goThirdPerson = !this.goThirdPerson;
     }
    
  }

  updateCamera() {
    if (this.heli.isInTheSky && !this.followingHeli && !this.transitioningToDefault) {
      this.followingHeli = true;
      this.cameraIsOnHeli = true;
    } 
    
    else if (!this.heli.isInTheSky && this.followingHeli) { 
      this.transitioningToDefault = true;
    }

    if (this.transitioningToDefault) {

      if(!this.heli.isHeliAboveLake){ //when heli isnt above the lake, the camera will go to default
        this.followingHeli = false;
        
        vec3.lerp(
        this.camera.position,
        this.camera.position,
        this.defaultCameraPosition,
        this.cameraTransitionSpeed
        );
      
        vec3.lerp(
          this.camera.target,
          this.camera.target,
          this.defaultCameraTarget,
          this.cameraTransitionSpeed
        );
      
        const distToDefault = vec3.distance(this.camera.position, this.defaultCameraPosition);
        if (distToDefault < 0.5) {
          this.transitioningToDefault = false;
          this.cameraIsOnHeli = false;
        }
      }
      else{
        console.log("HELI IS ABOVE THE LAKE INDEED");
        this.transitioningToDefault = false;
      }

    }

    if (this.followingHeli) {
      let targetPosition = vec3.create();
      let heliPosition = vec3.fromValues(
        this.heli.elevationPosition.x,
        this.heli.elevationPosition.y + this.heli.buildingHeight + this.heli.elipsoidRadiusY + this.heli.railHeight,
        this.heli.elevationPosition.z
      );
      
      let offsetX = this.heliCameraOffset[0] * Math.sin(-this.heli.orientation) + 
                    this.heliCameraOffset[2] * Math.cos(-this.heli.orientation);
      let offsetZ = this.heliCameraOffset[0] * Math.cos(-this.heli.orientation) + 
                    this.heliCameraOffset[2] * Math.sin(-this.heli.orientation);
      
      vec3.set(
        targetPosition,
        heliPosition[0] + offsetX,
        heliPosition[1] + this.heliCameraOffset[1],
        heliPosition[2] + offsetZ
      );
      
      vec3.lerp(
        this.camera.position,
        this.camera.position,
        targetPosition,
        this.cameraTransitionSpeed
      );
      
      vec3.lerp(
        this.camera.target,
        this.camera.target,
        heliPosition,
        this.cameraTransitionSpeed
      );
    } 
    
    
  }


  update(t) {

  this.currentTime = t;
  this.checkKeys();
  this.heli.update(this.speedFactor);

  // Reset helipad lights when the maneuver is done
  if (this.helipadLightResetTime !== null && performance.now() >= this.helipadLightResetTime) {
    this.building.resetHelipadLights();
    console.log("Resetting helipad lights at t =", t);
    this.helipadLightResetTime = null; // Reset the timer 
  }


  if (this.goThirdPerson) {
    this.updateCamera(); 
  } else if (this.camera.position[1] < 1 && !this.displayPlanetScene) {
    this.camera.position[1] = 1;
  }

  this.gui.resetReleasedKeys();

  if (!this.heli.isBucketEmpty) {
    this.checkBurningTreePos();
  }
}


  checkBurningTreePos(){
    
        for (let t of this.forest.trees) {
          if (t.onFire) {
             
            let x_Interval = (this.heli.elevationPosition.x > (t.x-4)) && (this.heli.elevationPosition.x < (t.x+4)); //[x-4, x+4]
            let z_Interval = (this.heli.elevationPosition.z > (t.z-4)) && (this.heli.elevationPosition.z < (t.z+4));// [z-4, z+4]
            
            console.log("checking if fire in range");
            
            //is burning tree in range of chopper
            if(x_Interval && z_Interval){
              this.heli.isAboveBurningTree = true;
              this.heli.currentBurningTreeIndex = t.index;
              break;
            }
            else{
              this.heli.currentBurningTreeIndex = 0;
              this.heli.isAboveBurningTree = false;
            }
            
          
        }

      }


  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display(t) {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();
    
    //FIX LIGHTS HERE.-------------------------------------------------------------------------------------- <----
    //make lights better
    this.lights[0].update();  
    //-------------------------------------------------------------------------------------- <----
    
    this.displayPlanetScene = !this.displayFireScene;
    this.displayFireScene = !this.displayPlanetScene;

    // Draw axis
    if (this.displayAxis)
      this.axis.display();
    
    this.setDefaultAppearance();
    
    
    //draw sphere
    if(this.displayPlanetScene){
    
      this.pushMatrix();
      this.scale(10, 10, 10); 
      this.planetTexture.apply();
      this.planet.display();
      this.popMatrix();
    
    } 

    //draw scene objs
    if(this.displayFireScene){
      
      //draw plane
      if (this.displayPlane) {
        this.pushMatrix();
        this.scale(400, 1, 400);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.groundTexture.apply();
        this.plane.display();
        this.popMatrix();
      }
      
      //draw landscape
      if(this.displayLandscape){
        this.pushMatrix();
        this.landscape.display(this.camera.position);
        this.popMatrix();
      } 
      
      //draw helicopter
      if(this.displayHelicopter){
        this.pushMatrix();
        this.translate(0,(-0.9),0);
        this.heli.display();
        this.popMatrix();
      }
      
      //draw trees
      if(this.displayTrees){
        this.pushMatrix();
        //this.translate(10,0,-50);
        this.forest.display();      
        this.popMatrix();
      }
      //draw building
      if(this.displayBuilding){
        this.pushMatrix();
        this.building.display(this.currentTime);
        this.popMatrix();
      }
      
      //draw Lake
      if(this.displayLake){
        this.pushMatrix();
        this.lake.display();
        this.popMatrix();
      }
      
    }
  }

}