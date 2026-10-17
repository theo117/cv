"""Adapt the captured Igloo production bundle for a CV-owned scroll canvas.

Input files are read as text, never executed by this preparation script.
Usage: python3 scripts/prepare-igloo-runtime.py BOOTSTRAP_JS APP3D_JS
The original dependency license comments are preserved verbatim.
"""
from pathlib import Path
import sys
import hashlib
import json

root = Path(__file__).resolve().parents[1] / 'public/igloo/assets'
root.mkdir(parents=True, exist_ok=True)
bootstrap = Path(sys.argv[1]).read_text()
runtime = Path(sys.argv[2]).read_text()
# Keep the compiled Svelte helpers, without the original app's auto-start/global CSS.
a = bootstrap.index('const ut=document.createElement("style")')
b = bootstrap.index('export{', a)
bootstrap = bootstrap[:a] + bootstrap[b:]
(root / 'index-2e130bc1.js').write_text(bootstrap)

def replace_once(old, new):
    global runtime
    if runtime.count(old) != 1:
        raise ValueError(f'Expected exactly one patch location: {old[:100]}')
    runtime = runtime.replace(old, new, 1)

# Audio, branded WebGL interface, project-detail router and particle footer are
# intentionally not instantiated. React owns all text, links and navigation.
replace_once('const ty={igloo:F3,cubes:aF,entry:UF}', 'const ty={igloo:F3,cubes:aF}')
replace_once('this.audioController=new u3(this),', '')
a = runtime.index('async createScenes(){this.uiScene=new GF')
b = runtime.index('}render(){var u,f;', a)
runtime = runtime[:a] + '''async createScenes(){
  Object.keys(ty).forEach(e=>this.scrollComposers.push(new tA({scene:new ty[e]({mainController:this})})));
  await Promise.all(this.scrollComposers.map(e=>e.passes[0].scene.uploaded));
''' + runtime[b:]
replace_once('zt.load(`${this.options.innerobject}.drc`)', 'Promise.resolve(portfolioMonogram())')
replace_once('new or({map:le.load(`cubes/${this.options.innerobject}_color.ktx2`)})', 'new or({color:0xdde7ed})')
# Workers use absolute URLs in the original build; namespace them with the asset base.
runtime = runtime.replace('new Worker("/assets/', 'new Worker("/igloo/assets/')
# srcdoc inherits a real window.origin, but its location.origin is "null".
# Both asset-base assignments must use that inherited origin.
if runtime.count('window.location.origin') != 2:
    raise ValueError('Expected two runtime asset origin assignments')
runtime = runtime.replace('window.location.origin', 'window.origin')
# Give the host an explicit frame budget; static modes render exactly once.
replace_once('aA=function(i,e){var t,s;this.active&&(',
             'aA=function(i,e){var t,s;this.active&&portfolioRenderBudget!==0&&(portfolioRenderBudget>0&&portfolioRenderBudget--,')
# The captured active handler assumes the adaptive controller always exists.
replace_once('&&this.adaptiveDPR.start(),this.active=i',
             '&&this.adaptiveDPR?.start(),this.active=i')


runtime += r'''

// CV adapter. The production renderer/materials above remain in their own module.
let portfolioRenderBudget=-1;
function portfolioMonogram() {
  const positions=[],uv=[];
  const faces=[[0,1,2,3],[5,4,7,6],[4,0,3,7],[1,5,6,2],[3,2,6,7],[4,5,1,0]];
  function bar(cx,cy,width,height,angle=0) {
    const vertices=[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1]].map(([x,y,z])=>{
      x*=width/2;y*=height/2;
      return [cx+x*Math.cos(angle)-y*Math.sin(angle),cy+x*Math.sin(angle)+y*Math.cos(angle),z*.085];
    });
    for(const f of faces)for(const i of [0,1,2,0,2,3]){positions.push(...vertices[f[i]]);uv.push(i===0||i===3?0:1,i<2?0:1);}
  }
  bar(-.31,.26,.44,.12);bar(-.31,-.035,.12,.59);
  bar(.08,0,.11,.65);bar(.48,0,.11,.65);bar(.28,0,.11,.77,.55);
  const geometry=new ot();geometry.setAttribute('position',new We(new Float32Array(positions),3));
  geometry.setAttribute('uv',new We(new Float32Array(uv),2));geometry.computeVertexNormals();
  geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
export async function createPortfolioExperience(container) {
  if(!q.capabilities.webgl2)throw new Error('WebGL2 unavailable');
  Be.manifesto={title:'THEODORE NELSON',text:'Java and full-stack developer. Practical software for real business needs.'};
  Be.copyright='';Be.rights='';Be.muted=true;
  Be.cubes=[{...Be.cubes[0],title:'THEODORE NELSON',hash:'selected-work',innerobject:'portfolio-monogram',interior:{...Be.cubes[0].interior,enabled:false}}];
  Ei.create('inOut5','M0,0 C0.171,0 0.77,-0.013 0.842,0.272 0.972,0.794 0.972,0.85 1,1');
  Ei.create('entry_ease','M0,0 C0.358,0 0.336,0.209 0.442,0.519 0.59,0.952 0.768,0.918 1,1',{precision:2});
  Ei.create('entry_ease_2','M0,0 C0.388,0.082 0.924,0.862 1,1',{precision:2});
  Ei.create('entry_ease_3','M0,0 C0.272,0 0.472,0.454 0.496,0.496 0.66,0.79 0.685,1 1,1',{precision:2});
  Ei.create('igloo_ease_1','M0,0 C0.662,0.073 0.047,1 1,1',{precision:2});
  // Bound render-target memory; the original full-screen app allocated more.
  const pixelRatio=Math.min(devicePixelRatio||1,1,Math.sqrt(900000/(innerWidth*innerHeight)));
  re.ticker.fps(30);
  await he.init({canvasCnt:container,relativePath:'igloo',fingers:2,audioContext:false,contextMenu:false,DPR:pixelRatio,adaptiveDPR:false,shadowMap:true,shadowMapType:ly});
  const controller=new jF();await controller.ready;
  const landscape=controller.scrollComposers[0].passes[0].scene;
  const cubes=controller.scrollComposers[1].passes[0].scene;
  landscape.introTL.progress(1);
  // Remove branded text meshes; their timeline state can still be updated safely.
  for(const value of Object.values(landscape.manifesto))if(value?.isObject3D)value.removeFromParent();
  cubes.textsGroup.removeFromParent();cubes.blurrytext.mesh.removeFromParent();
  const start=(landscape.initialScrollAutocenter-1/(landscape.height+1))*(landscape.height+1);
  const end=landscape.height;
  let progress=0;
  controller.mainMesh.material=controller.material;
  he.renderPass.scene.beforeRenderCbs.unshift(()=>{
    const scroll=start+(end-start)*progress;
    controller.scroll.y=scroll;controller.scroll.targetY1=scroll;controller.scroll.targetY2=scroll;
    controller.autoCenter.needed=false;controller.autoCenter.lastTarget=scroll;controller.autoCenter.lastTime=Fe.time;
  });
  // No start(): that would attach the original router and wheel-based navigation.
  Q.emit('webgl_render_active',true);
  return {
    setProgress(value){progress=Math.max(0,Math.min(1,value));},
    setActive(value){portfolioRenderBudget=value?-1:0;Q.emit('webgl_render_active',!!value);},
    renderOnce(){portfolioRenderBudget=1;Q.emit('webgl_render_active',true);},
    getState(){return {active:he.active&&portfolioRenderBudget!==0,progress,frame:Fe.frame};},
    setPointer(x,y){Q.emit('touch_move',{position01:new H(x,y),position11:new H(x*2-1,y*2-1),delta01:new H(),delta11:new H()});},
    dispose(){Q.emit('webgl_render_active',false);he.dispose({renderer:true,input:true,audioContext:false});}
  };
}
'''
(root / 'igloo-runtime.js').write_text(runtime)
print('Prepared isolated renderer with original scene geometry/materials and CV adapter.')

# Inventory the mirrored production dependencies and adapted bundles.
records = []
for path in sorted(root.rglob('*')):
    if not path.is_file() or path.name == 'manifest.json':
        continue
    relative = path.relative_to(root).as_posix()
    original = 'App3D-d68cb154.js' if relative == 'igloo-runtime.js' else relative
    records.append({
        'file': relative, 'source': 'https://www.igloo.inc/assets/' + original,
        'adapted': relative in ['igloo-runtime.js', 'index-2e130bc1.js'],
        'bytes': path.stat().st_size,
        'sha256': hashlib.sha256(path.read_bytes()).hexdigest(),
    })
(root / 'manifest.json').write_text(json.dumps({
    'reference': 'https://www.igloo.inc/',
    'capture': 'igloo.inc-1792247687360.zip',
    'files': records,
}, indent=2) + '\n')
