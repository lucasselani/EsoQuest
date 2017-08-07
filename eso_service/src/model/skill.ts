export class Skill {
    id: number;
    abilityId: number;
    icon: string;
    className: string;
    skillLineName:string;
    baseName: string;
    name: string;
    learnedLevel: number;
    rank: number;
    maxRank: number;
    type: string;
    cost: string;
    skillIndex: number;
    description: string;
}

export class SkillItem {
    abilityId:number;
    name: string;
    description: string;
    icon: string;
}
