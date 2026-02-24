import {CGFobject, CGFappearance} from '../../lib/CGF.js';
import { MyPlane } from './MyPlane.js';;
import { MyUnitCube } from './MyUnitCube.js';
import { MyWindow } from './MyWindow.js';
import { MySphere } from "./MySphere.js";
import { MyHelipadShader } from './MyHelipadShader.js'; // Add this import

export class MyBuilding extends CGFobject {
  constructor(scene, width, floors, windowsPerFloor, windowTexture, color) {
    super(scene);

    this.cube = new MyUnitCube(scene);
    
    this.width = width;
    this.floors = floors;       
    this.windowsPerFloor = windowsPerFloor;
    this.windowTexture = windowTexture;
    this.color = color;

    this.helipadStatus = "IDLE"; // [IDLE, "TAKING_OFF, LANDING"]
    this.hepadBlinkPhase = 0; // blinking popuses
    
    this.floorHeight = 4; 
    
    this.window = new MyWindow(this.scene);
    this.helipad = new MyPlane(scene,false,32);
    this.sphere = new MySphere(scene,10,10);

    // Initialize the helipad shader
    this.helipadShader = new MyHelipadShader(scene);

    //appearences to make building look more real 
    this.buildingAppearance = new CGFappearance(this.scene);
    this.buildingAppearance.setAmbient(...color);
    this.buildingAppearance.setDiffuse(0.4, 0.4, 0.4, 1.0);  
    this.buildingAppearance.setSpecular(0.2, 0.2, 0.2, 1.0); 
    this.buildingAppearance.setShininess(1.0);          
    
    //textures
    this.signTexture = new CGFappearance(this.scene);
    this.signTexture.setAmbient(...color);
    this.signTexture.setDiffuse(0.7, 0.7, 0.7, 1.0);  
    this.signTexture.setSpecular(0.2, 0.2, 0.2, 1.0); 
    this.signTexture.setShininess(10.0);
    this.signTexture.loadTexture('textures/sign.png');  

    this.doorTexture = new CGFappearance(this.scene);
    this.doorTexture.setAmbient(...color);
    this.doorTexture.setDiffuse(0.2, 0.2, 0.2, 1.0);  
    this.doorTexture.setSpecular(0.2, 0.2, 0.2, 1.0); 
    this.doorTexture.setShininess(10.0);
    this.doorTexture.loadTexture('textures/door2.png');

    this.helipadCenterTexture = new CGFappearance(this.scene);
    this.helipadCenterTexture.setAmbient(0.4, 0.4, 0.4, 1.0);
    this.helipadCenterTexture.setDiffuse(0.4, 0.4, 0.4, 1.0);  
    this.helipadCenterTexture.setSpecular(0.1, 0.1, 0.1, 1.0); 
    this.helipadCenterTexture.setShininess(10);
    this.helipadCenterTexture.loadTexture('textures/H.png');
    this.helipadCenterTexture.setEmission(0.4,0.4,0.4,0.4); //light the pad   

    this.helipadLightTexture = new CGFappearance(this.scene);
    this.helipadLightTexture.setAmbient(0.1, 0, 0, 1.0);
    this.helipadLightTexture.setDiffuse(0.3, 0, 0, 1.0);  
    this.helipadLightTexture.setSpecular(0, 0, 0, 1.0); 
    this.helipadLightTexture.setShininess(10);
    //this.helipadLightTexture.loadTexture('textures/H.png');
    this.helipadLightTexture.setEmission(1,0,0,1); 

    this.helipadUpTexture = new CGFappearance(this.scene);
    this.helipadUpTexture.loadTexture("textures/UP.png");
    this.helipadUpTexture.setEmission(1, 1, 1, 1);

    this.helipadDownTexture = new CGFappearance(this.scene);
    this.helipadDownTexture.loadTexture("textures/DOWN.png");
    this.helipadDownTexture.setEmission(1, 1, 1, 1);

  }

  display(t) {
    this.buildingAppearance.apply();

    //center building
    this.scene.pushMatrix();
    this.scene.translate(0, (this.floors * this.floorHeight) / 2, 0);
    this.scene.scale(this.width, this.floors * this.floorHeight, this.width * 0.75);
    this.cube.display();
    this.scene.popMatrix();

    const sideWidth = this.width * 0.75;
    const sideFloors = this.floors - 1; 
    const sideHeight = sideFloors * this.floorHeight;
    const sideDepth = (this.width * 0.75) * 0.75;

    //left building
    this.scene.pushMatrix();
    this.scene.translate(
      -(this.width/2 + sideWidth/2), 
      sideHeight/2, 
      0
    ); 
    this.scene.scale(sideWidth, sideHeight, sideDepth);
    this.cube.display();
    this.scene.popMatrix();

    //right building
    this.scene.pushMatrix();
    this.scene.translate(
      (this.width/2 + sideWidth/2), 
      sideHeight/2, 
      0
    );
    this.scene.scale(sideWidth, sideHeight, sideDepth);
    this.cube.display();
    this.scene.popMatrix();

    this.drawDoor();
    this.drawSign();
    this.drawWindow();
    this.drawHelipad(t);
  }

  //TODO: draw windows, door, sign, heliport
  drawDoor(){
    const z = (this.width * 0.75 / 2) + 0.01;
    const y = this.floorHeight;    
    
    this.doorTexture.apply();
    this.scene.pushMatrix(); 
    
    this.scene.translate(0,1.5,z);
    this.scene.scale(2, 3, 1); //no need to scale z axis super small
    this.scene.rotate(Math.PI, 1, 0, 0);
    
    this.window.flip();
    this.window.display(); 
    this.scene.popMatrix();
  }

  drawSign(){
    const z = (this.width * 0.75 / 2) + 0.01;
    const y = this.floorHeight;    
    
    this.signTexture.apply();
    
    this.scene.pushMatrix(); 
    this.scene.translate(0,y,z);
    this.scene.scale(7, 1.5, 1);
    this.scene.rotate(Math.PI, 1, 0, 0);
    
    this.window.flip();
    this.window.display(); 
    this.scene.popMatrix();

  }


  drawWindow() {
    const windowWidth = this.width * 0.15;
    const windowHeight = this.floorHeight * 0.4;
    const spacingX = this.width / (this.windowsPerFloor + 1);
    const spacingY = this.floorHeight;
 
    //windows on the center building
    this.windowTexture.apply();
    for (let floor = 1; floor < this.floors; floor++) {
        for (let w = 0; w < this.windowsPerFloor; w++) {
            this.scene.pushMatrix();
            
            const x = (-this.width / 2) + (w + 1) * spacingX;
            const y = (floor * spacingY) + (this.floorHeight / 2);
            const z = (this.width * 0.75 / 2) + 0.01;
            
            this.scene.translate(x, y, z);
            this.scene.scale(windowWidth, windowHeight, 1); 
            
            this.window.display(); 
            this.scene.popMatrix();
        }
    }

    //windows on the left building
    const sideWidth = this.width * 0.75;
    const sideFloors = this.floors - 1;
    const sideSpacingX = sideWidth / (this.windowsPerFloor + 1);

    for (let floor = 0; floor < sideFloors; floor++) {
        for (let w = 0; w < this.windowsPerFloor; w++) {
            this.scene.pushMatrix();
            
            const x = -(this.width/2 + sideWidth) + (w + 1) * sideSpacingX;
            const y = (floor * spacingY) + (this.floorHeight / 2);
            const z = (sideWidth * 0.75 / 2) + 0.01;
            
            this.scene.translate(x, y, z);
            this.scene.scale(windowWidth, windowHeight, 1);
            
            this.window.display(); 
            this.scene.popMatrix();
        }
    }

    //windows on the right building
    for (let floor = 0; floor < sideFloors; floor++) {
        for (let w = 0; w < this.windowsPerFloor; w++) {
            this.scene.pushMatrix();
            
            const x = (this.width/2 + sideWidth) - (w + 1) * sideSpacingX;
            const y = (floor * spacingY) + (this.floorHeight / 2);
            const z = (sideWidth * 0.75 / 2) + 0.01;
            
            this.scene.translate(x, y, z);
            this.scene.scale(windowWidth, windowHeight, 1);
            
            this.window.display(); 
            this.scene.popMatrix();
        }
    }
  }

  
  drawHelipad(t) {
    let topfloor = this.floorHeight * this.floors;

    this.scene.pushMatrix(); 
    this.scene.translate(0, topfloor + 0.02, 0);
    this.scene.scale(6, 1, 6);
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    
    this.helipadShader.update(t, this.helipadStatus);
    this.scene.setActiveShader(this.helipadShader);
    this.helipadShader.applyTextures(this.helipadStatus);
    
    this.helipad.display();
    
    this.scene.setActiveShader(this.scene.defaultShader);
    this.scene.popMatrix();

    let lightIntensity = 0.1;
    if (this.helipadStatus !== "IDLE") {
        lightIntensity = 0.1 + 0.9 * ((Math.sin(t / 200) + 1) / 2);
    }

    this.helipadLightTexture.setEmission(lightIntensity, 0, 0, 1);
    this.helipadLightTexture.apply();

    const offsets = [[-3,-3],[-3,3],[3,-3],[3,3]];
    for (let [x, z] of offsets) {
        this.scene.pushMatrix();
        this.scene.translate(x, topfloor, z);
        this.scene.scale(0.1, 0.1, 0.1);
        this.sphere.display();
        this.scene.popMatrix();
    }
}




  setHelipadStatus(status) 
  {
    this.helipadStatus = status;
  }

  resetHelipadLights() {
    this.helipadStatus = "IDLE";
    this.hepadBlinkPhase = 0;
  }

}