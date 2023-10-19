
let debounceTimeout;
let countdown;
const adminLinkContainer = document.getElementById("adminLinkContainer");

const vagasDuplas = [
    58, 59, 74, 75, 76, 77, 78, 79, 80, 81, 85,
    86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    111, 112, 113, 114, 115, 116, 117, 118, 119, 120
];

const vagasTriplas = [
    1, 2, 3, 4, 5, 6, 7, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    62, 73, 74, 75, 76, 
];

const vagasIndividuais = [
    121, 122, 123
    // Adicione mais números de vagas individuais conforme necessário
];


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
    clearInterval(countdown);
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
        const unidadesDuplas = criarListaDeUnidades(vagasDuplas[vagasDuplas.length - 1]); // Total de 120 vagas
        embaralharArray(unidadesDuplas);

        const unidadesTriplas = criarListaDeUnidades(vagasTriplas[vagasTriplas.length - 1]); // Total de 120 vagas
        embaralharArray(unidadesTriplas);

        const unidadesIndividuais = criarListaDeUnidades(vagasIndividuais[vagasIndividuais.length - 1]); // Total de 140 vagas
        embaralharArray(unidadesIndividuais);

        const vagasDuplasList = document.getElementById("vagasDuplas");
        const vagasTriplasList = document.getElementById("vagasTriplas");
        const vagasIndividuaisList = document.getElementById("vagasIndividuais");

        exibirVagasDuplas(vagasDuplas, unidadesDuplas, vagasDuplasList);
        exibirVagasTriplas(vagasTriplas, unidadesTriplas, vagasTriplasList);
        exibirVagasIndividuais(vagasIndividuais, unidadesIndividuais, vagasIndividuaisList);

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

function exibirVagasDuplas(vagasDuplas, unidades, vagasList) {
    const resultadosDuplas = [];
    resultadosDuplas.push("<strong>Vagas Duplas:</strong>");

    vagasDuplas.forEach(vaga => {
        if (unidades.length > 0) {
            const item = `Vaga Dupla ${vaga} e ${vaga + 1}: <span class="destaque">${unidades.shift()}</span>`;
            resultadosDuplas.push(item);
            appendToList(vagasList, item);
        }
    });

    localStorage.setItem('vagasDuplas', JSON.stringify(resultadosDuplas));
}

function exibirVagasTriplas(vagasTriplas, unidades, vagasList) {
    const resultadosTriplas = [];
    resultadosTriplas.push("<strong>Vagas Triplas:</strong>");

    vagasTriplas.forEach(vaga => {
        if (unidades.length >= 3) {
            const unidadesDestaque = unidades.splice(0, 3).map(u => `<span class="destaque">${u}</span>`).join(', ');
            const item = `Vaga Tripla ${vaga}, ${vaga + 1}, e ${vaga + 2}: ${unidadesDestaque}`;
            resultadosTriplas.push(item);
            appendToList(vagasList, item);
        }
    });

    localStorage.setItem('vagasTriplas', JSON.stringify(resultadosTriplas));
}

function exibirVagasIndividuais(vagasIndividuais, unidades, vagasList) {
    const resultadosIndividuais = [];
    resultadosIndividuais.push("<strong>Vagas Individuais:</strong>");

    vagasIndividuais.forEach(vaga => {
        if (unidades.length > 0) {
            const item = `Vaga Individual ${vaga}: <span class="destaque">${unidades.shift()}</span>`;
            resultadosIndividuais.push(item);
            appendToList(vagasList, item);
        }
    });

    localStorage.setItem('vagasIndividuais', JSON.stringify(resultadosIndividuais));
}