export interface ProjectInfo {
  name: string;
  projectName: string;
  projectCode: string;
  organization: string;
  client: string;
  projectManager: string;
  startDate: string;
  endDate: string;
  description: string;
  budget?: number;
  governmentFunding?: number;
  selfFunding?: number;
  milestones: Array<{
    name: string;
    date: string;
    status: string;
  }>;
  teamMembers: string[];
  budgets: Array<{
    category: string;
    subCategory: string;
    amount: number;
    source: 'support' | 'self';
    description: string;
  }>;
  team: Array<{
    name: string;
    title: string;
    role: string;
    workload: string;
    unit: string;
  }>;
} 