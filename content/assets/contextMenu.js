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

            cardContextMenu.querySelector('.deleteBtn').onclick = () => {
                openPopup('Delete ?', 'You can\'t undo this action.', true, '<button class=\'Popupbutton destructive\' onclick=\"deleteCard(\'' + getSelector(card) + '\')">Confirm</button><button onclick=\'hidePopup()\' class=\'Popupbutton accent\'>Cancel</button>', { 'path': 'img/delete_icon.png', 'invert': true })
            }
            cardContextMenu.querySelector('.editBtn').onclick = () => {
                openSettings('addApp')
                setTimeout(() => {
                    showpanel('.settings', 'Settings', '<!-- no footer for this panel (settings) -->')
                    NextANA()

                    // set the card values to preview and editor
                    document.querySelector('.containerANA .editor input.newCardNameInput').value = card.querySelector('h3').textContent
                    document.querySelector('.containerANA p').textContent = card.querySelector('h3').textContent
                    document.querySelector('.containerANA img').src = card.querySelector('img').src
                    document.querySelector('.containerANA h2').textContent = "Editing card: " + card.querySelector('h3').textContent
                }, 200)
            }
        })
    })
}

function hideContextMenus() {
    document.querySelector('.cardContextMenu').style.display = "none";
    console.debug('hide contextMenus')
}

setCardCtxMenuEvent()