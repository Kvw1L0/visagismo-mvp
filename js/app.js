import {
  FilesetResolver,
  FaceLandmarker,
} from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs';

import { FACE_SHAPES, UNDERTONES } from './recommendations.js';
import {
  checkPose,
  analyzeVisagism,
  analyzeSkinUndertone,
  drawVisagismOverlay,
} from './visagism.js';

// DOM Elements
const modelStatus = document.getElementById('modelStatus');
const btnPrint = document.getElementById('btnPrint');

const tabUpload = document.getElementById('tabUpload');
const tabCamera = document.getElementById('tabCamera');
const uploadDropzone = document.getElementById('uploadDropzone');
const fileInput = document.getElementById('fileInput');
const btnSelectFile = document.getElementById('btnSelectFile');

const webcamVideo = document.getElementById('webcamVideo');
const cameraGuide = document.getElementById('cameraGuide');
const cameraActions = document.getElementById('cameraActions');
const btnCapture = document.getElementById('btnCapture');
const btnStopCamera = document.getElementById('btnStopCamera');

const outputCanvas = document.getElementById('outputCanvas');
const samplingCanvas = document.getElementById('samplingCanvas');
const resultActions = document.getElementById('resultActions');
const toggleLines = document.getElementById('toggleLines');
const toggleMesh = document.getElementById('toggleMesh');
const btnReset = document.getElementById('btnReset');
const poseWarning = document.getElementById('poseWarning');

const emptyResults = document.getElementById('emptyResults');
const diagnosticContent = document.getElementById('diagnosticContent');
const recCards = document.getElementById('recCards');
const filterBtns = document.querySelectorAll('.filter-btn');

// App State
let faceLandmarker = null;
let mediaStream = null;
let currentMode = 'upload'; // 'upload' | 'camera'
let currentStyleFilter = 'todos';
let lastState = null; // { imageSource, width, height, landmarks, analysis, colorimetry }

// Initialize MediaPipe Face Landmarker
async function initFaceLandmarker() {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
    );
    faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        delegate: 'GPU',
      },
      outputFaceBlendshapes: false,
      runningMode: 'IMAGE',
      numFaces: 1,
    });

    modelStatus.textContent = 'Modelo IA Listo';
    modelStatus.className = 'status-pill status-ready';
    if (mediaStream) btnCapture.disabled = false;
  } catch (err) {
    console.error('Error cargando FaceLandmarker:', err);
    modelStatus.textContent = 'Error al cargar IA';
    modelStatus.className = 'status-pill status-error';
  }
}

// Mode Switching
function switchMode(mode) {
  currentMode = mode;
  tabUpload.classList.toggle('active', mode === 'upload');
  tabCamera.classList.toggle('active', mode === 'camera');
  poseWarning.classList.add('hidden');

  if (mode === 'upload') {
    stopCamera();
    outputCanvas.classList.add('hidden');
    resultActions.classList.add('hidden');
    uploadDropzone.classList.remove('hidden');
  } else {
    uploadDropzone.classList.add('hidden');
    outputCanvas.classList.add('hidden');
    resultActions.classList.add('hidden');
    startCamera();
  }
}

tabUpload.addEventListener('click', () => switchMode('upload'));
tabCamera.addEventListener('click', () => switchMode('camera'));

// Camera Handling
async function startCamera() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    webcamVideo.srcObject = mediaStream;
    webcamVideo.classList.remove('hidden');
    cameraGuide.classList.remove('hidden');
    cameraActions.classList.remove('hidden');
    btnCapture.disabled = !faceLandmarker;
  } catch (err) {
    console.error('No se pudo acceder a la cámara:', err);
    showWarning('No se pudo acceder a la cámara. Verifica los permisos del navegador o usa "Subir Foto".');
    switchMode('upload');
  }
}

function stopCamera() {
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaStream = null;
  }
  webcamVideo.srcObject = null;
  webcamVideo.classList.add('hidden');
  cameraGuide.classList.add('hidden');
  cameraActions.classList.add('hidden');
}

btnStopCamera.addEventListener('click', () => switchMode('upload'));

btnCapture.addEventListener('click', () => {
  if (!mediaStream || !faceLandmarker) return;
  const w = webcamVideo.videoWidth;
  const h = webcamVideo.videoHeight;
  if (!w || !h) return;

  // Dibujar frame espejado en samplingCanvas para que coincida con la vista previa
  samplingCanvas.width = w;
  samplingCanvas.height = h;
  const sCtx = samplingCanvas.getContext('2d', { willReadFrequently: true });
  sCtx.save();
  sCtx.translate(w, 0);
  sCtx.scale(-1, 1);
  sCtx.drawImage(webcamVideo, 0, 0, w, h);
  sCtx.restore();

  stopCamera();
  processImageSource(samplingCanvas, w, h);
});

// File Upload & Drag-and-Drop
btnSelectFile.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files?.[0];
  if (file) handleImageFile(file);
  fileInput.value = '';
});

uploadDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadDropzone.classList.add('dragover');
});

uploadDropzone.addEventListener('dragleave', () => {
  uploadDropzone.classList.remove('dragover');
});

uploadDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadDropzone.classList.remove('dragover');
  const file = e.dataTransfer.files?.[0];
  if (file && file.type.startsWith('image/')) {
    handleImageFile(file);
  }
});

function handleImageFile(file) {
  if (!faceLandmarker) {
    showWarning('El modelo de IA aún se está cargando. Espera un segundo e intenta de nuevo.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      // Limitar resolución máxima para rendimiento fluido
      const maxDim = 1280;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }

      samplingCanvas.width = w;
      samplingCanvas.height = h;
      const sCtx = samplingCanvas.getContext('2d', { willReadFrequently: true });
      sCtx.drawImage(img, 0, 0, w, h);

      uploadDropzone.classList.add('hidden');
      processImageSource(samplingCanvas, w, h);
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// Core Analysis Pipeline
function processImageSource(sourceCanvas, w, h) {
  poseWarning.classList.add('hidden');

  const detection = faceLandmarker.detect(sourceCanvas);
  if (!detection.faceLandmarks || detection.faceLandmarks.length === 0) {
    showWarning(
      'No se detectó ningún rostro con claridad. Asegúrate de usar una foto frontal bien iluminada.'
    );
    uploadDropzone.classList.remove('hidden');
    outputCanvas.classList.add('hidden');
    resultActions.classList.add('hidden');
    return;
  }

  const landmarks = detection.faceLandmarks[0];
  const pose = checkPose(landmarks, w, h);
  if (!pose.isFrontal) {
    showWarning(pose.warnings.join(' '));
  }

  const sCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
  const analysis = analyzeVisagism(landmarks, w, h);
  const colorimetry = analyzeSkinUndertone(sCtx, landmarks, w, h);

  lastState = {
    sourceCanvas,
    w,
    h,
    landmarks,
    analysis,
    colorimetry,
  };

  renderViewportCanvas();
  renderDiagnostic(analysis, colorimetry);

  outputCanvas.classList.remove('hidden');
  resultActions.classList.remove('hidden');
  btnPrint.disabled = false;
}

function renderViewportCanvas() {
  if (!lastState) return;
  const { sourceCanvas, w, h, landmarks, analysis } = lastState;

  outputCanvas.width = w;
  outputCanvas.height = h;
  const ctx = outputCanvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(sourceCanvas, 0, 0, w, h);

  drawVisagismOverlay(ctx, landmarks, analysis, w, h, {
    showLines: toggleLines.checked,
    showMesh: toggleMesh.checked,
  });
}

toggleLines.addEventListener('change', renderViewportCanvas);
toggleMesh.addEventListener('change', renderViewportCanvas);

btnReset.addEventListener('click', () => {
  lastState = null;
  poseWarning.classList.add('hidden');
  btnPrint.disabled = true;
  diagnosticContent.classList.add('hidden');
  emptyResults.classList.remove('hidden');

  if (currentMode === 'camera') {
    outputCanvas.classList.add('hidden');
    resultActions.classList.add('hidden');
    startCamera();
  } else {
    outputCanvas.classList.add('hidden');
    resultActions.classList.add('hidden');
    uploadDropzone.classList.remove('hidden');
  }
});

btnPrint.addEventListener('click', () => window.print());

// Render Diagnostic Results
function renderDiagnostic(analysis, colorimetry) {
  const shapeData = FACE_SHAPES[analysis.shape];
  const toneData = UNDERTONES[colorimetry.undertone];

  emptyResults.classList.add('hidden');
  diagnosticContent.classList.remove('hidden');

  document.getElementById('shapeTitle').textContent = shapeData.name;
  document.getElementById('shapeTagline').textContent = shapeData.tagline;
  document.getElementById('shapeConfidence').textContent = `${analysis.confidence}%`;
  document.getElementById('shapeDescription').textContent = shapeData.description;
  document.getElementById('shapeGoal').textContent = shapeData.goal;

  // Metrics
  const { metrics } = analysis;
  document.getElementById('metricRatioLC').textContent = `${metrics.lengthToWidth} : 1`;
  document.getElementById('metricRatioFJ').textContent = `${metrics.foreheadToJaw} : 1`;
  document.getElementById('metricJawAngle').textContent = `${metrics.jawAngle}°`;
  document.getElementById('metricSymmetry').textContent = `${metrics.symmetryPct}%`;

  // Thirds
  document.getElementById('barUpper').style.width = `${metrics.thirdsPct.superior}%`;
  document.getElementById('valUpper').textContent = `${metrics.thirdsPct.superior}%`;
  document.getElementById('barMiddle').style.width = `${metrics.thirdsPct.medio}%`;
  document.getElementById('valMiddle').textContent = `${metrics.thirdsPct.medio}%`;
  document.getElementById('barLower').style.width = `${metrics.thirdsPct.inferior}%`;
  document.getElementById('valLower').textContent = `${metrics.thirdsPct.inferior}%`;

  // Colorimetry
  document.getElementById('skinSwatch').style.backgroundColor = colorimetry.hex;
  document.getElementById('undertoneTitle').textContent = toneData.name;
  document.getElementById('undertoneDesc').textContent = toneData.description;
  document.getElementById('undertoneMetals').textContent = toneData.metals;
  document.getElementById('undertoneHair').textContent = toneData.hairColors;

  const paletteRow = document.getElementById('paletteRow');
  paletteRow.innerHTML = '';
  for (const hex of toneData.palette) {
    const dot = document.createElement('div');
    dot.className = 'palette-dot';
    dot.style.backgroundColor = hex;
    dot.title = hex;
    paletteRow.appendChild(dot);
  }

  renderRecommendations(shapeData);
}

function renderRecommendations(shapeData) {
  const { recommendations } = shapeData;
  recCards.innerHTML = '';

  const addListCard = (title, items, fullWidth = false, extraClass = '') => {
    if (!items || items.length === 0) return;
    const card = document.createElement('div');
    card.className = `rec-card ${fullWidth ? 'full-width' : ''} ${extraClass}`;
    card.innerHTML = `
      <h4>${title}</h4>
      <ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>
    `;
    recCards.appendChild(card);
  };

  const addTextCard = (title, text) => {
    const card = document.createElement('div');
    card.className = 'rec-card';
    card.innerHTML = `
      <h4>${title}</h4>
      <p>${text}</p>
    `;
    recCards.appendChild(card);
  };

  if (currentStyleFilter === 'todos' || currentStyleFilter === 'femenino') {
    addListCard('✂️ Cortes y Peinados (Femenino)', recommendations.cabello.femenino, currentStyleFilter === 'femenino');
  }
  if (currentStyleFilter === 'todos' || currentStyleFilter === 'masculino') {
    addListCard('💈 Cortes y Peinados (Masculino)', recommendations.cabello.masculino, currentStyleFilter === 'masculino');
  }
  if (currentStyleFilter === 'todos' || currentStyleFilter === 'masculino') {
    addListCard('🧔 Diseño de Barba', recommendations.barba);
  }
  if (currentStyleFilter === 'todos' || currentStyleFilter === 'femenino') {
    addTextCard('💄 Maquillaje & Contouring', recommendations.maquillaje);
  }

  addTextCard('👁️ Diseño de Cejas', recommendations.cejas);
  addTextCard('👓 Gafas y Monturas', recommendations.gafas);
  addListCard('⚠️ Qué conviene evitar', recommendations.evitar, true, 'avoid-card');
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentStyleFilter = btn.dataset.style;
    if (lastState) {
      renderRecommendations(FACE_SHAPES[lastState.analysis.shape]);
    }
  });
});

function showWarning(msg) {
  poseWarning.textContent = msg;
  poseWarning.classList.remove('hidden');
}

// Start initialization
initFaceLandmarker();
