document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("Ausloggen").addEventListener("click", LogOut);
document.getElementById("druckButton").addEventListener("click", Back);
document.getElementById("addButton").addEventListener("click", Download);
Laden();

async function Back(){
    window.location.href = "./Kochbuch.html";
}

function Laden(){
    let debounceTimer;

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
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => {
                        updatePreview(data.data, aktuellerSuchText);
                    }, 800);
                });
            }
            updatePreview(data.data);
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

let pdfDataUri;

async function generatePdfDoc(rezepte, suchBegriff="") {
    const suchText = suchBegriff.toLowerCase().trim();
    console.log(suchText);

    const { layoutMultilineText } = PDFLib;
    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    const existingPdfBytes = await fetch('./PDF/Rezeptkarte_Pfadi-Kochbuch_geglättet.pdf').then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();

    const fontBytes = await fetch('HelveticaNeue.ttf').then(res => res.arrayBuffer());
    const fontBytes2 = await fetch('HEB____.TTF').then(res => res.arrayBuffer());
    pdfDoc.registerFontkit(fontkit);
    const Font = await pdfDoc.embedFont(fontBytes);
    const Font2 = await pdfDoc.embedFont(fontBytes2);
    /*const Font = await pdfDoc.embedFont(StandardFonts.Helvetica);*/

    for (const rezept of rezepte) {
        const namePasst = rezept.Rezeptname ? rezept.Rezeptname.toLowerCase().includes(suchText) : false;
        const zutatPasst = rezept.Zutaten ? rezept.Zutaten.toLowerCase().includes(suchText) : false;
        const erstellerPasst = rezept.Ersteller ? rezept.Ersteller.toLowerCase().includes(suchText) : false;
        const schwierigkeitPasst = rezept.Schwierigkeit ? rezept.Schwierigkeit.toLowerCase().includes(suchText) : false;
        
        if (suchText === "" || namePasst || zutatPasst || erstellerPasst || schwierigkeitPasst) {
            const [copiedPage] = await pdfDoc.copyPages(pdfDoc, [0]);
            const firstPage = pdfDoc.addPage(copiedPage);

            const { height, width } = firstPage.getSize();
        
            firstPage.drawText(rezept.Rezeptname, {
                x: 195,
                y: height - 62,
                size: 10,
                font: Font2,
                color: rgb(0, 0, 0)
            });

            firstPage.drawText(rezept.Dauer, {
                x: 183,
                y: height - 140,
                size: 9,
                font: Font,
                color: rgb(0, 0, 0),
            });

            firstPage.drawText(rezept.Personenanzahl, {
                x: 310,
                y: height - 140,
                size: 9,
                font: Font,
                color: rgb(0, 0, 0),
            });

            if(rezept.Schwierigkeit == "Einfach"){
                firstPage.drawText("*", {
                    x: 248.5,
                    y: height - 102.5,
                    size: 25,
                    font: Font,
                    color: rgb(0, 0, 0),
                });
            }
            else if(rezept.Schwierigkeit == "Mittel"){
                firstPage.drawText("*", {
                    x: 298,
                    y: height - 102,
                    size: 25,
                    font: Font,
                    color: rgb(0, 0, 0),
                });
            }
            else if(rezept.Schwierigkeit == "Schwer"){
                firstPage.drawText("*", {
                    x: 345,
                    y: height - 102.5,
                    size: 25,
                    font: Font,
                    color: rgb(0, 0, 0),
                });
            }

            let zutatenText = String(rezept.Zutaten);

                // Alle Kommas durch Zeilenumbrüche ersetzen
                zutatenText = zutatenText.replace(/,/g, '\n');

                const zutatenX = 40;
                const zutatenYStart = height - 203;
                const zutatenSize = 6.5;

                // layoutMultilineText erkennt die '\n' und trennt den Text in einzelne Zeilen auf
                const multiZutaten = layoutMultilineText(zutatenText, {
                    font: Font,
                    fontSize: zutatenSize,
                    bounds: { width: width - zutatenX - 40, height: 400 },
                });

                // Jede Zutat als eigene Zeile untereinander schreiben
                multiZutaten.lines.forEach((line, index) => {
                    firstPage.drawText(line.text.trim(), { // .trim() entfernt eventuelle Leerzeichen nach dem Komma
                        x: zutatenX,
                        y: zutatenYStart - (index * (zutatenSize * 2.589230769)),
                        size: zutatenSize,
                        font: Font,
                        color: rgb(0, 0, 0),
                    });
                });


            let zubereitungText = String(rezept.Rezept);

                const textX = 155;
                const textYStart = height - 203;
                const textSize = 6.5;

                const maxTextWidth = width - textX - 20;

                // Verarbeitet bestehende \n UND bricht zu lange Zeilen automatisch bei maxTextWidth um
                const multiZubereitung = layoutMultilineText(zubereitungText, {
                    font: Font,
                    fontSize: textSize,
                    bounds: { width: maxTextWidth, height: 600 },
                });

                // Zeilen weise auf das PDF schreiben
                multiZubereitung.lines.forEach((line, index) => {
                    firstPage.drawText(line.text, {
                        x: textX,
                        y: textYStart - (index * (textSize * 2.589230769)),
                        size: textSize,
                        font: Font,
                        color: rgb(0, 0, 0),
                    });
                });
        
        }
    }

    //erste Seite entfernen
    if (pdfDoc.getPageCount() > 1) {
        pdfDoc.removePage(0);
    }

    return pdfDoc;
}

async function updatePreview(rezepte, suchBegriff) {
    
    const pdfDoc = await generatePdfDoc(rezepte, suchBegriff);
    pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });

    // 1. Data-URI in Blob umwandeln
    const base64Data = pdfDataUri.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });

    // 2. Blob-URL erstellen
    const blobUrl = URL.createObjectURL(blob);

    // 3. Zuweisen
    const iframe = document.getElementById('pdfPreview');
    iframe.src = blobUrl;
}

async function Download() {
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = "Pfadi-Kochbuch Ausdruck";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}