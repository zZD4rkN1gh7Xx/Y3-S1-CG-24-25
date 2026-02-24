
import { MyDiamond } from "../tp4/MyDiamond.js";
import { MyTriangle } from "../tp4/MyTriangle.js";
import { MyParallelogram } from "../tp4/MyParallelogram.js";
import { MyTriangleSmall } from "../tp4/MyTriangleSmall.js";
import { MyTriangleBig } from "../tp4/MyTriangleBig.js";

import {CGFobject} from '../lib/CGF.js';
/**
 * MyGun
 * @constructor
 * @param scene - Reference to MyScene object
 * @param {Array} coords - Array of texture coordinates (optional)
 */
export class MyTangram extends CGFobject {

    constructor(scene) {
		super(scene);

        //Initialize scene objects
        this.diamond = new MyDiamond(scene);
        this.triangle = new MyTriangle(scene,[0,0.5, 0,1, 0.5,1]);
        this.parallelogram = new MyParallelogram(scene);
        this.smallTriangle = new MyTriangleSmall(scene); // dynamic coord update on a singleobject
        
        this.bigTriangle1 = new MyTriangleBig(scene, [1,1, 0.5,0.5, 1,0]); //update coords upon constructor (needs multiple calls)
        this.bigTriangle2 = new MyTriangleBig(scene,[1,0, 0.5,0.5, 0,0]);

		this.initBuffers();
	}
	
	initBuffers() {
	}

    display(){

    //texture (can be interfered by diffuse)
        this.scene.tangramMaterial.apply();

    // Big triangle orange 
        this.scene.pushMatrix();
        
        this.scene.translate( Math.sqrt(2),Math.sqrt(2),0)
        this.scene.translate( 4,0,0);
        this.scene.rotate(3*(Math.PI)/4,0,0,1); 
        
        //this.scene.setDiffuse(1,0.439,0);
       
        this.bigTriangle1.display();
        this.scene.popMatrix();

    //Big triangle blue
        this.scene.pushMatrix();
        this.scene.translate( 4 - Math.sqrt(2),Math.sqrt(2) + Math.sqrt(8)/2,0);
        this.scene.rotate(-(Math.PI/4),0,0,1);
        
        //this.scene.setDiffuse(0,0.5,1);
        this.bigTriangle2.display();
        this.scene.popMatrix();

    //Normal triangle pink
        this.scene.pushMatrix();
        this.scene.translate( 1,1.14,0); 
        this.scene.translate( 4-Math.sqrt(8),Math.sqrt(8)-Math.sqrt(2)/2,0)
      
        //this.scene.setDiffuse(1,0,0.9);
        this.triangle.display();
        this.scene.popMatrix();

    //diamond green (WITH A TEXTURE)
        
        this.scene.pushMatrix();
        this.scene.translate(0,- Math.sqrt(2)/2,0);
        this.scene.translate(0.46, Math.sqrt(2) + Math.sqrt(8),0)
        this.scene.rotate(Math.PI/4,0,0,1);
        
       //this.scene.setDiffuse(0,1,0.1);
        this.diamond.display();
        this.scene.popMatrix();
        


    //Small triangle red
        this.scene.pushMatrix();

        this.scene.translate(-Math.sqrt(2)/2,0,0);
        this.scene.translate(0,-Math.sqrt(2)/2,0);
        this.scene.translate(0,Math.sqrt(2) + Math.sqrt(8),0);
        this.scene.translate(-0.24,0,0);
        this.scene.rotate(-Math.PI/4,0,0,1);
        
        //this.scene.setDiffuse(1,0.08,0)
        this.smallTriangle.setTexCoords([0.25,0.75, 0.75,0.75, 0.5,0.5])
        this.smallTriangle.display();
        this.scene.popMatrix();

    //parallelogram yellow  WITH TEXTURE
        this.scene.pushMatrix();
        this.scene.translate(0,-1,0);
        this.scene.translate(0,Math.sqrt(2) + Math.sqrt(8),0);
        this.scene.translate(-0.69,0,0)
        this.scene.rotate(Math.PI,0,1,0);
        this.scene.scale(1, 1, -1); //flip normals
        
        //this.scene.setDiffuse(1,0.83,0);
        this.parallelogram.display();
        this.scene.popMatrix();


    //triangle purple
        this.scene.pushMatrix();
        this.scene.translate(0,Math.sqrt(2) + Math.sqrt(8),0);
        this.scene.translate(-2.3 - Math.sqrt(2),0,0)
        this.scene.rotate(3*Math.PI/4,0,0,1);

       // this.scene.setDiffuse(0.7,0,1);
        this.smallTriangle.setTexCoords([0,0, 0.25,0.25, 0,0.5])
        this.smallTriangle.display();
        this.scene.popMatrix();


    }

}