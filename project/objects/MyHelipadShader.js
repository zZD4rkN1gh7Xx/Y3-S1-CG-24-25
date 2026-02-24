// MyHelipadShader.js - More discrete transitions
import { CGFshader, CGFtexture } from "../../lib/CGF.js";

export class MyHelipadShader extends CGFshader {
    constructor(scene) {
        super(scene.gl, "shaders/heliPad.vert", "shaders/heliPad.frag");
        
        this.scene = scene;
        
        this.hTexture = new CGFtexture(scene, "textures/H.png");
        this.upTexture = new CGFtexture(scene, "textures/UP.png");
        this.downTexture = new CGFtexture(scene, "textures/DOWN.png");
        
        this.blendFactor = 0.0;
        this.currentMode = "IDLE";
        
        this.setUniformsValues({
            'uSampler': 0,
            'uSampler2': 1,
            'blendFactor': 0.0,
            'emissionFactor': 0.1
        });
    }
    
    update(t, status) {
        let targetBlend = 0.0;
        let emission = 0.1;
        
        switch(status) {
            case "TAKING_OFF":
                let cycle = Math.sin(t * 0.002);
                targetBlend = cycle > 0 ? 1.0 : 0.0; 
                
                emission = 0.6 + 0.4 * Math.abs(Math.sin(t * 0.0015));
                break;
                
            case "LANDING":
                
                let landingCycle = Math.sin(t * 0.002);
                targetBlend = landingCycle > 0 ? 1.0 : 0.0;
                
                emission = 0.6 + 0.4 * Math.abs(Math.sin(t * 0.0015));
                break;
                
            case "IDLE":
            default:
                targetBlend = 0.0; 
                emission = 0.2;
                break;
        }
        
        this.blendFactor += (targetBlend - this.blendFactor) * 0.15;
    
        this.setUniformsValues({
            'blendFactor': this.blendFactor,
            'emissionFactor': emission
        });
        
        this.currentMode = status;
    }
    
    applyTextures(status) {
        this.hTexture.bind(0);
        
    
        if (status === "TAKING_OFF") {
            this.upTexture.bind(1);
        } else if (status === "LANDING") {
            this.downTexture.bind(1);
        } else {
            this.hTexture.bind(1); 
        }
    }
}