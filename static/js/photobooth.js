document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photo-canvas');
    const captureBtn = document.getElementById('capture-btn');
    const retakeBtn = document.getElementById('retake-btn');
    const downloadBtn = document.getElementById('download-btn');
    const ctx = canvas.getContext('2d');
    let currentFilter = 'normal';
    let originalImageData = null;

    // Request camera access
    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        } catch (err) {
            console.error('Error accessing camera:', err);
            alert('Unable to access camera. Please ensure you have granted camera permissions.');
        }
    }

    // Apply filters
    function applyFilter(imageData) {
        const data = imageData.data;

        switch(currentFilter) {
            case 'polaroid':
                // Increase contrast and add warm tint
                for(let i = 0; i < data.length; i += 4) {
                    // Contrast adjustment
                    data[i] = Math.min(255, ((data[i] - 128) * 1.2) + 128 + 15); // Red boost
                    data[i + 1] = Math.min(255, ((data[i + 1] - 128) * 1.1) + 128 + 5); // Green slight boost
                    data[i + 2] = Math.min(255, ((data[i + 2] - 128) * 1.0) + 128 - 5); // Blue reduction
                }
                // Add vignette effect
                addVignette(ctx, canvas.width, canvas.height);
                break;

            case 'vintage':
                for(let i = 0; i < data.length; i += 4) {
                    // Sepia effect
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                }
                break;

            case 'old-photo':
                // Grainy black and white with noise
                for(let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const noise = (Math.random() - 0.5) * 30;
                    const value = Math.min(255, Math.max(0, avg + noise));
                    data[i] = data[i + 1] = data[i + 2] = value;
                }
                break;
        }

        return imageData;
    }

    // Add vignette effect
    function addVignette(ctx, width, height) {
        const gradient = ctx.createRadialGradient(
            width/2, height/2, height/2 * 0.2,
            width/2, height/2, height/2 * 1.1
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
    }

    // Capture photo
    captureBtn.addEventListener('click', () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);

        // Store original image data
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Apply current filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.putImageData(applyFilter(imageData), 0, 0);

        // Add Polaroid frame
        const frameHeight = Math.floor(canvas.height * 0.15);
        ctx.fillStyle = 'white';
        ctx.fillRect(0, canvas.height, canvas.width, frameHeight);

        downloadBtn.disabled = false;
        retakeBtn.style.display = 'inline-block';
        canvas.style.display = 'block';
        video.style.display = 'none';
    });

    // Retake photo
    retakeBtn.addEventListener('click', () => {
        canvas.style.display = 'none';
        video.style.display = 'block';
        downloadBtn.disabled = true;
        retakeBtn.style.display = 'none';
    });

    // Download photo
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = `vintage-photo-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // If photo is taken, reapply filter
            if (originalImageData && canvas.style.display !== 'none') {
                ctx.putImageData(originalImageData, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                ctx.putImageData(applyFilter(imageData), 0, 0);

                // Re-add Polaroid frame
                const frameHeight = Math.floor(canvas.height * 0.15);
                ctx.fillStyle = 'white';
                ctx.fillRect(0, canvas.height, canvas.width, frameHeight);
            }
        });
    });

    startCamera();
});