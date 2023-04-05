async function getData() {
        // 1.1 récupérer les travaux du back-end 
    try {
        // 1.1.1 récup les data de l'API
        const response = await fetch('http://localhost:5678/API/works');
        const donnees = await response.json();

        // 1.1.2 Via une boucle for, supprimer et afficher les nouveaux contenus 

        function genererElements(donnees) {
            document.querySelector('#portfolio .gallery').innerHTML = "";

            for (let i = 0; i < donnees.length; i++) {

                document.querySelector('#portfolio .gallery').innerHTML +=
                    `<figure> <img src="${donnees[i].imageUrl}" alt="${donnees[i].title}"> <figcaption> ${donnees[i].title}</figcaption> </figure>`;

            }
        }

        genererElements(donnees);
        // 1.2 Réaliser les filtres 
        // 1.2.1 Séléctionner les btn du HTML -

        const btnTous = document.querySelector('#portfolio #tous');
        const btnObjet = document.querySelector('#portfolio #objets');
        const btnAppartements = document.querySelector('#portfolio #appartements');
        const btnHotelsRestaurants = document.querySelector('#portfolio #hotels_restaurants');
        

        // 1.2.2 Création de d'une fonction avec une fonction filter 

        function filtrage(nomFiltre) {
            const elementsFiltrees = donnees.filter((donnee) => {
                return donnee.category.name == `${nomFiltre}`;
            });
            // 2.2.3 Retirer tous les éléments du HTML + appeler la fonction avec les nouveaux élements filtres
            document.querySelector('#portfolio .gallery').innerHTML = "";
            genererElements(elementsFiltrees);
        }
        
        //1.2.4 ajouter l'écouteur avec la fonction de filtrage avce l'élément souhaité
        
        btnTous.addEventListener("click", () => genererElements(donnees));
        btnObjet.addEventListener("click", () => filtrage("Objets"));
        btnAppartements.addEventListener("click", () => filtrage("Appartements"));
        btnHotelsRestaurants.addEventListener("click", () => filtrage("Hotels & restaurants"));
        

    } catch (error) {
        console.error('Une erreur est survenue', error);
    }
};

getData();


