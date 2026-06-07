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
          content: "Tu es l'assistant virtuel d'aide de la plateforme. Rôle : LECTURE SEULE (Pas d'actions d'administration ni de modifications). Consigne de format : Tu dois impérativement répondre sous la forme d'un objet JSON valide contenant trois champs : 1. 'reponse' (ton texte d'explication au format Markdown), 2. 'liens_recommandes' (un tableau d'objets avec 'titre' et 'url' vers les pages d'aide), 3. 'questions_suivantes' (2 ou 3 questions suggérées). Données utilisateur : { 'nom': 'Etudiant', 'role': 'Utilisateur Standard' }"
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
