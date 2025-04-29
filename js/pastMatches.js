// js/pastMatches.js
const API_KEY = "5e422a278a8842ffbe6d60a2e4e14ae3";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

document.addEventListener("DOMContentLoaded", () => {
  fetchPastMatches();
});

function fetchPastMatches() {
  fetch(`${CORS_PROXY}https://api.football-data.org/v4/teams/64/matches?status=FINISHED&limit=10`, {
    headers: { "X-Auth-Token": API_KEY }
  })
  .then(response => response.json())
  .then(data => {
    const matches = data.matches;
    const container = document.getElementById("pastMatchesContainer");
    container.innerHTML = "";

    if (matches.length === 0) {
      container.innerHTML = "<p class='text-center text-light'>No finished matches found.</p>";
    }

matches.forEach(match => {
  const matchCard = createPastMatchCard(match);
  container.appendChild(matchCard);
});
  })
  .catch(err => {
    console.error("Error fetching past matches:", err);
  });
}


function createPastMatchCard(match) {
  const div = document.createElement("div");
  div.className = "card bg-dark text-white mb-3 shadow-sm";
  div.style.borderRadius = "15px";

  const matchDate = new Date(match.utcDate);
  const formattedDate = matchDate.toLocaleDateString();

  div.innerHTML = `
    <div class="card-body">
      <h6 class="card-title text-center text-uppercase mb-3">
        ${match.homeTeam.name} vs ${match.awayTeam.name}
      </h6>

      <div class="row text-center align-items-center mb-3">
        <div class="col-5 col-md-5">
          <span class="fw-semibold">${match.homeTeam.name}</span>
        </div>
        <div class="col-2 col-md-2">
          <span class="fs-5 fw-bold">${match.score.fullTime.home ?? "-"}</span><br>
          <span class="text-light">:</span><br>
          <span class="fs-5 fw-bold">${match.score.fullTime.away ?? "-"}</span>
        </div>
        <div class="col-5 col-md-5">
          <span class="fw-semibold">${match.awayTeam.name}</span>
        </div>
      </div>

      <p class="card-text text-center small text-secondary">
        Played on: ${formattedDate}
      </p>
    </div>
  `;

  return div;
}
