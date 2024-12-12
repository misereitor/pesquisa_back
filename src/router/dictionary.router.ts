import { Request, Response, Router } from 'express';
import {
  deleteDictionaryEntryService,
  getAllDictionaryEntriesService,
  insertDictionaryEntryService,
  updateDictionaryEntryService
} from '../services/dictionary.service';
import { DictionaryEntry } from '../model/dictionary';

const dictionaryRouter = Router();

dictionaryRouter.get(
  '/dictionary/get-all',
  async (req: Request, res: Response) => {
    try {
      const data = await getAllDictionaryEntriesService();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

dictionaryRouter.post(
  '/dictionary/create',
  async (req: Request, res: Response) => {
    try {
      const dictionary: DictionaryEntry = req.body;
      const data = await insertDictionaryEntryService(dictionary);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

dictionaryRouter.put(
  '/dictionary/update',
  async (req: Request, res: Response) => {
    try {
      const dictionary: DictionaryEntry = req.body;
      const data = await updateDictionaryEntryService(dictionary);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

dictionaryRouter.delete(
  '/dictionary/delete/:key_word',
  async (req: Request, res: Response) => {
    try {
      const { key_word } = req.params;
      const data = await deleteDictionaryEntryService(key_word);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

export { dictionaryRouter };
