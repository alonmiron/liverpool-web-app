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
  card.className = "card bg-dark text-white mb-4 shadow-sm p-3";
  card.style.borderRadius = "15px";

  const matchDate = new Date(match.utcDate);
  const date = matchDate.toLocaleDateString();
  const time = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  card.innerHTML = `
    <div class="row align-items-center">
      <!-- Left: Teams + Score -->
      <div class="col-7 d-flex flex-column justify-content-center">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="team-name">${match.homeTeam.name}</span>
          <span class="team-score">${match.score.fullTime.home ?? "-"}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <span class="team-name">${match.awayTeam.name}</span>
          <span class="team-score">${match.score.fullTime.away ?? "-"}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="col-1 d-flex justify-content-center">
        <div class="divider"></div>
      </div>

      <!-- Right: Date + Time -->
      <div class="col-4 text-end d-flex flex-column justify-content-center">
        <span class="match-date">${date}</span>
        <span class="match-time">${time}</span>
      </div>
    </div>
  `;

  return card;
}
