
import { CreativeFormat } from "../../types";

/**
 * SOURCE OF TRUTH FOR NATIVE TEXT RENDERING STYLES (Nano Banana Pro).
 * These guides instruct the Image Generation Model (Gemini 3) on how to render text 
 * directly into the pixels of the image.
 */
export const getFormatTextGuide = (format: CreativeFormat): string => {
    const baseGuide = "TEXT RENDERING INSTRUCTION:";
    
    switch (format) {
        // --- NATIVE SOCIAL UI (Familiarity Bias) ---
        
        case CreativeFormat.IG_STORY_TEXT:
            return `${baseGuide}
            STYLE: Instagram Story Overlay.
            FONT: San Francisco (iOS) or Modern Sans-serif. White text with black semi-transparent background blocks.
            LAYOUT: Center-aligned or Left-aligned text blocks placed naturally over the image.
            LENGHT: ultra   long    text    copy
            VIBE: Casual, "Curhat" style.`;

        case CreativeFormat.PHONE_NOTES:
            return `${baseGuide}
            STYLE: Apple Notes App UI.
            SURFACE: Textured yellowish paper background (Apple Notes style).
            FONT: System font (San Francisco), dark grey.
            ADDITION: Render a "Hand-drawn Red Circle" or "Red Arrow" looking like it was drawn by a finger, highlighting a key phrase.`;

        case CreativeFormat.TWITTER_REPOST:
        case CreativeFormat.HANDHELD_TWEET:
            return `${baseGuide}
            STYLE: Twitter/X Post UI.
            SURFACE: A printed tweet on paper OR a digital tweet overlay.
            ELEMENTS: Profile picture circle, Name, Handle, and the Tweet Body text.
            FONT: System sans-serif.
            VIBE: Authentic screenshot.`;
        
        case CreativeFormat.GMAIL_UX:
            return `${baseGuide}
            STYLE: Gmail Inbox.
            ELEMENTS: Bold Subject Line, lighter preview text.
            FONT: Roboto or Product Sans.
            VIBE: High urgency notification.`;
        
        case CreativeFormat.DM_NOTIFICATION:
        case CreativeFormat.REMINDER_NOTIF:
            return `${baseGuide}
            STYLE: iOS Lockscreen Notification bubble.
            SURFACE: Glassmorphism blur effect box.
            ICON: Tiny app icon (Message/Calendar).
            FONT: iOS System Font.
            VIBE: Urgent personal alert.`;
        
        case CreativeFormat.CHAT_CONVERSATION:
            return `${baseGuide}
            STYLE: iMessage or WhatsApp Chat Bubbles.
            COLORS: Blue bubble (Right) and Grey bubble (Left).
            FONT: iOS System Font.
            VIBE: Private conversation screenshot.`;
            
        case CreativeFormat.SEARCH_BAR:
            return `${baseGuide}
            STYLE: Google Search Bar.
            SHAPE: Rounded pill shape with shadow.
            TEXT: Inside the bar, ending with a typing cursor "|".
            FONT: Arial or Product Sans.`;

        // --- DATA & LOGIC (The Proof) ---
        
        case CreativeFormat.US_VS_THEM:
            return `${baseGuide}
            STYLE: Comparison Table (Hand-drawn or Simple Graphic).
            COLUMNS: "Them" (Red X) vs "Us" (Green Check).
            TEXT: Handwritten or bold simple font.
            VIBE: Brutal honesty.`;

        case CreativeFormat.BEFORE_AFTER:
        case CreativeFormat.OLD_ME_VS_NEW_ME:
            return `${baseGuide}
            STYLE: Split Screen Labels.
            TEXT: "Day 1" vs "Day 30" (or similar time markers).
            LOCATION: Bottom center of each split section.
            FONT: Bold white text with black outline (Subtitle style).`;
            
        case CreativeFormat.GRAPH_CHART:
        case CreativeFormat.TIMELINE_JOURNEY:
            return `${baseGuide}
            STYLE: Graph Annotation.
            ELEMENT: A hand-drawn arrow pointing to the spike in the graph.
            TEXT: Handwritten note next to the arrow explaining the result.`;
            
        case CreativeFormat.MECHANISM_XRAY:
        case CreativeFormat.ANNOTATED_PRODUCT:
        case CreativeFormat.BENEFIT_POINTERS:
            return `${baseGuide}
            STYLE: Scientific Labeling lines.
            ELEMENTS:  lines pointing to specific parts of the product.
            TEXT: Small, clean, technical font at the end of each line.`;

        case CreativeFormat.TESTIMONIAL_HIGHLIGHT:
            return `${baseGuide}
            STYLE: Highlighted testimonial Block.
            TEXT: A block of review text.
            HIGHLIGHT: Bright Neon Yellow or Green highlighter mark over the most important phrase.`;
            
        case CreativeFormat.SOCIAL_COMMENT_STACK:
            return `${baseGuide}
            STYLE: Social Media Comments Section.
            ELEMENTS: Tiny profile avatars, usernames, and comment text.
            FONT: System UI font.`;

        // --- UGLY ADS & PATTERN INTERRUPT ---
        
        case CreativeFormat.UGLY_VISUAL:
        case CreativeFormat.STICKY_NOTE_REALISM:
        case CreativeFormat.MS_PAINT:
             return `${baseGuide}
             STYLE: Handwritten Sticky Note or MS Paint Scribble.
             SURFACE: A crumpled Post-it note OR a raw digital brush stroke.
             FONT: Messy handwriting (Marker style) OR pixellated digital text.
             VIBE: Amateur, "Do It Yourself", Clean Desk Setup.`;
             
        case CreativeFormat.BIG_FONT:
        case CreativeFormat.BILLBOARD:
            return `${baseGuide}
            STYLE: Massive Bold Overlay.
            FONT: Impact or Helvetica Bold (Very Thick).
            COLOR: White with black outline or Black on Yellow background.
            SIZE: Taking up 50% of the image.`;

        case CreativeFormat.MEME:
            return `${baseGuide}
            STYLE: Classic Meme Format.
            FONT: Impact Font (White with Black Outline).
            POSITION: Top and Bottom of image.`;
        
        case CreativeFormat.REDDIT_THREAD:
            return `${baseGuide}
            STYLE: Reddit Dark Mode.
            ELEMENTS: Upvote arrow (Orange), Post Title, User handle.
            BACKGROUND: Dark Grey.
            FONT: Verdana or system sans-serif.`;

        // --- CAROUSELS ---
        
        case CreativeFormat.CAROUSEL_EDUCATIONAL:
        case CreativeFormat.CAROUSEL_PANORAMA:
            return `${baseGuide}
            STYLE: Carousel Slide Header.
            FONT: Bold, clean typography.
            LAYOUT: Big Headline at top, smaller subtext below.
            VIBE: Educational infographic.`;
            
        case CreativeFormat.CAROUSEL_PHOTO_DUMP:
            return `${baseGuide}
            STYLE: Instagram Sticker Text.
            FONT: "Modern" or "Neon" Instagram font style.
            ROTATION: Slightly tilted.`;

        case CreativeFormat.PRESS_FEATURE:
            return `${baseGuide}
            STYLE: Magazine / Newspaper Headline.
            FONT: Serif (Times New Roman style) or Bold Editorial Sans.
            VIBE: Prestigious authority.`;

        case CreativeFormat.CHECKLIST_TODO:
            return `${baseGuide}
            STYLE: Handwritten Checklist.
            ELEMENTS: Checkboxes.
            MARKINGS: Red cross marks (X) and Green check marks (V) drawn with a marker.`;

        // --- DEFAULTS ---
        case CreativeFormat.AESTHETIC_MINIMAL:
            return `${baseGuide}
            STYLE: Minimalist Overlay.
            FONT: Thin, elegant sans-serif.
            SIZE: Small and unobtrusive.`;

        default:
            return `${baseGuide}
            STYLE: Natural Text Overlay.
            LENGTHLENGTH: LONG COPY
            FONT: Realistic, consistent with the scene context.`;
    }
};
