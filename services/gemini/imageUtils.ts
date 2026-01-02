
import { ProjectContext, CreativeFormat, MarketAwareness } from "../../types";

export interface ParsedAngle {
    cleanAngle: string;
    context: string;
    isPainFocused: boolean;
    isSolutionFocused: boolean;
    isUrgent: boolean;
}

export interface PromptContext {
    project: ProjectContext;
    format: CreativeFormat;
    parsedAngle: ParsedAngle;
    visualScene: string; 
    visualStyle: string; 
    textCopyInstruction: string;
    personaVisuals: string; 
    moodPrompt: string;
    culturePrompt: string;
    enhancer: string;
    safety?: string;
    rawPersona?: any;
    embeddedText?: string;
    aspectRatio?: string;
    subjectFocus: string;
    fullStoryContext: any;
    congruenceRationale?: string;
}

export const getSafetyGuidelines = (isUglyOrMeme: boolean): string => {
  const COMMON_RULES = `
    1. Humans must look realistic unless specified as cartoon.
  `;

  return `
    ${COMMON_RULES}
    5. NO realistic "before/after" split screens that violate platform policies.
  `;
};

/**
 * ENHANCERS: Updated for "Authentic Native" (Nano Banana Pro v2).
 * Goal: Look like a high-quality organic post, not a low-quality trashy image.
 */
export const ENHANCERS = {
    PROFESSIONAL: "High-end commercial photography, 8k, shot on Phase One, studio lighting, clean composition.",
    
    UGC: "Shot on iPhone 15, authentic creator vibe, natural home lighting, realistic skin textures, no filters, slightly imperfect framing.",
    
    // THE NANO BANANA PRO STANDARD (TUNED FOR AUTHENTICITY)
    NANO_BANANA_RAW: `
        STYLE: "AUTHENTIC SOCIAL" REALISM.
        CAMERA: Modern Smartphone (iPhone 15 Pro or Google Pixel), sharp focus, high resolution.
        LIGHTING: Soft natural morning light, diffused window light. AVOID harsh flash.
        ENVIRONMENT: Real home setting (lived-in, authentic textures), but NOT filthy/garbage.
        VIBE: Viral organic post, "Aesthetically Real", candid, user-generated content.
        NO: perfect symmetry, 3D render look, blurriness, pixelation, overly dark shadows.
    `
};

export const getPersonaVisualContext = (persona: any): string => {
    const painPoints = (persona.visceralSymptoms || []).join(", ");
    
    return `
        PERSONA REALITY:
        - The visual must reflect the real life of "${persona.name}".
        - CONTEXT: ${painPoints}.
        - ENVIRONMENT: A realistic, lived-in space but keeps the subject clear.
    `;
};

export const parseAngle = (angle: string): ParsedAngle => {
    const cleanAngle = angle.trim().replace(/^"|"$/g, '');
    const lower = cleanAngle.toLowerCase();
    
    return {
        cleanAngle,
        context: "",
        isPainFocused: /pain|problem|struggle|tired|failed|worst/i.test(lower),
        isSolutionFocused: /fix|solve|cure|relief|trick|hack/i.test(lower),
        isUrgent: /now|today|immediately|urgent/i.test(lower)
    };
};

export const getCulturePrompt = (country: string): string => {
  if (!country) return "";
  const lower = country.toLowerCase();
  
  
  return `SETTING: ${country} context. Ensure the environment, architectural style, and background characters match ${country}.`;
};

export const getSubjectFocus = (
    marketAwareness: MarketAwareness,
    personaVisuals: string,
    parsedAngle: ParsedAngle,
    project: ProjectContext
): string => {
    if (marketAwareness === MarketAwareness.UNAWARE) {
        return "Focus on an ANOMALY or TEXTURE close-up. Create a 'Curiosity Gap'. Do NOT show the product logo clearly yet.";
    }if (marketAwareness === MarketAwareness.PROBLEM_AWARE) 
    {
        return "Focus on the SYMPTOM. Show the problem clearly in a well-lit environment. Sharp macro shot.";
    }
    if (marketAwareness === MarketAwareness.SOLUTION_AWARE) {
        return "Focus on the COMPARISON or the MECHANISM. Show a crude but clear 'Us vs Them' setup on a table.";
    }
    return "Focus on the PRODUCT in a HAND-HELD shot. Product held by a hand in a living room/bathroom, clear focal point.";
};
