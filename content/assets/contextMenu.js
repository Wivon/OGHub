let cardContextMenu = document.querySelector('.cardContextMenu')

function setCardCtxMenuEvent() {
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('contextmenu', (event) => {
            event.preventDefault()

            // display the ctx menu
            cardContextMenu.style.display = "flex"

            //show the ctx menu & if it overflows move it
            if (event.clientX < (cardsContainer.offsetWidth - cardContextMenu.offsetWidth)) {
                cardContextMenu.style.transformOrigin = "top left"
                cardContextMenu.style.display = "flex";
                cardContextMenu.style.top = (event.clientY + window.scrollY) + "px";
                cardContextMenu.style.left = event.clientX + "px";
                console.log(`showing card context menu (default) (event.clientY ${event.clientY})`)
            }
            else {
                cardContextMenu.style.transformOrigin = "bottom right"
                cardContextMenu.style.display = "flex";
                cardContextMenu.style.top = ((event.clientY + window.scrollY) - cardContextMenu.offsetHeight) + "px";
                cardContextMenu.style.left = (event.clientX - cardContextMenu.offsetWidth) + "px";
                console.log(`showing card context menu (moved) (event.clientY ${event.clientY})`)
            }
        })
    })
}

function hideContextMenus() {
    document.querySelector('.cardContextMenu').style.display = "none";
    console.debug('hide contextMenus')
}

setCardCtxMenuEvent()