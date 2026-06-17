document.getElementById("SignIn").addEventListener("click", Check);
document.getElementById("WEITER").addEventListener("click", Weiter);
document.getElementById("benutzer-reset").addEventListener("click", ResetName);
document.getElementById("Password").addEventListener('focus', () => {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            Check();
        }
    });
});
document.getElementById("nameField").addEventListener('focus', () => {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            Weiter();
        }
    });
});

fetch("loginCHECK.php").then(response => {
    if (response.ok){
        window.location.href = "./Kochbuch.html";
    }
})


async function Hash(NewPassword){
    const encoder = new TextEncoder();

    try{
        const saltBytes = nobleHashes.utils.randomBytes(16);
        const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');

        const passwordBytes = encoder.encode(NewPassword);

        const derivedBits = nobleHashes.pbkdf2(
            nobleHashes.sha512, 
            passwordBytes, 
            saltBytes, 
            { c: 100000, dkLen: 64 }
        );

        const hash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    
        console.log("const GENERATED_SALT =" + salt);
        console.log("const GENERATED_HASH =" + hash);
    } catch(error) {
        console.error("Fehler bei der Hash-Generierung:", error);
    }

    
    
}

async function Check(){
    document.getElementById("Password").classList.remove("wrong");
    const EnteredPassword = document.getElementById("Password").value;

    try {
        const response = await fetch("login.php",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: EnteredPassword })
        });

        const result = await response.json();
        console.log(result);

        if (result.success) {
            if(localStorage.getItem('Name') !== null){
                fetch("loginSetCookie.php");
                await new Promise(r => setTimeout(r, 800));
                window.location.href = "./Kochbuch.html";
            }
            else{
                document.getElementById("Login").classList.add("weiter");
                await new Promise(r => setTimeout(r, 500));
                document.getElementById("Name").classList.add("weiter");
            }
            
        } else {
            const Input = document.getElementById("Password");
            Input.value = "";
            Input.placeholder = "Passwort ungültig";
            Input.classList.add("wrong");
        }
    } catch (error) {
        console.error("Fehler bei der Hash-Berechnung:", error);
    }
    
}

async function Weiter(){
    document.getElementById("nameField").classList.remove("wrong");
    const name = document.getElementById("nameField").value;
    if(!name.trim()){
        document.getElementById("nameField").classList.add("wrong");
    }
    else{
        localStorage.setItem('Name', name);
        window.location.href = "./Kochbuch.html";
        fetch("loginSetCookie.php");
        console.log("weiter");
    }
}

window.Hash = Hash;

async function ResetName(){
    localStorage.removeItem('Name');
    window.location.href = "./index.html";
}