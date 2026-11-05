/**
 * ============================================================================
 * REGAARDER STUDIO — THE MOTION COLLECTION 001:
 * ORIGINS SLOW REVEAL, EYE STRIP, ORGANIC PAPER TEARS & LIVING FIRE ENGINE
 * (TEMPLATE_ID: 'regaarder-origins-slow-reveal')
 * ============================================================================
 * Extracted & adapted from Regaarder-Motion (dist/index.html, continuation.js,
 * flame-engine.js, surface-reveal.js, soft-media-blur.js, eye-director.js)
 * into Magnates Studio's unified stage, 4-tab Contextual Inspector
 * (Content, Motion, Look, Effects + Advanced Controls), and Universal
 * Contextual Toolbar (window.RegaarderContextualToolbar).
 * ============================================================================
 */
(function () {
  'use strict';

  const TEMPLATE_ID = 'regaarder-origins-slow-reveal';

  const VARIANT_PRESETS = {
    origins: {
      id: 'origins',
      badge: '01',
      title: 'Origins',
      subtitle: 'Town → brands → archival portrait',
      placeText: 'HERZOGENAURACH',
      captionText: 'ORIGINS / A DOCUMENTARY STUDY',
      closeScale: 1.0,
      speedCurve: 'standard'
    },
    rivalry: {
      id: 'rivalry',
      badge: '02',
      title: 'The Rivalry',
      subtitle: 'A closer, more dramatic reveal',
      placeText: 'THE RIVALRY',
      captionText: 'THE RIVALRY / BROTHER AGAINST BROTHER',
      closeScale: 1.65,
      speedCurve: 'dramatic'
    },
    behind_name: {
      id: 'behind_name',
      badge: '03',
      title: 'Behind the Name',
      subtitle: 'A restrained documentary opener',
      placeText: 'BEHIND THE NAME',
      captionText: 'ARCHIVAL DOSSIER / BAVARIA 1948',
      closeScale: 1.18,
      speedCurve: 'restrained'
    }
  };

  const STAGE_BEATS = [
    { id: 'all', shortLabel: 'All', title: 'Full Sequence', seekSec: 0 },
    { id: 'eye_reveal', shortLabel: '01 Eye', title: '01: Portrait & Eye Strip', seekSec: 5.8 },
    { id: 'tears', shortLabel: '02 Tears', title: '02: Organic Paper Tears', seekSec: 9.8 },
    { id: 'zoom_lamp', shortLabel: '03 Light', title: '03: Shoulder Zoom & Desk Light', seekSec: 15.2 },
    { id: 'fire_faces', shortLabel: '04 Fire', title: '04: Living Flames & Silhouettes', seekSec: 21.0 },
    { id: 'outdoor', shortLabel: '05 Scene', title: '05: Outdoor Unfold & Blur', seekSec: 28.0 }
  ];

  const EYE_CLIPS = {
    torn: [
      [0.00, 0.07], [0.08, 0.14], [0.17, 0.00], [0.28, 0.09], [0.39, 0.02],
      [0.48, 0.14], [0.61, 0.04], [0.72, 0.15], [0.85, 0.04], [1.00, 0.13],
      [0.98, 0.86], [0.89, 0.96], [0.76, 0.88], [0.65, 1.00], [0.53, 0.91],
      [0.42, 0.98], [0.30, 0.87], [0.16, 0.97], [0.02, 0.86]
    ],
    bar: [
      [0.00, 0.00], [1.00, 0.00], [1.00, 1.00], [0.00, 1.00]
    ],
    slash: [
      [0.05, 0.00], [1.00, 0.12], [0.95, 1.00], [0.00, 0.88]
    ]
  };

  const SURFACE_PRESETS = {
    none: { label: 'None (Clean Transition)', roughness: 0, feather: 0, contrast: 1, brightness: 1, scale: 1, particles: 0, color: '#000000' },
    soil: { label: 'Earth · Fine Soil', roughness: 9, feather: 9, contrast: 0.8, brightness: 0.85, scale: 1.1, particles: 18, color: '#73553b' },
    snow: { label: 'Snow · Soft Drift', roughness: 5, feather: 16, contrast: 0.8, brightness: 1.0, scale: 1.0, particles: 28, color: '#e8f2f6' },
    clouds: { label: 'Clouds · Mist Bank', roughness: 19, feather: 35, contrast: 0.8, brightness: 1.1, scale: 1.2, particles: 0, color: '#dce5ed' }
  };

  const DEFAULT_CONFIG = {
    type: 'regaarder-origins-slow-reveal',
    variantMode: 'origins',          // 'origins' | 'rivalry' | 'behind_name'
    activeBeatFilter: 'all',         // 'all' | 'eye_reveal' | 'tears' | 'zoom_lamp' | 'fire_faces' | 'outdoor'
    selectedStageObject: 'origins_eye',

    // Core Assets (Act 1 & Act 2)
    mapUrl: '/assets/regaarder-motion/map.png',
    adidasBarsUrl: '/assets/regaarder-motion/adidas-bars.svg',
    adidasWordUrl: '/assets/regaarder-motion/adidas-wordmark.svg',
    pumaLockupUrl: '/assets/regaarder-motion/puma-lockup.svg',
    portraitUrl: '/assets/regaarder-motion/portrait.png',
    revealUrl: '/assets/regaarder-motion/reveal.png',
    revealPreset: 'reveal_classic',  // 'reveal_classic' | 'shoulder_doorway' | 'outdoor_town' | 'custom'

    // Continuation Assets (Acts 3-5)
    shoulderUrl: '/assets/regaarder-motion/shoulder-v3.png',
    deskLampUrl: '/assets/regaarder-motion/desk-lamp-v3.png',
    facesUrl: '/assets/regaarder-motion/faces-v3.png',
    leftPortraitUrl: '/assets/regaarder-motion/faces-v3.png',
    rightPortraitUrl: '/assets/regaarder-motion/faces-v3.png',
    outdoorUrl: '/assets/regaarder-motion/outdoor.png',
    standingUrl: '/assets/regaarder-motion/standing.png',
    youngManUrl: '/assets/regaarder-motion/young-man-v2.png',
    backPairUrl: '/assets/regaarder-motion/pair-v2.png',
    fireSpriteUrl: '/assets/regaarder-motion/fire.png',
    wispsSpriteUrl: '/assets/regaarder-motion/wisps.png',
    cloudsSpriteUrl: '/assets/regaarder-motion/clouds.png',

    // Typography & Titles
    placeText: 'HERZOGENAURACH',
    placeColor: '#f8fafc',
    placeScale: 1.0,
    placeAngleDeg: 4,
    showPlaceTitle: true,
    captionText: 'ORIGINS / A DOCUMENTARY STUDY',
    showCaption: true,

    // Brand Lockups
    showBrandLogos: true,
    leftLogoScale: 1.0,
    rightLogoScale: 1.0,
    brandLogoOpacity: 85,

    // Portrait & Eye Strip Controls
    eyeColor: '#c6324a',
    eyeShape: 'torn',                // 'torn' | 'bar' | 'slash' | 'oval'
    eyeBlend: 'bleed',               // 'bleed' | 'multiply' | 'screen' | 'solid'
    eyeIntensity: 55,                // 0 - 100%
    eyeX: 37,                        // %
    eyeY: 36,                        // %
    eyeWidth: 29,                    // %
    eyeHeight: 9,                    // %
    eyeRotation: 4,                  // deg
    portraitStartOpacity: 8,         // 0 - 100%
    portraitGrayscale: 100,          // 0 - 100%
    portraitContrast: 115,           // 50 - 200%

    // Map & Atmospheric Wash
    mapSaturation: 70,               // 0 - 150%
    washColor: '#174a70',
    washOpacity: 27,                 // 0 - 100%
    vignetteStrength: 67,            // 0 - 100%

    // Organic Paper Tears Reveal (Act 2)
    enableTearReveal: true,
    spreadSpeed: 55,                 // 1 - 100 (Slow < 30, Natural 30-75, Fast > 75)
    tearOriginX: 50,                 // % (480 / 960)
    tearOriginY: 50,                 // % (268 / 540)
    tearCount: 7,                    // Primary tear nuclei (3 - 12)
    microTearCount: 90,              // Satellite micro-tears (0 - 140)
    openingDuration: 8.0,            // Seconds before tears start

    // Story Continuation (Acts 3-5: Shoulder Zoom -> Desk Light -> Living Fire -> Faces -> Outdoor)
    continuationEnabled: false,
    zoomAmount: 3.1,                 // 1.5 - 5.0x
    zoomSpeed: 55,                   // 1 - 100
    lightBrightness: 85,             // 0 - 100%
    lightColor: '#ffe6b4',
    lightFade: 3.0,                  // 0.5 - 8.0s
    darkFade: 2.0,                   // 0.5 - 6.0s
    sceneZoom: 1.15,                 // 1.0 - 1.6x
    lightFlicker: 12,                // 0 - 50
    deskSize: 100,                   // 60 - 140%
    deskReveal: 3.0,                 // 1.0 - 6.0s
    deskDirection: 'down',           // 'down' | 'up'

    // Living Combustion / Fire Engine
    fireStyle: 'classic',            // 'classic' | 'blue' | 'vivid' | 'intense' | 'wall'
    fireSize: 85,                    // 0 - 100
    fireWildness: 65,                // 0 - 100
    fireSparks: 55,                  // 0 - 100
    fireSpeed: 55,                   // 1 - 100
    fireWind: 0,                     // -50 to 50
    fireColor: '#ff681f',
    fireDelay: 1.0,                  // 0 - 6s
    fireBuild: 5.0,                  // 1 - 10s

    // Dual Silhouettes / Faces Behind Fire
    peopleVisibility: 75,            // 0 - 100%
    peopleFade: 3.0,                 // 0.5 - 8.0s
    peopleDelay: 2.0,                // 0 - 8.0s
    peopleSize: 110,                 // 60 - 130%
    peopleZoom: 2.25,                // 1.0 - 2.8x
    peopleZoomTime: 7.0,             // 2 - 12s
    leftOpacity: 100,                // 0 - 100%
    rightOpacity: 100,               // 0 - 100%

    // Outdoor Scene & Selective Blur
    outdoorReveal: 8.0,              // 3 - 14s
    outdoorZoom: 1.08,               // 1.0 - 1.35x
    sceneDirection: 'iris',          // 'iris' | 'up' | 'down'
    teamReveal: 4.0,
    teamDirection: 'down',
    blurStrength: 7,                 // 0 - 24px
    blurMode: 'background',          // 'background' | 'edges' | 'custom' | 'none'
    blurRegionX: 5,                  // %
    blurRegionY: 5,                  // %
    blurRegionW: 30,                 // %
    blurRegionH: 45,                 // %
    surfaceType: 'none',             // 'none' | 'soil' | 'snow' | 'clouds'

    // Global Playback
    duration: 13.6,                  // Automatically computed from opening + tear + continuation
    playbackSpeed: 1.0
  };

  window.REGAARDER_ORIGINS_CONFIG = Object.assign({}, DEFAULT_CONFIG);

  const ENGINE_SVGS = {
    layers: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
    imageIcon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    flame: '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
    wand: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 4-1 1 4 4 1-1a2.83 2.83 0 1 0-4-4Z"></path><path d="m13 6-8.5 8.5a2.12 2.12 0 1 0 3 3L16 9"></path></svg>',
    chevronDown: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>',
    rotateCcw: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>',
    play: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>'
  };

  // ==========================================================================
  // 1. ASSET CACHE & DETERMINISTIC MATH HELPERS
  // ==========================================================================
  const _imgCache = {};
  let _lastAnimTime = 0;

  function getCachedImage(url) {
    if (!url) return null;
    if (_imgCache[url]) return _imgCache[url];
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const stage = document.getElementById('tpl-modal-preview-stage');
      if (stage && stage.querySelector(`#regaarder-origins-viewport-${TEMPLATE_ID}`)) {
        stepOriginsSlowRevealAnimation(stage, TEMPLATE_ID, _lastAnimTime, getConfig());
      }
    };
    img.src = url;
    _imgCache[url] = img;
    return img;
  }

  function isReady(img) {
    return Boolean(img && img.complete && img.naturalWidth > 0);
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function smoothstep(x) {
    const c = clamp(x, 0, 1);
    return c * c * (3 - 2 * c);
  }

  function motionEase(v, type) {
    const c = clamp(v, 0, 1);
    if (type === 'linear') return c;
    if (type === 'in') return c * c;
    if (type === 'out') return 1 - (1 - c) * (1 - c);
    if (type === 'accelerate') {
      return c < 0.5 ? c * 0.8 : 0.4 + 0.6 * (1 - Math.pow(1 - (c - 0.5) / 0.5, 2));
    }
    return c * c * (3 - 2 * c);
  }

  function detNoise(a, b) {
    const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return v - Math.floor(v);
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#c6324a').replace('#', '').trim();
    const r = parseInt(clean.slice(0, 2), 16) || 198;
    const g = parseInt(clean.slice(2, 4), 16) || 50;
    const b = parseInt(clean.slice(4, 6), 16) || 74;
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
  }

  function getConfig(overrideData) {
    if (overrideData && typeof overrideData === 'object') {
      return Object.assign({}, DEFAULT_CONFIG, window.REGAARDER_ORIGINS_CONFIG || {}, overrideData);
    }
    if (typeof window.tplGetContextualData === 'function') {
      const d = window.tplGetContextualData(TEMPLATE_ID);
      if (d && typeof d === 'object') {
        return Object.assign({}, DEFAULT_CONFIG, d);
      }
    }
    return Object.assign({}, DEFAULT_CONFIG, window.REGAARDER_ORIGINS_CONFIG || {});
  }

  function computePhaseTimes(cfg) {
    const speed = clamp(Number(cfg.spreadSpeed) || 55, 1, 100);
    const revealSeconds = Math.max(1.6, 10 - speed * 0.08);
    const openingSec = clamp(Number(cfg.openingDuration) || 8.0, 4.0, 16.0);
    const tearEnd = cfg.enableTearReveal !== false ? (openingSec + revealSeconds) : openingSec;

    if (!cfg.continuationEnabled) {
      return {
        openingSec,
        revealSeconds,
        tear: tearEnd,
        totalDuration: tearEnd
      };
    }

    const zoomDuration = Math.max(1.2, 6 - (clamp(Number(cfg.zoomSpeed) || 55, 1, 100) * 0.05));
    const lamp = tearEnd + zoomDuration * 0.5;
    const dark = tearEnd + zoomDuration + (Number(cfg.darkFade) || 2.0);
    const fire = dark + (Number(cfg.fireDelay) || 1.0);
    const people = fire + (Number(cfg.fireBuild) || 5.0) + (Number(cfg.peopleDelay) || 2.0);
    const outdoor = people + (Number(cfg.peopleFade) || 3.0) + (Number(cfg.peopleZoomTime) || 7.0) * 0.7;
    const totalDuration = outdoor + (Number(cfg.outdoorReveal) || 8.0) + 2.5;

    return {
      openingSec,
      revealSeconds,
      tear: tearEnd,
      zoomDuration,
      lamp,
      dark,
      fire,
      people,
      outdoor,
      totalDuration
    };
  }

  // ==========================================================================
  // 2. WEBGL / CPU LIVING FLAME ENGINE (Ported from Regaarder-Motion flame-engine.js)
  // ==========================================================================
  class RegaarderFlameRenderer {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 640;
      this.canvas.height = 360;
      this.gl = null;
      try {
        this.gl = this.canvas.getContext('webgl', {
          alpha: true,
          premultipliedAlpha: false,
          preserveDrawingBuffer: true,
          antialias: false
        });
      } catch (e) {
        this.gl = null;
      }
      if (!this.gl) {
        this.setupCPU();
        return;
      }
      const gl = this.gl;
      const vert = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
      const frag = `precision highp float;
uniform vec2 resolution;uniform float time,wildness,size,mode,wind;uniform vec3 tint;
float hash(vec3 p){p=fract(p*.3183099+vec3(.13,.31,.57));p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float n=0.,amp=.53;for(int i=0;i<4;i++){n+=amp*noise(p);p=p*2.03+vec3(2.1,7.3,1.8);amp*=.49;}return n;}
float field(vec2 uv,float base,float edge){float h=(base-uv.y)/(.23+size*.37);if(h<0.||h>1.5)return 0.;float tt=time*(.6+wildness*.65);float sway=(fbm(vec3(uv.x*4.,h*2.-tt*.6,tt*.15))-.5)*(.13+wildness*.3)*h;float xx=uv.x+sway+wind*h*.22;vec3 p=vec3(xx*8.,h*3.3-tt*1.8,tt*.26);vec2 warp=vec2(fbm(p+vec3(5,1,0)),fbm(p+vec3(1,7,3)))-.5;float n=fbm(p+vec3(warp*(.9+wildness*2.),0));float fine=noise(p*7.1+vec3(0,-tt*3.,0));float fuel=.35+.58*fbm(vec3(xx*11.,0,tt*.35));fuel*=edge;float v=fuel*exp(-h*1.4)+n*.92+fine*.09-h*.35;float density=smoothstep(.43,.72,v);density*=1.-smoothstep(.95,1.45,h);density*=smoothstep(0.,.035,h);return density;}
void main(){vec2 uv=vec2(gl_FragCoord.x/resolution.x,1.-gl_FragCoord.y/resolution.y);float sources=.75+.25*sin(uv.x*21.);if(mode<.5)sources=.35+.65*(exp(-pow((uv.x-.28)*7.,2.))+exp(-pow((uv.x-.62)*7.,2.)));if(mode>2.5&&mode<3.5)sources=1.15;float primary=field(uv,.665,sources);float edges=field(uv,1.09,(1.-smoothstep(.05,.28,uv.x))+smoothstep(.72,.95,uv.x));float d=max(primary,edges*.85);float temp=clamp(d*1.65,0.,1.);vec3 ember=tint*.35;vec3 hot=mix(tint,vec3(1.,.96,.73),smoothstep(.63,1.,temp));if(mode>.5&&mode<1.5){ember=tint*.2;hot=mix(tint,vec3(.87,.96,1.),smoothstep(.35,1.,temp));}vec3 rgb=mix(ember,hot,smoothstep(.1,.9,temp));float alpha=smoothstep(.02,.75,d)*.96;gl_FragColor=vec4(rgb,alpha);}`;
      try {
        const compile = (type, src) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
          return s;
        };
        this.program = gl.createProgram();
        gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vert));
        gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, frag));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
        gl.useProgram(this.program);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(this.program, 'a');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        this.u = {};
        ['resolution', 'time', 'wildness', 'size', 'mode', 'wind', 'tint'].forEach((n) => {
          this.u[n] = gl.getUniformLocation(this.program, n);
        });
      } catch (err) {
        this.gl = null;
        this.setupCPU();
      }
    }

    setupCPU() {
      this.canvas = document.createElement('canvas');
      this.canvas.width = 256;
      this.canvas.height = 144;
      this.cpu = this.canvas.getContext('2d');
    }

    render(seconds, cfg) {
      const fireSpeed = clamp(Number(cfg.fireSpeed) || 55, 1, 100);
      const wildness = clamp(Number(cfg.fireWildness) || 65, 0, 100);
      const fireSize = clamp(Number(cfg.fireSize) || 85, 0, 100);
      const wind = clamp(Number(cfg.fireWind) || 0, -50, 50);
      const style = cfg.fireStyle || 'classic';
      const col = String(cfg.fireColor || '#ff681f').replace('#', '');
      const r = (parseInt(col.slice(0, 2), 16) || 255) / 255;
      const g = (parseInt(col.slice(2, 4), 16) || 104) / 255;
      const b = (parseInt(col.slice(4, 6), 16) || 31) / 255;

      if (this.gl) {
        const gl = this.gl;
        gl.useProgram(this.program);
        gl.viewport(0, 0, 640, 360);
        gl.uniform2f(this.u.resolution, 640, 360);
        gl.uniform1f(this.u.time, seconds * (0.4 + fireSpeed / 75));
        gl.uniform1f(this.u.wildness, wildness / 100);
        gl.uniform1f(this.u.size, fireSize / 100);
        gl.uniform1f(this.u.wind, wind / 100);
        gl.uniform1f(this.u.mode, Math.max(0, ['classic', 'blue', 'vivid', 'intense', 'wall'].indexOf(style)));
        gl.uniform3f(this.u.tint, r, g, b);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        return this.canvas;
      }
      return null;
    }
  }

  let _flameEngineInstance = null;
  function getFlameEngine() {
    if (!_flameEngineInstance) _flameEngineInstance = new RegaarderFlameRenderer();
    return _flameEngineInstance;
  }

  // Offscreen buffers for masks & compositing
  const _buffers = {};
  function getBuffer(name, w = 960, h = 540) {
    if (!_buffers[name]) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      _buffers[name] = c;
    }
    if (_buffers[name].width !== w || _buffers[name].height !== h) {
      _buffers[name].width = w;
      _buffers[name].height = h;
    }
    return _buffers[name];
  }

  // ==========================================================================
  // 3. PROCEDURAL PAPER TEAR & COMPOSITING HELPERS
  // ==========================================================================
  function drawTearPath(ctx, cx, cy, rx, ry, seed) {
    ctx.beginPath();
    for (let i = 0; i <= 220; i++) {
      const a = (i / 220) * Math.PI * 2;
      const r = 1 + 0.13 * Math.sin(a * 19 + seed) + 0.075 * Math.sin(a * 53 + seed * 3) + 0.045 * Math.sin(a * 91);
      const x = cx + Math.cos(a) * rx * r;
      const y = cy + Math.sin(a) * ry * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawCoverImage(ctx, img, x, y, w, h, scale = 1, focusX = 0.5, focusY = 0.5) {
    if (!isReady(img)) return;
    const r = Math.max(w / img.naturalWidth, h / img.naturalHeight) * scale;
    ctx.drawImage(
      img,
      x + w / 2 - img.naturalWidth * r * focusX,
      y + h / 2 - img.naturalHeight * r * focusY,
      img.naturalWidth * r,
      img.naturalHeight * r
    );
  }

  function drawContainImage(ctx, img, x, y, w, h) {
    if (!isReady(img)) return;
    const r = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    ctx.drawImage(
      img,
      x + (w - img.naturalWidth * r) / 2,
      y + (h - img.naturalHeight * r) / 2,
      img.naturalWidth * r,
      img.naturalHeight * r
    );
  }

  function drawEyeStripShapePath(ctx, x, y, w, h, shapeKey) {
    ctx.beginPath();
    if (shapeKey === 'oval') {
      ctx.ellipse(x + w * 0.5, y + h * 0.5, w * 0.5, h * 0.46, 0, 0, Math.PI * 2);
      ctx.closePath();
      return;
    }
    const pts = EYE_CLIPS[shapeKey] || EYE_CLIPS.torn;
    pts.forEach(([px, py], idx) => {
      const vx = x + px * w;
      const vy = y + py * h;
      if (idx === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    });
    ctx.closePath();
  }

  function drawEmberParticles(ctx, seconds, strength, cfg) {
    const sparks = clamp(Number(cfg.fireSparks) || 55, 0, 100);
    if (strength <= 0 || sparks <= 0) return;
    const count = Math.floor(sparks * 1.3);
    const velocity = 0.5 + (Number(cfg.fireSpeed) || 55) / 100;
    const wild = (Number(cfg.fireWildness) || 65) / 100;
    const wind = Number(cfg.fireWind) || 0;
    const col = cfg.fireStyle === 'blue' ? '#a5ddff' : (cfg.fireColor || '#ff681f');

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < count; i++) {
      const life = (Math.max(0, seconds) * (0.1 + detNoise(i, 52) * 0.18) * velocity + detNoise(i, 53)) % 1;
      const age = life * (1.5 + detNoise(i, 59) * 2);
      const x0 = 190 + detNoise(i, 55) * 570;
      const y0 = 340 + detNoise(i, 56) * 13;
      const x = x0 + (detNoise(i, 57) - 0.5) * life * 80 + Math.sin(seconds * (0.7 + detNoise(i, 58)) + i) * life * wild * 45 + wind * life;
      const y = y0 - age * (45 + detNoise(i, 60) * 55) - age * age * 8;
      const alpha = (1 - life) * strength * (0.4 + detNoise(i, 62) * 0.6);
      const radius = 0.5 + detNoise(i, 63) * 1.6;

      ctx.globalAlpha = clamp(alpha, 0, 1);
      ctx.strokeStyle = col;
      ctx.lineWidth = radius;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - (detNoise(i, 57) - 0.5) * 3, y + radius * (2 + wild * 5));
      ctx.stroke();

      if (i % 6 === 0) {
        ctx.globalAlpha = clamp(alpha * 0.18, 0, 1);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawLivingFire(ctx, seconds, strength, cfg) {
    const fireAmount = clamp(Number(cfg.fireSize) || 85, 0, 100) / 100;
    if (strength <= 0 || fireAmount <= 0) return;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = clamp(strength, 0, 1);

    const flameEngine = getFlameEngine();
    const glCanvas = flameEngine.render(Math.max(0, seconds), cfg);
    if (glCanvas) {
      ctx.drawImage(glCanvas, 0, 0, 960, 540);
    }

    // Secondary sprite emitters for volumetric richness
    const fireImg = getCachedImage(cfg.fireSpriteUrl);
    if (isReady(fireImg)) {
      const v = 0.3 + (Number(cfg.fireSpeed) || 55) / 35;
      const emitters = [
        [270, 339, 1.0],
        [420, 350, 0.6],
        [570, 350, 1.05],
        [690, 354, 0.9]
      ];
      emitters.forEach(([ex, ey, esize], n) => {
        ctx.save();
        for (let k = 0; k < 2; k++) {
          const a = seconds * v * 1.7 + n * 2.21 + k * 1.71;
          const sw = 1 + Math.sin(a) * 0.13 + Math.sin(a * 2.7) * 0.05;
          const h = (80 + fireAmount * 220) * esize * strength * (0.86 + 0.15 * Math.sin(a * 0.8));
          const w = (42 + fireAmount * 95) * esize * sw;
          ctx.globalAlpha = clamp(strength * 0.35 * (0.62 + Math.sin(a + 2) * 0.1), 0, 1);
          ctx.save();
          ctx.translate(ex + (k - 0.5) * w * 0.35 + Math.sin(a) * 8, ey);
          ctx.transform(1, 0, Math.sin(a * 1.4) * 0.12, 1, 0, 0);
          ctx.drawImage(fireImg, -w / 2, -h, w, h);
          ctx.restore();
        }
        ctx.restore();
      });
    }

    // Ambient warm radial fire bloom
    ctx.globalAlpha = clamp(0.22 * strength * fireAmount, 0, 1);
    const glow = ctx.createRadialGradient(490, 385, 20, 490, 385, 430);
    glow.addColorStop(0, cfg.fireStyle === 'blue' ? '#338dff' : (cfg.fireColor || '#ff681f'));
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 960, 540);
    ctx.restore();

    drawEmberParticles(ctx, seconds, strength, cfg);
  }

  function applySelectiveBlur(ctx, mode, strength, cfg) {
    const blurPx = clamp(Number(strength) || 0, 0, 24);
    if (blurPx <= 0 || mode === 'none') return;

    const copy = getBuffer('blurCopy', 960, 540);
    const b = copy.getContext('2d');
    b.clearRect(0, 0, 960, 540);
    b.drawImage(ctx.canvas, 0, 0, 960, 540);

    const blurred = getBuffer('blurredLayer', 960, 540);
    const l = blurred.getContext('2d');
    l.globalCompositeOperation = 'source-over';
    l.clearRect(0, 0, 960, 540);
    l.save();
    l.filter = `blur(${blurPx}px)`;
    l.drawImage(copy, -blurPx, -blurPx, 960 + blurPx * 2, 540 + blurPx * 2);
    l.restore();

    const mask = getBuffer('blurMask', 960, 540);
    const m = mask.getContext('2d');
    m.clearRect(0, 0, 960, 540);

    const drawSoftSpot = (sx, sy, rx, ry, opacity) => {
      m.save();
      m.translate(sx, sy);
      m.scale(rx, ry);
      const g = m.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      g.addColorStop(0, `rgba(255,255,255,${opacity})`);
      g.addColorStop(0.45, `rgba(255,255,255,${opacity * 0.65})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      m.fillStyle = g;
      m.fillRect(-1, -1, 2, 2);
      m.restore();
    };

    if (mode === 'custom') {
      const rx = clamp(Number(cfg.blurRegionX) || 5, 0, 95) / 100;
      const ry = clamp(Number(cfg.blurRegionY) || 5, 0, 95) / 100;
      const rw = clamp(Number(cfg.blurRegionW) || 30, 5, 100) / 100;
      const rh = clamp(Number(cfg.blurRegionH) || 45, 5, 100) / 100;
      for (let i = 0; i < 6; i++) {
        drawSoftSpot(
          (rx + rw * (0.2 + i * 0.12)) * 960,
          (ry + rh * (0.45 + Math.sin(i * 2.1) * 0.12)) * 540,
          rw * 420,
          rh * 430,
          0.85
        );
      }
    } else {
      for (let i = 0; i < 8; i++) {
        drawSoftSpot(-30 + i * 29, 330 + i * 31, 150 + 17 * Math.sin(i * 2), 150, 0.9);
        drawSoftSpot(990 - i * 29, 345 + i * 28, 150 + 15 * Math.cos(i * 2), 155, 0.9);
      }
      for (let i = 0; i < 5; i++) {
        drawSoftSpot(70 + i * 205, 575 + Math.sin(i * 2) * 15, 165, 100, 0.55);
      }
    }

    l.globalCompositeOperation = 'destination-in';
    l.drawImage(mask, 0, 0);
    l.globalCompositeOperation = 'source-over';
    ctx.drawImage(blurred, 0, 0);
  }

  function drawSurfaceMaterialSweep(ctx, age, duration, cfg) {
    const type = cfg.surfaceType || 'none';
    if (type === 'none' || age < 0 || age >= duration) return;
    const preset = SURFACE_PRESETS[type] || SURFACE_PRESETS.soil;
    const half = duration / 2;
    const first = age <= half;
    const q = motionEase(first ? age / half : (age - half) / half, 'smooth');
    const edge = 540 * (1 - q);

    const paint = getBuffer('surfacePaint', 960, 540);
    const c = paint.getContext('2d');
    const mask = getBuffer('surfaceMask', 960, 540);
    const m = mask.getContext('2d');
    c.clearRect(0, 0, 960, 540);
    m.clearRect(0, 0, 960, 540);

    const contour = (x) => preset.roughness * (0.62 * Math.sin(x * 0.009) + 0.28 * Math.sin(x * 0.026 + 1.2) + 0.1 * Math.sin(x * 0.061));
    m.save();
    m.filter = `blur(${preset.feather}px)`;
    m.fillStyle = '#ffffff';
    m.beginPath();
    m.moveTo(-80, first ? 650 : -110);
    for (let x = -80; x <= 1040; x += 8) {
      m.lineTo(x, edge + contour(x));
    }
    m.lineTo(1040, first ? 650 : -110);
    m.closePath();
    m.fill();
    m.restore();

    c.save();
    c.fillStyle = preset.color;
    c.fillRect(0, 0, 960, 540);
    if (type === 'clouds') {
      const cloudsImg = getCachedImage(cfg.cloudsSpriteUrl);
      if (isReady(cloudsImg)) {
        c.globalAlpha = 0.85;
        c.drawImage(cloudsImg, 0, 0, 960, 540);
      }
    }
    c.restore();

    c.globalCompositeOperation = 'destination-in';
    c.drawImage(mask, 0, 0);
    c.globalCompositeOperation = 'source-over';
    ctx.drawImage(paint, 0, 0);
  }

  // ==========================================================================
  // 4. MASTER 960x540 CANVAS FRAME RENDERER
  // ==========================================================================
  function renderOriginsSlowRevealFrame(canvas, timeSec, overrideData) {
    if (!canvas) return;
    const cfg = getConfig(overrideData);
    const d = computePhaseTimes(cfg);
    const totalDur = Math.max(4, d.totalDuration);
    const speedMult = clamp(Number(cfg.playbackSpeed) || 1.0, 0.25, 2.5);
    const secs = clamp((Number(timeSec) || 0) * speedMult, 0, totalDur);

    const ctx = canvas.getContext('2d');
    const W = canvas.width || 960;
    const H = canvas.height || 540;
    ctx.save();
    ctx.scale(W / 960, H / 540);

    // Pre-warm core images
    const mapImg = getCachedImage(cfg.mapUrl);
    const adidasBarsImg = getCachedImage(cfg.adidasBarsUrl);
    const adidasWordImg = getCachedImage(cfg.adidasWordUrl);
    const pumaLockupImg = getCachedImage(cfg.pumaLockupUrl);
    const portraitImg = getCachedImage(cfg.portraitUrl);

    const activeRevealUrl = cfg.revealPreset === 'shoulder_doorway'
      ? cfg.shoulderUrl
      : cfg.revealPreset === 'outdoor_town'
      ? cfg.outdoorUrl
      : cfg.revealUrl;
    const revealImg = getCachedImage(activeRevealUrl);

    // ------------------------------------------------------------------------
    // PHASE A: OPENING SLOW REVEAL (0 -> d.openingSec) & ORGANIC TEARS (d.openingSec -> d.tear)
    // ------------------------------------------------------------------------
    if (!cfg.continuationEnabled || secs < d.tear) {
      let p = clamp(secs / d.openingSec, 0, 1);
      if (cfg.variantMode === 'rivalry') p = Math.min(1, p * 1.15);
      else if (cfg.variantMode === 'behind_name') p = p * p;

      const titleOpacity = 1 - smoothstep((p - 0.09) / 0.20);
      const logosOpacity = smoothstep((p - 0.18) / 0.32) * (clamp(Number(cfg.brandLogoOpacity) ?? 85, 0, 100) / 100);
      const portraitReveal = smoothstep((p - 0.42) / 0.45);
      const startOp = clamp(Number(cfg.portraitStartOpacity) ?? 8, 0, 100) / 100;
      const portraitOpacity = p < 0.42 ? 0 : (startOp + (1 - startOp) * portraitReveal);
      const stripOpacity = smoothstep((p - 0.65) / 0.22);
      const mapZoom = 1 + p * 0.12;
      const closeZoom = (cfg.variantMode === 'rivalry' ? 1.25 : 1.0) + smoothstep((secs - d.openingSec * 0.525) / (d.openingSec * 0.425)) * 0.72;

      // 1. Base Backdrop & Aerial Bavarian Town Map
      ctx.fillStyle = '#283d4f';
      ctx.fillRect(0, 0, 960, 540);
      if (isReady(mapImg)) {
        ctx.save();
        ctx.translate(480, 270);
        ctx.scale(mapZoom, mapZoom);
        ctx.filter = `saturate(${clamp(Number(cfg.mapSaturation) ?? 70, 0, 200) / 100})`;
        drawCoverImage(ctx, mapImg, -480, -270, 960, 540, 1, 0.5, 0.5);
        ctx.restore();
      }

      // 2. Atmospheric Color Wash & Inner Vignette
      const washOp = clamp(Number(cfg.washOpacity) ?? 27, 0, 100) / 100;
      if (washOp > 0) {
        ctx.fillStyle = hexToRgba(cfg.washColor || '#174a70', washOp);
        ctx.fillRect(0, 0, 960, 540);
      }
      const vigStrength = clamp(Number(cfg.vignetteStrength) ?? 67, 0, 100) / 100;
      if (vigStrength > 0) {
        const vig = ctx.createRadialGradient(480, 270, 180, 480, 270, 560);
        vig.addColorStop(0, 'rgba(8, 21, 35, 0)');
        vig.addColorStop(1, `rgba(8, 21, 35, ${0.85 * vigStrength})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, 960, 540);
      }

      // 3. Place Title (HERZOGENAURACH / THE RIVALRY / BEHIND THE NAME)
      if (cfg.showPlaceTitle !== false && titleOpacity > 0.005) {
        const pScale = clamp(Number(cfg.placeScale) || 1.0, 0.4, 2.2);
        const angleRad = ((Number(cfg.placeAngleDeg) ?? 4) * Math.PI) / 180;
        ctx.save();
        ctx.globalAlpha = titleOpacity;
        ctx.translate(480, 245);
        ctx.rotate(angleRad);
        ctx.scale(pScale, pScale);
        ctx.font = '800 50px "Inter", "Helvetica Neue", Arial, sans-serif';
        ctx.fillStyle = cfg.placeColor || '#f8fafc';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(8, 21, 35, 0.65)';
        ctx.shadowBlur = 18;
        ctx.fillText(String(cfg.placeText || 'HERZOGENAURACH'), 0, 0);
        ctx.restore();
      }

      // 4. Dual Brand Lockups (Adidas & PUMA)
      if (cfg.showBrandLogos !== false && logosOpacity > 0.005) {
        ctx.save();
        ctx.globalAlpha = logosOpacity;
        ctx.shadowColor = '#0b1c2b';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetY = 2;

        // Left Adidas Lockup
        const lScale = clamp(Number(cfg.leftLogoScale) || 1.0, 0.4, 2.0);
        ctx.save();
        ctx.translate(192, 270);
        ctx.scale(lScale, lScale);
        if (isReady(adidasBarsImg) && isReady(adidasWordImg)) {
          drawContainImage(ctx, adidasBarsImg, -100, -105, 200, 115);
          drawContainImage(ctx, adidasWordImg, -145, 22, 290, 74);
        } else if (isReady(adidasBarsImg)) {
          drawContainImage(ctx, adidasBarsImg, -135, -90, 270, 180);
        }
        ctx.restore();

        // Right PUMA Lockup
        const rScale = clamp(Number(cfg.rightLogoScale) || 1.0, 0.4, 2.0);
        ctx.save();
        ctx.translate(768, 270);
        ctx.scale(rScale, rScale);
        if (isReady(pumaLockupImg)) {
          // puma-lockup.svg is dark by default; render inverted crisp white like Regaarder-Motion
          const pumaBuf = getBuffer('pumaWhite', 360, 220);
          const pCtx = pumaBuf.getContext('2d');
          pCtx.clearRect(0, 0, 360, 220);
          pCtx.filter = 'brightness(0) invert(1)';
          drawContainImage(pCtx, pumaLockupImg, 10, 10, 340, 200);
          pCtx.filter = 'none';
          ctx.drawImage(pumaBuf, -165, -100, 330, 200);
        }
        ctx.restore();

        ctx.restore();
      }

      // 5. Archival Portrait + Eye Strip (with close-up zoom around 50% 45%)
      if (portraitOpacity > 0.005) {
        ctx.save();
        ctx.translate(480, 243);
        ctx.scale(closeZoom, closeZoom);
        ctx.translate(-480, -243);
        ctx.globalAlpha = portraitOpacity;

        if (isReady(portraitImg)) {
          ctx.save();
          const gs = clamp(Number(cfg.portraitGrayscale) ?? 100, 0, 100);
          const ct = clamp(Number(cfg.portraitContrast) ?? 115, 50, 200);
          ctx.filter = `grayscale(${gs}%) contrast(${ct}%)`;
          const pw = 960 * 0.76;
          const ph = 540 * 1.16;
          const px = 960 * 0.12;
          const py = 0;
          drawContainImage(ctx, portraitImg, px, py, pw, ph);
          ctx.restore();
        }

        // Eye Strip Overlay
        if (stripOpacity > 0.005) {
          const ex = (clamp(Number(cfg.eyeX) ?? 37, 0, 95) / 100) * 960;
          const ey = (clamp(Number(cfg.eyeY) ?? 36, 0, 95) / 100) * 540;
          const ew = (clamp(Number(cfg.eyeWidth) ?? 29, 4, 80) / 100) * 960;
          const eh = (clamp(Number(cfg.eyeHeight) ?? 9, 2, 45) / 100) * 540;
          const erot = ((Number(cfg.eyeRotation) ?? 4) * Math.PI) / 180;
          const eInt = clamp(Number(cfg.eyeIntensity) ?? 55, 0, 100) / 100;
          const eColor = cfg.eyeColor || '#c6324a';
          const eShape = cfg.eyeShape || 'torn';
          const eBlend = cfg.eyeBlend || 'bleed';

          ctx.save();
          ctx.globalAlpha = portraitOpacity * stripOpacity;
          if (eBlend === 'multiply' || eBlend === 'screen') {
            ctx.globalCompositeOperation = eBlend;
          }
          ctx.translate(ex + ew / 2, ey + eh / 2);
          ctx.rotate(erot);
          ctx.translate(-(ex + ew / 2), -(ey + eh / 2));

          drawEyeStripShapePath(ctx, ex, ey, ew, eh, eShape);
          ctx.clip();

          if (eBlend !== 'solid' && isReady(mapImg)) {
            // Map texture bleed inside the eye strip
            drawCoverImage(ctx, mapImg, ex - ew * 1.2, ey - eh * 1.2, ew * 3.4, eh * 3.4, 1, 0.5, 0.5);
            ctx.fillStyle = hexToRgba(eColor, eInt);
            ctx.fillRect(ex - 20, ey - 20, ew + 40, eh + 40);
          } else {
            ctx.fillStyle = hexToRgba(eColor, eBlend === 'solid' ? Math.max(0.85, eInt) : eInt);
            ctx.fillRect(ex - 20, ey - 20, ew + 40, eh + 40);
          }
          ctx.restore();
        }

        ctx.restore();
      }

      // 6. Organic Paper Tears Spread Reveal (secs >= d.openingSec)
      if (cfg.enableTearReveal !== false && secs > d.openingSec && isReady(revealImg)) {
        const q = clamp((secs - d.openingSec) / d.revealSeconds, 0, 1);
        if (q > 0) {
          const tearLayer = getBuffer('tearLayer', 960, 540);
          const tCtx = tearLayer.getContext('2d');
          tCtx.clearRect(0, 0, 960, 540);

          const zoom = 1 + 0.1 * q;
          tCtx.save();
          tCtx.translate(480, 270);
          tCtx.scale(zoom, zoom);
          drawCoverImage(tCtx, revealImg, -480, -270, 960, 540, 1, 0.5, 0.5);
          tCtx.restore();

          const tearMask = getBuffer('tearMask', 960, 540);
          const mCtx = tearMask.getContext('2d');
          mCtx.globalAlpha = 1;
          mCtx.clearRect(0, 0, 960, 540);
          mCtx.fillStyle = '#ffffff';

          const originX = (clamp(Number(cfg.tearOriginX) ?? 50, 5, 95) / 100) * 960;
          const originY = (clamp(Number(cfg.tearOriginY) ?? 50, 5, 95) / 100) * 540;
          const growth = Math.pow(q, 1.45);
          const primaryCount = clamp(Number(cfg.tearCount) || 7, 1, 14);
          const microCount = clamp(Number(cfg.microTearCount) ?? 90, 0, 150);

          for (let n = 0; n < primaryCount; n++) {
            const x = originX + (detNoise(n, 1) - 0.5) * 58;
            const y = originY + (detNoise(n, 2) - 0.5) * 45;
            const start = n * 0.013;
            const local = clamp((q - start) / (1 - start), 0, 1);
            if (local <= 0) continue;
            const r = 2 + Math.pow(local, 1.48) * 760;
            drawTearPath(
              mCtx,
              x,
              y,
              r * (0.86 + detNoise(n, 3) * 0.24),
              r * (0.58 + detNoise(n, 4) * 0.18),
              n + 1
            );
          }

          for (let n = 0; n < microCount; n++) {
            const a = detNoise(n, 11) * Math.PI * 2;
            const rr = 2 + growth * 760;
            const x = originX + Math.cos(a) * rr * (0.86 + detNoise(n, 15) * 0.13);
            const y = originY + Math.sin(a) * rr * (0.60 + detNoise(n, 14) * 0.10);
            drawTearPath(
              mCtx,
              x,
              y,
              1 + q * detNoise(n, 16) * 13,
              1 + q * detNoise(n, 17) * 10,
              n
            );
          }

          if (q > 0.97) {
            mCtx.globalAlpha = smoothstep((q - 0.97) / 0.03);
            mCtx.fillRect(0, 0, 960, 540);
          }

          tCtx.globalCompositeOperation = 'destination-in';
          tCtx.drawImage(tearMask, 0, 0);
          tCtx.globalCompositeOperation = 'source-over';

          ctx.drawImage(tearLayer, 0, 0);
        }
      }

      // 7. Documentary Lower Caption
      if (cfg.showCaption !== false && cfg.captionText) {
        ctx.save();
        ctx.font = '600 10px "Inter", sans-serif';
        ctx.fillStyle = 'rgba(240, 242, 245, 0.65)';
        ctx.letterSpacing = '3px';
        ctx.fillText(String(cfg.captionText), 38, 512);
        ctx.restore();
      }

      ctx.restore();
      return;
    }

    // ------------------------------------------------------------------------
    // PHASE B: MULTI-STAGE STORY CONTINUATION (secs >= d.tear)
    // Shoulder Zoom -> Desk Lamp Light -> Living Fire -> Dual Silhouettes -> Outdoor
    // ------------------------------------------------------------------------
    const shoulderImg = getCachedImage(cfg.shoulderUrl);
    const deskLampImg = getCachedImage(cfg.deskLampUrl);
    const leftPortImg = getCachedImage(cfg.leftPortraitUrl);
    const rightPortImg = getCachedImage(cfg.rightPortraitUrl);
    const outdoorImg = getCachedImage(cfg.outdoorUrl);
    const standingImg = getCachedImage(cfg.standingUrl);
    const youngManImg = getCachedImage(cfg.youngManUrl);

    const z = smoothstep((secs - d.tear) / d.zoomDuration);
    const dark = smoothstep((secs - d.lamp) / Math.max(0.1, d.dark - d.lamp));

    ctx.fillStyle = '#050607';
    ctx.fillRect(0, 0, 960, 540);

    // 1. Shoulder Zoom Doorway
    if (1 - dark > 0.005 && isReady(shoulderImg)) {
      ctx.save();
      ctx.globalAlpha = 1 - dark;
      const targetZoom = clamp(Number(cfg.zoomAmount) || 3.1, 1.2, 5.0);
      drawCoverImage(ctx, shoulderImg, 0, 0, 960, 540, 1.1 + z * (targetZoom - 1), 0.5 + z * 0.08, 0.5 - z * 0.03);
      ctx.restore();
    }

    const lampProgress = smoothstep((secs - d.lamp) / Math.max(0.2, Number(cfg.lightFade) || 3.0));
    const sceneScale = 0.7 + ((Number(cfg.sceneZoom) || 1.15) - 0.7) * smoothstep((secs - d.lamp) / 8);
    const peopleProgress = smoothstep((secs - d.people) / Math.max(0.2, Number(cfg.peopleFade) || 3.0)) * (clamp(Number(cfg.peopleVisibility) ?? 75, 0, 100) / 100);

    ctx.save();
    const faceZoom = 1 + ((Number(cfg.peopleZoom) || 2.25) - 1) * smoothstep((secs - d.people) / Math.max(0.5, Number(cfg.peopleZoomTime) || 7.0));
    ctx.translate(540, 220);
    ctx.scale(faceZoom, faceZoom);
    ctx.translate(-540, -220);
    ctx.translate(480, 330);
    ctx.scale(sceneScale, sceneScale);
    ctx.translate(-480, -330);

    // 2. Dual Silhouettes / Faces Behind Fire
    if (peopleProgress > 0.005) {
      ctx.save();
      const pSize = clamp(Number(cfg.peopleSize) || 110, 50, 160) / 100;
      [[0, leftPortImg, cfg.leftOpacity], [1, rightPortImg, cfg.rightOpacity]].forEach(([side, im, sideOp]) => {
        if (!isReady(im)) return;
        const sideEase = side ? smoothstep((secs - d.people - 0.45) / Math.max(0.2, Number(cfg.peopleFade) || 3.0)) : 1;
        ctx.globalAlpha = clamp(peopleProgress * (clamp(Number(sideOp) ?? 100, 0, 100) / 100) * sideEase, 0, 1);
        const w = (side ? 450 : 390) * pSize;
        const h = 550 * pSize;
        const x = side ? 405 : 205;
        const y = -55;
        if (im.src.includes('faces-v3.png') || im.src.includes('pair-v2.png')) {
          const half = im.naturalWidth / 2;
          ctx.drawImage(im, side * half, 0, half, im.naturalHeight, x, y, w, h);
        } else {
          drawContainImage(ctx, im, x, y, w, h);
        }
      });
      ctx.restore();
    }

    // 3. Living Fire Engine
    const fireBuild = smoothstep((secs - d.fire) / Math.max(0.2, Number(cfg.fireBuild) || 5.0));
    drawLivingFire(ctx, secs - d.fire, fireBuild, cfg);

    // 4. Desk & Lamp Awakening
    const flickerAmt = clamp(Number(cfg.lightFlicker) ?? 12, 0, 50) / 100;
    const lightAmt = (clamp(Number(cfg.lightBrightness) ?? 85, 0, 100) / 100) * lampProgress * (1 - flickerAmt * (0.5 + 0.25 * Math.sin(secs * 12) + 0.25 * Math.sin(secs * 21.3)));
    if (lampProgress > 0.005 && isReady(deskLampImg)) {
      const ds = clamp(Number(cfg.deskSize) || 100, 50, 160) / 100;
      ctx.save();
      ctx.globalAlpha = lampProgress;
      ctx.filter = `brightness(${0.55 + lightAmt * 0.65})`;
      const body = motionEase((secs - d.lamp - 1.2) / Math.max(0.2, Number(cfg.deskReveal) || 3.0), 'smooth');
      ctx.beginPath();
      if (cfg.deskDirection === 'up') {
        ctx.rect(0, 540 - body * 540, 960, body * 540);
      } else {
        ctx.rect(0, 0, 960, 345 + body * 220);
      }
      ctx.clip();
      const drift = 70 * smoothstep((secs - d.people) / Math.max(0.5, Number(cfg.peopleZoomTime) || 7.0));
      ctx.drawImage(deskLampImg, 480 - 350 * ds + drift * 0.3, 128 - (ds - 1) * 150 + drift * 0.2, 700 * ds, 430 * ds);
      ctx.restore();
    }

    ctx.restore();

    // 5. Outdoor Unfold, Standing Figures & Selective Region Blur
    if (secs >= d.outdoor && isReady(outdoorImg)) {
      const age = secs - d.outdoor;
      const outRevDur = Math.max(1.0, Number(cfg.outdoorReveal) || 8.0);
      const q = clamp(age / outRevDur, 0, 1);
      const reveal = smoothstep((q - 0.06) / 0.82);

      const bgBuf = getBuffer('outdoorBg', 960, 540);
      const bCtx = bgBuf.getContext('2d');
      bCtx.clearRect(0, 0, 960, 540);
      bCtx.fillStyle = '#6197cb';
      bCtx.fillRect(0, 0, 960, 540);
      bCtx.drawImage(outdoorImg, 0, 85, 960, 455);
      if (cfg.blurMode === 'background') {
        applySelectiveBlur(bCtx, 'edges', cfg.blurStrength, cfg);
      }

      const outLayer = getBuffer('outdoorLayer', 960, 540);
      const oCtx = outLayer.getContext('2d');
      oCtx.clearRect(0, 0, 960, 540);
      oCtx.save();
      const oZoom = 1 + ((Number(cfg.outdoorZoom) || 1.08) - 1) * q;
      oCtx.translate(480, 280);
      oCtx.scale(oZoom, oZoom);
      oCtx.translate(-480, -280);
      oCtx.drawImage(bgBuf, 0, 0);
      oCtx.restore();

      const outMask = getBuffer('outdoorMask', 960, 540);
      const omCtx = outMask.getContext('2d');
      omCtx.clearRect(0, 0, 960, 540);
      omCtx.fillStyle = '#ffffff';
      if (cfg.sceneDirection === 'up') {
        omCtx.fillRect(0, 540 * (1 - reveal), 960, 540 * reveal);
      } else if (cfg.sceneDirection === 'down') {
        omCtx.fillRect(0, 0, 960, 540 * reveal);
      } else if (q > 0.96) {
        omCtx.fillRect(0, 0, 960, 540);
      } else {
        drawTearPath(omCtx, 440, 270, 12 + reveal * 850, 18 + reveal * 550, 7);
      }

      oCtx.globalCompositeOperation = 'destination-in';
      oCtx.drawImage(outMask, 0, 0);
      oCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(outLayer, 0, 0);

      // Standing figures
      if (isReady(standingImg)) {
        const grow = smoothstep(q / 0.8);
        const size = 0.22 + 0.78 * grow;
        const fullH = 435 * size;
        const leftX = 440 - 92 * size;
        const top = 121 - grow * 65;
        const tRev = Math.max(0.5, Number(cfg.teamReveal) || 4.0);

        // Left figure
        const pLeft = smoothstep(age / tRev);
        if (pLeft > 0) {
          ctx.save();
          ctx.globalAlpha = smoothstep(q / 0.09);
          ctx.beginPath();
          ctx.rect(leftX - 2, top - 2, 158 * size + 4, fullH * pLeft + 4);
          ctx.clip();
          ctx.drawImage(standingImg, 0.20 * standingImg.naturalWidth, 0, 0.31 * standingImg.naturalWidth, standingImg.naturalHeight, leftX, top, 158 * size, fullH);
          ctx.restore();
        }

        // Right figure
        const pRight = smoothstep((age - outRevDur * 0.18) / tRev);
        if (pRight > 0) {
          ctx.save();
          ctx.globalAlpha = smoothstep((q - 0.18) / 0.2);
          ctx.beginPath();
          ctx.rect(leftX + 148 * size - 2, top + 9 * size - 2, 158 * size + 4, fullH * pRight + 4);
          ctx.clip();
          if (isReady(youngManImg)) {
            const ratio = fullH / youngManImg.naturalHeight;
            ctx.drawImage(youngManImg, leftX + 148 * size + (158 * size - youngManImg.naturalWidth * ratio) / 2, top + 9 * size, youngManImg.naturalWidth * ratio, fullH);
          } else {
            ctx.drawImage(standingImg, 0.51 * standingImg.naturalWidth, 0, 0.29 * standingImg.naturalWidth, standingImg.naturalHeight, leftX + 148 * size, top + 9 * size, 158 * size, fullH);
          }
          ctx.restore();
        }
      }

      // Residual foreground fire veil during outdoor transition
      const fireVeil = (1 - smoothstep((q - 0.2) / 0.75)) * 0.75;
      if (fireVeil > 0.01) {
        drawLivingFire(ctx, secs - d.fire, fireVeil, cfg);
      }

      if (cfg.blurMode === 'edges' || cfg.blurMode === 'custom') {
        applySelectiveBlur(ctx, cfg.blurMode, cfg.blurStrength, cfg);
      }

      drawSurfaceMaterialSweep(ctx, age, Math.min(3.5, outRevDur * 0.5), cfg);
    }

    ctx.restore();
  }

  // Timeline / 3D Inspector Canvas Bridge
  function renderOriginsSlowRevealCanvas(ctx2d, clip, t, cw, ch) {
    if (!ctx2d || !ctx2d.canvas) return;
    const data = (clip && clip.fxScene && clip.fxScene.data) ? clip.fxScene.data : getConfig();
    const offscreen = getBuffer('timelineRender', 960, 540);
    renderOriginsSlowRevealFrame(offscreen, t, data);
    ctx2d.drawImage(offscreen, 0, 0, cw || ctx2d.canvas.width, ch || ctx2d.canvas.height);
  }

  // ==========================================================================
  // 5. STAGE HTML & INTERACTIVE OBJECT HIT TARGETS (Universal Contextual Toolbar)
  // ==========================================================================
  function buildOriginsSlowRevealHtml(tplId, overrideData) {
    const id = tplId || TEMPLATE_ID;
    const cfg = getConfig(overrideData);
    const ex = clamp(Number(cfg.eyeX) ?? 37, 0, 95);
    const ey = clamp(Number(cfg.eyeY) ?? 36, 0, 95);
    const ew = clamp(Number(cfg.eyeWidth) ?? 29, 4, 80);
    const eh = clamp(Number(cfg.eyeHeight) ?? 9, 2, 45);
    const erot = Number(cfg.eyeRotation) ?? 4;

    return `
      <div id="regaarder-origins-viewport-${id}" class="rg-origins-stage-root" style="position:relative;width:100%;height:100%;background:#101113;overflow:hidden;user-select:none;">
        <canvas
          id="regaarder-origins-canvas-${id}"
          width="960"
          height="540"
          style="width:100%;height:100%;object-fit:contain;display:block;pointer-events:none;"
        ></canvas>

        <!-- Semantic Interactive Stage Hit Targets for Universal Contextual Toolbar -->
        <div class="rg-origins-hit-layer" style="position:absolute;inset:0;z-index:12;">
          <div data-origins-obj="origins_map" data-origins-variant="media" title="Aerial Map" style="position:absolute;inset:0;cursor:pointer;"></div>

          <div data-origins-obj="origins_adidas" data-origins-variant="object3d" title="Left Brand Lockup" style="position:absolute;left:5%;top:30%;width:28%;height:38%;cursor:pointer;"></div>

          <div data-origins-obj="origins_puma" data-origins-variant="object3d" title="Right Brand Lockup" style="position:absolute;left:67%;top:30%;width:28%;height:38%;cursor:pointer;"></div>

          <div data-origins-obj="origins_portrait" data-origins-variant="media" title="Archival Portrait" style="position:absolute;left:24%;top:8%;width:52%;height:84%;cursor:pointer;"></div>

          <div data-origins-obj="origins_title" data-origins-variant="text" title="Headline" style="position:absolute;left:18%;top:38%;width:64%;height:14%;transform:rotate(${erot}deg);cursor:pointer;"></div>

          <div data-origins-obj="origins_eye" data-origins-variant="shape" title="Eye Strip" style="position:absolute;left:${ex}%;top:${ey}%;width:${ew}%;height:${eh}%;transform:rotate(${erot}deg);cursor:pointer;"></div>

          <div data-origins-obj="origins_tear" data-origins-variant="media" title="Tear Reveal Image" style="position:absolute;left:42%;top:42%;width:16%;height:16%;pointer-events:none;"></div>
          <div data-origins-obj="origins_lamp" data-origins-variant="object3d" title="Desk Lamp" style="position:absolute;left:22%;top:28%;width:56%;height:62%;pointer-events:none;"></div>
          <div data-origins-obj="origins_fire" data-origins-variant="animation" title="Living Flame" style="position:absolute;left:15%;top:36%;width:70%;height:54%;pointer-events:none;"></div>
        </div>

        <!-- Hidden File Inputs for Universal Contextual Toolbar "Replace" Command -->
        <div style="display:none;">
          <input type="file" id="rg-origins-upload-map" accept="image/*" />
          <input type="file" id="rg-origins-upload-adidas" accept="image/*" />
          <input type="file" id="rg-origins-upload-puma" accept="image/*" />
          <input type="file" id="rg-origins-upload-portrait" accept="image/*" />
          <input type="file" id="rg-origins-upload-reveal" accept="image/*" />
          <input type="file" id="rg-origins-upload-lamp" accept="image/*" />
          <input type="file" id="rg-origins-upload-fire" accept="image/*" />
        </div>
      </div>
    `;
  }

  function syncHitTargetBounds(stageEl, cfg) {
    if (!stageEl) return;
    const eyeEl = stageEl.querySelector('[data-origins-obj="origins_eye"]');
    if (eyeEl) {
      eyeEl.style.left = `${clamp(Number(cfg.eyeX) ?? 37, 0, 95)}%`;
      eyeEl.style.top = `${clamp(Number(cfg.eyeY) ?? 36, 0, 95)}%`;
      eyeEl.style.width = `${clamp(Number(cfg.eyeWidth) ?? 29, 4, 80)}%`;
      eyeEl.style.height = `${clamp(Number(cfg.eyeHeight) ?? 9, 2, 45)}%`;
      eyeEl.style.transform = `rotate(${Number(cfg.eyeRotation) ?? 4}deg)`;
    }
    const titleEl = stageEl.querySelector('[data-origins-obj="origins_title"]');
    if (titleEl) {
      titleEl.style.transform = `rotate(${Number(cfg.placeAngleDeg) ?? 4}deg)`;
    }
  }

  function bindStageInteractions(stageEl) {
    if (!stageEl || stageEl._rgOriginsStageBound) return;
    stageEl._rgOriginsStageBound = true;

    let draggingEye = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let origEyeX = 37;
    let origEyeY = 36;

    stageEl.addEventListener('pointerdown', (e) => {
      const hitEl = e.target.closest('[data-origins-obj]');
      if (!hitEl) {
        if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.hide === 'function') {
          window.RegaarderContextualToolbar.hide();
        }
        return;
      }

      const objKey = hitEl.getAttribute('data-origins-obj');
      const variant = hitEl.getAttribute('data-origins-variant') || 'media';

      // Clicking the background map deselects foreground object selection unless explicitly chosen from switcher
      if (objKey === 'origins_map' && e.detail === 1) {
        const cfg = getConfig();
        if (cfg.selectedStageObject && cfg.selectedStageObject !== 'origins_map') {
          updateConfigKey('selectedStageObject', '');
          if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.hide === 'function') {
            window.RegaarderContextualToolbar.hide();
          }
          return;
        }
      }

      updateConfigKey('selectedStageObject', objKey, false);

      // Jump playhead to an appropriate beat if currently at t=0 so the selected object is visible
      const cfg = getConfig();
      if (objKey === 'origins_eye' || objKey === 'origins_portrait') {
        if (_lastAnimTime < 3.5) {
          seekStageTime(6.2);
        }
      } else if (objKey === 'origins_adidas' || objKey === 'origins_puma') {
        if (_lastAnimTime < 1.2 || _lastAnimTime > 7.5) {
          seekStageTime(3.2);
        }
      }

      // Summon the Universal Contextual Toolbar per docs/design-system/TOOLBAR_GUIDELINES.md
      if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.showForObject === 'function') {
        window.RegaarderContextualToolbar.showForObject({
          contextType: 'template',
          objectKey: objKey,
          variant: variant,
          anchorElement: hitEl
        });
      }

      // Allow direct dragging of the Eye Strip on stage
      if (objKey === 'origins_eye') {
        draggingEye = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        origEyeX = Number(cfg.eyeX) ?? 37;
        origEyeY = Number(cfg.eyeY) ?? 36;
        try { hitEl.setPointerCapture(e.pointerId); } catch (_) {}
      }
    });

    stageEl.addEventListener('pointermove', (e) => {
      if (!draggingEye) return;
      const rect = stageEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dxPct = ((e.clientX - dragStartX) / rect.width) * 100;
      const dyPct = ((e.clientY - dragStartY) / rect.height) * 100;
      const nextX = Math.round(clamp(origEyeX + dxPct, 2, 85));
      const nextY = Math.round(clamp(origEyeY + dyPct, 2, 88));
      updateConfigMultiple({ eyeX: nextX, eyeY: nextY }, false);
      syncHitTargetBounds(stageEl, getConfig());
      if (window.RegaarderContextualToolbar && typeof window.RegaarderContextualToolbar.updatePosition === 'function') {
        window.RegaarderContextualToolbar.updatePosition();
      }
    });

    const stopDrag = () => {
      draggingEye = false;
    };
    stageEl.addEventListener('pointerup', stopDrag);
    stageEl.addEventListener('pointercancel', stopDrag);

    // Bind hidden file upload inputs for toolbar "Replace" action
    const fileMappings = [
      ['rg-origins-upload-map', 'mapUrl'],
      ['rg-origins-upload-adidas', 'adidasBarsUrl'],
      ['rg-origins-upload-puma', 'pumaLockupUrl'],
      ['rg-origins-upload-portrait', 'portraitUrl'],
      ['rg-origins-upload-reveal', 'revealUrl'],
      ['rg-origins-upload-lamp', 'deskLampUrl'],
      ['rg-origins-upload-fire', 'fireSpriteUrl']
    ];
    fileMappings.forEach(([inputId, configKey]) => {
      const inp = stageEl.querySelector(`#${inputId}`);
      if (!inp) return;
      inp.addEventListener('change', () => {
        const f = inp.files && inp.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target && ev.target.result) {
            const patch = { [configKey]: ev.target.result };
            if (configKey === 'revealUrl') patch.revealPreset = 'custom';
            updateConfigMultiple(patch, true);
          }
        };
        reader.readAsDataURL(f);
      });
    });
  }

  function seekStageTime(sec) {
    _lastAnimTime = Math.max(0, Number(sec) || 0);
    if (typeof topCustomizerState !== 'undefined' && topCustomizerState) {
      topCustomizerState.sceneElapsed = _lastAnimTime;
    }
    const stage = document.getElementById('tpl-modal-preview-stage');
    if (stage) {
      stepOriginsSlowRevealAnimation(stage, TEMPLATE_ID, _lastAnimTime, getConfig());
    }
  }

  function tplMountOriginsSlowRevealStage(stageEl, data) {
    if (!stageEl) return;
    const cfg = getConfig(data);
    stageEl.innerHTML = buildOriginsSlowRevealHtml(TEMPLATE_ID, cfg);
    bindStageInteractions(stageEl);
    const canvas = stageEl.querySelector(`#regaarder-origins-canvas-${TEMPLATE_ID}`);
    if (canvas) {
      if (_lastAnimTime <= 0.05) _lastAnimTime = 6.2; // Default preview frame showing portrait + eye strip
      renderOriginsSlowRevealFrame(canvas, _lastAnimTime, cfg);
    }
  }

  function stepOriginsSlowRevealAnimation(containerEl, tplId, t, data) {
    if (!containerEl) return;
    const id = tplId || TEMPLATE_ID;
    let canvas = containerEl.querySelector(`#regaarder-origins-canvas-${id}`);
    if (!canvas) {
      containerEl.innerHTML = buildOriginsSlowRevealHtml(id, data);
      bindStageInteractions(containerEl);
      canvas = containerEl.querySelector(`#regaarder-origins-canvas-${id}`);
    }
    _lastAnimTime = Number.isFinite(t) ? t : 0;
    if (canvas) {
      renderOriginsSlowRevealFrame(canvas, _lastAnimTime, data);
    }
  }

  // ==========================================================================
  // 6. STATE PERSISTENCE & LIVE UPDATE DISPATCH
  // ==========================================================================
  function updateConfigMultiple(patch, rebuildInspector = false) {
    const cur = getConfig();
    const next = Object.assign({}, cur, patch);
    const d = computePhaseTimes(next);
    next.duration = Number(d.totalDuration.toFixed(1));

    window.REGAARDER_ORIGINS_CONFIG = next;
    if (typeof window.tplUpdateContextualData === 'function') {
      Object.entries(patch).forEach(([k, v]) => {
        window.tplUpdateContextualData(TEMPLATE_ID, k, v);
      });
      window.tplUpdateContextualData(TEMPLATE_ID, 'duration', next.duration);
    }

    const stage = document.getElementById('tpl-modal-preview-stage');
    if (stage) {
      syncHitTargetBounds(stage, next);
      const canvas = stage.querySelector(`#regaarder-origins-canvas-${TEMPLATE_ID}`);
      if (canvas) {
        renderOriginsSlowRevealFrame(canvas, _lastAnimTime, next);
      }
    }

    if (rebuildInspector && typeof window.organizeUniversalTemplateControls === 'function') {
      window.organizeUniversalTemplateControls();
    }
  }

  function updateConfigKey(key, val, rebuildInspector = false) {
    updateConfigMultiple({ [key]: val }, rebuildInspector);
  }

  // External hook for Universal Contextual Toolbar Color / Opacity / Delete actions
  window.applyOriginsSlowRevealToolbarAction = function (actionType, objectKey, value) {
    const cfg = getConfig();
    if (actionType === 'color') {
      if (objectKey === 'origins_eye') updateConfigKey('eyeColor', value);
      else if (objectKey === 'origins_title') updateConfigKey('placeColor', value);
      else if (objectKey === 'origins_fire') updateConfigKey('fireColor', value);
      else if (objectKey === 'origins_lamp') updateConfigKey('lightColor', value);
      else updateConfigKey('washColor', value);
      return true;
    }
    if (actionType === 'opacity') {
      if (objectKey === 'origins_eye') updateConfigKey('eyeIntensity', value);
      else if (objectKey === 'origins_portrait') updateConfigKey('portraitStartOpacity', value);
      else if (objectKey === 'origins_adidas' || objectKey === 'origins_puma') updateConfigKey('brandLogoOpacity', value);
      else if (objectKey === 'origins_map') updateConfigKey('washOpacity', value);
      return true;
    }
    if (actionType === 'rotate') {
      if (objectKey === 'origins_eye') updateConfigKey('eyeRotation', ((Number(cfg.eyeRotation) || 0) + 5) % 360);
      else if (objectKey === 'origins_title') updateConfigKey('placeAngleDeg', ((Number(cfg.placeAngleDeg) || 0) + 5) % 360);
      return true;
    }
    return false;
  };

  // ==========================================================================
  // 7. REGAARDER 4-TAB CONTEXTUAL INSPECTOR BUILDER
  //    (Content, Motion, Look, Effects + Advanced Controls)
  // ==========================================================================
  function createRgSlider(label, key, min, max, step, unit, currentVal, onExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-slider-row';
    const numVal = Number.isFinite(Number(currentVal)) ? Number(currentVal) : min;
    const fmt = (v) => {
      if (step < 1) return `${Number(v).toFixed(step < 0.1 ? 2 : 1)}${unit}`;
      return `${Math.round(v)}${unit}`;
    };
    wrap.innerHTML = `
      <div class="rg-slider-header">
        <span>${label}</span>
        <span class="rg-slider-val">${fmt(numVal)}</span>
      </div>
      <input type="range" class="rg-range" min="${min}" max="${max}" step="${step}" value="${numVal}">
    `;
    const input = wrap.querySelector('input');
    const valSpan = wrap.querySelector('.rg-slider-val');
    input.addEventListener('input', () => {
      const v = parseFloat(input.value);
      valSpan.textContent = fmt(v);
      updateConfigKey(key, v);
      if (typeof onExtra === 'function') onExtra(v);
    });
    return wrap;
  }

  function createRgSelect(label, key, options, currentVal, onChangeExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-field-group';
    wrap.innerHTML = `
      <label class="rg-field-label">${label}</label>
      <div class="rg-anim-select-wrap">
        <select class="rg-anim-select" style="padding-left:12px;">
          ${options.map((o) => `<option value="${o.value}" ${o.value === currentVal ? 'selected' : ''}>${o.label}</option>`).join('')}
        </select>
        <span class="rg-anim-select-chevron">${ENGINE_SVGS.chevronDown}</span>
      </div>
    `;
    const sel = wrap.querySelector('select');
    sel.addEventListener('change', () => {
      updateConfigKey(key, sel.value);
      if (typeof onChangeExtra === 'function') onChangeExtra(sel.value);
    });
    return wrap;
  }

  function createRgColor(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-color-row';
    const hex = String(currentVal || '#c6324a').toUpperCase();
    wrap.innerHTML = `
      <span class="rg-color-label">${label}</span>
      <div class="rg-color-picker-wrap">
        <input type="color" class="rg-color-input" value="${currentVal || '#c6324a'}">
        <span class="rg-color-hex">${hex}</span>
      </div>
    `;
    const inp = wrap.querySelector('.rg-color-input');
    const hexSpan = wrap.querySelector('.rg-color-hex');
    inp.addEventListener('input', () => {
      hexSpan.textContent = inp.value.toUpperCase();
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createRgText(label, key, currentVal) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-field-group';
    wrap.innerHTML = `
      <label class="rg-field-label">${label}</label>
      <input type="text" class="rg-input" value="${String(currentVal || '').replace(/"/g, '&quot;')}">
    `;
    const inp = wrap.querySelector('.rg-input');
    inp.addEventListener('input', () => {
      updateConfigKey(key, inp.value);
    });
    return wrap;
  }

  function createRgToggle(label, key, checked, onExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-toggle-row';
    wrap.innerHTML = `
      <span class="rg-toggle-label">${label}</span>
      <input type="checkbox" class="rg-toggle-switch" ${checked ? 'checked' : ''}>
    `;
    const cb = wrap.querySelector('.rg-toggle-switch');
    cb.addEventListener('change', () => {
      updateConfigKey(key, cb.checked);
      if (typeof onExtra === 'function') onExtra(cb.checked);
    });
    return wrap;
  }

  function createRgMediaUploadRow(label, subLabel, thumbUrl, onUploadDataUrl) {
    const wrap = document.createElement('div');
    wrap.className = 'rg-media-asset-row';
    wrap.innerHTML = `
      <div class="rg-media-asset-info">
        <div class="rg-media-asset-icon" style="overflow:hidden;padding:0;">
          <img src="${thumbUrl}" alt="" style="width:100%;height:100%;object-fit:cover;display:block;" />
        </div>
        <div class="rg-media-asset-meta">
          <span class="rg-media-asset-name">${label}</span>
          <span class="rg-media-asset-sub">${subLabel}</span>
        </div>
      </div>
      <button type="button" class="rg-asset-replace-btn">
        ${ENGINE_SVGS.imageIcon}
        <span>Replace</span>
      </button>
    `;
    const btn = wrap.querySelector('.rg-asset-replace-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.style.display = 'none';
      document.body.appendChild(inp);
      inp.addEventListener('change', () => {
        const f = inp.files && inp.files[0];
        if (f) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target && ev.target.result) {
              onUploadDataUrl(ev.target.result);
            }
          };
          reader.readAsDataURL(f);
        }
        inp.remove();
      });
      inp.click();
    });
    return wrap;
  }

  window.tplBuildOriginsSlowRevealRegaarderPanes = function (panes, advDrawer, shellRefs) {
    if (!panes || !panes.content) return;
    const cfg = getConfig();
    const phaseInfo = computePhaseTimes(cfg);

    panes.content.innerHTML = '';
    panes.motion.innerHTML = '';
    // Keep Saved Look Presets card if already mounted at top of panes.look
    Array.from(panes.look.children).forEach((ch) => {
      if (!ch.querySelector || !ch.textContent.includes('Saved Look Presets')) {
        ch.remove();
      }
    });
    panes.effects.innerHTML = '';
    if (advDrawer) advDrawer.innerHTML = '';

    if (shellRefs && shellRefs.sceneToolbar) {
      const titleEl = shellRefs.sceneToolbar.querySelector('.rg-scene-title');
      if (titleEl) titleEl.textContent = 'Origins · Slow Reveal & Paper Tears';
    }

    // ========================================================================
    // TAB 1: CONTENT — VARIATION PRESETS, SCENE LAYERS, MEDIA & COPY
    // ========================================================================
    const variantCard = document.createElement('div');
    variantCard.className = 'rg-inspector-section';
    variantCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Explore the Sequence (3 Variations)</span>
        <span class="rg-section-subtitle">Select a documentary opening variation or jump directly to any stage beat.</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr;gap:6px;margin-bottom:10px;">
        ${Object.values(VARIANT_PRESETS).map((vp) => {
          const isAct = cfg.variantMode === vp.id;
          return `
            <button type="button" data-origins-variant-btn="${vp.id}" style="display:flex;align-items:center;justify-content:space-between;padding:9px 11px;border-radius:9px;border:1px solid ${isAct ? '#9b6bff' : 'rgba(255,255,255,0.08)'};background:${isAct ? 'rgba(130, 60, 240, 0.18)' : 'rgba(255,255,255,0.03)'};color:#f3effe;text-align:left;cursor:pointer;">
              <div>
                <div style="font-size:12px;font-weight:600;color:${isAct ? '#ffffff' : '#e2dcf5'};">${vp.title}</div>
                <div style="font-size:10.5px;color:#9a91af;margin-top:2px;">${vp.subtitle}</div>
              </div>
              <span style="font-size:10px;font-weight:700;color:#c4b5fd;background:rgba(130,60,240,0.24);padding:3px 7px;border-radius:5px;">${vp.badge}</span>
            </button>
          `;
        }).join('')}
      </div>
      <div class="rg-speed-pills" style="display:flex;flex-wrap:wrap;gap:4px;">
        ${STAGE_BEATS.map((b) => `
          <button type="button" class="rg-speed-pill ${cfg.activeBeatFilter === b.id ? 'is-active' : ''}" data-origins-beat-btn="${b.id}" data-seek="${b.seekSec}" style="flex:1;min-width:52px;">${b.shortLabel}</button>
        `).join('')}
      </div>
    `;
    variantCard.querySelectorAll('[data-origins-variant-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const vid = btn.getAttribute('data-origins-variant-btn');
        const vp = VARIANT_PRESETS[vid];
        if (!vp) return;
        updateConfigMultiple({
          variantMode: vp.id,
          placeText: vp.placeText,
          captionText: vp.captionText
        }, true);
        seekStageTime(5.8);
      });
    });
    variantCard.querySelectorAll('[data-origins-beat-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const bid = btn.getAttribute('data-origins-beat-btn');
        const seekSec = parseFloat(btn.getAttribute('data-seek') || '0');
        const needCont = ['zoom_lamp', 'fire_faces', 'outdoor'].includes(bid);
        const patch = { activeBeatFilter: bid };
        if (needCont && !cfg.continuationEnabled) patch.continuationEnabled = true;
        updateConfigMultiple(patch, true);
        seekStageTime(seekSec);
      });
    });
    panes.content.appendChild(variantCard);

    // Media Layers Replacement Card
    const mediaCard = document.createElement('div');
    mediaCard.className = 'rg-inspector-section';
    mediaCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Scene Media Layers</span>
        <span class="rg-section-subtitle">Separate portrait, map backdrop, brand lockups, and tear-reveal picture.</span>
      </div>
    `;
    mediaCard.appendChild(createRgMediaUploadRow('Archival Portrait', 'Foreground historical portrait', cfg.portraitUrl, (url) => {
      updateConfigKey('portraitUrl', url, true);
      seekStageTime(6.2);
    }));
    mediaCard.appendChild(createRgMediaUploadRow('Next Picture (Tear Reveal)', 'Revealed as organic tears spread', cfg.revealUrl, (url) => {
      updateConfigMultiple({ revealUrl: url, revealPreset: 'custom' }, true);
      seekStageTime(phaseInfo.openingSec + phaseInfo.revealSeconds * 0.55);
    }));
    mediaCard.appendChild(createRgSelect('Tear Reveal Picture Preset', 'revealPreset', [
      { value: 'reveal_classic', label: 'Archival Documentary Reveal (Default)' },
      { value: 'shoulder_doorway', label: 'Shoulder Doorway Close-Up' },
      { value: 'outdoor_town', label: 'Bavarian Town Landscape' },
      { value: 'custom', label: 'Custom Uploaded Picture' }
    ], cfg.revealPreset, () => {
      seekStageTime(phaseInfo.openingSec + phaseInfo.revealSeconds * 0.55);
    }));
    mediaCard.appendChild(createRgMediaUploadRow('Aerial Bavarian Map', 'Background town plate (Z=0)', cfg.mapUrl, (url) => {
      updateConfigKey('mapUrl', url, true);
    }));
    mediaCard.appendChild(createRgMediaUploadRow('Left Brand Lockup', 'Adidas bars & wordmark', cfg.adidasBarsUrl, (url) => {
      updateConfigKey('adidasBarsUrl', url, true);
      seekStageTime(3.2);
    }));
    mediaCard.appendChild(createRgMediaUploadRow('Right Brand Lockup', 'PUMA leaping-cat lockup', cfg.pumaLockupUrl, (url) => {
      updateConfigKey('pumaLockupUrl', url, true);
      seekStageTime(3.2);
    }));
    panes.content.appendChild(mediaCard);

    // Titles & Documentary Copy Card
    const copyCard = document.createElement('div');
    copyCard.className = 'rg-inspector-section';
    copyCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Titles & Documentary Copy</span>
        <span class="rg-section-subtitle">Customize the opening place headline, brand lockups, and lower study caption.</span>
      </div>
    `;
    copyCard.appendChild(createRgToggle('Show Opening Place Headline', 'showPlaceTitle', cfg.showPlaceTitle !== false));
    copyCard.appendChild(createRgText('Place Headline Text', 'placeText', cfg.placeText));
    copyCard.appendChild(createRgSlider('Headline Scale', 'placeScale', 0.5, 1.8, 0.05, 'x', cfg.placeScale));
    copyCard.appendChild(createRgSlider('Headline Tilt Angle', 'placeAngleDeg', -15, 15, 1, '°', cfg.placeAngleDeg));
    copyCard.appendChild(createRgToggle('Show Dual Brand Lockups', 'showBrandLogos', cfg.showBrandLogos !== false));
    copyCard.appendChild(createRgSlider('Left Lockup Scale', 'leftLogoScale', 0.4, 1.8, 0.05, 'x', cfg.leftLogoScale));
    copyCard.appendChild(createRgSlider('Right Lockup Scale', 'rightLogoScale', 0.4, 1.8, 0.05, 'x', cfg.rightLogoScale));
    copyCard.appendChild(createRgToggle('Show Lower Study Caption', 'showCaption', cfg.showCaption !== false));
    copyCard.appendChild(createRgText('Lower Caption Text', 'captionText', cfg.captionText));
    panes.content.appendChild(copyCard);

    // ========================================================================
    // TAB 2: MOTION — TEAR SPREAD SPEED, REVEAL DURATION & CONTINUATION CHOREOGRAPHY
    // ========================================================================
    const tearMotionCard = document.createElement('div');
    tearMotionCard.className = 'rg-inspector-section';
    const speedName = cfg.spreadSpeed < 30 ? 'Slow' : cfg.spreadSpeed > 75 ? 'Fast' : 'Natural';
    tearMotionCard.innerHTML = `
      <div class="rg-section-header">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="rg-section-title">How Fast Should It Spread?</span>
          <span id="rg-origins-speed-badge" style="font-size:11px;font-weight:600;color:#c4b5fd;">${speedName} (${phaseInfo.revealSeconds.toFixed(1)}s)</span>
        </div>
        <span class="rg-section-subtitle">Little paper tears open near the center, grow together, and reveal the next picture.</span>
      </div>
    `;
    tearMotionCard.appendChild(createRgToggle('Enable Organic Paper Tear Reveal', 'enableTearReveal', cfg.enableTearReveal !== false, () => {
      if (typeof window.organizeUniversalTemplateControls === 'function') window.organizeUniversalTemplateControls();
    }));
    tearMotionCard.appendChild(createRgSlider('Spread Speed', 'spreadSpeed', 1, 100, 1, '%', cfg.spreadSpeed, (v) => {
      const revS = Math.max(1.6, 10 - v * 0.08);
      const badge = tearMotionCard.querySelector('#rg-origins-speed-badge');
      if (badge) {
        const sLbl = v < 30 ? 'Slow' : v > 75 ? 'Fast' : 'Natural';
        badge.textContent = `${sLbl} (${revS.toFixed(1)}s)`;
      }
      seekStageTime((Number(cfg.openingDuration) || 8.0) + revS * 0.45);
    }));
    tearMotionCard.appendChild(createRgSlider('Opening Reveal Duration', 'openingDuration', 5, 16, 0.5, 's', cfg.openingDuration));
    tearMotionCard.appendChild(createRgSlider('Global Playback Speed', 'playbackSpeed', 0.4, 2.2, 0.05, 'x', cfg.playbackSpeed));

    const watchTearBtn = document.createElement('button');
    watchTearBtn.type = 'button';
    watchTearBtn.className = 'rg-action-pill-btn is-accent';
    watchTearBtn.style.cssText = 'width:100%;justify-content:center;padding:9px 14px;margin-top:8px;font-weight:600;';
    watchTearBtn.innerHTML = `${ENGINE_SVGS.play} <span>Watch the Tear Reveal</span>`;
    watchTearBtn.addEventListener('click', () => {
      seekStageTime((Number(cfg.openingDuration) || 8.0) + phaseInfo.revealSeconds * 0.42);
    });
    tearMotionCard.appendChild(watchTearBtn);
    panes.motion.appendChild(tearMotionCard);

    // Multi-Stage Story Continuation Card (Zoom -> Desk Light -> Fire -> Faces -> Outdoor)
    const contMotionCard = document.createElement('div');
    contMotionCard.className = 'rg-inspector-section';
    contMotionCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Multi-Stage Story Continuation</span>
        <span class="rg-section-subtitle">Extend the reveal into the Shoulder Zoom, Desk Lamp Awakening, Living Fire, and Outdoor Unfold.</span>
      </div>
    `;
    contMotionCard.appendChild(createRgToggle('Enable Full Story Continuation', 'continuationEnabled', Boolean(cfg.continuationEnabled), (checked) => {
      if (checked) seekStageTime(computePhaseTimes(getConfig()).lamp + 1.0);
      if (typeof window.organizeUniversalTemplateControls === 'function') window.organizeUniversalTemplateControls();
    }));
    if (cfg.continuationEnabled) {
      contMotionCard.appendChild(createRgSlider('Shoulder Doorway Zoom', 'zoomAmount', 1.5, 5.0, 0.1, 'x', cfg.zoomAmount, () => {
        seekStageTime(phaseInfo.tear + 1.2);
      }));
      contMotionCard.appendChild(createRgSlider('Shoulder Move Speed', 'zoomSpeed', 1, 100, 1, '%', cfg.zoomSpeed));
      contMotionCard.appendChild(createRgSlider('Desk Scene Zoom', 'sceneZoom', 1.0, 1.6, 0.05, 'x', cfg.sceneZoom));
      contMotionCard.appendChild(createRgSlider('Silhouette Face Zoom', 'peopleZoom', 1.0, 2.8, 0.1, 'x', cfg.peopleZoom));
      contMotionCard.appendChild(createRgSlider('Outdoor Unfold Duration', 'outdoorReveal', 3.0, 14.0, 0.2, 's', cfg.outdoorReveal));
      contMotionCard.appendChild(createRgSelect('Outdoor Opening Direction', 'sceneDirection', [
        { value: 'iris', label: 'Organic Ragged Iris Opening' },
        { value: 'up', label: 'Bottom-to-Top Wipe' },
        { value: 'down', label: 'Top-to-Bottom Wipe' }
      ], cfg.sceneDirection));
    }
    panes.motion.appendChild(contMotionCard);

    // ========================================================================
    // TAB 3: LOOK — PORTRAIT & EYE STRIP CUSTOMIZATION, MAP GRADE & LIGHTING
    // ========================================================================
    const eyeLookCard = document.createElement('div');
    eyeLookCard.className = 'rg-inspector-section';
    eyeLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Portrait & Eye Strip</span>
        <span class="rg-section-subtitle">Tap the eye strip on stage to drag it, or customize its color, torn shape, and blend style below.</span>
      </div>
    `;
    eyeLookCard.appendChild(createRgColor('Eye Strip Color', 'eyeColor', cfg.eyeColor));
    eyeLookCard.appendChild(createRgSelect('Strip Shape', 'eyeShape', [
      { value: 'torn', label: 'Torn Paper (Authentic)' },
      { value: 'bar', label: 'Clean Rectangle' },
      { value: 'slash', label: 'Diagonal Slash' },
      { value: 'oval', label: 'Soft Oval' }
    ], cfg.eyeShape, () => seekStageTime(6.5)));
    eyeLookCard.appendChild(createRgSelect('Color Style & Blend', 'eyeBlend', [
      { value: 'bleed', label: 'Background Map Bleed (Authentic)' },
      { value: 'multiply', label: 'Multiply Ink' },
      { value: 'screen', label: 'Screen Luminous' },
      { value: 'solid', label: 'Solid Ink' }
    ], cfg.eyeBlend, () => seekStageTime(6.5)));
    eyeLookCard.appendChild(createRgSlider('Strip Intensity', 'eyeIntensity', 0, 100, 1, '%', cfg.eyeIntensity, () => seekStageTime(6.5)));
    eyeLookCard.appendChild(createRgSlider('Portrait Starting Opacity', 'portraitStartOpacity', 0, 100, 1, '%', cfg.portraitStartOpacity));
    eyeLookCard.appendChild(createRgSlider('Portrait Grayscale', 'portraitGrayscale', 0, 100, 5, '%', cfg.portraitGrayscale));
    eyeLookCard.appendChild(createRgSlider('Portrait Contrast', 'portraitContrast', 60, 180, 5, '%', cfg.portraitContrast));
    panes.look.appendChild(eyeLookCard);

    const mapLookCard = document.createElement('div');
    mapLookCard.className = 'rg-inspector-section';
    mapLookCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Bavarian Map & Desk Lighting Grade</span>
        <span class="rg-section-subtitle">Adjust the aerial map color wash, headline color, and desk lamp illumination.</span>
      </div>
    `;
    mapLookCard.appendChild(createRgColor('Place Headline Color', 'placeColor', cfg.placeColor));
    mapLookCard.appendChild(createRgColor('Atmospheric Map Wash', 'washColor', cfg.washColor));
    mapLookCard.appendChild(createRgSlider('Map Wash Opacity', 'washOpacity', 0, 85, 1, '%', cfg.washOpacity));
    mapLookCard.appendChild(createRgSlider('Map Saturation', 'mapSaturation', 0, 160, 5, '%', cfg.mapSaturation));
    mapLookCard.appendChild(createRgSlider('Brand Lockup Opacity', 'brandLogoOpacity', 10, 100, 1, '%', cfg.brandLogoOpacity));
    if (cfg.continuationEnabled) {
      mapLookCard.appendChild(createRgColor('Desk Lamp Light Color', 'lightColor', cfg.lightColor));
      mapLookCard.appendChild(createRgSlider('Desk Lamp Brightness', 'lightBrightness', 0, 100, 1, '%', cfg.lightBrightness));
      mapLookCard.appendChild(createRgSlider('Lamp Flicker Liveliness', 'lightFlicker', 0, 50, 1, '%', cfg.lightFlicker));
    }
    panes.look.appendChild(mapLookCard);

    // ========================================================================
    // TAB 4: EFFECTS — LIVING FLAMES, SPARKS, SELECTIVE BLUR & SURFACE REVEAL
    // ========================================================================
    const tearFxCard = document.createElement('div');
    tearFxCard.className = 'rg-inspector-section';
    tearFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Organic Tear Geometry & Vignette</span>
        <span class="rg-section-subtitle">Control the ragged paper tear nuclei, micro-tears, focal origin, and optical vignette.</span>
      </div>
    `;
    tearFxCard.appendChild(createRgSlider('Primary Paper Tear Nuclei', 'tearCount', 2, 12, 1, '', cfg.tearCount));
    tearFxCard.appendChild(createRgSlider('Micro-Tear Satellites', 'microTearCount', 0, 140, 5, '', cfg.microTearCount));
    tearFxCard.appendChild(createRgSlider('Tear Focal Center X', 'tearOriginX', 15, 85, 1, '%', cfg.tearOriginX));
    tearFxCard.appendChild(createRgSlider('Tear Focal Center Y', 'tearOriginY', 15, 85, 1, '%', cfg.tearOriginY));
    tearFxCard.appendChild(createRgSlider('Inner Vignette Depth', 'vignetteStrength', 0, 100, 1, '%', cfg.vignetteStrength));
    panes.effects.appendChild(tearFxCard);

    const fireFxCard = document.createElement('div');
    fireFxCard.className = 'rg-inspector-section';
    fireFxCard.innerHTML = `
      <div class="rg-section-header">
        <span class="rg-section-title">Living Flame Engine & Selective Blur</span>
        <span class="rg-section-subtitle">Real-time procedural turbulence flames, rising ember sparks, and soft region blur (when Continuation is enabled).</span>
      </div>
    `;
    fireFxCard.appendChild(createRgSelect('Fire Style', 'fireStyle', [
      { value: 'classic', label: 'Classic · Natural Burn' },
      { value: 'blue', label: 'Blue · Cold Cobalt Glow' },
      { value: 'vivid', label: 'Vivid · Saturated Flames' },
      { value: 'intense', label: 'Intense · Bright Blaze' },
      { value: 'wall', label: 'Wall · Layered Flames' }
    ], cfg.fireStyle, (val) => {
      if (val === 'blue') updateConfigKey('fireColor', '#428cff');
      else if (cfg.fireColor === '#428cff') updateConfigKey('fireColor', '#ff681f');
      if (cfg.continuationEnabled) seekStageTime(phaseInfo.fire + 2.5);
    }));
    fireFxCard.appendChild(createRgColor('Flame Tint Color', 'fireColor', cfg.fireColor));
    fireFxCard.appendChild(createRgSlider('Flame Height & Size', 'fireSize', 0, 100, 1, '%', cfg.fireSize));
    fireFxCard.appendChild(createRgSlider('Flame Wildness & Turbulence', 'fireWildness', 0, 100, 1, '%', cfg.fireWildness));
    fireFxCard.appendChild(createRgSlider('Sparks & Rising Embers', 'fireSparks', 0, 100, 1, '%', cfg.fireSparks));
    fireFxCard.appendChild(createRgSlider('Burn Speed', 'fireSpeed', 1, 100, 1, '%', cfg.fireSpeed));
    fireFxCard.appendChild(createRgSlider('Flame Wind Drift', 'fireWind', -50, 50, 1, '', cfg.fireWind));
    fireFxCard.appendChild(createRgSelect('Selective Blur Region Mode', 'blurMode', [
      { value: 'background', label: 'Background Only (Keep People Sharp)' },
      { value: 'edges', label: 'Feathered Frame Edges' },
      { value: 'custom', label: 'Custom Focus Region' },
      { value: 'none', label: 'Off (Sharp Original)' }
    ], cfg.blurMode));
    fireFxCard.appendChild(createRgSlider('Selective Blur Softness', 'blurStrength', 0, 24, 1, 'px', cfg.blurStrength));
    fireFxCard.appendChild(createRgSelect('Surface Material Sweep', 'surfaceType', [
      { value: 'none', label: 'None (Clean Transition)' },
      { value: 'soil', label: 'Earth · Fine Soil' },
      { value: 'snow', label: 'Snow · Soft Drift' },
      { value: 'clouds', label: 'Clouds · Mist Bank' }
    ], cfg.surfaceType));
    panes.effects.appendChild(fireFxCard);

    // ========================================================================
    // ADVANCED CONTROLS DRAWER — SPATIAL CALIBRATION & CONTINUATION ASSETS
    // ========================================================================
    if (advDrawer) {
      const advCard = document.createElement('div');
      advCard.className = 'rg-inspector-section';
      advCard.innerHTML = `
        <div class="rg-section-header">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span class="rg-section-title">Eye Strip Spatial Coordinates & Reset</span>
            <button type="button" class="rg-action-pill-btn" data-action="reset-origins-defaults" title="Reset All Adjustments">
              ${ENGINE_SVGS.rotateCcw}
              <span>Reset</span>
            </button>
          </div>
          <span class="rg-section-subtitle">Fine-tune exact eye strip coordinates, continuation portraits, and desk timings.</span>
        </div>
      `;
      const resetBtn = advCard.querySelector('[data-action="reset-origins-defaults"]');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          updateConfigMultiple(Object.assign({}, DEFAULT_CONFIG), true);
          seekStageTime(6.2);
        });
      }
      advCard.appendChild(createRgSlider('Eye Strip X Position', 'eyeX', 5, 85, 1, '%', cfg.eyeX));
      advCard.appendChild(createRgSlider('Eye Strip Y Position', 'eyeY', 5, 85, 1, '%', cfg.eyeY));
      advCard.appendChild(createRgSlider('Eye Strip Width', 'eyeWidth', 8, 70, 1, '%', cfg.eyeWidth));
      advCard.appendChild(createRgSlider('Eye Strip Height', 'eyeHeight', 3, 35, 1, '%', cfg.eyeHeight));
      advCard.appendChild(createRgSlider('Eye Strip Angle', 'eyeRotation', -25, 25, 1, '°', cfg.eyeRotation));
      advCard.appendChild(createRgSlider('Left Silhouette Opacity', 'leftOpacity', 0, 100, 1, '%', cfg.leftOpacity));
      advCard.appendChild(createRgSlider('Right Silhouette Opacity', 'rightOpacity', 0, 100, 1, '%', cfg.rightOpacity));
      advCard.appendChild(createRgSlider('Desk Props Scale', 'deskSize', 60, 140, 1, '%', cfg.deskSize));
      advDrawer.appendChild(advCard);
    }
  };

  window.tplBuildOriginsSlowRevealInspector = function (containerEl) {
    if (!containerEl) return;
    containerEl.innerHTML = `<div id="rg-origins-inspector-root" style="display:none;"></div>`;
    if (typeof window.organizeUniversalTemplateControls === 'function') {
      window.organizeUniversalTemplateControls();
    }
  };

  // ==========================================================================
  // 8. GLOBAL EXPORTS
  // ==========================================================================
  window.buildOriginsSlowRevealHtml = buildOriginsSlowRevealHtml;
  window.tplMountOriginsSlowRevealStage = tplMountOriginsSlowRevealStage;
  window.stepOriginsSlowRevealAnimation = stepOriginsSlowRevealAnimation;
  window.renderOriginsSlowRevealFrame = renderOriginsSlowRevealFrame;
  window.renderOriginsSlowRevealCanvas = renderOriginsSlowRevealCanvas;
})();
