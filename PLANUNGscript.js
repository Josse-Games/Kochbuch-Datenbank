document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);
document.getElementById("druckButton").addEventListener("click", Back);

document.getElementById("Tage").addEventListener("click", Tage);
document.getElementById("Tage").addEventListener("input", Tage);

document.getElementById("Ausloggen").addEventListener("click", LogOut);
Laden();

let VISIBLE = false;
let TageAnz = 0;
let rezepte;

//////////////////////////////////
const suchText = "";
//////////////////////////////////

async function Back(){
    window.location.href = "./Kochbuch.html";
}

async function LogOut(){
    document.cookie = "loggedIN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("./index.html?");
}

async function Visibility(){
    if(VISIBLE == false){
        document.getElementById("BLUR").classList.add("visible");
        VISIBLE = true;
    }else{
        document.getElementById("BLUR").classList.remove("visible");
        VISIBLE = false;
    }
}

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
                    //Anzeigen(data.data, aktuellerSuchText); 
                    rezepte = data.data;
                });
            }
            //Anzeigen(data.data, ""); 
            rezepte = data.data;
        } else {
            console.error('Fehler vom Server:', data.message);
        }
    })
    .catch(error => {
        console.error('Netzwerkfehler beim Laden:', error);
    });
}

async function Tage() {
    document.getElementById("tage-list").innerHTML = "";
    TageAnz = parseInt(document.getElementById("Tage").value) || 0;

    if(TageAnz > 0){
        let aktuellerTag = 1
        while(aktuellerTag <= TageAnz){
        
            const hinterGRND = document.createElement("div");
            hinterGRND.className = "tag-inputWINDOW";
            hinterGRND.id = "tag-inputWINDOW" + aktuellerTag;
            document.getElementById("tage-list").appendChild(hinterGRND);

                const Headline = document.createElement("p");
                Headline.textContent = "Tag " + aktuellerTag;
                Headline.className = "tag-inputWINDOW-Headline";
                Headline.id = "tag-inputWINDOW-Headline" + aktuellerTag;
                hinterGRND.appendChild(Headline);
        
                const Add1 = document.createElement("select");
                Add1.className = "tag-inputWINDOW-Add";
                Add1.id = "tag-inputWINDOW-Add1" + aktuellerTag;
                hinterGRND.appendChild(Add1);
                    
                    const Add1_Info = document.createElement("option");
                    Add1_Info.value = "";
                    Add1_Info.textContent = "MORGENS 🌄";
                    Add1.appendChild(Add1_Info);

                    rezepte.forEach(rezept => {
                        const namePasst = rezept.Rezeptname ? rezept.Rezeptname.toLowerCase().includes(suchText) : false;
                        const zutatPasst = rezept.Zutaten ? rezept.Zutaten.toLowerCase().includes(suchText) : false;
                        const erstellerPasst = rezept.Ersteller ? rezept.Ersteller.toLowerCase().includes(suchText) : false;
                        const schwierigkeitPasst = rezept.Schwierigkeit ? rezept.Schwierigkeit.toLowerCase().includes(suchText) : false;

                        if (suchText === "" || namePasst || zutatPasst || erstellerPasst || schwierigkeitPasst) {
                            
                            const Add1_Info = document.createElement("option");
                            Add1_Info.value = rezept.Rezeptname;
                            Add1_Info.textContent = rezept.Rezeptname;
                            Add1.appendChild(Add1_Info);
                        }
                    });
        
                const Add2 = document.createElement("select");
                Add2.className = "tag-inputWINDOW-Add";
                Add2.id = "tag-inputWINDOW-Add2" + aktuellerTag;
                hinterGRND.appendChild(Add2);
                    
                    const Add2_Info = document.createElement("option");
                    Add2_Info.value = "";
                    Add2_Info.textContent = "MITTAGS 😎";
                    Add2.appendChild(Add2_Info);

                    rezepte.forEach(rezept => {
                        const namePasst = rezept.Rezeptname ? rezept.Rezeptname.toLowerCase().includes(suchText) : false;
                        const zutatPasst = rezept.Zutaten ? rezept.Zutaten.toLowerCase().includes(suchText) : false;
                        const erstellerPasst = rezept.Ersteller ? rezept.Ersteller.toLowerCase().includes(suchText) : false;
                        const schwierigkeitPasst = rezept.Schwierigkeit ? rezept.Schwierigkeit.toLowerCase().includes(suchText) : false;

                        if (suchText === "" || namePasst || zutatPasst || erstellerPasst || schwierigkeitPasst) {
                            
                            const Add2_Info = document.createElement("option");
                            Add2_Info.value = rezept.Rezeptname;
                            Add2_Info.textContent = rezept.Rezeptname;
                            Add2.appendChild(Add2_Info);
                        }
                    });
        
                const Add3 = document.createElement("select");
                Add3.className = "tag-inputWINDOW-Add";
                Add3.id = "tag-inputWINDOW-Add3" + aktuellerTag;
                hinterGRND.appendChild(Add3);
                    
                    const Add3_Info = document.createElement("option");
                    Add3_Info.value = "";
                    Add3_Info.textContent = "ABENDS 🌒";
                    Add3.appendChild(Add3_Info);

                    rezepte.forEach(rezept => {
                        const namePasst = rezept.Rezeptname ? rezept.Rezeptname.toLowerCase().includes(suchText) : false;
                        const zutatPasst = rezept.Zutaten ? rezept.Zutaten.toLowerCase().includes(suchText) : false;
                        const erstellerPasst = rezept.Ersteller ? rezept.Ersteller.toLowerCase().includes(suchText) : false;
                        const schwierigkeitPasst = rezept.Schwierigkeit ? rezept.Schwierigkeit.toLowerCase().includes(suchText) : false;

                        if (suchText === "" || namePasst || zutatPasst || erstellerPasst || schwierigkeitPasst) {
                            
                            const Add3_Info = document.createElement("option");
                            Add3_Info.value = rezept.Rezeptname;
                            Add3_Info.textContent = rezept.Rezeptname;
                            Add3.appendChild(Add3_Info);
                        }
                    });
        
                const Add4 = document.createElement("div");
                Add4.className = "tag-inputWINDOW-Add";
                Add4.id = "tag-inputWINDOW-Add4" + aktuellerTag;
                hinterGRND.appendChild(Add4);

            aktuellerTag = aktuellerTag + 1;
        }
    }
    
}