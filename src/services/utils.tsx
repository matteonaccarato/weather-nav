// Calculate time shift (hours) between now and target time
export const calculateHoursDifference = (targetDateStr: string): number => {
    const targetDate = new Date(targetDateStr);
    const currentDate = new Date();
    const differenceInMs = targetDate.getTime() - currentDate.getTime();

    const differenceInHours = differenceInMs / (1000 * 60 * 60); // get hours
    return Math.round(differenceInHours);
}

export const weatherTag2Color = (tag: string): string => {
    if (tag.includes("rain")) return "bg-rain"
    if (tag.includes("clouds")) return "bg-clouds"
    return "bg-sun"
}

export const duration2color = (targetDuration: number | undefined, currDuration: number | undefined): string => {
    if (!targetDuration || !currDuration || targetDuration === currDuration) return "color-neutral"
    if (currDuration < targetDuration) return "color-better"
    return "color-worse"
} 