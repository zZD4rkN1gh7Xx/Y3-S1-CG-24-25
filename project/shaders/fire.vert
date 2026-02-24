attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform float uTime;

varying vec2 vTexCoords;

void main(void) {
    vec3 pos = aVertexPosition;

    // Wobble effect
    pos.x += 0.1 * sin(uTime * 5.0 + pos.y * 10.0);
    pos.z += 0.1 * cos(uTime * 5.0 + pos.y * 10.0);

    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);

    vTexCoords = aTextureCoord;
}
