const mapping: Record<string, string> = {
  airlines: 'airline',
  'compliance-reports': 'compliance_report',
  'risk-assessments': 'risk_assessment',
  'safety-reports': 'safety_report',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
