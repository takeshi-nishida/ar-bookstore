let genres = [
    { marker: "pattern-manga1.patt", booksGenreId: "001001" },
    { marker: "pattern-novel1.patt", booksGenreId: "001004" },
    { marker: "pattern-business1.patt", booksGenreId: "001006" },
    { marker: "pattern-travel1.patt", booksGenreId: "001007" },
    { marker: "pattern-cooking1.patt", booksGenreId: "001010011" },
    { marker: "pattern-fashion1.patt", booksGenreId: "001010014006" },
];

const buttons = [ document.getElementById('button1')!, document.getElementById('button2')!, document.getElementById('button3')! ];
const assets = document.getElementById('assets') as Element;

const data  = new Map<string, RakutenItem[]>();
let selectedGenreId = "001";

type RakutenItem = {
    itemUrl: string;
    largeImageUrl: string;
    title: string;
};

type GenreInfo = {
    genreId: string;
    items: RakutenItem[];
}

genres.forEach(g => { addMarker(g.booksGenreId, g.marker); });

fetch("../api" + "?genres=" + genres.map(g => g.booksGenreId).join(","))
    .then(response => response.json())
    .then(data => onAPIResult(data));

buttons.forEach((b, i) => {
    b.addEventListener('click', () => {
        if(selectedGenreId){
            const items = data.get(selectedGenreId);
            if(items) window.location.href = items[i].itemUrl;
        }
    })
});

function addMarker(genreId: string, markerName: string){
    const scene = document.querySelector("a-scene");
    const marker = document.querySelector("a-marker");
    const clone = marker.cloneNode(true) as Element;
    clone.id = "marker-" + genreId;
    clone.setAttribute("url", "markers/" + markerName);
    clone.setAttribute("data-genreId", genreId);
    scene.appendChild(clone);
}

function onAPIResult(result: GenreInfo[]){
    result.forEach(g => {
        data.set(g.genreId, g.items);

        const m = document.getElementById("marker-" + g.genreId)!;
        const books = m.querySelectorAll("a-box");
        books.forEach((b, i) => {
            const url = "../image?url=" + g.items[i].largeImageUrl;
            b.setAttribute("src", url);
        });
    })
}

AFRAME.registerComponent('markerhandler', {
    init: function () {
        this.el.sceneEl!.addEventListener('markerFound', e => {
            const m = e.target as Element;
            selectedGenreId = m.getAttribute("data-genreId")!;
            buttons.forEach(b => b.style.display = "inline");
        })

        this.el.sceneEl!.addEventListener('markerLost', e => {
            console.log(e.target);
            buttons.forEach(b => b.style.display = "none");
        });
    }
})
