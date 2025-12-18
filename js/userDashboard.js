// document.addEventListener("DOMContentLoaded", () => {
//     const createDecks = document.getElementById('create-decks')
//     const decksForm = document.getElementById('deck-form');
//     createDecks.addEventListener('click', function (e) {
//         decksForm.style.display = 'block';
//     })

//     const cancel = document.getElementById('cancel')
//     cancel.addEventListener('click', function (e) {
//         decksForm.style.display = 'none'
//     })
// });

class FlashcardApp{
    constructor(){
        this.decks = JSON.parse(localStorage.getItem("decks")) || [];
        this.cards = [];
        this.editIndex = null;
        this.init();
    }

    init(){
        openCreateDeck.onclick = ()=>this.open();
        closePopup.onclick = ()=>overlay.style.display="none";
        addCardBtn.onclick = ()=>cardInputs.classList.toggle("hidden");
        saveCardBtn.onclick = ()=>this.saveCard();
        saveDeckBtn.onclick = ()=>this.saveDeck();
        shuffleAll.onclick = ()=>this.shuffleGlobal();
        this.renderDecks();
        this.updateStats();
    }

    open(){
        overlay.style.display="flex";
        deckTitle.value="";
        cardsPreview.innerHTML="";
        liveCard.classList.add("hidden");
        this.cards=[];
        this.editIndex=null;
    }

    saveCard(){
        if(!frontText.value||!backText.value)return;
        this.cards.push({front:frontText.value,back:backText.value});
        frontText.value=backText.value="";
        this.renderCards();
    }

    renderCards(){
        cardsPreview.innerHTML="";
        this.cards.forEach((c,i)=>{
            cardsPreview.innerHTML+=`
            <div>
                ${c.front} → ${c.back}
                <span onclick="app.removeCard(${i})">🗑</span>
            </div>`;
        });
    }

    removeCard(i){
        this.cards.splice(i,1);
        this.renderCards();
    }

    saveDeck(){
        if(!deckTitle.value||!this.cards.length)return;
        const deck={title:deckTitle.value,cards:this.cards};
        this.editIndex!=null?this.decks[this.editIndex]=deck:this.decks.push(deck);
        localStorage.setItem("decks",JSON.stringify(this.decks));
        overlay.style.display="none";
        this.renderDecks();
        this.updateStats();
    }

    renderDecks(){
        deckList.innerHTML="";
        this.decks.forEach((d,i)=>{
            deckList.innerHTML+=`
            <div class="deck-item">
                <h3>${d.title}</h3>
                <p>${d.cards.length} cards</p>
                <div class="deck-actions">
                    <button onclick="app.edit(${i})">Edit</button>
                    <button onclick="app.delete(${i})">Delete</button>
                </div>
            </div>`;
        });
    }

    edit(i){
        this.editIndex=i;
        deckTitle.value=this.decks[i].title;
        this.cards=[...this.decks[i].cards];
        this.renderCards();
        overlay.style.display="flex";
    }

    delete(i){
        this.decks.splice(i,1);
        localStorage.setItem("decks",JSON.stringify(this.decks));
        this.renderDecks();
        this.updateStats();
    }

    shuffleGlobal(){
        if(!this.decks.length)return;
        const cards=this.decks.flatMap(d=>d.cards);
        cards.sort(()=>Math.random()-0.5);
        let i=0;
        overlay.style.display="flex";
        liveCard.classList.remove("hidden");
        liveCard.innerText=cards[i].front;
        liveCard.onclick=()=>{
            liveCard.innerText=
            liveCard.innerText===cards[i].front?cards[i].back:cards[i].front;
            i=(i+1)%cards.length;
        }
    }

    updateStats(){
        totalDecks.innerText=this.decks.length;
        totalCards.innerText=this.decks.reduce((s,d)=>s+d.cards.length,0);
    }
}
const app=new FlashcardApp();
