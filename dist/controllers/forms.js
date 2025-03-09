"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewsletter = exports.addContact = void 0;
const app_1 = require("../app");
;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const addContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = req.body;
        let msg = "";
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
        yield app_1.contactCollection.add(submission);
        res.status(200).json({ message: "Contact added successfully", ok: true });
        console.log("Contact added successfully", submission.email);
        return;
    }
    catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ message: "Error adding contact", ok: false });
        return;
    }
});
exports.addContact = addContact;
const addNewsletter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = req.body;
        if (!submission.email) {
            res.status(200).json({ message: "Missing required field(s)", ok: true });
            return;
        }
        if (!emailRegex.test(submission.email)) {
            res.status(200).json({ message: "Invalid email address", ok: true });
            return;
        }
        const querySnapshot = yield app_1.newsletterCollection.where('email', '==', submission.email).get();
        if (!querySnapshot.empty) {
            res.status(200).json({ message: "Email already in newsletter", ok: true });
            return;
        }
        yield app_1.newsletterCollection.add(submission);
        res.status(200).json({ message: "Newsletter added successfully", ok: true });
        console.log("Newsletter added successfully", submission.email);
        return;
    }
    catch (error) {
        console.error("Error adding newsletter:", error);
        res.status(500).json({ message: "Error adding newsletter", ok: false });
        return;
    }
});
exports.addNewsletter = addNewsletter;
