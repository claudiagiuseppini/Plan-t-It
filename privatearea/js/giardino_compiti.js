function MesediDefault(){
    inputMese = document.getElementById("mese");
    const data = new Date();
    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, '0');
    inputMese.value = `${anno}-${mese}`;
}


function CreaPiantina(p){
  const div = document.createElement('div');

  // cerco svg a seconda della priorita
let svgPath;

  switch (p.priorita) {
    case "Alta":
      svgPath = "../../assets/svg/plant_difficult.svg";
      break;
    case "Media":
      svgPath = "../../assets/svg/plant_medium.svg";
      break;
    case "Bassa":
      svgPath = "../../assets/svg/plant_easy.svg";
      break;
  }

  const img = document.createElement('img');
  img.src = svgPath;
  img.style.width = '160px';
  img.style.height = '200px';
  
  const title = document.createElement('p');
  title.textContent= p.titolo;
  title.style.fontWeight = "bold";
  title.style.textAlign= "center"; 

  div.appendChild(img);
  div.appendChild(title); 

  return div;
}



function CaricaPiantina() {
    fetch("php/giardino_compiti.php")
      .then(res => res.json())
      .then(piantina => {
        const container = document.getElementById("containerGiardino");
        container.innerHTML = "";
        
        // consideriamo solo i compiti relativi al mese selezionato
        const selezione = document.getElementById("mese").value;
        const [annoSelezionato, meseSelezionato] = selezione.split("-").map(Number);

        piantina.forEach((p) => {
            scadenza = p.scadenza; 
            const [anno, mese, giorno] = scadenza.split("-").map(Number);

            if (annoSelezionato == anno && meseSelezionato==mese){
                const piantinaDiv = CreaPiantina(p);
                container.appendChild(piantinaDiv);
            }
        });
      });
} 

       