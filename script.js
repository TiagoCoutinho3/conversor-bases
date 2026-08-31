const entrada = document.getElementById("valor-entrada");

const baseEntrada = document.getElementById("base-entrada");

const baseSaida = document.getElementById("base-saida");

const resultado = document.getElementById("valor-saida");
const botaoCopiar = document.getElementById("copiar-resultado");

const DIGIT_REGEX = {
  2: /^[01]*$/,

  8: /^[0-7]*$/,

  10: /^[0-9]*$/,

  16: /^[0-9a-fA-F]*$/,
};

const MAX_FRAC_DIGITS_OUT = 12;

function parseNumberFromBase(str, base) {
  const normalized = str.replace(/,/g, ".").trim();

  if ((normalized.match(/\./g) || []).length > 1) {
    return NaN;
  }

  const [intRaw, fracRaw = ""] = normalized.split(".");

  const intStr = intRaw === "" ? "0" : intRaw;

  if (!DIGIT_REGEX[base].test(intStr) || !DIGIT_REGEX[base].test(fracRaw)) {
    return NaN;
  }

  const intPart = parseInt(intStr, base);

  if (isNaN(intPart)) {
    return NaN;
  }

  let fracSum = 0;

  for (let i = 0; i < fracRaw.length; i++) {
    const d = parseInt(fracRaw[i], base);

    if (isNaN(d) || d >= base) {
      return NaN;
    }

    fracSum += d * Math.pow(base, -(i + 1));
  }

  return intPart + fracSum;
}

function numberToBase(num, base) {
  if (num < 0) {
    return "-" + numberToBase(-num, base);
  }

  const eps = 1e-14;

  const intPart = Math.floor(num + eps);

  let frac = num - intPart;

  if (frac < 0) {
    frac = 0;
  }

  const intStr = intPart.toString(base);

  if (frac < eps) {
    return intStr.toUpperCase();
  }

  let fracPart = frac;

  let digits = "";

  let n = 0;

  while (fracPart > eps && n < MAX_FRAC_DIGITS_OUT) {
    fracPart *= base;

    const d = Math.floor(fracPart + eps);

    digits += d.toString(base);

    fracPart -= d;

    n++;
  }

  return (intStr + "." + digits).toUpperCase();
}

function atualizarBotaoCopiar() {
  const textoResultado = resultado.textContent.trim();
  const deveMostrar =
    textoResultado !== "" && !textoResultado.startsWith("Erro:");

  botaoCopiar.classList.toggle("hidden", !deveMostrar);
  botaoCopiar.textContent = "Copiar resultado";
}

async function copiarResultado() {
  const textoResultado = resultado.textContent.trim();

  if (!textoResultado || textoResultado.startsWith("Erro:")) {
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textoResultado);
    } else {
      const areaTemporaria = document.createElement("textarea");
      areaTemporaria.value = textoResultado;
      document.body.appendChild(areaTemporaria);
      areaTemporaria.select();
      document.execCommand("copy");
      document.body.removeChild(areaTemporaria);
    }

    botaoCopiar.textContent = "Copiado!";
    setTimeout(() => {
      botaoCopiar.textContent = "Copiar resultado";
    }, 1200);
  } catch (error) {
    botaoCopiar.textContent = "Falha ao copiar";
    setTimeout(() => {
      botaoCopiar.textContent = "Copiar resultado";
    }, 1200);
  }
}

function converter() {
  let valorOriginal = entrada.value.trim();

  let deBase = parseInt(baseEntrada.value);

  let paraBase = parseInt(baseSaida.value);

  if (valorOriginal === "") {
    resultado.innerText = "";
    atualizarBotaoCopiar();
    return;
  }

  const valorParaCalculo = valorOriginal.replace(/,/g, ".");

  if ((valorParaCalculo.match(/\./g) || []).length > 1) {
    resultado.innerText = "Erro: use no máximo um separador decimal";
    atualizarBotaoCopiar();
    return;
  }

  const decimal = parseNumberFromBase(valorOriginal, deBase);

  if (isNaN(decimal)) {
    resultado.innerText = "Erro: Caractere inválido para a base " + deBase;
    atualizarBotaoCopiar();
    return;
  }

  if (deBase === paraBase) {
    resultado.innerText = valorOriginal;
    atualizarBotaoCopiar();
    return;
  }

  if (paraBase === 10) {
    resultado.innerText = decimal.toLocaleString("pt-BR", {
      maximumFractionDigits: 10,
    });
  } else {
    resultado.innerText = numberToBase(decimal, paraBase);
  }

  atualizarBotaoCopiar();
}

function validarBases(event) {
  if (baseEntrada.value === baseSaida.value) {
    if (event.target === baseEntrada) {
      baseSaida.value = baseEntrada.value === "10" ? "2" : "10";
    } else {
      baseEntrada.value = baseSaida.value === "10" ? "2" : "10";
    }
  }

  converter();
}

entrada.addEventListener("input", converter);

baseEntrada.addEventListener("change", validarBases);

baseSaida.addEventListener("change", validarBases);

botaoCopiar.addEventListener("click", copiarResultado);

atualizarBotaoCopiar();
