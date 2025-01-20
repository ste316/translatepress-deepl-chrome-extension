// Wait for the element to be present in the DOM using Intersection Observer
function waitForElement(selector, callback) {
  // Create observer config
  const config = {
    root: null, // observe relative to viewport
    threshold: 0 // trigger as soon as even 1px is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries) => {
    // Check if element is intersecting
    if (entries[0].isIntersecting) {
      observer.disconnect(); // Stop observing once found
      callback();
    }
  }, config);

  // Function to start observing or call callback if element already exists
  const startObserving = () => {
    const element = document.querySelector(selector);
    if (element) {
      observer.observe(element);
    } else {
      // If element doesn't exist yet, try again in next frame
      requestAnimationFrame(startObserving);
    }
  };

  startObserving();
}

// Function to translate text using DeepL API
async function translateText(text) {
  const response = await fetch('https://localhost:8443/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text
    })
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.translated_text;
}

function addControlButtons() {
  try {
    // Check if controls already exist
    if (document.querySelector('.translation-controls')) {
      return;
    }

    // Create draggable container
    const draggableContainer = document.createElement('div');
    draggableContainer.className = 'translation-controls-wrapper';
    draggableContainer.id = 'tp-control-panel';
    
    // Create handle for dragging
    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle';
    dragHandle.id = 'tp-drag-handle';
    dragHandle.innerHTML = '⋮⋮';
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'translation-controls';
    buttonContainer.id = 'tp-button-container';
    
    // Create buttons with specific IDs and start them enabled
    const previousButton = document.createElement('button');
    previousButton.textContent = 'Previous';
    previousButton.className = 'control-button previous-button ready';
    previousButton.id = 'tp-previous-button';
    previousButton.disabled = false;
    
    const skipButton = document.createElement('button');
    skipButton.textContent = 'Next';
    skipButton.className = 'control-button skip-button ready';
    skipButton.id = 'tp-skip-button';
    skipButton.disabled = false;
    
    const translateButton = document.createElement('button');
    translateButton.textContent = 'Translate & Save';
    translateButton.className = 'control-button translate-button ready';
    translateButton.id = 'tp-translate-button';
    translateButton.disabled = false;
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.className = 'control-button reset-button ready';
    resetButton.id = 'tp-reset-button';
    resetButton.disabled = false;

    // Add styles for all buttons including Previous
    if (!document.querySelector('#translation-controls-styles')) {
      const style = document.createElement('style');
      style.id = 'translation-controls-styles';
      style.textContent = `
        .translation-controls-wrapper {
          position: fixed !important;
          top: 20px !important;
          left: 100px !important;
          z-index: 999999 !important;
          background: rgba(255, 255, 255, 0.95) !important;
          border: 1px solid #ccc !important;
          border-radius: 8px !important;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
          padding: 10px !important;
          cursor: move !important;
          user-select: none !important;
        }
        .drag-handle {
          padding: 2px 0 8px 0 !important;
          text-align: center !important;
          color: #666 !important;
          font-size: 16px !important;
          cursor: move !important;
        }
        .translation-controls {
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          pointer-events: auto !important;
        }
        .control-button {
          padding: 8px 16px !important;
          color: white !important;
          border: none !important;
          border-radius: 4px !important;
          cursor: pointer !important;
          opacity: 0.9 !important;
          transition: opacity 0.3s !important;
          font-size: 14px !important;
          font-family: Arial, sans-serif !important;
          display: block !important;
          width: 150px !important;
          text-align: center !important;
          visibility: visible !important;
        }
        .control-button:hover {
          opacity: 1 !important;
        }
        .control-button.ready {
          cursor: pointer !important;
        }
        .control-button:not(.ready) {
          background-color: #cccccc !important;
          cursor: not-allowed !important;
        }
        .skip-button.ready {
          background-color: #FFA500 !important;
        }
        .translate-button.ready {
          background-color: #4CAF50 !important;
        }
        .reset-button {
          background-color: #DC3545 !important;
        }
        .previous-button.ready {
          background-color: #007bff !important;
        }
        .previous-button:not(.ready) {
          background-color: #cccccc !important;
          cursor: not-allowed !important;
        }
      `;
      document.head.appendChild(style);
    }

    // Reset button click handler
    resetButton.addEventListener('click', async () => {
      try {
        const skipBtn = document.getElementById('tp-skip-button');
        const translateBtn = document.getElementById('tp-translate-button');
        
        // Disable controls during reset
        skipBtn.disabled = true;
        translateBtn.disabled = true;
        skipBtn.classList.remove('ready');
        translateBtn.classList.remove('ready');
        
        // Just focus the textarea to ensure proper state
        const destinationTextArea = document.querySelector('div#trp-language-it_IT textarea.trp-translation-input.trp-textarea');
        if (destinationTextArea) {
          destinationTextArea.click();
          destinationTextArea.focus();
        }
        
        // Re-enable controls and add ready class
        skipBtn.disabled = false;
        translateBtn.disabled = false;
        skipBtn.classList.add('ready');
        translateBtn.classList.add('ready');
        
        console.log('Reset successful');
      } catch (error) {
        console.error('Error in reset:', error);
        // Re-enable controls even if there's an error
        const skipBtn = document.getElementById('tp-skip-button');
        const translateBtn = document.getElementById('tp-translate-button');
        skipBtn.disabled = false;
        translateBtn.disabled = false;
        skipBtn.classList.add('ready');
        translateBtn.classList.add('ready');
      }
    });

    async function goToNextText() {
      try {
        const nextButton = document.getElementById('trp-next');
        if (nextButton) {
          nextButton.click();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error in goToNextText:', error);
        return false;
      }
    }

    async function goToPreviousText() {
      try {
        const spanElement = document.querySelector('span#trp-previous');
        if (spanElement) {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
          });
          spanElement.dispatchEvent(clickEvent);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error in goToPreviousText:', error);
        return false;
      }
    }

    async function saveTranslation() {
      try {
        const saveButton = document.getElementById('trp-save');
        if (saveButton) {
          saveButton.click();
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error in saveTranslation:', error);
        return false;
      }
    }

    async function waitForSaveConfirmation(maxAttempts = 30) {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const element = document.querySelector('svg.trp_reviewed_icon');
        if (element) {
          console.log('Save confirmation detected');
          return true;
        }

        // If not saved yet, try clicking save again
        const saveButton = document.getElementById('trp-save');
        if (saveButton) {
          console.log('Retrying save...');
          saveButton.click();
        }
      }
      console.error('Save confirmation not detected after maximum attempts');
      return false;
    }

    // Skip button click handler
    skipButton.addEventListener('click', async (e) => {
      try {
        if (!skipButton.classList.contains('ready')) return;
        
        const success = await goToNextText();
        if (!success) {
          console.error('Could not find next button');
        }
      } catch (error) {
        console.error('Error in skip button handler:', error);
      }
    });

    // Function to simulate natural typing
    async function simulateTyping(element, text) {
      // Click the textarea first
      element.click();
      element.focus();

      // Clear existing text
      element.value = '';
      
      // Type each character with random delay
      for (let char of text) {
        element.value += char;
        
        // Trigger input event to ensure TranslatePress registers the change
        element.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Random delay between 2-20ms
        const delay = Math.floor(Math.random() * 19) + 2;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Translate and Save button click handler
    translateButton.addEventListener('click', async (e) => {
      try {
        if (!translateButton.classList.contains('ready')) return;
        
        const sourceTextArea = document.querySelector('div#trp-language-en_GB textarea.trp-translation-input.trp-textarea');
        const destinationTextArea = document.querySelector('div#trp-language-it_IT textarea.trp-translation-input.trp-textarea');
        
        if (sourceTextArea && destinationTextArea) {
          try {
            // Disable buttons during translation
            skipButton.disabled = true;
            translateButton.disabled = true;
            skipButton.classList.remove('ready');
            translateButton.classList.remove('ready');

            // Translate
            const translatedText = await translateText(sourceTextArea.value);
            
            // Instead of direct assignment, simulate typing
            await simulateTyping(destinationTextArea, translatedText);

            // Wait before saving
            await new Promise(resolve => setTimeout(resolve, 500));

            // Save
            const savedSuccess = await saveTranslation();
            if (!savedSuccess) {
              console.error('Could not find save button');
              return;
            }

            // Wait a bit before checking save confirmation
            await new Promise(resolve => setTimeout(resolve, 100));

            // Wait for save confirmation
            const saveConfirmed = await waitForSaveConfirmation();
            if (!saveConfirmed) {
              console.error('Save confirmation not detected');
              return;
            }

            // Wait before moving to next
            await new Promise(resolve => setTimeout(resolve, 500));

            // Go to next
            const nextSuccess = await goToNextText();
            if (!nextSuccess) {
              console.error('Could not find next button');
            }

            // After everything is done, re-enable buttons
            skipButton.disabled = false;
            translateButton.disabled = false;
            skipButton.classList.add('ready');
            translateButton.classList.add('ready');

          } catch (error) {
            console.error('Translation error:', error);
            // Re-enable buttons and auto-skip
            skipButton.disabled = false;
            translateButton.disabled = false;
            skipButton.classList.add('ready');
            translateButton.classList.add('ready');
            await goToNextText(); // Auto-skip on error
          }
        } else {
          console.error('Source or destination textarea not found.');
          // Auto-skip when textareas not found
          await goToNextText();
        }
      } catch (error) {
        console.error('Error in translate button handler:', error);
        await goToNextText(); // Auto-skip on any error
      }
    });

    // Add drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }
      
      if (e.target === dragHandle) {
        isDragging = true;
      }
    }

    function dragEnd() {
      isDragging = false;
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, draggableContainer);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    // Add event listeners for drag functionality
    dragHandle.addEventListener("touchstart", dragStart, false);
    dragHandle.addEventListener("touchend", dragEnd, false);
    dragHandle.addEventListener("touchmove", drag, false);
    dragHandle.addEventListener("mousedown", dragStart, false);
    document.addEventListener("mousemove", drag, false);
    document.addEventListener("mouseup", dragEnd, false);

    // Assemble the components
    draggableContainer.appendChild(dragHandle);
    draggableContainer.appendChild(buttonContainer);
    buttonContainer.appendChild(previousButton);  // Add Previous button first
    buttonContainer.appendChild(skipButton);
    buttonContainer.appendChild(translateButton);
    buttonContainer.appendChild(resetButton);
    
    // Add container to body
    document.body.appendChild(draggableContainer);

    // Function to check ready state (simplified without highlight)
    const checkReadyState = () => {
      try {
        // Batch our DOM queries
        const elements = {
          sourceTextArea: document.querySelector('div#trp-language-en_GB textarea.trp-translation-input.trp-textarea'),
          destinationTextArea: document.querySelector('div#trp-language-it_IT textarea.trp-translation-input.trp-textarea'),
          nextButton: document.getElementById('trp-next'),
          saveButton: document.getElementById('trp-save'),
          previousButton: document.querySelector('button#trp-previous')
        };
        
        if (elements.sourceTextArea && 
            elements.destinationTextArea && 
            elements.nextButton && 
            elements.saveButton && 
            elements.previousButton && 
            document.readyState === 'complete') {
          // Batch our DOM updates
          requestAnimationFrame(() => {
            const skipBtn = document.getElementById('tp-skip-button');
            const translateBtn = document.getElementById('tp-translate-button');
            const previousBtn = document.getElementById('tp-previous-button');
            
            skipBtn.disabled = false;
            translateBtn.disabled = false;
            previousBtn.disabled = false;
            
            skipBtn.classList.add('ready');
            translateBtn.classList.add('ready');
            previousBtn.classList.add('ready');
          });
        } else {
          requestAnimationFrame(checkReadyState);
        }
      } catch (error) {
        console.error('Error in checkReadyState:', error);
        requestAnimationFrame(checkReadyState);
      }
    };

    checkReadyState();

    // Previous button click handler
    previousButton.addEventListener('click', async (e) => {
      try {
        if (!previousButton.classList.contains('ready')) return;
        
        const success = await goToPreviousText();
        if (!success) {
          console.error('Could not find previous button');
        }
      } catch (error) {
        console.error('Error in previous button handler:', error);
      }
    });
  } catch (error) {
    console.error('Error in addControlButtons:', error);
  }
}

// Helper function to get our controls (can be used anywhere in the code)
function getControls() {
  return {
    panel: document.getElementById('tp-control-panel'),
    skipButton: document.getElementById('tp-skip-button'),
    translateButton: document.getElementById('tp-translate-button'),
    resetButton: document.getElementById('tp-reset-button'),
    container: document.getElementById('tp-button-container')
  };
}

// Initialize only once when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addControlButtons);
} else {
  addControlButtons();
}