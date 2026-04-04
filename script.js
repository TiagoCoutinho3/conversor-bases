const entrada = document.getElementById("valor-entrada");
const baseEntrada = document.getElementById("base-entrada");
const baseSaida = document.getElementById("base-saida");
const resultado = document.getElementById("valor-saida");

function converter() {
    let valorOriginal = entrada.value.trim();
    let deBase = parseInt(baseEntrada.value);
    let paraBase = parseInt(baseSaida.value);

    if (valorOriginal === "") {
        resultado.innerText = "0";
        return;
    }

    let regexBase;
    if (deBase === 2) regexBase = /^[01.]+$/;
    else if (deBase === 8) regexBase = /^[0-7.]+$/;
    else if (deBase === 10) regexBase = /^[0-9.,]+$/;
    else if (deBase === 16) regexBase = /^[0-9a-fA-F.]+$/;

    if (!regexBase.test(valorOriginal)) {
        resultado.innerText = "Erro: Caractere inválido para a base " + deBase;
        return;
    }

    let valorParaCalculo = valorOriginal.replace(",", ".");

    if (deBase === paraBase) {
        resultado.innerText = valorOriginal;
        return;
    }

    let decimal;
    if (deBase === 10) {
        decimal = parseFloat(valorParaCalculo);
    } else {
        decimal = parseInt(valorParaCalculo, deBase);
    }

    if (isNaN(decimal)) {
        resultado.innerText = "Erro de conversão";
        return;
    }

    if (paraBase === 10) {
        resultado.innerText = decimal.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
    } else {
        resultado.innerText = Math.floor(decimal).toString(paraBase).toUpperCase();
    }
}

function validarBases(event) {
    if (baseEntrada.value === baseSaida.value) {
        if (event.target === baseEntrada) {
            baseSaida.value = (baseEntrada.value === "10") ? "2" : "10";
        } else {
            baseEntrada.value = (baseSaida.value === "10") ? "2" : "10";
        }
    }
    converter();
}

entrada.addEventListener('input', converter);
baseEntrada.addEventListener('change', validarBases);
baseSaida.addEventListener('change', validarBases);