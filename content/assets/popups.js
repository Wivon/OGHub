function openPopup () {
    document.querySelector('.popup').style.display = 'flex';
    document.querySelector('.popupBackground').classList.remove('popHidden')
}

function hidePopup () {
    document.querySelector('.popup').style.display = 'none';
    document.querySelector('.popupBackground').classList.add('popHidden')
}