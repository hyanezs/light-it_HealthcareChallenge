import { Router } from 'express';
import diagnosesController from './diagnosesController';
import meController from './meController';
import symptomsController from './symptomsController';

const privateRoutes = Router();

privateRoutes.use('/me', meController);
privateRoutes.use('/diagnoses', diagnosesController);
privateRoutes.use('/symptoms', symptomsController);

export default privateRoutes;
