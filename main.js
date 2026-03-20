// Teachable Machine Model URL
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/oC-44fsN3/";

let model, webcam, maxPredictions;
let isModelLoaded = false;
let currentMode = 'webcam'; // 'webcam' or 'upload'

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const modeWebcamBtn = document.getElementById('mode-webcam');
const modeUploadBtn = document.getElementById('mode-upload');
const webcamContainer = document.getElementById('webcam-container');
const uploadContainer = document.getElementById('upload-container');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const resultSection = document.getElementById('result-section');
const labelContainer = document.getElementById('label-container');
const resultMessage = document.getElementById('result-message');
const webcamLoader = document.getElementById('webcam-loader');

/**
 * Initialize the Teachable Machine model
 */
async function initModel() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        isModelLoaded = true;
        
        if (webcamLoader) webcamLoader.classList.add('hidden');
        console.log("Model loaded successfully");
    } catch (error) {
        console.error("Failed to load model:", error);
        if (webcamLoader) webcamLoader.textContent = "모델 로드 실패. 새로고침 해주세요.";
    }
}

/**
 * Setup and start the webcam
 */
async function setupWebcam() {
    if (webcam) return;

    const flip = true;
    webcam = new tmImage.Webcam(400, 400, flip);
    await webcam.setup();
    await webcam.play();
    webcamContainer.appendChild(webcam.canvas);
}

/**
 * Prediction loop for webcam
 */
async function webcamLoop() {
    if (currentMode !== 'webcam') return;
    
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

/**
 * Run prediction on an image or canvas
 */
async function predict(inputElement) {
    if (!model) return;

    const predictions = await model.predict(inputElement);
    displayResults(predictions);
}

/**
 * Display prediction results in the UI
 */
function displayResults(predictions) {
    labelContainer.innerHTML = "";
    
    // Sort predictions by probability descending
    predictions.sort((a, b) => b.probability - a.probability);

    predictions.forEach(prediction => {
        const percentage = (prediction.probability * 100).toFixed(0);
        
        const row = document.createElement('div');
        row.className = 'prediction-row';
        row.innerHTML = `
            <div class="prediction-label">
                <span>${prediction.className}</span>
                <span>${percentage}%</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        labelContainer.appendChild(row);
    });

    // Set result message based on the top prediction
    const topResult = predictions[0];
    if (topResult.probability > 0.5) {
        resultMessage.textContent = `당신은 ${topResult.className}상을 닮으셨네요!`;
    } else {
        resultMessage.textContent = "어떤 동물을 닮았는지 분석 중입니다...";
    }
}

// --- Event Listeners ---

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = isDark ? '다크 모드' : '라이트 모드';
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '라이트 모드' : '다크 모드';

// Mode Switching
modeWebcamBtn.addEventListener('click', async () => {
    currentMode = 'webcam';
    modeWebcamBtn.classList.add('active');
    modeUploadBtn.classList.remove('active');
    webcamContainer.classList.remove('hidden');
    uploadContainer.classList.add('hidden');
    resultSection.classList.add('hidden');
    retryBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    
    if (isModelLoaded) await setupWebcam();
});

modeUploadBtn.addEventListener('click', () => {
    currentMode = 'upload';
    modeUploadBtn.classList.add('active');
    modeWebcamBtn.classList.remove('active');
    uploadContainer.classList.remove('hidden');
    webcamContainer.classList.add('hidden');
    resultSection.classList.add('hidden');
    retryBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    
    if (webcam) {
        webcam.stop();
        const canvas = webcamContainer.querySelector('canvas');
        if (canvas) canvas.remove();
        webcam = null;
    }
});

// Image Upload Handling
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.classList.remove('hidden');
        uploadContainer.querySelector('.upload-label').classList.add('hidden');
    };
    reader.readAsDataURL(file);
});

// Start Analysis
startBtn.addEventListener('click', async () => {
    if (!isModelLoaded) {
        alert("모델이 아직 로드되지 않았습니다. 잠시만 기다려주세요.");
        return;
    }

    resultSection.classList.remove('hidden');
    
    if (currentMode === 'webcam') {
        if (!webcam) await setupWebcam();
        window.requestAnimationFrame(webcamLoop);
        startBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
    } else {
        if (!imagePreview.src || imagePreview.classList.contains('hidden')) {
            alert("사진을 먼저 업로드해주세요.");
            return;
        }
        await predict(imagePreview);
        startBtn.classList.add('hidden');
        retryBtn.classList.remove('hidden');
    }
});

// Retry
retryBtn.addEventListener('click', () => {
    resultSection.classList.add('hidden');
    retryBtn.classList.add('hidden');
    startBtn.classList.remove('hidden');
    
    if (currentMode === 'upload') {
        imagePreview.classList.add('hidden');
        imagePreview.src = "";
        uploadContainer.querySelector('.upload-label').classList.remove('hidden');
        imageUpload.value = "";
    }
});

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    initModel().then(() => {
        // Automatically start webcam setup if in webcam mode
        if (currentMode === 'webcam') {
            setupWebcam().catch(err => console.error("Webcam setup failed:", err));
        }
    });
});
