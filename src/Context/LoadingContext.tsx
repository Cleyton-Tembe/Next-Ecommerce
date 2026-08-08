import { createContext, ReactNode, useState } from "react"



type LoadingType = {
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const LoadingContext = createContext<LoadingType | undefined>(undefined)


const LoadingProvider = ({children}: {children: ReactNode}) => {

    const [loading, setLoading] = useState<boolean>(false)


  return (
    <LoadingContext.Provider value={{loading, setLoading}}>
        {children}
    </LoadingContext.Provider>
  )
}

export default LoadingProvider