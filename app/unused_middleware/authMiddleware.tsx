import supabase from "@/app/api/supabaseClient";
import { Request, Response } from "express";
export async function requireAuth(req: Request, res: Response, next: any) {
    const token = req.cookies.sb_access_token

    if (!token) return res.status(401).end()

    const { data } = await supabase.auth.getUser(token)

    if (!data.user) return res.status(401).end()

    req.user = data.user
    next()
}
