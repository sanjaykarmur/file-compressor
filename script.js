const MAX_SIZE = 50 * 1024 * 1024;

const imageInput = document.getElementById("imageInput");
const browseBtn = document.getElementById("browseBtn");
const dropArea = document.getElementById("dropArea");

const previewSection = document.getElementById("previewSection");
const previewImage = document.getElementById("previewImage");

const fileName = document.getElementById("fileName");
const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const savedPercent = document.getElementById("savedPercent");

const qualitySlider = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const resizeWidth = document.getElementById("resizeWidth");

const compressBtn = document.getElementById("compressBtn");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;
let compressedBlob = null;

browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    imageInput.click();
});

imageInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {

    e.preventDefault();

    dropArea.classList.remove("dragover");

    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }

});

qualitySlider.addEventListener("input", () => {
    qualityValue.textContent = qualitySlider.value + "%";
});

function handleFile(file) {

    if (!file.type.startsWith("image/")) {
        alert("Please select an image.");
        return;
    }

    if (file.size > MAX_SIZE) {
        alert("Maximum supported file size is 50 MB.");
        return;
    }

    selectedFile = file;

    fileName.textContent = file.name;

    originalSize.textContent =
        formatBytes(file.size);

    compressedSize.textContent = "-";

    savedPercent.textContent = "-";

    downloadBtn.style.display = "none";

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewSection.style.display = "block";

    };

    reader.readAsDataURL(file);

}

function formatBytes(bytes) {

    if (bytes < 1024)
        return bytes + " B";

    if (bytes < 1024 * 1024)
        return (bytes / 1024).toFixed(2) + " KB";

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

}

compressBtn.addEventListener("click", compressImage);

function compressImage() {

    if (!selectedFile) {
        alert("Please select an image first.");
        return;
    }

    const img = new Image();

    img.onload = function () {

        let width = img.width;
        let height = img.height;

        const newWidth = parseInt(resizeWidth.value);

        if (!isNaN(newWidth) && newWidth > 0 && newWidth < width) {

            height = Math.round((height * newWidth) / width);
            width = newWidth;

        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);

        const quality = qualitySlider.value / 100;

        let mime = "image/jpeg";

        if (selectedFile.type === "image/webp") {
            mime = "image/webp";
        }

        canvas.toBlob(function(blob) {

            if (!blob) {
                alert("Compression failed.");
                return;
            }

            compressedBlob = blob;

            compressedSize.textContent =
                formatBytes(blob.size);

            const saved =
                ((selectedFile.size - blob.size) /
                selectedFile.size * 100);

            savedPercent.textContent =
                saved.toFixed(1) + "%";

            const url =
                URL.createObjectURL(blob);

            downloadBtn.href = url;

            downloadBtn.download =
                "compressed_" + selectedFile.name;

            downloadBtn.style.display =
                "inline-block";

        }, mime, quality);

    };

    img.src = URL.createObjectURL(selectedFile);

}

// Improve download button behavior
downloadBtn.addEventListener("click", () => {

    setTimeout(() => {

        if (downloadBtn.href.startsWith("blob:")) {
            URL.revokeObjectURL(downloadBtn.href);
        }

    }, 3000);

});

// Reset UI
function resetUI() {

    selectedFile = null;
    compressedBlob = null;

    imageInput.value = "";

    previewImage.src = "";

    fileName.textContent = "-";
    originalSize.textContent = "-";
    compressedSize.textContent = "-";
    savedPercent.textContent = "-";

    previewSection.style.display = "none";

    downloadBtn.style.display = "none";

}

// Better error handling
window.addEventListener("error", function (e) {

    console.error(e.error);

});

// Allow clicking anywhere in upload box
dropArea.addEventListener("click", () => {
    imageInput.click();
});

// Prevent browser opening dropped image
["dragenter","dragover","dragleave","drop"].forEach(eventName => {

    document.body.addEventListener(eventName, function(e){
        e.preventDefault();
        e.stopPropagation();
    });

});

// Keyboard shortcut (Ctrl + O)
document.addEventListener("keydown", function(e){

    if(e.ctrlKey && e.key.toLowerCase()==="o"){

        e.preventDefault();
        imageInput.click();

    }

});

// Prevent selecting multiple files
imageInput.removeAttribute("multiple");

// Show selected quality
qualityValue.textContent = qualitySlider.value + "%";

// Console message
console.log("Matrix Image Compressor Ready");dropArea.addEventListener("click", () => {
    imageInput.click();
});
