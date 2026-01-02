
import { StrategyMode, CreativeFormat, MarketAwareness } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext, ENHANCERS } from "./imageUtils";

/**
 * NANO BANANA PRO METHODOLOGY:
 * 1. Single Unified Prompt (Narrative).
 * 2. Roleplay based.
 * 3. Text rendering embedded in the narrative.
 */

const getRoleplayPersona = (format: CreativeFormat): string => {
    if ([CreativeFormat.UGLY_VISUAL, CreativeFormat.MS_PAINT, CreativeFormat.STICKY_NOTE_REALISM].includes(format)) {
        return "Act as a regular user posting a review on Reddit or Twitter.";
    }
    if ([CreativeFormat.IG_STORY_TEXT, CreativeFormat.UGC_MIRROR].includes(format)) {
        return "Act as an aesthetic Gen-Z creator sharing a 'Daily Life' update.";
    }
    if ([CreativeFormat.GMAIL_UX, CreativeFormat.DM_NOTIFICATION, CreativeFormat.PHONE_NOTES].includes(format)) {
        return "Act as a user taking a sharp screenshot of their phone screen to show proof.";
    }
    return "Act as a person taking a quick photo to send to a friend via WhatsApp.";
};

export const generateAIWrittenPrompt = async (ctx: PromptContext): Promise<string> => {
    const { 
        project, format, parsedAngle, visualScene, visualStyle,
        culturePrompt, congruenceRationale, aspectRatio,
        embeddedText, safety, enhancer,
        fullStoryContext 
    } = ctx;

    const isUglyMode = enhancer === ENHANCERS.NANO_BANANA_RAW;
    const roleplay = getRoleplayPersona(format);
    const mechanism = fullStoryContext?.mechanism?.ums || "The Solution";

    // CORE INSTRUCTION FOR THE PROMPT ENGINEER LLM
    // UPDATED: Shifted from "Bad Quality" to "Authentic Social Quality"
    const systemPrompt = `
    ROLE: Nano Banana Pro Prompt Engineer (Specialist in Native Social Ads & Text Rendering).
    
    GOAL: Write a SINGLE, UNIFIED text prompt for an AI Image Generator (Gemini/Imagen).
    
    **METHODOLOGY (THE "AUTHENTIC NATIVE" STANDARD):**
    1. **NO SEGMENTATION:** Do not split the prompt into parts. Write one continuous, descriptive narrative.
    2. **ROLEPLAY START:** Start with the persona (e.g., "A phone photo taken by...").
    3. **EMBEDDED TEXT:** You must instruct the AI to render the text "${embeddedText}" exactly. Describe *where* the text is (on a sticky note, a phone screen, a cardboard sign, or a text bubble overlay).
    4. **AUTHENTICITY > PERFECTION:** Ask for "Natural lighting," "Realistic skin texture," "Candid framing," "Depth of field." It should look like a viral organic post, NOT a cheap ad and NOT a blurry photo.
    5. **NO TRASH:** Do not ask for "bad quality" or "blurry". Ask for "Amateur composition" or "Phone camera aesthetic" but keep the subject sharp.
    
    **INPUT CONTEXT:**
    - Product: ${project.productName}
    - Format: ${format}
    - Visual Action: ${visualScene}
    - Visual Vibe: ${visualStyle}
    - Text to Render: "${embeddedText}"
    - Enhancer Profile: ${isUglyMode ? "AUTHENTIC SOCIAL / NATIVE" : "Standard Native"}
    - Cultural Context: ${culturePrompt}

    **OUTPUT FORMAT:**
    Return ONLY the raw prompt string.
    
    Example Output (Authentic):
    "A sharp iPhone photo taken in a cozy Indonesian bedroom with morning sunlight coming through the window. A hand is holding a yellow sticky note against a mirror. The sticky note has the handwritten text 'JANGAN PENCET JERAWAT' in black marker. The mirror reflection shows a messy unmade bed in the background, adding realism. The focus is sharp on the note and hand."
    `;
    
    try {
        const response = await generateWithRetry({
            model: "gemini-3-flash-preview", 
            contents: systemPrompt,
            config: {
                temperature: 1.0, // High creativity for the prompt phrasing
            }
        });
        
        let prompt = response.text?.trim() || "";
        
        // Failsafe: Ensure the text rendering instruction is definitely in there if the LLM missed it.
        if (embeddedText && !prompt.includes(embeddedText)) {
            prompt += ` The image must feature the text "${embeddedText}" clearly visible in the scene.`;
        }
        
        return prompt;

    } catch (e) {
        // Fallback Narrative Prompt
        return `A high-quality phone photo in the style of ${format}. ${roleplay}. The scene shows: ${visualScene}. ${culturePrompt}. ${enhancer}. Render the text "${embeddedText}" naturally and clearly in the image.`; 
    }
};
