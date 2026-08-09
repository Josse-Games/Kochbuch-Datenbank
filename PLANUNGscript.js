document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);
document.getElementById("druckButton").addEventListener("click", Back);

document.getElementById("Tage").addEventListener("click", Tage);
document.getElementById("Tage").addEventListener("input", Tage);

document.getElementById("Ausloggen").addEventListener("click", LogOut);

let VISIBLE = false;
let TageAnz = 0;

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

            aktuellerTag = aktuellerTag + 1;
        }
    }
    
}