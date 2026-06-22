document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("Ausloggen").addEventListener("click", LogOut);
Laden();

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