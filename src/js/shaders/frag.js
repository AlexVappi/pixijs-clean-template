// export let shaderFrag = `
// #ifdef GL_ES
// precision mediump float;
// #endif

// #define PI 3.14159265359
// #define TWO_PI 6.28318530718

// uniform sampler2D uSampler;
// uniform vec4 filterArea;
// uniform float mouseX;
// uniform float mouseY;
// varying vec2 vTextureCoord;
// uniform float u_time;

// void main() {
//    vec2 mouse = vec2(mouseX, mouseY);
//    float sinF = sin(u_time) * 0.5 + 0.5;
//    float dist = length(vTextureCoord - mouse);
//    float prox = 1. - dist/0.2;
//    prox = clamp(prox, 0., sinF);

//    vec4 tex = texture2D(uSampler, mix(vTextureCoord, mouse, prox*0.5));
//    gl_FragColor = tex;
// }
// `;

export let shaderFrag = `

#ifdef GL_ES
precision mediump float;
#endif


uniform sampler2D tDiffuse;
uniform sampler2D uSampler;
uniform float resolutionX;
uniform float resolutionY;
// varying vec2 vUv;
varying vec2 vTextureCoord;
// uniform vec2 uMouse;
uniform float uMouseX;
uniform float uMouseY;
uniform float uVelo;


float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
	uv -= disc_center;
	uv *= vec2(resolutionX, resolutionY);
	return smoothstep(disc_radius+border_size, disc_radius-border_size, sqrt(dot(uv, uv)));
}

float hash12(vec2 p) {
	float h = dot(p,vec2(127.1,311.7));	
	return fract(sin(h)*43758.5453123);
}

void main()	{
	vec2 st = gl_FragCoord.xy/vec2(resolutionX, resolutionY);
	vec2 newUV = vTextureCoord;
	vec4 color = vec4(1.,0.,0.,1.);

	// float c = circle(newUV, vec2(uMouseX, uMouseY), 0.05, 0.1);

	float hash = hash12(vTextureCoord*10.);
	float c = circle(newUV, vec2(uMouseX, uMouseY), 0.1, 0.2+uVelo*0.01)*10.*uVelo;
	vec2 warpedUV = vTextureCoord + vec2(hash - 0.5)*c; //power
	color = texture2D(uSampler,warpedUV);

	// color = vec4(vec3(texture2D(uSampler, mix(newUV.xy, vec2(uMouseX, uMouseY), c*uVelo*50.))), 1.);

	gl_FragColor = color;
}
`