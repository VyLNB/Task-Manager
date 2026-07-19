import { apiRequest } from "./client"; 

export interface AIEvaluation {
  _id: string;
  workspaceId: string;
  overallScore: number;
  qualityAnalysis: string;
  performanceAnalysis: string;
  recommendations: string;
  memberEvaluations: {
    memberName: string;
    score: number;
    feedback: string;
  }[];
  createdBy: string;
  evaluationDate: string;
  createdAt: string;
  updatedAt: string;
}

export const evaluateWorkspaceAI = async (workspaceId: string): Promise<AIEvaluation> => {
  const response = await apiRequest<{ data: AIEvaluation }>("post", `/ai/evaluate/workspace/${workspaceId}`);
  return response.data;
};

export const getEvaluationHistory = async (workspaceId: string): Promise<AIEvaluation[]> => {
  const response = await apiRequest<{ data: AIEvaluation[] }>("get", `/ai/evaluations/workspace/${workspaceId}`);
  return response.data;
};

export interface PopulatedAIEvaluation extends Omit<AIEvaluation, 'workspaceId'> {
  workspaceId: {
    _id: string;
    name: string;
    leader: {
      _id: string;
      fullName: string;
      email: string;
    };
  };
}

export const getMyEvaluationHistory = async (): Promise<PopulatedAIEvaluation[]> => {
  const response = await apiRequest<{ data: PopulatedAIEvaluation[] }>("get", `/ai/evaluations/me`);
  return response.data;
};
