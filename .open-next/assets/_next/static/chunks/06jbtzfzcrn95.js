(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,4615,e=>{"use strict";var t=e.i(43476),r=e.i(71645);let n=`
  struct State { value: vec4f }
  @group(0) @binding(0) var<uniform> state: State;

  struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
  }

  @vertex fn vertexMain(@builtin(vertex_index) index: u32) -> VertexOutput {
    var points = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
    var output: VertexOutput;
    output.position = vec4f(points[index], 0.0, 1.0);
    output.uv = points[index] * 0.5 + 0.5;
    return output;
  }

  fn traceLine(value: f32, width: f32) -> f32 {
    return 1.0 - smoothstep(width, width * 2.2, abs(value));
  }

  @fragment fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
    let time = state.value.x;
    let progress = state.value.y;
    let velocity = state.value.z;
    let overdrive = state.value.w;
    let uv = input.uv;
    let centered = uv * 2.0 - 1.0;
    let lane = traceLine(sin((centered.x * 6.0 + centered.y * 3.0 + progress * 8.0) + time * 0.24), 0.045);
    let cross = traceLine(sin((centered.y * 9.0 - centered.x * 1.8) - time * 0.18), 0.035);
    let pulse = pow(max(0.0, sin(length(centered) * 18.0 - time * (1.2 + velocity * 3.0))), 14.0);
    let cyan = vec3f(0.055, 0.72, 0.9) * (lane * 0.16 + pulse * 0.2);
    let amber = vec3f(0.96, 0.68, 0.12) * cross * (0.07 + overdrive * 0.12);
    let red = vec3f(0.9, 0.06, 0.04) * pulse * overdrive * 0.12;
    let alpha = clamp((lane + cross + pulse) * 0.12, 0.0, 0.24);
    return vec4f(cyan + amber + red, alpha);
  }
`;e.s(["WebGpuSignalField",0,function(e){let{onFallback:i}=e,a=(0,r.useRef)(null),u=(0,r.useRef)({active:e.active,reducedMotion:e.reducedMotion}),o=(0,r.useRef)(0),c=(0,r.useRef)(null),[l,s]=(0,r.useState)("loading");return(0,r.useEffect)(()=>{u.current={active:e.active,reducedMotion:e.reducedMotion},e.active&&c.current&&!o.current&&(o.current=window.requestAnimationFrame(c.current))},[e.active,e.reducedMotion]),(0,r.useEffect)(()=>{let t,r=a.current,l=navigator.gpu,d=r?.getContext("webgpu");if(!r||!l||!d){s("fallback"),i?.();return}let f=!1,v=0,p=!1,m=null;return(async()=>{let t=await l.requestAdapter();if(!t||f){s("fallback"),f||i?.();return}let a=await t.requestDevice();if(m=a,f)return;let g=l.getPreferredCanvasFormat(),w=a.createShaderModule({code:n}),h=a.createRenderPipeline({layout:"auto",vertex:{module:w,entryPoint:"vertexMain"},fragment:{module:w,entryPoint:"fragmentMain",targets:[{format:g,blend:{color:{srcFactor:"src-alpha",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}}}]},primitive:{topology:"triangle-list"}}),b=a.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),x=a.createBindGroup({layout:h.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:b}}]}),y=()=>{let e=.72*Math.min(window.devicePixelRatio||1,1);r.width=Math.max(1,Math.floor(window.innerWidth*e)),r.height=Math.max(1,Math.floor(window.innerHeight*e)),d.configure({device:a,format:g,alphaMode:"premultiplied"}),p=!0};y(),window.addEventListener("resize",y),s("ready");let M=()=>{o.current||!u.current.active||u.current.reducedMotion&&0!==v||(o.current=window.requestAnimationFrame(R))},R=t=>{if(o.current=0,!u.current.active||!p)return;if(!u.current.reducedMotion&&t-v<32)return void M();if(u.current.reducedMotion&&v>0)return;v=t;let r=new Float32Array([t/1e3,e.progressRef.current,e.velocityRef.current,+!!e.overdriveRef.current]);a.queue.writeBuffer(b,0,r);let n=a.createCommandEncoder(),i=n.beginRenderPass({colorAttachments:[{view:d.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:0},loadOp:"clear",storeOp:"store"}]});i.setPipeline(h),i.setBindGroup(0,x),i.draw(3),i.end(),a.queue.submit([n.finish()]),M()};return c.current=R,M(),()=>window.removeEventListener("resize",y)})().then(e=>{t=e}).catch(()=>{f||(s("fallback"),i?.())}),()=>{f=!0,o.current&&window.cancelAnimationFrame(o.current),o.current=0,c.current=null,t?.(),p&&d.unconfigure(),m?.destroy()}},[i,e.overdriveRef,e.progressRef,e.velocityRef]),(0,t.jsx)("canvas",{ref:a,"aria-hidden":"true","data-cstd-webgpu-field":!0,"data-cstd-webgpu-state":l,className:"absolute inset-0 h-full w-full mix-blend-screen opacity-55"})}])},95175,function(e){e.n(e.i(4615))}]);