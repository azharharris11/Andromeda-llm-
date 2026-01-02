import { CreativeFormat } from "../../types";

/**
 * SOURCE OF TRUTH FOR NATIVE TEXT RENDERING STYLES (Nano Banana Pro).
 * These guides instruct the Image Generation Model (Gemini 3) on how to render text 
 * directly into the pixels of the image.
 */
export const getFormatTextGuide = (format: CreativeFormat): string => {
    const baseGuide = "TEXT RENDERING INSTRUCTION:";
    
    switch (format) {
        // ============================================================
        // GROUP 1: NATIVE SOCIAL UI (High Risk of Identity Confusion)
        // ============================================================
        
        case CreativeFormat.IG_STORY_TEXT:
            return `${baseGuide}
            STYLE: Instagram Story Overlay.
            FONT: San Francisco (iOS) or Modern Sans-serif. White text with black semi-transparent background blocks.
            LAYOUT: Center-aligned or Left-aligned text blocks.
            IDENTITY RULE: 
             - The text MUST be from the "Healer/Guide" perspective (e.g. "Do you feel this?").
             - OR "Past Self" perspective (e.g. "I used to struggle with..."). 
             - NEVER present the Brand as currently suffering/complaining.
            VIBE: Casual, "Curhat" style but Authoritative.`;

        case CreativeFormat.STORY_POLL:
            return `${baseGuide}
            STYLE: Instagram Story Poll Sticker.
            ELEMENTS: The Poll Question + Two Option Buttons.
            IDENTITY RULE: 
             - Question: Ask the AUDIENCE (e.g. "Sering ngerasa hampa?").
             - Options: Audience Responses (e.g. "Sering bgt 😭" / "Jarang").
             - DO NOT make the question sound like the Brand is asking for help.`;

        case CreativeFormat.STORY_QNA:
            return `${baseGuide}
            STYLE: Instagram Q&A Sticker Response.
            LAYOUT: A white "Question Box" (from a follower) and text below it (Brand's Answer).
            IDENTITY RULE: 
             - Question Box: MUST look like a Client/Follower asking/venting (e.g. "Kak, aku capek bgt...").
             - Answer Text: MUST be the Brand giving empathy/solution.`;

        case CreativeFormat.PHONE_NOTES:
            return `${baseGuide}
            STYLE: Apple Notes App UI.
            SURFACE: Textured yellowish paper background.
            FONT: System font (San Francisco), dark grey.
            IDENTITY RULE:
             - HEADER: Must be "Journal", "Klien bilang...", or "Catatan Hati".
             - BODY: Can be a raw complaint, BUT the header must imply it's a quote/journal, not the Brand's official statement.`;

        case CreativeFormat.TWITTER_REPOST:
        case CreativeFormat.HANDHELD_TWEET:
            return `${baseGuide}
            STYLE: Twitter/X Post UI.
            SURFACE: Paper print OR Digital Overlay.
            IDENTITY RULE: 
             - IF text is Sad/Complaint -> Handle: "u/SadGirl", "Anon", or "User123" (NOT Brand Name).
             - IF text is Tips/Quote -> Handle: Brand Name.
            FONT: System sans-serif.`;
        
        case CreativeFormat.GMAIL_UX:
            return `${baseGuide}
            STYLE: Gmail Inbox Row.
            ELEMENTS: Sender Name, Bold Subject, Lighter Preview.
            IDENTITY RULE: Sender Name MUST be the "Source of Pain" (e.g. "Ex-Boyfriend", "Debt Collector") OR "The Solution" (e.g. "The Universe").
            FONT: Roboto.`;
        
        case CreativeFormat.DM_NOTIFICATION:
        case CreativeFormat.REMINDER_NOTIF:
            return `${baseGuide}
            STYLE: iOS Lockscreen Notification.
            SURFACE: Glassmorphism blur.
            IDENTITY RULE: 
             - SENDER: Must be a person relevant to the pain (e.g. "Mama", "Him", "Crush").
             - MESSAGE: The content of the text/pain.
            FONT: iOS System Font.`;
        
        case CreativeFormat.CHAT_CONVERSATION:
            return `${baseGuide}
            STYLE: iMessage/WhatsApp.
            LAYOUT: 
             - LEFT (Grey/White): The Victim/Client complaining.
             - RIGHT (Blue/Green): The Guide/Brand answering.
            IDENTITY RULE: NEVER put the complaint in the Right (Blue) bubble.
            FONT: iOS System Font.`;
            
        case CreativeFormat.SEARCH_BAR:
            return `${baseGuide}
            STYLE: Google Search Bar.
            SHAPE: Rounded pill.
            TEXT: Inside the bar + cursor "|".
            IDENTITY RULE: The text is what the VICTIM is secretly searching for (e.g. "kenapa aku susah jodoh"), NOT a brand slogan.`;

        case CreativeFormat.REDDIT_THREAD:
            return `${baseGuide}
            STYLE: Reddit Post Dark Mode.
            ELEMENTS: Upvote, Title, User.
            IDENTITY RULE: Username must be "u/Throwaway..." or generic. Brand cannot be the OP of a complaint thread.`;

        case CreativeFormat.SOCIAL_COMMENT_STACK:
            return `${baseGuide}
            STYLE: Social Media Comments.
            ELEMENTS: Avatars + Usernames + Text.
            IDENTITY RULE: Usernames must be random people. This is Social Proof, not Brand Statement.`;
            
        case CreativeFormat.REELS_THUMBNAIL:
            return `${baseGuide}
            STYLE: Instagram Reels Cover.
            IDENTITY RULE:
             - IF Title is "POV: [Pain]" -> Visual is the Victim.
             - IF Title is "Stop doing this" -> Visual is the Expert (Brand).`;

        // ============================================================
        // GROUP 2: VISUAL & CREATOR FORMATS
        // ============================================================

        case CreativeFormat.UGC_MIRROR:
            return `${baseGuide}
            STYLE: Mirror Selfie.
            SUBJECT: A Gen-Z/Millennial creator holding phone.
            IDENTITY RULE: Text Overlay must look like a Customer Testimonial ("Finally found this..."), not the CEO complaining.`;

        case CreativeFormat.EDUCATIONAL_RANT:
            return `${baseGuide}
            STYLE: Green Screen / Talking Head overlay.
            SUBJECT: The Expert (You) looking confident/serious.
            IDENTITY RULE: The text caption must be Educational/Controversial Truth.`;
            
        case CreativeFormat.WHITEBOARD:
            return `${baseGuide}
            STYLE: Expert drawing on Whiteboard.
            IDENTITY RULE: You are the Teacher. The text on board is the LESSON/FRAMEWORK, not a diary entry.`;

        case CreativeFormat.MEME:
            return `${baseGuide}
            STYLE: Classic Meme (Top Text / Bottom Text).
            IDENTITY RULE: Use "Me when..." or "Nobody:...", referring to the AUDIENCE's experience.`;
            
        case CreativeFormat.COLLAGE_SCRAPBOOK:
            return `${baseGuide}
            STYLE: Aesthetic Scrapbook / Moodboard.
            IDENTITY RULE: If depicting pain, label it "Current Vibe" or "Mood". If depicting solution, label it "Vision Board".`;

        // ============================================================
        // GROUP 3: PATTERN INTERRUPT & UGLY ADS
        // ============================================================
        
        case CreativeFormat.UGLY_VISUAL:
        case CreativeFormat.STICKY_NOTE_REALISM:
        case CreativeFormat.MS_PAINT:
             return `${baseGuide}
             STYLE: Handwritten Sticky Note or MS Paint Scribble.
             SURFACE: A crumpled Post-it note OR a raw digital brush stroke.
             IDENTITY RULE: 
              - IF text is "I am sad/broke" -> Sign it as "- A Client" or "Journal".
              - IF text is "Wake Up!" -> It is the Brand speaking.`;
             
        case CreativeFormat.BIG_FONT:
        case CreativeFormat.BILLBOARD:
            return `${baseGuide}
            STYLE: Massive Typography Poster.
            BACKGROUND: Solid color or texture.
            IDENTITY RULE: This is a HEADLINE/ANNOUNCEMENT. It must sound objective (e.g. "Jodoh itu Cerminan Diri"), not subjective whining.`;

        // ============================================================
        // GROUP 4: DATA, LOGIC & CONVERSION
        // ============================================================
        
        case CreativeFormat.US_VS_THEM:
            return `${baseGuide}
            STYLE: Comparison Table.
            IDENTITY RULE: "Us" is the Brand (Winner). "Them" is the Competitor/Old Way (Loser).`;

        case CreativeFormat.BEFORE_AFTER:
        case CreativeFormat.OLD_ME_VS_NEW_ME:
            return `${baseGuide}
            STYLE: Split Screen Labels.
            TEXT: "Dulu (Stuck)" vs "Sekarang (Lega)".
            IDENTITY RULE: Clearly mark the timeline so the "Bad" part is in the PAST.`;
            
        case CreativeFormat.TIMELINE_JOURNEY:
             return `${baseGuide}
             STYLE: A Journey Map / Roadmap.
             IDENTITY RULE: 
              - "My Journey": From Pain (Past) to Healed (Present).
              - "Your Journey": From Stuck (Now) to Goal (Future).`;

        case CreativeFormat.CHECKLIST_TODO:
            return `${baseGuide}
            STYLE: Handwritten Checklist.
            IDENTITY RULE:
             - "To-Do List": Actions the client needs to take.
             - "Symptoms List": Things the client is feeling (Validation).`;

        case CreativeFormat.TESTIMONIAL_HIGHLIGHT:
        case CreativeFormat.CAROUSEL_TESTIMONIAL:
            return `${baseGuide}
            STYLE: Review Block.
            IDENTITY RULE: Must include 5 Stars and a Client Name to attribute the quote correctly.`;
            
        case CreativeFormat.PRESS_FEATURE:
            return `${baseGuide}
            STYLE: Magazine / Newspaper Headline.
            IDENTITY RULE: The text is what the MEDIA says about you (Third party validation).`;
            
        case CreativeFormat.GRAPH_CHART:
        case CreativeFormat.VENN_DIAGRAM:
             return `${baseGuide}
             STYLE: Data Visualization.
             IDENTITY RULE: Objective facts/logic. No personal pronouns "I/Me".`;

        // ============================================================
        // GROUP 5: CAROUSELS & OTHERS
        // ============================================================
        
        case CreativeFormat.CAROUSEL_EDUCATIONAL:
        case CreativeFormat.CAROUSEL_PANORAMA:
        case CreativeFormat.LONG_TEXT:
            return `${baseGuide}
            STYLE: Educational Content.
            IDENTITY RULE: The Voice of the Expert/Teacher.`;
            
        case CreativeFormat.CAROUSEL_REAL_STORY:
        case CreativeFormat.CAROUSEL_PHOTO_DUMP:
            return `${baseGuide}
            STYLE: Storytelling / Photo Dump.
            IDENTITY RULE: "A Day in My Life" (Brand Owner) OR "Client Success Story" (Client). Context must be clear in the first slide.`;
            
        case CreativeFormat.MECHANISM_XRAY:
        case CreativeFormat.ANNOTATED_PRODUCT:
        case CreativeFormat.BENEFIT_POINTERS:
        case CreativeFormat.LEAD_MAGNET_3D:
            return `${baseGuide}
            STYLE: Product Showcase / Scientific Diagram.
            IDENTITY RULE: Objective Product Presentation.`;
            
        case CreativeFormat.AESTHETIC_MINIMAL:
        case CreativeFormat.POV_HANDS:
        default:
            return `${baseGuide}
            STYLE: Natural Text Overlay.
            IDENTITY RULE: Ensure the text attribution is clear. If it's a negative sentiment, frame it as a question or client quote.`;
    }
};