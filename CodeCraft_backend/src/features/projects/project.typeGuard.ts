
type ProjectUpdatedField = "projectName" | "clientName" | "description"


export function isProjectUpdatedField(field: string) : field is ProjectUpdatedField {
  return [
    "projectName",
    "clientName",
    "description"
  ].includes(field)
} 