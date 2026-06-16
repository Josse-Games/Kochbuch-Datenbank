document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);
document.getElementById("zutatHINZF").addEventListener("click", ZutatHinzufügen);
document.getElementById("zutatENTF").addEventListener("click", ZutatEntfernen);
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
            Anzeigen(data.data);
        } else {
            console.error('Fehler vom Server:', data.message);
        }
    })
    .catch(error => {
        console.error('Netzwerkfehler beim Laden:', error);
    });
}

function Anzeigen(rezepte){
    const container = document.getElementById('AnzeigeRezepte');
    container.innerHTML = '';

    if (rezepte.length === 0) {
        container.innerHTML = '<p>Keine Rezepte vorhanden.</p>';
        return;
    }

    rezepte.forEach(rezept => {
        const rezeptDiv = document.createElement('div');
        rezeptDiv.className = 'rezeptKarte';

        rezeptDiv.innerHTML = `
            <h3>${escapeHTML(rezept.Rezeptname)}</h3>
            <p><strong>Schwierigkeit:</strong> ${escapeHTML(rezept.Schwierigkeit)}</p>
            <p><strong>Dauer:</strong> ${escapeHTML(rezept.Dauer)}</p>
            <p><strong>Personen:</strong> ${parseInt(rezept.Personenanzahl)}</p>
            <p><strong>Zutaten:</strong> ${escapeHTML(rezept.Zutaten)}</p>
            <p><strong>Zubereitung:</strong><br>${escapeHTML(rezept.Rezept).replace(/\n/g, '<br>')}</p>
            <p><strong>Ersteller:</strong> ${escapeHTML(rezept.Ersteller)}</p>
        `;
        
        container.appendChild(rezeptDiv);
    });
}
window.Laden = Laden;

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '\'', '"': '&quot;' }[tag] || tag)
    );
}