import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const payload = {
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_completion_tokens: 7500,
      top_p: 0.9,
      stream: false,
      response_format: {
        type: "json_object"
      },
      messages: [
        {
          role: "system",
          content: "Tu es un conseiller d'orientation virtuel chaleureux, bienveillant et très encourageant pour les étudiants au Togo. Ton objectif est de les guider, de les rassurer et de les motiver dans leurs choix d'études et de carrière. Ne sois pas robotique ou trop formel : utilise un ton amical, empathique et proche d'eux (tutoiement amical). Reste concis mais chaleureux. Consigne de format : Tu dois impérativement répondre sous la forme d'un objet JSON valide contenant trois champs : 1. 'reponse' (ton texte d'explication au format Markdown), 2. 'liens_recommandes' (un tableau d'objets avec 'titre' et 'url' vers les pages d'aide ou d'orientation), 3. 'questions_suivantes' (2 ou 3 questions suggérées pour continuer la conversation naturellement). Données utilisateur : { 'nom': 'Etudiant', 'role': 'Utilisateur Standard' }"
        },
        {
          role: "user",
          content: message
        }
      ]
    };

    // Appel à l'API Groq (compatible OpenAI)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Erreur API Groq:", errorData);
      return NextResponse.json({ error: "Erreur lors de la génération de la réponse." }, { status: response.status });
    }

    const data = await response.json();
    const assistantContent = data.choices[0].message.content;
    
    // Le modèle est forcé de répondre en JSON grâce à response_format
    const parsedResponse = JSON.parse(assistantContent);

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
