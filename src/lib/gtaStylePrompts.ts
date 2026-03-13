// src/lib/gtaStylePrompts.ts
// Prompts baseados no estilo visual real dos screenshots oficiais GTA VI (Rockstar, Maio 2025)

export const GTA6_BASE = [
  "hyperrealistic game engine screenshot quality",
  "GTA VI Leonida State Florida visual fidelity",
  "Rockstar Games photorealistic rendering engine",
  "harsh direct Florida sunlight or neon night practical lighting",
  "naturalistic high saturation color — not filtered or graded",
  "photojournalistic composition eye-level camera",
  "shallow depth of field background bokeh",
  "real-world textures: worn asphalt concrete weathered surfaces",
  "original fictional characters no real people no celebrities",
  "8K ultra sharp detail subtle film grain",
].join(", ");

export const webDesignGTA = `${GTA6_BASE}, young woman character with braided hair and paint-stained fingers, wearing oversized vintage band tee tucked into wide-leg trousers, standing in sunlit Vice City creative studio loft interior, large printed posters and brand mockups pinned to exposed brick wall, natural harsh Florida midday sun pouring through industrial windows, creating sharp shadows across the workspace, design table covered in sketchbooks printed mockups Pantone swatches, iMac screen showing colorful UI design visible in background bokeh, eye level medium shot, warm practical sunlight, weathered wood floor aged industrial brick authentic Vice City vibe, casual focused expression exactly like GTA VI NPC naturalistic style`;

export const desenvolvimentoGTA = `${GTA6_BASE}, young male developer character with overgrown fade haircut, wearing worn dark hoodie and sweatpants casual late night, sitting hunched at desk in small Vice City apartment at 2am, two monitors left showing terminal green text right showing code editor, face lit only by cold blue monitor glow in otherwise dark room, pizza box on floor headphones around neck, window behind showing Vice City skyline neon signs at night, practical interior lighting just the monitors and a desk lamp, messy authentic apartment cables everywhere stickers on laptop, eye level medium shot from side of desk, deep focus on character and monitors city bokeh through window`;

export const servicosGTA = `${GTA6_BASE}, confident male character late twenties clean cut slight stubble, wearing light blue linen short-sleeve shirt and chino pants, standing at glass balcony railing of Vice City luxury penthouse, holding phone showing charts, Vice City ocean and skyline panorama behind in bright Florida afternoon, harsh midday Florida sun casting strong shoulder shadows, outdoor penthouse terrace lounge chairs tropical plants pool edge visible, realistic Vice City high-rise skyline behind with ocean shimmer, eye level three-quarter shot showing character and full panoramic backdrop`;

export const inovacaoIAGTA = `${GTA6_BASE}, young woman character with sleek ponytail tech company badge lanyard, wearing fitted dark polo shirt and slim trousers, standing at large touchscreen display wall in modern Vice City tech lab, screen showing AI data visualization dashboard with neural network diagram, hands touching and swiping the interactive screen, modern open-plan tech office interior other workstations visible in bokeh, floor-to-ceiling windows showing Vice City skyline in afternoon light, eye level medium shot from slight angle showing screen and character`;

export const mobileWebGTA = `${GTA6_BASE}, young male character medium build natural hair, wearing tank top board shorts and slides classic Vice City beach outfit, sitting on Vice City beach boardwalk concrete wall facing camera, laptop open on knees showing web app phone in hand, bright harsh Florida beach sun at midday hard shadows on face, real Vice City beach behind white sand blue-green ocean beach umbrellas, people in background bokeh walking the boardwalk, authentic beach textures worn concrete railing faded boardwalk paint, neon-signed beach bars and taco stands visible in background bokeh, eye level shot`;

export const skillsGTA = `${GTA6_BASE}, confident young developer character short natural hair slight smirk, wearing dark fitted crew neck tee and dark jeans, standing in front of large whiteboard or monitor wall in Vice City co-working space, arms crossed casual confident posture owning the room, modern co-working interior exposed ducts brick walls neon open-plan, afternoon Florida sun through large side windows casting sharp shadows, other desks computers plants visible in background bokeh, eye level full body shot showing character and entire whiteboard behind`;

export const focussDevGTA = `${GTA6_BASE}, young male founder character dark hair sharp jawline calm confidence, wearing all-black minimal outfit black tee black trousers clean sneakers, standing at edge of Vice City rooftop terrace at late golden hour, looking at camera with slight forward lean on railing, entire Vice City skyline behind him skyscrapers neon signs ocean horizon, low Florida golden sun hitting face and shoulders from the side, harsh warm sidelight creating strong shadows across face, rooftop textures weathered concrete railing HVAC units gravel surface, realistic Vice City skyline depth authentic Leonida urban landscape, eye level medium full body shot`;

export const gtaStylePrompts: Record<string, string> = {
  "web-design": webDesignGTA,
  "desenvolvimento": desenvolvimentoGTA,
  "servicos": servicosGTA,
  "inovacao-ia": inovacaoIAGTA,
  "mobile-web": mobileWebGTA,
  "skills": skillsGTA,
  "focuss-dev": focussDevGTA,
};

export function getGTAImageSize(isMobile: boolean) {
  return isMobile ? "portrait_4_3" : "landscape_16_9";
}
