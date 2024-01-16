export enum STRINGS {
    USERS_ROUTE = "users",
    CHANGE_PASSWORD_ROUTE = "change-password"
}
export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*$/
export const CONTACT_REGEX = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
export const USERNAME_REGEX = /^[a-z0-9_-]{3,20}$/
export enum S3_ENUMS {
    URL = "https://mydoctracker-dev.s3.us-west-004.backblazeb2.com",
    profile_pictures = "profile_pictures"
}