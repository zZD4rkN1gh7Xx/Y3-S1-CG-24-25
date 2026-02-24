precision mediump float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;      
uniform sampler2D uSampler2;     
uniform float blendFactor;       
uniform float emissionFactor;    

void main() {

    
    vec4 color1 = texture2D(uSampler, vTextureCoord); 
    vec4 color2 = texture2D(uSampler2, vTextureCoord);  
    
    vec4 finalColor = mix(color1, color2, blendFactor); // blends the 2 textures based on the bland facture
    
    finalColor.rgb += vec3(1.0, 0.6, 0.0) * emissionFactor * blendFactor;
    
    gl_FragColor = finalColor;
}