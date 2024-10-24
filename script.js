function calculateDV(key) {
  const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 43; i++) {
    sum += parseInt(key[i]) * weights[i % 11];
  }

  const remainder = sum % 11;
  return remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
}


function generateAccessKey() {
  const stateCode = "41";
  const year = "24";
  const month = "04";
  const cnpj = "12345678000195";
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
      alert("Chave copiada!");
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
  const accessKey = generateAccessKey();
  document.getElementById("keyInput").value = accessKey;
  generateQRCode(accessKey);
});

document.getElementById("copy-btn").addEventListener("click", copyKey);
