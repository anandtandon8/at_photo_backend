import { contactCollection, newsletterCollection } from "../app";
import { Request, Response } from "express";

interface ContactRequest {
    name: string;
    email: string;
    phone?: string;
    message: string;
};

interface NewsletterRequest {
    email: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

export const addContact = async (req: Request, res: Response) => {
    try {
        const submission = req.body as ContactRequest;
        
        if (!submission.name || !submission.email || !submission.message) {
            res.status(400).json({ message: "Missing required field(s)" });
            return;
        }

        if (!emailRegex.test(submission.email)) {
            res.status(400).json({message: "Invalid email address"});
            return;
        }
        if (submission.phone && !phoneRegex.test(submission.phone)) {
            res.status(400).json({message: "Invalid phone number"});
            return;
        }
        
        await contactCollection.add(submission);
        res.status(200).json({ message: "Contact added successfully" });
        return;
    }

    catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ message: "Error adding contact" });
        return;
    }
}


export const addNewsletter = async (req: Request, res: Response) => {
    try {
        const submission = req.body as NewsletterRequest;
        
        if (!submission.email) {
            res.status(400).json({ message: "Missing required field(s)" });
            return;
        }
        if (!emailRegex.test(submission.email)) {
            res.status(400).json({message: "Invalid email address"});
            return;
        }
        
        const querySnapshot = await newsletterCollection.where('email', '==', submission.email).get();
        
        if (!querySnapshot.empty) {
            res.status(200).json({ message: "Email already in newsletter" });
            return;
        }
        
        await newsletterCollection.add(submission);
        res.status(200).json({ message: "Newsletter added successfully" });
        return;
        
    } catch (error) {
        console.error("Error adding newsletter:", error);
        res.status(500).json({ message: "Error adding newsletter" });
        return;
    }
}