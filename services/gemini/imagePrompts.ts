// services/gemini/imagePrompts.ts

import { StrategyMode, CreativeFormat, MarketAwareness } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext, ENHANCERS } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO METHODOLOGY:
 * 1. Single Unified Prompt (Narrative).
 * 2. Roleplay based.
 * 3. Text rendering embedded in the narrative.
 */

// Helper: Tentukan apakah format ini murni digital (harus full screen screenshot) atau objek fisik
const isDigitalFormat = (format: CreativeFormat): boolean => {
    const digitalFormats = [
        CreativeFormat.IG_STORY_TEXT,
        CreativeFormat.STORY_QNA,
        CreativeFormat.STORY_POLL,
        CreativeFormat.TWITTER_REPOST,
        CreativeFormat.GMAIL_UX,
        CreativeFormat.DM_NOTIFICATION,
        CreativeFormat.REMINDER_NOTIF,
        CreativeFormat.CHAT_CONVERSATION,
        CreativeFormat.REDDIT_THREAD,
        CreativeFormat.PHONE_NOTES, // Notes biasanya lebih bagus full screen screenshot
        CreativeFormat.SEARCH_BAR,
        CreativeFormat.SOCIAL_COMMENT_STACK
    ];
    return digitalFormats.includes(format);
};

const getRoleplayPersona = (format: CreativeFormat, isDigital: boolean): string => {
    if (isDigital) {
        return "Act as a Digital Interface Designer generating a high-res raw screenshot.";
    }

    if ([CreativeFormat.UGLY_VISUAL, CreativeFormat.MS_PAINT, CreativeFormat.STICKY_NOTE_REALISM].includes(format)) {
        return "Act as a regular user posting a genuine review on Reddit or Twitter.";
    }
    if (format === CreativeFormat.UGC_MIRROR) {
        return "Act as an aesthetic Gen-Z creator taking a mirror selfie.";
    }
    return "Act as a photographer capturing a candid POV shot.";
};

export const generateAIWrittenPrompt = async (ctx: PromptContext): Promise<string> => {
    const { 
        project, format, parsedAngle, visualScene, visualStyle,
        culturePrompt, congruenceRationale, aspectRatio,
        embeddedText, safety, enhancer,
        fullStoryContext,
        rawPersona
    } = ctx;

    const isUglyMode = enhancer === ENHANCERS.NANO_BANANA_RAW;
    const isDigital = isDigitalFormat(format);
    const roleplay = getRoleplayPersona(format, isDigital);
    
    // --- STRATEGIC DATA EXTRACTION ---
    const mechanism = fullStoryContext?.mechanism?.scientificPseudo || "The Solution";
    const massDesire = fullStoryContext?.massDesire?.headline || "Deep Desire";
    const painPoint = rawPersona?.visceralSymptoms?.[0] || "Core Pain";
    
    // --- UI INSTRUCTION EXTRACTION ---
    const uiInstruction = getFormatTextGuide(format);

    // --- FRAMING LOGIC (THE FIX FOR MOCKUPS) ---
    let framingInstruction = "";
    if (isDigital) {
        framingInstruction = `
        **FRAMING RULE (CRITICAL):** - **FULL SCREEN INTERFACE ONLY.** - Do **NOT** show a phone device, bezels, hands, or a background table. 
        - The image boundaries must be the exact edges of the screen interface. 
        - It must look like a direct PNG screenshot exported from the app.
        `;
    } else {
        framingInstruction = `
        **FRAMING RULE:** - **POV / SCENE SHOT.** - The subject should be in a realistic environment. 
        - Authentic angles, soft depth of field.
        `;
    }

    // CORE INSTRUCTION FOR THE PROMPT ENGINEER LLM
    const systemPrompt = `
    ROLE: Nano Banana Pro Prompt Engineer (Specialist in Native Social Ads & Text Rendering).
    
    GOAL: Write a SINGLE, UNIFIED text prompt for an AI Image Generator (Gemini/Imagen).
    
    **METHODOLOGY:**
    1. **NO SEGMENTATION:** Write one continuous, descriptive narrative.
    2. **ROLEPLAY:** ${roleplay}
    3. **EMBEDDED TEXT:** You must instruct the AI to render the text "${embeddedText}" exactly.
    4. **STYLE:**
       ${isDigital ? '- Clean, Sharp, Vector-like Quality for UI Elements.' : '- Soft Morning Lighting, Realistic textures, Clean framing.'}
    5. **NO TRASH:** Do not ask for "bad quality" or "blurry". Keep it sharp.

    ${framingInstruction}

    **STRATEGIC CONTEXT:**
    - **Core Desire:** "${massDesire}"
    - **Pain Point:** "${painPoint}"
    - **Congruence Goal:** ${congruenceRationale}

    **INPUT VISUALS:**
    - Product: ${project.productName}
    - Format: ${format}
    - UI/TEXT RULES: ${uiInstruction}
    - Visual Action: ${visualScene}
    - Text to Render: "${embeddedText}"
    - Cultural Context: ${culturePrompt}

    **OUTPUT FORMAT:**
    Return ONLY the raw prompt string.
    
    Example Output (Digital UI):
    "A direct full-screen screenshot of an Instagram Story interface against a dark gradient background. The UI features a standard poll sticker in the center with the question 'Are you tired?' and options 'Yes' and 'No'. Top left shows a user avatar and time '12h'. No phone hardware is visible, just the interface."

    Example Output (Physical Scene):
    "A sharp POV photo taken in a cozy bedroom. A hand holds a yellow sticky note against a mirror. The note says 'WAKE UP'. Soft morning light hits the paper texture."
    `;
    
    try {
        const response = await generateWithRetry({
            model: "gemini-3-flash-preview", 
            contents: systemPrompt,
            config: {
                temperature: 1.0, 
            }
        });
        
        let prompt = response.text?.trim() || "";
        
        if (embeddedText && !prompt.includes(embeddedText)) {
            prompt += ` The image must feature the text "${embeddedText}" clearly visible in the scene.`;
        }
        
        // Failsafe injection for Digital formats to prevent mockups even if LLM hallucinates
        if (isDigital) {
            prompt += " Full screen direct screenshot interface, no phone device visible, no hands, crop to screen edges.";
        }
        
        return prompt;

    } catch (e) {
        return `A high-quality ${isDigital ? 'direct screenshot interface' : 'photo'} in the style of ${format}. ${roleplay}. The scene shows: ${visualScene}. ${culturePrompt}. Render the text "${embeddedText}" naturally. ${isDigital ? 'No phone hardware visible.' : ''}`; 
    }
};