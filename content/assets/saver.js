// temp
var content = document.querySelector('.container')

// events who save the card
document.body.onblur = () => {
    saveCards()
}

document.body.onclick = () => {
    saveCards()
    hideContextMenus()
}

function saveCards(htmlcontent=content.innerHTML) {
    try {
        localStorage.setItem('page_html', htmlcontent);
        console.debug('saved cards')
    } catch (error) {
        console.error(error)
    }
}

if (localStorage.getItem('page_html')) {
    if (content.innerHTML != localStorage.getItem('page_html')) {
        content.innerHTML = localStorage.getItem('page_html');
        console.log('restored cards last save');
    }
}