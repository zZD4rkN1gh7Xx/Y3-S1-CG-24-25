import {CGFobject} from '../../lib/CGF.js';
/**
* MyCone
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param stacks - number of divisions along the Y axis
*/
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks, height, radius) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.height = height;
        this.radius = radius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;

        for (var i = 0; i < this.slices; i++) {
            let x = this.radius * Math.cos(ang);
            let z = -this.radius * Math.sin(ang);
            this.vertices.push(x, 0, z);
            this.normals.push(Math.cos(ang), this.height / Math.sqrt(this.height ** 2 + this.radius ** 2), -Math.sin(ang));
            this.texCoords.push(i / this.slices, 1); // base edge texture coord
            ang += alphaAng;
        }

        this.vertices.push(0, this.height, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0); // tip texture coord

        for (var i = 0; i < this.slices; i++) {
            this.indices.push(i, (i + 1) % this.slices, this.slices); // tip index is at this.slices
        }   

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
        this.updateTexCoordsGLBuffers();
    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12
        
        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
