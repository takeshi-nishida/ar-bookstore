const buttons = document.querySelectorAll(".say-hi-button") as NodeListOf<HTMLButtonElement>;
const button1 = document.getElementById('button1') as HTMLButtonElement;
const button2 = document.getElementById('button2') as HTMLButtonElement;
const assets = document.getElementById('assets') as Element;
const books = [ document.getElementById('book1')!, document.getElementById('book2')!, document.getElementById('book3')! ]

type RakutenItem = {
    itemUrl: string;
    largeImageUrl: string;
    title: string;
};

button1.addEventListener("click", e => {
    book1.setAttribute("src", "#texture");
});

button2.addEventListener("click", e => {
    const url = "../api";
    fetch(url)
        .then(response => response.json())
        .then(data => updateCover(data.Items));
});

function updateCover(items: RakutenItem[]){
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
    }
})
