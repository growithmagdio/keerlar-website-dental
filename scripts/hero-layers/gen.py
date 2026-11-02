import cv2, numpy as np, json, os
from PIL import Image
exec(open('polys.py').read())
OUT='/home/user/keeler/web/public/assets/hero'; os.makedirs(OUT,exist_ok=True)
im=cv2.imread('src.png'); H,W=im.shape[:2]
K=lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(2*r+1,2*r+1))
soft=cv2.imread('mask_isnet-general-use.png',0).astype(np.float32)
# 1) clean silhouette: drop the thin orbit ring + heart, fill interiors
B=(soft>110).astype(np.uint8)*255
opened=cv2.morphologyEx(B,cv2.MORPH_OPEN,K(13))
n,lab,stats,_=cv2.connectedComponentsWithStats(opened)
keep=np.zeros_like(opened)
for i in range(1,n):
    if stats[i,cv2.CC_STAT_AREA]>4000: keep[lab==i]=255
body=cv2.morphologyEx(keep,cv2.MORPH_CLOSE,K(9))
ff=body.copy(); m=np.zeros((H+2,W+2),np.uint8); cv2.floodFill(ff,m,(0,0),255)
body=body|cv2.bitwise_not(ff)
near=cv2.dilate(body,K(4))
alpha=np.where(near>0,soft,0)
alpha=np.maximum(alpha,cv2.erode(body,K(3)).astype(np.float32))
alpha=np.clip(alpha,0,255)
# 2) child via grabcut (computed earlier, re-run for determinism)
poly=np.zeros((H,W),np.uint8); cv2.fillPoly(poly,[np.array(BABY,np.int32)],255)
inner=cv2.erode(poly,K(12)); outer=cv2.dilate(poly,K(14))
gm=np.full((H,W),cv2.GC_BGD,np.uint8); gm[outer>0]=cv2.GC_PR_BGD; gm[poly>0]=cv2.GC_PR_FGD; gm[inner>0]=cv2.GC_FGD
x0,y0,x1,y1=540,400,1120,840
sub=gm[y0:y1,x0:x1].copy(); bgm=np.zeros((1,65)); fgm=np.zeros((1,65))
cv2.setRNGSeed(7)
cv2.grabCut(im[y0:y1,x0:x1],sub,None,bgm,fgm,6,cv2.GC_INIT_WITH_MASK)
baby=np.zeros((H,W),np.uint8); baby[y0:y1,x0:x1]=np.where((sub==1)|(sub==3),255,0).astype(np.uint8)
n,lab,stats,_=cv2.connectedComponentsWithStats(baby)
big=1+np.argmax(stats[1:,cv2.CC_STAT_AREA]); baby=np.where(lab==big,255,0).astype(np.uint8)
baby=cv2.morphologyEx(baby,cv2.MORPH_CLOSE,K(3))
babyDil=cv2.dilate(baby,K(5))
# child alpha: soft silhouette where it meets the background, crisp grabcut edge where it overlaps parents
babyA=np.minimum(cv2.GaussianBlur(baby,(0,0),0.8).astype(np.float32), np.maximum(alpha, 0))
babyA=np.where(cv2.erode(baby,K(2))>0,255,babyA)
# 3) parents
xs=np.arange(W)[None,:].repeat(H,0)
LHID=[(818,380),(818,420),(805,470),(790,520),(770,570),(745,620),(725,660),(712,700),(705,740),(700,775),(686,797),(560,797),(560,380)]
RHID=[(872,380),(878,440),(892,480),(910,530),(930,580),(945,630),(955,680),(962,730),(968,770),(978,799),(1120,799),(1120,380)]
def parent(side, hid):
    region=(xs<845) if side=='L' else (xs>=845)
    vis=np.where(region & (babyDil==0), alpha, 0).astype(np.float32)
    hp=np.zeros((H,W),np.uint8); cv2.fillPoly(hp,[np.array(hid,np.int32)],255)
    hidden=cv2.bitwise_and(hp,babyDil)
    # colour the hidden part from this parent's own visible pixels only
    known=(vis>200).astype(np.uint8)
    unknown=np.zeros((H,W),np.uint8)
    ys,xs_=np.nonzero(hidden); bx0,bx1,by0,by1=xs_.min()-40,xs_.max()+40,ys.min()-40,ys.max()+40
    unknown[by0:by1,bx0:bx1]=255; unknown[known>0]=0
    rgb=im.copy()
    filled=cv2.inpaint(rgb,unknown,6,cv2.INPAINT_TELEA)
    rgb[hidden>0]=filled[hidden>0]
    a=np.maximum(vis,hidden.astype(np.float32))
    # keep only the main body (drops loose orbit-ring fragments)
    bn=(a>128).astype(np.uint8)
    n,lab,stats,_=cv2.connectedComponentsWithStats(bn)
    big=1+np.argmax(stats[1:,cv2.CC_STAT_AREA])
    main=cv2.dilate((lab==big).astype(np.uint8)*255,K(3))
    a=np.where(main>0,a,0)
    solid=cv2.erode(((a>128)*255).astype(np.uint8),K(2))
    a=np.where(solid>0,255,np.minimum(a,cv2.GaussianBlur(a,(0,0),0.7)))
    # soften the inpainted area slightly so it reads as smooth enamel
    sm=cv2.GaussianBlur(rgb,(0,0),3)
    rgb[hidden>0]=sm[hidden>0]
    return rgb,a
Lrgb,La=parent('L',LHID); Rrgb,Ra=parent('R',RHID)
# drop anything below the floor line (reflections, ring sparkle)
for a,fy in ((La,800),(Ra,808),(babyA,826)):
    a[fy:,:]=0
# 4) irises out of the base layers (they get their own moving patches)
IRIS={'adultL':[((532,307),30,(519,293,53,45),4.5),((695,307),26,(708,293,41,42),4)],
      'adultR':[((997,355),25,(982,341,41,40),4),((1145,372),27,(1153,368,49,35),4.5)]}
base={'adultL':Lrgb,'adultR':Rrgb,'baby':im.copy()}
alph={'adultL':La,'adultR':Ra,'baby':babyA}
irisPatches=[]
for key,lst in IRIS.items():
    rgb=base[key]; orig=rgb.copy()
    for (c,r,sock,amp) in lst:
        mk=np.zeros((H,W),np.uint8); cv2.circle(mk,c,r+2,255,-1)
        # only fill inside the socket so the dark eye outline is kept
        sk=np.zeros((H,W),np.uint8); cv2.ellipse(sk,(sock[0],sock[1]),(sock[2],sock[3]),0,0,360,255,-1)
        fill=cv2.bitwise_and(mk,sk)
        rgb[:]=np.where(fill[...,None]>0,cv2.inpaint(rgb,fill,7,cv2.INPAINT_TELEA),rgb)
        pr=r+3; bx=(c[0]-pr,c[1]-pr,2*pr,2*pr)
        crop=orig[bx[1]:bx[1]+bx[3],bx[0]:bx[0]+bx[2]]
        pa=np.zeros((bx[3],bx[2]),np.uint8); cv2.circle(pa,(pr,pr),r,255,-1,cv2.LINE_AA)
        pa=cv2.GaussianBlur(pa,(0,0),0.9)
        irisPatches.append((key,crop,pa,bx,sock,amp))
# 5) export layers
def save_rgba(rgb,a,box,name,q=90):
    x,y,w,h=box
    rgba=np.dstack([rgb[y:y+h,x:x+w][...,::-1],np.clip(a[y:y+h,x:x+w],0,255).astype(np.uint8)])
    Image.fromarray(rgba,'RGBA').save(f'{OUT}/{name}.webp',quality=q,method=6,exact=False)
    return f'/assets/hero/{name}.webp'
data={'W':W,'H':H,'teeth':{},'parts':[]}
names={'adultL':'tooth-parent-left','adultR':'tooth-parent-right','baby':'tooth-child'}
boxes={}
for key in ('adultL','adultR','baby'):
    a=alph[key]; ys,xs_=np.nonzero(a>8)
    x,y=int(xs_.min())-3,int(ys.min())-3; w,h=int(xs_.max())-x+4,int(ys.max())-y+4
    boxes[key]=(x,y,w,h)
    src=save_rgba(base[key],a,(x,y,w,h),names[key])
    # foot: bottom-centre of the opaque part
    fx=int(np.median(xs_[ys>ys.max()-25]))
    data['teeth'][key]={'src':src,'box':[x,y,w,h],'foot':[fx,int(ys.max())]}
# mouths (feathered patches from each final layer)
MOUTH={'adultL':(492,350,236,140),'adultR':(974,392,166,120),'baby':(778,580,110,80)}
for key,(x,y,w,h) in MOUTH.items():
    ell=np.zeros((H,W),np.float32); cv2.ellipse(ell,(x+w//2,y+h//2),(w//2-10,h//2-10),0,0,360,1.0,-1)
    ell=cv2.GaussianBlur(ell,(0,0),7)
    src=save_rgba(base[key],alph[key]*ell,(x,y,w,h),f'{names[key]}-mouth')
    data['parts'].append({'tooth':key,'kind':'mouth','src':src,'box':[x,y,w,h]})
for i,(key,crop,pa,bx,sock,amp) in enumerate(irisPatches):
    name=f'{names[key]}-iris-{i%2+1}'
    Image.fromarray(np.dstack([crop[...,::-1],pa]),'RGBA').save(f'{OUT}/{name}.webp',quality=92,method=6)
    clip=[sock[0]-sock[2],sock[1]-sock[3],2*sock[2],2*sock[3]]
    data['parts'].append({'tooth':key,'kind':'iris','src':f'/assets/hero/{name}.webp','box':list(bx),'clip':clip,'amp':amp})
# eyelids: socket ellipses, coloured from the skin just above and below each eye
def samp(rgb,x,y):
    p=rgb[y-3:y+4,x-3:x+4].reshape(-1,3).mean(0); return '#%02x%02x%02x'%(int(p[2]),int(p[1]),int(p[0]))
for key,lst in IRIS.items():
    for (c,r,sock,amp) in lst:
        cx,cy,rx,ry=sock
        top=samp(base[key],cx,cy-ry-9); bot=samp(base[key],cx,cy+ry+8)
        data['parts'].append({'tooth':key,'kind':'lid','box':[cx-rx-2,cy-ry-2,2*rx+4,2*ry+4],'color':[top,bot]})
data['glow']=[835,560]
data['heart']='M 530 175 C 518 62, 640 18, 760 34 C 852 47, 890 96, 935 101 C 990 106, 1042 26, 1140 22 C 1252 18, 1332 92, 1318 222'
data['orbit']={'cx':795,'cy':668,'rx':690,'ry':112,'rot':2.4}
ts='// Generated by the tooth-family layer cut (see /hero/gen.py). Coordinates are in source pixels.\n'
ts+='export type ToothKey = "adultL" | "adultR" | "baby";\n'
ts+='type Part =\n  | { tooth: ToothKey; kind: "mouth"; src: string; box: number[] }\n  | { tooth: ToothKey; kind: "iris"; src: string; box: number[]; clip: number[]; amp: number }\n  | { tooth: ToothKey; kind: "lid"; box: number[]; color: string[] };\n'
ts+='export const TF = '+json.dumps(data,indent=2)+' as {\n  W: number;\n  H: number;\n  teeth: Record<ToothKey, { src: string; box: number[]; foot: number[] }>;\n  parts: Part[];\n  glow: number[];\n  heart: string;\n  orbit: { cx: number; cy: number; rx: number; ry: number; rot: number };\n};\n'
open('/home/user/keeler/web/src/components/home/toothFamily.data.ts','w').write(ts)
# preview composite on a checker + on blue for QA
prev=np.full((H,W,3),(250,236,214),np.uint8)
for key in ('adultL','adultR','baby'):
    a=(alph[key]/255.0)[...,None]; prev=(base[key]*a+prev*(1-a)).astype(np.uint8)
cv2.imwrite('work/composite.jpg',cv2.resize(prev,(836,470)),[cv2.IMWRITE_JPEG_QUALITY,85])
for key in ('adultL','adultR','baby'):
    x,y,w,h=boxes[key]; a=(alph[key][y:y+h,x:x+w]/255.0)[...,None]
    bg=np.zeros((h,w,3),np.uint8); bg[:]=(60,40,30)
    o=(base[key][y:y+h,x:x+w]*a+bg*(1-a)).astype(np.uint8)
    cv2.imwrite(f'work/{key}.jpg',cv2.resize(o,None,fx=0.5,fy=0.5),[cv2.IMWRITE_JPEG_QUALITY,80])
print(json.dumps(data['teeth']))
