export enum ExpertiseAreaId {
    Empty = "empty",
    SoftwareEngineering = "software-engineering",
    SoftwareQuality = "software-quality",
    RequirementsEngineering = "requirements-engineering",
    SoftwareTesting = "software-testing",
    SoftwareArchitecture = "software-architecture",
    AgileMethods = "agile-methods",
    DevOps = "devops",
}

const LABELS: Record<ExpertiseAreaId, string> = {
    [ExpertiseAreaId.Empty]: "Selecione um tema...",
    [ExpertiseAreaId.SoftwareEngineering]: "Engenharia de software",
    [ExpertiseAreaId.SoftwareQuality]: "Qualidade de software",
    [ExpertiseAreaId.RequirementsEngineering]: "Engenharia de requisitos",
    [ExpertiseAreaId.SoftwareTesting]: "Testes de software",
    [ExpertiseAreaId.SoftwareArchitecture]: "Arquitetura de software",
    [ExpertiseAreaId.AgileMethods]: "Métodos ágeis",
    [ExpertiseAreaId.DevOps]: "DevOps",
};

export type ExpertiseArea = { id: ExpertiseAreaId; label: string };

export const expertiseAreas: ExpertiseArea[] = (
    Object.values(ExpertiseAreaId) as ExpertiseAreaId[]
).map((id) => ({ id, label: LABELS[id] }));
