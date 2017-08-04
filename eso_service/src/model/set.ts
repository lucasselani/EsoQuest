export class SetSummary {
    id: number;
    name: string;
    maxEquipCount: number;
    bonusCount: number;
    bonusDesc: string;
    itemSlots: string;
    itemCount: number;
    bonusDesc1: string;
    bonusDesc2: string;
    bonusDesc3: string;
    bonusDesc4: string;
    bonusDesc5: string;
}

export class ItemSummary {
    // TABLE DATA
    id: number;
    itemId: number;     
    name: string;
    icon: string;
    description: string;
    style: string;
    trait: string;
    type: string;
    specialType: string;
    equipType: string;
    weaponType: string;
    armorType: string;
    craftType: string;
    // APP DATA
    setId: number;
    dataTable: DataTable[];
}

export class DataTable {
    // TABLE DATA
    level: number;
    quality: string;
    value: number
    weaponPower: number;
    armorRating: number;
    enchantDesc: string;
    enchantName: string;
    maxCharges: number;
    traitDesc: string;
    setBonusDesc1: string;
    setBonusDesc2: string;
    setBonusDesc3: string;
    setBonusDesc4: string;
    internalLevel: number;
    internalSubtype: number;
    // APP DATA
    itemId: number;
}