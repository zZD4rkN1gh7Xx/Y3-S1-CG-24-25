#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {

	vec4 color = texture2D(uSampler, vTextureCoord);
    
    float l = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
	vec4 colorSepia = vec4(l,l,l,color.a);
    
	gl_FragColor = colorSepia;
}