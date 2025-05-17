function CaricaPiantina(){
    document.querySelectorAll(".plant-container").forEach(container => {
        const priorità = container.getAttribute("assignment-priority");
        let file_svg= ""; 

        switch(priorità){
            case "Bassa": 
                file_svg= "../../assets/svg/plant_easy.svg"; 
                break; 
            case "Media": 
                file_svg= "../../assets/svg/plant_medium.svg"; 
                break; 
            
            case "Alta": 
                file_svg= "../../assets/svg/plant_difficult.svg" ; 
                break; 
            default: 
                file_svg= "../../assets/svg/plant_easy.svg"; 
        }

        
    fetch(file_svg)
      .then(res => res.text())
      .then(svgText => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
        container.appendChild(svgDoc.documentElement);
      })
      .catch(err => console.error("Errore nel caricamento della piantina:", err));
    });
}