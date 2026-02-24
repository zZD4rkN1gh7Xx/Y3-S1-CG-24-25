import {CGFappearance, CGFobject} from '../../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    constructor(scene, rotationDeg, rotationAxis, trunkRadius, treeHeight, crownRGB) {
        super(scene);
        this.rotationDeg = rotationDeg;
        this.rotationAxis = rotationAxis;
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.crownColor = crownRGB;

       //this.trunkHeight = 0.2 * treeHeight;
        this.trunkHeight = treeHeight; // full height
        this.crownHeight = 0.8 * treeHeight;
        
        this.numPyramids = Math.floor(3 + Math.random() * 5); //rand between 3 and 7
        this.pyramids = [];
        
        //make better looking many leaf having trees
        if(this.treeHeight < 5 && this.numPyramids > 4){
            this.trunkRadius = 0.5 + Math.random() * 0.5;
        }
        
        this.trunk = new MyCone(scene, 12, 1, this.trunkHeight, this.trunkRadius);

        let pyramidHeight = this.crownHeight / this.numPyramids;
        let pyramidWidth = this.crownHeight / (this.numPyramids + 1);
        //start the first pyramid at 20% of tree height
        
        let currentY = this.trunkHeight * 0.2;

        for (let i = 0; i < this.numPyramids; i++) {
            //could decrease stacks
            let pyramid = new MyPyramid(scene, 6, 6, pyramidHeight, pyramidWidth);

            this.pyramids.push({ obj: pyramid, y: currentY });
            currentY += pyramidHeight * 2;
            //pyramidWidth -= 0.1;
            pyramidWidth -= 0.2 / this.numPyramids;
        }

        //tree leaf texture
        this.scene.treeLeafTexture = new CGFappearance(this.scene);
        //this.scene.treeLeafTexture.setAmbient(0.2, 0.4, 0.2, 1);
       //this.scene.treeLeafTexture.setDiffuse(0.3, 0.6, 0.3, 1);
       //this.scene.treeLeafTexture.setSpecular(0.0, 0.0, 0.0, 1);
        //this.scene.treeLeafTexture.setShininess(10);
        this.scene.treeLeafTexture.loadTexture('textures/leaves2.png');

        //tree trunk texture
        this.scene.treeTrunkTexture = new CGFappearance(this.scene);
       // this.scene.treeTrunkTexture.setAmbient(0.4, 0.4, 0.4, 1);
        //this.scene.treeTrunkTexture.setDiffuse(0.6, 0.6, 0.6, 1);
        //this.scene.treeTrunkTexture.setSpecular(0.0, 0.0, 0.0, 1);
        //this.scene.treeTrunkTexture.setShininess(10);
        this.scene.treeTrunkTexture.loadTexture('textures/trunk.png');

    }

    display() {
        this.scene.pushMatrix();

        if (this.rotationAxis === 'X') {
            this.scene.rotate(this.rotationDeg * Math.PI / 180, 1, 0, 0);
        } else if (this.rotationAxis === 'Z') {
            this.scene.rotate(this.rotationDeg * Math.PI / 180, 0, 0, 1);
        }

        this.scene.pushMatrix();
        this.scene.setDiffuse(0.55, 0.27, 0.07, 1);
        this.scene.setSpecular(0, 0, 0, 1);
        this.scene.treeTrunkTexture.apply();
        this.trunk.display();
        this.scene.treeLeafTexture.apply();
        this.scene.popMatrix();
        
        this.scene.setDiffuse(...this.crownColor, 1);
        
        
        
       
        for (let part of this.pyramids) {
            this.scene.pushMatrix();
            this.scene.translate(0, part.y, 0);
            this.scene.scale(5,5,5);
            part.obj.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}
