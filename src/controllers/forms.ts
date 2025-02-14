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

        let msg : string = "";
        
        if (!submission.name || !submission.email || !submission.message) {
            res.status(200).json({ message: "Missing required field(s)", ok: true });
            return;
        }

        if (!emailRegex.test(submission.email)) {
            msg += "Invalid email address";
        }
        if (submission.phone && !phoneRegex.test(submission.phone)) {
            msg += (msg === "" ? "" : ", ") + "Invalid phone number";
        }

        if (msg !== "") {
            res.status(200).json({ message: msg, ok: true });
            return;
        }
        
        await contactCollection.add(submission);
        res.status(200).json({ message: "Contact added successfully", ok: true });
        console.log("Contact added successfully", submission.email);
        return;
    }

    catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ message: "Error adding contact", ok: false });
        return;
    }
}


export const addNewsletter = async (req: Request, res: Response) => {
    try {
        const submission = req.body as NewsletterRequest;
        
        if (!submission.email) {
            res.status(200).json({ message: "Missing required field(s)", ok: true });
            return;
        }
        if (!emailRegex.test(submission.email)) {
            res.status(200).json({message: "Invalid email address", ok: true});
            return;
        }
        
        const querySnapshot = await newsletterCollection.where('email', '==', submission.email).get();
        
        if (!querySnapshot.empty) {
            res.status(200).json({ message: "Email already in newsletter", ok: true });
            return;
        }
        
        await newsletterCollection.add(submission);
        res.status(200).json({ message: "Newsletter added successfully", ok: true });
        console.log("Newsletter added successfully", submission.email);
        return;

    } catch (error) {
        console.error("Error adding newsletter:", error);
        res.status(500).json({ message: "Error adding newsletter", ok: false });
        return;
    }
}