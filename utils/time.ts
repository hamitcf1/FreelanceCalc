/**
 * Converts decimal hours to HH:MM:SS string format.
 * @param decimalHours - The hours in decimal format (e.g., 40.5)
 * @returns A string in HH:MM:SS format (e.g., "40:30:00")
 */
export const decimalToTime = (decimalHours: number): string => {
    const absoluteHours = Math.abs(decimalHours);
    const totalSeconds = Math.round(absoluteHours * 3600);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    return `${h}:${pad(m)}:${pad(s)}`;
};

/**
 * Converts HH:MM:SS string format to decimal hours.
 * @param timeString - The time string (e.g., "40:30:00")
 * @returns The decimal hours (e.g., 40.5)
 */
export const timeToDecimal = (timeString: string): number => {
    const parts = timeString.split(':');
    if (parts.length < 2) return parseFloat(timeString) || 0;

    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const s = parseInt(parts[2], 10) || 0;

    return h + m / 60 + s / 3600;
};

/**
 * Validates and formats a partial time string input (e.g., "40:3" -> "40:30:00" after blur).
 * This can also handle auto-masking during entry.
 * @param input - Raw string from user input
 * @returns Formatted/Sanitized time string
 */
export const formatTimeInput = (input: string): string => {
    // Remove non-numeric/non-colon chars
    let clean = input.replace(/[^0-9:]/g, '');

    // Basic masking logic (could be more complex)
    const parts = clean.split(':');

    // Max 3 parts (H:M:S)
    const limitedParts = parts.slice(0, 3);

    return limitedParts.join(':');
};
