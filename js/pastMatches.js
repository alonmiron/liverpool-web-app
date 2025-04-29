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
  const matchCard = createMobilePastMatchCard(match);
  container.appendChild(matchCard);
});
  })
  .catch(err => {
    console.error("Error fetching past matches:", err);
  });
}


function createMobilePastMatchCard(match) {
  const card = document.createElement("div");
  card.className = "card bg-dark text-white mb-4 shadow-sm";
  card.style.borderRadius = "15px";

  const matchDate = new Date(match.utcDate);
  const formattedDate = matchDate.toLocaleDateString();

  card.innerHTML = `
    <div class="card-body">
      <div class="row align-items-center">
        <!-- Left side: team names -->
        <div class="col-8">
          <div class="fw-semibold fs-5">${match.homeTeam.name}</div>
          <div class="fw-semibold fs-5">${match.awayTeam.name}</div>
        </div>

        <!-- Right side: vertical score -->
        <div class="col-4 text-end fs-4 fw-bold d-flex flex-column justify-content-center align-items-end">
          <div>${match.score.fullTime.home ?? "-"}</div>
          <div>${match.score.fullTime.away ?? "-"}</div>
        </div>
      </div>

      <p class="card-text text-center text-secondary small mt-3 mb-0">
        Played on: ${formattedDate}
      </p>
    </div>
  `;

  return card;
}
