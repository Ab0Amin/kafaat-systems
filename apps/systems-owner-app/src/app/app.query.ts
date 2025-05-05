import { NEXT_URL } from 'src/config-global';

export const fetchTranslations = async () => {
  try {
    const response = await fetch(`${NEXT_URL}/api/translations`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
};
