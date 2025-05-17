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
  img.style.width = '80px';
  img.style.height = '100px';
  

  div.appendChild(img);

  return div;
}



function CaricaPiantina() {
    fetch("php/giardino_compiti.php")
      .then(res => res.json())
      .then(piantina => {
        const container = document.getElementById("container");
        container.innerHTML = "";
    
        piantina.forEach((p) => {
            const piantinaDiv = CreaPiantina(p);
            container.appendChild(piantinaDiv);
        });
      });
} 

       