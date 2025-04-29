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
      
      <!-- Left: Teams -->
      <div class="col-5 d-flex flex-column justify-content-center">
        <span class="team-name">${match.homeTeam.name}</span>
        <span class="team-name">${match.awayTeam.name}</span>
      </div>

      <!-- Middle: Scores -->
      <div class="col-3 d-flex flex-column align-items-center justify-content-center">
        <span class="team-score">${match.score.fullTime.home ?? "-"}</span>
        <span class="team-score">${match.score.fullTime.away ?? "-"}</span>
      </div>

      <!-- Divider + Date/Time vertically -->
<!-- Divider + Date/Time vertically -->
      <div class="col-4 d-flex align-items-center">
        <div class="divider me-3" style="height: 80%;"></div> <!-- adjust height manually here too -->
        <div class="d-flex flex-column justify-content-center align-items-center">
          <span class="match-date">${date}</span>
          <span class="match-time">${time}</span>
        </div>
      </div>

    </div>
  `;

  return card;
}
