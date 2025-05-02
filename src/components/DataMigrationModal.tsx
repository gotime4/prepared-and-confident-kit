
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupply } from '@/contexts/SupplyContext';
import { getLocalStorageSupplyData, clearLocalStorageSupplyData } from '@/utils/dataMigration';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Icons } from './icons';

export function DataMigrationModal() {
  const [open, setOpen] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const { isAuthenticated } = useAuth();
  const { syncData } = useSupply();
  
  useEffect(() => {
    // Check if there's data to migrate
    if (isAuthenticated) {
      const localData = getLocalStorageSupplyData();
      if (localData) {
        setOpen(true);
      }
    }
  }, [isAuthenticated]);
  
  const handleMigrate = async () => {
    setIsMigrating(true);
    
    // Sync will push current data to server
    const success = await syncData();
    
    if (success) {
      // Clear local data
      clearLocalStorageSupplyData();
    }
    
    setIsMigrating(false);
    setOpen(false);
  };
  
  const handleSkip = () => {
    setOpen(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Migrate Your Data</AlertDialogTitle>
          <AlertDialogDescription>
            We've detected that you have preparation data stored on this device.
            Would you like to migrate it to your account so you can access it from any device?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleSkip}>Skip</AlertDialogCancel>
          <AlertDialogAction onClick={handleMigrate} disabled={isMigrating}>
            {isMigrating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Migrating...
              </>
            ) : (
              "Migrate Data"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
