
    function openMyWin() {
       var x = window.open("./formA.html", "formA", "width=1000,height=1000");
       x.moveTo(0,0);

    }

    function generateUniqueId(index) {
      return `collapseTask${index}`;
    }

    function generaCompito(index){
        const id = generateUniqueId(index);
    
        const title = localStorage.getItem("titolo");
        const description = localStorage.getItem("descrizione");
        const priority = localStorage.getItem("priorita");
        const date = localStorage.getItem("scadenza");

        return   `
        <div class="panel task-box">
          <div class="panel-heading" role="tab" id="heading${index}">
            <h4 class="panel-title">
              <div class="task-header" data-toggle="collapse" href="#${id}" aria-expanded="false" aria-controls="${id}">
                <div class="w-100">
                  <div class="task-title">${title}</div>
                  <div class="task-meta d-flex justify-content-between">
                    <span class="due-date">Scadenza: ${date}</span>
                    <span class="priority text-${priority === 'Alta' ? 'danger' : priority === 'Media' ? 'warning' : 'success'}">Priorità: ${priority}</span>
                  </div>
                </div>
              </div>
            </h4>
          </div>
          
          <div id="${id}" class="panel-collapse collapse">
            <div class="panel-body task-body">
              <p>${description}</p>
            </div>
          </div>
        </div>
      `;
    }

    function addTaskToContainer() {
      const taskListContainer = document.getElementById("container");
      const taskIndex = taskListContainer.children.length;  // Nuovo compito avrà un indice uguale al numero di compiti già presenti
      taskListContainer.innerHTML += generaCompito(taskIndex);
    }
              


    window.addEventListener("storage", function(event) {
      if (event.key === "titolo") {
        addTaskToContainer();
      }
    });

    
