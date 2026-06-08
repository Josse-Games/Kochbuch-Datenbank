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
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(16));
    const salt = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const passwordKey = await window.crypto.subtle.importKey(
        "raw", encoder.encode(NewPassword), "PBKDF2", false, ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-512" },
        passwordKey, 512
    );

    const hash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log("const GENERATED_SALT =" + salt);
    console.log("const GENERATED_HASH =" + hash);
    
}

async function Check(){
    const EnteredPassword = document.getElementById("Password").value;
    const encoder = new TextEncoder();

    const salt = "86603f676dddc71c109308ec5bb67564";
    const passwordHASH = "377812365c472d0bf4ab0b38177f13b83f9642d8f0066cc76f6342bb7dfa54396b6a8e985bcd9bac5409ce34901acc68d4e2f37748e9b19ba856c91e00494347";

    const saltBytes = new Uint8Array(salt.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

    const passwordKey = await window.crypto.subtle.importKey(
        "raw", encoder.encode(EnteredPassword), "PBKDF2", false, ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: saltBytes, iterations: 100000, hash: "SHA-512" },
        passwordKey, 512
    );

    const hash = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
    
    if(hash == passwordHASH){
        window.location.href = "Kochbuch.html";
    }
    else{
        const Input = document.getElementById("Password");
        Input.value = "";
        Input.placeholder = "Wrong password";
        Input.classList.add("wrong");
    }
    
}