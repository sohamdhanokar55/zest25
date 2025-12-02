import express from "express";
import cors from "cors";
import { google } from "googleapis";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_SHEETS_SPREADSHEET_ID,
  RAZORPAY_KEY_SECRET,
} = process.env;

if (
  !GOOGLE_SERVICE_ACCOUNT_EMAIL ||
  !GOOGLE_PRIVATE_KEY ||
  !GOOGLE_SHEETS_SPREADSHEET_ID
) {
  console.warn(
    "[WARN] Google Sheets environment variables are not fully configured. " +
      "Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY and GOOGLE_SHEETS_SPREADSHEET_ID."
  );
}

if (!RAZORPAY_KEY_SECRET) {
  console.warn(
    "[WARN] RAZORPAY_KEY_SECRET is not configured. Payment verification will fail until it is set."
  );
}

// Create Google Sheets client
const auth =
  GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY
    ? new google.auth.JWT(
        GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/spreadsheets"]
      )
    : null;

const sheets = auth ? google.sheets({ version: "v4", auth }) : null;

// Cache sheet metadata so we can map title -> sheetId for merges
let sheetMetaCache = null;

async function getSheetMeta() {
  if (!sheets) {
    throw new Error("Google Sheets client not initialized");
  }
  if (sheetMetaCache) return sheetMetaCache;
  const res = await sheets.spreadsheets.get({
    spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
  });
  sheetMetaCache = res.data.sheets?.reduce((acc, sheet) => {
    if (sheet.properties?.title != null && sheet.properties.sheetId != null) {
      acc[sheet.properties.title] = sheet.properties.sheetId;
    }
    return acc;
  }, {});
  return sheetMetaCache;
}

// Utility: verify Razorpay signature
function verifyRazorpaySignature(orderId, paymentId, signature) {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error("RAZORPAY_KEY_SECRET is not configured on server");
  }
  const hmac = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET);
  hmac.update(`${orderId}|${paymentId}`);
  const expected = hmac.digest("hex");
  return expected === signature;
}

// Map frontend sport/category/event to Google Sheet tab name
function resolveSheetName({ sportKey, category, athleticsEvent, subCategory }) {
  switch (sportKey) {
    case "football":
      return "Football";
    case "kabaddi":
      if (category === "boys") return "Kabaddi(Boys)";
      if (category === "girls") return "Kabaddi(Girls)";
      break;
    case "basketball":
      if (category === "boys") return "Basketball(Boys)";
      if (category === "girls") return "Basketball(Girls)";
      break;
    case "badminton":
      if (category === "singles-boys") return "BadmintonBoys(Singles)";
      if (category === "singles-girls") return "BadmintonGirls(Singles)";
      if (category === "doubles-boys") return "BadmintonBoys(Doubles)";
      if (category === "doubles-girls") return "BadmintonGirls(Doubles)";
      if (category === "mixed") return "Badminton(Mixed)";
      break;
    case "volleyball":
      if (category === "boys") return "Volleyball(Boys)";
      if (category === "girls") return "Volleyball(Girls)";
      break;
    case "cricket":
      return "Cricket";
    case "athletics": {
      if (!athleticsEvent) break;
      // 100M / 200M separated by gender
      if (athleticsEvent === "100m") {
        if (category === "boys") return "AthleticsBoys(100M)";
        if (category === "girls") return "AthleticsGirls(100M)";
      }
      if (athleticsEvent === "200m") {
        if (category === "boys") return "AthleticsBoys(200M)";
        if (category === "girls") return "AthleticsGirls(200M)";
      }
      if (athleticsEvent === "400m") {
        if (category === "boys") return "AthleticsBoys(400M)";
        if (category === "girls") return "AthleticsGirls(400M)";
      }
      if (athleticsEvent === "800m") {
        if (category === "boys") return "AthleticsBoys(800M)";
        if (category === "girls") return "AthleticsGirls(800M)";
      }
      if (athleticsEvent === "Long Jump") {
        if (category === "boys") return "LongJump(Boys)";
        if (category === "girls") return "LongJump(Girls)";
      }
      if (athleticsEvent === "Shot Put") {
        if (subCategory === "boys") return "ShotPut(Boys)";
        if (subCategory === "girls") return "ShotPut(Girls)";
      }
      if (athleticsEvent === "Relay") {
        if (category === "boys") return "Relay(Boys)";
        if (category === "girls") return "Relay(Girls)";
      }
      if (athleticsEvent === "Mixed Relay") return "MixedRelay";
      break;
    }
    case "carrom":
      if (category === "singles") return "Carrom(Singles)";
      if (category === "doubles") return "Carrom(Doubles)";
      break;
    case "chess":
      return "Chess";
    case "tug-of-war":
      if (category === "boys") return "TugofWar(Boys)";
      if (category === "girls") return "TugofWar(Girls)";
      break;
    case "bgmi":
      return "BGMI";
    case "valorant":
      return "Valorant";
    case "table-tennis":
      if (category === "singles-boys") return "TableTennis(Boys)";
      if (category === "singles-girls") return "TableTennis(Girls)";
      if (category === "doubles-boys") return "TableTennisBoys(Doubles)";
      if (category === "doubles-girls") return "TableTennisGirls(Doubles)";
      if (category === "mixed") return "TableTennis(Mixed)";
      break;
    case "box-cricket":
      return "BoxCricket";
    case "futsal":
      return "Futsal";
    default:
      break;
  }
  throw new Error(
    `Unsupported sport/category combination: ${sportKey} / ${category} / ${athleticsEvent}`
  );
}

// Compute next Sr. No for a sheet by reading column A starting row 6
async function getNextSerialNumber(sheetTitle) {
  if (!sheets) throw new Error("Google Sheets client not initialized");
  const range = `${sheetTitle}!A6:A`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
    range,
  });
  const rows = res.data.values || [];
  if (rows.length === 0) return 1;
  // Find last non-empty row
  let last = null;
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][0] != null && rows[i][0] !== "") {
      last = rows[i][0];
      break;
    }
  }
  if (!last) return 1;
  const parsed = parseInt(last, 10);
  return Number.isNaN(parsed) ? 1 : parsed + 1;
}

// Append registration rows and merge cells for team sports
async function appendRegistration({
  sheetTitle,
  serialNumber,
  members,
  contact,
  group,
  numberOfPlayers,
  paymentId,
}) {
  if (!sheets) throw new Error("Google Sheets client not initialized");

  // Columns: A Sr. No | B Team Members | C Contact | D Dept | E Group | F No. of Players | G Payment ID
  const values = members.map((m) => [
    serialNumber,
    m.name,
    contact,
    `${m.branch}${m.semester}K`,
    group,
    numberOfPlayers,
    paymentId,
  ]);

  const startRow = await (async () => {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      range: `${sheetTitle}!A6:A`,
    });
    const existing = res.data.values || [];
    return 6 + existing.length; // first data row is 6
  })();

  const endRow = startRow + values.length - 1;

  const range = `${sheetTitle}!A${startRow}:G${endRow}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values,
    },
  });

  // Merge for team sports if more than one member
  if (members.length > 1) {
    const meta = await getSheetMeta();
    const sheetId = meta[sheetTitle];
    if (sheetId == null) {
      throw new Error(`Sheet ID not found for title ${sheetTitle}`);
    }

    const startRowIndex = startRow - 1; // zero-based
    const endRowIndex = endRow; // exclusive

    const mergeColumns = [0, 2, 4, 5, 6]; // A, C, E, F, G
    const requests = mergeColumns.map((col) => ({
      mergeCells: {
        range: {
          sheetId,
          startRowIndex,
          endRowIndex,
          startColumnIndex: col,
          endColumnIndex: col + 1,
        },
        mergeType: "MERGE_ALL",
      },
    }));

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: GOOGLE_SHEETS_SPREADSHEET_ID,
      requestBody: { requests },
    });
  }
}

app.post(
  "https://apvcouncil.in/api/store-registration.php",
  async (req, res) => {
    try {
      const {
        sportKey,
        category,
        athleticsEvent,
        shotPutSubCategory,
        teamLeader,
        players,
        numberOfPlayers,
        payment,
        relayPlayers,
      } = req.body || {};

      if (
        !payment?.razorpay_order_id ||
        !payment?.razorpay_payment_id ||
        !payment?.razorpay_signature
      ) {
        return res
          .status(400)
          .json({ error: "Missing Razorpay payment information" });
      }

      const valid = verifyRazorpaySignature(
        payment.razorpay_order_id,
        payment.razorpay_payment_id,
        payment.razorpay_signature
      );
      if (!valid) {
        return res.status(400).json({ error: "Invalid payment signature" });
      }

      if (!teamLeader) {
        return res.status(400).json({ error: "Missing teamLeader data" });
      }

      const sheetTitle = resolveSheetName({
        sportKey,
        category,
        athleticsEvent,
        subCategory: shotPutSubCategory,
      });

      const serialNumber = await getNextSerialNumber(sheetTitle);

      // Determine actual members list:
      // - For relay athletics, use provided relayPlayers if available.
      // - For strictly single-player events we rely only on team leader.
      // - For team sports and doubles/mixed we include leader + provided players.
      const isRelayAthletics =
        sportKey === "athletics" &&
        (athleticsEvent === "Relay" || athleticsEvent === "Mixed Relay");

      const isSinglePlayer =
        sportKey === "chess" ||
        (sportKey === "carrom" && category === "singles") ||
        (sportKey === "table-tennis" &&
          (category === "singles-boys" || category === "singles-girls")) ||
        (sportKey === "badminton" &&
          (category === "singles-boys" || category === "singles-girls")) ||
        (sportKey === "athletics" && !isRelayAthletics);

      let members;
      if (
        isRelayAthletics &&
        Array.isArray(relayPlayers) &&
        relayPlayers.length > 0
      ) {
        members = relayPlayers.map((p) => ({
          name: p.name,
          branch: p.branch,
          semester: p.semester,
        }));
      } else if (isSinglePlayer) {
        members = [
          {
            name: teamLeader.name,
            branch: teamLeader.branch,
            semester: teamLeader.semester,
          },
        ];
      } else {
        members = [
          {
            name: teamLeader.name,
            branch: teamLeader.branch,
            semester: teamLeader.semester,
          },
          ...(players || []),
        ];
      }

      const contact = `${teamLeader.contact} / ${teamLeader.alternateContact}`;

      await appendRegistration({
        sheetTitle,
        serialNumber,
        members,
        contact,
        group: teamLeader.group,
        numberOfPlayers,
        paymentId: payment.razorpay_payment_id,
      });

      res.json({ success: true });
    } catch (err) {
      console.error("Error storing registration", err);
      res.status(500).json({ error: "Failed to store registration" });
    }
  }
);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
