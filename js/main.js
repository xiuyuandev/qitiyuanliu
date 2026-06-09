// 主 JavaScript 文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化导航栏激活状态
    initNavigation();
    
    // 初始化灯箱效果
    initLightbox();
    
    // 初始化图片懒加载
    initLazyLoad();
});

// 初始化导航栏
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 初始化灯箱效果
function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    // 点击图片打开灯箱
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentImageIndex = index;
            openLightbox(img.src, img.alt);
        });
    });
    
    // 关闭灯箱
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // 点击背景关闭
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // 上一页
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImageIndex > 0) {
                currentImageIndex--;
                const img = galleryImages[currentImageIndex];
                openLightbox(img.src, img.alt);
            }
        });
    }
    
    // 下一页
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                const img = galleryImages[currentImageIndex];
                openLightbox(img.src, img.alt);
            }
        });
    });
    
    // 键盘导航
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            currentImageIndex--;
            const img = galleryImages[currentImageIndex];
            openLightbox(img.src, img.alt);
        } else if (e.key === 'ArrowRight' && currentImageIndex < galleryImages.length - 1) {
            currentImageIndex++;
            const img = galleryImages[currentImageIndex];
            openLightbox(img.src, img.alt);
        }
    });
    
    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxCaption.textContent = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 初始化图片懒加载
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // 降级处理
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// 页面跳转函数
function goToPage(pageNum, chapterFile) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', pageNum);
    window.location.href = `${chapterFile}?${urlParams.toString()}`;
}

// 格式化页码显示
function formatPageNumber(pageNum) {
    return String(pageNum).padStart(4, '0');
}

// 获取章节范围
function getChapterRange(chapterNum) {
    const pagesPerChapter = 128;
    const startPage = (chapterNum - 1) * pagesPerChapter + 1;
    const endPage = Math.min(chapterNum * pagesPerChapter, 512);
    return { startPage, endPage };
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 显示加载提示
function showLoading(element) {
    if (element) {
        element.innerHTML = '<span class="loading">加载中</span>';
    }
}

// 隐藏加载提示
function hideLoading(element) {
    if (element) {
        element.innerHTML = '';
    }
}
