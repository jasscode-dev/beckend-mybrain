import { TaskXpInput, XP_CONFIG } from "./metrics.type";

export const metricsDomain = {
    calculateTaskXP:( input: TaskXpInput ):number  =>{
     
        if(input.status !== 'DONE'){
            return 0;
        }
        
        let xp = XP_CONFIG.baseTask;
      
        const onTime = 
        !!input.finishedAt && 
        input.finishedAt <= input.plannedEnd;
        //TODO: create helper for date comparison


        if(onTime){
            xp += XP_CONFIG.onTimeBonus;
        }
      
        xp += XP_CONFIG.categoryBonus[input.category] ?? 0
        return xp;

  
    }     
}