"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[846],{9205:function(e,t,a){a.d(t,{Z:function(){return s}});var r=a(2265);let i=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),o=function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.filter((e,t,a)=>!!e&&a.indexOf(e)===t).join(" ")};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let l=(0,r.forwardRef)((e,t)=>{let{color:a="currentColor",size:i=24,strokeWidth:l=2,absoluteStrokeWidth:s,className:c="",children:d,iconNode:h,...u}=e;return(0,r.createElement)("svg",{ref:t,...n,width:i,height:i,stroke:a,strokeWidth:s?24*Number(l)/Number(i):l,className:o("lucide",c),...u},[...h.map(e=>{let[t,a]=e;return(0,r.createElement)(t,a)}),...Array.isArray(d)?d:[d]])}),s=(e,t)=>{let a=(0,r.forwardRef)((a,n)=>{let{className:s,...c}=a;return(0,r.createElement)(l,{ref:n,iconNode:t,className:o("lucide-".concat(i(e)),s),...c})});return a.displayName="".concat(e),a}},7226:function(e,t,a){a.d(t,{Z:function(){return r}});let r=(0,a(9205).Z)("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]])},5929:function(e,t,a){a.d(t,{Z:function(){return r}});let r=(0,a(9205).Z)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]])},1782:function(e,t,a){a.d(t,{PG:function(){return o},TZ:function(){return ef}});var r=a(7437),i=a(2265);let o={chromatic:{name:"chromatic",modes:{dark:{colors:["#000000","#aae8ff","#c5fe9e","#f7888d","#0d0d0d","#fffdc3","#007cff"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1.2,intensity:2,scale:1.6,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.26,vigOpacity:.6,shaderOpacity:1},light:{colors:["#ffffff","#ffffff","#ffffff","#ffb3b3","#adadad","#f5ff70","#007cff"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1.2,intensity:2,scale:2.5,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.24,vigOpacity:.16,shaderOpacity:1}}},silver:{name:"silver",modes:{dark:{colors:["#000000","#dedede","#747270","#e5e5e5","#0d0d0d","#ffffff","#e6e6e6"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1.2,intensity:2,scale:2.5,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.26,vigOpacity:.6,shaderOpacity:.88},light:{colors:["#f6f6f6","#ffffff","#ffffff","#f7f7f7","#c9c9c9","#d0d0d0","#d1d1d1"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1.2,intensity:2,scale:2.5,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.2,vigOpacity:.26,shaderOpacity:1}}},gold:{name:"gold",modes:{dark:{colors:["#000000","#ffffff","#ffffff","#f7d488","#0d0d0d","#fffdc3","#ffffff"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1,intensity:2,scale:2.5,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.26,vigOpacity:.6,shaderOpacity:.92},light:{colors:["#fff8e1","#fffbe0","#ffffff","#fff6d6","#d2c7a7","#dcd2bc","#f9f7e5"],alphas:[1,1,1,1,1,1,1],direction:80,speed:1.2,intensity:2,scale:2.5,softness:.18,distortion:.3,complexity:.68,shape:1,blur:1,vignette:.22,vigOpacity:.24,shaderOpacity:1}}}},n=`
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`,l=`
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_color1, u_color2, u_color3, u_color4, u_color5, u_color6, u_color7;
  uniform float u_alpha1, u_alpha2, u_alpha3, u_alpha4, u_alpha5, u_alpha6, u_alpha7;
  uniform float u_intensity, u_scale, u_direction;
  uniform float u_softness, u_distortion, u_complexity, u_shape;
  uniform float u_vignette, u_vigOpacity, u_blur, u_shaderOpacity;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                        -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289v2(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
    vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x_) - 0.5;
    vec3 ox = floor(x_ + 0.5);
    vec3 a0 = x_ - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p, float oct) {
    float val = 0.0, amp = 0.5;
    int n = int(oct);
    for (int i = 0; i < 7; i++) {
      if (i >= n) break;
      val += amp * snoise(p);
      p *= 2.0;
      amp *= 0.5;
    }
    return val;
  }

  float nfbm(vec2 p) { return fbm(p, 3.0 + u_complexity * 4.0); }

  /* 5-stop palette used by effect 1 (Plasma) — direct port of \`palette\` from
   * the canonical engine. Stops at t = 0, 0.25, 0.5, 0.75, 1.0. */
  vec3 palette(float t) {
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float k = 64.0;
    float w1 = u_alpha1 * exp(-k * t * t);
    float w2 = u_alpha2 * exp(-k * (t - 0.25) * (t - 0.25));
    float w3 = u_alpha3 * exp(-k * (t - 0.5)  * (t - 0.5));
    float w4 = u_alpha4 * exp(-k * (t - 0.75) * (t - 0.75));
    float w5 = u_alpha5 * exp(-k * (t - 1.0)  * (t - 1.0));
    float total = w1 + w2 + w3 + w4 + w5 + 0.0001;
    return (u_color1 * w1 + u_color2 * w2 + u_color3 * w3 +
            u_color4 * w4 + u_color5 * w5) / total;
  }

  /* Per-pixel alpha that re-introduces transparency when the user dials any
   * palette stop's alpha below 1. Same \`paletteAlpha\` from the canonical
   * engine. With every preset shipping all-1 alphas, this returns ~1 for every
   * pixel — but mirroring it keeps custom-preset behaviour identical. */
  float paletteAlpha(float t) {
    t = clamp(t, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    float k = 64.0;
    float w1 = u_alpha1 * exp(-k * t * t);
    float w2 = u_alpha2 * exp(-k * (t - 0.25) * (t - 0.25));
    float w3 = u_alpha3 * exp(-k * (t - 0.5)  * (t - 0.5));
    float w4 = u_alpha4 * exp(-k * (t - 0.75) * (t - 0.75));
    float w5 = u_alpha5 * exp(-k * (t - 1.0)  * (t - 1.0));
    float totalW = w1 + w2 + w3 + w4 + w5 + 0.0001;
    float rawW = exp(-k * t * t)
               + exp(-k * (t - 0.25) * (t - 0.25))
               + exp(-k * (t - 0.5)  * (t - 0.5))
               + exp(-k * (t - 0.75) * (t - 0.75))
               + exp(-k * (t - 1.0)  * (t - 1.0))
               + 0.0001;
    return totalW / rawW;
  }

  vec2 warp(vec2 p, float t) {
    float str = u_distortion * 2.0;
    return vec2(
      nfbm(p + vec2(t * 0.1, 0.0)),
      nfbm(p + vec2(0.0, t * 0.12) + 5.0)
    ) * str;
  }

  /* Plasma: four sine bands warped by an FBM field, mapped through the
   * 5-stop palette. Identical to effect 1 in the canonical engine. */
  vec3 computeEffect(vec2 uv, float aspect, float t, float dist, float cpx) {
    vec2 p = (uv - 0.5) * u_scale;
    p.x *= aspect;
    p += vec2(cos(u_direction), sin(u_direction)) * t * 0.15;

    float freq = 3.0 + cpx * 8.0;
    float val = 0.0;
    val += sin(p.x * freq + t);
    val += sin(p.y * freq + t * 1.3);
    val += sin((p.x + p.y) * freq * 0.7 + t * 0.7);
    val += sin(length(p) * freq * 0.8 - t * 1.5);
    vec2 w = warp(p, t);
    val += (w.x + w.y) * dist;
    val = val * 0.2 * u_intensity + 0.5;

    return palette(clamp(val, 0.0, 1.0));
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float aspect = u_resolution.x / u_resolution.y;
    float t = u_time;          // JS already multiplied u_time by preset.speed.
    float dist = u_distortion;
    float cpx = u_complexity;

    /* 5-tap cross blur (center + cardinal offsets). The chromatic/silver/gold
     * presets all ship with blur=1 so this path is always active. 5 taps
     * instead of the canonical engine's 9 saves ~44% fragment work; the
     * perceptual difference is nil because the output is already soft from
     * the plasma's low spatial frequency and CSS blur on reflections. */
    vec3 col;
    if (u_blur < 0.01) {
      col = computeEffect(uv, aspect, t, dist, cpx);
    } else {
      float r = u_blur * 0.02;
      col  = computeEffect(uv,                  aspect, t, dist, cpx) * 0.4;
      col += computeEffect(uv + vec2( r, 0.0),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(-r, 0.0),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(0.0,  r),  aspect, t, dist, cpx) * 0.15;
      col += computeEffect(uv + vec2(0.0, -r),  aspect, t, dist, cpx) * 0.15;
    }

    /* Gamma punch — adds the contrast pop that defines the chromatic
     * highlights. From the canonical engine: \`col = pow(col, vec3(1.3))\`. */
    col = pow(col, vec3(1.3));

    /* Vignette — soft edge darkening so corners read as recessed. The 40-px
     * scale at the bottom of the formula is hard-coded in the canonical
     * engine; we keep it for visual parity. */
    float edgeDist = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
    float vigPx = 40.0 / min(u_resolution.x, u_resolution.y);
    float vigRange = vigPx * (1.0 + u_vignette * 3.0);
    float vig = edgeDist * edgeDist / (vigRange * vigRange);
    vig = smoothstep(0.0, 1.0, vig);
    col *= mix(1.0, vig, u_vignette * u_vigOpacity);

    /* Per-pixel alpha. With all-1 alphas the formula collapses to ~1 but the
     * computation matches the canonical engine so custom presets behave the
     * same. */
    float colorAlpha = (u_alpha1 + u_alpha2 + u_alpha3 + u_alpha4 + u_alpha5) / 5.0;
    if (colorAlpha < 0.999) {
      vec3 c1d = col - u_color1, c2d = col - u_color2, c3d = col - u_color3,
           c4d = col - u_color4, c5d = col - u_color5;
      float prox1 = exp(-8.0 * dot(c1d, c1d));
      float prox2 = exp(-8.0 * dot(c2d, c2d));
      float prox3 = exp(-8.0 * dot(c3d, c3d));
      float prox4 = exp(-8.0 * dot(c4d, c4d));
      float prox5 = exp(-8.0 * dot(c5d, c5d));
      float pTotal = prox1 + prox2 + prox3 + prox4 + prox5 + 0.0001;
      colorAlpha = (prox1 * u_alpha1 + prox2 * u_alpha2 + prox3 * u_alpha3 +
                    prox4 * u_alpha4 + prox5 * u_alpha5) / pTotal;
    }
    float alpha = colorAlpha;

    /* Touch the unused-at-effect-1 uniforms so GL drivers that complain about
     * declared-but-unread uniforms (some Mali / Adreno builds do) keep them
     * live. The contribution is provably zero. */
    alpha += 0.0 * (u_softness + u_shape +
                    u_alpha6 + u_alpha7 +
                    u_color6.x + u_color7.x);

    gl_FragColor = vec4(col, alpha * u_shaderOpacity);
  }
`;function s(e,t,a){let r=e.createShader(t);if(!r)throw Error("metal-fx: gl.createShader returned null");if(e.shaderSource(r,a),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r);throw e.deleteShader(r),Error(`metal-fx: shader compile failed: ${t??"(no info log)"}`)}return r}let c=null,d=null,h=["u_resolution","u_time","u_color1","u_color2","u_color3","u_color4","u_color5","u_color6","u_color7","u_alpha1","u_alpha2","u_alpha3","u_alpha4","u_alpha5","u_alpha6","u_alpha7","u_intensity","u_scale","u_direction","u_softness","u_distortion","u_complexity","u_shape","u_vignette","u_vigOpacity","u_blur","u_shaderOpacity"];function u(e){e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA);let t=s(e,e.VERTEX_SHADER,n),a=s(e,e.FRAGMENT_SHADER,l),r=function(e,t,a){let r=e.createProgram();if(!r)throw Error("metal-fx: gl.createProgram returned null");if(e.attachShader(r,t),e.attachShader(r,a),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS)){let t=e.getProgramInfoLog(r);throw e.deleteProgram(r),Error(`metal-fx: program link failed: ${t??"(no info log)"}`)}return r}(e,t,a);e.useProgram(r);let i=e.createBuffer();if(!i)throw Error("metal-fx: gl.createBuffer returned null");e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),e.STATIC_DRAW);let o=e.getAttribLocation(r,"a_position");e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);let c={};for(let t of h)c[t]=e.getUniformLocation(r,t);return{program:r,buffer:i,uniforms:c}}function f(){let e,t;if(c)return c;let a=Math.min(2,"u">typeof window&&window.devicePixelRatio||1),r=Math.round(96*a),i="u">typeof OffscreenCanvas;if(i)t=(e=new OffscreenCanvas(r,r)).getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!1});else{let a=document.createElement("canvas");a.width=r,a.height=r,t=a.getContext("webgl",{alpha:!0,premultipliedAlpha:!1,antialias:!1,preserveDrawingBuffer:!0})??a.getContext("experimental-webgl"),e=a}if(!t)throw Error("metal-fx: WebGL not supported");let{program:n,buffer:l,uniforms:s}=u(t);return e.addEventListener("webglcontextlost",e=>{e.preventDefault(),c&&(c.contextLost=!0)},!1),e.addEventListener("webglcontextrestored",()=>{if(!c)return;let e=u(c.gl);c.program=e.program,c.buffer=e.buffer,c.uniforms=e.uniforms,c.presetDirty=!0,c.contextLost=!1,null==d||d()},!1),c={glCanvas:e,gl:t,program:n,buffer:l,uniforms:s,preset:o.chromatic.modes.dark,presetDirty:!0,contextLost:!1,useOffscreen:i,frameBitmap:null,startMs:performance.now(),pausedMs:0,pausedAtMs:null,rafId:0,dpr:a,instances:new Set,frameCount:0,glowQueue:[],glowIdx:0,glowSkip:0,glowPixels:new Uint8Array(r*r*4),glowPixelsW:r,glowPixelsH:r}}let p=0;function m(){if(!c)return;let e=performance.now();if(e-p<1500)return;p=e;let{gl:t,glCanvas:a}=c,r=a.width,i=a.height;(c.glowPixelsW!==r||c.glowPixelsH!==i)&&(c.glowPixelsW=r,c.glowPixelsH=i,c.glowPixels=new Uint8Array(r*i*4)),t.readPixels(0,0,r,i,t.RGBA,t.UNSIGNED_BYTE,c.glowPixels)}let g={bx:0,by:0};function x(e,t,a){if(!c)return g.bx=0,g.by=0,g;let{glCanvas:r}=c,i=r.width,o=r.height,n=e.dpr,l=e.cssWidth*n,s=e.cssHeight*n,d=i/(140*n)*l/e.shaderScale,h=o/(40*n)*s/e.shaderScale;d>i&&(d=i),h>o&&(h=o);let u=(o-h)/2,f=(i-d)/2+t/e.cssWidth*d,p=u+a/e.cssHeight*h;return g.bx=Math.round(f),g.by=Math.round(o-1-p),g}let v={r:0,g:0,b:0,lum:0,count:0};function w(e,t,a,r,i,o){let n=Math.max(1,0|o),l=Math.max(0,r-n),s=Math.min(t,r+n+1),c=Math.max(0,i-n),d=Math.min(a,i+n+1);v.r=0,v.g=0,v.b=0,v.lum=0,v.count=0;for(let a=c;a<d;a++){let r=a*t;for(let t=l;t<s;t++){let a=(r+t)*4;v.r+=e[a],v.g+=e[a+1],v.b+=e[a+2],v.lum+=(.2126*e[a]+.7152*e[a+1]+.0722*e[a+2])/255,v.count++}}return v}let y={r:255,g:255,b:255};function b(e,t,a,r){if(!c)return 0;m();let i=x(e,t,a),o=w(c.glowPixels,c.glowPixelsW,c.glowPixelsH,i.bx,i.by,r);return o.count>0?o.lum/o.count:0}function M(e,t){let a=!1;void 0!==t.cssWidth&&t.cssWidth!==e.cssWidth&&(e.cssWidth=t.cssWidth,a=!0),void 0!==t.cssHeight&&t.cssHeight!==e.cssHeight&&(e.cssHeight=t.cssHeight,a=!0),void 0!==t.cornerRadius&&(e.cornerRadius=t.cornerRadius),void 0!==t.scale&&(e.scale=t.scale),void 0!==t.kind&&t.kind!==e.kind&&(e.kind=t.kind,void 0===t.shaderScale&&(e.shaderScale=("circle"===t.kind?1.3:1.6)*e.scale),void 0===t.ringCssPx&&(e.ringCssPx=("circle"===t.kind?2:1)*e.scale)),void 0!==t.shaderScale&&(e.shaderScale=t.shaderScale),void 0!==t.ringCssPx&&(e.ringCssPx=t.ringCssPx),void 0!==t.opacityMul&&(e.opacityMul=t.opacityMul),void 0===t.paused||t.paused===e.paused||(e.paused=t.paused,t.paused||!c||0!==c.rafId||null!==c.pausedAtMs||c.contextLost||T()),a&&k(e)}d=()=>{c&&c.instances.size>0&&null===c.pausedAtMs&&T()},"u">typeof document&&document.addEventListener("visibilitychange",()=>{!c||null!==c.pausedAtMs||c.contextLost||(document.hidden?$():c.instances.size>0&&T())});let _=null;function k(e){e.dpr="u">typeof window&&window.devicePixelRatio||1;let t=Math.max(1,Math.round(e.cssWidth*e.dpr)),a=Math.max(1,Math.round(e.cssHeight*e.dpr));e.canvas.width!==t&&(e.canvas.width=t),e.canvas.height!==a&&(e.canvas.height=a)}let C=0;function S(e){var t;if(!c)return;if(c.contextLost){c.rafId=0;return}let a=!1;for(let e of c.instances)if(e.visible&&(!e.paused||!e.everCopied)){a=!0;break}if(!a){c.rafId=0;return}if(c.rafId=requestAnimationFrame(S),!(e-C<66)){for(let a of(C=e,function(e){if(!c)return;let{gl:t,uniforms:a,preset:r,glCanvas:i}=c,o=(e-c.startMs-c.pausedMs)/1e3*r.speed;t.viewport(0,0,i.width,i.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),c.presetDirty&&function(){if(!c)return;let{gl:e,uniforms:t,preset:a,glCanvas:r}=c;t.u_resolution&&e.uniform2f(t.u_resolution,r.width,r.height);for(let r=0;r<7;r++){let i=t[`u_color${r+1}`];if(i){let[t,o,n]=function(e){let t=e.replace("#","");return 3===t.length&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),[parseInt(t.slice(0,2),16)/255,parseInt(t.slice(2,4),16)/255,parseInt(t.slice(4,6),16)/255]}(a.colors[r]);e.uniform3f(i,t,o,n)}let o=t[`u_alpha${r+1}`];o&&e.uniform1f(o,a.alphas[r])}t.u_intensity&&e.uniform1f(t.u_intensity,a.intensity),t.u_scale&&e.uniform1f(t.u_scale,a.scale),t.u_direction&&e.uniform1f(t.u_direction,a.direction*Math.PI/180),t.u_softness&&e.uniform1f(t.u_softness,a.softness),t.u_distortion&&e.uniform1f(t.u_distortion,a.distortion),t.u_complexity&&e.uniform1f(t.u_complexity,a.complexity),t.u_shape&&e.uniform1f(t.u_shape,a.shape),t.u_vignette&&e.uniform1f(t.u_vignette,a.vignette),t.u_vigOpacity&&e.uniform1f(t.u_vigOpacity,a.vigOpacity),t.u_blur&&e.uniform1f(t.u_blur,a.blur),t.u_shaderOpacity&&e.uniform1f(t.u_shaderOpacity,a.shaderOpacity),c.presetDirty=!1}(),a.u_time&&t.uniform1f(a.u_time,o),t.drawArrays(t.TRIANGLES,0,6),c.frameCount++}(e),c.useOffscreen&&(c.glowQueue.length>0&&m(),null==(t=c.frameBitmap)||t.close(),c.frameBitmap=c.glCanvas.transferToImageBitmap()),c.instances))a.visible&&(a.paused&&a.everCopied||(function(e){var t;if(!c)return;let a=c.frameBitmap??c.glCanvas,r=e.dpr,i=e.canvas.width,o=e.canvas.height;if(i<1||o<1)return;let n=c.glCanvas.width,l=c.glCanvas.height,s=n/(140*r)*i/e.shaderScale,d=l/(40*r)*o/e.shaderScale;s>n&&(s=n),d>l&&(d=l);let h=Math.max(0,(n-s)/2),u=Math.max(0,(l-d)/2);if(e.ctx.clearRect(0,0,i,o),e.opacityMul<1&&(e.ctx.globalAlpha=e.opacityMul),e.ctx.drawImage(a,h,u,s,d,0,0,i,o),e.opacityMul<1&&(e.ctx.globalAlpha=1),function(e){let{ctx:t,dpr:a,canvas:r}=e,i=e.ringCssPx*a,o=r.width,n=r.height,l=Math.max(0,(e.cornerRadius-e.ringCssPx)*a);t.save(),t.globalCompositeOperation="destination-out",t.fillStyle="#000",t.beginPath(),t.roundRect(i,i,o-2*i,n-2*i,l),t.fill(),t.restore()}(e),e.onFirstCopy){let t=e.onFirstCopy;e.onFirstCopy=void 0,t()}null==(t=e.onAfterFrame)||t.call(e)}(a),a.everCopied=!0));if(_&&c.glowQueue.length>0&&++c.glowSkip%1==0){let t=c.glowQueue;c.glowIdx>=t.length&&(c.glowIdx=0);let a=t[c.glowIdx];a.visible&&!a.paused&&_(a,e),c.glowIdx++}}}function T(){c&&0===c.rafId&&(c.rafId=requestAnimationFrame(S))}function $(){c&&(0!==c.rafId&&cancelAnimationFrame(c.rafId),c.rafId=0)}let R={linear:e=>e,smoothstep:e=>e*e*(3-2*e)};function F(e,t,a,r=R.linear){return{from:e,to:t,dur:a,ease:r,startMs:-1,val:e,done:!1}}function O(e,t){e.startMs=t,e.val=e.from,e.done=!1}function A(e,t){if(e.done||e.startMs<0)return e.val;let a=Math.min(1,(t-e.startMs)/e.dur);return e.val=e.from+(e.to-e.from)*e.ease(a),a>=1&&(e.done=!0),e.val}let P=1/3*4,I=1/3*2,E=1/3*2,L=1/3*1.35,z=1/3*13;function W(e,t,a){let r=Math.max(0,Math.min(a,Math.min(e,t)/2));return 2*Math.max(0,e-2*r)+2*Math.max(0,t-2*r)+2*Math.PI*r}function B(e,t,a,r){return"circle"===r?2*Math.PI*Math.max(0,Math.min(a,Math.min(e,t)/2)):W(e,t,a)}function N(e,t,a,r,i,o,n,l){let s=l||{x:0,y:0},c=Math.max(0,Math.min(r,Math.min(t,a)/2));if("circle"===n){let r=2*Math.PI*c;if(r<=1e-4)return s.x=.5*t,s.y=.5*a,s;let n=-Math.PI/2+(e=(e%r+r)%r)/r*Math.PI*2,l=Math.max(0,c-i+o);return s.x=.5*t+l*Math.cos(n),s.y=.5*a+l*Math.sin(n),s}let d=Math.max(0,t-2*c),h=Math.max(0,a-2*c),u=Math.PI*c/2,f=2*(d+h)+4*u,p=Math.max(0,c-i+o),m=e=(e%f+f)%f;if(m<d)return s.x=c+m,s.y=i-o,s;if((m-=d)<u){let e=-Math.PI/2+Math.PI/2*(u>0?m/u:0);return s.x=t-c+p*Math.cos(e),s.y=c+p*Math.sin(e),s}if((m-=u)<h)return s.x=t-i+o,s.y=c+m,s;if((m-=h)<u){let e=Math.PI/2*(u>0?m/u:0);return s.x=t-c+p*Math.cos(e),s.y=a-c+p*Math.sin(e),s}if((m-=u)<d)return s.x=t-c-m,s.y=a-i+o,s;if((m-=d)<u){let e=Math.PI/2+Math.PI/2*(u>0?m/u:0);return s.x=c+p*Math.cos(e),s.y=a-c+p*Math.sin(e),s}if((m-=u)<h)return s.x=i-o,s.y=a-c-m,s;m-=h;let g=Math.PI+Math.PI/2*(u>0?m/u:0);return s.x=c+p*Math.cos(g),s.y=c+p*Math.sin(g),s}function H(e,t){let a=2*e/t,r="";for(let i=0;i<=t;i++){let t=-e+i*a;r+=(0===i?"M ":"L ")+t.toFixed(3)+" 0 "}return r}let G={x:0,y:0},D={x:0,y:0};function j(e,t,a){let r=Math.max(0,Math.min(1,(a-e)/(t-e)));return r*r*(3-2*r)}let U=1/3,q=0,Q={x:0,y:0};function X(e,t){let a=`mfxg_${++q}`,r=document.createElementNS("http://www.w3.org/2000/svg","svg");r.setAttribute("class","metal-fx-glow-svg"),r.setAttribute("preserveAspectRatio","none"),r.setAttribute("viewBox",`0 0 ${t.width} ${t.height}`),r.innerHTML=function(e,t){let{width:a,height:r,cornerRadius:i}=e,o=e.scale??1,n="circle"===e.kind?2:1,l=Math.max(0,i-n),s=(-200*o).toFixed(0),c=(540*o).toFixed(0),d=(440*o).toFixed(0),h=`x="${s}" y="${s}" width="${c}" height="${d}"`,u=`${h} filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"`,f=e=>(e*o).toFixed(3),p=e=>(e*o).toFixed(3);return`<defs><filter id="${t}_bXl" ${u}><feGaussianBlur stdDeviation="${p(8.4)}"/></filter><filter id="${t}_bLg" ${u}><feGaussianBlur stdDeviation="${p(4.8)}"/></filter><filter id="${t}_bMd" ${u}><feGaussianBlur stdDeviation="${p(2.1)}"/></filter><filter id="${t}_bSm" ${u}><feGaussianBlur stdDeviation="${p(.9)}"/></filter><filter id="${t}_ebO" ${u}><feGaussianBlur stdDeviation="${p(E)}"/></filter><filter id="${t}_ebC" ${u}><feGaussianBlur stdDeviation="${p(L)}"/></filter><radialGradient id="${t}_fg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="white"/><stop offset="0.30" stop-color="white"/><stop offset="0.65" stop-color="#404040"/><stop offset="1" stop-color="black"/></radialGradient><mask id="${t}_fm" maskUnits="userSpaceOnUse" ${h}><rect ${h} fill="black"/><circle id="${t}_fc" cx="0" cy="0" r="${(z*o).toFixed(3)}" fill="url(#${t}_fg)"/></mask><mask id="${t}_rm" maskUnits="userSpaceOnUse" ${h}><rect ${h} fill="#808080"/><rect x="0" y="0" width="${a}" height="${r}" rx="${i}" ry="${i}" fill="white"/><rect x="${n}" y="${n}" width="${a-2*n}" height="${r-2*n}" rx="${l}" ry="${l}" fill="black"/></mask></defs><g id="${t}_h" mask="url(#${t}_rm)" opacity="0"><rect ${h} fill="none" pointer-events="none"/><g id="${t}_hI" stroke="white"><path id="${t}_pXl" stroke-width="${f(26.4)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.385" filter="url(#${t}_bXl)"/><path id="${t}_pLg" stroke-width="${f(15.6)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.595" filter="url(#${t}_bLg)"/><path id="${t}_pMd" stroke-width="${f(7.2)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.70" filter="url(#${t}_bMd)"/><path id="${t}_pSm" stroke-width="${f(3)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.70" filter="url(#${t}_bSm)"/></g></g><g id="${t}_e" mask="url(#${t}_rm)" opacity="0"><rect ${h} fill="none" pointer-events="none"/><g mask="url(#${t}_fm)"><g id="${t}_eI" stroke="white"><path id="${t}_eO" stroke-width="${f(P)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.85" filter="url(#${t}_ebO)"/><path id="${t}_eC" stroke-width="${f(I)}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="1.0" filter="url(#${t}_ebC)"/></g></g></g>`}(t,a),e.appendChild(r);let i=e=>r.querySelector(`#${a}_${e}`),o=i("h"),n=i("hI"),l=i("e"),s=i("eI"),c=i("fc"),d=B(t.width,t.height,t.cornerRadius,t.kind)/W(140,40,20),h=H(Math.max(1,7.8*d),16),u=H(Math.max(.6,9.13952*U*d),8),f=[i("pXl"),i("pLg"),i("pMd"),i("pSm")],p=[i("eO"),i("eC")];for(let e of f)e.setAttribute("d",h);for(let e of p)e.setAttribute("d",u);return n.style.transformOrigin="0 0",s.style.transformOrigin="0 0",n.style.willChange="transform",s.style.willChange="transform",n.style.transition="transform 100ms linear",s.style.transition="transform 100ms linear",o.style.willChange="opacity",l.style.willChange="opacity",o.style.transition="opacity 100ms linear",l.style.transition="opacity 100ms linear",c.style.willChange="transform",{svg:r,haloGroup:o,haloInner:n,extraGroup:l,extraInner:s,fadeCircle:c,width:t.width,height:t.height,cornerRadius:t.cornerRadius,kind:t.kind,scale:t.scale??1,perim:function(e){let t=B(e.width,e.height,e.cornerRadius,e.kind),a=1.5*(e.scale??1),r=[];for(let i=0;i<16;i++){let o=i/16*t,n=N(o,e.width,e.height,e.cornerRadius,a,0,e.kind);r.push({x:n.x,y:n.y,arc:o})}return r}(t),currentIdx:0,appearedAt:0,glowOpacity:0,relocTween:null,relocNextIdx:-1,wanderS:0,wanderTargetS:0,wanderFrames:0,tintFrom:{r:255,g:255,b:255},tintTarget:{r:255,g:255,b:255},tintTween:null,tintHoldUntil:0,lastHaloStroke:"",lastExtraStroke:""}}let V=new Set(["INPUT","TEXTAREA","SELECT","OPTION"]);function Z(e,t,a,r,i,o){let n=Math.max(0,Math.min(o,.5*r,.5*i)),l=e.roundRect;if("function"==typeof l){l.call(e,t,a,r,i,n);return}e.moveTo(t+n,a),e.lineTo(t+r-n,a),e.quadraticCurveTo(t+r,a,t+r,a+n),e.lineTo(t+r,a+i-n),e.quadraticCurveTo(t+r,a+i,t+r-n,a+i),e.lineTo(t+n,a+i),e.quadraticCurveTo(t,a+i,t,a+i-n),e.lineTo(t,a+n),e.quadraticCurveTo(t,a,t+n,a)}function Y(e,t,a,r,i){if(!i.flipX&&!i.flipY){e.drawImage(t,0,0,a,r,i.x,i.y,i.w,i.h);return}e.save(),i.flipX&&(e.translate(i.x+i.w,0),e.scale(-1,1)),i.flipY&&(e.translate(0,i.y+i.h),e.scale(1,-1)),e.drawImage(t,0,0,a,r,i.flipX?0:i.x,i.flipY?0:i.y,i.w,i.h),e.restore()}function K(e,t,a,r,i,o,n){let l=0|n;if(l<1||r<=2*l||i<=2*l){e.beginPath(),Z(e,t,a,r,i,o),e.clip();return}e.beginPath(),Z(e,t,a,r,i,o),Z(e,t+l,a+l,r-2*l,i-2*l,Math.max(0,o-l)),e.clip("evenodd")}function J(e){let t=getComputedStyle(e),a=[parseFloat(t.borderTopLeftRadius)||0,parseFloat(t.borderTopRightRadius)||0,parseFloat(t.borderBottomRightRadius)||0,parseFloat(t.borderBottomLeftRadius)||0].filter(e=>e>0);return a.length?Math.min.apply(null,a):0}function ee(e){let t=getComputedStyle(e),a=Math.max(parseFloat(t.borderTopWidth)||0,parseFloat(t.borderRightWidth)||0,parseFloat(t.borderBottomWidth)||0,parseFloat(t.borderLeftWidth)||0),r=0,i=0,o=t.boxShadow;if(o&&"none"!==o){let e=o.replace(/rgba?\([^)]*\)/g,e=>e.replace(/,/g,"\0")).split(/,\s*/),t=1/0,a=1/0;for(let r of e){let e=r.match(/-?\d+(?:\.\d+)?px/g);if(!e||e.length<4)continue;let i=parseFloat(e[3]);i>0&&(/\binset\b/.test(r)?i<t&&(t=i):i<a&&(a=i))}Number.isFinite(t)&&(r=t),Number.isFinite(a)&&(i=a)}let n=Math.max(a,i);return{width:Math.max(a,r,i)||1,outerCssPx:n}}function et(e){e.cornerRadius=J(e.el);let t=ee(e.el);e.hairlineWidth=t.width,e.hairlineOuterCssPx=t.outerCssPx}let ea=new Set,er=!1,ei=0;function eo(){er||(er=!0,typeof requestAnimationFrame>"u"||requestAnimationFrame(e=>{er=!1,e-ei<66||(ei=e,function(){if(0===ea.size)return;let e="u">typeof window&&window.devicePixelRatio||1,t=new Map;for(let i of ea){var a,r;let o,n,l,s;let c=i.el.getBoundingClientRect(),d=t.get(i.anchorEl);if(d||(d=i.anchorEl.getBoundingClientRect(),t.set(i.anchorEl,d)),c.width<1||c.height<1||d.width<1||d.height<1)continue;if((Math.min((a=d).bottom,c.bottom)-Math.max(a.top,c.top)<1||Math.max(a.left-c.right,c.left-a.right,0)>32)&&!(!(Math.min((r=d).right,c.right)-Math.max(r.left,c.left)<1)&&32>=Math.max(r.top-c.bottom,c.top-r.bottom,0))){1!==i.canvas.width&&(i.canvas.width=1,i.canvas.height=1),1!==i.strokeCanvas.width&&(i.strokeCanvas.width=1,i.strokeCanvas.height=1);continue}let h=i.anchor.canvas,u=0|h.width,f=0|h.height;if(u<4||f<4)continue;let p=(d.left+d.right)*.5,m=(d.top+d.bottom)*.5,g=(c.left+c.right)*.5,x=(c.top+c.bottom)*.5,v=p-g,w=m-x,y=Math.max(d.left-c.right,c.left-d.right,0)>=Math.max(d.top-c.bottom,c.top-d.bottom,0),b=1-Math.min(1,function(e,t){let a=Math.max(e.left-t.right,t.left-e.right,0),r=Math.max(e.top-t.bottom,t.top-e.bottom,0);return Math.sqrt(a*a+r*r)}(d,c)/12),M=Math.min(3.6,(.55+.44999999999999996*(b=b*b*(3-2*b)))*1.3*.7),_=i.anchor.scale??1,k=Math.max(1,Math.round(Math.max(1*_,i.hairlineWidth)*e)),C=Math.max(1,Math.round(Math.max(1*_,i.hairlineWidth)*e)),S=i.hairlineOuterCssPx;i.wrap.style.inset=`${-S}px`,i.wrap.style.borderRadius=`${Math.max(0,i.cornerRadius)}px`;let T=Math.max(1,Math.round((c.width+2*S)*e)),$=Math.max(1,Math.round((c.height+2*S)*e));i.canvas.width!==T&&(i.canvas.width=T),i.canvas.height!==$&&(i.canvas.height=$),i.strokeCanvas.width!==T&&(i.strokeCanvas.width=T),i.strokeCanvas.height!==$&&(i.strokeCanvas.height=$);let R=i.ctx;R.setTransform(1,0,0,1,0,0),R.clearRect(0,0,T,$);let F=i.strokeCtx;F.setTransform(1,0,0,1,0,0),F.clearRect(0,0,T,$);let O=Math.min(12*e,Math.max(T,$));y?(o=v>0?T:0,l=v>0?T-O:O,n=.5*$,s=.5*$):(n=w>0?$:0,s=w>0?$-O:O,o=.5*T,l=.5*T);let A=R.createLinearGradient(o,n,l,s);A.addColorStop(0,"rgba(0,0,0,1)"),A.addColorStop(.5,"rgba(0,0,0,0.85)"),A.addColorStop(1,"rgba(0,0,0,0)");let P=Math.max(1,Math.round(235*Math.max(.1,u/e/140)*e)),I,E,L,z,W=!1,B=!1;if(y){let t=Math.max(d.top,c.top),a=Math.min(d.bottom,c.bottom);W=!0,I=v>0?T-P:0,E=Math.round((t-c.top+S)*e),L=P,z=Math.max(1,Math.round((a-t)*e))}else{let t=Math.max(d.left,c.left),a=Math.min(d.right,c.right);B=!0,I=Math.round((t-c.left+S)*e),E=w>0?$-P:0,L=Math.max(1,Math.round((a-t)*e)),z=P}let N={x:I,y:E,w:L,h:z,flipX:W,flipY:B},H={x:0,y:0,w:T,h:$,r:Math.max(0,i.cornerRadius*e)};(function(e,t,a,r,i,o,n,l,s,c,d){let h=Math.max(1,Math.round(24*d)),u=Math.max(0,n),f=!0;for(let n=0;n<3&&u>1e-4;n++){let n=Math.min(1,u);e.save(),function(e,t,a,r,i,o,n){if(r<=2*n||i<=2*n){e.beginPath(),Z(e,t,a,r,i,o),e.clip();return}e.beginPath(),Z(e,t,a,r,i,o),Z(e,t+n,a+n,r-2*n,i-2*n,Math.max(0,o-n)),e.clip("evenodd")}(e,c.x,c.y,c.w,c.h,c.r,h),e.globalCompositeOperation=f?"source-over":"lighter",f=!1,e.globalAlpha=n,Y(e,t,a,r,s),e.globalAlpha=1,e.globalCompositeOperation="destination-in",e.fillStyle=l,e.fillRect(0,0,i,o),e.restore(),u-=n}})(R,h,u,f,T,$,Math.min(3.6,.88725*M),A,N,H,e),function(e,t,a,r,i,o,n,l,s,c,d,h){let u=.52*l,f=!0;for(let l=0;l<3&&u>1e-4;l++){let l=Math.min(1,u);e.save(),K(e,n.x,n.y,n.w,n.h,n.r,s),e.globalCompositeOperation=f?"source-over":"lighter",f=!1,e.globalAlpha=l,Y(e,t,a,r,h),e.globalAlpha=1,e.globalCompositeOperation="destination-in",e.fillStyle=c,e.fillRect(0,0,i,o),e.restore(),u-=l}}(F,h,u,f,T,$,H,M,k,A,0,N),function(e,t,a,r,i,o,n,l){let s=e.createLinearGradient(r,i,o,n);s.addColorStop(0,`rgba(255,255,255,${l.toFixed(3)})`),s.addColorStop(.5,`rgba(255,255,255,${(.45*l).toFixed(3)})`),s.addColorStop(1,"rgba(255,255,255,0)"),e.save(),K(e,t.x,t.y,t.w,t.h,t.r,a),e.globalCompositeOperation="lighter",e.lineWidth=2*a,e.strokeStyle=s,e.beginPath(),Z(e,t.x,t.y,t.w,t.h,t.r),e.stroke(),e.restore()}(F,H,C,o,n,l,s,Math.min(.85,.044*M)),R.globalCompositeOperation="source-over",F.globalCompositeOperation="source-over"}}())}))}let en="metal-fx-styles",el=`
.metal-fx-root {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  overflow: visible;
  background: #272727;
  color: #f8f8f8;
}
.metal-fx-root[data-theme='light'] {
  background: #ffffff;
  color: #1d1d1d;
}

.metal-fx-root::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 2;
  box-shadow: inset 0 0 50px 0 rgba(255, 255, 255, 0.02);
}
.metal-fx-root[data-theme='light']::before {
  box-shadow: inset 0 0 50px 0 rgba(0, 0, 0, 0.02);
}

.metal-fx-root::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 4;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
.metal-fx-root[data-theme='light']::after {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
/* Circle variant gets a thicker outer rim than the button variant. */
.metal-fx-root[data-variant='circle']::after {
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.1);
}
.metal-fx-root[data-theme='light'][data-variant='circle']::after {
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.06);
}

.metal-fx-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
}

/* The inner spacer — defines the inset geometry where the metal ring meets
   the interior (3 px for Button, 1-2 px for Circle) and carries the Circle dark
   hairline ('box-shadow: inset' rules below). Intentionally transparent so
   the wrapper's background propagates through to the punched shader centre,
   giving consumers a single surface tone to override. See "Single-surface
   background" in the file header for the rationale. */
.metal-fx-inner {
  position: absolute;
  inset: 3px;
  border-radius: inherit;
  z-index: 1;
  pointer-events: none;
}

.metal-fx-root[data-variant='button'][data-shape='pill'] .metal-fx-inner {
  border-radius: calc(var(--mfx-radius, 20px) - 3px);
}
.metal-fx-root[data-variant='button'][data-shape='circle'] .metal-fx-inner {
  border-radius: calc(var(--mfx-radius, 16px) - 3px);
}
.metal-fx-root[data-variant='circle'][data-shape='pill'] .metal-fx-inner {
  inset: 0;
  border-radius: var(--mfx-radius, 20px);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
}
.metal-fx-root[data-variant='circle'][data-shape='circle'] .metal-fx-inner {
  inset: 0;
  border-radius: var(--mfx-radius, 16px);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
}
/* Circle-variant hairline alpha — light mode.
   Source-of-truth: index.html L2261-2267. The 0.45-alpha black inset that
   reads as a single-pixel frame against the dark interior is too heavy
   on a #ffffff inner: it ends up looking like a hard 2-px black ring
   against the iridescent shader. Suppressed entirely (alpha 0) — the
   shader's own iridescent rim already defines the silhouette in light
   mode, so an extra dark hairline only competes with it. The rule is
   kept (rather than deleted) as a tunable hook in case a future variant
   wants to re-introduce a soft edge. NOTE: we keep the dark-mode inset
   and border-radius values because — unlike index.html — our renderer
   does NOT overscan the canvas in light mode, so there is no 1-px gap
   between inner element and shader to compensate for. */
.metal-fx-root[data-theme='light'][data-variant='circle'][data-shape='pill'] .metal-fx-inner,
.metal-fx-root[data-theme='light'][data-variant='circle'][data-shape='circle'] .metal-fx-inner {
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0);
}

/* ─── Combined glow SVG (z=3) ──────────────────────────────────────────────
   Single SVG per instance that holds BOTH the wide-halo group
   (#mfx_haloTravel) and the catch-light group (#mfx_extraTravel), exactly
   mirroring canonical's _buildGlowSvgInner (index.html L8078). One
   mix-blend-mode: screen lifts the combined composite onto the shader
   ring; per-frame opacity attributes on each inner group still drive the
   independent fade-in / fade-out cycles for the halo and the catch-light.

   Why a single SVG: the circle variant anchors halo + catch-light at the same
   perimeter point, so they overlap in the bright zone. Two separately-
   screened SVGs would double-screen the overlap (A + B + C - AB - AC -
   BC + ABC instead of A + B + C - AB - AC once both groups composite
   in source-over inside one SVG and then screen against the host once).
   That overlap looked muted versus canonical specifically on the circle
   variant where both layers travel together.

   Source-of-truth opacity: #btnGlowSvg drops to 0.7 in dark and 0.2746 in
   light (index.html L632/L643). */
.metal-fx-glow-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 3;
  pointer-events: none;
  opacity: 0.7;
}
.metal-fx-root[data-theme='light'] .metal-fx-glow-svg {
  /* Light-mode 1-px overscan mirrors .btn-glow-svg in metal.html so the
     halo stays glued to the visible silhouette (the shader ring there sits
     1 px outside the host's padding box). */
  inset: -1px;
  width: calc(100% + 2px);
  height: calc(100% + 2px);
  mix-blend-mode: multiply;
  /* Source-of-truth: html[data-theme="light"] #btnGlowSvg { opacity: 0.2746 }
     → −35 % from 0.4225 from the original 0.7 dark-mode opacity. */
  opacity: 0.2746;
  filter: saturate(5.355) brightness(0.78);
}
/* Circle light-mode small variants (e.g. 36\xd736 send button): the geometrically
   shrunk halo loses density when multiplied against #ffffff. Mirror the
   canonical override at index.html L2316 — bump saturation + drop brightness
   so the small glow holds together visually. */
.metal-fx-root[data-variant='circle'][data-shape='circle'][data-theme='light'] .metal-fx-glow-svg {
  filter: saturate(7.5) brightness(0.6);
}

/* The wrapped child — hoisted into z=5 so it sits above every overlay, with
   normalized chrome so consumer button styles don't fight the metal frame. */
.metal-fx-content {
  position: relative;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: none;
}
.metal-fx-content > * {
  pointer-events: auto;
}
.metal-fx-root[data-normalize='true'] .metal-fx-content > * {
  background: transparent !important;
  border: 0 !important;
  outline: 0 !important;
  box-shadow: none !important;
  /* Sizing: we deliberately DO NOT force \`width: 100%; height: 100%\` on the
     child here. That used to be the contract ("the wrapper is the visible
     button surface; the child stretches to fill it"), but it created a cyclic
     percentage dependency: the wrapper is \`inline-flex\` with no intrinsic
     size, .metal-fx-content is \`width/height: 100%\` of the wrapper, and the
     child was \`100%\` of .metal-fx-content. With nothing breaking the cycle,
     icon-only / class-sized children collapsed.

     The new contract: the child sizes itself (intrinsic content, CSS class,
     or inline style — all work), and the wrapper's \`inline-flex\` wraps it
     tightly. Consumers who want a metal frame BIGGER than the child (e.g.
     padding around an icon) size <MetalFx style={{ width, height }}> AND
     explicitly set width/height on the child to fill (or accept that the
     child renders at its intrinsic size, centered).

     Typography is intentionally NOT touched. We used to apply
     \`color: inherit; font: inherit;\` here to "match" the wrapper, but
     \`font: inherit\` is a shorthand that overrides font-family, font-size,
     font-weight, AND line-height on the child — which (a) shrank the
     button height (line-height changes propagate through the flex
     content box) and (b) scaled em-based icons / font-icons inside the
     child to whatever the wrapper inherited. The wrapper now stays out
     of the child's typography entirely; consumers who want typographic
     normalization can apply it themselves on the child element. */
}

[data-metal-fx-reflection] {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  overflow: hidden;
  z-index: 0;
  isolation: isolate;
}
.metal-fx-reflection-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  filter: blur(4px) saturate(1.2) brightness(1.58);
}
.metal-fx-reflection-stroke-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  filter: saturate(1.35) brightness(1.75);
}
/* Hosts that participate as reflection targets need positioning + isolation
   so the wrap composites only against the host (not the parent stack). The
   wrap injects these inline as well, but stating them here keeps reflections
   working on hosts that already have other inline styles applied. */
[data-metal-fx-reflect-host] {
  isolation: isolate;
}
`,es=!1;!function(){if(es||typeof document>"u")return;if(document.getElementById(en)){es=!0;return}let e=document.createElement("style");e.id=en,e.textContent=el,document.head.appendChild(e),es=!0}();let ec={position:"absolute",inset:0,width:"100%",height:"100%"},ed={position:"absolute",inset:3},eh={position:"absolute",inset:0,pointerEvents:"none",zIndex:3,borderRadius:"inherit"},eu=new Map;_=(e,t)=>{let a=eu.get(e);a&&function(e,t,a,r,i="dark"){var o,n;let l,s,d;let{width:h,height:u,cornerRadius:f,perim:p}=e;if(0===p.length)return;let g=-1,v=e.currentIdx,M=0;for(let a=0;a<p.length;a++){let r=p[a],i=b(t,r.x,r.y,2);i>g&&(g=i,v=a),a===e.currentIdx&&(M=i)}let _=e.appearedAt>0&&a-e.appearedAt<3e3,k=.34+.51*j(.08,.32,M),C=!_&&g-M>.05;if(!e.relocTween||e.relocTween.done){if(0===e.appearedAt)e.currentIdx=v,e.appearedAt=a,e.wanderS=0,e.wanderTargetS=0,e.wanderFrames=0,e.relocTween=F(0,k,1500,R.smoothstep),O(e.relocTween,a);else if(null!=(o=e.relocTween)&&o.done&&0===e.relocTween.to){e.currentIdx=e.relocNextIdx,e.appearedAt=a,e.wanderS=0,e.wanderTargetS=0,e.wanderFrames=0;let r=p[e.currentIdx],i=.34+.51*j(.08,.32,b(t,r.x,r.y,2));e.relocTween=F(0,i,1500,R.smoothstep),O(e.relocTween,a)}else C?(e.relocNextIdx=v,e.relocTween=F(e.glowOpacity,0,1500,R.smoothstep),O(e.relocTween,a)):e.glowOpacity+=(k-e.glowOpacity)*.00875}e.relocTween&&(e.glowOpacity=A(e.relocTween,a)),e.glowOpacity=Math.max(0,Math.min(1,e.glowOpacity));let S=B(h,u,f,e.kind)/W(140,40,20);e.wanderFrames++>=120&&(e.wanderTargetS=15*S*(2*Math.random()-1),e.wanderFrames=0),e.wanderS+=(e.wanderTargetS-e.wanderS)*.0075;let T=p[e.currentIdx].arc+e.wanderS,$=1.5*e.scale;N(T,h,u,f,$,0,e.kind,Q);let P=Q.x,I=Q.y,E=(N(T-.1,h,u,f,$,0,n=e.kind,G),N(T+.1,h,u,f,$,0,n,D),Math.atan2(D.y-G.y,D.x-G.x)),L=`translate(${P.toFixed(3)}px,${I.toFixed(3)}px) rotate(${E.toFixed(4)}rad)`;e.haloInner.style.transform=L,N(T,h,u,f,$,1*S*e.scale,e.kind,Q),e.extraInner.style.transform=`translate(${Q.x.toFixed(3)}px,${Q.y.toFixed(3)}px) rotate(${E.toFixed(4)}rad)`,e.fadeCircle.style.transform=`translate(${Q.x.toFixed(3)}px,${Q.y.toFixed(3)}px)`;let z="light"===i,H=z?function(e,t,a,r){if(!c)return y.r=255,y.g=255,y.b=255,y;m();let i=x(e,t,a),{glowPixels:o,glowPixelsW:n,glowPixelsH:l}=c,s=Math.max(0,i.bx-2),d=Math.min(n,i.bx+2+1),h=Math.max(0,i.by-2),u=Math.min(l,i.by+2+1),f=-1;y.r=255,y.g=255,y.b=255;for(let e=h;e<u;e++){let t=e*n;for(let e=s;e<d;e++){let a=(t+e)*4,r=o[a],i=o[a+1],n=o[a+2],l=Math.max(r,i,n),s=Math.min(r,i,n),c=(l>0?(l-s)/l:0)*(.35+l/255*.65);c>f&&(f=c,y.r=r,y.g=i,y.b=n)}}return y}(t,P,I,0):function(e,t,a,r){if(!c)return y.r=255,y.g=255,y.b=255,y;m();let i=x(e,t,a),o=w(c.glowPixels,c.glowPixelsW,c.glowPixelsH,i.bx,i.by,2);return 0===o.count?(y.r=255,y.g=255,y.b=255):(y.r=o.r/o.count,y.g=o.g/o.count,y.b=o.b/o.count),y}(t,P,I,0);e.tintTween?e.tintTween.done&&(z?(e.tintFrom={r:e.tintFrom.r+(e.tintTarget.r-e.tintFrom.r)*e.tintTween.val,g:e.tintFrom.g+(e.tintTarget.g-e.tintFrom.g)*e.tintTween.val,b:e.tintFrom.b+(e.tintTarget.b-e.tintFrom.b)*e.tintTween.val},e.tintTarget={...H},e.tintTween=F(0,1,400),O(e.tintTween,a)):a>=e.tintHoldUntil&&(e.tintFrom={...e.tintTarget},e.tintTarget={...H},e.tintTween=F(0,1,400),O(e.tintTween,a),e.tintHoldUntil=a+2e3)):(e.tintFrom={...H},e.tintTarget={...H},e.tintTween=F(0,1,400),O(e.tintTween,a),e.tintHoldUntil=z?0:a+2e3),A(e.tintTween,a);let U=e.tintTween.val;if(z)l=Math.round(e.tintFrom.r+(e.tintTarget.r-e.tintFrom.r)*U),s=Math.round(e.tintFrom.g+(e.tintTarget.g-e.tintFrom.g)*U),d=Math.round(e.tintFrom.b+(e.tintTarget.b-e.tintFrom.b)*U);else{let t=e.tintFrom.r+(e.tintTarget.r-e.tintFrom.r)*U,a=e.tintFrom.g+(e.tintTarget.g-e.tintFrom.g)*U,r=e.tintFrom.b+(e.tintTarget.b-e.tintFrom.b)*U,i=Math.max(t,a,r)||1;l=Math.round(t/i*255),s=Math.round(a/i*255),d=Math.round(r/i*255)}let q=`rgb(${l},${s},${d})`;if(q!==e.lastHaloStroke&&(e.lastHaloStroke=q,e.haloInner.style.stroke=q),z){let t=function(e,t,a){let r=Math.max(e/=255,t/=255,a/=255),i=r-Math.min(e,t,a),o=0;return 0!==i&&(o=(r===e?((t-a)/i+6)%6:r===t?(a-e)/i+2:(e-t)/i+4)/6),[o,0===r?0:i/r,r]}(l,s,d),[a,r,i]=function(e,t,a){let r=Math.floor(6*e),i=6*e-r,o=a*(1-t),n=a*(1-i*t),l=a*(1-(1-i)*t),s=0,c=0,d=0;switch(r%6){case 0:s=a,c=l,d=o;break;case 1:s=n,c=a,d=o;break;case 2:s=o,c=a,d=l;break;case 3:s=o,c=n,d=a;break;case 4:s=l,c=o,d=a;break;case 5:s=a,c=o,d=n}return[Math.round(255*s),Math.round(255*c),Math.round(255*d)]}(t[0],Math.min(1,2.625*t[1]),Math.max(.31,1.008*t[2])),o=`rgb(${a},${r},${i})`;o!==e.lastExtraStroke&&(e.lastExtraStroke=o,e.extraInner.style.stroke=o)}else"#ffffff"!==e.lastExtraStroke&&(e.lastExtraStroke="#ffffff",e.extraInner.style.stroke="#ffffff");let X=Math.max(0,Math.min(1,r));e.haloGroup.style.opacity=(.8*e.glowOpacity*X).toFixed(3),e.extraGroup.style.opacity=Math.min(1,3.51*e.glowOpacity*X).toFixed(3)}(a.handles,e,t,e.opacityMul,a.themeRef.current)};let ef=(0,i.forwardRef)(function({children:e,variant:t="button",preset:a="chromatic",theme:n="auto",strength:l=1,paused:s=!1,borderRadius:d,normalizeHostStyles:h=!0,reflectionTargets:u,disableGlow:p=!1,shaderScale:m,ringCssPx:g,scale:x=1,className:v,style:w,...y},b){let _=(0,i.useRef)(null),C=(0,i.useRef)(null),S=(0,i.useRef)(null),R=(0,i.useRef)(null),F=(0,i.useRef)(null),O=(0,i.useRef)(null),A=(0,i.useRef)("dark"),P=(0,i.useRef)(0),[I,E]=(0,i.useState)(!1),L=function(e){let[t,a]=(0,i.useState)(()=>"auto"!==e?e:typeof window>"u"||!window.matchMedia||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");return(0,i.useEffect)(()=>{if("auto"!==e){a(e);return}if(typeof window>"u"||!window.matchMedia)return;let t=window.matchMedia("(prefers-color-scheme: dark)"),r=()=>a(t.matches?"dark":"light");return r(),t.addEventListener("change",r),()=>t.removeEventListener("change",r)},[e]),t}(n);A.current=L;let z="circle"===t?"circle":"pill";(0,i.useImperativeHandle)(b,()=>_.current,[]);let W=(e,t)=>"circle"===z?Math.min(e,t)/2:Math.min("number"==typeof d?d:(()=>{var e;let t=null==(e=R.current)?void 0:e.firstElementChild;if(t){let e=parseFloat(getComputedStyle(t).borderTopLeftRadius);if(Number.isFinite(e)&&e>0)return e}return P.current})(),Math.min(e,t)/2);(0,i.useEffect)(()=>{(function(e,t){let a=f();a.preset=o[e].modes[t],a.presetDirty=!0})(a,L)},[a,L]),(0,i.useEffect)(()=>{let e=F.current;e&&M(e,{paused:s})},[s]),(0,i.useEffect)(()=>{let e=F.current;if(!e)return;let t={};void 0!==m&&(t.shaderScale=m),void 0!==g&&(t.ringCssPx=g),void 0!==x&&(t.scale=x),Object.keys(t).length>0&&M(e,t)},[m,g,x]),(0,i.useLayoutEffect)(()=>{var e;let t=C.current,a=_.current,r=S.current;if(!t||!a)return;{let e=parseFloat(getComputedStyle(a).borderTopLeftRadius);P.current=Number.isFinite(e)?e:0}let i=()=>{let e=a.getBoundingClientRect(),t=Math.max(1,Math.round(e.width)),r=Math.max(1,Math.round(e.height));return{cssWidth:t,cssHeight:r,cornerRadius:W(t,r)}},o=i();F.current=function(e){let t=f(),a=e.hostCanvas.getContext("2d",{alpha:!0});if(!a)throw Error("metal-fx: canvas 2D context unavailable");let r=e.scale??1,i={canvas:e.hostCanvas,ctx:a,cssWidth:e.cssWidth,cssHeight:e.cssHeight,cornerRadius:e.cornerRadius,kind:e.kind,ringCssPx:e.ringCssPx??("circle"===e.kind?2:1)*r,shaderScale:e.shaderScale??("circle"===e.kind?1.3:1.6)*r,opacityMul:e.opacityMul??1,visible:!0,paused:e.paused??!1,everCopied:!1,dpr:"u">typeof window&&window.devicePixelRatio||1,scale:r,onAfterFrame:e.onAfterFrame,onFirstCopy:e.onFirstCopy};return k(i),t.instances.add(i),0===t.rafId&&null===t.pausedAtMs&&T(),i}({hostCanvas:t,cssWidth:o.cssWidth,cssHeight:o.cssHeight,cornerRadius:o.cornerRadius,kind:z,paused:s,shaderScale:m,ringCssPx:g,scale:x,onFirstCopy:()=>E(!0)}),a.style.setProperty("--mfx-radius",`${o.cornerRadius}px`),a.style.borderRadius=`${o.cornerRadius}px`,r&&(O.current=X(r,{width:o.cssWidth,height:o.cssHeight,cornerRadius:o.cornerRadius,kind:z,scale:x}));let n=0,l=new ResizeObserver(()=>{0===n&&(n=requestAnimationFrame(()=>{n=0;let e=i(),t=F.current;t&&(M(t,{cssWidth:e.cssWidth,cssHeight:e.cssHeight,cornerRadius:e.cornerRadius}),a.style.setProperty("--mfx-radius",`${e.cornerRadius}px`),a.style.borderRadius=`${e.cornerRadius}px`,r&&(r.innerHTML="",O.current=X(r,{width:e.cssWidth,height:e.cssHeight,cornerRadius:e.cornerRadius,kind:z,scale:x}),t&&O.current&&eu.set(t,{handles:O.current,themeRef:A})))}))});l.observe(a);let d=null;return"u">typeof IntersectionObserver&&(d=new IntersectionObserver(e=>{let t=F.current;if(t)for(let r of e){var a;a=r.isIntersecting,t.visible=a,a&&c&&0===c.rafId&&null===c.pausedAtMs&&!c.contextLost&&T()}},{rootMargin:"64px"})).observe(a),F.current&&O.current&&(eu.set(F.current,{handles:O.current,themeRef:A}),e=F.current,c&&(c.glowQueue.includes(e)||c.glowQueue.push(e))),()=>{l.disconnect(),null==d||d.disconnect(),0!==n&&cancelAnimationFrame(n);let e=F.current;e&&(eu.delete(e),function(e){if(!c)return;let t=c.glowQueue.indexOf(e);-1!==t&&c.glowQueue.splice(t,1)}(e),function(e){if(!c)return;c.instances.delete(e);let t=c.glowQueue.indexOf(e);-1!==t&&c.glowQueue.splice(t,1),0===c.instances.size&&($(),function(){var e;if(!c)return;let{gl:t,program:a,buffer:r,frameBitmap:i}=c;try{null==i||i.close(),t.deleteBuffer(r),t.deleteProgram(a),null==(e=t.getExtension("WEBGL_lose_context"))||e.loseContext()}catch{}c=null}())}(e)),F.current=null,O.current=null,r&&(r.innerHTML="")}},[z]),(0,i.useEffect)(()=>{let e=F.current;e&&M(e,{opacityMul:Math.max(0,Math.min(1,l))})},[l,t]),(0,i.useEffect)(()=>{let e=F.current,t=_.current;if(!e||!t||!u||"dark"!==L)return;e.onAfterFrame=eo;let a=u.flatMap(e=>e.current?[e.current]:[]);for(let r of a)(function(e,t,a){if(typeof document>"u"||V.has(e.tagName))return;for(let t of ea)if(t.el===e)return t;let r=document.createElement("div");r.setAttribute("data-metal-fx-reflection",""),r.setAttribute("aria-hidden","true");let i=document.createElement("canvas");i.className="metal-fx-reflection-canvas";let o=i.getContext("2d",{alpha:!0});if(!o)return;let n=document.createElement("canvas");n.className="metal-fx-reflection-stroke-canvas";let l=n.getContext("2d",{alpha:!0});if(!l)return;r.appendChild(i),r.appendChild(n);let s=getComputedStyle(e),c=!1;"static"===s.position&&(e.style.position="relative",c=!0);let d=!1;"isolate"!==s.isolation&&(e.style.isolation="isolate",d=!0),e.setAttribute("data-metal-fx-reflect-host",""),e.insertBefore(r,e.firstChild);let h=ee(e),u={el:e,anchor:t,anchorEl:a,wrap:r,canvas:i,ctx:o,strokeCanvas:n,strokeCtx:l,cornerRadius:J(e),hairlineWidth:h.width,hairlineOuterCssPx:h.outerCssPx,appliedPositionRelative:c,appliedIsolation:d,resizeObserver:null,mutationObserver:null};"u">typeof ResizeObserver&&(u.resizeObserver=new ResizeObserver(()=>et(u)),u.resizeObserver.observe(u.el)),"u">typeof MutationObserver&&(u.mutationObserver=new MutationObserver(()=>et(u)),u.mutationObserver.observe(u.el,{attributes:!0,attributeFilter:["style","class"]})),ea.add(u)})(r,e,t);return()=>{for(let t of(e.onAfterFrame=void 0,a))(function(e){for(let t of ea)if(t.el===e){(function(e){var t,a;null==(t=e.resizeObserver)||t.disconnect(),e.resizeObserver=null,null==(a=e.mutationObserver)||a.disconnect(),e.mutationObserver=null})(t),t.canvas.width=0,t.canvas.height=0,t.strokeCanvas.width=0,t.strokeCanvas.height=0,t.wrap.parentNode===t.el&&t.el.removeChild(t.wrap),t.el.removeAttribute("data-metal-fx-reflect-host"),t.appliedPositionRelative&&(t.el.style.position=""),t.appliedIsolation&&(t.el.style.isolation=""),ea.delete(t);return}})(t)}},[u,L]),(0,i.useEffect)(()=>{let e=_.current,t=F.current;if(!e||!t)return;let a=W(t.cssWidth,t.cssHeight);M(t,{cornerRadius:a}),e.style.setProperty("--mfx-radius",`${a}px`),e.style.borderRadius=`${a}px`},[d,L,t,z]);let B=(0,i.useMemo)(()=>({...w,"--mfx-strength":String(Math.min(1,Math.max(0,l))),opacity:I?1:0,visibility:I?"visible":"hidden",transition:I?"opacity 0.15s ease-out":"none"}),[w,l,I]);return(0,r.jsxs)("div",{...y,ref:_,className:v?`metal-fx-root ${v}`:"metal-fx-root","data-variant":t,"data-shape":z,"data-theme":L,"data-paused":s?"true":void 0,"data-normalize":h?"true":"false",style:B,children:[(0,r.jsx)("canvas",{ref:C,className:"metal-fx-canvas",style:ec}),(0,r.jsx)("div",{className:"metal-fx-inner","aria-hidden":"true",style:ed}),(0,r.jsx)("div",{ref:S,"aria-hidden":"true",style:{...eh,display:p?"none":void 0}}),(0,r.jsx)("div",{ref:R,className:"metal-fx-content",children:e})]})});ef.displayName="MetalFx"},5922:function(e,t,a){a.d(t,{F:function(){return c},f:function(){return d}});var r=a(2265),i=["light","dark"],o="(prefers-color-scheme: dark)",n="undefined"==typeof window,l=r.createContext(void 0),s={setTheme:e=>{},themes:[]},c=()=>{var e;return null!=(e=r.useContext(l))?e:s},d=e=>r.useContext(l)?e.children:r.createElement(u,{...e}),h=["light","dark"],u=e=>{let{forcedTheme:t,disableTransitionOnChange:a=!1,enableSystem:n=!0,enableColorScheme:s=!0,storageKey:c="theme",themes:d=h,defaultTheme:u=n?"system":"light",attribute:x="data-theme",value:v,children:w,nonce:y}=e,[b,M]=r.useState(()=>p(c,u)),[_,k]=r.useState(()=>p(c)),C=v?Object.values(v):d,S=r.useCallback(e=>{let t=e;if(!t)return;"system"===e&&n&&(t=g());let r=v?v[t]:t,o=a?m():null,l=document.documentElement;if("class"===x?(l.classList.remove(...C),r&&l.classList.add(r)):r?l.setAttribute(x,r):l.removeAttribute(x),s){let e=i.includes(u)?u:null,a=i.includes(t)?t:e;l.style.colorScheme=a}null==o||o()},[]),T=r.useCallback(e=>{let t="function"==typeof e?e(e):e;M(t);try{localStorage.setItem(c,t)}catch(e){}},[t]),$=r.useCallback(e=>{k(g(e)),"system"===b&&n&&!t&&S("system")},[b,t]);r.useEffect(()=>{let e=window.matchMedia(o);return e.addListener($),$(e),()=>e.removeListener($)},[$]),r.useEffect(()=>{let e=e=>{e.key===c&&T(e.newValue||u)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[T]),r.useEffect(()=>{S(null!=t?t:b)},[t,b]);let R=r.useMemo(()=>({theme:b,setTheme:T,forcedTheme:t,resolvedTheme:"system"===b?_:b,themes:n?[...d,"system"]:d,systemTheme:n?_:void 0}),[b,T,t,_,n,d]);return r.createElement(l.Provider,{value:R},r.createElement(f,{forcedTheme:t,disableTransitionOnChange:a,enableSystem:n,enableColorScheme:s,storageKey:c,themes:d,defaultTheme:u,attribute:x,value:v,children:w,attrs:C,nonce:y}),w)},f=r.memo(e=>{let{forcedTheme:t,storageKey:a,attribute:n,enableSystem:l,enableColorScheme:s,defaultTheme:c,value:d,attrs:h,nonce:u}=e,f="system"===c,p="class"===n?"var d=document.documentElement,c=d.classList;".concat("c.remove(".concat(h.map(e=>"'".concat(e,"'")).join(","),")"),";"):"var d=document.documentElement,n='".concat(n,"',s='setAttribute';"),m=s?(i.includes(c)?c:null)?"if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'".concat(c,"'"):"if(e==='light'||e==='dark')d.style.colorScheme=e":"",g=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=!(arguments.length>2)||void 0===arguments[2]||arguments[2],r=d?d[e]:e,o=t?e+"|| ''":"'".concat(r,"'"),l="";return s&&a&&!t&&i.includes(e)&&(l+="d.style.colorScheme = '".concat(e,"';")),"class"===n?t||r?l+="c.add(".concat(o,")"):l+="null":r&&(l+="d[s](n,".concat(o,")")),l},x=t?"!function(){".concat(p).concat(g(t),"}()"):l?"!function(){try{".concat(p,"var e=localStorage.getItem('").concat(a,"');if('system'===e||(!e&&").concat(f,")){var t='").concat(o,"',m=window.matchMedia(t);if(m.media!==t||m.matches){").concat(g("dark"),"}else{").concat(g("light"),"}}else if(e){").concat(d?"var x=".concat(JSON.stringify(d),";"):"").concat(g(d?"x[e]":"e",!0),"}").concat(f?"":"else{"+g(c,!1,!1)+"}").concat(m,"}catch(e){}}()"):"!function(){try{".concat(p,"var e=localStorage.getItem('").concat(a,"');if(e){").concat(d?"var x=".concat(JSON.stringify(d),";"):"").concat(g(d?"x[e]":"e",!0),"}else{").concat(g(c,!1,!1),";}").concat(m,"}catch(t){}}();");return r.createElement("script",{nonce:u,dangerouslySetInnerHTML:{__html:x}})}),p=(e,t)=>{let a;if(!n){try{a=localStorage.getItem(e)||void 0}catch(e){}return a||t}},m=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},g=e=>(e||(e=window.matchMedia(o)),e.matches?"dark":"light")}}]);