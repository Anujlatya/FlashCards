const users = [
  { name: "Rohit Sharma", email: "rohit@gmail.com", role: "User", decks: 6 },
  { name: "Anuj Latya", email: "anuj@gmail.com", role: "Admin", decks: 12 },
  { name: "Neha Singh", email: "neha@gmail.com", role: "User", decks: 4 },
  { name: "Rahul Verma", email: "rahul@gmail.com", role: "User", decks: 9 },
  { name: "Ayush Gupta", email: "ayush@gmail.com", role: "User", decks: 3 },
  { name: "Pooja Mehta", email: "pooja@gmail.com", role: "User", decks: 7 }
];

function searchTable(inputId, tableId) {
  const input = document.getElementById(inputId).value.toLowerCase();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);

  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(input)
      ? ""
      : "none";
  });
}
