export interface UserProfile {
  interets?: string[];
  matieres?: string[];
  competences?: string[];
  environnement?: string[];
}

export interface Career {
  id: string;
  nom_metier: string;
  secteur: string;
  description: string;
  salaire: string;
  formation: string;
  competences_techniques: string[];
  soft_skills: string[];
  perspectives: string;
  match_interets: string[];
  match_matieres: string[];
  match_competences: string[];
  match_environnement: string[];
  // Fallback for older format if needed
  contexte_togo?: string;
  keywords?: string[];
}

const normalize = (str: string) => {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
};

const calculateMatchRatio = (userChoices: string[], careerMatches: string[]) => {
  if (!userChoices || userChoices.length === 0) return 0;
  if (!careerMatches || careerMatches.length === 0) return 0;

  const normalizedCareer = careerMatches.map(normalize);
  let matchCount = 0;

  userChoices.forEach(choice => {
    const normalizedChoice = normalize(choice);
    // Partial or exact match
    if (normalizedCareer.some(c => c.includes(normalizedChoice) || normalizedChoice.includes(c))) {
      matchCount++;
    }
  });

  return matchCount / userChoices.length;
};

export const calculateCareerScore = (user: UserProfile, career: Career): number => {
  // Define default weights
  let weightInterets = 40;
  let weightMatieres = 25;
  let weightCompetences = 20;
  let weightEnvironnement = 15;

  const hasInterets = user.interets && user.interets.length > 0;
  const hasMatieres = user.matieres && user.matieres.length > 0;
  const hasCompetences = user.competences && user.competences.length > 0;
  const hasEnvironnement = user.environnement && user.environnement.length > 0;

  // Redistribute weights if some criteria are skipped
  const missingWeights = 
    (hasInterets ? 0 : weightInterets) +
    (hasMatieres ? 0 : weightMatieres) +
    (hasCompetences ? 0 : weightCompetences) +
    (hasEnvironnement ? 0 : weightEnvironnement);

  if (missingWeights === 100) return 0; // No data at all

  if (missingWeights > 0) {
    const remainingBase = 100 - missingWeights;
    const multiplier = 100 / remainingBase;
    
    if (hasInterets) weightInterets *= multiplier;
    if (hasMatieres) weightMatieres *= multiplier;
    if (hasCompetences) weightCompetences *= multiplier;
    if (hasEnvironnement) weightEnvironnement *= multiplier;
  }

  let totalScore = 0;

  if (hasInterets) {
    // combine match_interets and keywords for backward compatibility
    const allCareerInterets = [...(career.match_interets || []), ...(career.keywords || [])];
    const ratio = calculateMatchRatio(user.interets!, allCareerInterets);
    totalScore += ratio * weightInterets;
  }

  if (hasMatieres) {
    const ratio = calculateMatchRatio(user.matieres!, career.match_matieres || []);
    totalScore += ratio * weightMatieres;
  }

  if (hasCompetences) {
    // Combine match_competences and soft_skills
    const allCareerCompetences = [...(career.match_competences || []), ...(career.soft_skills || [])];
    const ratio = calculateMatchRatio(user.competences!, allCareerCompetences);
    totalScore += ratio * weightCompetences;
  }

  if (hasEnvironnement) {
    const ratio = calculateMatchRatio(user.environnement!, career.match_environnement || []);
    totalScore += ratio * weightEnvironnement;
  }

  // Bonus for excellent perspectives
  if (career.perspectives && (career.perspectives.toLowerCase().includes('excellent') || career.perspectives.toLowerCase().includes('très bonne') || career.perspectives.toLowerCase().includes('forte demande'))) {
    totalScore = Math.min(100, totalScore + 5);
  }

  return Math.round(totalScore);
};

export const getTopRecommendations = (user: UserProfile, careers: Career[], topN: number = 8): (Career & { score: number })[] => {
  const scoredCareers = careers.map(c => ({
    ...c,
    score: calculateCareerScore(user, c)
  }));

  // Sort descending by score
  scoredCareers.sort((a, b) => b.score - a.score);

  // Return top N where score > 0
  return scoredCareers.filter(c => c.score > 0).slice(0, topN);
};
