import { CarType } from '@/types';
import React, { createContext, useContext, useState } from 'react';

interface CarContextType {
  cars: CarType[];
  carsByCollection: Record<string, CarType[]>; 
  addCar: (car: CarType) => void;
  addCarToCollection: (collectionName: string, car: CarType) => void; 
}

const CarContext = createContext<CarContextType | undefined>(undefined);

export const CarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [carsByCollection, setCarsByCollection] = useState<Record<string, CarType[]>>({});

  const addCar = (car: CarType) => {
    setCars((prevCars) => [...prevCars, car]);
  };

  const addCarToCollection = (collectionName: string, car: CarType) => {
    setCarsByCollection((prev) => ({
      ...prev,
      [collectionName]: [...(prev[collectionName] || []), car], // Add the car to the collection
    }));
  };

  return (
    <CarContext.Provider value={{ cars, carsByCollection, addCar, addCarToCollection }}>
      {children}
    </CarContext.Provider>
  );
};

export const useCarContext = () => {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
};