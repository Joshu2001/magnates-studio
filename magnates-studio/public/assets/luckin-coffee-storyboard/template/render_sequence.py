#!/usr/bin/env python3
"""Render the Luckin Coffee opening animatic deterministically at 24 fps."""
from pathlib import Path
import math, subprocess, sys
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parent
ASSET=ROOT.parent
W,H,FPS,N=1280,720,24,720
OUT=Path(sys.argv[1]) if len(sys.argv)>1 else ROOT/'Luckin_Intro_30s_Animatic.mp4'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
im={k:Image.open(ASSET/'plates'/f'{f}.webp').convert('RGB') for k,f in [('city','city_night_plate'),('cafe','cafe_counter_plate'),('store','storefront_glass_plate'),('desk','evidence_desk_plate')]}
cup=Image.open(ASSET/'cutouts/blank_blue_sleeve_cup.webp').convert('RGBA')
FRAME_DIR=ROOT/'media/pickup_frames'
if len(list(FRAME_DIR.glob('frame_*.webp')))<60:
    FRAME_DIR.mkdir(parents=True,exist_ok=True)
    subprocess.run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss','0','-i',str(ROOT/'media/cup_pickup_source.mp4'),'-t','2.5','-vf','fps=24,scale=1280:720:flags=lanczos','-frames:v','60','-c:v','libwebp','-quality','88',str(FRAME_DIR/'frame_%03d.webp')],check=True)
pickup=[Image.open(FRAME_DIR/f'frame_{i:03d}.webp').convert('RGB') for i in range(1,61)]
def ft(size,bold=True): return ImageFont.truetype(FONT if bold else REG,size)
def clamp(x,a=0,b=1): return max(a,min(b,x))
def sm(x): x=clamp(x);return x*x*(3-2*x)
def bt(t,a,b): return sm((t-a)/(b-a))
def cover(src,z=1,px=0,py=0):
    iw,ih=src.size;s=max(W/iw,H/ih)*z;rw,rh=round(iw*s),round(ih*s);r=src.resize((rw,rh),Image.Resampling.LANCZOS);x=round((W-rw)/2+px);y=round((H-rh)/2+py);base=Image.new('RGB',(W,H),(4,7,11));base.paste(r,(x,y));return base
def overlay(base,rgba): return Image.alpha_composite(base.convert('RGBA'),rgba)
def veil(base,a): return overlay(base,Image.new('RGBA',(W,H),(4,8,14,round(clamp(a)*255))))
_yy,_xx=np.ogrid[:H,:W]
_radius=np.sqrt(((_xx-W*.5)/(W*.78))**2+((_yy-H*.48)/(H*.82))**2)
_vignette_base=(np.clip((_radius-.25)/.8,0,1)*190).astype(np.uint8)
@lru_cache(maxsize=32)
def _vignette_layer(a):
    mask=Image.fromarray(np.uint8(_vignette_base*float(a)))
    sh=Image.new('RGBA',(W,H),(0,0,0,0));sh.putalpha(mask);return sh
def vignette(base,a=.5): return overlay(base,_vignette_layer(round(float(a),3)))
def txt(d,s,xy,size=30,color=(244,247,248,255),anchor='lm',bold=True,stroke=1):
    # Draw text to its own plane so partial opacity composites instead of replacing the plate pixels.
    target=d._image; layer=Image.new('RGBA',target.size,(0,0,0,0)); ld=ImageDraw.Draw(layer); alpha=color[3] if len(color)>3 else 255
    stroke_fill=(0,0,0,round(180*alpha/255)) if stroke else None
    ld.text(xy,s,font=ft(size,bold),fill=color,anchor=anchor,stroke_width=stroke,stroke_fill=stroke_fill)
    if target.mode=='RGBA': target.alpha_composite(layer)
    else: target.paste(Image.alpha_composite(target.convert('RGBA'),layer).convert(target.mode))
def small(d,s,xy,anchor='lm',color=(167,220,233,255)): txt(d,s.upper(),xy,12,color,anchor,True,1)
def rounded(d,box,r,fill,outline=None,width=1): d.rounded_rectangle(box,radius=r,fill=fill,outline=outline,width=width)
def glow(base,x,y,r,a=.35,color=(112,218,255)):
    g=Image.new('RGBA',(W,H),(0,0,0,0));gd=ImageDraw.Draw(g);gd.ellipse((x-r,y-r,x+r,y+r),fill=(*color,round(255*a)));g=g.filter(ImageFilter.GaussianBlur(max(2,int(r*.48))));return overlay(base,g)
def line(d,pts,fill,width=2,p=1):
    # Progressive path draw, measured by cumulative segment length.
    lens=[math.dist(pts[i-1],pts[i]) for i in range(1,len(pts))];remain=sum(lens)*clamp(p);draw=[pts[0]]
    for i,l in enumerate(lens):
        if remain>=l:draw.append(pts[i+1]);remain-=l
        elif remain>0:
            q=remain/l;draw.append((pts[i][0]+(pts[i+1][0]-pts[i][0])*q,pts[i][1]+(pts[i+1][1]-pts[i][1])*q));break
        else:break
    if len(draw)>1:d.line(draw,fill=fill,width=width,joint='curve')
def fade_image(base,src,box,alpha=1):
    src=src.convert('RGBA').resize((round(box[2]),round(box[3])),Image.Resampling.LANCZOS);src.putalpha(src.getchannel('A').point(lambda p:round(p*clamp(alpha))));base.alpha_composite(src,(round(box[0]),round(box[1])))
def scene(t,frame):
    if t<2.6:
        b=cover(im['city'],1+.045*bt(t,0,2.6),-8*bt(t,0,2.6));b=veil(b,.44);b=vignette(b,.7);b=glow(b,760,355,340,.1,(82,206,245));d=ImageDraw.Draw(b,'RGBA')
        # Globe/graticule, separate from its city background.
        a=clamp((3.9-t)*2.3)*.8;cx,cy,r=875,310,190+8*math.sin(t*1.7)
        gl=Image.new('RGBA',(W,H),(0,0,0,0));g=ImageDraw.Draw(gl,'RGBA');g.ellipse((cx-r,cy-r,cx+r,cy+r),fill=(13,48,74,round(148*a)),outline=(134,220,248,round(174*a)),width=2)
        for k in (.34,.68):g.ellipse((cx-r*k,cy-r,cx+r*k,cy+r),outline=(134,220,248,round(125*a)),width=1)
        for k in (.36,.7):g.ellipse((cx-r,cy-r*k,cx+r,cy+r*k),outline=(134,220,248,round(125*a)),width=1)
        b=overlay(b,gl);d=ImageDraw.Draw(b,'RGBA')
        p=clamp((t-.65)/1.35);pts=[(238,300),(410,220),(525,355),(688,250),(816,390),(1000,260),(1070,430),(900,520),(620,535),(320,480)];route=pts[:7];line(d,route,(100,210,246,155),2,p)
        for i,(x,y) in enumerate(pts[:int(p*len(pts))]):
            b=glow(b,x,y,34,.22+.05*math.sin(t*3+i));d=ImageDraw.Draw(b,'RGBA');d.ellipse((x-6,y-6,x+6,y+6),fill=(169,236,255,240),outline=(102,218,255,170),width=3)
        if t<2.55:
            d=ImageDraw.Draw(b,'RGBA');a=round(255*bt(t,.25,.65)*(1-bt(t,2.2,2.55)));txt(d,'A COFFEE COMPANY',(78,560),20,(200,219,227,a),'lm',True,0);txt(d,'OPENING AT BREAKNECK SPEED',(78,606),31,(244,247,248,a),'lm',True,2);small(d,'ILLUSTRATIVE CITY NETWORK · NOT STORE LOCATIONS',(80,646))
        return b
    if t<4:
        p=bt(t,2.55,3.9);b=cover(im['city'],1.04);caf=cover(im['cafe'],1.01).convert('RGBA');mask=Image.new('L',(W,H));md=ImageDraw.Draw(mask);md.ellipse((840-(20+920*p),355-(20+920*p),840+(20+920*p),355+(20+920*p)),fill=255);caf.putalpha(mask);b=overlay(b,caf);b=veil(b,.13);b=vignette(b,.48);b=glow(b,840,355,180*(.6+p),.3);d=ImageDraw.Draw(b,'RGBA');draw_phone(d,t);return b
    if t<5.5:
        b=cover(im['cafe'],1.02+.008*math.sin(t));b=veil(b,.22);b=vignette(b,.42);d=ImageDraw.Draw(b,'RGBA');draw_phone(d,t);return b
    if t<8:
        b=cover(pickup[max(0,min(59,frame-132))]);b=veil(b,.1);b=vignette(b,.32);d=ImageDraw.Draw(b,'RGBA')
        if t<5.92:
            a=round(255*(1-bt(t,5.5,5.92)));rounded(d,(48,132,315,557),24,(3,11,18,round(.92*a)),(191,225,237,round(.68*a)),2);small(d,'ORDER AHEAD',(78,186),color=(167,220,233,a));txt(d,'Coffee, ready',(78,238),22,(244,247,248,a),'lm',True,2);rounded(d,(77,287,285,380),10,(234,243,243,a));txt(d,'PICKUP',(93,316),12,(66,97,113,a),'lm',True,0);txt(d,'IN STORE',(93,347),19,(22,52,73,a),'lm',True,0);rounded(d,(77,412,285,462),8,(37,141,171,a));txt(d,'PLACE ORDER',(181,437),14,(255,255,255,a),'mm',True,0);small(d,'APP UI RECONSTRUCTION',(48,585),color=(215,229,233,a))
        return b
    if t<12:return comparison(t)
    if t<16:
        p=bt(t,12,13.15);b=cover(im['store'],1.04+.025*bt(t,13.1,16),-4);b=veil(b,.34);b=vignette(b,.68);# wipe over darkness
        if t<13.12:
            wipe=Image.new('RGBA',(W,H),(6,13,20,round(255*(1-p))));b=overlay(b,wipe)
        b=reflection(b,t);a=bt(t,14.35,15.05)*(1-bt(t,15.85,16.02));d=ImageDraw.Draw(b,'RGBA');d.ellipse((212,157,328,283),fill=(6,9,13,round(194*a)));d.ellipse((206,175,334,300),fill=(6,9,13,round(194*a)));d.rectangle((206,285,334,680),fill=(6,9,13,round(194*a)))
        aa=bt(t,13.05,13.45);txt(d,'THEN, INVESTIGATORS',(66,554),25,(244,247,248,round(255*aa)),'lm',True,2);txt(d,'STARTED COUNTING.',(66,598),34,(244,247,248,round(255*aa)),'lm',True,2);small(d,'ILLUSTRATIVE INVESTIGATION CUE',(68,640));return b
    if t<20:return desk(t)
    if t<24:return chart(t)
    if t<27:return admission(t)
    return ending(t)

def draw_phone(target_draw,t):
    target=target_draw._image; layer=Image.new('RGBA',target.size,(0,0,0,0)); d=ImageDraw.Draw(layer)
    enter=bt(t,2.55,3.4);leave=bt(t,5.62,5.95);a=round(255*clamp((7.9-t)*2.2)*clamp((t-2.35)*3)*(1-leave));x=850+(1-enter)*250;y=330+(1-enter)*120;s=.92+.08*enter
    d.rounded_rectangle((x-112*s,y-220*s,x+112*s,y+220*s),radius=32,fill=(6,16,24,a),outline=(170,201,215,a),width=3);d.rounded_rectangle((x-97*s,y-199*s,x+97*s,y+199*s),radius=22,fill=(16,30,42,a));small(d,'LUCKIN · APP RECONSTRUCTION',(x,y-144*s),'mm',(154,223,240,a));rounded(d,(x-77*s,y-116*s,x+77*s,y-1*s),12,(234,244,245,a));txt(d,'TODAY’S OFFER',(x-61*s,y-91*s),11,(21,52,72,a),'lm',True,0);txt(d,'COFFEE',(x-61*s,y-57*s),22,(16,44,66,a),'lm',True,0);txt(d,'ORDER AHEAD',(x-61*s,y-32*s),11,(69,98,116,a),'lm',True,0);rounded(d,(x-66*s,y+25*s,x+66*s,y+67*s),9,(42,145,178,a));txt(d,'ORDER NOW',(x,y+46*s),13,(255,255,255,a),'mm',True,0);rounded(d,(x-69*s,y+90*s,x+69*s,y+148*s),8,(20,41,55,a),(51,83,102,a));small(d,'PICKUP · IN STORE',(x,y+110*s),'mm',(158,181,194,a));target.alpha_composite(layer)
def reflection(b,t):
    layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer);x=int((t*87)%1700-300);d.polygon([(x,0),(x+185,0),(x+465,H),(x+240,H)],fill=(210,232,255,30));return overlay(b,layer.filter(ImageFilter.GaussianBlur(28)))
def comparison(t):
    b=cover(im['city'],1.06+.015*bt(t,8,12),-10);b=veil(b,.58);b=vignette(b,.42)
    def card(x,y,w,h,title,sub,col,a,tilt=0):
        a=round(255*clamp(a));layer=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(layer);cx=x+w/2;cy=y+h/2;d.rounded_rectangle((cx-w/2,cy-h/2,cx+w/2,cy+h/2),radius=14,fill=(8,19,29,round(.9*a)),outline=(173,222,241,round(.32*a)),width=2);d.rectangle((cx-w/2+1,cy-h/2+1,cx+w/2-1,cy-h/2+5),fill=(*col,a));txt(d,title,(cx-w/2+22,cy-h/2+34),12,(*col,a),'lm',True,0);txt(d,sub,(cx-w/2+22,cy-h/2+78),24,(244,246,247,a),'lm',True,1);d.line((cx-w/2+22,cy-h/2+105,cx+w/2-22,cy-h/2+105),fill=(202,222,231,35),width=1)
        for i in range(3):d.rectangle((cx-w/2+25+i*44,cy+h/2-24-i*18,cx-w/2+42+i*44,cy+h/2-18),fill=(125,212,238,round((.45-i*.09)*a)))
        b.alpha_composite(layer)
    p1=bt(t,8.0,8.65);p2=bt(t,9.08,9.72);card(94+(1-p1)*-410,226,468,280,'CHINA · COFFEE','A new challenger',(118,217,244),p1);card(718+(1-p2)*430,226,468,280,'INVESTOR LENS','Luckin ↔ Starbucks',(231,184,131),p2);d=ImageDraw.Draw(b,'RGBA');
    if t>10.2:small(d,'QUALITATIVE CONTEXT · NO NUMERIC SCALE',(W//2,566),'mm',(211,220,225,round(255*clamp((t-10.2)*1.7))))
    return b
def desk(t):
    b=cover(im['desk'],1.02+.01*bt(t,16,20));b=veil(b,.14);b=vignette(b,.48);d=ImageDraw.Draw(b,'RGBA');p=bt(t,16.65,17.05);r=bt(t,17.65,18.05)
    paper=Image.new('RGBA',(W,H),(0,0,0,0));q=ImageDraw.Draw(paper);y=138+(1-p)*180;q.rectangle((506,y,891,y+454),fill=(231,227,216,round(255*p)));txt(q,'ILLUSTRATIVE RECORD LAYOUT',(540,y+43),14,(81,96,106,round(255*p)),'lm',True,0)
    for i in range(9):q.rectangle((540,y+82+i*27,800-(i%3)*34,y+84+i*27),fill=(162,167,167,round(255*p)))
    b=overlay(b,paper);receipt=Image.new('RGBA',(W,H),(0,0,0,0));q=ImageDraw.Draw(receipt);x=940-(1-r)*360;cx,cy=x,430;q.rounded_rectangle((cx-110,cy-184,cx+110,cy+184),radius=2,fill=(240,238,232,round(255*r)));txt(q,'RECEIPT PROP',(cx,cy-137),13,(88,101,109,round(255*r)),'mm',True,0)
    for i in range(8):q.rectangle((cx-74,cy-97+i*28,cx+71-(i%3)*22,cy-95+i*28),fill=(165,170,168,round(255*r)))
    b=overlay(b,receipt);d=ImageDraw.Draw(b,'RGBA')
    if t>15.9:rounded(d,(30,24,311,51),4,(5,10,15,220),(255,255,255,36));small(d,'ILLUSTRATIVE VISUALIZATION',(46,38),color=(240,194,140,255))
    if t>18.5:
        p=bt(t,18.5,19);fade_image(b,im['store'],(860+(1-p)*280,75,260*p,145*p),p)
    return b
def chart(t):
    b=cover(im['city'],1.08,-18);b=veil(b,.7);b=vignette(b,.58);d=ImageDraw.Draw(b,'RGBA');rounded(d,(111,103,1169,615),14,(9,18,27,204),(160,211,230,56));small(d,'REPORTED GROWTH STORY',(153,148),'lm',(165,218,236,255))
    for i in range(5):d.line((170,228+i*70,1110,228+i*70),fill=(125,183,203,62),width=1)
    line(d,[(170,518),(330,470),(465,490),(615,387),(754,360),(904,278),(1091,242)],(127,218,243,255),3,bt(t,19.9,20.7));p=bt(t,20.8,21.55)
    if p:
        page=Image.new('RGBA',(W,H),(0,0,0,0));q=ImageDraw.Draw(page);x=715+(1-p)*510;y=130;q.rectangle((x-205,y,x+205,y+460),fill=(233,230,222,round(255*p)));txt(q,'SOURCE REVIEW',(x-164,y+56),18,(38,54,66,round(255*p)),'lm',True,0)
        for i in range(10):q.rectangle((x-164,y+102+i*28,x+136-(i%4)*28,y+104+i*28),fill=(110,119,124,round(255*p)))
        if t>=21.7:
            q.rectangle((x-180,y+217,x+180,y+278),outline=(255,116,106,round(255*bt(t,21.65,22.25))),width=4)
        txt(q,'ILLUSTRATIVE · NOT A SOURCE DOCUMENT',(x,y+423),10,(122,77,71,round(255*p)),'mm',True,0);b=overlay(b,page)
    if t>22.6:small(ImageDraw.Draw(b,'RGBA'),'ILLUSTRATIVE GRAPH · NOT TO SCALE',(W//2,655),'mm',(212,224,229,255))
    return b
def admission(t):
    b=cover(im['desk'],1.03+.08*bt(t,24,25.6));b=veil(b,.57);b=vignette(b,.65);p=bt(t,23.92,24.32);page=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(page);d.rectangle((220,78,1060,658),fill=(238,236,230,round(255*p)));small(d,'EDITORIAL SUMMARY',(300,142),'lm',(78,117,132,round(255*p)));d.rectangle((300,179,980,181),fill=(103,118,126,round(255*p)));txt(d,'LUCKIN COFFEE',(300,244),23,(36,52,60,round(255*p)),'lm',True,0);txt(d,'SALES FIGURES WERE FABRICATED',(300,318),38,(24,44,57,round(255*p)),'lm',True,0);txt(d,'Leadership removed. Shares collapsed.',(300,386),22,(68,87,96,round(255*p)),'lm',False,0);d.rectangle((300,442,980,444),fill=(105,119,125,round(255*p)));txt(d,'EDITORIAL SUMMARY · NOT AN ORIGINAL FILING',(300,510),12,(145,98,92,round(255*p)),'lm',True,0);b=overlay(b,page);return b
def ending(t):
    b=cover(im['cafe'],1.06+.03*bt(t,27.8,29.5),-7,0);b=veil(b,.1);b=vignette(b,.48);p=bt(t,27.75,28.22);w,h=round(330*(.74+.14*p)),round(425*(.74+.14*p));c=cup.resize((w,h),Image.Resampling.LANCZOS);alpha=c.getchannel('A').point(lambda a:round(a*p));c.putalpha(alpha);b=glow(b,800,436,250,.16,(255,184,100));b.alpha_composite(c,(800-w//2,470-h//2));d=ImageDraw.Draw(b,'RGBA');a=bt(t,28.05,28.45);q=bt(t,28.6,29.05);txt(d,'THE STORY DIDN’T END.',(72,183),36,(244,247,248,round(255*a)),'lm',True,2);txt(d,'WHAT SURVIVED?',(72,237),28,(142,220,244,round(255*q)),'lm',True,2);small(d,'A COMPANY CAN OUTLIVE ITS SCANDAL',(74,283),'lm',(200,217,224,255));return b
def main():
    OUT.parent.mkdir(parents=True,exist_ok=True);cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','ultrafast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    keyframes={0,11,25,40,60,96,113,132,192,218,245,288,314,346,384,403,425,446,480,499,521,545,576,595,614,648,667,689,719}
    contact=Image.new('RGB',(1280,720),'#0c1118');thumbs=[]
    try:
        for f in range(N):
            frame=scene(f/FPS,f).convert('RGB');proc.stdin.write(frame.tobytes())
            if f in keyframes:
                tw=320;th=180;thumb=frame.resize((tw,th),Image.Resampling.LANCZOS);thumbs.append((f,thumb))
            if f%120==0:print(f'Rendered {f}/{N} frames',flush=True)
    finally:
        proc.stdin.close()
    code=proc.wait()
    if code:raise SystemExit(f'ffmpeg exited {code}')
    cols=4;rows=math.ceil(len(thumbs)/cols);sheet=Image.new('RGB',(cols*320,rows*205),(8,12,18));d=ImageDraw.Draw(sheet)
    for i,(f,thumb) in enumerate(thumbs):
        x=(i%cols)*320;y=(i//cols)*205;sheet.paste(thumb,(x,y));d.rectangle((x,y+180,x+320,y+205),fill=(9,14,20));txt(d,f'F{f:03d} · {f/FPS:05.2f}s',(x+8,y+193),11,(194,218,231,255),'lm',True,0)
    sheet.save(OUT.with_name('Luckin_Intro_28_State_Contact_Sheet.jpg'),quality=92)
    print(f'Wrote {OUT} ({OUT.stat().st_size:,} bytes) and contact sheet',flush=True)
if __name__=='__main__':main()
