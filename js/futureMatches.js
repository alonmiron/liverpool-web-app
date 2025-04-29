// js/futureMatches.js
const API_KEY = "5e422a278a8842ffbe6d60a2e4e14ae3";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

document.addEventListener("DOMContentLoaded", () => {
  fetchFutureMatches();
});

function fetchFutureMatches() {
  fetch(`${CORS_PROXY}https://api.football-data.org/v4/teams/64/matches?status=SCHEDULED&limit=10`, {
    headers: { "X-Auth-Token": API_KEY }
  })
  .then(response => response.json())
  .then(data => {
    const matches = data.matches;
    const container = document.getElementById("futureMatchesContainer");
    container.innerHTML = "";

    if (matches.length === 0) {
      container.innerHTML = "<p class='text-center text-light'>No upcoming matches found.</p>";
    }

    matches.forEach(match => {
      const div = document.createElement("div");
      const matchDate = new Date(match.utcDate);
      div.className = "card bg-dark text-white mb-3 p-2";
      div.innerHTML = `
        <strong>${match.homeTeam.name} vs ${match.awayTeam.name}</strong><br>
        Date: ${matchDate.toLocaleDateString()} ${matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Error fetching future matches:", err);
  });
}
