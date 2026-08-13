import { body } from "express-validator";
import { projectTeamRole } from "./projectTeamMember.constants";

export const validateChangeProjectTeamRole = 
  body("projectRole")
    .notEmpty()
    .withMessage("El role es obligatorio")
    .isIn(Object.values(projectTeamRole))