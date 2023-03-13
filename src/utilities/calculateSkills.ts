export const createNewDragonFromSkills = (skills: any, activeNodes: string[]) => {
    const dragon = new Dragon();

    skills.each((skill) => {
        if (activeNodes.includes(skill.id))
    })
}