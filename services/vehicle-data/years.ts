export function getManufacturingYears(
    startOffset = 25
): number[] {
    const currentYear = new Date().getFullYear()
    return Array.from(
        { length: startOffset + 1 },
        (_, i) => currentYear - i
    )
}
