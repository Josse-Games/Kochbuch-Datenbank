document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);
document.getElementById("zutatHINZF").addEventListener("click", ZutatHinzufügen);
document.getElementById("zutatENTF").addEventListener("click", ZutatEntfernen);

let VISIBLE = false;
let Zutaten = 0;

async function Visibility(){
    if(VISIBLE == false){
        document.getElementById("BLUR").classList.add("visible");
        VISIBLE = true;
    }else{
        document.getElementById("BLUR").classList.remove("visible");
        VISIBLE = false;
    }
}

async function ZutatHinzufügen() {
    Zutaten++;

    const NEUEzutat = document.createElement("input");

    NEUEzutat.type = "text";
    NEUEzutat.name = "Zutat" + Zutaten;
    NEUEzutat.placeholder = "Zutat " + Zutaten;
    NEUEzutat.className = "zutat-input";
    NEUEzutat.id = "Zutat" + Zutaten;
    document.getElementById("zut-list").appendChild(NEUEzutat);
}

async function ZutatEntfernen() {
    if(Zutaten > 0){
        document.getElementById("Zutat" + Zutaten).remove();
        Zutaten--;
    }
}