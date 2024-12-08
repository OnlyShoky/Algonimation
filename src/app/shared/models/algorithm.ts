export interface Algorithm {
  name: string;
  category: string;
  description?: string;
  keyProperties?: {
    bestCase: string;
    averageCase: string;
    worstCase: string;
    spaceComplexity: string;
  };
  steps?: string[];
  code: {
    cpp: string;
    python: string;
    javascript: string;
  };
  deltaLine: {
    cpp: number;
    python: number;
    javascript: number;
  };
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
  runtime?: {
    cpp: number;
    python: number;
    javascript: number;
  }
}
