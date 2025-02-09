
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

    let capturedNotes = [];

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

      // Draw the current frame from the video onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Calculate the frame area (smaller frame)
      const frameWidth = canvas.width * 0.6; // 60% of the canvas width
      const frameHeight = canvas.height * 0.6; // 60% of the canvas height
      const frameX = (canvas.width - frameWidth) / 2; // Center horizontally
      const frameY = (canvas.height - frameHeight) / 2; // Center vertically

      // Crop the image to the frame area
      const croppedCanvas = document.createElement('canvas');
      const croppedContext = croppedCanvas.getContext('2d');
      croppedCanvas.width = frameWidth;
      croppedCanvas.height = frameHeight;
      croppedContext.drawImage(
        canvas,
        frameX, frameY, frameWidth, frameHeight,
        0, 0, frameWidth, frameHeight
      );

      // Convert the canvas image to a data URL
      const imageDataUrl = croppedCanvas.toDataURL('image/png');

      // Prompt the user to title the note
      const noteTitle = prompt('Enter a title for this note:', `Note ${capturedNotes.length + 1}`);
      if (noteTitle) {
        // Save the captured note
        capturedNotes.push({ src: imageDataUrl, name: noteTitle });

        // Display the captured image in the modal
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

    // Update the gallery with captured notes
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
            updateGallery();
          }
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          galleryItem.classList.add('fade-out');
          setTimeout(() => {
            capturedNotes.splice(index, 1);
            updateGallery();
          }, 300); // Match the duration of the fade-out animation
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