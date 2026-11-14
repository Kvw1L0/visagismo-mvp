/**
 * Motor de análisis geométrico y colorimetría para Visagismo
 * Basado en los 478 landmarks de MediaPipe Face Landmarker.
 */

function dist(a, b, w, h) {
  const dx = (a.x - b.x) * w;
  const dy = (a.y - b.y) * h;
  return Math.hypot(dx, dy);
}

function angleDeg(a, b, c, w, h) {
  const v1x = (a.x - b.x) * w;
  const v1y = (a.y - b.y) * h;
  const v2x = (c.x - b.x) * w;
  const v2y = (c.y - b.y) * h;
  const dot = v1x * v2x + v1y * v2y;
  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);
  if (mag1 === 0 || mag2 === 0) return 135;
  const cos = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/**
 * Analiza la postura del rostro para advertir si la foto no es frontal.
 */
export function checkPose(landmarks, w, h) {
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];
  const nose = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  const eyeDy = Math.abs((leftEye.y - rightEye.y) * h);
  const eyeDx = Math.abs((rightEye.x - leftEye.x) * w);
  const rollAngle = Math.atan2(eyeDy, eyeDx) * (180 / Math.PI);

  const distLeft = Math.abs(nose.x - leftCheek.x);
  const distRight = Math.abs(rightCheek.x - nose.x);
  const yawRatio = Math.min(distLeft, distRight) / Math.max(distLeft, distRight || 0.001);

  const warnings = [];
  if (rollAngle > 8) {
    warnings.push('La cabeza está ligeramente inclinada; endereza el rostro para mayor precisión.');
  }
  if (yawRatio < 0.72) {
    warnings.push('El rostro parece estar girado; intenta mirar directamente al frente.');
  }
  return {
    isFrontal: warnings.length === 0,
    warnings,
    rollAngle,
    yawRatio,
  };
}

/**
 * Calcula medidas, tercios, simetría y clasifica la forma del rostro.
 */
export function analyzeVisagism(landmarks, w, h) {
  // Puntos clave
  const topForehead = landmarks[10];
  const glabella = landmarks[9];
  const subnasale = landmarks[2];
  const chin = landmarks[152];

  const foreheadL = landmarks[54];
  const foreheadR = landmarks[284];
  const cheekL = landmarks[234];
  const cheekR = landmarks[454];
  const jawL = landmarks[172];
  const jawR = landmarks[397];

  // Medidas en píxeles
  const rawLength = dist(topForehead, chin, w, h);
  // MediaPipe landmark 10 está ligeramente debajo de la línea capilar real (~6-8%)
  const estimatedLength = rawLength * 1.06;

  const foreheadWidth = dist(foreheadL, foreheadR, w, h) * 1.05;
  const cheekWidth = dist(cheekL, cheekR, w, h);
  const jawWidth = dist(jawL, jawR, w, h);

  // Tercios faciales (en px)
  const upperThird = dist(topForehead, glabella, w, h) * 1.15; // compensación hasta nacimiento del pelo
  const middleThird = dist(glabella, subnasale, w, h);
  const lowerThird = dist(subnasale, chin, w, h);
  const thirdsTotal = upperThird + middleThird + lowerThird || 1;

  const thirdsPct = {
    superior: Math.round((upperThird / thirdsTotal) * 100),
    medio: Math.round((middleThird / thirdsTotal) * 100),
    inferior: Math.round((lowerThird / thirdsTotal) * 100),
  };

  // Ángulo mandibular promedio
  const jawAngleL = angleDeg(cheekL, jawL, chin, w, h);
  const jawAngleR = angleDeg(cheekR, jawR, chin, w, h);
  const avgJawAngle = (jawAngleL + jawAngleR) / 2;

  // Simetría horizontal respecto al eje central (punto 168 puente nasal - 1 punta - 152 mentón)
  const noseBridge = landmarks[168];
  const axisX = (noseBridge.x + landmarks[1].x + chin.x) / 3;
  const pairs = [
    [33, 263], // ojos ext
    [234, 454], // pómulos
    [172, 397], // mandíbula
    [61, 291], // comisuras
  ];
  let symmetryScoreSum = 0;
  for (const [li, ri] of pairs) {
    const dl = Math.abs(axisX - landmarks[li].x);
    const dr = Math.abs(landmarks[ri].x - axisX);
    const ratio = Math.min(dl, dr) / Math.max(dl, dr || 0.0001);
    symmetryScoreSum += ratio;
  }
  const symmetryPct = Math.round((symmetryScoreSum / pairs.length) * 100);

  // Ratios clave para clasificación
  const lengthToWidth = estimatedLength / (cheekWidth || 1);
  const jawToCheek = jawWidth / (cheekWidth || 1);
  const foreheadToJaw = foreheadWidth / (jawWidth || 1);
  const foreheadToCheek = foreheadWidth / (cheekWidth || 1);

  // Sistema de puntuación por reglas geométricas de visagismo
  const scores = {
    ovalado: 0,
    redondo: 0,
    cuadrado: 0,
    alargado: 0,
    diamante: 0,
    corazon: 0,
    triangulo: 0,
  };

  // 1. Alargado / Rectangular: rostro claramente más largo que ancho
  if (lengthToWidth >= 1.52) {
    scores.alargado += 45 + (lengthToWidth - 1.52) * 80;
  } else if (lengthToWidth >= 1.44) {
    scores.alargado += 18;
  }

  // 2. Redondo: ancho y largo muy cercanos + mandíbula suave
  if (lengthToWidth <= 1.26) {
    scores.redondo += 40 + (1.26 - lengthToWidth) * 90;
  } else if (lengthToWidth <= 1.33) {
    scores.redondo += 18;
  }
  if (avgJawAngle >= 134) {
    scores.redondo += 18;
  }

  // 3. Cuadrado: relación largo/ancho baja-media + mandíbula ancha y angular
  if (lengthToWidth <= 1.35 && jawToCheek >= 0.84) {
    scores.cuadrado += 38;
  }
  if (avgJawAngle <= 130) {
    scores.cuadrado += 25;
  }
  if (Math.abs(foreheadToJaw - 1) <= 0.1) {
    scores.cuadrado += 15;
  }

  // 4. Diamante: pómulos claramente más anchos que frente y mandíbula
  if (foreheadToCheek <= 0.87 && jawToCheek <= 0.80) {
    scores.diamante += 52;
  } else if (foreheadToCheek <= 0.91 && jawToCheek <= 0.83) {
    scores.diamante += 26;
  }

  // 5. Corazón / Triángulo invertido: frente notablemente más ancha que mandíbula
  if (foreheadToJaw >= 1.14) {
    scores.corazon += 45 + (foreheadToJaw - 1.14) * 70;
  } else if (foreheadToJaw >= 1.07 && jawToCheek <= 0.82) {
    scores.corazon += 25;
  }

  // 6. Triángulo / Pera: mandíbula más ancha que la frente
  if (foreheadToJaw <= 0.90) {
    scores.triangulo += 48 + (0.90 - foreheadToJaw) * 80;
  } else if (foreheadToJaw <= 0.95 && jawToCheek >= 0.86) {
    scores.triangulo += 25;
  }

  // 7. Ovalado: proporciones balanceadas (1.32 - 1.50), frente > mandíbula suavemente
  if (lengthToWidth >= 1.32 && lengthToWidth <= 1.50) {
    scores.ovalado += 36;
  }
  if (foreheadToJaw >= 1.02 && foreheadToJaw <= 1.13) {
    scores.ovalado += 22;
  }
  if (avgJawAngle >= 129 && avgJawAngle <= 142) {
    scores.ovalado += 15;
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestShape, bestScore] = sorted[0];
  const secondScore = sorted[1][1];
  const totalTop = bestScore + secondScore || 1;
  const confidence = Math.min(96, Math.max(58, Math.round((bestScore / totalTop) * 100)));

  return {
    shape: bestShape,
    secondaryShape: sorted[1][0],
    confidence,
    metrics: {
      lengthToWidth: Number(lengthToWidth.toFixed(2)),
      foreheadToJaw: Number(foreheadToJaw.toFixed(2)),
      jawToCheek: Number(jawToCheek.toFixed(2)),
      jawAngle: Math.round(avgJawAngle),
      symmetryPct,
      thirdsPct,
    },
    geometry: {
      topForehead,
      glabella,
      subnasale,
      chin,
      foreheadL,
      foreheadR,
      cheekL,
      cheekR,
      jawL,
      jawR,
      axisX,
    },
  };
}

/**
 * Extrae el subtono de piel (cálido, frío, neutro) muestreando zonas seguras de mejillas y frente.
 */
export function analyzeSkinUndertone(ctx, landmarks, w, h) {
  const samplePoints = [
    landmarks[118], // mejilla izquierda
    landmarks[347], // mejilla derecha
    landmarks[50],  // pómulo izquierdo
    landmarks[280], // pómulo derecho
    landmarks[151], // centro de la frente
  ];

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;
  const radius = Math.max(3, Math.round(w * 0.012));

  for (const pt of samplePoints) {
    const cx = Math.round(pt.x * w);
    const cy = Math.round(pt.y * h);
    const x0 = Math.max(0, cx - radius);
    const y0 = Math.max(0, cy - radius);
    const size = radius * 2;
    if (x0 + size > w || y0 + size > h) continue;

    const imgData = ctx.getImageData(x0, y0, size, size).data;
    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];
      // Ignorar píxeles muy oscuros (sombras/pelo) o quemados (brillos)
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (lum > 45 && lum < 235) {
        sumR += r;
        sumG += g;
        sumB += b;
        count++;
      }
    }
  }

  if (count === 0) {
    return { undertone: 'neutro', hex: '#d2a68d', warmthIndex: 0 };
  }

  const r = Math.round(sumR / count);
  const g = Math.round(sumG / count);
  const b = Math.round(sumB / count);

  const hex =
    '#' +
    [r, g, b]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('');

  // Índice de calidez en espacio YCbCr / diferencia amarillo-azul
  // Cb = 128 - 0.1687*R - 0.3313*G + 0.5*B
  // Cr = 128 + 0.5*R - 0.4187*G - 0.0813*B
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  const warmthIndex = Number((cr - cb - 26).toFixed(1));

  let undertone = 'neutro';
  if (warmthIndex > 6) {
    undertone = 'calido';
  } else if (warmthIndex < -3) {
    undertone = 'frio';
  }

  return { undertone, hex, warmthIndex };
}

/**
 * Dibuja las líneas de medición de visagismo y malla opcional sobre el canvas de visualización.
 */
export function drawVisagismOverlay(ctx, landmarks, analysis, w, h, options = { showMesh: true, showLines: true }) {
  const { geometry } = analysis;

  if (options.showMesh) {
    ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
    for (let i = 0; i < landmarks.length; i += 2) {
      const pt = landmarks[i];
      ctx.beginPath();
      ctx.arc(pt.x * w, pt.y * h, Math.max(1, w * 0.0018), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (!options.showLines) return;

  const lineWidth = Math.max(1.5, w * 0.0028);
  ctx.lineWidth = lineWidth;

  // Eje central de simetría
  ctx.save();
  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.beginPath();
  ctx.moveTo(geometry.axisX * w, geometry.topForehead.y * h - h * 0.04);
  ctx.lineTo(geometry.axisX * w, geometry.chin.y * h + h * 0.02);
  ctx.stroke();
  ctx.restore();

  // Líneas de ancho (Frente, Pómulos, Mandíbula)
  const drawMeasureLine = (p1, p2, color, label) => {
    const x1 = p1.x * w;
    const y1 = p1.y * h;
    const x2 = p2.x * w;
    const y2 = p2.y * h;

    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Puntos extremos
    ctx.fillStyle = color;
    for (const [x, y] of [
      [x1, y1],
      [x2, y2],
    ]) {
      ctx.beginPath();
      ctx.arc(x, y, lineWidth * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Etiqueta
    if (label) {
      ctx.font = `600 ${Math.max(11, Math.round(w * 0.018))}px Inter, sans-serif`;
      ctx.fillStyle = '#0f0f13';
      const padX = 6;
      const textW = ctx.measureText(label).width;
      ctx.fillRect(x2 + 6, y2 - 10, textW + padX * 2, 20);
      ctx.fillStyle = color;
      ctx.fillText(label, x2 + 6 + padX, y2 + 4);
    }
  };

  drawMeasureLine(geometry.foreheadL, geometry.foreheadR, '#f6d365', 'Frente');
  drawMeasureLine(geometry.cheekL, geometry.cheekR, '#d4af37', 'Pómulos');
  drawMeasureLine(geometry.jawL, geometry.jawR, '#4ecdc4', 'Mandíbula');

  // Marcas laterales de Tercios Faciales
  const leftEdge = geometry.cheekL.x * w - w * 0.06;
  const thirdYs = [
    geometry.topForehead.y * h,
    geometry.glabella.y * h,
    geometry.subnasale.y * h,
    geometry.chin.y * h,
  ];
  ctx.save();
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
  ctx.setLineDash([3, 4]);
  for (const ty of thirdYs) {
    ctx.beginPath();
    ctx.moveTo(leftEdge, ty);
    ctx.lineTo(geometry.cheekR.x * w + w * 0.04, ty);
    ctx.stroke();
  }
  ctx.restore();
}
