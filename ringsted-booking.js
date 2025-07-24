
document.addEventListener("DOMContentLoaded", function () {
  const currentUserEmail = document.querySelector(".o--attribute--Person--Email")?.textContent?.trim() || "unknown@user.dk";
const getBookingsUrl = "https://hook.eu2.make.com/9r33arthxrl9fwifnjpvqojj25jn7x6u";
const createBookingUrl = "https://hook.eu2.make.com/q37jjfxvaxo332fuyb2dii2xhoo1k5h9";
const cancelBookingUrl = "https://hook.eu2.make.com/7xckefdjta129p5egisb9xlxx3kzxsfw";
const myBookingsUrl ="https://hook.eu2.make.com/2mg92h19d01gi83s7437xqqsw266mrxo";

const boatsContainer = document.getElementById("boatsContainer");
const datePicker = document.getElementById("datePicker");
const selectedDateDisplay = document.getElementById("selectedDateDisplay");
const feedback = document.getElementById("feedback");
const durationOptions = document.getElementById("durationOptions");
const confirmationBox = document.getElementById("confirmationBox");
const confirmationMessage = document.getElementById("confirmationMessage");


let selectedDate = new Date().toISOString().split("T")[0];
let bookings = [];
let boats = [];
const bookingCache = {};
let isLoading = false;

flatpickr(datePicker, {
defaultDate: new Date(),
minDate: "today",
dateFormat: "Y-m-d",
locale: {
firstDayOfWeek: 1,
weekdays: {
shorthand: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
longhand: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"]
},
months: {
shorthand: ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
longhand: ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"]
}
},
onChange: ([d]) => {
if (d) {
selectedDate = d.toLocaleDateString("sv-SE"); // Preserves correct local date (YYYY-MM-DD)

renderCards(); // not table, now cards
}
}
});

function showLoading(show) {
isLoading = show;
boatsContainer.innerHTML = show ? `<div class="text-center py-8">Indlæser...</div>` : "";
}

function showFeedback(msg, color = "green") {
feedback.textContent = msg;
feedback.className = `text-center text-${color}-600 font-medium mb-4`;
setTimeout(() => feedback.textContent = "", 4000);
}

function formatDate(str) {
return new Date(str).toLocaleDateString('da-DK', {
weekday: 'long',
year: 'numeric',
month: 'long',
day: 'numeric'
});
}
async function fetchAllBookingsOnce(force = false) {
  if (isLoading || (bookingCache["all"] && !force)) return;

  showLoading(true);
  try {
    const res = await fetch(getBookingsUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const allBookings = Array.isArray(data.booking) ? data.booking : [];
    const allBoats = (Array.isArray(data.boats) ? data.boats : []).filter(b => b["Is Active"]);

    bookingCache["all"] = { allBookings, allBoats };
    bookings = allBookings;
    boats = allBoats;

  } catch (e) {
    console.error(e);
    boatsContainer.innerHTML = `<div class="text-center text-red-600 py-4">Fejl ved indlæsning</div>`;
    showFeedback("Fejl ved hentning af data ❌", "red");
  } finally {
    showLoading(false);
  }
}
function renderCards() {
  hideDurationOptions();
  console.log("Rendering cards...");
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  selectedDateDisplay.textContent = `Valgt dato: ${new Date(selectedDate).toLocaleDateString('da-DK', options)}`;

  if (!bookingCache["all"]) return;
  const selectedDateObj = new Date(selectedDate);
  bookings = bookingCache["all"].allBookings.filter(b => {
    const bookingDate = new Date(b.Date);
    return bookingDate.toDateString() === selectedDateObj.toDateString();
  });
  boats = bookingCache["all"].allBoats;

  const categories = [...new Set(boats.map(boat => boat.Category))];

  const currentTime = new Date();
  const currentHour = currentTime.getHours();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const cards = categories.map(category => {
    const categoryBoats = boats.filter(boat => boat.Category === category);

    const categoryCards = categoryBoats.map(boat => {
      const label = `${boat["Boat Name"]} – ${boat.Category}`;
      const boatBookings = bookings.filter(b => b.Boat?.includes(boat.id));
      const hourMap = new Map(boatBookings.map(b => [b["Start hour"], b]));

      const bookedHours = boatBookings.map(b => ({
        startHour: Math.floor(b["Start hour"] / 3600),
        endHour: Math.floor((b["Start hour"] + b["Duration"]) / 3600),
        userEmail: b["User Email"],
        id: b.RecordID
      }));

      const badges = hours.map(hour => {
     const slotTime = new Date(selectedDateObj);
slotTime.setHours(hour, 0, 0);
const isPast = slotTime < currentTime;
        const match = bookedHours.find(b => hour >= b.startHour && hour < b.endHour);
        if (match) {
          return `<span class="inline-block px-2 py-1 m-1 text-xs rounded bg-red-200 text-red-800">${hour}:00 Optaget</span>`;
        } else if (isPast) {
          return `<span class="inline-block px-2 py-1 m-1 text-xs rounded bg-gray-200 text-gray-800">${hour}:00</span>`;
        } else {
          return `<span class="inline-block px-2 py-1 m-1 text-xs rounded bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer" onclick="handleFlexibleBooking('${boat.id}', '${label}', ${hour})">${hour}:00</span>`;
        }
      }).join("");

      return `
        <div class="border rounded-xl shadow p-4 mb-4">
          <h3 class="font-semibold mb-2">🚤 ${label}</h3>
          <div class="flex flex-wrap">${badges}</div>
        </div>
      `;
    }).join("");

    return `
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4 w-full">${category}</h2>
        <div class="block md:grid md:grid-cols-2 gap-4">
          ${categoryCards}
        </div>
      </div>
    `;
  }).join("");

  boatsContainer.innerHTML = cards || `<p class='text-center py-4'>Ingen både tilgængelige</p>`;
  console.log("Cards rendered.");
}
window.handleFlexibleBooking = function (boatId, label, startHour) {
  if (isLoading) return;
  let count = 0;
  for (let h = startHour; h < 24; h++) {
    if (bookings.some(b => b.Boat?.includes(boatId) && b["Start hour"] <= h * 3600 && h * 3600 < b["Start hour"] + b.Duration)) break;
    count++;
  }
  if (!count) return showFeedback("Ingen ledige timer", "red");

  let html = `<div class="options"><p class="mb-2">Reserver ${label} fra ${startHour}:00</p>`;
  for (let d = 1; d <= count; d++) {
    const endHour = (startHour + d) % 24;
    let displayEndHour = endHour === 0 ? '00' : endHour;
    html += `<button onclick="confirmBooking('${boatId}', '${label}', ${startHour}, ${d})" class="m-1 px-2 py-1 rounded bg-blue-600 text-white text-sm">${d} time${d > 1 ? 'r' : ''} (${startHour}:00-${displayEndHour}:00)</button>`;
  }
  html += `<button onclick="hideDurationOptions()" class="m-1 px-2 py-1 rounded bg-gray-300 text-sm">Annuller</button></div>`;
  durationOptions.innerHTML = html;
  durationOptions.classList.remove("hidden");
  // Scroll to the date picker
  datePicker.scrollIntoView({ behavior: 'smooth' });
};
window.confirmBooking = async function (boatId, label, startDateTime, durationInMinutes) {
  if (isLoading) return;
  showLoading(true);
  hideDurationOptions();

  // --- IMPORTANT: Get the user's email here ---
  let userEmailToSend = null;
  if (currentUser && currentUser.Email) {
    userEmailToSend = currentUser.Email;
  } else {
    // Handle the case where the user email is not available.
    // This might mean the user is not logged in, or the 'currentUser'
    // variable hasn't been populated yet.
    console.error("User email not available. Please ensure the user is logged in and currentUser is populated.");
    showFeedback("Cannot confirm booking: User not logged in or email not found.", "red");
    showLoading(false);
    return; // Stop the booking process
  }
  // --- End of IMPORTANT section ---

  try {
    const res = await fetch(createBookingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        boat_id: boatId,
        date: selectedDate,
        time: startDateTime * 3600,
        duration: durationInMinutes * 3600,
        user_email: userEmailToSend // Use the variable we just created
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showFeedback(`Booking confirmed for ${label} at ${startDateTime} for ${durationInMinutes} hours`, "green");
    confirmationMessage.textContent = `Booking er bekræftet for ${label} klokken ${startDateTime} for ${durationInMinutes} timer`;
    confirmationBox.classList.remove("hidden");
    boatsContainer.classList.add("hidden");
    bookingCache["all"] = undefined;
    await fetchAllBookingsOnce();
     window.renderMyBookings(); // <- 🟢 Add this line to update user's bookings

    document.getElementById("bookAnother").addEventListener("click", async () => {
      confirmationBox.classList.add("hidden");
      boatsContainer.classList.remove("hidden");
      await fetchAllBookingsOnce();
   
      renderCards();
    });

  } catch (e) {
    console.error(e);
    showFeedback("Failed to create booking", "red");
  } finally {
    showLoading(false);
  }
};
window.cancelBooking = async function (bookingId, boatId, label, startHour) {
  if (!bookingId || !confirm(`Aflyse booking (${label} @ ${startHour}:00)?`)) return;

 

  let userEmailToSend = null;
  if (currentUser && currentUser.Email) {
    userEmailToSend = currentUser.Email;
  } else {
    console.error("Brugermail ikke fundet");
    showLoading(false);
    showFeedback("Fejl: Bruger ikke logget ind", "red");
    return;
  }

  try {
    const res = await fetch(cancelBookingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, userEmail: userEmailToSend }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

  
    // Clear cache and force fresh fetch
    bookingCache["all"] = undefined;

  
    await fetchAllBookingsOnce(true); // force reload
    renderCards();           
    // show updated UI
    window.renderMyBookings();       // update user bookings list
console.log("Rendering bookings:", bookingCache["all"]);

  } catch (e) {
    console.error(e);
    alert("Aflysning fejlede ❌");
  }
};

window.hideDurationOptions = () => {
durationOptions.classList.add("hidden");
durationOptions.innerHTML = "";
};

selectedDateDisplay.textContent = `Valgt dato: ${formatDate(selectedDate)}`;
fetchAllBookingsOnce().then(renderCards);
});
window.renderMyBookings = async function() {
  const myBookingsContainer = document.getElementById("mybookings");

  let userEmailToSend = currentUser?.Email; 

  myBookingsContainer.innerHTML = ''; 

  if (!userEmailToSend) {
    myBookingsContainer.innerHTML = `<div class="text-red-500 p-4 col-span-5 text-center">Bruger-e-mail ikke fundet. Sørg for at være logget ind.</div>`;
    return;
  }

  try {
    const res = await fetch("https://hook.eu2.make.com/2mg92h19d01gi83s7437xqqsw266mrxo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userEmail: userEmailToSend }) 
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    const bookings = data.bookings; // Access the bookings property

    if (!Array.isArray(bookings) || bookings.length === 0) {
      myBookingsContainer.innerHTML += `<div class="p-4 col-span-5 text-center text-gray-500">Ingen bookinger fundet</div>`;
      return;
    }

    // Filter bookings to only include those with a date today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingBookings = bookings.filter(b => {
      const bookingDate = new Date(b.Date + "T00:00:00");
      bookingDate.setHours(0, 0, 0, 0);
      return bookingDate >= today;
    });

    if (upcomingBookings.length === 0) {
      myBookingsContainer.innerHTML += `<div class="p-4 col-span-5 text-center text-gray-500">Ingen kommende bookinger fundet</div>`;
      return;
    }

   const rowsHtml = upcomingBookings.map(b => {
  const date = new Date(b.Date + "T00:00:00").toLocaleDateString("da-DK");
  const startHour = Math.floor(b["Start hour"] / 3600);
  const durationHours = Math.floor(b["Duration"] / 3600);
  const endHour = startHour + durationHours;

const startHourText = `${startHour % 24}:00`;
const endHourText = `${endHour % 24}:00`;

  let actionHtml;
  if (b.Status === 'Cancelled') {
    actionHtml = `<span class="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">Annulleret</span>`;
  } else {
    actionHtml = `
      <button onclick="cancelBooking('${b.RecordID}', '${b.Boat[0]}', '${b['Boat Name (from Boat)'][0]}', ${startHour})"
        class="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">
        Aflys
      </button>
    `;
  }
      return `
        <tr>
          <td class="border px-4 py-2">${b["Booking ID"] || "-"}</td>
          <td class="border px-4 py-2">${b["Boat Name (from Boat)"][0] || "Ukendt"}</td>
          <td class="border px-4 py-2">${b["Category"][0] || "Ukendt"}</td>
          <td class="border px-4 py-2">${date} kl. ${startHourText} - ${endHourText}</td>
          <td class="border px-4 py-2">${durationHours} time${durationHours > 1 ? "r" : ""}</td>
          <td class="border px-4 py-2">
            ${actionHtml}
          </td>
        </tr>
      `;
    }).join("");

    myBookingsContainer.innerHTML = `
      <div class="overflow-x-auto w-full">
        <table class="w-full border-collapse border">
          <thead>
            <tr>
              <th class="border px-4 py-2">Booking ID</th>
              <th class="border px-4 py-2">Båd</th>
              <th class="border px-4 py-2">Kategori</th>
              <th class="border px-4 py-2">Tid</th>
              <th class="border px-4 py-2">Varighed</th>
              <th class="border px-4 py-2">Handling</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;

  } catch (err) {
    console.error("Fejl ved hentning af brugerbookinger:", err);
    myBookingsContainer.innerHTML = `<div class="text-red-500 col-span-5 text-center p-4">Fejl ved indlæsning af dine bookinger</div>`;
  }
}
setTimeout(() => {
  window.renderMyBookings();
}, 5000);
