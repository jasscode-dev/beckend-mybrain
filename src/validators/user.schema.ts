import z from "zod"

export const registerUserSchema = z.object({
    name:z.string().min(2, "Name is required").max(255),
    email:z.email("Invalid email format"),
    password:z.string().min(6,"The password must be at least 6 characters long.")



})