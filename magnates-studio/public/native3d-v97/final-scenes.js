import{createFinalHandshake as previousHandshake,createFinalTeam}from'./previous-scenes-v105.js';
import{applySceneRefinement}from'./refinement-v106.js';
export{createFinalTeam};
export function createFinalHandshake(){return applySceneRefinement(previousHandshake());}
