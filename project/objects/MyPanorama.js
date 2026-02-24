import {CGFobject} from '../../lib/CGF.js';
import { MySphere } from "./MySphere.js";

export class MyPanorama extends CGFobject {
  constructor(scene, texture) {
    super(scene);  
    this.texture = texture;
  
    this.landscape = new MySphere(this.scene, 40, 10);
    this.landscape.setInsideView();

    //this.initBuffers();
  }

  display(cameraPosition){
    this.scene.pushMatrix();
    this.scene.translate(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    this.scene.scale(200, 200, 200); 
    this.texture.apply();
    this.landscape.display();
    this.scene.popMatrix();
  }

}
