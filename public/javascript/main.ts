const buttons = [ document.getElementById('button1')!, document.getElementById('button2')!, document.getElementById('button3')! ];
const books = [ document.getElementById('book1')!, document.getElementById('book2')!, document.getElementById('book3')! ];
const assets = document.getElementById('assets') as Element;

let items: RakutenItem[];

type RakutenItem = {
    itemUrl: string;
    largeImageUrl: string;
    title: string;
};

fetch("../api")
    .then(response => response.json())
    .then(data => onItemsReceived(data.Items));

buttons.forEach((b, i) => {
    b.addEventListener('click', () => {
        window.location.href = items[i].itemUrl;
    })
});

function onItemsReceived(receivedItems: RakutenItem[]){
    items = receivedItems;

    // Update covers
    books.forEach((book, i) => {
        const url = "../image?url=" + items[i].largeImageUrl;
        book.setAttribute("src", url);
    });
}

AFRAME.registerComponent('markerhandler', {
    init: function () {
        this.el.sceneEl!.addEventListener('markerFound', () => {
            buttons.forEach(b => b.style.display = "inline");
        })

        this.el.sceneEl!.addEventListener('markerLost', () => {
            buttons.forEach(b => b.style.display = "none");
        });
    }
})
