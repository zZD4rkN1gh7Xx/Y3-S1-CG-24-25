#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uSampler;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main() {
    // Animate texture coordinates for moving water effect
    vec2 animatedCoord = vTextureCoord + vec2(sin(uTime) * 0.01, cos(uTime * 0.8) * 0.01);
    
    vec4 textureColor = texture2D(uSampler, animatedCoord);
    
    // Add some blue tint and make it slightly transparent
    vec3 waterColor = mix(textureColor.rgb, vec3(0.2, 0.4, 0.8), 0.3);
    
    gl_FragColor = vec4(waterColor * vLightWeighting, 0.8);
}