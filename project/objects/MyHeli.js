import {CGFappearance, CGFobject} from '../../lib/CGF.js';
import { MyDeviatedPyramid } from './MyDeviatedPyramid.js';
import { MyEllipsoid } from './MyElipsoid.js';
import { MyPrism } from './MyPrism.js';
import { MyUnitCube } from './MyUnitCube.js';
import { MyPyramid } from './MyPyramid.js';
import { MySphere } from './MySphere.js';


export class MyHeli extends CGFobject {
  constructor(scene, buildingHeight,speedFactor) {
    super(scene);
    this.speedFactor = speedFactor;
    this.buildingHeight = buildingHeight;  
    this.railHeight = 1;
    this.currentBurningTreeIndex = 0; //so the chopper knows the index of the burning tree he is currently above of
    //cockpit
    this.elipsoidRadiusX = 2.2;
    this.elipsoidRadiusY = 1.25;
    this.elipsoidRadiusZ = 1;
    this.elipse = new MyEllipsoid(this.scene, 8, 16, this.elipsoidRadiusX, this.elipsoidRadiusY, this.elipsoidRadiusZ);
    this.heliEmissionColor = [0, 0, 0, 1];
      
    //tail
    this.tail = new MyDeviatedPyramid(scene, 6, 0.8, 0)
    
    //other details (blades, landing gear)
    this.base = new MyUnitCube(scene);
    
    //bucket
    this.prism = new MyPrism (scene, 16,20);
    this.pyramid = new MyPyramid(scene, 16, 6, 1, 1.2);

    //textures
    this.scene.cockpitTexture = new CGFappearance(this.scene);
    this.scene.cockpitTexture.loadTexture('textures/leaves2.png');

    this.scene.tailTexture = new CGFappearance(this.scene);
    this.scene.tailTexture.loadTexture('textures/leaves2.png');
    
    this.scene.detailTexture1 = new CGFappearance(this.scene);
    this.scene.detailTexture1.loadTexture('textures/greyMetal.png');
    
    this.scene.detailTexture2 = new CGFappearance(this.scene);
    this.scene.detailTexture2.loadTexture('textures/darkMetal.png');
    
    this.scene.detailTexture3 = new CGFappearance(this.scene);
    this.scene.detailTexture3.loadTexture('textures/redPaint.png');
    
    this.scene.detailTexture4 = new CGFappearance(this.scene);
    this.scene.detailTexture4.loadTexture('textures/metalPlates.png');
    
    this.scene.detailTexture5 = new CGFappearance(this.scene);
    this.scene.detailTexture5.setDiffuse(0.5, 0.5, 0.5, 1);  
    //this.scene.detailTexture5.loadTexture('textures/whitePaint.png');

    this.scene.waterTexture = new CGFappearance(this.scene);
    this.scene.waterTexture.setAmbient(0.2, 0.2, 0.2, 1); 
    this.scene.waterTexture.setDiffuse(0.2, 0.2, 0.2, 2);  
    this.scene.waterTexture.setSpecular(0.1, 0.1, 0.1, 1);
    this.scene.waterTexture.setShininess(10.0);
    this.scene.waterTexture.loadTexture('textures/water.png');
    
    this.heliLightTexture = new CGFappearance(this.scene);
    this.heliLightTexture.setAmbient(0, 0, 0, 1.0);
    this.heliLightTexture.setDiffuse(0, 0, 0, 1.0);  
    this.heliLightTexture.setSpecular(0.1, 0.1, 0.1, 1.0); 
    this.heliLightTexture.setShininess(100);
    //this.heliLightTexture.setEmission(1, 0, 0, 1);  

    this.sphere = new MySphere(scene,10,10);
    


    //for water droplets
    this.droplets = [];
    this.numDroplets = 30;

    for (let i = 0; i < this.numDroplets; i++) {
      this.droplets.push({
          x: (Math.random() - 0.5) * 0.5,   // random x offset
          z: (Math.random() - 0.5) * 0.5,   // random z offset
          y: (Math.random() - 1) * 4.0,      // random Y offset
          scale: 0.05 + Math.random() * 0.02,     // small random sizes
      });
    }

    //movement and animation related
    this.helixRotationAngle = 0;
    this.elevationPosition = { x: 0, y:0, z: 0 };
    
    this.orientation = 0; //orientation in the xz plane, 0 means heli facing the -x axis, pi/2 means facing +z axis
    this.speed = 0; //scalar speed
    this.velocity = { x: 0, z: 0, y:0 }; //2D plane movement (XZ)
    this.forwardOrientation = 0;
    this.sidewaysOrientation = 0;
    this.releaseWaterYPos = 0;
    //usefull flags
    this.isInTheSky = false;
    this.isTakingOff = false;
    this.rotateHelix = false;
    this.goToBase = false;
    this.isCloseToBase = false;
    this.isLandingAtBase = false;
    this.startBreaknig = false;
    this.rotatingTowardsBase = false;
    this.isBreaking = false;
    this.isAccelerating = false;
    this.getWaterDown = false;//go down to the water
    this.readyToGoUp = false;//ready to go up from the water
    this.getWaterUP = false;//gow up from the water
    this.executingManeuver = false; //will be on during animations, so they dont overlap
    this.isBucketEmpty = true;
    this.isHeliAboveLake = false;
    this.isAboveBurningTree = false;
    this.isTurning = false;
    this.releaseWater = false;

  }
    
    display() {
    this.scene.pushMatrix();//startof chopper + bucket specific
    //moves the chopper and bucket
    this.scene.translate(this.elevationPosition.x,this.elevationPosition.y,this.elevationPosition.z);
    
    this.scene.translate(0, this.buildingHeight + this.elipsoidRadiusY + this.railHeight, 0);
    this.scene.rotate(this.orientation, 0, 1, 0); 
    this.scene.rotate(this.forwardOrientation, 0, 0, 1);
    this.scene.rotate(this.sidewaysOrientation, 1, 0, 0);
    this.scene.translate(0, -(this.buildingHeight + this.elipsoidRadiusY + this.railHeight), 0);

    //Heli DRAWING.................................
    this.scene.pushMatrix(); //start of chopper specific
    this.drawHeli();
    this.scene.popMatrix();//end of chopper specific

    //BUCKET DRAWING.................................
    this.scene.pushMatrix();//start of bucket specific
    this.drawBucket()
    this.scene.popMatrix();//end of bucket specific
      
    this.scene.popMatrix();//end of chopper + bucket specific

    //rain, water even
    if(this.releaseWater){
      this.scene.pushMatrix();
      this.drawWater();
      this.scene.popMatrix();
    }

  }


  drawHeli(){
    //static
      //cockpit ===
    this.scene.pushMatrix();
    this.scene.translate(0, this.buildingHeight + this.elipsoidRadiusY + this.railHeight,0);
    this.scene.detailTexture5.apply();
    this.elipse.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-0.5, this.buildingHeight + this.elipsoidRadiusY + this.railHeight -0.2,0);
    this.scene.scale(1,0.8,1);
    this.scene.detailTexture3.apply();
    this.elipse.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(-1.7, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.1,0);
    this.scene.rotate(-Math.PI/2, 0, 1, 0);
    this.scene.scale(0.3,0.5,0.5);
    this.scene.detailTexture2.apply();
    this.elipse.display();
    this.scene.popMatrix();

    //tail ===
    this.scene.pushMatrix();
    this.scene.translate(0.6, this.buildingHeight + this.elipsoidRadiusY*2 + this.railHeight - 0.8, 0);
    this.scene.rotate(-Math.PI / 2, 0, 0, 1);
    this.scene.detailTexture3.apply();
    this.tail.display();
    this.scene.popMatrix();

    //baldes' base ===
    this.scene.pushMatrix();
    this.scene.translate(0, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.9, 0);
    this.scene.scale(1.5,1,0.4);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0.2 , this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.75, 0);
    this.scene.scale(2.8,1,0.8);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();

    //landing gear ====
    this.scene.pushMatrix();//horizontal bar left
    this.scene.translate(0, this.buildingHeight + this.railHeight, this.elipsoidRadiusZ - 0.1);
    this.scene.scale(4,0.2,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();//vetical bar left 1
    this.scene.translate(-1, this.buildingHeight + this.railHeight + 0.5, this.elipsoidRadiusZ-0.3);
    this.scene.rotate(-Math.PI/8, 1, 0, 0);
    this.scene.scale(0.2,1,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();//vertical bar left 2
    this.scene.translate(1, this.buildingHeight + this.railHeight + 0.5, this.elipsoidRadiusZ-0.3);
    this.scene.rotate(-Math.PI/8, 1, 0, 0);
    this.scene.scale(0.2,1,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();//down bar right
    this.scene.translate(0, this.buildingHeight + this.railHeight, - this.elipsoidRadiusZ + 0.1);
    this.scene.scale(4,0.2,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();//vetical bar right 1
    this.scene.translate(-1, this.buildingHeight + this.railHeight + 0.5, - this.elipsoidRadiusZ+0.3);
    this.scene.rotate(Math.PI/8, 1, 0, 0);
    this.scene.scale(0.2,1,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();//vertical bar right 2
    this.scene.translate(1, this.buildingHeight + this.railHeight + 0.5, -this.elipsoidRadiusZ+0.3);
    this.scene.rotate(Math.PI/8, 1, 0, 0);
    this.scene.scale(0.2,1,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();
    
    //main helices ====
    this.scene.pushMatrix();//main helice rotation cube
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
    this.scene.translate(0, this.buildingHeight + this.railHeight + this.elipsoidRadiusY*2 + 0.3,0);
    this.scene.scale(0.2,0.5,0.2);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();//main helice 1
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0, this.buildingHeight + this.railHeight + this.elipsoidRadiusY*2 + 0.3,0);
    this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.scene.scale(7,0.3,0.1);
    this.scene.rotate(Math.PI/4, 0, 1, 0); //makes it look like a helix for some reason, keep it
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();
      
    this.scene.pushMatrix();//main helice 2
    this.scene.translate(0, this.buildingHeight + this.railHeight + this.elipsoidRadiusY*2 + 0.3,0);
    this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.scene.scale(7,0.3,0.1);
    this.scene.rotate(Math.PI/4, 0, 1, 0); //makes it look like a helix for some reason, keep it
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();

    //tail details ====
    this.scene.pushMatrix();//horizontal bar
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.6, 4);
    this.scene.scale(2,0.1,0.4);
    this.scene.detailTexture3.apply();
    this.base.display();
    this.scene.popMatrix();

   
    this.scene.pushMatrix(); //diagonal bar 1
    this.scene.translate(5.9, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 1.25, 0);
    this.scene.rotate(-6*Math.PI/8, 0, 0, 1);
    this.scene.scale(1.5,0.4,0.1);
    this.scene.detailTexture3.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix(); //diagonal bar 2
    this.scene.translate(5.7, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.6, 0);
    this.scene.rotate(6*Math.PI/8, 0, 0, 1);
    this.scene.scale(0.75,0.4,0.1);
    this.scene.detailTexture3.apply();
    this.base.display();
    this.scene.popMatrix();

    // tail lights
    this.scene.pushMatrix();//l1
    this.scene.translate(4, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.6, 0.8);
    this.scene.scale(0.1,0.1,0.1);
    this.heliLightTexture.setEmission(...this.heliEmissionColor);
    this.heliLightTexture.apply();
    this.sphere.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();//l2
    this.scene.translate(4, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.6, -0.8);
    this.scene.scale(0.1,0.1,0.1);
    this.heliLightTexture.setEmission(...this.heliEmissionColor);
    this.heliLightTexture.apply();
    this.sphere.display();
    this.scene.popMatrix();


    //secondary helices ====
    this.scene.pushMatrix(); //helix base
    this.scene.translate(5.3, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.75, -0.2);
    this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
    this.scene.scale(0.1,0.1,0.5);
    this.scene.detailTexture1.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix(); //helix 1
    this.scene.translate(5.3, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.75, -0.3);
    this.scene.rotate(-3*Math.PI/4, 0, 0, 1);
    this.scene.rotate(this.helixRotationAngle, 0, 0, 1);
    this.scene.scale(1.25,0.1,0.1);
    this.scene.rotate(Math.PI/4, 0, 1, 0);
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix(); //helix 2
    this.scene.translate(5.3, this.buildingHeight + this.elipsoidRadiusY + this.railHeight + 0.75, -0.3);
    this.scene.rotate(3*Math.PI/4, 0, 0, 1);
    this.scene.rotate(this.helixRotationAngle, 0, 0, 1);
    this.scene.scale(1.25,0.1,0.1);
    this.scene.rotate(Math.PI/4, 0, 1, 0);
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();
    

    this.scene.pushMatrix();//attachment to the base to the choper, coneccts with the bucket piece
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0, this.buildingHeight + this.railHeight + 0.05,0);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.scene.scale(0.5,0.3,0.1);
    this.scene.rotate(Math.PI/4, 0, 1, 0); 
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();
  }
  
  drawBucket(){
   
    if(this.isBucketEmpty){
      //EMPTY BUCKET----- 
      this.scene.pushMatrix();//pyramid detail
      this.scene.translate(0,this.buildingHeight - 3.35,0);
      this.scene.rotate(Math.PI,1,0,0)
      this.scene.scale(0.35,0.75,0.35);
      this.scene.detailTexture3.apply();
      this.pyramid.display();
      this.scene.popMatrix();
      
      this.scene.pushMatrix(); //false top prism
      this.scene.translate(0,this.buildingHeight - 3.39,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.39,0.39,0.01);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();
      
      this.scene.pushMatrix(); //big prism base
      this.scene.translate(0,this.buildingHeight - 3.4,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.3,0.3,0.75);
      this.scene.detailTexture3.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix(); //small mid tube piece
      this.scene.translate(0,this.buildingHeight - 4,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.25,0.25,0.25);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      //EMPTY BUCKET CONNECTING LINES
      this.scene.pushMatrix(); //black line conector piece
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.05,0.05,0.05);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      //connecting black lines--
      this.scene.pushMatrix();//l1
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l2
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l3
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(2*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l4
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(3*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l5
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(4*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l6
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(5*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l7
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(6*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l8
      this.scene.translate(0,this.buildingHeight - 2.8,0);
      this.scene.rotate(7*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/3,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

    }
    else{
      //FULL BUCKET-------
     
      this.scene.pushMatrix(); //pyramid detail
      this.scene.translate(0,this.buildingHeight - 3.34,0);
      this.scene.rotate(Math.PI,1,0,0)
      this.scene.scale(0.5,0.5,0.5);
      this.scene.detailTexture3.apply();
      this.pyramid.display();
      this.scene.popMatrix();
      
      this.scene.pushMatrix();//false top prism
      this.scene.translate(0,this.buildingHeight - 3.38,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.54,0.54,0.01);
      this.scene.waterTexture.apply();
      this.prism.display();
      this.scene.popMatrix();
      
      this.scene.pushMatrix(); //big prism base
      this.scene.translate(0,this.buildingHeight - 3.39,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.5,0.5,0.75);
      this.scene.detailTexture3.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix(); //small mid tube piece --
      this.scene.translate(0,this.buildingHeight - 3.94,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.25,0.25,0.25);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      //FULL BUCKET CONNECTING LINES---
      //black line conector piece
      this.scene.pushMatrix();
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(Math.PI/2,1,0,0)
      this.scene.scale(0.05,0.05,0.05);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      //connecting black lines--
      this.scene.pushMatrix();//l1
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l2
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l3
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(2*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l4
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(3*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l5
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(4*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l6
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(5*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l7
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(6*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

      this.scene.pushMatrix();//l8
      this.scene.translate(0,this.buildingHeight - 3,0);
      this.scene.rotate(7*Math.PI/4,0,1,0);
      this.scene.rotate(Math.PI/6,1,0,0);
      this.scene.scale(0.01,0.01,0.69);
      this.scene.detailTexture2.apply();
      this.prism.display();
      this.scene.popMatrix();

    }
    

    //BUCKET POLLEY BASE---------

    this.scene.pushMatrix();//centre attachement
    this.scene.rotate(Math.PI/2, 0, 1, 0);
    this.scene.translate(0, this.buildingHeight + this.railHeight,0);
    this.scene.scale(0.1,0.25,0.1);
    this.scene.detailTexture2.apply();
    this.base.display();
    this.scene.popMatrix();
    
    //BUCKET POLLEY LINE ---------
    
    this.scene.pushMatrix();//centre line
    this.scene.translate(0,this.buildingHeight + this.railHeight,0);
    this.scene.rotate(Math.PI/2,1,0,0)
    this.scene.scale(0.01,0.01,5);
    this.scene.detailTexture5.apply();
    this.prism.display();
    this.scene.popMatrix();
    
  }

  drawWater(){
    //let bucketsYPos = this.elevationPosition.y + this.buildingHeight - 3.94;
    //this.scene.translate(this.elevationPosition.x, bucketsYPos + this.releaseWaterYPos, this.elevationPosition.z);
    //this.scene.scale(0.25,0.75,0.5);
    //this.scene.waterTexture.apply();
    //this.elipse.display();
    let bucketsYPos = this.elevationPosition.y + this.buildingHeight - 3.94;
    this.scene.waterTexture.apply();

    for (let drop of this.droplets) {
        this.scene.pushMatrix();
        this.scene.translate( this.elevationPosition.x + drop.x, bucketsYPos + this.releaseWaterYPos + drop.y,this.elevationPosition.z + drop.z);
        this.scene.scale(drop.scale/4, drop.scale * 6, drop.scale); 
        this.elipse.display();
        this.scene.popMatrix();
    }

  }

  update(speedFactor) {
    
    //movement
    //let deltaSeconds = t / 1000;
    this.speedFactor = speedFactor;
    this.elevationPosition.x -= this.velocity.x * this.speedFactor; //its (-) because the heli was drawn lft to rght
    this.elevationPosition.z += this.velocity.z * this.speedFactor;
    
    //helix rotation
     if(this.rotateHelix) {
        this.helixRotationAngle += 0.6; // Or some other value for fast spinning
        this.helixRotationAngle %= 2 * Math.PI; // keep within range
    }

    //constant checks
    this.isHeliAboveLake = this.checkIfHeliIsAboveLake();
    
    //lights
    if (this.executingManeuver){ //red durin animations
      this.changeLightColor([1,0,,0,1]);
    }
    else if(this.isAboveBurningTree){ //orange when it has water and finds burning tree, 
      this.changeLightColor([1.0, 0.4, 0.0, 1.0]);
    }
    else if(this.isHeliAboveLake){ //blue when it finds lake
      this.changeLightColor([0,0,1,1]);
    }   
    else if(this.isInTheSky){ //green when capable of moving
      this.changeLightColor([0,1,0,1]);
    }
    else{this.changeLightColor([0,0,0,1]);} //black when landed

    //console.log("Position:", this.elevationPosition);
    //console.log("Orientation:", this.orientation);
    
    //animations
    this.checkAnimations();
  
    //reset forward leaning if speed is zero
    
    if (!this.isAccelerating) {
      const resetSpeed = Math.PI/256; 

      this.accelerate((-0.01)); //resistencia do ar (atrito)
      this.isAccelerating = false;

      if (this.forwardOrientation > 0) {
        this.forwardOrientation = Math.max(0, this.forwardOrientation - resetSpeed * this.speedFactor);
      } 
      
      else if (this.forwardOrientation < 0) {
        this.forwardOrientation = Math.min(0, this.forwardOrientation + resetSpeed * this.speedFactor);
      }

    }
    
    //reset side leaning
    if (!this.isTurning) {
      const resetSpeed = Math.PI/256; 

      if (this.sidewaysOrientation > 0) {
        this.sidewaysOrientation = Math.max(0, this.sidewaysOrientation - resetSpeed * this.speedFactor);
      } 
      
      else if (this.sidewaysOrientation < 0) {
        this.sidewaysOrientation = Math.min(0, this.sidewaysOrientation + resetSpeed * this.speedFactor);
      }

    }
  

  }

  checkAnimations(){

    this.checkTakeoffAnimation();

    this.checkLandingAnimations();

    this.checkGetWaterAnimations();

    this.releaseWaterAnimation();

  }

  checkTakeoffAnimation(){
    //takeoff animation 
    if(this.isTakingOff){
      this.rotateHelix = true;
      if(this.elevationPosition.y >= 6){
        this.isTakingOff = false;
        this.isInTheSky = true;
        this.executingManeuver = false;
      }
      this.elevationPosition.y += this.velocity.y * this.speedFactor;
    }
  }

  checkLandingAnimations(){
    //breaking to a stop animation (landing 1)
    if(this.startBreaknig){
     
      this.accelerate(-0.05); //induced stop
      
      if(this.velocity.x == 0 && this.velocity.z == 0){
        //console.log("stopped the heil");
        this.startBreaknig = false;
        this.rotatingTowardsBase = true;
        
      }
    }

    //rotate towards base (landing 2)
    if (this.rotatingTowardsBase) {
      //console.log("rotating");

      const dx = 0 - this.elevationPosition.x;
      const dz = 0 + this.elevationPosition.z;  

      let angleToBase = Math.atan2(dz, dx);

      //shift angle by pi to convert from +X facing reference to -X facing reference, since the way we did it uses -X ref
        angleToBase = (angleToBase + Math.PI) % (2 * Math.PI);

      //convert angleToBase to range [-pi,pi], easier for the smooth rotation 
      if (angleToBase > Math.PI) {
        angleToBase -= 2 * Math.PI;
      }

      //smallest difference between current orientation and target angle
      let normalizedDiff = angleToBase - this.orientation;
      
      //normalize difference to [-pi, pi] so rotation is shortest path
      if (normalizedDiff > Math.PI) normalizedDiff -= 2 * Math.PI;
      if (normalizedDiff < -Math.PI) normalizedDiff += 2 * Math.PI;

      const turnSpeed = 0.05 * this.speedFactor;

      if (Math.abs(normalizedDiff) < 0.01) {
        this.orientation = angleToBase;
        this.rotatingTowardsBase = false;
        this.goToBase = true;
      } 
      
      else {
        this.orientation += Math.sign(normalizedDiff) * Math.min(Math.abs(normalizedDiff), turnSpeed);
        //keep orientation normalized
        if (this.orientation > Math.PI) this.orientation -= 2 * Math.PI;
        if (this.orientation < -Math.PI) this.orientation += 2 * Math.PI;
      }

    }

    //go to base animation (landing 3)
    if(this.goToBase){
      //move to base (0,y,0),
      console.log("going to base now");

      //accelerate towards base at cruising speed
      if(this.speed < 1.5 && !this.isCloseToBase){ 
        this.accelerate(0.03);
        this.isAccelerating = false;
      }
      
      //break when nearing base
      if(((this.elevationPosition.x < 10 && this.elevationPosition.x > -10)&&(this.elevationPosition.z < 10 && this.elevationPosition.z > -10)) && this.speed > 0.5){ 
        console.log("BREAKING");
        this.accelerate((-0.1));
        this.isAccelerating = false;
        this.isCloseToBase = true;
      }

      //"snap" to base, move on to next animation
      if((this.elevationPosition.x < 1 && this.elevationPosition.x > -1)&&(this.elevationPosition.z < 1 && this.elevationPosition.z > -1)){
        this.speed = 0;
        this.updateVelocityDirection();
        this.goToBase = false;
        this.isCloseToBase = false;
        this.isLandingAtBase = true;
      }

    }

      //land (landing 4)
    if(this.isLandingAtBase){

      if(this.elevationPosition.y <= 0){
        this.elevationPosition.y = 0.1;
        this.isLandingAtBase = false;
        this.isInTheSky = false;
        this.rotateHelix = false;
        this.executingManeuver = false;
      }
      
      this.elevationPosition.y -= this.velocity.y * this.speedFactor;
      this.helixRotationAngle -= 0.3 * this.speedFactor;
    }
  }

  checkGetWaterAnimations(){
    if(this.getWaterDown){//get down to lake
     
      if(this.elevationPosition.y <= (3 - this.buildingHeight)){
        this.getWaterDown = false;
        this.readyToGoUp = true;
        this.isBucketEmpty = false;
      }
      this.elevationPosition.y -= this.velocity.y * this.speedFactor;
    }

    if(this.getWaterUP){//get up from lake

      if(this.elevationPosition.y >= 6){
        this.getWaterUP = false;
        this.isInTheSky = true;
        this.executingManeuver = false;
        this.velocity.y = 0;
      }
      this.elevationPosition.y += this.velocity.y * this.speedFactor;
    }
  }

  releaseWaterAnimation(){
    if(this.releaseWater){ 
      if(this.releaseWaterYPos < (- this.buildingHeight + 5)){
        this.releaseWater = false;
        this.releaseWaterYPos = 0;
      }
      this.releaseWaterYPos -= 0.3 * this.speedFactor;
    }
  }

  turn(v) {
    this.orientation += v * this.speedFactor;
    this.orientation %= 2 * Math.PI; //clamp

    this.sidewaysOrientation += v/4 * this.speedFactor;
    
    if(v > 0){
      this.sidewaysOrientation = Math.min(Math.PI/32,this.sidewaysOrientation);
    }
    else{
      this.sidewaysOrientation = Math.max(-Math.PI/32,this.sidewaysOrientation);
    }
   

    this.updateVelocityDirection();
  }

  accelerate(v) {
    this.isAccelerating = true;
    this.speed = Math.min(Math.max(0, this.speed + v), 8); //google said irl helis max speed is ~~259 km/h, but idk how to put that here so its 8u 
    this.checkForwardLean(v);
    this.updateVelocityDirection();
  }


  updateVelocityDirection() {
    this.velocity.x = this.speed * Math.cos(this.orientation);
    this.velocity.z = this.speed * Math.sin(this.orientation);
  }

  
  takeOff(){
    this.changeLightColor([1,0,0,1]);
    this.velocity.y = 0.08;
    this.isTakingOff = true;
    this.executingManeuver = true;
  }
  
  land(){
    this.startBreaknig = true; //decrease speed till zero animation
    this.velocity.y = 0.08; //velocity to land in helipad, when time comes
    this.executingManeuver = true;
  }

  reset(){
    this.changeLightColor([0,0,0,1]);
    
    //reset everything, looks just like the constructor
    //movement and animation related
    this.helixRotationAngle = 0;
    this.elevationPosition = { x: 0, y:0, z: 0 };
    
    this.orientation = 0; //orientation in the xz plane, 0 means heli facing the -x axis, pi/2 means facing +z axis
    this.speed = 0; //scalar speed
    this.velocity = { x: 0, z: 0, y:0 }; //2D plane movement (XZ)
    this.forwardOrientation = 0;
    this.sidewaysOrientation = 0;
    this.releaseWaterYPos = 0;
    //usefull flags
    this.isInTheSky = false;
    this.isTakingOff = false;
    this.rotateHelix = false;
    this.goToBase = false;
    this.isCloseToBase = false;
    this.isLandingAtBase = false;
    this.startBreaknig = false;
    this.rotatingTowardsBase = false;
    this.isBreaking = false;
    this.isAccelerating = false;
    this.getWaterDown = false;//go down to the water
    this.readyToGoUp = false;//ready to go up from the water
    this.getWaterUP = false;//gow up from the water
    this.executingManeuver = false; //will be on during animations, so they dont overlap
    this.isBucketEmpty = true;
    this.isHeliAboveLake = false;
    this.isAboveBurningTree = false;
    this.isTurning = false;
    this.releaseWater = false;

  }

  checkForwardLean(v){
    //console.log(this.speed);   
    //leaning forwards vs backwards depending on acceleration vs breaking, repectively
    if(v > 0){
      this.forwardOrientation += this.speed * Math.PI/256 * this.speedFactor;
    }
    else{  
      if(this.isBreaking && (this.speed != 0)){ //only when manually breaking, also cant lean back while stoped
        this.forwardOrientation -= Math.PI/256 * this.speedFactor;
      }
  
    }

    //clamp max leaning angle depending on current angle, if its leaning forwards vs backwards
    if(this.forwardOrientation > 0){
      this.forwardOrientation = Math.min(this.forwardOrientation, Math.PI/12);
    }

    else if(this.forwardOrientation < 0){
      this.forwardOrientation = Math.max(this.forwardOrientation, -(Math.PI/16));
    }

  }

  checkIfHeliIsAboveLake(){
    let x_Interval = (this.elevationPosition.x > (-88)) && (this.elevationPosition.x < (-32)); //[-88, -32]
    let z_Interval = (this.elevationPosition.z > (-20)) && (this.elevationPosition.z < (40));// [-20, 40]
   
    return x_Interval && z_Interval;
  }
   
  getWater(){
    this.getWaterDown = true;
    this.velocity.y = 0.16;
    this.isInTheSky = false; //stops the chopper from moving
    this.executingManeuver = true;
  }


  changeLightColor(newLightColor){
    this.heliEmissionColor = newLightColor;
  }


  startReleasingWater(){
    this.releaseWater = true; 
  }

}


