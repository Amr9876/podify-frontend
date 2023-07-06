import {Keys, getFromAsyncStorage} from '@utils/asyncStorage';
import axios, {CreateAxiosDefaults} from 'axios';

const baseURL = 'https://lazy-cyan-boa-shoe.cyclic.app';

const client = axios.create({
  baseURL,
});

type Headers = CreateAxiosDefaults<any>['headers'];

export const getClient = async (headers?: Headers) => {
  const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);

  if (!token) return axios.create({baseURL});

  const defaultHeaders = {
    Authorization: `Bearer ${token}`,
    ...headers,
  };

  return axios.create({baseURL, headers: defaultHeaders});
};

export default client;
