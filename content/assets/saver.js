// temp
var content = document.querySelector('.container')

// save the page's state after you're done with editing and clicked outside the content
document.body.onblur = () => {
    savePageState(content.innerHTML)
}

document.body.onclick = () => {
    savePageState(content.innerHTML)
}

function savePageState(htmlcontent) {
    localStorage.setItem('page_html', htmlcontent);
    console.log('saved page state')
}

if (localStorage.getItem('page_html')) {
    if (content.innerHTML != localStorage.getItem('page_html')) {
        content.innerHTML = localStorage.getItem('page_html');
        console.log('restored page state');
    }
}