precision mediump float;

uniform sampler2D uSampler;

varying vec2 vTexCoords;

void main(void) {
    vec4 texColor = texture2D(uSampler, vTexCoords);
    gl_FragColor = texColor;
}
