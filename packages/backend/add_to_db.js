// packages/backend/add_to_db.js

// Used to add plant's nutritional data to database
import { exit } from 'process';
import sql from './access_db.js';
import { exec } from 'child_process';

async function getPlant() {
  exec("python3 plant_api.py", async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting API server: ${error}`);
      return;
    }

    if (stderr) {
      console.error(`API server error output: ${stderr}`);
    }

    const data = JSON.parse(stdout);

    await sql`
    SELECT * FROM plants
    `;
    console.log("All plants:", data.name)
  });

}

async function setPlant() {
  
  exec("python3 plant_api.py ", async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error starting API server: ${error}`);
      return;
    }

    if (stderr) {
      console.error(`API server error output: ${stderr}`);
    }

    const data = JSON.parse(stdout);

    const nutrients = data.nutrients;
    await sql`
    INSERT INTO plants (
      name,
      kcal,
      fat,
      carbohydrates,
      fiber,
      sugars,
      protein,
      calcium,
      potassium,
      magnesium,
      vitamin_c
    )
    VALUES (
      ${data.name},
      ${nutrients["Energy"] ?? 0},
      ${nutrients["Total lipid (fat)"] ?? 0},
      ${nutrients["Carbohydrate, by difference"] ?? 0},
      ${nutrients["Fiber, total dietary"] ?? 0},
      ${nutrients["Total Sugars"] ?? 0},
      ${nutrients["Protein"] ?? 0},
      ${nutrients["Calcium, Ca"] ?? 0},
      ${nutrients["Potassium, K"] ?? 0},
      ${nutrients["Magnesium, Mg"] ?? 0},
      ${nutrients["Vitamin C, total ascorbic acid"] ?? 0}
    )`;

    await sql`
    INSERT INTO plant_pages (
      name
    )
    VALUES (
      ${data.name}
    )`
    console.log("Inserted plant:", data.name);
    exit(0);
  });
}

setPlant();