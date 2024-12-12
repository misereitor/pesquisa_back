import { DictionaryEntry } from '../model/dictionary';
import {
  deleteDictionaryEntry,
  getAllDictionaryEntries,
  insertDictionaryEntry,
  updateDictionaryEntry
} from '../repository/dictionary';

export async function getAllDictionaryEntriesService() {
  try {
    const dictionaryEntries = await getAllDictionaryEntries();
    return dictionaryEntries;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function insertDictionaryEntryService(
  dictionary: DictionaryEntry
) {
  try {
    const dictionaryEntries = await insertDictionaryEntry(dictionary);
    return dictionaryEntries;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function updateDictionaryEntryService(
  dictionary: DictionaryEntry
) {
  try {
    await updateDictionaryEntry(dictionary);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function deleteDictionaryEntryService(key_word: string) {
  try {
    await deleteDictionaryEntry(key_word);
  } catch (error: any) {
    throw new Error(error.message);
  }
}
