const ulInsert = document.querySelector(".coinBoxes");
const Search = document.querySelector("#searchInput");
const Suggestion = document.querySelector("#suggestions");
let chart;
//suggestions
let suggestionBox=[]
// CoinGecko ID map for accurate API usage
const coinIdMap = {
  USDC: "usd-coin",
  XRP: "ripple",
  BCH: "bitcoin-cash",
  BNB: "binancecoin",
  DOGE: "dogecoin",
  LIDOSTAKEDETHER: "staked-ether",
};

// Fetch and display top coins
async function TopCoins() {
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1&sparkline=false";

  try {
    const response = await fetch(url);
    const coins = await response.json();

    coins.forEach((coin) => {
      const coinBox = document.createElement("ul");
      coinBox.className = "CoinValue";

      // Coin image and symbol
      const wrapLi = document.createElement("li");
      const img = document.createElement("img");
      img.src = coin.image;
      img.alt = coin.name;
      img.width = 30;

      const symbol = document.createElement("h4");
      symbol.textContent = coin.symbol.toUpperCase();
      wrapLi.append(img, symbol);

      // Name, price, 24h change
      const nameLi = document.createElement("li");
      nameLi.textContent = coin.name;

      const priceLi = document.createElement("li");
      priceLi.textContent = `₹${coin.current_price}`;

      const changeLi = document.createElement("li");
      const change = coin.price_change_percentage_24h?.toFixed(2) ?? "0.00";
      changeLi.textContent = `${change}%`;
      changeLi.style.color = change >= 0 ? "green" : "red";

      // Buy button
      const buyBtn = document.createElement("button");
      buyBtn.textContent = "Buy";
      buyBtn.addEventListener("click", () => handleBuy(coin));
suggestionBox.push(coin.name)
      // Chart click
      coinBox.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
          HistoricalData(coin.name);
        }
      
      });

      // Append all
      coinBox.append(wrapLi, nameLi, priceLi, changeLi, buyBtn);
      ulInsert.appendChild(coinBox);
    });
  } catch (error) {
    console.error("Error fetching coin data:", error);
  }
}

function handleBuy(coin) {
  const username = sessionStorage.getItem("username");

  if (!username) {
    alert("You haven't signup yet!");
    window.location.href = "login.html";
    return;
  }

  const key = `key_${coin.name}`;
  let qty = JSON.parse(localStorage.getItem(key))?.[0] || 0;
  qty++;

  const coinData = [qty, coin.name, coin.current_price, coin.image];
  localStorage.setItem(key, JSON.stringify(coinData));

  alert(`You have successfully bought ${qty} ${coin.name}`);
}
Search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const input = e.target.value.toLowerCase().trim();
    if (!input) return;

    HistoricalData(input);
  }
 
});

 searchInput.addEventListener("input", (e) => {
  const input = e.target.value.toLowerCase();
  Suggestion.innerHTML = ""; // clear previous suggestions

  if (!input) return;

  suggestionBox.forEach((item) => {
    if (item.toLowerCase().includes(input)) {
      const li = document.createElement("li");
      li.innerText = item;
      li.addEventListener("click", () => {
        searchInput.value = item;
        Suggestion.innerHTML = "";
      });
      Suggestion.appendChild(li);
    }
  });
});
// Load price chart for selected coin
async function HistoricalData(coinName) {
  try {
    const coinId =
      coinIdMap[coinName.toUpperCase().replace(/\s/g, "")] ||
      coinName.toLowerCase();

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=1`
    );
    const { prices } = await res.json();

    const labels = prices.map(([time]) => {
      const date = new Date(time);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    });

    const priceData = prices.map(([_, price]) => price);

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("myChart"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: `${coinName} Price (24H)`,
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

// Init
TopCoins();
