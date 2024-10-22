export function stringToNumberArray(data: string) {
    return data.split(',').map(item => item.trim()).filter(item => item).map(Number)
}