import { CreativeFormat } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext, ENHANCERS } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO METHODOLOGY (REFINED):
 * 1. Structured Narrative Formula (Subject -> Env -> Light -> Camera).
 * 2. Technical Photorealism (Lens, Aperture, Texture).
 * 3. Semantic Negative Prompting (Positive descriptions only).
 * 4. Native Text Rendering Integration.
 */

// Helper: Tentukan apakah format ini murni digital (UI) atau objek fisik (Scene)
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
        CreativeFormat.PHONE_NOTES,
        CreativeFormat.SEARCH_BAR,
        CreativeFormat.SOCIAL_COMMENT_STACK,
        // Graphics
        CreativeFormat.BIG_FONT,
        CreativeFormat.MEME,
        CreativeFormat.US_VS_THEM
    ];
    return digitalFormats.includes(format);
};

// Helper: Dynamic Visual Instructions (Technical Photography & Realism)
const getDynamicVisuals = (format: CreativeFormat): string => {
    if (isDigitalFormat(format)) {
        return `
        - **ANGLE:** Slight tilt or "Handheld Camera" shake to make it look candid/real.
        - **LIGHTING:** Screen reflection/glare on the glass surface. Avoid flat digital export look.
        - **ENVIRONMENT:** Blurred background context (e.g. Bed sheets for night texts, Coffee shop table for work emails).
        - **IMPERFECTION:** A thumb partially visible in the corner, screen smudges, or organic clutter.
        `;
    } else {
        return `
        - **LIGHTING:** Use specific setups: "Golden hour", "Three-point softbox setup", "Diffused window light", or "Moody cinematic lighting".
        - **CAMERA:** Specify lens type: "Captured with an 85mm portrait lens", "Macro shot", or "Wide-angle".
        - **APERTURE:** Mention "f/1.8 for bokeh/blurred background" or "f/8 for sharp focus".
        - **TEXTURE:** Emphasize material properties: "Matte finish", "Polished concrete", "Detailed fabric grain", "Skin pores".
        `;
    }
};

const getRoleplayPersona = (format: CreativeFormat, isDigital: boolean): string => {
    if (isDigital) {
        return "Act as a specialized UI/UX Photographer capturing a viral social media screenshot in a real-world context.";
    }
    if ([CreativeFormat.UGLY_VISUAL, CreativeFormat.MS_PAINT, CreativeFormat.STICKY_NOTE_REALISM].includes(format)) {
        return "Act as a regular user posting a genuine, raw review on Reddit or Twitter.";
    }
    if (format === CreativeFormat.UGC_MIRROR) {
        return "Act as an aesthetic Gen-Z creator taking a mirror selfie.";
    }
    return "Act as an Award-Winning Commercial Photographer & Art Director.";
};

export const generateAIWrittenPrompt = async (ctx: PromptContext): Promise<string> => {
    const { 
        project, format, visualScene, 
        embeddedText, enhancer,
        fullStoryContext,
        rawPersona,
        // @ts-ignore - Pastikan update interface PromptContext di imageUtils.ts
        hasReferenceImage 
    } = ctx;

    const isDigital = isDigitalFormat(format);
    const roleplay = getRoleplayPersona(format, isDigital);
    const dynamicVibe = getDynamicVisuals(format);
    
    // --- STRATEGIC DATA EXTRACTION ---
    const massDesire = fullStoryContext?.massDesire?.headline || "Deep Desire";
    const painPoint = rawPersona?.visceralSymptoms?.[0] || "Core Pain";
    const niche = project.productName + " " + project.productDescription;
    
    // --- UI INSTRUCTION EXTRACTION ---
    const uiInstruction = getFormatTextGuide(format);

    // --- FRAMING LOGIC ---
    let framingInstruction = "";
    if (isDigital) {
        framingInstruction = `
        **FRAMING RULE (CRITICAL):** - Show a **PHONE SCREEN** in a real environment (Handheld or on surface). 
        - Do NOT make it a flat digital export. It must look like a PHOTO of a screen.
        - Screen glare and reflections are mandatory for realism.
        `;
    } else {
        framingInstruction = `
        **FRAMING RULE:** - **POV / SCENE SHOT.** - Authentic angles, soft depth of field.
        - No "AI Plastic" look. Make it gritty/textured.
        `;
    }

    // --- REFERENCE IMAGE LOGIC ---
    let referenceInstruction = "";
    if (hasReferenceImage) {
        referenceInstruction = `
        **CRITICAL REFERENCE RULE:** - The user has provided a REFERENCE IMAGE of a product or person.
        - In your prompt, DO NOT describe a generic product/person. Instead, explicitly write: "The provided product image positioned on..." or "The provided person wearing...".
        - Focus on describing the ENVIRONMENT, LIGHTING, and INTEGRATION of the provided subject, ensuring its key features remain unchanged.
        `;
    }

    // CORE INSTRUCTION FOR THE PROMPT ENGINEER LLM
    const systemPrompt = `
    ROLE: Nano Banana Pro Prompt Engineer (Specialist in Native Social Ads & Cinematic Storytelling).
    
    GOAL: Write a SINGLE, UNIFIED, HIGHLY DETAILED text prompt for an AI Image Generator (Gemini/Imagen).
    
    **METHODOLOGY:**
    1. **STRUCTURED NARRATIVE (Follow this Formula):**
       - Sentence 1: A [Style] [Shot Type] of [Subject] performing [Action].
       - Sentence 2: Set in [Environment/Background].
       - Sentence 3: Illuminated by [Lighting Description], creating a [Mood].
       - Sentence 4: Captured with [Camera/Lens Details] emphasizing [Texture/Detail].
    2. **ROLEPLAY:** ${roleplay}
    3. **SEMANTIC NEGATIVE PROMPTS:** Do NOT use negative words like "no blur", "no distortion". Instead, describe the positive state: "sharp focus", "perfect anatomy", "clean lines".
    4. **DYNAMIC VISUALS:**
       ${dynamicVibe}

    ${framingInstruction}
    ${referenceInstruction}

    **STRATEGIC CONTEXT:**
    - **Niche/Product:** ${niche}
    - **Core Desire:** "${massDesire}"
    - **Pain Point:** "${painPoint}"

    **INPUT VISUALS:**
    - Format: ${format}
    - UI/TEXT RULES: ${uiInstruction}
    - Visual Action: ${visualScene}
    - Text to Render: "${embeddedText}"

    **OUTPUT FORMAT:**
    Return ONLY the raw prompt string. Do not include "Here is the prompt".
    `;
    
    try {
        const response = await generateWithRetry({
            model: "gemini-2.0-flash-exp", // Gunakan model cepat & pintar
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
                temperature: 0.75, // Sedikit diturunkan agar lebih patuh pada struktur formula
            }
        });
        
        let prompt = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        // Failsafe: Pastikan teks dirender dengan instruksi FONT SPESIFIK
        if (embeddedText && !prompt.includes(embeddedText)) {
            const fontStyle = isDigital 
                ? "modern, clean Sans-Serif UI font" 
                : "bold, professional typography";
            const placement = isDigital 
                ? "clearly displayed on the screen interface" 
                : "integrated naturally into the scene";
                
            prompt += ` Render the text "${embeddedText}" in a ${fontStyle}, ${placement}. The text must be legible and contrast well with the background.`;
        }
        
        return prompt;

    } catch (e) {
        console.error("Prompt Gen Error:", e);
        // Fallback jika LLM gagal
        return `A high-quality ${isDigital ? 'photo of a phone screen' : 'cinematic photo'} featuring ${visualScene}. Context: ${niche}. The text "${embeddedText}" is clearly visible. ${dynamicVibe}`; 
    }
};