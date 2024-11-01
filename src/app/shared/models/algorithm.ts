export interface Algorithm  {
    name: string;
    description?: string;
    code: {
      cpp: string;
      python: string;
      javascript: string;
    };
    deltaLine:{
      cpp: number;
      python: number;
      javascript: number;   
    }
}
