document.addEventListener('DOMContentLoaded', function() {
    const popupElement = document.getElementById('popup');
    const closeButton = document.getElementById('popup-close');
    let isPopupVisible = true;

    function hidePopup() {
        if (popupElement && isPopupVisible) {
            popupElement.style.display = 'none';
            isPopupVisible = false;
            setTimeout(showPopup, 15000);
        }
    }

    function showPopup() {
        if (popupElement && !isPopupVisible) {
            popupElement.style.display = 'flex';
            isPopupVisible = true;
        }
    }

    if (popupElement && closeButton) {
        closeButton.addEventListener('click', function(event) {
            event.preventDefault();
            hidePopup();
        });
        showPopup();
    }
});