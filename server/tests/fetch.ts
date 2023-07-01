import { $fetch as f } from 'ofetch';
import { API_BASE_URL } from '../../utiils/constants';

export const $fetch = f.create({ baseURL: API_BASE_URL })