/**
 * Formats a phone number in E.164 format to a human-readable format
 * Specifically handles Spanish phone numbers (+34)
 * 
 * @param phone - Phone number in E.164 format (e.g., "+34612345678")
 * @returns Formatted phone number (e.g., "+34 612 345 678")
 * 
 * @example
 * formatPhone("+34612345678") // Returns "+34 612 345 678"
 * formatPhone("+34623456789") // Returns "+34 623 456 789"
 */
function formatPhone(phone: string): string {
    if (!phone) return phone;

    // Remove all whitespace first
    const cleaned = phone.replace(/\s/g, "");

    // Handle Spanish numbers (+34)
    if (cleaned.startsWith("+34")) {
        const number = cleaned.slice(3); // Remove "+34"

        // Spanish mobile numbers are 9 digits
        if (number.length === 9) {
            // Format as +34 XXX XXX XXX
            return `+34 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
        }

        // If not 9 digits, return with space after country code
        return `+34 ${number}`;
    }

    // For other countries, try to format with spaces every 3 digits
    // after the country code
    const match = cleaned.match(/^(\+\d{1,3})(\d+)$/);
    if (match) {
        const [, countryCode, number] = match;
        // Format the number part in groups of 3
        const formatted = number.match(/.{1,3}/g)?.join(" ") || number;
        return `${countryCode} ${formatted}`;
    }

    // If no match, return as is
    return phone;
}

/**
 * Removes all formatting from a phone number, keeping only digits and +
 * Useful for storing phone numbers in a consistent format
 * 
 * @param phone - Phone number in any format
 * @returns Phone number in E.164 format without spaces
 * 
 * @example
 * unformatPhone("+34 612 345 678") // Returns "+34612345678"
 * unformatPhone("+34-612-345-678") // Returns "+34612345678"
 */
export function unformatPhone(phone: string): string {
    if (!phone) return phone;

    // Keep only digits, +, and remove all other characters
    return phone.replace(/[^\d+]/g, "");
}

interface PhoneFormatterProps {
    phone: string;
}

/**
 * PhoneFormatter component that displays a formatted phone number
 * 
 * @example
 * <PhoneFormatter phone="+34612345678" />
 * <PhoneFormatter phone="+34612345678" className="text-sm text-muted-foreground" />
 */
const PhoneFormatter = ({
    phone,
}: PhoneFormatterProps) => formatPhone(phone);


export { PhoneFormatter, formatPhone };
