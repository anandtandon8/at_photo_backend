import { Request, Response } from "express";
import { postgresDB } from '../app';


async function queryByCategory(category: string): Promise<{ images: string[] }> {
  try {
    const query = 'SELECT image_id FROM classifications WHERE classification=$1';
    const result = await postgresDB.query(query, [category]);
    
    const images = result.rows.map((row: { image_id: string }) => row.image_id);
    
    return { images };
  } catch (error) {
    console.error('Database query error:', error);
    return { images: [] };
  }
}

async function queryByFavorite(): Promise<{ images: string[] }> {
  try {
    const query = 'SELECT image_id FROM classifications WHERE is_favourite=TRUE';
    const result = await postgresDB.query(query);

    const images = result.rows.map((row: { image_id: string }) => row.image_id);
    
    return { images };
  } catch (error) {
    console.error('Database query error:', error);
    return { images: [] };
  }
}

export const getImageUrls = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    
    if (!category || typeof category !== 'string') {
      res.status(400).json({ 
        error: 'Category parameter is required' 
      });
      return;
    }
    
    const images = await queryByCategory(category);
    res.json(images);
    return;
  } catch (error) {
    console.error('Error in getImageUrls controller:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
    return;
  }
};

export const getFavoriteImageUrls = async (req: Request, res: Response) => {
  try {
    const images = await queryByFavorite();
    res.json(images);
    return;
  } catch (error) {
    console.error('Error in getFavoriteImageUrls controller:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
    return;
  }
};


