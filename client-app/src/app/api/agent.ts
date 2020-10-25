import axios, { AxiosResponse } from 'axios';
import { history } from '../..';
import { IActivity } from '../models/Activity';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/User';

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem('jwt');

    if (token) 
        config.headers.Authorization = `Bearer ${token}`;
        
    return config;
}, e => Promise.reject(e));

axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        return toast.error('Network Error - Ensure API is running!')
    }

    const { status, data, config } = error.response;

    if (status === 404) {
        history.push('/not-found');
    }

    if (status && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/not-found');
    }

    if (status === 500) {
        toast.error('Server Error - check the terminal for more info!');
    }

    throw error.response;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
};

const activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string): Promise<IActivity> => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) =>
        requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
};

const user = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/login`, user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post(`/user/register`, user),
}

export default {
    activities,
    user
};
