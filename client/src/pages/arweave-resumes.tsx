import { useState } from "react";
import { useLocation } from "wouter";
import { ArweaveResumeList } from "@/components/ArweaveStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, ArrowLeft } from "lucide-react";

export default function ArweaveResumes() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Arweave Stored Resumes
        </h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2 text-blue-500" />
            Decentralized Resume Storage
          </CardTitle>
          <CardDescription>
            Resumes stored on Arweave are permanently saved on the blockchain and can be accessed from anywhere.
            The process ID <span className="font-mono text-xs bg-gray-100 p-1 rounded">FpZIj5iTHxKybufO6nc3Ab_DKPMgfJbVVs_oiazD4Fc</span> is used to identify your resumes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Arweave is a decentralized storage network that allows you to store data permanently. 
            Your resumes are stored on the Arweave blockchain and can be accessed by anyone with the transaction ID.
          </p>
        </CardContent>
      </Card>

      <ArweaveResumeList />

      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">Want to create a new resume?</p>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          onClick={() => navigate("/builder")}
        >
          Create New Resume
        </Button>
      </div>
    </div>
  );
}