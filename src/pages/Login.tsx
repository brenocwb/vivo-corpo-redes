
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChurchDataGenerator } from "@/components/ChurchDataGenerator";
import { LoginHeader } from "./Login/components/LoginHeader";
import { LoginForm } from "./Login/components/LoginForm";
import { RegistrationForm } from "./Login/components/RegistrationForm";
import { DemoButtons } from "./Login/components/DemoButtons";

export default function Login() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  // Already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRegistrationSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginHeader />
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Cadastro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <div className="space-y-4">
              <LoginForm 
                isSubmitting={isSubmitting} 
                setIsSubmitting={setIsSubmitting} 
              />
              <DemoButtons 
                isSubmitting={isSubmitting} 
                setIsSubmitting={setIsSubmitting} 
              />
            </div>
          </TabsContent>
          
          <TabsContent value="register">
            <RegistrationForm 
              isSubmitting={isSubmitting} 
              setIsSubmitting={setIsSubmitting}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          </TabsContent>
        </Tabs>
        
        <ChurchDataGenerator />
      </div>
    </div>
  );
}
