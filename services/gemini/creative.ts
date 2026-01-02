
import { Type } from "@google/genai";
import { 
  ProjectContext, 
  CreativeFormat, 
  CreativeStrategyResult,
  GenResult, 
  StoryOption, 
  BigIdeaOption, 
  MechanismOption, 
  LanguageRegister, 
  StrategyMode,
  MarketAwareness,
  UglyAdStructure
} from "../../types";
import { ai, extractJSON, generateWithRetry } from "./client";
import { getFormatTextGuide } from "./imageText"; 

export const generateSalesLetter = async (
  project: ProjectContext,
  story: StoryOption,
  bigIdea: BigIdeaOption,
  mechanism: MechanismOption,
  hook: string,
  coliseumKeywords: string[] = [] 
): Promise<GenResult<string>> => {
  const model = "gemini-3-flash-preview";
  const country = project.targetCountry || "Indonesia";
  const awareness = project.marketAwareness || MarketAwareness.PROBLEM_AWARE;
  
  let keywordInstruction = "";
  if (coliseumKeywords && coliseumKeywords.length > 0) {
      keywordInstruction = `
      **CRITICAL VOCABULARY RULE (THE TRIBE LANGUAGE):**
      You MUST use the following insider slang/keywords naturally within the story:
      [${coliseumKeywords.join(", ")}].
      DO NOT TRANSLATE THESE. Use them raw.
      `;
  }

  let structureInstruction = "";
  if (awareness === MarketAwareness.UNAWARE) {
      structureInstruction = `
      **FRAMEWORK: 8-STEP INDIRECT STORY LEAD (Andromeda Standard for UNAWARE)**
      1. ** The Hook (Behavior/Emotion):** Start with a specific behavior or feeling. NO PRODUCT MENTION.
      2. ** Instant Identity:** Call out who this is for indirectly.
      3. ** Amplify Emotion:** Twist the knife.
      4. ** The Real Problem (UMP):** Reveal the *real* enemy.
      5. ** The New Mechanism (UMS):** Introduce the new concept/shift.
      6. ** The Discovery:** The "Epiphany" moment.
      7. ** The Transformation:** What life looks like now.
      8. ** The Offer/CTA:** ONLY NOW introduce ${project.productName}.
      TONE: Confessional, vulnerable.
      `;
  } else if (awareness === MarketAwareness.PROBLEM_AWARE) {
      structureInstruction = `
      **FRAMEWORK: PAS (Problem - Agitate - Solution)**
      1. Call out the Pain/Symptom immediately.
      2. Agitate: "It gets worse if ignored..."
      3. Introduce the Mechanism (Why it happens).
      4. Introduce the Solution (${project.productName}).
      5. Social Proof & Offer.
      `;
  } else {
      structureInstruction = `
      **FRAMEWORK: DIRECT RESPONSE OFFER (Mafia Style)**
      1. BOLD PROMISE: What result in what timeframe?
      2. THE MECHANISM: Why it works.
      3. VALUE STACK: Everything they get.
      4. RISK REVERSAL: The "Insane" Guarantee.
      5. SCARCITY: Why buy now?
      `;
  }

  const prompt = `
    ROLE: Direct Response Copywriter (Long Form / Advertorial Specialist).
    TARGET COUNTRY: ${country}. 
    TASK: Write a high-converting Sales Letter (long-form Facebook Ad) in the NATIVE language of ${country}.
    ${structureInstruction}
    STRATEGY STACK:
    1. HOOK: "${hook}"
    2. STORY: "${story.narrative}"
    3. THE SHIFT: "${bigIdea.headline}"
    4. THE SOLUTION: "${mechanism.scientificPseudo}"
    5. OFFER: ${project.offer} for ${project.productName}.
    PRODUCT DETAILS: ${project.productDescription}
    ${keywordInstruction}
    FORMAT: Markdown. Short paragraphs.
  `;

  const response = await generateWithRetry({ model, contents: prompt });

  return {
    data: response.text || "",
    inputTokens: response.usageMetadata?.promptTokenCount || 0,
    outputTokens: response.usageMetadata?.candidatesTokenCount || 0
  };
};

export const generateCreativeStrategy = async (
  project: ProjectContext, 
  fullStrategyContext: any, 
  angle: string, 
  format: CreativeFormat,
  isHVCOFlow: boolean = false
): Promise<GenResult<CreativeStrategyResult>> => {
  const model = "gemini-3-flash-preview";
  const country = project.targetCountry || "Indonesia";
  const register = project.languageRegister || LanguageRegister.CASUAL;
  
  const persona = fullStrategyContext || {};
  const personaPain = persona.visceralSymptoms ? persona.visceralSymptoms.join(", ") : "General frustration";
  const mech = fullStrategyContext?.mechanismData;
  const bigIdea = fullStrategyContext?.bigIdeaData;
  const story = fullStrategyContext?.storyData;
  const massDesire = fullStrategyContext?.massDesireData; 
  
  const coliseumKeywords = persona.meta?.coliseumKeywords || persona.coliseumKeywords || [];
  let keywordInstruction = "";
  if (coliseumKeywords.length > 0) {
      keywordInstruction = `
      **MANDATORY VOCABULARY:** Use these keywords: [${coliseumKeywords.join(", ")}].
      `;
  }

  const strategyInstruction = `
    **MANDATORY NATIVE RULE (Nano Banana Pro):**
    - **VISUAL SCENE INSTRUCTION:** Do NOT describe a polished ad. Describe a RAW SCENE.
    - Example: Instead of "A woman smiling holding product", use "A messy bathroom selfie with flash showing the product on the counter."
    
    - The 'embeddedText' must be short and natively integrated (sticky note, phone UI, cardboard sign).
  `;

  const formatInstruction = getFormatTextGuide(format);

  const prompt = `
    # ROLE: Native Advertising Expert
    TASK: Design a Creative Asset that is "Invisible" (Native Ad).
    
    CONTEXT:
    Format: ${format}
    Target: ${country}
    Product: ${project.productName}
    Hook: "${angle}"
    
    PERSONA DATA:
    Who: ${persona.name}
    Pain: ${personaPain}
    ${massDesire ? `Desire: "${massDesire.headline}"` : ''} 
    
    ${keywordInstruction}
    ${strategyInstruction}
    ${formatInstruction}
    
    **TASK:** 
    Design the COMPLETE Creative Asset.
    
    **OUTPUT JSON:**
    - visualScene: Specific RAW action/setup for the image generator. Focus on the "Real" aspect.
    - visualStyle: Camera type, lighting , mood.
    - embeddedText: The exact text string to render on the image (Native Language).
    - primaryText: Ad caption (Native Language).
    - headline: Ad headline Native Language.
    - cta: Button text.
    - rationale: Why this hooks the persona.
    - congruenceRationale: How the image visually proves the text claim.
    - uglyAdStructure: { keyword, emotion, qualifier, outcome } (MANDATORY).
  `;

  try {
    const response = await generateWithRetry({
      model,
      contents: prompt,
      config: {
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            visualScene: { type: Type.STRING },
            visualStyle: { type: Type.STRING },
            embeddedText: { type: Type.STRING },
            primaryText: { type: Type.STRING },
            headline: { type: Type.STRING },
            cta: { type: Type.STRING },
            rationale: { type: Type.STRING },
            congruenceRationale: { type: Type.STRING },
            uglyAdStructure: {
                type: Type.OBJECT,
                properties: {
                    keyword: { type: Type.STRING },
                    emotion: { type: Type.STRING },
                    qualifier: { type: Type.STRING },
                    outcome: { type: Type.STRING }
                },
                required: ["keyword", "emotion", "qualifier", "outcome"]
            }
          },
          required: ["visualScene", "visualStyle", "embeddedText", "primaryText", "headline", "cta", "rationale", "uglyAdStructure"]
        }
      }
    });

    return {
      data: extractJSON(response.text || "{}"),
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0
    };
  } catch (error) {
    console.error("Creative Strategy Generation Error", error);
    throw error;
  }
};
