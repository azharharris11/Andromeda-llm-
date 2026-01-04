import { CreativeFormat } from "../../types";
import { generateWithRetry } from "./client";
import { PromptContext, ENHANCERS } from "./imageUtils";
import { getFormatTextGuide } from "./imageText"; 

/**
 * NANO BANANA PRO METHODOLOGY (HYBRID ENGINE):
 * 1. Deep Context Awareness (Strategy & Pain Points).
 * 2. Dynamic Visual Direction (Lighting, Angles, Imperfection).
 * 3. Native Text Rendering.
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

// Helper: Dynamic Visual Instructions (Instruksi agar gambar "Hidup")
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
        - **LIGHTING:** Cinematic lighting (Golden Hour, Moody Shadows, or Studio High Contrast).
        - **COMPOSITION:** Rule of Thirds. Use Negative Space for text visibility.
        - **TEXTURE:** High fidelity textures (skin pores, paper grain, fabric details).
        - **DEPTH:** Strong Depth of Field (Bokeh background) to isolate the subject.
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
        rawPersona
    } = ctx;

    const isDigital = isDigitalFormat(format);
    const roleplay = getRoleplayPersona(format, isDigital);
    const dynamicVibe = getDynamicVisuals(format);
    
    // --- STRATEGIC DATA EXTRACTION ---
    const massDesire = fullStoryContext?.massDesire?.headline || "Deep Desire";
    const painPoint = rawPersona?.visceralSymptoms?.[0] || "Core Pain";
    const niche = project.productName + " " + project.productDescription; // Konteks Produk
    
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

    // CORE INSTRUCTION FOR THE PROMPT ENGINEER LLM
    const systemPrompt = `
    ROLE: Nano Banana Pro Prompt Engineer (Specialist in Native Social Ads & Cinematic Storytelling).
    
    GOAL: Write a SINGLE, UNIFIED, HIGHLY DETAILED text prompt for an AI Image Generator (Gemini/Imagen).
    
    **METHODOLOGY:**
    1. **NARRATIVE:** Write one continuous, descriptive paragraph.
    2. **ROLEPLAY:** ${roleplay}
    3. **CONTEXT AWARENESS:** Read the Niche ("${niche}") and Pain Point ("${painPoint}"). The visual mood must match this emotion (e.g. Sad=Gloomy, Success=Bright).
    4. **DYNAMIC VISUALS:**
       ${dynamicVibe}

    ${framingInstruction}

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
                temperature: 0.8, // Sedikit kreatif agar visualnya tidak kaku
            }
        });
        
        let prompt = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        
        // Failsafe: Pastikan teks dirender
        if (embeddedText && !prompt.includes(embeddedText)) {
            prompt += ` The image must feature the text "${embeddedText}" clearly visible in the scene, rendered photorealistically.`;
        }
        
        return prompt;

    } catch (e) {
        console.error("Prompt Gen Error:", e);
        // Fallback jika LLM gagal
        return `A high-quality ${isDigital ? 'photo of a phone screen' : 'cinematic photo'} featuring ${visualScene}. Context: ${niche}. The text "${embeddedText}" is clearly visible. ${dynamicVibe}`; 
    }
};