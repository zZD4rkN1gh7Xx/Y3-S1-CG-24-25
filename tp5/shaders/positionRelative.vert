//precision mediump float;

attribute vec3 aVertexPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying float vYPos;

void main() {
    //world position according to slides
    vec4 worldPos = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0); 
    // vec4(aVertexPosition, 1.0) to homogenise the coords, so they can be multiplied
    gl_Position = worldPos;
    //vYPos = gl_Position.y / gl_Position.w; could be used for to account for perspective division, but it messes things a bit
    vYPos = gl_Position.y;
}