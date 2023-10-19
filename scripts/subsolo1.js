let debounceTimeout;
let countdown;

// vagas vagasDuplas sub-solo-1
const vagasDuplas = [
    58, 59, 74, 75, 76, 77, 78, 79, 80, 81, 85,
    86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
    101, 102, 103, 104, 105, 106, 107, 108, 109, 110,
    111, 112, 113, 114, 115, 116, 117, 118, 119, 120
];

// vagas vagasTriplas sub-solo-1
const vagasTriplas = [
    1, 2, 3, 4, 5, 6, 7, 9, 10,
    11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 24,
    25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
    36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
    62, 73, 74, 75, 76, 11231
];

function playBeep() {
    const beep = new Audio("https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3");
    // beep.play();
}

function restaurarDestaques(idListaVagas) {
    const lista = document.getElementById(idListaVagas);
    const vagas = lista.querySelectorAll(".destaque");
    vagas.forEach((vaga) => {
        vaga.classList.remove("destaque");
    });
}

function mostrarContador(callback) {
    let counter = 5;
    const displayElement = document.getElementById("contador");

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
    document.getElementById("contador").classList.add("hidden");
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
    const regex = new RegExp(termo, "i");
    let found = false;

    vagas.forEach((vaga) => {
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
    return text.replace(regex, (match) => `<span class='highlight destaque'>${match}</span>`);
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function appendToList(list, content) {
    const li = document.createElement("li");
    li.innerHTML = content;
    list.appendChild(li);
}

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function resetSorteio() {
    document.getElementById("vagasDuplas").innerHTML = "";
    document.getElementById("vagasTriplas").innerHTML = "";
    document.getElementById("vagasRemanescentesDuplas").innerHTML = "";
    document.getElementById("vagasRemanescentesTriplas").innerHTML = "";
}

function realizarSorteio(maxVagasDuplas = 3, maxVagasTriplas = 3) {
    resetSorteio();
    mostrarContador(() => {
        const vagasDuplasList = document.getElementById("vagasDuplas");
        const vagasTriplasList = document.getElementById("vagasTriplas");
        const vagasRemanescentesDuplasList = document.getElementById("vagasRemanescentesDuplas");
        const vagasRemanescentesTriplasList = document.getElementById("vagasRemanescentesTriplas");

        const unidadesDuplas = [];
        const unidadesTriplas = [];

        embaralharArray(vagasDuplas);
        embaralharArray(vagasTriplas);

        const vagasDisponiveisDuplas = [...vagasDuplas];
        const vagasDisponiveisTriplas = [...vagasTriplas];

        const totalDuplasASortear = maxVagasDuplas * 2;
        const vagasSorteadasDuplas = vagasDisponiveisDuplas.splice(0, totalDuplasASortear);

        for (let i = 0; i < vagasSorteadasDuplas.length; i += 2) {
            if (i + 1 < vagasSorteadasDuplas.length) {
                const vaga1 = vagasSorteadasDuplas[i];
                const vaga2 = vagasSorteadasDuplas[i + 1];
                const unidade1 = `Grupo ${vagasDisponiveisDuplas.pop()}`;
                const unidade2 = `Grupo ${vagasDisponiveisDuplas.pop()}`;

                unidadesDuplas.push(unidade1);
                unidadesDuplas.push(unidade2);
            }
        }

        embaralharArray(unidadesDuplas);

        for (let i = 0; i < unidadesDuplas.length; i += 2) {
            const vaga1 = vagasSorteadasDuplas[i];
            const vaga2 = vagasSorteadasDuplas[i + 1];
            const unidade1 = unidadesDuplas[i];
            const unidade2 = unidadesDuplas[i + 1];
            // appendToList(vagasDuplasList, `Vaga Dupla ${vaga1} e ${vaga2}: <span class="destaque">${unidade1}</span> e <span class="destaque">${unidade2}</span>`);
            appendToList(vagasDuplasList, `Vaga Dupla ${vaga1} e ${vaga2}: <span class="destaque">${unidade1}</span>`);
        }

        const totalTriplasASortear = maxVagasTriplas * 3;
        const vagasSorteadasTriplas = vagasDisponiveisTriplas.splice(0, totalTriplasASortear);

        for (let i = 0; i < vagasSorteadasTriplas.length; i += 3) {
            if (i + 2 < vagasSorteadasTriplas.length) {
                const vaga1 = vagasSorteadasTriplas[i];
                const vaga2 = vagasSorteadasTriplas[i + 1];
                const vaga3 = vagasSorteadasTriplas[i + 2];
                const unidade1 = `Grupo ${vaga1}`;
                const unidade2 = `Grupo ${vaga2}`;
                const unidade3 = `Grupo ${vaga3}`;

                unidadesTriplas.push(unidade1);
                unidadesTriplas.push(unidade2);
                unidadesTriplas.push(unidade3);
            }
        }

        embaralharArray(unidadesTriplas);

        for (let i = 0; i < unidadesTriplas.length; i += 3) {
            if (i + 2 < unidadesTriplas.length) {
                const vaga1 = vagasSorteadasTriplas[i];
                const vaga2 = vagasSorteadasTriplas[i + 1];
                const vaga3 = vagasSorteadasTriplas[i + 2];
                const unidade1 = unidadesTriplas[i];
                const unidade2 = unidadesTriplas[i + 1];
                const unidade3 = unidadesTriplas[i + 2];
                // appendToList(vagasTriplasList, `Vaga Tripla ${vaga1}, ${vaga2}, e ${vaga3}: <span class="destaque">${unidade1}</span>, <span class="destaque">${unidade2}</span>, e <span class="destaque">${unidade3}</span>`);
                appendToList(vagasTriplasList, `Vaga Tripla ${vaga1}, ${vaga2}, e ${vaga3}: <span class="destaque">${unidade1}</span>`);
            }
        }

        vagasDisponiveisDuplas.forEach(vaga => {
            appendToList(vagasRemanescentesDuplasList, `Vaga Remanescente: <span class="destaque-verde">${vaga}</span>`);
        });

        vagasDisponiveisTriplas.forEach(vaga => {
            appendToList(vagasRemanescentesTriplasList, `Vaga Remanescente: <span class="destaque-verde">${vaga}</span>`);
        });

        document.querySelector(".search-box").style.display = "block";
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

    vagasDuplas.forEach((vaga) => {
        if (unidades.length > 0) {
            const item = `Vaga Dupla ${vaga} e ${vaga + 1}: <span class="destaque">${unidades.shift()}</span>`;
            resultadosDuplas.push(item);
            appendToList(vagasList, item);
        }
    });

    localStorage.setItem("vagasDuplas", JSON.stringify(resultadosDuplas));
}

function exibirVagasTriplas(vagasTriplas, unidades, vagasList) {
    const resultadosTriplas = [];
    resultadosTriplas.push("<strong>Vagas Triplas:</strong>");

    vagasTriplas.forEach((vaga) => {
        if (unidades.length >= 3) {
            const unidadesDestaque = unidades
                .splice(0, 3)
                .map((u) => `<span class="destaque">${u}</span>`)
                .join(", ");
            const item = `Vaga Tripla ${vaga}, ${vaga + 1}, e ${vaga + 2}: ${unidadesDestaque}`;
            resultadosTriplas.push(item);
            appendToList(vagasList, item);
        }
    });

    localStorage.setItem("vagasTriplas", JSON.stringify(resultadosTriplas));
}

document.getElementById("searchInput").addEventListener("keyup", function () {
    debounce(() => {
        const searchTerm = this.value.trim().toLowerCase();

        filtrarVagasPorTermo("vagasDuplas", searchTerm);
        filtrarVagasPorTermo("vagasTriplas", searchTerm);
    });
});
