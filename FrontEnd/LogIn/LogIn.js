async function logUser() {

    // séléction de la partie le btn submit + ajout de l'event listener 
    const btnEnvoyer = document.querySelector('form');

    btnEnvoyer.addEventListener("submit", (event) => {
        // ajouter le preventDefault();
        console.log("testOk")
        event.preventDefault();

        // Créer la charge utile 
        const connexion = {
            email: event.target.querySelector("[name=e-mail]").value,
            password: event.target.querySelector("[name=mot-de-passe]").value
        };

        // mettre la charge utilie au format JSON string
        let chargeUtile = JSON.stringify(connexion);

        const res =  fetch('http://localhost:5678/api/users/login', {
                method: "post",
                headers: { "content-type": "application/json" },
                body: chargeUtile
        })
            .then(()=> {
                if (chargeUtile.ok) {
                    // Créer fetch en POST / Pourquoi on ne mets pas await
                    console.log("utilisateur connecté")
        
                    // Re dériger vers mode édition
                    
                }else{
                    console.log("une erreur est survenu")
                    // message erreur 
                }

            }); 

        

    })



}

logUser();

