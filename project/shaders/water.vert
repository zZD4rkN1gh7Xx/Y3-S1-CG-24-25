attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float uTime;

varying vec2 vTextureCoord;
varying vec3 vLightWeighting;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
    
    // Simple lighting
    vec3 transformedNormal = (uNMatrix * vec4(aVertexNormal, 0.0)).xyz;
    float directionalLightWeighting = max(dot(transformedNormal, vec3(0.0, 1.0, 0.0)), 0.0);
    vLightWeighting = vec3(0.3 + directionalLightWeighting * 0.7);
}