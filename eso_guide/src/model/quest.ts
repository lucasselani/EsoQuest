export class QuestDetail {
    id:number;
    zone:string;
    name:string;
    level:number;
    repeatType:string;
    backgroundText:string;
    goalText:string;
    steps:Steps[];
    rewards:Rewards[];
}

export class QuestItem {
  id: number;
  zone: number;
  level: number;
  name: string;
}

export class Steps {
    id:number;
    zone:string;
    questid:number;
    uniqueid:number;
    stageIndex:number;
    stepIndex:number;
    text:string;
    overrideText:string;
}

export class Rewards {
    id:number;
    type:string;
    name:string;
    quantity:number;
    quality:string;
    icon:string;
}

