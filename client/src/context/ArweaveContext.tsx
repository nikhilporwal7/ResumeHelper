import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ResumeData } from '@shared/schema';
import { storeResumeOnArweave, getResumeFromArweave, getAllResumesFromArweave, ArweaveStorageResult } from '@/lib/arweave-service';

interface ArweaveContextType {
  // State
  isLoading: boolean;
  error: string | null;
  lastStoredId: string | null;
  
  // Actions
  storeResume: (resume: ResumeData) => Promise<ArweaveStorageResult | null>;
  getResume: (id: string) => Promise<ResumeData | null>;
  getAllResumes: () => Promise<{id: string, data: ResumeData}[]>;
  clearError: () => void;
}

const ArweaveContext = createContext<ArweaveContextType | undefined>(undefined);

interface ArweaveProviderProps {
  children: ReactNode;
}

export const ArweaveProvider = ({ children }: ArweaveProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastStoredId, setLastStoredId] = useState<string | null>(null);

  const storeResume = async (resume: ResumeData): Promise<ArweaveStorageResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await storeResumeOnArweave(resume);
      setLastStoredId(result.id);
      return result;
    } catch (err) {
      setError(`Failed to store resume on Arweave: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getResume = async (id: string): Promise<ResumeData | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await getResumeFromArweave(id);
    } catch (err) {
      setError(`Failed to get resume from Arweave: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getAllResumes = async (): Promise<{id: string, data: ResumeData}[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      return await getAllResumesFromArweave();
    } catch (err) {
      setError(`Failed to get all resumes from Arweave: ${err instanceof Error ? err.message : String(err)}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    isLoading,
    error,
    lastStoredId,
    storeResume,
    getResume,
    getAllResumes,
    clearError,
  };

  return <ArweaveContext.Provider value={value}>{children}</ArweaveContext.Provider>;
};

export const useArweave = (): ArweaveContextType => {
  const context = useContext(ArweaveContext);
  if (context === undefined) {
    throw new Error('useArweave must be used within an ArweaveProvider');
  }
  return context;
};