export interface Algorithm {
  name: string;
  description?: string;
  keyProperties?: {
    bestCase: string;
    averageCase: string;
    worstCase: string;
    spaceComplexity: string;
    stable: boolean;
    inPlace: boolean;
  };
  howItWorks?: string[];
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
  exampleUsage?: {
    cpp: string;
    python: string;
    javascript: string;
  };
  prosAndCons?: {
    pros: string[];
    cons: string[];
  };
}
