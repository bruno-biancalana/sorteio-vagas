let debounceTimeout;
let intervaloContador;

function mostrarSpinner() {
    document.getElementById("loader").classList.remove("hidden");
}

function ocultarSpinner() {
    document.getElementById("loader").classList.add("hidden");
}

function playBeep() {
    const beep = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
    // beep.play();
}


function restaurarDestaques(idListaVagas) {
    const lista = document.getElementById(idListaVagas);
    const vagas = lista.querySelectorAll(".destaque");
    vagas.forEach(vaga => {
        vaga.classList.remove("destaque");
    });
}


function mostrarContador(callback) {
    let counter = 5;
    const displayElement = document.getElementById('contador');
    
    displayElement.innerText = counter; 
    playBeep();

    countdown = setInterval(() => {
        counter--;

        if (counter >= 0) {
            displayElement.innerText = counter;
            playBeep();
        } else {
            clearInterval(countdown);
            callback();
        }

    }, 1000); 
}


function finalizarContador() {
    clearInterval(intervaloContador);
    document.getElementById('contador').classList.add('hidden');
}

function debounce(func, delay = 300) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        func();
    }, delay);
}


function filtrarVagasPorTermo(idListaVagas, termo) {
    const lista = document.getElementById(idListaVagas);
    const vagas = lista.querySelectorAll("li");
    const regex = new RegExp(termo, 'i');
    let found = false;

    vagas.forEach(vaga => {
        const originalText = vaga.getAttribute("data-original") || vaga.innerText;
        vaga.setAttribute("data-original", originalText);

        if (regex.test(originalText) || termo === "") {
            vaga.style.display = "list-item";
            vaga.innerHTML = termo ? highlightTerm(originalText, regex) : originalText;
            found = true;
            restaurarDestaques("vagasDuplas");
            restaurarDestaques("vagasTriplas");
        } else {
            vaga.style.display = "none";
        }
    });

    if (!found && termo === "") {
        lista.innerHTML = "<li>Nenhum resultado encontrado</li>";
        restaurarDestaques("vagasDuplas");
        restaurarDestaques("vagasTriplas");
    }
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    debounce(() => {
        const searchTerm = this.value.trim().toLowerCase();
        if (searchTerm === "") {
            restaurarDestaques("vagasDuplas");
            restaurarDestaques("vagasTriplas");
        }
        filtrarVagasPorTermo("vagasDuplas", searchTerm);
        filtrarVagasPorTermo("vagasTriplas", searchTerm);
    });
});

function highlightTerm(text, regex) {
    return text.replace(regex, match => `<span class='highlight destaque'>${match}</span>`);
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function appendToList(list, content) {
    const li = document.createElement('li');
    li.innerHTML = content;
    list.appendChild(li);
}
function resetSorteio() {
    document.getElementById("vagasDuplas").innerHTML = '';
    document.getElementById("vagasTriplas").innerHTML = '';

    const adminLinkContainer = document.getElementById("adminLinkContainer");
}
function realizarSorteio() {
    
    resetSorteio(); 

    mostrarContador(() => {
        const unidades = criarListaDeUnidades(223);
        embaralharArray(unidades);

        const vagasDuplasList = document.getElementById("vagasDuplas");
        const vagasTriplasList = document.getElementById("vagasTriplas");

        exibirVagasDuplas(4, 73, unidades, vagasDuplasList);
        exibirVagasTriplas(74, 223, unidades, vagasTriplasList);

        document.querySelector(".search-box").style.display = "block";

        const adminLink = document.createElement('a');
        adminLink.href = "admin.html";
        adminLink.classList.add("admin-link");
        adminLink.innerText = "Acessar Administração";
        adminLinkContainer.appendChild(adminLink);
    });
}


function criarListaDeUnidades(max) {
    const unidades = [];
    for (let i = 1; i <= max; i++) {
        unidades.push(`Unidade ${i}`);
    }
    return unidades;
}


function exibirVagasDuplas(start, end, unidades, vagasList) {
    const resultadosDuplas = [];
    resultadosDuplas.push("<strong>Vagas Duplas:</strong>");
    for (let i = start; i <= end; i += 2) {
        if (unidades.length > 0) {
            const item = `Vaga Dupla ${i} e ${i + 1}: <span class="destaque">${unidades.shift()}</span>`;
            resultadosDuplas.push(item);
            appendToList(vagasList, item);
        }
    }
    localStorage.setItem('vagasDuplas', JSON.stringify(resultadosDuplas));
}

function exibirVagasTriplas(start, end, unidades, vagasList) {
    const resultadosTriplas = [];
    resultadosTriplas.push("<strong>Vagas Triplas:</strong>");
    for (let i = start; i <= end; i += 3) {
        if (unidades.length >= 3) {
            const unidadesDestaque = unidades.splice(0, 3).map(u => `<span class="destaque">${u}</span>`).join(', ');
            const item = `Vaga Tripla ${i}, ${i + 1}, e ${i + 2}: ${unidadesDestaque}`;
            resultadosTriplas.push(item);
            appendToList(vagasList, item);
        }
    }
    localStorage.setItem('vagasTriplas', JSON.stringify(resultadosTriplas));
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    debounce(() => {
        const searchTerm = this.value.trim().toLowerCase();

        filtrarVagasPorTermo("vagasDuplas", searchTerm);
        filtrarVagasPorTermo("vagasTriplas", searchTerm);
    });
});
