import { query } from "express-validator";


export const validateRangeDateQuery = query('analysisPeriod')
  .optional()
  .isIn(["7d", "30d", "90d"])
  .withMessage("El periodo de analisis debe ser uno de los siguientes valores: 7d, 30d, 90d")