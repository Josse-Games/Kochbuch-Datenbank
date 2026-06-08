document.getElementById("Name").textContent = localStorage.getItem("Name");
document.getElementById("addButton").addEventListener("click", Visibility);
document.getElementById("backButton").addEventListener("click", Visibility);

let VISIBLE = false;

async function Visibility(){
    if(VISIBLE == false){
        document.getElementById("BLUR").classList.add("visible");
        VISIBLE = true;
    }else{
        document.getElementById("BLUR").classList.remove("visible");
        VISIBLE = false;
    }
}