const poolData = {
  UserPoolId: 'us-east-2_7bN1Cb3F3',
  ClientId: '946agk843gvi8v5dnmel0i0hb'
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
let idToken = "";
let savedGameId = "";
let totalPlayers = 0;
let teamsCount = 0;
let players = [];

window.onload = () => {
  const user = userPool.getCurrentUser();
  if (!user) return window.location.href = "login.html";

  user.getSession((err, session) => {
    if (err || !session.isValid()) return window.location.href = "login.html";
    idToken = session.getIdToken().getJwtToken();
    user.getUserAttributes((err, attrs) => {
      const email = attrs.find(attr => attr.getName() === 'email')?.getValue();
      document.getElementById("userEmail").textContent = email || "משתמש";
    });

    const scoreSelect = document.getElementById("playerRating");
    for (let i = 1; i <= 10; i += 0.5) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i;
      scoreSelect.appendChild(opt);
    }
  });
};

function logout() {
  const user = userPool.getCurrentUser();
  if (user) {
    user.signOut();
    localStorage.removeItem('idToken');
    window.location.href = "login.html";
  }
}

// ✅ יצירת משחק חדש
document.getElementById("gameForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const datetime = document.getElementById("datetime").value;
  const res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/set-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": idToken
    },
    body: JSON.stringify({ datetime, team_id: "placeholder" })
  });

  const data = await res.json();
  if (!res.ok) return alert("שגיאה ביצירת משחק");
  savedGameId = data.game_id;

  document.getElementById("statusMessage").textContent = "✅ משחק נוצר בהצלחה";
  document.getElementById("playersCountForm").style.display = "block";
});

// ✅ הגדרת מספר שחקנים
document.getElementById("playersCountForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const count = parseInt(document.getElementById("playersCount").value);
  if (isNaN(count) || count < 4 || count > 33) return alert("מספר שחקנים לא תקין");

  totalPlayers = count;

  const res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/set-playerscount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": idToken
    },
    body: JSON.stringify({ game_id: savedGameId, players_count: count })
  });

  if (!res.ok) return alert("שגיאה בשמירת מספר שחקנים");

  document.getElementById("statusMessage").textContent += "\n✅ מספר שחקנים נשמר!";
  document.getElementById("teamsForm").style.display = "block";

  // יצירת אפשרויות לחלוקת קבוצות
  const select = document.getElementById("teamsCount");
  select.innerHTML = "";
  for (let i = 2; i <= count / 2; i++) {
    if (count % i === 0) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = `${i} קבוצות של ${count / i}`;
      select.appendChild(opt);
    }
  }
});

// ✅ הגדרת מספר קבוצות
document.getElementById("teamsForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  teamsCount = parseInt(document.getElementById("teamsCount").value);

  const res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/set-teamscount", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": idToken
    },
    body: JSON.stringify({ game_id: savedGameId, teams_count: teamsCount })
  });

  if (!res.ok) return alert("שגיאה בשמירת מספר קבוצות");

  document.getElementById("statusMessage").textContent += "\n✅ מספר קבוצות נשמר!";
  document.getElementById("playersForm").style.display = "block";
  document.getElementById("playersTable").style.display = "table";
});

// ✅ הוספת שחקן חדש
function addPlayer() {
  const name = document.getElementById("playerName").value.trim();
  const position = document.getElementById("playerPosition").value;
  const rating = document.getElementById("playerRating").value;

  if (!name || !position || !rating) return alert("נא למלא את כל השדות");
  if (players.find(p => p.name === name)) return alert("שם כבר קיים");
  if (players.length >= totalPlayers) return alert("הוזנו כל השחקנים");

  // בדיקה שלא יכניסו יותר שוערים ממספר הקבוצות
  if (position === "שוער") {
    const currentGoalies = players.filter(p => p.position === "שוער").length;
    if (currentGoalies >= teamsCount) {
      return alert(`לא ניתן להזין יותר מ-${teamsCount} שוערים. כבר הוזנו ${currentGoalies}.`);
    }
  }

  players.push({ name, position, rating });
  renderPlayersTable();

  if (players.length === totalPlayers) {
    document.getElementById("continueButton").style.display = "block";
  }

  document.getElementById("playerName").value = "";
}

// ✅ הצגת טבלת השחקנים
function renderPlayersTable(disableEdit = false) {
  const tbody = document.querySelector("#playersTable tbody");
  tbody.innerHTML = "";

  players.forEach((player, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${player.name}</td>
      <td>${player.position}</td>
      <td>${player.rating}</td>
      <td>
        ${disableEdit ? '' : `
        <div style="display: flex; justify-content: center;">
          <button onclick="deletePlayer(${index})" style="
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 10px;
            cursor: pointer;
            font-size: 1rem;">
            🗑️
          </button>
        </div>`}
      </td>
    `;

    tbody.appendChild(row);
  });
}

// ✅ מחיקת שחקן
function deletePlayer(index) {
  players.splice(index, 1);
  renderPlayersTable();
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("divideTeamsButton").style.display = "none";
}

// ✅ שמירת השחקנים לשרת
async function finalizePlayers() {
  if (!savedGameId) {
    return alert("לא נבחר משחק. צור משחק לפני שמירת שחקנים.");
  }

  console.log("מתחיל שמירת שחקנים...");

  const payload = {
    game_id: savedGameId,
    players: players.map((p, index) => ({
      player_id: `${savedGameId}_player_${index}`,
      name: p.name,
      position: p.position,
      rating: parseFloat(p.rating),
      score: null
    }))
  };

  console.log("נתוני השחקנים שנשלחים:", payload);

  const res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/set-players", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": idToken
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("שגיאה:", errText);
    return alert("שגיאה בשמירת רשימת שחקנים:\n" + errText);
  }

  console.log("שחקנים נשמרו בהצלחה!");
  
  document.getElementById("statusMessage").textContent += "\n✅ כל השחקנים נשמרו לטבלה players_new!";
  renderPlayersTable(true);
  document.getElementById("continueButton").style.display = "none";
  
  console.log("מציג כפתור חלוקה לקבוצות...");
  const divideButton = document.getElementById("divideTeamsButton");
  if (divideButton) {
    divideButton.style.display = "block";
    console.log("כפתור חלוקה לקבוצות הוצג!");
  } else {
    console.error("לא נמצא כפתור חלוקה לקבוצות!");
  }
}

// ✅ חלוקה לקבוצות
async function divideTeams() {
  if (!savedGameId) return alert("משחק לא נבחר");

  console.log("=== מתחיל תהליך חלוקת קבוצות ===");

  const user = userPool.getCurrentUser();
  if (!user) {
    alert("משתמש לא מחובר");
    return window.location.href = "login.html";
  }

  user.getSession(async (err, session) => {
    if (err || !session.isValid()) {
      console.error("שגיאה בפגה:", err);
      alert("הפגה פגה, אנא התחבר מחדש");
      return window.location.href = "login.html";
    }
    
    const newToken = session.getIdToken().getJwtToken();
    idToken = newToken;

    try {
      console.log("שולח בקשה לחלוקת קבוצות...");
      
      const res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/set-teamdevider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": idToken
        },
        body: JSON.stringify({ game_id: savedGameId })
      });

      console.log("תגובת השרת:");
      console.log("Status:", res.status);
      console.log("Status Text:", res.statusText);

      if (!res.ok) {
        const errText = await res.text();
        console.error("שגיאה מהשרת:", errText);
        
        if (res.status === 401) {
          alert("שגיאת הרשאה (401). אנא התחבר מחדש.");
          return window.location.href = "login.html";
        }
        
        return alert(`שגיאה בחלוקת הקבוצות (${res.status}):\n${errText}`);
      }

      const responseData = await res.json();
      console.log("חלוקת קבוצות הושלמה בהצלחה:", responseData);
      
      // ✅ הצגת הודעת הצלחה והסתרת הכפתור
      document.getElementById("statusMessage").textContent += "\n✅ השחקנים חולקו לקבוצות בהצלחה!";
      document.getElementById("divideTeamsButton").style.display = "none";
      
      // ✅ ניסיון להציג תוצאות - אם זה לא עובד, לא נפסיק את כל התהליך
      try {
        await displayFinalResults();
      } catch (displayError) {
        console.error("שגיאה בהצגת תוצאות:", displayError);
        // נמשיך בלי להציג שגיאה למשתמש - החלוקה עבדה!
        document.getElementById("statusMessage").textContent += "\n⚠️ הקבוצות חולקו בהצלחה אך לא ניתן להציג את התוצאות כרגע";
      }
      
    } catch (error) {
      console.error("שגיאה כללית בבקשה:", error);
      alert("שגיאה בחלוקת הקבוצות: " + error.message);
    }
  });
}

// ✅ פונקציה להצגת התוצאות הסופיות - עם fallback אם אין endpoint
async function displayFinalResults() {
  try {
    console.log("מנסה לקבל נתוני קבוצות...");
    
    // ✅ ניסיון ראשון - POST ל-get-teams
    let res;
    try {
      res = await fetch("https://3fq3bcdyc7.execute-api.us-east-2.amazonaws.com/get-teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": idToken
        },
        body: JSON.stringify({ game_id: savedGameId })
      });
    } catch (networkError) {
      console.error("שגיאת רשת ב-get-teams:", networkError);
      throw new Error("לא ניתן להתחבר ל-endpoint של הצגת קבוצות");
    }

    if (!res.ok) {
      const errText = await res.text();
      console.error("שגיאה בקבלת נתוני קבוצות:", errText);
      
      if (res.status === 404) {
        throw new Error("endpoint get-teams עדיין לא קיים");
      }
      
      throw new Error(`שגיאה ${res.status} בקבלת נתוני הקבוצות`);
    }

    const teamsData = await res.json();
    console.log("נתוני קבוצות התקבלו:", teamsData);
    
    if (!teamsData.teams || teamsData.teams.length === 0) {
      throw new Error("לא נמצאו נתוני קבוצות");
    }
    
    // הצגת התוצאות
    renderFinalTable(teamsData.teams);
    
  } catch (error) {
    console.error("שגיאה בהצגת תוצאות:", error.message);
    throw error; // נעביר את השגיאה למעלה
  }
}

// ✅ פונקציה להציג את הטבלה הסופית
function renderFinalTable(teams) {
  console.log("מציג טבלה סופית עם קבוצות:", teams);
  
  // הסתרת אזור הטפסים
  document.getElementById("formsContainer").style.display = "none";
  
  // הצגת אזור התוצאות
  document.getElementById("finalResults").style.display = "block";
  
  // חישוב סטטיסטיקות
  let totalPlayersInTeams = 0;
  let totalRating = 0;
  
  teams.forEach(team => {
    totalPlayersInTeams += team.players_count;
    team.players.forEach(player => {
      totalRating += player.rating;
    });
  });
  
  const avgRating = totalPlayersInTeams > 0 ? (totalRating / totalPlayersInTeams).toFixed(1) : 0;
  
  // עדכון הסטטיסטיקות
  document.getElementById("totalTeamsCount").textContent = teams.length;
  document.getElementById("totalPlayersCount").textContent = totalPlayersInTeams;
  document.getElementById("avgRating").textContent = avgRating;
  
  // מילוי הטבלה
  const tbody = document.getElementById("teamsTableBody");
  tbody.innerHTML = "";
  
  teams.forEach(team => {
    team.players.forEach((player, playerIndex) => {
      const row = document.createElement("tr");
      
      row.innerHTML = `
        <td>
          ${playerIndex === 0 ? `<span class="team-badge">קבוצה ${team.team_number}</span>` : ''}
        </td>
        <td style="font-weight: bold;">${player.name}</td>
        <td><span class="position-badge">${player.position}</span></td>
        <td><span class="rating-badge">${player.rating}</span></td>
      `;
      
      tbody.appendChild(row);
    });
  });
  
  // גלילה לטבלה
  document.getElementById("finalResults").scrollIntoView({ 
    behavior: 'smooth' 
  });
}

// ✅ פונקציה למשחק חדש
function startNewGame() {
  // איפוס כל המשתנים
  savedGameId = "";
  totalPlayers = 0;
  teamsCount = 0;
  players = [];
  
  // הסתרת התוצאות והצגת הטפסים
  document.getElementById("finalResults").style.display = "none";
  document.getElementById("formsContainer").style.display = "block";
  
  // איפוס הטפסים
  document.getElementById("gameForm").reset();
  document.getElementById("playersCountForm").style.display = "none";
  document.getElementById("teamsForm").style.display = "none";
  document.getElementById("playersForm").style.display = "none";
  document.getElementById("playersTable").style.display = "none";
  document.getElementById("continueButton").style.display = "none";
  document.getElementById("divideTeamsButton").style.display = "none";
  document.getElementById("statusMessage").textContent = "";
  
  // גלילה לראש העמוד
  window.scrollTo({ top: 0, behavior: 'smooth' });
}