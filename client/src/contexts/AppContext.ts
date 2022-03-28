import { createContext } from 'react';


export interface IAppContext {
}

export const AppContext = createContext<IAppContext>({} as IAppContext);
