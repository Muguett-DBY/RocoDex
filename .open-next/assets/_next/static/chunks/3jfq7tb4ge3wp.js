(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,8094,e=>{"use strict";var t=e.i(43476),r=e.i(71645);let i=`
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`,o=`
  precision mediump float;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uProgress;
  uniform float uImpulse;
  uniform float uOverdrive;

  float line(float value, float width) {
    return 1.0 - smoothstep(width, width * 2.4, abs(value));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv * 2.0 - 1.0;
    p.x *= uResolution.x / max(1.0, uResolution.y);

    float t = uTime * (0.32 + uOverdrive * 0.42);
    float perspective = 1.0 / max(0.18, p.y + 1.16);
    float verticalGrid = line(sin((p.x * perspective + uProgress * 2.0) * 10.0), 0.12);
    float horizontalGrid = line(sin((perspective + t * 0.22) * 9.0), 0.09) * step(-0.82, p.y);
    float cyanWave = line(p.y - sin(p.x * 2.25 + t) * 0.13 - 0.02, 0.025 + uImpulse * 0.018);
    float redWave = line(p.y - cos(p.x * 1.72 - t * 1.3) * 0.19 + 0.19, 0.022 + uImpulse * 0.014);
    float pointerField = exp(-length(p - vec2(uPointer.x, uPointer.y)) * 3.8);
    float scan = 0.5 + 0.5 * sin((uv.y + t * 0.1) * uResolution.y * 0.16);

    vec3 color = vec3(0.006, 0.018, 0.024);
    color += vec3(0.02, 0.38, 0.48) * (verticalGrid * 0.28 + horizontalGrid * 0.22);
    color += vec3(0.05, 0.86, 1.0) * cyanWave * (0.42 + pointerField * 0.34);
    color += mix(vec3(0.95, 0.12, 0.12), vec3(1.0, 0.75, 0.08), uOverdrive) * redWave * 0.58;
    color += vec3(0.1, 0.58, 0.7) * pointerField * 0.13;
    color += vec3(scan * 0.012);
    gl_FragColor = vec4(color, 0.82);
  }
`;function n(e,t,r){let i=e.createShader(t);return i?(e.shaderSource(i,r),e.compileShader(i),e.getShaderParameter(i,e.COMPILE_STATUS))?i:(e.deleteShader(i),null):null}e.s(["LitePersonalImmersiveScene",0,function(e){let a=(0,r.useRef)(null),u=(0,r.useRef)({active:e.active,reducedMotion:e.reducedMotion}),l=(0,r.useRef)(0),c=(0,r.useRef)(null),[d,s]=(0,r.useState)("loading");return(0,r.useEffect)(()=>{u.current={active:e.active,reducedMotion:e.reducedMotion},e.active&&c.current&&!l.current&&(l.current=window.requestAnimationFrame(c.current))},[e.active,e.reducedMotion]),(0,r.useEffect)(()=>{let t=a.current;if(!t)return;let r=t.getContext("webgl",{alpha:!0,antialias:!1,powerPreference:"low-power",preserveDrawingBuffer:!0});if(!r)return void s("fallback");let d=n(r,r.VERTEX_SHADER,i),f=n(r,r.FRAGMENT_SHADER,o),v=r.createProgram();if(!d||!f||!v||(r.attachShader(v,d),r.attachShader(v,f),r.linkProgram(v),!r.getProgramParameter(v,r.LINK_STATUS)))return void s("fallback");let m=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let p=r.getAttribLocation(v,"aPosition"),h=r.getUniformLocation(v,"uResolution"),g=r.getUniformLocation(v,"uPointer"),R=r.getUniformLocation(v,"uTime"),w=r.getUniformLocation(v,"uProgress"),A=r.getUniformLocation(v,"uImpulse"),b=r.getUniformLocation(v,"uOverdrive");r.useProgram(v),r.enableVertexAttribArray(p),r.vertexAttribPointer(p,2,r.FLOAT,!1,0,0);let x=0,P=!0,y=i=>{l.current=0;let o=u.current;if(o.active){if(!o.reducedMotion&&i-x<42){l.current=window.requestAnimationFrame(y);return}if(!o.reducedMotion||P){let n,a;x=i,n=Math.max(1,Math.round(t.clientWidth)),a=Math.max(1,Math.round(t.clientHeight)),(t.width!==n||t.height!==a)&&(t.width=n,t.height=a),r.viewport(0,0,n,a),r.uniform2f(h,t.width,t.height),r.uniform2f(g,e.pointerRef.current.x,e.pointerRef.current.y),r.uniform1f(R,o.reducedMotion?0:i/1e3),r.uniform1f(w,e.progressRef.current),r.uniform1f(A,e.impulseRef.current),r.uniform1f(b,+!!e.overdriveRef.current),r.drawArrays(r.TRIANGLES,0,3),e.impulseRef.current*=.86,P&&(P=!1,s("true")),o.reducedMotion||(l.current=window.requestAnimationFrame(y))}}},S=e=>{e.preventDefault(),s("fallback")};return t.addEventListener("webglcontextlost",S,{once:!0}),c.current=y,u.current.active&&(l.current=window.requestAnimationFrame(y)),()=>{l.current&&window.cancelAnimationFrame(l.current),l.current=0,c.current=null,t.removeEventListener("webglcontextlost",S),r.deleteBuffer(m),r.deleteProgram(v),r.deleteShader(d),r.deleteShader(f)}},[e.impulseRef,e.overdriveRef,e.pointerRef,e.progressRef]),(0,t.jsx)("div",{"data-cstd-webgl":!0,"data-cstd-render-quality":"lite","data-cstd-render-ready":d,"data-cstd-render-fallback":"fallback"===d?"true":"false","data-cstd-render-active":e.active?"true":"false","data-cstd-neural-city":!0,"data-cstd-lite-immersive":!0,className:"absolute inset-0 opacity-[0.72] mix-blend-screen",children:"fallback"===d?null:(0,t.jsx)("div",{"data-cstd-webgl-canvas":!0,className:"absolute inset-0",children:(0,t.jsx)("canvas",{ref:a,className:"h-full w-full"})})})}])},40930,function(e){e.n(e.i(8094))}]);