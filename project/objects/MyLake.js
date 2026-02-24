import { CGFobject, CGFappearance, CGFshader } from '../../lib/CGF.js';
import { MyEllipsoid } from './MyElipsoid.js';

export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        this.elipsoidRadiusX = 28;
        this.elipsoidRadiusY = 0.1;
        this.elipsoidRadiusZ = 30;
        
        this.water = new MyEllipsoid(this.scene, 24, 16, this.elipsoidRadiusX, this.elipsoidRadiusY, this.elipsoidRadiusZ);
        
        // Create the water shader
        this.waterShader = new CGFshader(this.scene.gl, "shaders/water.vert", "shaders/water.frag");
        
        this.waterTexture = new CGFappearance(scene);
        this.waterTexture.setAmbient(0.2, 0.4, 0.6, 1);
        this.waterTexture.setDiffuse(0.3, 0.5, 0.8, 1);
        this.waterTexture.setSpecular(0.8, 0.9, 1.0, 1);
        this.waterTexture.setShininess(50.0);
        this.waterTexture.loadTexture('textures/water.png');
        
        // Animation variables
        this.time = 0;
    }
    
    update(deltaTime) {
        // This method MUST be called from your main scene update loop!
        this.time += deltaTime * 0.001;
        
        // Update shader with current time
        this.waterShader.setUniformsValues({
            uTime: this.time
        });
    }
    
    display() {
        this.scene.pushMatrix();
        this.scene.translate(-60, 0.01, 10);
        
        // IMPORTANT: Set the shader before applying texture
        this.scene.setActiveShader(this.waterShader);
        
        this.waterTexture.apply();
        this.water.display();
        
        // Reset to default shader
        this.scene.setActiveShader(this.scene.defaultShader);
        
        this.scene.popMatrix();
    }
}