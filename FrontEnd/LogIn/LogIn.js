// -- AUTHENTIFICATION DE L'UTILISATEUR 
async function logUser() {
    const btnEnvoyer = document.querySelector('form');
    
    btnEnvoyer.addEventListener("submit", async (event) => {
        event.preventDefault();

        const connexion = {
            email: event.target.querySelector("[name=e-mail]").value,
            password: event.target.querySelector("[name=mot-de-passe]").value
        };

        let chargeUtile = JSON.stringify(connexion);

        try {
            // appel de fetch en POST 
            const reponse = await fetch('http://localhost:5678/api/users/login', {
                method: "post",
                headers: { "content-type": "application/json" },
                body: chargeUtile
            })

            if (reponse.ok) {
                const res = await reponse.json();
                window.localStorage.setItem("token",res.token);
                window.open("../index.html");                
            } else{
                // message d'erreur si les valeurs sont erronées 
                const err_serveurSelector = document.querySelector("#Erreur_Serveur");
                err_serveurSelector.style.display = "none";
                const logInSelector = document.querySelector("#LogIn_invalide");
                logInSelector.style.display = "block";
                const inputSelector = document.querySelector("#e-mail");
                const inputSelector2 = document.querySelector("#mot-de-passe");
                inputSelector.style.border = "solid 0.5px #d65757";
                inputSelector2.style.border = "solid 0.5px #d65757";
            } 

        } catch (error) {
            console.log("une erreur est survenu"); 
            const logInSelector = document.querySelector("#LogIn_invalide");
            logInSelector.style.display = "none";
        }
    });
}

logUser();

