function formatNumber(number) {
  const suffixes = ["", "k", "M", "B", "T", "q", "Q"];
  const cleanedNumber = Math.abs(number);
  const exponent = Math.floor(Math.log10(cleanedNumber));
  const mantissa = (
    cleanedNumber /
    10 ** (Math.floor(exponent / 3) * 3)
  ).toFixed(3);
  return `${number < 0 ? "-" : ""}${mantissa}${
    suffixes[Math.floor(exponent / 3)]
  }`;
}

window.onresize = () => {
  const windowWidth = window.innerWidth;
  const money = parseFloat(document.getElementById("money").innerText);
  const gems = parseFloat(document.getElementById("gems").innerText);
  // text
  const moneyDisplay = document.getElementById("display-text--money");
  const moneyDisplayWidth = moneyDisplay.getBoundingClientRect().width;
  const gemsDisplay = document.getElementById("display-text--gems");
  const gemsDisplayWidth = gemsDisplay.getBoundingClientRect().width;
  if (moneyDisplayWidth > windowWidth * 0.8 || windowWidth <= 768) {
    document.getElementById("display-text--money").innerText =
      formatNumber(money);
  } else {
    document.getElementById("display-text--money").innerText = money;
  }
  if (gemsDisplayWidth > windowWidth * 0.8 || windowWidth <= 768) {
    document.getElementById("display-text--gems").innerText =
      formatNumber(gems);
  } else {
    document.getElementById("display-text--gems").innerText = gems;
  }
  // formattable numbers
  const formattableNumbers = document.getElementsByClassName(
    "formattable-number--sample"
  );
  const formatThreshold = windowWidth * 0.275;
  for (let number of formattableNumbers) {
    const rawNumber = parseFloat(number.innerText);
    const id = number.id.replace("__sample", "");
    const transactionDisplayWidth = document
      .getElementById(id)
      .getBoundingClientRect().width;
    // format number
    console.log(transactionDisplayWidth, formatThreshold);
    if (transactionDisplayWidth > formatThreshold || windowWidth <= 768) {
      document.getElementById(`${id}`).innerText = formatNumber(rawNumber);
    } else {
      document.getElementById(`${id}`).innerText = rawNumber;
    }
  }
};
