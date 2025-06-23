/* eslint-disable perfectionist/sort-modules */
import axios from "axios";

import {
  ModuleCode,
  ModuleCondensed,
  ModuleType,
} from "../types/nusmodstypes.js";

const API_BASE_URL = "https://api.nusmods.com/v2/2024-2025";

export async function fetchModList(): Promise<string[]> {
  try {
    const response = await axios.get<ModuleCondensed[]>(
      `${API_BASE_URL}/moduleList.json`,
    );
    const modules: ModuleCondensed[] = response.data;
    const moduleCodes: ModuleCode[] = modules.map(
      (module) => module.moduleCode,
    );
    return moduleCodes;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axois error fetching mod list: " + error.message);
      if (error.response) {
        console.error("Response data: " + (error.response.data as string));
        console.error(`Response status: ${error.response.status.toString()}`);
      }
    } else {
      console.error(
        `Error in fetching API:  + ${error instanceof Error ? error.message : "No message"}`,
      );
    }
    return [];
  }
}

export async function fetchModInfo(moduleCode: string) {
  try {
    const response = await axios.get<ModuleType>(
      `${API_BASE_URL}/modules/${moduleCode}.json`,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axois error fetching mod list: " + error.message);
      if (error.response) {
        console.error("Response data: " + (error.response.data as string));
        console.error(`Response status: ${error.response.status.toString()}`);
      }
    } else {
      console.error(
        `Error in fetching API:  + ${error instanceof Error ? error.message : "No message"}`,
      );
    }
    return null;
  }
}
