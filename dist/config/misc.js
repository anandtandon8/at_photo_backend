"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const config = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV || "development"
};
exports.config = config;
