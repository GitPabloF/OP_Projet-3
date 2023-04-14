// 2.2 : Authentification de l’utilisateur 
let utilisateurEstConnecte = false;

async function logUser() {
    // 2.2.1 séléction de la partie le btn submit + ajout de l'event listener 
    const btnEnvoyer = document.querySelector('form');

    btnEnvoyer.addEventListener("submit", async (event) => {
        // 2.2.2 ajouter le preventDefault();
        event.preventDefault();

        // 2.2.3 créer la charge utile 
        const connexion = {
            email: event.target.querySelector("[name=e-mail]").value,
            password: event.target.querySelector("[name=mot-de-passe]").value
        };

        // 2.2.4 mettre la charge utilie au format JSON string
        let chargeUtile = JSON.stringify(connexion);

        try {
            // 2.2.5 appel de fetch en POST 
            const reponse = await fetch('http://localhost:5678/api/users/login', {
                method: "post",
                headers: { "content-type": "application/json" },
                body: chargeUtile
            })

            if (reponse.ok) {
                // Créer fetch en POST / Pourquoi on ne mets pas await
                const res = await reponse.json();
                console.log("utilisateur connecté");
                console.log(res);
                console.log(reponse);
            
                //Stoker le token 
                window.localStorage.setItem("token",res.token);

                utilisateurEstConnecte = true;
                console.log(utilisateurEstConnecte);
                // Re dériger vers mode édition
                window.open("../index.html");
                

            } else{
                // message erreur 
                const err_serveurSelector = document.querySelector("#Erreur_Serveur");
                err_serveurSelector.style.display = "none";

                const logInSelector = document.querySelector("#LogIn_invalide");
                logInSelector.style.display = "block";

                const inputSelector = document.querySelector("#e-mail");
                const inputSelector2 = document.querySelector("#mot-de-passe");
                inputSelector.style.border = "solid 0.5px #d65757";
                inputSelector2.style.border = "solid 0.5px #d65757";

                utilisateurEstConnecte = false;
            } 


        } catch (error) {
            console.log("une erreur est survenu"); 
            const logInSelector = document.querySelector("#LogIn_invalide");
            logInSelector.style.display = "none";

            // const err_serveurSelector = document.querySelector("#Erreur_Serveur");
            // err_serveurSelector.style.display = "block";

            console.log("serveur")

        }

    });

}

logUser();

