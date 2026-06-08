document.getElementById("SignIn").addEventListener("click", Check);
document.getElementById("Password").addEventListener('focus', () => {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            Check();
        }
    });
});


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
    const EnteredPassword = document.getElementById("Password").value;
    const encoder = new TextEncoder();

    const salt = "169d020edd9d62205572059b83af4b08";
    const passwordHASH = "ee8e52a3658ae400d14bd73ae35b70187da30b275b813931b5d38afd192ba3fc109bb6068da1cf7c7c3dcfa0ddfc755c65283f98c7926be706ee4e0e2681cc29";

    const saltBytes = new Uint8Array(salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const passwordBytes = encoder.encode(EnteredPassword);

    try {
        const derivedBits = nobleHashes.pbkdf2(
            nobleHashes.sha512, 
            passwordBytes, 
            saltBytes, 
            { c: 100000, dkLen: 64 }
        );

        const hash = Array.from(derivedBits).map(b => b.toString(16).padStart(2, '0')).join('');
        
        if (hash === passwordHASH) {
            document.cookie = "loggedIN=1; path=/; SameSite=Lax; max-age=36;";
            window.location.href = "./Kochbuch.html";
        } else {
            const Input = document.getElementById("Password");
            Input.value = "";
            Input.placeholder = "Wrong password";
            Input.classList.add("wrong");
        }
    } catch (error) {
        console.error("Fehler bei der Hash-Berechnung:", error);
    }
    
}

window.Hash = Hash;