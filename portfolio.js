let chart;
let oldName;
let day = 1;

// DOM Elements
const chartSymbol = document.querySelector(".chartSymbol");
const chartName = document.querySelector(".chartName");
const chartPrice = document.querySelector(".chartPrice");
const ShowCoin = document.querySelector("tbody");


// CoinGecko ID mapping
const coinIdMap = {
  USDC: "usd-coin",
  XRP: "ripple",
  BCH: "bitcoin-cash",
  BNB: "binancecoin",
  DOGE: "dogecoin",
  LIDOSTAKEDETHER: "staked-ether",
};

// Create day selector dropdown
const select = document.createElement("select");
[1, 7, 30].forEach((d) => {
  select.appendChild(new Option(d, d));
});
select.addEventListener("change", (e) => {
  day = parseInt(e.target.value);
  HistoricalData(oldName, day);
});

// Insert dummy data if empty
// if (localStorage.length === 0) {
//   const dummyCoins = [
//     ["USDC", "USDC", 85, "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"],
//     ["XRP", "XRP", 50, "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png"],
//   ];
//   dummyCoins.forEach(([k, ...data]) => localStorage.setItem(k, JSON.stringify([1, ...data])));
// }

// Render Portfolio Table
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const data = JSON.parse(localStorage.getItem(key));
  const [qty, symbol, currentPrice, icon] = data;

  const diff =
    currentPrice > 1000
      ? getRandomInt(1000, 2000)
      : currentPrice > 100
      ? getRandomInt(100, 150)
      : getRandomInt(10, 15);

  const buyPrice = currentPrice - diff;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${qty}</td>
    <td>${symbol}</td>
    <td>₹${buyPrice}</td>
    <td>₹${currentPrice}</td>
    <td>₹${diff}</td>
    <td class="buttons">
      <button class="showSell">Show</button>
      <button class="showSell">Sell</button>
    </td>
  `;

  const [showBtn, sellBtn] = tr.querySelectorAll("button");

  showBtn.addEventListener("click", () => {
    oldName = symbol;
    chartName.innerText = symbol;
    chartPrice.innerHTML = `₹${currentPrice} Select days: `;
    chartPrice.appendChild(select);
    chartSymbol.src = icon;
    HistoricalData(symbol, day);
  });

  sellBtn.addEventListener("click", () => {
    Sell(key, tr, qty, data);
    alert(`Hurry! You booked a profit of ₹${diff} on ${symbol}`);
  });

  ShowCoin.appendChild(tr);
}

// ===================== Chart =====================
async function HistoricalData(coinName, newDay) {
  try {
    const coinId =
      coinIdMap[coinName.toUpperCase().replace(/\s/g, "")] || coinName.toLowerCase();

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=${newDay}`
    );
    const { prices } = await res.json();

    const labels = prices.map(([time]) => {
      const date = new Date(time);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const priceData = prices.map(([, price]) => price);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("myChart"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${coinName} Chart`,
            data: priceData,
            backgroundColor: "white",
            borderColor: "red",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: false },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching chart:", error);
  }
}

// ===================== Sell Logic =====================
function Sell(key, row, qty, data) {
  const newQty = parseInt(qty);
  if (newQty > 1) {
    const updatedQty = newQty - 1;
    row.cells[0].innerText = updatedQty;
    const updatedData = [...data];
    updatedData[0] = updatedQty;
    localStorage.setItem(key, JSON.stringify(updatedData));
  } else {
    row.remove();
    localStorage.removeItem(key);

    if (chart) {
      const chartLabel = chart.data.datasets[0].label.replace(" Chart", "");
      if (chartLabel === data[1]) {
        chart.destroy();
        chartName.innerText = "Name";
        chartPrice.innerHTML = `Current_Price`;
        chartSymbol.src = "";
      }
    }
  }
}

// ===================== Utility =====================
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
