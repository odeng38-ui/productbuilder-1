// Teachable Machine URL
const URL = "https://teachablemachine.withgoogle.com/models/OSrmO5xPY/";

let model, webcam, maxPredictions;
let isWebcamMode = false;

// Load the image model
async function initModel() {
    if (model) return;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Theme Toggle Logic
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateToggleText(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleText(newTheme);
});

function updateToggleText(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// Tab Switching
const uploadTab = document.getElementById('upload-tab');
const webcamTab = document.getElementById('webcam-tab');
const uploadSection = document.getElementById('upload-section');
const webcamSection = document.getElementById('webcam-section');

uploadTab.addEventListener('click', () => {
    stopWebcam();
    uploadTab.classList.add('active');
    webcamTab.classList.remove('active');
    uploadSection.style.display = 'block';
    webcamSection.style.display = 'none';
    resultArea.style.display = 'none';
});

webcamTab.addEventListener('click', () => {
    webcamTab.classList.add('active');
    uploadTab.classList.remove('active');
    webcamSection.style.display = 'block';
    uploadSection.style.display = 'none';
    resultArea.style.display = 'none';
});

// Image Upload Logic
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadArea = document.getElementById('upload-area');
const uploadText = document.querySelector('.upload-text');
const loading = document.getElementById('loading');
const resultArea = document.getElementById('result-area');
const labelContainerElement = document.getElementById('label-container');
const resultTitle = document.getElementById('result-title');
const retryBtn = document.getElementById('retry-btn');

uploadArea.addEventListener('click', () => imageUpload.click());

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            isWebcamMode = false;
            await predict(imagePreview);
        };
        reader.readAsDataURL(file);
    }
});

// Webcam Logic
const webcamStartBtn = document.getElementById('webcam-start');
const webcamContainer = document.getElementById('webcam-container');

webcamStartBtn.addEventListener('click', async () => {
    loading.style.display = 'block';
    webcamStartBtn.style.display = 'none';
    
    await initModel();
    
    const flip = true;
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    
    loading.style.display = 'none';
    webcamContainer.appendChild(webcam.canvas);
    isWebcamMode = true;
    resultArea.style.display = 'block';
    window.requestAnimationFrame(webcamLoop);
});

async function webcamLoop() {
    if (!isWebcamMode) return;
    webcam.update();
    await predict(webcam.canvas);
    window.requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
    isWebcamMode = false;
    if (webcam) {
        webcam.stop();
        webcamContainer.innerHTML = '';
        webcamStartBtn.style.display = 'block';
    }
}

// Prediction Logic
async function predict(inputElement) {
    if (!model) await initModel();
    
    if (!isWebcamMode) {
        loading.style.display = 'block';
        resultArea.style.display = 'none';
    }
    
    const prediction = await model.predict(inputElement);
    
    if (!isWebcamMode) loading.style.display = 'none';
    resultArea.style.display = 'block';
    
    // Sort to find top result
    const sortedPrediction = [...prediction].sort((a, b) => b.probability - a.probability);
    resultTitle.textContent = `당신은 '${sortedPrediction[0].className}' 상입니다!`;
    
    // Update bars
    labelContainerElement.innerHTML = '';
    prediction.forEach(p => {
        const percentage = (p.probability * 100).toFixed(0);
        const barHtml = `
            <div class="bar-container">
                <div class="label-title">
                    <span>${p.className}</span>
                    <span>${percentage}%</span>
                </div>
                <div class="bar-bg">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        labelContainerElement.innerHTML += barHtml;
    });
}

retryBtn.addEventListener('click', () => {
    if (isWebcamMode) {
        stopWebcam();
    }
    window.location.reload();
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--text-color)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = 'var(--button-bg)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = 'var(--button-bg)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = async (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            uploadText.style.display = 'none';
            isWebcamMode = false;
            await predict(imagePreview);
        };
        reader.readAsDataURL(file);
    }
});
