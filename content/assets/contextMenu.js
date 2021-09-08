let cardcardContextMenu = document.querySelector('.cardcardContextMenu')

function setEventsListeners() {
    cardsContainer.addEventListener('cardContextMenu', (event) => {
        event.preventDefault()

        //montrer le menu personnalisé sans le faire déppasser de la page
        if (e.clientY < (document.body.clientHeight - cardContextMenu.offsetHeight) && e.clientX < (document.body.clientWidth - cardContextMenu.offsetWidth)) {
            cardcardContextMenu.style.display = "flex";
            cardcardContextMenu.style.top = (e.clientY + window.scrollY) + "px";
            cardcardContextMenu.style.left = e.clientX + "px";
        }
        else {
            cardContextMenu.style.display = "flex";
            cardContextMenu.style.top = ((e.clientY + window.scrollY) - cardContextMenu.offsetHeight) + "px";
            cardContextMenu.style.left = (e.clientX - cardContextMenu.offsetWidth) + "px";
        }
    })
}