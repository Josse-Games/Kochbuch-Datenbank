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
        text: Rezept
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