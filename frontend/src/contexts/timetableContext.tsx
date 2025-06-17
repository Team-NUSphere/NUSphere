import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


export function getTimetableContext(): TimetableContextType {
  const context = useContext(TimetableContext);
  if (context === undefined) {
    throw new Error("Must pass in context provider for authContext");
  }
  return context;
}


interface TimetableContextType {
    UserClasses: 
    UserEvents: 
    UserModules: 
}

// function getModules -> send get req, backend return list of modules with list of selected classes
// function registerModule -> send post req, backend return list of default classes
// function removeModule -> send del req -> backend send status code

// function changeClass -> 
// create change in module's selected classes, put req, 
// backend return newly selected Class objects, delete the changed class in Classes, 
// add in the returned Class objects

// function getEvents -> get req, backend return list of Events
// function modifyEvent -> put req, backend send status code, retry until 200
// function addEvent -> send post req, backend send status code
// function deleteEvent -> send del req, backend send status code

const TimetableContext = createContext<TimetableContextType | undefined>({

});

// AuthProvider definition
interface TimetableProviderProps {
  children: ReactNode;
}

export function TimetableProvider({ children }: TimetableProviderProps) {



  return (
    <AuthContext.Provider
      value={{

      }}
    >
      {children}
    </AuthContext.Provider>
  );
}