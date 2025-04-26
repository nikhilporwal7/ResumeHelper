import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useResumeContext } from "@/context/ResumeContext";
import MsLogo from "@/components/ui/ms-logo";
import { CheckCircle, Layout, Download, FileText, ArrowRight } from "lucide-react";

export default function Home() {
  const { createNewResume } = useResumeContext();

  const handleCreateResume = () => {
    createNewResume();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative py-16 bg-white rounded-lg shadow-md mb-16">
        <div className="container mx-auto px-6 lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-bold text-gray-900 lg:text-5xl">Create an ATS-Optimized Professional Resume</h1>
            <p className="mt-4 text-lg text-gray-600">Build a resume that gets past Applicant Tracking Systems and lands you more interviews with our Microsoft-inspired templates.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/builder">
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-base"
                  onClick={handleCreateResume}
                >
                  Create Your Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#templates">
                <Button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-3 rounded-md text-base">
                  View Templates
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-gray-600">
              <CheckCircle className="h-5 w-5 text-[#107C10] mr-2" />
              <span>Achieve 80+ score on standard ATS systems</span>
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2">
            <div className="relative w-full h-[400px] bg-[#F3F2F1] rounded-lg overflow-hidden">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[450px] shadow-xl bg-white p-8 border border-gray-300">
                {/* Resume Preview */}
                <div className="border-b-2 border-primary pb-4 mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">John Doe</h3>
                  <h4 className="text-lg text-primary mt-1">Senior Software Engineer</h4>
                  <div className="flex flex-wrap text-xs mt-3 text-gray-600 gap-2">
                    <div>john.doe@example.com</div>
                    <div>(123) 456-7890</div>
                    <div>Seattle, WA</div>
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    Professional Summary
                  </h5>
                  <p className="text-xs text-gray-700 line-clamp-3">
                    Experienced software engineer with expertise in developing scalable web applications and cloud solutions.
                  </p>
                </div>
                <div className="opacity-50">
                  <h5 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-1 mb-2">
                    Experience
                  </h5>
                  <div className="mb-2">
                    <div className="flex justify-between">
                      <p className="text-xs font-semibold">Software Engineer</p>
                      <p className="text-xs">2020 - Present</p>
                    </div>
                    <p className="text-xs text-primary">Microsoft</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <p className="mt-4 text-lg text-gray-600">Everything you need to create a professional, ATS-optimized resume</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">ATS Optimization</h3>
              <p className="mt-2 text-gray-600">Our templates are designed to pass through Applicant Tracking Systems with a score of 80+.</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Layout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Professional Templates</h3>
              <p className="mt-2 text-gray-600">Choose from multiple Microsoft-inspired templates designed by industry professionals.</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-md">
            <CardContent className="pt-6">
              <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Easy Export</h3>
              <p className="mt-2 text-gray-600">Download your resume as a PDF or share it online with potential employers.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Professional Templates</h2>
          <p className="mt-4 text-lg text-gray-600">Select from our ATS-optimized templates</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden">
            <div className="h-64 bg-white border-t-4 border-primary p-4 flex flex-col">
              <div className="bg-white rounded h-full shadow-sm flex flex-col">
                <div className="w-full h-3 bg-primary mb-2 rounded-sm"></div>
                <div className="flex-1 flex p-2">
                  <div className="w-1/3 flex flex-col">
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                  </div>
                  <div className="w-2/3 flex flex-col pl-2">
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Professional</h3>
              <Link href="/builder">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90"
                  onClick={handleCreateResume}
                >
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-64 bg-white p-4 flex flex-col">
              <div className="bg-white rounded h-full shadow-sm flex flex-col">
                <div className="w-1/4 h-3 bg-gray-800 mb-2 rounded-sm"></div>
                <div className="flex-1 flex p-2">
                  <div className="w-1/3 flex flex-col">
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                  </div>
                  <div className="w-2/3 flex flex-col pl-2">
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Minimal</h3>
              <Link href="/builder">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90"
                  onClick={handleCreateResume}
                >
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-64 bg-white p-4 flex flex-col">
              <div className="bg-white rounded h-full shadow-sm flex">
                <div className="w-1/3 bg-gray-800"></div>
                <div className="w-2/3 flex flex-col p-2">
                  <div className="h-2 w-3/4 bg-muted rounded-sm mb-1"></div>
                  <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                  <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                  <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Modern</h3>
              <Link href="/builder">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90"
                  onClick={handleCreateResume}
                >
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-64 bg-white p-4 flex flex-col">
              <div className="bg-white rounded h-full shadow-sm flex flex-col">
                <div className="w-full h-4 bg-gray-800 mb-2 flex items-center justify-center">
                  <div className="h-2 w-1/2 bg-white rounded-sm"></div>
                </div>
                <div className="flex-1 flex p-2">
                  <div className="w-full flex flex-col">
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-full bg-muted rounded-sm mb-1"></div>
                    <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                  </div>
                </div>
              </div>
            </div>
            <CardFooter className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Executive</h3>
              <Link href="/builder">
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90"
                  onClick={handleCreateResume}
                >
                  Use Template
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 mt-8 bg-primary/5 rounded-lg">
        <div className="text-center max-w-3xl mx-auto px-6">
          <MsLogo className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Start Building Your Professional Resume Today</h2>
          <p className="mt-4 text-lg text-gray-600">Create an ATS-optimized resume that helps you land more interviews and job offers.</p>
          <div className="mt-8">
            <Link href="/builder">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-base"
                onClick={handleCreateResume}
              >
                Create Your Resume Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
