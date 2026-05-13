import fs from "fs";
import readline from "readline";
import { executeBatch } from "./d1Batch.js";

const CLEANED_JSON = "categories_clean.json";
const PROGRESS_FILE = ".import_progress.json";
const BATCH_SIZE = 100;

function escapeSQLString(str) {
  return str.replace(/'/g, "''");
}

// Simple readline interface for prompts
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    }),
  );
}

async function loadProgress() {
  try {
    const data = fs.readFileSync(PROGRESS_FILE, "utf8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function importCategories() {
  console.log("📖 Reading cleaned JSON...");
  const rawData = fs.readFileSync(CLEANED_JSON, "utf8");
  const data = JSON.parse(rawData);

  // Flatten all categories
  const categories = [];
  for (const vertical of data.verticals) {
    categories.push(...vertical.categories);
  }
  const total = categories.length;
  console.log(`Found ${total} categories.`);

  // Sort by level to ensure parents before children
  categories.sort((a, b) => a.level - b.level);

  // Check for existing progress
  let progress = await loadProgress();
  let startIndex = 0;
  if (progress && progress.total === total) {
    const answer = await askQuestion(
      `Previous import progress found (last processed index ${progress.lastIndex}). Resume? (y/n): `,
    );
    if (answer.toLowerCase() === "y") {
      startIndex = progress.lastIndex;
      console.log(`Resuming from index ${startIndex}...`);
    } else {
      console.log("Starting from beginning.");
    }
  } else if (progress) {
    console.log(
      "Progress file mismatch or incomplete. Starting from beginning.",
    );
  }

  // Prompt for confirmation to start
  const confirm = await askQuestion(
    `Import ${total - startIndex} categories? (y/n): `,
  );
  if (confirm.toLowerCase() !== "y") {
    console.log("Import cancelled.");
    return;
  }

  // Prepare statements for remaining categories
  const statements = [];
  for (let i = startIndex; i < total; i++) {
    const cat = categories[i];
    const taxonomyId = cat.id;
    const name = escapeSQLString(cat.name);
    const level = cat.level;
    let parentIdSubquery = "NULL";
    if (cat.parent_id) {
      parentIdSubquery = `(SELECT id FROM categories WHERE taxonomy_id = '${cat.parent_id}')`;
    }
    const sql = `
      INSERT OR IGNORE INTO categories (id, taxonomy_id, name, parent_id, level, created_at)
      VALUES (lower(hex(randomblob(16))), ?, ?, ${parentIdSubquery}, ?, CURRENT_TIMESTAMP)
    `;
    statements.push({
      sql,
      params: [taxonomyId, name, level],
    });
  }

  // Process in batches
  const totalStatements = statements.length;
  let currentIndex = startIndex;
  let batchNumber = Math.floor(startIndex / BATCH_SIZE) + 1;

  for (let i = 0; i < totalStatements; i += BATCH_SIZE) {
    const batch = statements.slice(i, i + BATCH_SIZE);
    const batchStart = currentIndex + 1;
    const batchEnd = Math.min(currentIndex + batch.length, total);
    console.log(
      `\nProcessing batch ${batchNumber} (${batchStart}–${batchEnd})...`,
    );

    try {
      await executeBatch(batch);
      console.log(`✅ Batch ${batchNumber} succeeded.`);

      // Update progress
      currentIndex += batch.length;
      await saveProgress({
        total,
        lastIndex: currentIndex,
        timestamp: new Date().toISOString(),
      });
      batchNumber++;
    } catch (err) {
      console.error(`❌ Batch ${batchNumber} failed:`, err.message);
      // Ask user what to do
      const action = await askQuestion(
        "Retry (r), skip this batch (s), or abort (a)? ",
      );
      if (action.toLowerCase() === "r") {
        // Retry the same batch (do not advance i)
        i -= BATCH_SIZE; // will increment at loop end, so effectively retry
        console.log("Retrying batch...");
        continue;
      } else if (action.toLowerCase() === "s") {
        // Skip batch, update progress to after this batch
        currentIndex += batch.length;
        await saveProgress({
          total,
          lastIndex: currentIndex,
          timestamp: new Date().toISOString(),
        });
        batchNumber++;
        console.log("Skipped batch, continuing...");
      } else {
        console.log("Aborted. Progress saved, you can resume later.");
        process.exit(1);
      }
    }
  }

  console.log("\n✅ Import completed successfully!");
  // Optionally remove progress file after successful completion
  if (fs.existsSync(PROGRESS_FILE)) {
    fs.unlinkSync(PROGRESS_FILE);
  }
}

// Handle Ctrl+C to save progress before exit
process.on("SIGINT", async () => {
  console.log("\nInterrupted. Saving progress...");
  // We need to capture current index. We'll save it in a variable accessible globally.
  // For simplicity, we'll just re-use the same progress saving logic if we have a progress variable.
  // We'll set a flag.
  if (typeof currentIndex !== "undefined") {
    await saveProgress({
      total: categories.length,
      lastIndex: currentIndex,
      timestamp: new Date().toISOString(),
    });
    console.log("Progress saved. You can resume later.");
  }
  process.exit(0);
});

importCategories().catch(console.error);
