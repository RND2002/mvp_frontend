export function getBrandLogo(domain: string) {
    return `https://img.logo.dev/${domain}?token=${process.env.NEXT_PUBLIC_LOGO_DEV_API_KEY}`
}
