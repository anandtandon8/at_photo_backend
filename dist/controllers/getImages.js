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
exports.getFavoriteImageUrls = exports.getImageUrls = void 0;
const app_1 = require("../app");
function queryByCategory(category) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = 'SELECT image_id FROM classifications WHERE classification=$1';
            const result = yield app_1.postgresDB.query(query, [category]);
            const images = result.rows.map((row) => row.image_id);
            return { images };
        }
        catch (error) {
            console.error('Database query error:', error);
            return { images: [] };
        }
    });
}
function queryByFavorite() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const query = 'SELECT image_id FROM classifications WHERE is_favourite=TRUE';
            const result = yield app_1.postgresDB.query(query);
            const images = result.rows.map((row) => row.image_id);
            return { images };
        }
        catch (error) {
            console.error('Database query error:', error);
            return { images: [] };
        }
    });
}
const getImageUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category } = req.query;
        if (!category || typeof category !== 'string') {
            res.status(400).json({
                error: 'Category parameter is required'
            });
            return;
        }
        const images = yield queryByCategory(category);
        res.json(images);
        return;
    }
    catch (error) {
        console.error('Error in getImageUrls controller:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
});
exports.getImageUrls = getImageUrls;
const getFavoriteImageUrls = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield queryByFavorite();
        res.json(images);
        return;
    }
    catch (error) {
        console.error('Error in getFavoriteImageUrls controller:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
        return;
    }
});
exports.getFavoriteImageUrls = getFavoriteImageUrls;
