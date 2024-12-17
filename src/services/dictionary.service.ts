import { DictionaryEntry } from '../model/dictionary';
import {
  deleteDictionaryEntry,
  getAllDictionaryEntries,
  insertDictionaryEntry,
  updateDictionaryEntry
} from '../repository/dictionary';

export async function getAllDictionaryEntriesService() {
  const dictionaryEntries = await getAllDictionaryEntries();
  return dictionaryEntries;
}

export async function insertDictionaryEntryService(
  dictionary: DictionaryEntry
) {
  const dictionaryEntries = await insertDictionaryEntry(dictionary);
  return dictionaryEntries;
}

export async function updateDictionaryEntryService(
  dictionary: DictionaryEntry
) {
  await updateDictionaryEntry(dictionary);
}

export async function deleteDictionaryEntryService(key_word: string) {
  await deleteDictionaryEntry(key_word);
}
