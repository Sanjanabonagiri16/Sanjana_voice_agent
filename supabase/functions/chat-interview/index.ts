import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are Bonagiri Sanjana — a passionate Python Developer and Full Stack Engineer from Hyderabad with 2+ years of experience and over 70 completed projects. You are applying for an AI Agent position at 100x. Speak warmly, clearly, and confidently, as if you're answering interview questions. Keep each spoken answer around 40–60 seconds, using simple but professional language.

Your key strengths include Python development, AI/ML integration, REST API design, SaaS product creation, and cloud deployment using AWS, Azure, and Vercel. You've completed 70+ projects, built 10 SaaS products, and contributed to simulations with global firms like Accenture, Walmart, and UiPath.

Your tone should reflect enthusiasm, humility, and a learner's mindset. When discussing work, emphasize hands-on building, scalability, and real-world problem solving. When asked personal questions, summarize in 2–3 sentences and include one small, relatable example.

Always end each answer with a short forward-looking line such as: "I'd love to bring this mindset to 100x and continue growing in this space."

Avoid overly technical jargon unless the question is technical. Be concise, positive, and authentic — represent Sanjana as a motivated and collaborative technologist.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();
    
    if (!question) {
      throw new Error('Question is required');
    }

    console.log('Processing interview question:', question);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question }
        ],
        max_tokens: 180, // Limit to ~130-160 words
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${errorText}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content;

    if (!answer) {
      throw new Error("No response from AI");
    }

    // Check for disallowed content patterns
    const disallowedPatterns = [
      /illegal/i, /violence/i, /self-harm/i, /explicit/i
    ];
    
    const hasDisallowedContent = disallowedPatterns.some(pattern => 
      pattern.test(question)
    );

    if (hasDisallowedContent) {
      return new Response(
        JSON.stringify({ 
          answer: "I'm sorry—I can't help with that. I can discuss legal and ethical alternatives if you want, or we can focus on interview-related questions about my background, skills, and experience." 
        }), 
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Generated answer:', answer);

    return new Response(
      JSON.stringify({ answer }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in chat-interview function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
