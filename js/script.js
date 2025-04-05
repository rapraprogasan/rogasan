document.addEventListener("DOMContentLoaded", function () {
    // Ensure lightbox is hidden
    let lightbox = document.getElementById("lightbox");
    if (lightbox) {
        lightbox.style.display = "none";
    }

    // Ensure modal is hidden
    let modal = document.getElementById("imageModal");
    if (modal) {
        modal.style.display = "none";
    }
});
function openModal(imageSrc) {
    let modal = document.getElementById("imageModal");
    let fullImage = document.getElementById("fullImage");

    fullImage.src = imageSrc;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

function toggleDescription(id) {
    var desc = document.getElementById(id);
    if (desc.style.display === "none" || desc.style.display === "") {
        desc.style.display = "block";
    } else {
        desc.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".gallery-container img");
    let lightbox = document.getElementById("lightbox");

    // If lightbox does not exist, create it dynamically
    if (!lightbox) {
        lightbox = document.createElement("div");
        lightbox.id = "lightbox";
        lightbox.className = "lightbox";
        lightbox.style.display = "none"; // Hide by default
        document.body.appendChild(lightbox);

        const img = document.createElement("img");
        img.id = "lightboxImg";
        lightbox.appendChild(img);

        const closeBtn = document.createElement("span");
        closeBtn.innerHTML = "&times;";
        closeBtn.className = "close";
        lightbox.appendChild(closeBtn);

        closeBtn.addEventListener("click", function () {
            lightbox.style.display = "none";
        });

        lightbox.addEventListener("click", function (e) {
            if (e.target !== img) {
                lightbox.style.display = "none";
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                lightbox.style.display = "none";
            }
        });
    }

    const lightboxImg = document.getElementById("lightboxImg");

    images.forEach((image) => {
        image.addEventListener("click", (e) => {
            e.preventDefault();
            lightboxImg.src = image.src;
            lightbox.style.display = "flex";
        });
    });

    // Fix black screen issue on refresh or page navigation
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            lightbox.style.display = "none";
        }
    });

    window.addEventListener("beforeunload", function () {
        lightbox.style.display = "none";
    });
});
window.addEventListener("beforeunload", function () {
    let lightbox = document.getElementById("lightbox");
    let modal = document.getElementById("imageModal");

    if (lightbox) lightbox.style.display = "none";
    if (modal) modal.style.display = "none";
});
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll(".fullscreen-img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");

    // Loop through all images and add click event
    images.forEach(image => {
        image.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
        });
    });

    // Close the lightbox when clicking outside the image
    lightbox.addEventListener("click", function (e) {
        if (e.target !== lightboxImg) {
            closeLightbox();
        }
    });

    // Close lightbox when pressing "Escape" key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });
});

// Function to close the lightbox
function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}
// Simple category filtering
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // In a real implementation, you would filter games here
    });
});
