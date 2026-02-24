precision mediump float;

varying float vYPos;

void main() {
    if (vYPos > 0.5) //0.0 if using perspective division
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0); //yellow
    else
        gl_FragColor = vec4(0.6,0.6,0.9, 1.0); // blue
}
