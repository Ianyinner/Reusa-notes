
    // Access the camera
const video = document.getElementById('camera-feed');
const captureButton = document.getElementById('capture-button');
const galleryButton = document.getElementById('gallery-button');
const modal = document.getElementById('modal');
const capturedImage = document.getElementById('captured-image');
const closeModal = document.getElementById('close-modal');
const gallery = document.getElementById('gallery');
const galleryImages = document.getElementById('gallery-images');
const backButton = document.getElementById('back-button');

let capturedNotes = JSON.parse(localStorage.getItem('capturedNotes')) || [];

// Load stored notes on page load
document.addEventListener('DOMContentLoaded', () => {
  updateGallery();
});

// Access the camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error('Error accessing the camera:', error);
    alert('Unable to access the camera. Please ensure you have granted permission.');
  });

// Capture the note
captureButton.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // Set canvas dimensions to match the video feed
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Crop the image
  const frameWidth = canvas.width * 0.6;
  const frameHeight = canvas.height * 0.6;
  const frameX = (canvas.width - frameWidth) / 2;
  const frameY = (canvas.height - frameHeight) / 2;

  const croppedCanvas = document.createElement('canvas');
  const croppedContext = croppedCanvas.getContext('2d');
  croppedCanvas.width = frameWidth;
  croppedCanvas.height = frameHeight;
  croppedContext.drawImage(canvas, frameX, frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);

  const imageDataUrl = croppedCanvas.toDataURL('image/png');

  const noteTitle = prompt('Enter a title for this note:', `Note ${capturedNotes.length + 1}`);
  if (noteTitle) {
    // Save the note
    capturedNotes.push({ src: imageDataUrl, name: noteTitle });
    localStorage.setItem('capturedNotes', JSON.stringify(capturedNotes)); // Save to local storage

    // Display captured image in modal
    capturedImage.src = imageDataUrl;
    modal.style.display = 'flex';
  }
});

// Close the modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Open the gallery
galleryButton.addEventListener('click', () => {
  gallery.style.display = 'block';
  updateGallery();
});

// Update the gallery with stored notes
function updateGallery() {
  galleryImages.innerHTML = '';
  capturedNotes.forEach((note, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = note.src;
    img.alt = note.name;

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = note.name;

        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = '✎';
        editButton.addEventListener('click', (e) => {
          e.stopPropagation();
          const editMenu = galleryItem.querySelector('.edit-menu');
          editMenu.style.display = editMenu.style.display === 'flex' ? 'none' : 'flex';
        });

        const editMenu = document.createElement('div');
        editMenu.className = 'edit-menu';

    const renameButton = document.createElement('button');
    renameButton.textContent = 'Rename';
    renameButton.addEventListener('click', () => {
      const newName = prompt('Enter a new name for this note:', note.name);
      if (newName) {
        note.name = newName;
        localStorage.setItem('capturedNotes', JSON.stringify(capturedNotes)); // Update local storage
        updateGallery();
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      galleryItem.classList.add('fade-out');
      setTimeout(() => {
        capturedNotes.splice(index, 1);
        localStorage.setItem('capturedNotes', JSON.stringify(capturedNotes)); // Remove from local storage
        updateGallery();
      }, 300);
    });

        editMenu.appendChild(renameButton);
        editMenu.appendChild(deleteButton);

    galleryItem.appendChild(img);
    galleryItem.appendChild(title);
        galleryItem.appendChild(editButton);
        galleryItem.appendChild(editMenu);
    galleryImages.appendChild(galleryItem);

        // Enlarge animation on click
        galleryItem.addEventListener('click', () => {
          img.classList.toggle('enlarge');
        });
  });
}

// Back to camera
backButton.addEventListener('click', () => {
  gallery.style.display = 'none';
});
