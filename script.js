// ===========================================
// MAIN APPLICATION LOGIC
// ===========================================

// DOM Elements
const brandGrid = document.getElementById('brandGrid');
const mobileList = document.getElementById('mobileList');
const deviceCount = document.getElementById('deviceCount');
const searchInput = document.getElementById('searchInput');
const activeBar = document.getElementById('activeBar');
const activeName = document.getElementById('activeName');
const activeSpecs = document.getElementById('activeSpecs');

// Sliders
const camSens = document.getElementById('camSens');
const adsSens = document.getElementById('adsSens');
const gyroSens = document.getElementById('gyroSens');
const camPer = document.getElementById('camPer');
const adsPer = document.getElementById('adsPer');
const gyroVal = document.getElementById('gyroVal');

// Meters
const recoilVal = document.getElementById('recoilVal');
const recoilBar = document.getElementById('recoilBar');
const fpsVal = document.getElementById('fpsVal');
const fpsBar = document.getElementById('fpsBar');
const aimVal = document.getElementById('aimVal');
const aimBar = document.getElementById('aimBar');
const lagVal = document.getElementById('lagVal');
const lagBar = document.getElementById('lagBar');

// Buttons
const generateBtn = document.getElementById('generateBtn');
const codeBox = document.getElementById('codeBox');
const pubgCode = document.getElementById('pubgCode');

// State
let currentBrand = 'apple';
let selectedDevice = null;
let settings = {
    camera: 65,
    ads: 58,
    gyro: 280
};

// Brands
const brands = [
    { id: 'apple', name: 'Apple', icon: 'fab fa-apple' },
    { id: 'samsung', name: 'Samsung', icon: 'fas fa-mobile' },
    { id: 'xiaomi', name: 'Xiaomi', icon: 'fas fa-robot' },
    { id: 'oneplus', name: 'OnePlus', icon: 'fas fa-bolt' },
    { id: 'vivo', name: 'Vivo', icon: 'fas fa-camera' },
    { id: 'oppo', name: 'Oppo', icon: 'fas fa-star' },
    { id: 'google', name: 'Google', icon: 'fab fa-google' },
    { id: 'asus', name: 'ASUS', icon: 'fas fa-gamepad' },
    { id: 'tecno', name: 'Tecno', icon: 'fas fa-phone' },
    { id: 'poco', name: 'Poco', icon: 'fas fa-flash' }
];

// Render Brands
function renderBrands() {
    let html = '';
    brands.forEach((brand, index) => {
        html += `<div class="brand-btn ${index === 0 ? 'active' : ''}" data-brand="${brand.id}">
            <i class="${brand.icon}"></i>
            <span>${brand.name}</span>
        </div>`;
    });
    brandGrid.innerHTML = html;
    
    document.querySelectorAll('.brand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.brand-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentBrand = this.dataset.brand;
            searchInput.value = '';
            renderMobileList(currentBrand, '');
            
            // Scroll to mobile list
            setTimeout(() => {
                document.querySelector('.mobile-list').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
        });
    });
}

// Render Mobile List
function renderMobileList(brand, search = '') {
    const devices = deviceDB[brand] || [];
    const filtered = devices.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase())
    );
    
    deviceCount.innerText = `${filtered.length} devices`;
    
    let html = '';
    filtered.forEach((device, index) => {
        const isSelected = selectedDevice && selectedDevice.name === device.name;
        html += `<div class="mobile-item ${isSelected ? 'selected' : ''}" data-device='${JSON.stringify(device)}'>
            <div class="mobile-icon">
                <i class="fas fa-${brand === 'apple' ? 'apple' : 'mobile-alt'}"></i>
            </div>
            <div class="mobile-info">
                <div class="mobile-name">${device.name}</div>
                <div class="mobile-spec">
                    <span>${device.ram}</span>
                    <span>• ${device.touch}Hz</span>
                    <span>• ${device.display}Hz</span>
                </div>
            </div>
            ${isSelected ? '<i class="fas fa-check-circle" style="color: #00ffee; font-size: 14px;"></i>' : ''}
        </div>`;
    });
    
    if (filtered.length === 0) {
        html = '<div style="color: rgba(255,255,255,0.4); text-align: center; padding: 30px;">📱 No devices found</div>';
    }
    
    mobileList.innerHTML = html;
    
    document.querySelectorAll('.mobile-item').forEach(el => {
        el.addEventListener('click', function(e) {
            const device = JSON.parse(this.dataset.device);
            selectDevice(device);
            
            // Auto scroll to meters
            setTimeout(() => {
                document.querySelector('.meters-grid').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 200);
        });
    });
}

// Select Device
function selectDevice(device) {
    selectedDevice = device;
    
    document.querySelectorAll('.mobile-item').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    activeBar.style.display = 'flex';
    activeName.innerText = device.name;
    activeSpecs.innerText = `${device.chipset} • ${device.ram} • ${device.touch}Hz Touch`;
    
    optimizeSettings(device);
    updateAllMeters();
}

// Optimize Settings
function optimizeSettings(device) {
    let cam = 65;
    let ads = 58;
    let gy = 280;
    
    if (device.touch >= 360) {
        cam += 8; ads += 7; gy += 30;
    } else if (device.touch >= 240) {
        cam += 3; ads += 3; gy += 10;
    } else {
        cam -= 5; ads -= 5; gy -= 30;
    }
    
    if (device.performance >= 90) {
        cam += 5; ads += 5; gy += 20;
    } else if (device.performance <= 70) {
        cam -= 5; ads -= 5; gy -= 20;
    }
    
    settings.camera = Math.min(100, Math.max(30, cam));
    settings.ads = Math.min(100, Math.max(30, ads));
    settings.gyro = Math.min(400, Math.max(150, gy));
    
    camSens.value = settings.camera;
    adsSens.value = settings.ads;
    gyroSens.value = settings.gyro;
    
    camPer.innerText = settings.camera + '%';
    adsPer.innerText = settings.ads + '%';
    gyroVal.innerText = settings.gyro;
}

// Update Meters
function updateAllMeters() {
    if (!selectedDevice) {
        recoilVal.innerText = '0%'; recoilBar.style.width = '0%';
        fpsVal.innerText = '0%'; fpsBar.style.width = '0%';
        aimVal.innerText = '0%'; aimBar.style.width = '0%';
        lagVal.innerText = '0ms'; lagBar.style.width = '0%';
        return;
    }
    
    // Recoil Control
    const recoil = Math.min(100, Math.round(
        (settings.gyro / 400) * 40 + 
        (settings.ads / 100) * 35 + 
        (selectedDevice.performance / 100) * 25
    ));
    
    // FPS Stability
    const fps = Math.min(100, Math.round(
        (selectedDevice.performance / 100) * 70 + 
        (30 - ((settings.camera + settings.ads) / 200) * 20)
    ));
    
    // Aim Accuracy
    const camDiff = Math.abs(settings.camera - 65) / 65;
    const adsDiff = Math.abs(settings.ads - 58) / 58;
    const gyroDiff = Math.abs(settings.gyro - 280) / 280;
    const aim = Math.min(100, Math.round(85 - (camDiff * 15 + adsDiff * 15 + gyroDiff * 10)));
    
    // Input Lag
    const lag = Math.round(25 + (30 - selectedDevice.touch / 12) + (settings.camera + settings.ads) / 12);
    const lagPercent = Math.min(100, Math.round((lag / 65) * 100));
    
    recoilVal.innerText = recoil + '%'; recoilBar.style.width = recoil + '%';
    fpsVal.innerText = fps + '%'; fpsBar.style.width = fps + '%';
    aimVal.innerText = aim + '%'; aimBar.style.width = aim + '%';
    lagVal.innerText = lag + 'ms'; lagBar.style.width = lagPercent + '%';
}

// Slider Events
camSens.addEventListener('input', function() {
    settings.camera = parseInt(this.value);
    camPer.innerText = this.value + '%';
    updateAllMeters();
});

adsSens.addEventListener('input', function() {
    settings.ads = parseInt(this.value);
    adsPer.innerText = this.value + '%';
    updateAllMeters();
});

gyroSens.addEventListener('input', function() {
    settings.gyro = parseInt(this.value);
    gyroVal.innerText = this.value;
    updateAllMeters();
});

// Search
searchInput.addEventListener('input', function() {
    renderMobileList(currentBrand, this.value);
});

// Generate Code
generateBtn.addEventListener('click', function() {
    if (!selectedDevice) {
        alert('⚠️ Please select your device first!');
        return;
    }
    
    const code = `╔════════════════════════╗
║  🔫 PUBG ORIGINAL SETTINGS
╠════════════════════════╣
║ 📱 ${selectedDevice.name}
║ 📊 RECOIL: ${recoilVal.innerText}
║
║ 🎯 CAMERA: ${settings.camera}%
║ 🎯 ADS: ${settings.ads}%
║ 🎯 GYRO: ${settings.gyro}
║
║ 🔍 2x: ${Math.round(settings.ads * 0.85)}%
║ 🔍 3x: ${Math.round(settings.ads * 0.8)}%
║ 🔍 4x: ${Math.round(settings.ads * 0.75)}%
║ 🔍 6x: ${Math.round(settings.ads * 0.7)}%
║
║ ✅ 100% SAFE • NO BAN
╚════════════════════════╝`;
    
    pubgCode.innerText = code;
    codeBox.classList.add('show');
    
    // Scroll to code
    setTimeout(() => {
        codeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
});

// Initialize
renderBrands();
renderMobileList('apple', '');
setInterval(updateAllMeters, 100);