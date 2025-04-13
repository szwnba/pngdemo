// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualityInput = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 存储原始图片数据
let originalImageData = null;

// 监听文件输入变化
fileInput.addEventListener('change', handleFileSelect);

// 监听拖拽事件
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

// 点击上传区域触发文件选择
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// 监听压缩质量滑块变化
qualityInput.addEventListener('input', () => {
    qualityValue.textContent = `${qualityInput.value}%`;
    if (originalImageData) {
        compressImage(originalImageData, qualityInput.value / 100);
    }
});

// 处理文件选择
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// 处理文件
function handleFile(file) {
    // 检查文件类型
    if (!file.type.match('image.*')) {
        alert('请选择图片文件！');
        return;
    }

    // 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
        // 显示原始图片
        originalImage.src = e.target.result;
        originalSize.textContent = formatFileSize(file.size);
        
        // 存储原始图片数据
        originalImageData = e.target.result;
        
        // 初始压缩
        compressImage(e.target.result, qualityInput.value / 100);
        
        // 启用下载按钮
        downloadBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(imageData, quality) {
    const img = new Image();
    img.onload = () => {
        // 创建Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置Canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0);
        
        // 压缩并获取压缩后的数据
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // 显示压缩后的图片
        compressedImage.src = compressedDataUrl;
        
        // 计算压缩后的文件大小
        const compressedSizeInBytes = Math.round((compressedDataUrl.length - compressedDataUrl.indexOf(',') - 1) * 0.75);
        compressedSize.textContent = formatFileSize(compressedSizeInBytes);
    };
    img.src = imageData;
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    if (compressedImage.src) {
        const link = document.createElement('a');
        link.href = compressedImage.src;
        link.download = 'compressed_image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}); 