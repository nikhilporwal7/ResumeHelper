import { useArweave } from "@/context/ArweaveContext";
import { useResumeContext } from "@/context/ResumeContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { ResumeData } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ArweaveStorageButton() {
  const { resumeData } = useResumeContext();
  const { storeResume, isLoading, error, lastStoredId } = useArweave();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleStoreResume = async () => {
    if (!resumeData) {
      toast({
        title: "No resume data",
        description: "Please create a resume before storing it on Arweave.",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await storeResume(resumeData);
      if (result) {
        toast({
          title: "Resume stored on Arweave",
          description: `Your resume has been stored on Arweave with transaction ID: ${result.id.substring(0, 8)}...`,
        });
      }
    } catch (err) {
      toast({
        title: "Failed to store resume",
        description: `Error: ${err instanceof Error ? err.message : String(err)}`,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
            Store on Arweave
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Store Resume on Arweave</DialogTitle>
            <DialogDescription>
              Arweave provides permanent, decentralized storage for your resume.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {lastStoredId && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Resume Stored Successfully</AlertTitle>
              <AlertDescription>
                Transaction ID: {lastStoredId}
                <br />
                <a 
                  href={`https://arweave.net/${lastStoredId}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on Arweave Explorer
                </a>
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStoreResume} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            >
              {isLoading ? "Storing..." : "Store Resume"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ArweaveRetrieveForm() {
  const { getResume, isLoading, error } = useArweave();
  const { setResumeData } = useResumeContext();
  const [transactionId, setTransactionId] = useState("");
  const [retrievalError, setRetrievalError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRetrieveResume = async () => {
    if (!transactionId) {
      setRetrievalError("Please enter a transaction ID");
      return;
    }

    try {
      setRetrievalError(null);
      const resumeData = await getResume(transactionId);
      
      if (resumeData) {
        setResumeData(resumeData);
        toast({
          title: "Resume retrieved",
          description: "Your resume has been loaded from Arweave.",
        });
      } else {
        setRetrievalError("No resume found with this transaction ID");
      }
    } catch (err) {
      setRetrievalError(`Failed to retrieve resume: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Retrieve Resume from Arweave</CardTitle>
        <CardDescription>
          Enter the transaction ID of a resume stored on Arweave
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(error || retrievalError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || retrievalError}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col space-y-2">
          <Label htmlFor="transactionId">Arweave Transaction ID</Label>
          <Input
            id="transactionId"
            placeholder="Enter transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRetrieveResume} 
          disabled={isLoading || !transactionId}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? "Retrieving..." : "Retrieve Resume"} <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ArweaveResumeList() {
  const { getAllResumes, isLoading, error } = useArweave();
  const { setResumeData } = useResumeContext();
  const [resumes, setResumes] = useState<{id: string, data: ResumeData}[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFetchResumes = async () => {
    try {
      setFetchError(null);
      const result = await getAllResumes();
      setResumes(result.filter(item => item.data !== null));
    } catch (err) {
      setFetchError(`Failed to fetch resumes: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleLoadResume = (resume: ResumeData) => {
    setResumeData(resume);
    toast({
      title: "Resume loaded",
      description: `Resume "${resume.title}" has been loaded.`,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Arweave Stored Resumes</CardTitle>
        <CardDescription>
          View and load resumes stored on Arweave with your process ID
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(error || fetchError) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || fetchError}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          onClick={handleFetchResumes} 
          disabled={isLoading}
          className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? "Loading..." : "Fetch Resumes"}
        </Button>
        
        {resumes.length > 0 ? (
          <div className="space-y-4">
            {resumes.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{item.data.title}</CardTitle>
                  <CardDescription>
                    Template: {item.data.template} | ATS Score: {item.data.atsScore}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="outline" 
                    onClick={() => handleLoadResume(item.data)}
                    className="mr-2"
                  >
                    Load Resume
                  </Button>
                  <a 
                    href={`https://arweave.net/${item.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="sm">
                      View on Arweave
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-500">
            {resumes.length === 0 && !isLoading ? "No resumes found on Arweave. Fetch resumes or store a resume first." : "Loading resumes..."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}