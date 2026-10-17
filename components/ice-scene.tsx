"use client";
import { useEffect, useRef, useState } from "react";
const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform float time;
uniform float progress;
float hash(vec3 p){p=fract(p*.3183099+vec3(.1,.2,.3));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
vec3 local(vec3 p){p.y-=.22;p.xz=rot(.54+time*.055+pointer.x*.28+progress*.8)*p.xz;p.yz=rot(-.3+pointer.y*.16+progress*.3)*p.yz;p.xy=rot(-.16)*p.xy;return p;}
float shape(vec3 p){p=local(p);vec3 q=abs(p)-vec3(.83,.9,.83);float box=length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-.10;return box+(noise(p*15.)-.5)*.016;}
vec3 normal(vec3 p){vec2 e=vec2(.003,0);return normalize(vec3(shape(p+e.xyy)-shape(p-e.xyy),shape(p+e.yxy)-shape(p-e.yxy),shape(p+e.yyx)-shape(p-e.yyx)));}
float veins(vec3 p){float a=noise(p*3.1);float v=abs(sin(p.x*14.+p.y*9.+p.z*3.+a*1.7));float w=abs(sin(p.y*10.-p.z*12.+a*2.));return pow(1.-min(v,w),36.);}
vec3 environment(vec3 d){float strip=pow(max(0.,1.-abs(d.y*.9+d.x*.35-.3)),30.);float soft=pow(max(dot(d,normalize(vec3(-1,2,1))),0.),6.);return vec3(.12,.15,.17)+vec3(.65,.78,.85)*strip+vec3(.55,.65,.72)*soft;}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
 vec3 bg=vec3(.025,.032,.037);float halo=exp(-length(uv-vec2(0.,.04))*2.7);bg+=vec3(.035,.046,.052)*halo;
 float floorGlow=exp(-pow(uv.y+.49,2.)*230.-pow(uv.x,2.)*3.);bg+=vec3(.09,.13,.15)*floorGlow;
 vec3 ro=vec3(0.,.1,5.4);vec2 sceneUv=uv-vec2(0.,.13);sceneUv*=max(1.,.7/(resolution.x/resolution.y));
 vec3 rd=normalize(vec3(sceneUv*5.4, -5.));
 float t=0.;float d=0.;vec3 p=ro;bool hit=false;
 for(int i=0;i<72;i++){p=ro+rd*t;d=shape(p);if(d<.002){hit=true;break;}t+=d*.8;if(t>9.)break;}
 vec3 col=bg;
 if(hit){
 vec3 n=normal(p);vec3 lp=local(p);vec3 light=normalize(vec3(-2.,3.,4.));float diff=max(dot(n,light),0.);float fres=pow(1.-max(dot(n,-rd),0.),3.);
 vec3 refr=refract(rd,n,.74);float frost=0.;float cracks=0.;
 for(int j=0;j<12;j++){vec3 q=local(p+refr*float(j)*.15);float inside=1.-smoothstep(.65,1.15,length(q));frost+=noise(q*9.+noise(q*3.)*3.)*inside*.045;cracks+=veins(q)*inside*.13;}
 float grain=noise(lp*130.);float faceVein=veins(lp)*.4;float spec=pow(max(dot(reflect(-light,n),-rd),0.),80.);
 col=vec3(.17,.23,.26)*(diff*.65+.4)+environment(reflect(rd,n))*(.16+fres*.9);
 col+=vec3(.51,.66,.71)*frost+vec3(.65,.79,.82)*(cracks+faceVein)*(.25+diff*.65);
 col+=vec3(.85,.96,1.)*spec*.9+grain*.025;
 float edge=pow(1.-max(dot(n,-rd),0.),6.);col+=vec3(.5,.72,.8)*edge*.65;
 col=mix(col,vec3(.82,.9,.91),smoothstep(.82,1.,noise(lp*5.))*diff*.35);
 }
 float vignette=1.-smoothstep(.3,1.3,length(uv))*.35;
 col*=vignette;col+= (hash(vec3(gl_FragCoord.xy,1.))-.5)/180.;
 gl_FragColor=vec4(pow(col,vec3(.88)),1.);
}`;
/** Original procedural ice sculpture. No downloaded models, textures, or tracking. */
export default function IceScene() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [paused, setPaused] = useState(false);
    const pauseRef = useRef(false);
    useEffect(() => { pauseRef.current = paused; }, [paused]);
    useEffect(() => {
        const element = canvas.current;
        if (!element)
            return;
        const gl = element.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
        if (!gl)
            return;
        const shaders: WebGLShader[] = [];
        const compile = (kind: number, source: string) => {
            const shader = gl.createShader(kind);
            if (!shader)
                return null;
            shaders.push(shader);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
        };
        const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
        const program = gl.createProgram();
        if (!vs || !fs || !program) {
            shaders.forEach(s => gl.deleteShader(s));
            if (program)
                gl.deleteProgram(program);
            return;
        }
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            shaders.forEach(s => gl.deleteShader(s));
            gl.deleteProgram(program);
            return;
        }
        gl.useProgram(program);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position);
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        const size = gl.getUniformLocation(program, "resolution"), clock = gl.getUniformLocation(program, "time"), mouse = gl.getUniformLocation(program, "pointer"), scroll = gl.getUniformLocation(program, "progress");
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
        let frame = 0, visible = true, last = 0, elapsed = 0, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0, lost = false, dirty = true, wasStatic = false, sceneProgress = 0;
        const resize = () => {
            const ratio = Math.min(window.devicePixelRatio, 1);
            const scale = .7;
            element.width = Math.round(element.clientWidth * ratio * scale);
            element.height = Math.round(element.clientHeight * ratio * scale);
            gl.viewport(0, 0, element.width, element.height);
            dirty = true;
        };
        const move = (event: PointerEvent) => {
            if (event.pointerType === "touch")
                return;
            const rect = element.getBoundingClientRect();
            targetX = (event.clientX - rect.left) / rect.width - .5;
            targetY = (event.clientY - rect.top) / rect.height - .5;
        };
        const draw = (now: number) => {
            frame = requestAnimationFrame(draw);
            if (!visible || document.hidden || lost) {
                last = now;
                return;
            }
            if (now - last < 33)
                return;
            const delta = Math.min((now - last) / 1000, .05);
            last = now;
            const isStatic = reduced.matches || pauseRef.current;
            if (isStatic && wasStatic && !dirty)
                return;
            wasStatic = isStatic;
            dirty = false;
            if (!reduced.matches && !pauseRef.current) {
                elapsed += delta;
                pointerX += (targetX - pointerX) * .045;
                pointerY += (targetY - pointerY) * .045;
            }
            gl.uniform2f(size, element.width, element.height);
            gl.uniform1f(clock, elapsed);
            gl.uniform2f(mouse, reduced.matches ? 0 : pointerX, reduced.matches ? 0 : pointerY);
            if (!isStatic)
                sceneProgress = Math.min(window.scrollY / element.clientHeight, 1);
            gl.uniform1f(scroll, reduced.matches ? 0 : sceneProgress);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            if (!element.dataset.ready) element.dataset.ready = "true";
        };
        const contextLost = (event: Event) => { event.preventDefault(); lost = true; delete element.dataset.ready; };
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "80px" });
        const dimensions = new ResizeObserver(resize);
        dimensions.observe(element);
        observer.observe(element);
        window.addEventListener("pointermove", move, { passive: true });
        element.addEventListener("webglcontextlost", contextLost);
        resize();
        frame = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            dimensions.disconnect();
            window.removeEventListener("pointermove", move);
            element.removeEventListener("webglcontextlost", contextLost);
            gl.deleteBuffer(buffer);
            shaders.forEach(s => gl.deleteShader(s));
            gl.deleteProgram(program);
        };
    }, []);
    return <div className="ice-scene">
    <div className="ice-fallback" aria-hidden="true"><div className="ice-fallback-core"/></div>
    <canvas ref={canvas} aria-hidden="true"/>
    <button className="motion-toggle" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Resume sculpture animation" : "Pause sculpture animation"}>
      <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Resume motion" : "Pause motion"}
    </button>
  </div>;
}
