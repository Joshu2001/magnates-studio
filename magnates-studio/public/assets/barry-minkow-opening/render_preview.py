from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from pathlib import Path
import math, random, json
import numpy as np
BASE=Path(__file__).resolve().parent
AS=BASE/'assets'
CAM=json.loads((BASE/'tower-camera.json').read_text())
OUT=BASE/'preview-frames'; OUT.mkdir(exist_ok=True)
W,H,FPS=1280,720,24
im={k:Image.open(AS/v).convert('RGBA') for k,v in {'sky':'sacramento-storm-sky.webp','city':'sacramento-skyline.webp','tower':'sacramento-tower-three-story-podium.png','corridor':'construction-corridor.webp','pbg':'portrait-facade-background.webp','portrait':'barry-minkow-caption-free-portrait.webp'}.items()}
font='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font_cond='/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf'
def fnt(size,cond=False): return ImageFont.truetype(font_cond if cond else font,size)
def sm(x):
 x=max(0,min(1,x));return x*x*(3-2*x)
def cover(src,z=1,dx=0,dy=0):
 sw,sh=src.size;s=max(W/sw,H/sh)*z; rw,rh=int(sw*s),int(sh*s);src=src.resize((rw,rh),Image.Resampling.LANCZOS); x=(W-rw)//2+int(dx);y=(H-rh)//2+int(dy);out=Image.new('RGBA',(W,H));out.alpha_composite(src,(x,y));return out
def alpha(im0,a):
 if a>=1:return im0
 lay=im0.copy();lay.putalpha(lay.getchannel('A').point(lambda x:int(x*max(0,min(1,a)))));return lay
def blend(dst,src,a=1): dst.alpha_composite(alpha(src,a))
def tit(draw,text,xy,size,fill=(239,191,86,255),anchor='lm',spacing=0):
 ft=fnt(size,True)
 # Stroke and offset mimic the Canvas shadow.
 draw.text((xy[0]+2,xy[1]+4),text,font=ft,fill=(0,0,0,145),anchor=anchor,stroke_width=1,stroke_fill=(0,0,0,95),spacing=spacing)
 draw.text(xy,text,font=ft,fill=fill,anchor=anchor,stroke_width=0,spacing=spacing)
def draw(t):
 frame=Image.new('RGBA',(W,H),(7,9,12,255))
 # opening plate: independent city and cloud movement
 city=cover(im['city'],1.035+math.sin(t*.4)*.008,math.sin(t*.35)*10,0);blend(frame,city)
 sky=cover(im['sky'],1.08,((t*17)%85)-42,math.sin(t*.2)*5)
 mask=Image.new('L',(W,H));md=ImageDraw.Draw(mask)
 for y in range(0,455):
  a=255 if y<360 else int(255*(1-(y-360)/95));md.line((0,y,W,y),fill=max(0,a))
 sky.putalpha(mask)
 blend(frame,sky)
 haze=Image.new('RGBA',(W,H));hd=ImageDraw.Draw(haze);hd.rectangle((0,340,W,H),fill=(5,10,16,60));haze=haze.filter(ImageFilter.GaussianBlur(48));blend(frame,haze,.8)
 # Native-resolution cutout: upper tower first, then push in and glide down to the podium.
 rev=sm((t-CAM['towerRevealStart'])/CAM['towerRevealDuration']);close=sm((t-CAM['pushStart'])/CAM['pushDuration']);glide=sm((t-CAM['glideStart'])/CAM['glideDuration'])
 tower_box=None
 if rev>0:
  scale=CAM['scaleStart']+(CAM['scaleEnd']-CAM['scaleStart'])*close;w=int(im['tower'].width*scale);h=int(im['tower'].height*scale);tower=im['tower'].resize((w,h),Image.Resampling.LANCZOS);layer=Image.new('RGBA',(W,H));cx=int(CAM['centerStart']+(CAM['centerEnd']-CAM['centerStart'])*close);x=cx-w//2;y=int(CAM['topStart']+(CAM['topEnd']-CAM['topStart'])*close-CAM['panY']*glide);layer.paste(tower,(x,y),tower);blend(frame,layer,rev);tower_box=(x,y,w,h)
 # moving warm searchlight: directional trapezoid and soft spill
 p=max(0,min(1,(t-2.55)/1.35))
 if 0<p<1:
  x=int(1010-540*sm(p)+max(0,(p-.84)/.16)*100); glow=Image.new('RGBA',(W,H));g=ImageDraw.Draw(glow);g.polygon([(1188,148),(x-88,416),(x+106,434),(1210,167)],fill=(255,192,104,86));g.line([(1184,151),(x+5,425)],fill=(255,226,172,170),width=4);g.ellipse((x-190,245,x+190,475),fill=(255,209,139,48));glow=glow.filter(ImageFilter.GaussianBlur(23));blend(frame,glow,math.sin(p*math.pi)*1.1); core=Image.new('RGBA',(W,H));cd=ImageDraw.Draw(core);cd.line([(1184,151),(x+5,425)],fill=(255,225,165,180),width=5);cd.ellipse((x-20,408,x+28,448),fill=(255,210,125,130));core=core.filter(ImageFilter.GaussianBlur(8));blend(frame,core,math.sin(p*math.pi))
 # A rightward-moving location title uses the same image pixels as the lower facade.
 d=ImageDraw.Draw(frame)
 loc=sm((t-CAM['titleStart'])/CAM['titleInDuration'])*(1-sm((t-CAM['titleOutStart'])/CAM['titleOutDuration']))
 if loc>0 and tower_box:
  x0,y0,tw,th=tower_box;px=int(CAM['titleXStart']+(CAM['titleXEnd']-CAM['titleXStart'])*sm((t-CAM['titleMoveStart'])/CAM['titleMoveDuration']));py=int(y0+th*CAM['titleAnchorY']);mask=Image.new('L',(W,H));md=ImageDraw.Draw(mask);md.text((px,py),'SACRAMENTO',font=fnt(29,True),fill=255,anchor='lm',stroke_width=0)
  source=Image.new('RGBA',(W,H));scaled=im['tower'].resize((tw,th),Image.Resampling.LANCZOS);source.paste(scaled,(x0,y0),scaled);arr=np.asarray(source).copy();mat=np.asarray(mask,dtype=np.float32)*loc;gold=np.array([238,177,59],dtype=np.float32);arr[:,:,:3]=np.clip(arr[:,:,:3]*.42+gold*.58,0,255).astype(np.uint8);arr[:,:,3]=(arr[:,:,3].astype(np.float32)*mat/255).astype(np.uint8);frame.alpha_composite(Image.fromarray(arr,'RGBA'))
 # gold downward occlusion opens corridor from bottom, like a moving layer not a crossfade
 cp=sm((t-CAM['corridorStart'])/CAM['corridorDuration'])
 if cp>0:
  corridor=cover(im['corridor'],1.02+max(0,t-CAM['corridorStart'])*.035,0,-4);reveal=int(H*cp);crop=corridor.crop((0,H-reveal,W,H));frame.alpha_composite(crop,(0,H-reveal))
  if cp<1:
   edge=Image.new('RGBA',(W,50));ed=ImageDraw.Draw(edge);ed.line((0,22,W,22),fill=(255,208,104,215),width=3);edge=edge.filter(ImageFilter.GaussianBlur(10));frame.alpha_composite(edge,(0,H-reveal-24))
 # fast light flash, then the clean portrait over a distinct facade background
 fp=sm((t-7.12)/.42)
 if fp>0:
  bg=cover(im['pbg'],1.05+max(0,t-7.2)*.12,-5,-2);blend(frame,bg,fp)
  ph=620;pw=int(ph*im['portrait'].width/im['portrait'].height);person=im['portrait'].resize((pw,ph),Image.Resampling.LANCZOS);pl=Image.new('RGBA',(W,H));pl.alpha_composite(person,(234,H+20-ph));blend(frame,pl,fp)

 # painterly vignette and deterministic analog flecks
 vign=Image.new('RGBA',(W,H));vd=ImageDraw.Draw(vign);vd.ellipse((-260,-220,W+260,H+220),fill=(0,0,0,0),outline=(0,0,0,175),width=320);vign=vign.filter(ImageFilter.GaussianBlur(70));blend(frame,vign)
 d=ImageDraw.Draw(frame);random.seed(int(t*24));
 for i in range(260):
  x=random.randrange(W);y=random.randrange(H);d.point((x,y),fill=(220,207,174,random.randrange(4,20)))
 # Flash opacity blooms and falls away; second flash masks the scene change.
 radius=1120+(70-1120)*sm(t/.66);flash=1-sm(t/.72);flash=max(flash,math.exp(-((t-7.12)/.10)**2)*.78)
 if flash>.005:
  small_w,small_h=320,180;yy,xx=np.mgrid[0:small_h,0:small_w];dist=np.sqrt(((xx-small_w/2)*W/small_w)**2+((yy-small_h/2)*H/small_h)**2);rad=max(20,radius);values=np.clip(1-dist/rad,0,1)**.72*min(.99,flash);values=np.where(dist<rad*.48, min(.99,flash), values);values=np.clip(np.maximum(np.where(dist<rad, np.maximum(values, min(.99,flash)*.82*(1-(dist/rad-.48)/.52)), 0), min(.99,flash)*.82),0,1);alpha_map=Image.fromarray(np.uint8(values*255),'L').resize((W,H),Image.Resampling.BILINEAR);flare=Image.new('RGBA',(W,H),(255,246,220,0));flare.putalpha(alpha_map);blend(frame,flare)
 return frame.convert('RGB')
for i in range(FPS*8):
 imf=draw(i/FPS);imf.save(OUT/f'frame-{i:04d}.jpg',quality=94,optimize=True)
print(f'Created {FPS*8} frames in {OUT}; encode with: ffmpeg -y -framerate 24 -i preview-frames/frame-%04d.jpg -an -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart preview.mp4')
