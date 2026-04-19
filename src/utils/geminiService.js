/**
 * Gemini AI Classification Service
 *
 * Classifies hazard descriptions using the Gemini 2.0 Flash API.
 * Falls back to a local keyword-based classifier if the API call fails.
 *
 * @module geminiService
 */

/**
 * Classify a hazard description using Gemini AI with keyword fallback.
 *
 * @async
 * @param {string} description - The user-provided hazard description text.
 * @returns {Promise<{hazardType: string, severity: string, summary: string}>}
 *   An object containing the classified hazard type, severity level, and a brief summary.
 *
 * @example
 *   const result = await classifyAlert('Flood on Main Street');
 *   // { hazardType: 'flood', severity: 'critical', summary: 'Flood on Main Street' }
 */
export async function classifyAlert(description) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    const prompt = `Analyze this hazard and return ONLY JSON: {"hazardType":"flood/fire/accident/traffic/gas leak/power outage/crime/other","severity":"low/medium/critical","summary":"max 20 words"} Hazard: ${description}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await response.json();
    if (!data.candidates || data.candidates.length === 0) throw new Error('No candidates');
    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    // Fallback to keyword classifier
    return classifyByKeywords(description);
  }
}

/**
 * Keyword-based fallback classifier for hazard descriptions.
 *
 * @param {string} description - The user-provided hazard description text.
 * @returns {{hazardType: string, severity: string, summary: string}}
 *   An object containing the classified hazard type, severity level, and a brief summary.
 */
export function classifyByKeywords(description) {
  const text = description.toLowerCase();
  let hazardType = 'other', severity = 'low';
  if (text.includes('flood') || text.includes('water')) { hazardType = 'flood'; severity = 'critical'; }
  else if (text.includes('fire') || text.includes('smoke')) { hazardType = 'fire'; severity = 'critical'; }
  else if (text.includes('accident') || text.includes('crash')) { hazardType = 'accident'; severity = 'medium'; }
  else if (text.includes('traffic') || text.includes('jam')) { hazardType = 'traffic'; severity = 'medium'; }
  else if (text.includes('gas') || text.includes('leak')) { hazardType = 'gas leak'; severity = 'critical'; }
  else if (text.includes('power') || text.includes('outage')) { hazardType = 'power outage'; severity = 'low'; }
  const summary = description.substring(0, 50);
  return { hazardType, severity, summary };
}
