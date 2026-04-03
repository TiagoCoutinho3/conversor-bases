const entrada = document.getElementById("valor-entrada");
const baseEntrada = document.getElementById("base-entrada");
const baseSaida = document.getElementById("base-saida");
const resultado = document.getElementById("valor-saida");

function converter() {
  let valor = entrada.value;

  let deBase = parseInt(baseEntrada.value);
  let paraBase = parseInt(baseSaida.value);

  let decimal = parseInt(valor, deBase);

  if (isNaN(decimal)) {
    resultado.innerText = "Valor inválido";
    return;
  }

  if (deBase == paraBase) {
    resultado.innerText = valor;
    return;
  }

  let valorConvertido = decimal.toString(paraBase).toUpperCase();

  resultado.innerText = valorConvertido;
}

entrada.addEventListener("input", converter);

baseEntrada.addEventListener("change", converter);
baseSaida.addEventListener("change", converter);
