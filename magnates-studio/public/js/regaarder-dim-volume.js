/**
 * Regaarder Dimension Volume & Granular 2.5D Mesh Generator
 *
 * Converts a 2D image (with alpha silhouette or uniform-background cutout) into
 * a watertight, calibratable 3D mirrored volume or granular 2.5D relief mesh.
 */

export const VOLUME_DEFAULTS = Object.freeze({
  thickness: 0.45,       // [0.0, 2.0] normalized from UI 0..100
  roundness: 0.75,       // [0.0, 1.0] 0 = flat card, 1 = elliptical volume
  centerline: 0.0,       // [-1.0, 1.0] horizontal front/back bias
  vTaper: 0.0,           // [-1.0, 1.0] vertical top/bottom thickness bias
  detailRelief: 0.35,    // [-1.0, 1.0] local luminance/contour relief blend
  mirrorMode: 'symmetric', // 'off' | 'symmetric' | 'front_only'
  shapePreset: 'auto',   // 'auto' | 'shoe' | 'head' | 'flat'
});

export function clamp(val, lo, hi) {
  return Math.max(lo, Math.min(hi, val));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / Math.max(1e-6, edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function roundnessProfile(d, roundness) {
  const dc = clamp(d, 0, 1);
  const rc = clamp(roundness, 0, 1);
  if (rc <= 0) return 1;
  const elliptical = Math.sqrt(Math.max(0, 1 - (1 - dc) * (1 - dc)));
  // Smoothly pinch the outer rim to 0 whenever roundness > 0 so front & back
  // meet cleanly at Z = 0 without a stretched zigzag side-skirt seam.
  const rim = clamp(dc / 0.12, 0, 1);
  const smoothRim = rim * rim * (3 - 2 * rim);
  const beveled = (1 - rc) * smoothRim + rc * elliptical;
  return beveled;
}

/**
 * Fast 2-pass Chamfer Euclidean Distance Transform on a binary mask (0 or 1).
 * Returns normalized Float32Array in [0, 1].
 */
export function computeDistanceField(mask, w, h) {
  const n = w * h;
  const dist = new Float32Array(n);
  if (n === 0) return dist;

  const INF = 1e6;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i] === 0) {
        dist[i] = 0;
        continue;
      }
      const isEdge =
        x === 0 || y === 0 || x === w - 1 || y === h - 1 ||
        mask[i - 1] === 0 || mask[i + 1] === 0 ||
        mask[i - w] === 0 || mask[i + w] === 0 ||
        mask[i - w - 1] === 0 || mask[i - w + 1] === 0 ||
        mask[i + w - 1] === 0 || mask[i + w + 1] === 0;
      dist[i] = isEdge ? 0 : INF;
    }
  }

  const SQRT2 = Math.SQRT2;
  // Forward pass
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (dist[i] === 0) continue;
      let d = dist[i];
      if (x > 0) d = Math.min(d, dist[i - 1] + 1);
      if (y > 0) d = Math.min(d, dist[i - w] + 1);
      if (x > 0 && y > 0) d = Math.min(d, dist[i - w - 1] + SQRT2);
      if (x < w - 1 && y > 0) d = Math.min(d, dist[i - w + 1] + SQRT2);
      dist[i] = d;
    }
  }

  // Backward pass
  let maxD = 0;
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x;
      if (mask[i] === 0) continue;
      let d = dist[i];
      if (x < w - 1) d = Math.min(d, dist[i + 1] + 1);
      if (y < h - 1) d = Math.min(d, dist[i + w] + 1);
      if (x < w - 1 && y < h - 1) d = Math.min(d, dist[i + w + 1] + SQRT2);
      if (x > 0 && y < h - 1) d = Math.min(d, dist[i + w - 1] + SQRT2);
      dist[i] = d;
      if (d > maxD) maxD = d;
    }
  }

  if (maxD > 0) {
    for (let i = 0; i < n; i++) {
      dist[i] /= maxD;
    }
  }
  return dist;
}

/**
 * Extract silhouette mask, normalized distance field, and smoothed local relief
 * from RGBA pixel data.
 */
export function extractGridFromRGBA(rgba, w, h) {
  const n = w * h;
  const mask = new Uint8Array(n);
  const luma = new Float32Array(n);

  // Detect whether image has meaningful alpha transparency
  let transparentCount = 0;
  for (let i = 0; i < n; i++) {
    if (rgba[i * 4 + 3] < 24) transparentCount++;
  }
  const hasAlpha = transparentCount > n * 0.03;

  // Sample 4 corners for uniform-background fallback when opaque (e.g. JPEG)
  const corners = [0, w - 1, (h - 1) * w, h * w - 1];
  let bgR = 0, bgG = 0, bgB = 0;
  for (const ci of corners) {
    bgR += rgba[ci * 4];
    bgG += rgba[ci * 4 + 1];
    bgB += rgba[ci * 4 + 2];
  }
  bgR /= 4; bgG /= 4; bgB /= 4;

  let cornerSpread = 0;
  for (const ci of corners) {
    const dr = rgba[ci * 4] - bgR;
    const dg = rgba[ci * 4 + 1] - bgG;
    const db = rgba[ci * 4 + 2] - bgB;
    cornerSpread = Math.max(cornerSpread, Math.sqrt(dr * dr + dg * dg + db * db));
  }
  const hasUniformBg = !hasAlpha && cornerSpread < 28;

  for (let i = 0; i < n; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    const a = rgba[i * 4 + 3];
    luma[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (hasAlpha) {
      mask[i] = a >= 110 ? 1 : 0;
    } else if (hasUniformBg) {
      const dr = r - bgR, dg = g - bgG, db = b - bgB;
      const distBg = Math.sqrt(dr * dr + dg * dg + db * db);
      mask[i] = distBg > 24 ? 1 : 0;
    } else {
      mask[i] = 1;
    }
  }

  // 1-pass 3x3 box blur on luma for smooth local detail relief (no pixel noise)
  const localDepth = new Float32Array(n);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let sum = 0, cnt = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= w) continue;
          const ni = ny * w + nx;
          if (mask[ni]) {
            sum += luma[ni];
            cnt++;
          }
        }
      }
      localDepth[y * w + x] = cnt > 0 ? sum / cnt : 0.5;
    }
  }

  const rawDist = computeDistanceField(mask, w, h);
  // 2-pass 3x3 smoothing inside the mask to eliminate grid-staircase ridges
  let distField = rawDist;
  for (let pass = 0; pass < 2; pass++) {
    const next = new Float32Array(n);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        if (mask[i] === 0 || distField[i] === 0) continue;
        let sum = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= h) continue;
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= w) continue;
            const ni = ny * w + nx;
            if (mask[ni]) {
              sum += distField[ni];
              cnt++;
            }
          }
        }
        next[i] = cnt > 0 ? sum / cnt : distField[i];
      }
    }
    distField = next;
  }
  const sculptMap = new Float32Array(n);
  return { w, h, mask, distField, localDepth, sculptMap };
}

/**
 * Paint a smooth local push/pull sculpt delta at normalized UV coordinates (u, v in [0,1]).
 */
export function applySculptBrush(grid, u, v, radiusNorm = 0.14, delta = 0.06) {
  const { w, h, mask, sculptMap } = grid;
  if (!sculptMap) return;
  const cx = clamp(u, 0, 1) * (w - 1);
  const cy = clamp(1 - v, 0, 1) * (h - 1);
  const rad = Math.max(2, radiusNorm * Math.max(w, h));
  const radSq = rad * rad;
  const x0 = Math.max(0, Math.floor(cx - rad));
  const x1 = Math.min(w - 1, Math.ceil(cx + rad));
  const y0 = Math.max(0, Math.floor(cy - rad));
  const y1 = Math.min(h - 1, Math.ceil(cy + rad));

  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const i = y * w + x;
      if (mask[i] === 0) continue;
      const dSq = (x - cx) * (x - cx) + (y - cy) * (y - cy);
      if (dSq >= radSq) continue;
      const falloff = Math.pow(1 - dSq / radSq, 2);
      sculptMap[i] = clamp(sculptMap[i] + delta * falloff, -1.5, 1.5);
    }
  }
}

export function clearSculpt(grid) {
  if (grid?.sculptMap) grid.sculptMap.fill(0);
}

/**
 * Sample an HTMLImageElement or HTMLCanvasElement into a grid (max 104px on longest side).
 */
export function sampleImageToGrid(imgEl, maxDim = 104) {
  const iw = imgEl.naturalWidth || imgEl.videoWidth || imgEl.width || 64;
  const ih = imgEl.naturalHeight || imgEl.videoHeight || imgEl.height || 64;
  const aspect = iw / Math.max(1, ih);
  const w = aspect >= 1 ? maxDim : Math.max(16, Math.round(maxDim * aspect));
  const h = aspect >= 1 ? Math.max(16, Math.round(maxDim / aspect)) : maxDim;

  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d', { willReadFrequently: true });
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(imgEl, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);
  const grid = extractGridFromRGBA(data, w, h);
  grid.aspect = aspect;
  return grid;
}

/**
 * Compute front (+Z) and back (-Z) height values for every grid vertex.
 */
export function computeHeightArrays(grid, params) {
  const { w, h, mask, distField, localDepth, sculptMap } = grid;
  const n = w * h;
  const zFront = new Float32Array(n);
  const zBack = new Float32Array(n);

  const shapePreset = params.shapePreset || VOLUME_DEFAULTS.shapePreset;
  const thickness = clamp(params.thickness ?? VOLUME_DEFAULTS.thickness, 0, 2);
  const roundness = shapePreset === 'flat' ? 0 : (shapePreset === 'head' ? 0.92 : clamp(params.roundness ?? VOLUME_DEFAULTS.roundness, 0, 1));
  const centerline = clamp(params.centerline ?? VOLUME_DEFAULTS.centerline, -1, 1);
  const vTaper = clamp(params.vTaper ?? VOLUME_DEFAULTS.vTaper, -1, 1);
  const detailRelief = clamp(params.detailRelief ?? VOLUME_DEFAULTS.detailRelief, -1, 1);
  const mirrorMode = params.mirrorMode || VOLUME_DEFAULTS.mirrorMode;

  // Detect shoe orientation (heel is taller than toe) + tight bounding box for shoe preset
  let minX = w - 1, maxX = 0, minY = h - 1, maxY = 0;
  let leftMass = 0, rightMass = 0;
  if (shapePreset === 'shoe') {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (!mask[y * w + x]) continue;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const spanX = Math.max(1, maxX - minX);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (!mask[y * w + x]) continue;
        const nx = (x - minX) / spanX;
        if (nx < 0.35) leftMass++;
        else if (nx > 0.65) rightMass++;
      }
    }
  }
  const flipShoeX = shapePreset === 'shoe' && rightMass > leftMass;
  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);

  for (let y = 0; y < h; y++) {
    const uY = (2 * y / Math.max(1, h - 1)) - 1; // -1 (top) .. +1 (bottom)
    const vBias = clamp(1 + 0.5 * vTaper * uY, 0.2, 1.8);
    const nyBox = (y - minY) / boxH;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (mask[i] === 0) continue;
      const d = distField[i];
      const uX = (2 * x / Math.max(1, w - 1)) - 1;
      const hBias = clamp(1 + 0.5 * centerline * (-uX), 0.2, 1.8);

      let baseCurve;
      if (shapePreset === 'shoe') {
        const rawNx = (x - minX) / boxW;
        const nxShoe = flipShoeX ? 1 - rawNx : rawNx;
        const baseW = 0.60 * (1 - 0.31 * smoothstep(0.55, 0.92, nxShoe));
        const upperTaper = 1 - 0.535 * smoothstep(0.55, 0.25, nyBox);
        let zShoe = baseW * upperTaper;
        if (nyBox >= 0.66 && nyBox <= 0.80) {
          zShoe = Math.max(zShoe, baseW * 0.945);
        }
        if (nyBox > 0.80) {
          zShoe = 0.14;
        } else if (nxShoe >= 0.14 && nxShoe <= 0.36 && nyBox >= 0.18 && nyBox <= 0.44) {
          zShoe = 0.12; // hollow ankle collar cavity
        } else if (nxShoe >= 0.42 && nxShoe <= 0.66 && nyBox >= 0.28 && nyBox <= 0.52) {
          zShoe += 0.07; // instep lace ridge
        }
        const rim = clamp(d / 0.10, 0, 1);
        const smoothRim = rim * rim * (3 - 2 * rim);
        baseCurve = zShoe * smoothRim * hBias * vBias;
      } else {
        baseCurve = roundnessProfile(d, roundness) * hBias * vBias;
      }

      const taper = roundness > 0 ? Math.pow(d, 0.85) : 1;
      const detail = detailRelief * (localDepth[i] - 0.5) * taper;
      const sculpt = sculptMap ? sculptMap[i] * taper : 0;
      const zf = Math.max(0, thickness * (baseCurve + detail) + sculpt);
      zFront[i] = zf;
      zBack[i] = mirrorMode === 'off' ? 0 : -zf;
    }
  }
  return { zFront, zBack };
}

/**
 * Build a watertight THREE.BufferGeometry with front (+Z) and back (-Z)
 * triangles strictly inside the silhouette mask (no stretched transparent corners).
 */
export function createVolumeGeometry(THREE, grid, params, widthWorld = 2.0) {
  const { w, h, mask } = grid;
  const aspect = grid.aspect || (w / Math.max(1, h));
  const heightWorld = widthWorld / Math.max(0.1, aspect);
  const n = w * h;

  // Vertex layout: [0..n-1] front surface, [n..2n-1] back surface
  const positions = new Float32Array(n * 2 * 3);
  const uvs = new Float32Array(n * 2 * 2);
  const mirrorMode = params.mirrorMode || VOLUME_DEFAULTS.mirrorMode;

  for (let y = 0; y < h; y++) {
    const v = 1 - y / Math.max(1, h - 1);
    const py = (v - 0.5) * heightWorld;
    for (let x = 0; x < w; x++) {
      const u = x / Math.max(1, w - 1);
      const px = (u - 0.5) * widthWorld;
      const i = y * w + x;

      // Front vertex
      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      uvs[i * 2] = u;
      uvs[i * 2 + 1] = v;

      // Back vertex
      const bi = n + i;
      positions[bi * 3] = px;
      positions[bi * 3 + 1] = py;
      // Front-only mode samples corner/dark neutral UV (0.01, 0.01) so no second face appears on back
      uvs[bi * 2] = mirrorMode === 'front_only' ? 0.01 : u;
      uvs[bi * 2 + 1] = mirrorMode === 'front_only' ? 0.01 : v;
    }
  }

  // 1-pass Laplacian XY smoothing on outer boundary vertices to soften diagonal stair-steps
  const { distField } = grid;
  const smoothXY = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    smoothXY[i * 2] = positions[i * 3];
    smoothXY[i * 2 + 1] = positions[i * 3 + 1];
  }
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (mask[i] === 0 || distField[i] > 0) continue;
      let sx = 0, sy = 0, cnt = 0;
      const nbrs = [i - 1, i + 1, i - w, i + w];
      for (const ni of nbrs) {
        if (mask[ni] && distField[ni] === 0) {
          sx += positions[ni * 3];
          sy += positions[ni * 3 + 1];
          cnt++;
        }
      }
      if (cnt > 0) {
        smoothXY[i * 2] = 0.5 * positions[i * 3] + 0.5 * (sx / cnt);
        smoothXY[i * 2 + 1] = 0.5 * positions[i * 3 + 1] + 0.5 * (sy / cnt);
      }
    }
  }
  for (let i = 0; i < n; i++) {
    positions[i * 3] = smoothXY[i * 2];
    positions[i * 3 + 1] = smoothXY[i * 2 + 1];
    positions[(n + i) * 3] = smoothXY[i * 2];
    positions[(n + i) * 3 + 1] = smoothXY[i * 2 + 1];
  }

  const indices = [];
  const edgeCounts = new Map();
  const addFrontTri = (p, q, r) => {
    indices.push(p, q, r);
    indices.push(n + p, n + r, n + q);
    const edges = [[p, q], [q, r], [r, p]];
    for (const [u, v] of edges) {
      const key = u < v ? `${u}_${v}` : `${v}_${u}`;
      const prev = edgeCounts.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        edgeCounts.set(key, { u, v, count: 1 });
      }
    }
  };

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const a = y * w + x;
      const b = a + 1;
      const c = (y + 1) * w + x;
      const d = c + 1;

      // Only emit triangles whose 3 vertices are all inside the silhouette mask
      if (mask[a] && mask[c] && mask[b]) {
        addFrontTri(a, c, b);
      }
      if (mask[b] && mask[c] && mask[d]) {
        addFrontTri(b, c, d);
      }
    }
  }

  // Watertight stitch along every true boundary half-edge (zero gaps at any roundness)
  for (const edge of edgeCounts.values()) {
    if (edge.count === 1) {
      const { u, v } = edge;
      indices.push(u, n + u, v, v, n + u, n + v);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  updateVolumeGeometry(geo, grid, params);
  return geo;
}

/**
 * Update Z positions and vertex normals in-place for 60fps slider calibration.
 */
export function updateVolumeGeometry(geo, grid, params) {
  const { w, h } = grid;
  const n = w * h;
  const { zFront, zBack } = computeHeightArrays(grid, params);
  const posAttr = geo.getAttribute('position');
  const arr = posAttr.array;

  for (let i = 0; i < n; i++) {
    arr[i * 3 + 2] = zFront[i];
    arr[(n + i) * 3 + 2] = zBack[i];
  }

  // Update back UVs if mirrorMode switched between symmetric and front_only
  const uvAttr = geo.getAttribute('uv');
  const uvs = uvAttr.array;
  const frontOnly = params.mirrorMode === 'front_only';
  for (let y = 0; y < h; y++) {
    const v = 1 - y / Math.max(1, h - 1);
    for (let x = 0; x < w; x++) {
      const u = x / Math.max(1, w - 1);
      const bi = n + y * w + x;
      uvs[bi * 2] = frontOnly ? 0.01 : u;
      uvs[bi * 2 + 1] = frontOnly ? 0.01 : v;
    }
  }

  posAttr.needsUpdate = true;
  uvAttr.needsUpdate = true;
  geo.computeVertexNormals();
}
