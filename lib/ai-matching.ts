export interface UserProfile {
  id: string;
  age: number;
  location: string;
  interests: string[];
  bio: string;
  gender: string;
  orientation: string;
  lookingFor: string[];
  personalityTraits?: PersonalityTraits;
  preferences?: UserPreferences;
}

export interface PersonalityTraits {
  openness: number; // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface UserPreferences {
  ageRange: { min: number; max: number };
  maxDistance: number;
  dealBreakers: string[];
  mustHaves: string[];
  importanceWeights: {
    personality: number;
    interests: number;
    location: number;
    age: number;
    appearance: number;
  };
}

export interface CompatibilityScore {
  overall: number;
  breakdown: {
    personality: number;
    interests: number;
    location: number;
    age: number;
    lifestyle: number;
  };
  reasons: string[];
  potentialConcerns: string[];
}

export class AIMatchingEngine {
  private static instance: AIMatchingEngine;

  static getInstance(): AIMatchingEngine {
    if (!AIMatchingEngine.instance) {
      AIMatchingEngine.instance = new AIMatchingEngine();
    }
    return AIMatchingEngine.instance;
  }

  // Calculate compatibility between two users
  calculateCompatibility(user1: UserProfile, user2: UserProfile): CompatibilityScore {
    const personalityScore = this.calculatePersonalityCompatibility(
      user1.personalityTraits,
      user2.personalityTraits
    );
    
    const interestsScore = this.calculateInterestsCompatibility(
      user1.interests,
      user2.interests
    );
    
    const locationScore = this.calculateLocationCompatibility(
      user1.location,
      user2.location,
      user1.preferences?.maxDistance || 50
    );
    
    const ageScore = this.calculateAgeCompatibility(
      user1.age,
      user2.age,
      user1.preferences?.ageRange
    );
    
    const lifestyleScore = this.calculateLifestyleCompatibility(user1, user2);

    // Weighted overall score
    const weights = user1.preferences?.importanceWeights || {
      personality: 0.3,
      interests: 0.25,
      location: 0.2,
      age: 0.15,
      appearance: 0.1
    };

    const overall = (
      personalityScore * weights.personality +
      interestsScore * weights.interests +
      locationScore * weights.location +
      ageScore * weights.age +
      lifestyleScore * 0.1
    );

    const reasons = this.generateCompatibilityReasons(
      { personalityScore, interestsScore, locationScore, ageScore, lifestyleScore },
      user1,
      user2
    );

    const potentialConcerns = this.identifyPotentialConcerns(user1, user2);

    return {
      overall: Math.round(overall),
      breakdown: {
        personality: Math.round(personalityScore),
        interests: Math.round(interestsScore),
        location: Math.round(locationScore),
        age: Math.round(ageScore),
        lifestyle: Math.round(lifestyleScore)
      },
      reasons,
      potentialConcerns
    };
  }

  private calculatePersonalityCompatibility(
    traits1?: PersonalityTraits,
    traits2?: PersonalityTraits
  ): number {
    if (!traits1 || !traits2) return 50; // Default score if no personality data

    // Research-based personality compatibility
    const opennessDiff = Math.abs(traits1.openness - traits2.openness);
    const conscientiousnessDiff = Math.abs(traits1.conscientiousness - traits2.conscientiousness);
    const extraversionDiff = Math.abs(traits1.extraversion - traits2.extraversion);
    const agreeablenessDiff = Math.abs(traits1.agreeableness - traits2.agreeableness);
    const neuroticismDiff = Math.abs(traits1.neuroticism - traits2.neuroticism);

    // Some traits are better when similar, others when complementary
    const opennessScore = 100 - opennessDiff; // Similar is better
    const conscientiousnessScore = 100 - conscientiousnessDiff; // Similar is better
    const extraversionScore = Math.max(60, 100 - extraversionDiff * 0.5); // Some difference is okay
    const agreeablenessScore = 100 - agreeablenessDiff; // Similar is better
    const neuroticismScore = 100 - neuroticismDiff; // Similar is better

    return (opennessScore + conscientiousnessScore + extraversionScore + agreeablenessScore + neuroticismScore) / 5;
  }

  private calculateInterestsCompatibility(interests1: string[], interests2: string[]): number {
    if (interests1.length === 0 || interests2.length === 0) return 30;

    const commonInterests = interests1.filter(interest => 
      interests2.some(i2 => i2.toLowerCase() === interest.toLowerCase())
    );

    const totalInterests = new Set([...interests1, ...interests2]).size;
    const commonRatio = commonInterests.length / Math.min(interests1.length, interests2.length);
    const diversityBonus = totalInterests > 8 ? 10 : 0; // Bonus for diverse interests

    return Math.min(100, (commonRatio * 80) + diversityBonus + 20);
  }

  private calculateLocationCompatibility(
    location1: string,
    location2: string,
    maxDistance: number
  ): number {
    // Simplified location compatibility - in real app, use actual coordinates
    if (location1.toLowerCase() === location2.toLowerCase()) return 100;
    
    // Extract city/state for basic comparison
    const city1 = location1.split(',')[0].trim().toLowerCase();
    const city2 = location2.split(',')[0].trim().toLowerCase();
    
    if (city1 === city2) return 90;
    
    // For demo purposes, assume random distance
    const estimatedDistance = Math.random() * 100;
    
    if (estimatedDistance <= maxDistance) {
      return Math.max(20, 100 - (estimatedDistance / maxDistance) * 80);
    }
    
    return 10;
  }

  private calculateAgeCompatibility(
    age1: number,
    age2: number,
    ageRange?: { min: number; max: number }
  ): number {
    const ageDiff = Math.abs(age1 - age2);
    
    if (ageRange && (age2 < ageRange.min || age2 > ageRange.max)) {
      return 0;
    }
    
    // Age compatibility decreases with larger gaps
    if (ageDiff <= 2) return 100;
    if (ageDiff <= 5) return 85;
    if (ageDiff <= 10) return 70;
    if (ageDiff <= 15) return 50;
    return 25;
  }

  private calculateLifestyleCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 50; // Base score
    
    // Bio analysis for lifestyle indicators
    const bio1 = user1.bio.toLowerCase();
    const bio2 = user2.bio.toLowerCase();
    
    const lifestyleKeywords = {
      active: ['gym', 'fitness', 'hiking', 'running', 'sports', 'yoga'],
      social: ['party', 'social', 'friends', 'outgoing', 'events'],
      homebody: ['home', 'cozy', 'quiet', 'reading', 'movies', 'netflix'],
      travel: ['travel', 'adventure', 'explore', 'wanderlust', 'passport'],
      career: ['career', 'ambitious', 'professional', 'work', 'business']
    };
    
    let commonLifestyles = 0;
    let totalLifestyles = 0;
    
    Object.entries(lifestyleKeywords).forEach(([lifestyle, keywords]) => {
      const user1Has = keywords.some(keyword => bio1.includes(keyword));
      const user2Has = keywords.some(keyword => bio2.includes(keyword));
      
      if (user1Has || user2Has) {
        totalLifestyles++;
        if (user1Has && user2Has) {
          commonLifestyles++;
        }
      }
    });
    
    if (totalLifestyles > 0) {
      score = (commonLifestyles / totalLifestyles) * 100;
    }
    
    return Math.max(30, score);
  }

  private generateCompatibilityReasons(
    scores: any,
    user1: UserProfile,
    user2: UserProfile
  ): string[] {
    const reasons: string[] = [];
    
    if (scores.interestsScore > 70) {
      const commonInterests = user1.interests.filter(interest => 
        user2.interests.some(i2 => i2.toLowerCase() === interest.toLowerCase())
      );
      if (commonInterests.length > 0) {
        reasons.push(`You both enjoy ${commonInterests.slice(0, 2).join(' and ')}`);
      }
    }
    
    if (scores.personalityScore > 75) {
      reasons.push("Your personalities complement each other well");
    }
    
    if (scores.locationScore > 80) {
      reasons.push("You're in the same area - perfect for meeting up!");
    }
    
    if (scores.ageScore > 85) {
      reasons.push("You're in similar life stages");
    }
    
    if (scores.lifestyleScore > 70) {
      reasons.push("Your lifestyles seem compatible");
    }
    
    return reasons.slice(0, 3); // Limit to top 3 reasons
  }

  private identifyPotentialConcerns(user1: UserProfile, user2: UserProfile): string[] {
    const concerns: string[] = [];
    
    const ageDiff = Math.abs(user1.age - user2.age);
    if (ageDiff > 10) {
      concerns.push("Significant age difference might affect compatibility");
    }
    
    // Check for deal breakers
    if (user1.preferences?.dealBreakers) {
      const hasDealBreaker = user1.preferences.dealBreakers.some(dealBreaker =>
        user2.bio.toLowerCase().includes(dealBreaker.toLowerCase()) ||
        user2.interests.some(interest => 
          interest.toLowerCase().includes(dealBreaker.toLowerCase())
        )
      );
      
      if (hasDealBreaker) {
        concerns.push("May have conflicting lifestyle preferences");
      }
    }
    
    return concerns;
  }

  // Get AI-powered recommendations
  async getRecommendations(
    userId: string,
    candidateProfiles: UserProfile[],
    limit: number = 10
  ): Promise<Array<{ profile: UserProfile; compatibility: CompatibilityScore }>> {
    const userProfile = candidateProfiles.find(p => p.id === userId);
    if (!userProfile) return [];
    
    const recommendations = candidateProfiles
      .filter(profile => profile.id !== userId)
      .map(profile => ({
        profile,
        compatibility: this.calculateCompatibility(userProfile, profile)
      }))
      .sort((a, b) => b.compatibility.overall - a.compatibility.overall)
      .slice(0, limit);
    
    return recommendations;
  }

  // Analyze personality from bio text (simplified version)
  analyzePersonalityFromBio(bio: string): PersonalityTraits {
    const text = bio.toLowerCase();
    
    // Simple keyword-based analysis (in production, use proper NLP)
    const opennessKeywords = ['creative', 'art', 'music', 'travel', 'adventure', 'new', 'explore'];
    const conscientiousnessKeywords = ['organized', 'plan', 'goal', 'career', 'responsible', 'reliable'];
    const extraversionKeywords = ['social', 'party', 'friends', 'outgoing', 'people', 'fun'];
    const agreeablenessKeywords = ['kind', 'caring', 'help', 'family', 'love', 'compassionate'];
    const neuroticismKeywords = ['stress', 'worry', 'anxious', 'emotional', 'sensitive'];
    
    const calculateScore = (keywords: string[]) => {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      return Math.min(100, 50 + (matches * 10)); // Base 50, +10 per keyword match
    };
    
    return {
      openness: calculateScore(opennessKeywords),
      conscientiousness: calculateScore(conscientiousnessKeywords),
      extraversion: calculateScore(extraversionKeywords),
      agreeableness: calculateScore(agreeablenessKeywords),
      neuroticism: Math.max(0, 50 - calculateScore(neuroticismKeywords)) // Lower is better
    };
  }
}

export const aiMatcher = AIMatchingEngine.getInstance();
