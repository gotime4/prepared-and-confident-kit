import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Account() {
  const { user, deleteAccount, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const handleDeleteRequest = () => {
    setShowDeleteConfirm(true);
    setConfirmText("");
  };
  
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    await deleteAccount();
    setIsSubmitting(false);
    navigate("/");
  };

  // Determine if delete button should be enabled
  const isDeleteEnabled = confirmText.toLowerCase() === "delete my account";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Increased top padding from pt-20 to pt-28 for more space */}
      <div className="bg-gray-50 border-b border-gray-200 pt-28 pb-12">
        <div className="container">
          <h1 className="text-4xl font-bold text-center mb-4">Account Settings</h1>
          <p className="text-center text-gray-600 max-w-3xl mx-auto">
            Manage your personal information and account preferences to ensure your preparedness data is secure.
          </p>
        </div>
      </div>
      
      <div className="container py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                View and manage your personal account details
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user.name} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" value="••••••••" type="password" disabled />
                <p className="text-xs text-muted-foreground">
                  Password changes are not yet supported
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Actions in this area can lead to permanent data loss
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col space-y-3">
                <h3 className="font-medium">Delete Account</h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data including your 72-hour kit inventory,
                  food storage plans, and preparation reports.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteRequest}
                  className="w-full sm:w-auto mt-2"
                >
                  <Icons.trash className="mr-2 h-4 w-4" />
                  Delete my account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                This action <strong>cannot be undone</strong>. This will permanently delete your 
                account and all associated data including your 72-hour kit inventory,
                food storage plans, and preparation reports.
              </p>
              
              <div className="space-y-2 border-t border-b py-4">
                <Label htmlFor="confirm" className="text-sm font-medium">
                  To confirm, type "delete my account" in the field below
                </Label>
                <Input 
                  id="confirm" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="delete my account"
                  className="w-full"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={!isDeleteEnabled || isSubmitting}
              className="bg-destructive text-destructive-foreground"
            >
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}