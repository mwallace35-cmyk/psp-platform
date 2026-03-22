import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "AIzaSyC3ku-5xRcMkxCr7RayHRD4ex27Tbmcd7w" });

const BANNER_DIR = path.join(process.cwd(), "public", "banners");

// Ensure output directory exists
if (!fs.existsSync(BANNER_DIR)) {
  fs.mkdirSync(BANNER_DIR, { recursive: true });
}

const SPORT_PROMPTS = {
  basketball: `Dark navy blue background (#0a1628). Aerial overhead view of a basketball court hardwood floor, dramatic blue lighting from above casting sharp shadows. The court lines glow faintly blue. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style, shallow depth of field on the court lines. Paint zone and three-point arc visible.`,

  football: `Dark navy blue background (#0a1628). Aerial overhead view of a football field at night, green turf with crisp white yard lines and hash marks. Dramatic stadium lighting creating pools of light and shadow. The 50 yard line prominent. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style. End zone visible at edge.`,

  baseball: `Dark navy blue background (#0a1628). Aerial overhead view of a baseball diamond at dusk, infield dirt and outfield grass contrast. Dramatic warm orange stadium lights casting long shadows across the bases. The pitcher's mound and base paths clearly visible. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style.`,

  soccer: `Dark navy blue background (#0a1628). Aerial overhead view of a soccer pitch at night, pristine green grass with white field markings. Center circle and penalty areas visible. Dramatic cool-toned stadium lighting. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style. Geometric patterns from the field lines.`,

  "track-field": `Dark navy blue background (#0a1628). Aerial overhead view of a running track at night, red/orange track surface with white lane lines curving around the oval. Starting blocks visible. Dramatic purple-tinted stadium lighting. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style.`,

  lacrosse: `Dark navy blue background (#0a1628). Close-up of a lacrosse field at night, green grass with white field markings and crease circles. A lacrosse stick and ball in the foreground, slightly out of focus. Dramatic teal-blue stadium lighting. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style.`,

  wrestling: `Dark navy blue background (#0a1628). Overhead view of a wrestling mat, red and blue mat surface with white circles and starting lines. Dramatic golden-yellow spotlight from above. Abstract and cinematic, moody atmosphere. Wide panoramic banner format 4:1 aspect ratio. No text, no people, no logos. Professional sports photography style. The mat texture is prominent.`,
};

async function generateBanner(sport, prompt) {
  console.log(`Generating ${sport} banner...`);
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["image", "text"],
      },
    });

    // Extract image from response
    if (response.candidates && response.candidates[0]) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData) {
          const imageData = part.inlineData.data;
          const mimeType = part.inlineData.mimeType;
          const ext = mimeType.includes("png") ? "png" : "jpg";
          const filePath = path.join(BANNER_DIR, `${sport}.${ext}`);
          fs.writeFileSync(filePath, Buffer.from(imageData, "base64"));
          console.log(`  Saved: ${filePath}`);
          return true;
        }
      }
    }
    console.log(`  No image returned for ${sport}`);
    console.log(`  Response:`, JSON.stringify(response).substring(0, 500));
    return false;
  } catch (error) {
    console.error(`  Error generating ${sport}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("=== Generating Sport Banner Images ===\n");

  // Start with just basketball as a test
  const testSport = process.argv[2] || "basketball";

  if (testSport === "all") {
    for (const [sport, prompt] of Object.entries(SPORT_PROMPTS)) {
      await generateBanner(sport, prompt);
      // Small delay between requests
      await new Promise((r) => setTimeout(r, 2000));
    }
  } else {
    await generateBanner(testSport, SPORT_PROMPTS[testSport]);
  }

  console.log("\nDone!");
}

main();
