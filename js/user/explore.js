const decks = [
 {t:"Human Anatomy",s:"Biology",c:30,r:4.8,d:2024},
 {t:"Cell Biology",s:"Biology",c:22,r:4.5,d:2023},
 {t:"Genetics",s:"Biology",c:18,r:4.6,d:2024},
 {t:"Laws of Motion",s:"Physics",c:25,r:4.7,d:2024},
 {t:"Thermodynamics",s:"Physics",c:20,r:4.3,d:2023},
 {t:"Optics",s:"Physics",c:19,r:4.4,d:2022},
 {t:"Algebra",s:"Mathematics",c:28,r:4.6,d:2023},
 {t:"Trigonometry",s:"Mathematics",c:24,r:4.4,d:2024},
 {t:"Calculus",s:"Mathematics",c:26,r:4.7,d:2022},
 {t:"DSA Arrays",s:"Computer Science",c:35,r:4.9,d:2024},
 {t:"Linked List",s:"Computer Science",c:30,r:4.8,d:2023},
 {t:"OOPS",s:"Computer Science",c:32,r:4.7,d:2024},
 {t:"HTML Basics",s:"Computer Science",c:20,r:4.5,d:2022},
 {t:"Organic Chem",s:"Chemistry",c:26,r:4.2,d:2022},
 {t:"Periodic Table",s:"Chemistry",c:18,r:4.6,d:2024},
 {t:"Chemical Bonds",s:"Chemistry",c:22,r:4.4,d:2023},
 {t:"Atomic Structure",s:"Chemistry",c:21,r:4.5,d:2024},
 {t:"Electrostatics",s:"Physics",c:23,r:4.6,d:2024},
 {t:"Plant Biology",s:"Biology",c:17,r:4.3,d:2023},
 {t:"Probability",s:"Mathematics",c:20,r:4.5,d:2024},
];

let list=[...decks];
let selected=new Set();

const results=document.getElementById("results");
const startBtn=document.getElementById("startStudy");
const selectedCount=document.getElementById("selectedCount");

/* RENDER */
function render(){
    results.innerHTML="";
    list.forEach((d,i)=>{
        const card=document.createElement("div");
        card.className="deck-card";
        card.innerHTML=`
            <div class="deck-title">${d.t}</div>
            <div class="deck-subject">${d.s}</div>
            <div class="deck-meta">${d.c} cards</div>
            <div class="rating">⭐ ${d.r}</div>
        `;
        card.onclick=()=>{
            selected.has(i)?selected.delete(i):selected.add(i);
            card.classList.toggle("selected");
            updateSelected();
        };
        results.appendChild(card);
    });
}

/* SEARCH */
searchInput.oninput=()=>{
    const q=searchInput.value.toLowerCase();
    list=decks.filter(d=>d.t.toLowerCase().includes(q)||d.s.toLowerCase().includes(q));
    sortRating();
};

/* SORT */
function sortRating(){
    list.sort((a,b)=>b.r-a.r);
    render();
}
function sortRecent(){
    list.sort((a,b)=>b.d-a.d);
    render();
}

/* FILTER DRAWER */
openFilter.onclick=()=>filterDrawer.classList.add("open");
closeFilter.onclick=()=>filterDrawer.classList.remove("open");

document.querySelectorAll("[data-sort]").forEach(b=>{
    b.onclick=()=>{
        b.dataset.sort==="recent"?sortRecent():sortRating();
    };
});
document.querySelectorAll("[data-subject]").forEach(b=>{
    b.onclick=()=>{
        list=b.dataset.subject==="All"
            ? [...decks]
            : decks.filter(d=>d.s===b.dataset.subject);
        sortRating();
    };
});

function updateSelected(){
    selectedCount.innerText=`${selected.size} decks selected`;
    startBtn.classList.toggle("hidden",selected.size===0);
}

sortRating();