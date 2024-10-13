//Referências ao DOM (Document Object Model) - Pegamos elementos da página HTML para manipular
const modal = document.getElementById('modal'); 
// O modal que aparece para adicionar tarefas
const btnAbrirModal = document.getElementById('abrir-modal'); 
// Botão que abre o modal
const btnFecharModal = document.querySelector('.close'); 
// Botão de fechar o modal (o "X")
const inputTarefa = document.getElementById('nova-tarefa'); 
// Campo de input para digitar o nome da nova tarefa
const btnAdicionarTarefa = document.getElementById('adicionar-tarefa'); 
// Botão para adicionar a tarefa

// Listas de tarefas para cada fase: pendente, andamento, progresso e concluída
const listaPendentes = document.getElementById('tarefas-pendentes');
const listaAndamento = document.getElementById('tarefas-andamento');
const listaProgresso = document.getElementById('tarefas-progresso');
const listaConcluidas = document.getElementById('tarefas-concluidas');

//seletor de colunas
const columns = document.querySelectorAll(".coluna");

// Abre o modal quando o botão "Nova Tarefa" é clicado
btnAbrirModal.addEventListener('click', function () {
    modal.style.display = 'flex'; // O modal se torna visível
  });

// Fecha o modal quando o botão "X" (fechar) é clicado
btnFecharModal.addEventListener('click', function () {
    modal.style.display = 'none'; // O modal é escondido
  });

// Adiciona a tarefa ao pressionar Enter
inputTarefa.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        btnAdicionarTarefa.click(); // Simula o clique no botão de adicionar tarefa
    } return

    const tarefaTexto = inputTarefa.value; // Pega o valor digitado no input (nome da tarefa)
  
    if (tarefaTexto === '') {
      // Verifica se o campo está vazio
      alert('Digite uma tarefa!'); // Mostra um alerta caso o campo esteja vazio
      return; // Interrompe a função se o campo estiver vazio
    }
  
    adicionarTarefa(listaPendentes, tarefaTexto); // Chama a função para adicionar a tarefa à lista de pendentes
    inputTarefa.value = ''; // Limpa o campo de input após adicionar a tarefa
    modal.style.display = 'none'; // Fecha o modal após adicionar a tarefa
});

// Adiciona uma tarefa à lista de "Pendentes" quando o botão "Adicionar" é clicado
btnAdicionarTarefa.addEventListener('click', function () {
    const tarefaTexto = inputTarefa.value; // Pega o valor digitado no input (nome da tarefa)
  
    if (tarefaTexto === '') {
      // Verifica se o campo está vazio
      alert('Digite uma tarefa!'); // Mostra um alerta caso o campo esteja vazio
      return; // Interrompe a função se o campo estiver vazio
    }
  
    adicionarTarefa(listaPendentes, tarefaTexto); // Chama a função para adicionar a tarefa à lista de pendentes
    inputTarefa.value = ''; // Limpa o campo de input após adicionar a tarefa
    modal.style.display = 'none'; // Fecha o modal após adicionar a tarefa
  });

// Função que adiciona uma tarefa à lista especificada (neste caso, pendentes)
function adicionarTarefa(lista, texto) {
    // Cria um novo elemento <li> (um item de lista) que será a nova tarefa
    const novaTarefa = document.createElement('li'); 
    novaTarefa.setAttribute('draggable', true);//Torna a tarefa arrastável
    novaTarefa.innerText = texto; // Define o texto da tarefa como o valor digitado no input
    

    novaTarefa.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', texto); // Armazena o texto da tarefa
        setTimeout(() => {
            novaTarefa.style.display = 'none'; // Esconde a tarefa durante o arraste
        }, 0);
    });

    // Evento quando a tarefa termina de ser arrastada
    novaTarefa.addEventListener('dragend', function () {
        novaTarefa.style.display = 'block'; // Mostra a tarefa novamente ao final do arraste
    });
  
    // Cria um botão para mover a tarefa entre as colunas
    const btnMover = document.createElement('button');
    btnMover.classList.add('mover-tarefa'); // Adiciona a classe CSS "mover-tarefa"
    btnMover.innerText = 'Mover'; // O texto do botão será "Mover"
  
    // Adiciona um evento ao botão "Mover" para mover a tarefa entre as colunas
    btnMover.addEventListener('click', function() {
      moverTarefa(novaTarefa); // Chama a função que move a tarefa
    });


    // Cria um botão para excluir a tarefa (um "X" vermelho)
    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('excluir-tarefa'); // Adiciona a classe CSS "excluir-tarefa"
    btnExcluir.innerHTML = '&times;'; // Define o conteúdo do botão como "×"
    
  
    // Adiciona um evento ao botão "X" para remover a tarefa da lista
    btnExcluir.addEventListener('click', function() {
    novaTarefa.remove(); // Remove a tarefa ao clicar no botão "X"
    });

    // Adiciona o botão de mover e o de excluir à nova tarefa
    novaTarefa.appendChild(btnMover); 
    novaTarefa.appendChild(btnExcluir);

    // Adiciona a nova tarefa à lista especificada (ex: listaPendentes)
    lista.appendChild(novaTarefa);

    adicionarEventosDrop(lista); //Adiciona evento Drop 
}

// Função para adicionar eventos de drop a uma lista
function adicionarEventosDrop(lista) {
    lista.addEventListener('dragover', (e) => {
        e.preventDefault(); // Permite o drop
    });

    lista.addEventListener('drop', (e) => {
        e.preventDefault();
        const tarefaTexto = e.dataTransfer.getData('text/plain');
        
        // Adiciona a tarefa arrastada à nova lista
        if (tarefaTexto) {
            const novaTarefa = document.createElement('li');
            novaTarefa.innerText = tarefaTexto;
            novaTarefa.setAttribute('draggable', true);
            adicionarEventosArrasto(novaTarefa);
            
            // Altera a cor de fundo da nova tarefa conforme a coluna
            alterarCorTarefa(lista, novaTarefa);

            // Adiciona a nova tarefa à lista
            lista.appendChild(novaTarefa);
        
            // Remove a tarefa original
            removerTarefaOriginal(tarefaTexto); 

            // Reaplica os eventos de arrastar
            novaTarefa.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', tarefaTexto);
                setTimeout(() => {
                    novaTarefa.style.display = 'none';
                }, 0);
            });

            novaTarefa.addEventListener('dragend', function () {
                novaTarefa.style.display = 'block';
            });

            // Cria o botão de excluir
            const btnExcluir = document.createElement('button');
            btnExcluir.classList.add('excluir-tarefa');
            btnExcluir.innerHTML = '&times;';
            btnExcluir.addEventListener('click', function () {
                novaTarefa.remove();
            });

            lista.appendChild(novaTarefa);
        }
    });
}

// Função para remover a tarefa original
function removerTarefaOriginal(tarefaTexto) {
    const tarefas = document.querySelectorAll('.coluna li');
    tarefas.forEach(tarefa => {
        if (tarefa.innerText === tarefaTexto) {
            tarefa.remove(); // Remove a tarefa original
        }
    });
}

// Função auxiliar para reaplicar eventos de arrasto
function adicionarEventosArrasto(novaTarefa) {
    novaTarefa.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', novaTarefa.innerText);
        novaTarefa.classList.add('li');
        setTimeout(() => {
            novaTarefa.style.display = 'none'; // Esconde a tarefa durante o arraste
        }, 0);
    });

    novaTarefa.addEventListener('dragend', function () {
        // novaTarefa.classList.remove('li');
        novaTarefa.style.display = 'flex'; // Mostra a tarefa novamente ao final do arraste
    });
}

// Adiciona os eventos de arrastar a tarefas já existentes
document.querySelectorAll('.lista-tarefas li').forEach(tarefa => {
    adicionarEventosArrasto(tarefa);
});


// Função para alterar a cor da tarefa conforme a coluna
function alterarCorTarefa(lista, tarefa) {
    if (lista === listaPendentes) {
        tarefa.style.backgroundColor = ''; // Padrão
    } else if (lista === listaAndamento) {
        tarefa.style.backgroundColor = '#ffA500'; // Em Andamento
    } else if (lista === listaProgresso) {
        tarefa.style.backgroundColor = '#A020F0'; // Em Progresso
    } else if (lista === listaConcluidas) {
        tarefa.style.backgroundColor = '#00FF00'; // Concluídas
    }
}

// Função para mover a tarefa entre as colunas
function moverTarefa(tarefa) {
    const colunaAtual = tarefa.parentElement;
    // Verifica em qual lista a tarefa está atualmente e move para a próxima coluna
    if (colunaAtual === listaPendentes) {
      listaAndamento.appendChild(tarefa); // Move a tarefa para a lista de "Em Andamento"
      tarefa.style.backgroundColor = '#ffA500';
    } else if (colunaAtual === listaAndamento) {
      listaProgresso.appendChild(tarefa); // Move a tarefa para a lista de "Em Progresso"
      tarefa.style.backgroundColor = '#A020F0';
    } else if (colunaAtual === listaProgresso) {
      listaConcluidas.appendChild(tarefa); // Move a tarefa para a lista de "Concluídas"
      tarefa.style.backgroundColor = '#00FF00';
      
      // *** Remoção do botão "Mover" após a tarefa ser concluída ***
      const btnMover = tarefa.querySelector('.mover-tarefa');
      
      if (btnMover) {
        tarefa.removeChild(btnMover);
    }
  }

  // Atualiza a cor da tarefa após a movimentação
  alterarCorTarefa(tarefa.parentElement, tarefa);
    
}

// Inicializa eventos de drop para cada coluna
columns.forEach(column => adicionarEventosDrop(column));

// Fechar o modal clicando fora dele
window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }