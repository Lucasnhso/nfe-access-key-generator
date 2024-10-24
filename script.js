function genRandonState() {
  const states = [
      '12', '27', '13', '16', '29', '23', '53', '32', '52', '21', '31', '50', '51', '15', 
      '25', '26', '22', '41', '33', '24', '43', '14', '11', '42', '28', '35', '17'
  ];
  return states[Math.floor(Math.random() * states.length)];
}

function genCnpj() {
  function calcularDigito(base) {
      let soma = 0;
      let pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      for (let i = 0; i < base.length; i++) {
          soma += base[i] * pesos[i];
      }
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
  }

  let baseCNPJ = '';
  for (let i = 0; i < 12; i++) {
      baseCNPJ += Math.floor(Math.random() * 10);
  }

  const digito1 = calcularDigito(baseCNPJ);
  const digito2 = calcularDigito(baseCNPJ + digito1);

  return baseCNPJ + digito1 + digito2;
}

const getYear = () => new Date().getFullYear().toString().slice(-2);
const getMonth = () => ("0" + (new Date().getMonth() + 1)).slice(-2);

function calculateDV(key) {
  const weights = [2, 3, 4, 5, 6, 7, 8, 9];
  let sum = 0;
  let weightIndex = 0;

  for (let i = key.length - 1; i >= 0; i--) {
      sum += parseInt(key[i]) * weights[weightIndex];
      weightIndex = (weightIndex + 1) % weights.length;
  }

  const remainder = sum % 11;
  const checkDigit = (remainder === 0 || remainder === 1) ? 0 : 11 - remainder;
  return checkDigit;
}

function generateAccessKey({ year, month, stateCode, cnpj}) {
  const model = "55";
  const series = ("000" + Math.floor(Math.random() * 999)).slice(-3);
  const invoiceNumber = (
    "000000000" + Math.floor(Math.random() * 999999999)
  ).slice(-9);
  const emissionType = "1";
  const numericCode = ("00000000" + Math.floor(Math.random() * 99999999)).slice(-8);

  const keyWithoutDV =
    stateCode +
    year +
    month +
    cnpj +
    model +
    series +
    invoiceNumber +
    emissionType +
    numericCode;

  const dv = calculateDV(keyWithoutDV);

  return keyWithoutDV + dv;
}

function copyKey() {
  const generatedKey = document.getElementById("keyInput").value;
  navigator.clipboard.writeText(generatedKey).then(
    function () {
      const notification = document.createElement("div");
      notification.innerText = "Chave copiada!";
      Object.assign(notification.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)"
      });
      document.body.appendChild(notification);

      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
    },
    function (err) {
      console.error("Error copying key: ", err);
    }
  );
}

function generateQRCode(key) {
  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = "";
  new QRCode(qrcodeContainer, {
    text: key,
    width: 256,
    height: 256,
  });
}

document.getElementById("generate-btn").addEventListener("click", function () {
  const accessKey = generateAccessKey({
    year: getYear(),
    month: getMonth(),
    stateCode: genRandonState(),
    cnpj: genCnpj()
  });
  document.getElementById("keyInput").value = accessKey;
  generateQRCode(accessKey);
});

document.getElementById("copy-btn").addEventListener("click", copyKey);
