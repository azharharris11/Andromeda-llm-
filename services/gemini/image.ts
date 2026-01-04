import { Type } from "@google/genai";
import { ProjectContext, CreativeFormat, GenResult, MarketAwareness } from "../../types";
import { ai, extractJSON, generateWithRetry } from "./client";
import { 
    PromptContext, 
    ENHANCERS, 
    getSafetyGuidelines, 
    getCulturePrompt, 
    getPersonaVisualContext, 
    parseAngle, 
    getSubjectFocus 
} from "./imageUtils";
import { generateAIWrittenPrompt } from "./imagePrompts";

export const generateCreativeImage = async (
  project: ProjectContext,
  persona: any,
  angle: string,
  format: CreativeFormat,
  visualScene: string,
  visualStyle: string,
  aspectRatio: string = "1:1",
  embeddedText: string,
  referenceImageBase64?: string,
  congruenceRationale?: string
): Promise<GenResult<{ imageUrl: string | null; finalPrompt: string }>> => {
  
  // NANO BANANA PRO LOGIC:
  // For text rendering and complex prompt adherence, Gemini 3 Pro Image is superior.
  const model = project.imageModel === 'pro' 
      ? "gemini-3-pro-image-preview" 
      : "gemini-2.5-flash-image"; 

  console.log(`🎨 Generating Image using Model: ${model} | Format: ${format}`);
  
  const country = project.targetCountry || "USA";
  const parsedAngle = parseAngle(angle);
  const culturePrompt = getCulturePrompt(country);
  const personaVisuals = getPersonaVisualContext(persona);

  const moodPrompt = `Lighting: ${visualStyle || " Amateur"}. Mood: High conversion direct response.`;
  const subjectFocus = getSubjectFocus(
    project.marketAwareness || MarketAwareness.PROBLEM_AWARE, 
    personaVisuals, 
    parsedAngle, 
    project
  );

  const isUglyFormat = [
    CreativeFormat.UGLY_VISUAL, 
    CreativeFormat.MS_PAINT, 
    CreativeFormat.MEME, 
    CreativeFormat.CARTOON, 
    CreativeFormat.STICKY_NOTE_REALISM,
    CreativeFormat.BIG_FONT,
    CreativeFormat.PHONE_NOTES,
    CreativeFormat.REDDIT_THREAD
  ].includes(format);

  const isNativeStory = [
    CreativeFormat.UGC_MIRROR, CreativeFormat.TWITTER_REPOST, 
    CreativeFormat.SOCIAL_COMMENT_STACK, CreativeFormat.HANDHELD_TWEET, 
    CreativeFormat.EDUCATIONAL_RANT, CreativeFormat.CHAT_CONVERSATION, 
    CreativeFormat.DM_NOTIFICATION, CreativeFormat.REMINDER_NOTIF
  ].includes(format);

  // DETERMINE ENHANCER: PRIORITIZE "UGLY/RAW"
  let appliedEnhancer = ENHANCERS.PROFESSIONAL;
  if (isUglyFormat) appliedEnhancer = ENHANCERS.NANO_BANANA_RAW; 
  else if (isNativeStory || format === CreativeFormat.CAROUSEL_REAL_STORY) appliedEnhancer = ENHANCERS.UGC;

  const safety = getSafetyGuidelines(isUglyFormat);
  
  const fullStoryContext = {
      story: persona.storyData,
      mechanism: persona.mechanismData,
      bigIdea: persona.bigIdeaData,
      massDesire: persona.massDesireData 
  };

  const ctx: PromptContext = {
      project, format, parsedAngle, visualScene, visualStyle, 
      textCopyInstruction: "", 
      personaVisuals, moodPrompt, culturePrompt, 
      subjectFocus,
      enhancer: appliedEnhancer,
      safety,
      fullStoryContext,
      congruenceRationale,
      aspectRatio,
      rawPersona: persona,
      embeddedText 
  };

  // STEP 1: Generate the ONE UNIFIED PROMPT
  const finalPrompt = await generateAIWrittenPrompt(ctx);

  // STEP 2: Construct the Parts for Nano Banana (Text Prompt + Optional Reference Image)
  const parts: any[] = [{ text: finalPrompt }];
  
  [cite_start]// NANO BANANA PRO METHOD - IMPROVED FOR FIDELITY [cite: 746, 759]
  // Reference images are passed alongside the Unified Text Prompt to guide structure/product.
  if (referenceImageBase64) {
      const base64Data = referenceImageBase64.split(',')[1] || referenceImageBase64;
      parts.unshift({ inlineData: { mimeType: "image/png", data: base64Data } });
      // Updated instruction for high fidelity preservation
      parts.push({ text: " Using the provided image as the main subject, generate the requested scene. Ensure the key features, colors, and logos of the product in the provided image remain completely unchanged and look naturally lit." });
  } else if (project.productReferenceImage) {
      const base64Data = project.productReferenceImage.split(',')[1] || project.productReferenceImage;
      parts.unshift({ inlineData: { mimeType: "image/png", data: base64Data } });
      // Updated instruction for high fidelity preservation
      parts.push({ text: " Using the provided image as the main subject, generate the requested scene. Ensure the key features, colors, and logos of the product in the provided image remain completely unchanged and look naturally lit." });
  }

  try {
    const isPro = model.includes("gemini-3-pro");
    
    const response = await generateWithRetry({
      model,
      contents: { parts },
      config: { 
          imageConfig: { 
              aspectRatio: aspectRatio === "1:1" ? "1:1" : "9:16",
              [cite_start]// ENABLE 2K RESOLUTION FOR PRO MODEL [cite: 902, 911]
              imageSize: isPro ? "2K" : undefined
          } 
      }
    });

    let imageUrl: string | null = null;
    if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageUrl = `data:image/png;base64,${part.inlineData.data}`;
                break;
            }
        }
    }
    return {
      data: { imageUrl, finalPrompt },
      inputTokens: response.usageMetadata?.promptTokenCount || 0,
      outputTokens: response.usageMetadata?.candidatesTokenCount || 0
    };
  } catch (error) {
    console.error("Image Gen Error", error);
    return { data: { imageUrl: null, finalPrompt }, inputTokens: 0, outputTokens: 0 };
  }
};

export const generateCarouselSlides = async (
  project: ProjectContext,
  format: CreativeFormat,
  angle: string,
  visualScene: string,
  visualStyle: string,
  fullStrategyContext: any,
  congruenceRationale?: string
): Promise<GenResult<{ imageUrls: string[]; prompts: string[] }>> => {
    const model = "gemini-3-flash-preview";
    const imageModel = project.imageModel === 'pro' ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

    const promptGenPrompt = `
      ROLE: Creative Director (Nano Banana Style).
      TASK: Create 3 distinct image prompts for a carousel ad (Slide 1, 2, 3).
      
      CONTEXT:
      Format: ${format}
      Angle: ${angle}
      
      METHODOLOGY:
      Write 3 Single Narrative Prompts. Each prompt must include visual description + text overlay instruction + raw style instruction.
      
      OUTPUT JSON:
      {
          "slides": [
              "Full narrative prompt for slide 1...",
              "Full narrative prompt for slide 2...",
              "Full narrative prompt for slide 3..."
          ]
      }
    `;

    let slidePrompts: string[] = [];
    let promptTokens = 0;
    
    try {
        const response = await generateWithRetry({
            model,
            contents: promptGenPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        slides: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["slides"]
                }
            }
        });
        const data = extractJSON<{slides: string[]}>(response.text || "{}");
        slidePrompts = data.slides || [];
        promptTokens += (response.usageMetadata?.promptTokenCount || 0);
    } catch (e) {
        console.error("Failed to generate slide prompts", e);
        slidePrompts = [visualScene, visualScene, visualScene]; 
    }

    const imageUrls: string[] = [];
    let outputTokens = 0;
    const isPro = imageModel.includes("gemini-3-pro");

    for (const slidePrompt of slidePrompts) {
        try {
            const imageRes = await generateWithRetry({
                model: imageModel,
                contents: { parts: [{ text: slidePrompt }] },
                config: { 
                    imageConfig: { 
                        aspectRatio: "1:1",
                        [cite_start]// ENABLE 2K RESOLUTION FOR PRO MODEL IN CAROUSEL [cite: 902]
                        imageSize: isPro ? "2K" : undefined
                    } 
                }
            });

            if (imageRes.candidates && imageRes.candidates[0].content.parts) {
                for (const part of imageRes.candidates[0].content.parts) {
                    if (part.inlineData) {
                        imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
                        break;
                    }
                }
            }
            outputTokens += (imageRes.usageMetadata?.candidatesTokenCount || 0);
        } catch (e) {
            console.error("Slide Image Gen Error", e);
        }
    }

    return {
        data: { imageUrls, prompts: slidePrompts },
        inputTokens: promptTokens,
        outputTokens: outputTokens
    };
};