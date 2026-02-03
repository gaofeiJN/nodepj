// avatar.js
class AvatarManager {
    constructor() {
        // 用户信息（实际应用中应从登录状态获取）
        this.userId = this.getUserId();
        this.avatarUrl = null;
        this.defaultAvatar = 'https://via.placeholder.com/150/667eea/ffffff?text=User';
        this.apiBaseUrl = 'http://localhost:3000/api';
        
        // DOM 元素
        this.elements = {
            avatarPreview: document.getElementById('avatarPreview'),
            avatarInput: document.getElementById('avatarInput'),
            uploadBtn: document.getElementById('uploadBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            resetBtn: document.getElementById('resetBtn'),
            progressContainer: document.getElementById('progressContainer'),
            progressBar: document.getElementById('progressBar'),
            message: document.getElementById('message'),
            cropModal: document.getElementById('cropModal'),
            cropArea: document.getElementById('cropArea'),
            cropPreview: document.getElementById('cropPreview'),
            confirmCrop: document.getElementById('confirmCrop'),
            cancelCrop: document.getElementById('cancelCrop')
        };
        
        // 裁剪相关
        this.currentImage = null;
        this.cropper = null;
        
        this.initialize();
    }
    
    // 初始化
    initialize() {
        this.loadUserAvatar();
        this.setupEventListeners();
    }
    
    // 获取用户ID（这里使用localStorage，实际项目中应根据登录状态获取）
    getUserId() {
        // 从localStorage或cookie获取用户ID
        return localStorage.getItem('userId') || 'user_' + Date.now();
    }
    
    // 加载用户头像
    async loadUserAvatar() {
        try {
            this.showMessage('正在加载头像...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/avatar/${this.userId}`);
            const data = await response.json();
            
            if (data.success && data.data.avatarUrl) {
                this.avatarUrl = data.data.avatarUrl;
                this.updatePreview(this.avatarUrl);
                this.showMessage('头像加载成功', 'success');
            } else {
                this.updatePreview(this.defaultAvatar);
                this.showMessage('使用默认头像', 'info');
            }
        } catch (error) {
            console.error('加载头像失败:', error);
            this.updatePreview(this.defaultAvatar);
            this.showMessage('加载失败，使用默认头像', 'error');
        }
    }
    
    // 更新预览
    updatePreview(imageUrl) {
        const preview = this.elements.avatarPreview;
        preview.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = '用户头像';
        img.onload = () => {
            // 图片加载成功
        };
        img.onerror = () => {
            // 如果图片加载失败，使用默认头像
            img.src = this.defaultAvatar;
        };
        
        preview.appendChild(img);
    }
    
    // 设置事件监听器
    setupEventListeners() {
        // 点击上传按钮触发文件选择
        this.elements.uploadBtn.addEventListener('click', () => {
            this.elements.avatarInput.click();
        });
        
        // 点击预览区域触发文件选择
        this.elements.avatarPreview.addEventListener('click', () => {
            this.elements.avatarInput.click();
        });
        
        // 文件选择变化
        this.elements.avatarInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.validateAndProcessFile(file);
            }
        });
        
        // 删除头像
        this.elements.deleteBtn.addEventListener('click', () => {
            this.deleteAvatar();
        });
        
        // 重置为默认
        this.elements.resetBtn.addEventListener('click', () => {
            this.resetToDefault();
        });
        
        // 确认裁剪
        this.elements.confirmCrop.addEventListener('click', () => {
            this.confirmCrop();
        });
        
        // 取消裁剪
        this.elements.cancelCrop.addEventListener('click', () => {
            this.closeCropModal();
        });
        
        // 拖放上传
        this.setupDragAndDrop();
    }
    
    // 设置拖放上传
    setupDragAndDrop() {
        const preview = this.elements.avatarPreview;
        
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#667eea';
            preview.style.transform = 'scale(1.05)';
        });
        
        preview.addEventListener('dragleave', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#e0e0e0';
            preview.style.transform = 'scale(1)';
        });
        
        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            preview.style.borderColor = '#e0e0e0';
            preview.style.transform = 'scale(1)';
            
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                this.validateAndProcessFile(file);
            } else {
                this.showMessage('请拖放图片文件', 'error');
            }
        });
    }
    
    // 验证并处理文件
    validateAndProcessFile(file) {
        // 验证文件类型
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            this.showMessage('不支持的文件格式，请选择图片文件', 'error');
            return;
        }
        
        // 验证文件大小（5MB）
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            this.showMessage('文件太大，最大支持5MB', 'error');
            return;
        }
        
        // 预览图片
        this.previewImage(file);
        
        // 询问是否裁剪
        if (confirm('是否需要对头像进行裁剪？')) {
            this.openCropModal(file);
        } else {
            this.uploadAvatar(file);
        }
    }
    
    // 预览图片
    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.objectFit = 'cover';
            
            const preview = this.elements.avatarPreview;
            preview.innerHTML = '';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
    
    // 打开裁剪模态框
    openCropModal(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = e.target.result;
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = this.currentImage;
            img.id = 'imageToCrop';
            img.style.maxWidth = '100%';
            
            // 清空裁剪区域并添加图片
            this.elements.cropArea.innerHTML = '';
            this.elements.cropArea.appendChild(img);
            
            // 初始化裁剪器
            if (this.cropper) {
                this.cropper.destroy();
            }
            
            // 使用第三方裁剪库或自定义裁剪逻辑
            // 这里使用简单的裁剪预览
            this.setupBasicCropper(img);
            
            // 显示模态框
            this.elements.cropModal.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }
    
    // 设置基础裁剪器
    setupBasicCropper(img) {
        // 简单实现裁剪预览
        const updatePreview = () => {
            // 这里应该是实际的裁剪逻辑
            // 由于原生JavaScript没有内置的裁剪库，这里使用一个简单的canvas实现
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            
            // 这里应该根据裁剪区域计算实际的图像数据
            // 为了简化，我们只是缩放图片
            ctx.drawImage(img, 0, 0, 200, 200);
            
            this.elements.cropPreview.innerHTML = '';
            const previewImg = document.createElement('img');
            previewImg.src = canvas.toDataURL('image/jpeg', 0.9);
            previewImg.style.width = '100%';
            previewImg.style.height = '100%';
            previewImg.style.objectFit = 'cover';
            this.elements.cropPreview.appendChild(previewImg);
        };
        
        // 初始预览
        setTimeout(updatePreview, 100);
        
        // 监听图片加载
        img.onload = updatePreview;
        
        // 简单的手动调整（实际项目应该使用成熟的裁剪库）
        this.setupManualCrop(img, updatePreview);
    }
    
    // 设置手动裁剪
    setupManualCrop(img, updateCallback) {
        let isDragging = false;
        let startX = 0;
        let startY = 0;
        
        img.style.cursor = 'move';
        
        img.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - img.offsetLeft;
            startY = e.clientY - img.offsetTop;
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const newX = e.clientX - startX;
            const newY = e.clientY - startY;
            
            // 限制在容器内移动
            const container = this.elements.cropArea;
            const maxX = container.clientWidth - img.clientWidth;
            const maxY = container.clientHeight - img.clientHeight;
            
            img.style.left = Math.max(Math.min(newX, maxX), 0) + 'px';
            img.style.top = Math.max(Math.min(newY, maxY), 0) + 'px';
            img.style.position = 'absolute';
            
            updateCallback();
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    // 确认裁剪
    confirmCrop() {
        // 获取裁剪后的图像数据
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        const img = document.getElementById('imageToCrop');
        if (!img) {
            this.showMessage('裁剪失败', 'error');
            return;
        }
        
        // 计算裁剪区域
        const scaleX = img.naturalWidth / img.clientWidth;
        const scaleY = img.naturalHeight / img.clientHeight;
        
        const sx = Math.abs(parseInt(img.style.left) || 0) * scaleX;
        const sy = Math.abs(parseInt(img.style.top) || 0) * scaleY;
        const sWidth = 200 * scaleX;
        const sHeight = 200 * scaleY;
        
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 200, 200);
        
        // 转换为Blob并上传
        canvas.toBlob((blob) => {
            const file = new File([blob], 'avatar_cropped.jpg', { type: 'image/jpeg' });
            this.closeCropModal();
            this.uploadAvatar(file);
        }, 'image/jpeg', 0.9);
    }
    
    // 关闭裁剪模态框
    closeCropModal() {
        this.elements.cropModal.style.display = 'none';
        this.elements.cropArea.innerHTML = '';
        this.elements.cropPreview.innerHTML = '';
        if (this.cropper) {
            this.cropper.destroy();
            this.cropper = null;
        }
    }
    
    // 上传头像
    async uploadAvatar(file) {
        try {
            this.showProgress(true);
            this.showMessage('正在上传头像...', 'info');
            
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('userId', this.userId);
            
            const xhr = new XMLHttpRequest();
            
            // 进度事件
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    this.updateProgress(percentComplete);
                }
            });
            
            // 完成事件
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        this.avatarUrl = response.data.avatarUrl;
                        this.updatePreview(this.avatarUrl);
                        this.showMessage('头像上传成功', 'success');
                        this.saveToLocalStorage(file);
                    } else {
                        this.showMessage(response.message || '上传失败', 'error');
                    }
                } else {
                    this.showMessage(`上传失败: ${xhr.status}`, 'error');
                }
                this.showProgress(false);
            });
            
            // 错误事件
            xhr.addEventListener('error', () => {
                this.showMessage('网络错误，上传失败', 'error');
                this.showProgress(false);
            });
            
            xhr.open('POST', `${this.apiBaseUrl}/avatar/upload`);
            xhr.send(formData);
            
        } catch (error) {
            console.error('上传失败:', error);
            this.showMessage('上传失败: ' + error.message, 'error');
            this.showProgress(false);
        }
    }
    
    // 删除头像
    async deleteAvatar() {
        if (!confirm('确定要删除头像吗？')) {
            return;
        }
        
        try {
            this.showMessage('正在删除头像...', 'info');
            
            const response = await fetch(`${this.apiBaseUrl}/avatar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'User-ID': this.userId
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.avatarUrl = null;
                this.updatePreview(this.defaultAvatar);
                this.showMessage('头像删除成功', 'success');
                this.removeFromLocalStorage();
            } else {
                this.showMessage(data.message || '删除失败', 'error');
            }
        } catch (error) {
            console.error('删除失败:', error);
            this.showMessage('删除失败: ' + error.message, 'error');
        }
    }
    
    // 重置为默认头像
    resetToDefault() {
        this.updatePreview(this.defaultAvatar);
        this.showMessage('已重置为默认头像', 'success');
    }
    
    // 保存到本地存储（离线时使用）
    saveToLocalStorage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const avatarData = {
                url: e.target.result,
                timestamp: Date.now(),
                userId: this.userId
            };
            localStorage.setItem(`avatar_${this.userId}`, JSON.stringify(avatarData));
        };
        reader.readAsDataURL(file);
    }
    
    // 从本地存储移除
    removeFromLocalStorage() {
        localStorage.removeItem(`avatar_${this.userId}`);
    }
    
    // 显示/隐藏进度条
    showProgress(show) {
        this.elements.progressContainer.style.display = show ? 'block' : 'none';
        if (!show) {
            this.updateProgress(0);
        }
    }
    
    // 更新进度条
    updateProgress(percent) {
        this.elements.progressBar.style.width = percent + '%';
    }
    
    // 显示消息
    showMessage(text, type = 'info') {
        const message = this.elements.message;
        message.textContent = text;
        message.className = 'message ' + type;
        message.style.display = 'block';
        
        // 自动隐藏
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    }
    
    // 获取图片信息
    getImageInfo(file) {
        return new Promise((resolve) => {
            const img = new Image();
            const reader = new FileReader();
            
            reader.onload = (e) => {
                img.src = e.target.result;
                img.onload = () => {
                    resolve({
                        width: img.width,
                        height: img.height,
                        size: file.size,
                        type: file.type
                    });
                };
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化头像管理器
    const avatarManager = new AvatarManager();
    
    // 全局错误处理
    window.addEventListener('error', (e) => {
        console.error('全局错误:', e.error);
        avatarManager.showMessage('发生错误: ' + e.message, 'error');
    });
    
    // 网络状态检测
    window.addEventListener('online', () => {
        avatarManager.showMessage('网络已连接', 'success');
    });
    
    window.addEventListener('offline', () => {
        avatarManager.showMessage('网络已断开，部分功能可能受限', 'error');
    });
    
    // 添加到全局，方便调试
    window.avatarManager = avatarManager;
});