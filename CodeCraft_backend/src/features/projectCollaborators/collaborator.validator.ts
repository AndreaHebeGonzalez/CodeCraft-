import { body } from "express-validator";
import { projectRole } from "./collaborator.constants";

export const validateChangeProjectRole = 
  body("projectRole")
    .notEmpty()
    .withMessage("El rol es obligatorio")
    .isIn(Object.values(projectRole))