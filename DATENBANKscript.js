document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);
document.getElementById("zutatHINZF").addEventListener("click", ZutatHinzufügen);
document.getElementById("zutatENTF").addEventListener("click", ZutatEntfernen);
document.getElementById("saveButton").addEventListener("click", Save);
document.getElementById("Ausloggen").addEventListener("click", LogOut);
Laden();

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
    if(Zutaten < 23){
        Zutaten++;

        const NEUEzutat = document.createElement("input");

        NEUEzutat.type = "text";
        NEUEzutat.name = "Zutat" + Zutaten;
        NEUEzutat.placeholder = "Zutat " + Zutaten;
        NEUEzutat.className = "zutat-input";
        NEUEzutat.id = "Zutat" + Zutaten;
        document.getElementById("zut-list").appendChild(NEUEzutat);
    }
}

async function ZutatEntfernen() {
    if(Zutaten > 0){
        document.getElementById("Zutat" + Zutaten).remove();
        Zutaten--;
    }
}

function Save() {
    const RezeptName = document.getElementById("RezeptName").value;
    const RezeptDauer = document.getElementById("RezeptDauer").value;
    const RezeptPersonen = document.getElementById("RezeptPersonen").value;
    const Rezept = document.getElementById("Rezept").value;

    if (!RezeptName.trim() || !Rezept.trim()) {
        alert('Bitte tragen Sie mindestens einen Rezeptnamen und die Zubereitung ein!');
        return;
    }

    const schwierigkeitRadio = document.querySelector('input[name="schwierigkeit"]:checked');
    const schwierigkeit = schwierigkeitRadio ? schwierigkeitRadio.id.replace('Schwierigkeit', '') : 'Einfach';

    const zutatenInputs = document.querySelectorAll('.zutat-input');
    let zutatenArray = [];

    zutatenInputs.forEach(input => {
        if (input.value.trim() !== '') {
            zutatenArray.push(input.value.trim());
        }
    });

    const rezeptDaten = {
        name: RezeptName,
        schwierigkeit: schwierigkeit,
        dauer: RezeptDauer,
        personen: RezeptPersonen,
        zutaten: zutatenArray.join(', '),
        text: Rezept,
        ersteller: localStorage.getItem("Name")
    };

    fetch('rezeptSpeichern.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rezeptDaten)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Rezept erfolgreich gespeichert!');
            Laden();
            
            document.getElementById('RezeptName').value = '';
            document.getElementById('RezeptDauer').value = '';
            document.getElementById('RezeptPersonen').value = '';
            document.getElementById('Rezept').value = '';
            document.getElementById('zut-list').innerHTML = '';
            Zutaten = 0;
        } else {
            console.log('Fehler beim Speichern: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Netzwerkfehler:', error);
        console.log('Verbindung zum Server fehlgeschlagen.');
    });

    Visibility();
}
window.Save = Save;

function Laden(){
    fetch('rezeptAnzeigen.php')
    .then(response => {
        if (!response.ok) {
            throw new Error('Server-Antwort war nicht okay');
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            const suchFeld = document.getElementById("searchInput");
            
            if (suchFeld) {
                suchFeld.replaceWith(suchFeld.cloneNode(true));
                
                document.getElementById("searchInput").addEventListener("input", function() {
                    const aktuellerSuchText = this.value;
                    Anzeigen(data.data, aktuellerSuchText);
                });
            }
            Anzeigen(data.data, ""); 
        } else {
            console.error('Fehler vom Server:', data.message);
        }
    })
    .catch(error => {
        console.error('Netzwerkfehler beim Laden:', error);
    });
}

function Anzeigen(rezepte, suchBegriff=""){
    const container = document.getElementById('AnzeigeRezepte');
    container.innerHTML = '';

    if (rezepte.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const suchText = suchBegriff.toLowerCase().trim();
    
    rezepte.forEach(rezept => {
        const namePasst = rezept.Rezeptname ? rezept.Rezeptname.toLowerCase().includes(suchText) : false;
        const zutatPasst = rezept.Zutaten ? rezept.Zutaten.toLowerCase().includes(suchText) : false;
        const erstellerPasst = rezept.Ersteller ? rezept.Ersteller.toLowerCase().includes(suchText) : false;
        const schwierigkeitPasst = rezept.Schwierigkeit ? rezept.Schwierigkeit.toLowerCase().includes(suchText) : false;

        if (suchText === "" || namePasst || zutatPasst || erstellerPasst || schwierigkeitPasst) {
            const rezeptDiv = document.createElement('div');
            rezeptDiv.className = 'rezeptKarte';
            rezeptDiv.addEventListener("click", ZUBEREITUNG);

            rezeptDiv.innerHTML = `
                <span class="TITEL"><strong>${escapeHTML(rezept.Rezeptname)}</strong></span>
                <span><strong>Schwierigkeit:</strong> ${escapeHTML(rezept.Schwierigkeit)}</span>
                <span><strong>Dauer:</strong> ${escapeHTML(rezept.Dauer)}</span>
                <span><strong>Personen:</strong> ${parseInt(rezept.Personenanzahl)}</span>
                <span><strong>Ersteller:</strong> ${escapeHTML(rezept.Ersteller)}</span>
                <div class="REZEPT">
                    <span><strong>Zutaten:</strong> ${escapeHTML(rezept.Zutaten)}</span>
                    <span><strong>Zubereitung:</strong><br>${escapeHTML(rezept.Rezept).replace(/\n/g, '<br>')}</span>
                </div>
            
            `;
            container.appendChild(rezeptDiv);
        }
    });
}
window.Laden = Laden;

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '\'', '"': '&quot;' }[tag] || tag)
    );
}

async function ZUBEREITUNG(event){
    const angeklickteBox = event.currentTarget;
    angeklickteBox.classList.toggle('visible');
}

async function LogOut(){
    document.cookie = "loggedIN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("./index.html?");
}