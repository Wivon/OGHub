let cardContextMenu = document.querySelector('.cardContextMenu')

function setEventsListeners() {
    cardsContainer.addEventListener('contextmenu', (event) => {
        event.preventDefault()

        cardContextMenu.style.display = "flex"

        //montrer le menu personnalisé sans le faire déppasser de la page
        if (event.clientX < (cardsContainer.offsetWidth - cardContextMenu.offsetWidth)) {
            cardContextMenu.style.display = "flex";
            cardContextMenu.style.top = (event.clientY + window.scrollY) + "px";
            cardContextMenu.style.left = event.clientX + "px";
            console.log(`showing card context menu (default) (event.clientY ${event.clientY})`)
        }
        else {
            cardContextMenu.style.display = "flex";
            cardContextMenu.style.top = ((event.clientY + window.scrollY) - cardContextMenu.offsetHeight) + "px";
            cardContextMenu.style.left = (event.clientX - cardContextMenu.offsetWidth) + "px";
            console.log(`showing card context menu (moved) (event.clientY ${event.clientY})`)
        }
    })
}

function hideContextMenus() {
    document.querySelector('.cardContextMenu').style.display = "none";
    console.log('hide contextMenus')
}

setEventsListeners()