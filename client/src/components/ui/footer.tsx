import MsLogo from "./ms-logo";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <MsLogo className="h-8 w-8 text-primary mr-3" />
            <div>
              <h2 className="text-lg font-semibold">Resume Builder</h2>
              <p className="text-sm text-gray-400">Create ATS-optimized resumes</p>
            </div>
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="hover:text-primary transition duration-150 ease-in-out">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition duration-150 ease-in-out">
              Terms of Service
            </Link>
            <Link href="/support" className="hover:text-primary transition duration-150 ease-in-out">
              Contact Support
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Resume Builder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
