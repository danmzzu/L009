document.addEventListener('DOMContentLoaded', function() {
    const popupElement = document.getElementById('popup');
    const closeButton = document.getElementById('popup-close');
  
    if (popupElement && closeButton) {
        closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            popupElement.style.display = 'none';
        });
    }
});