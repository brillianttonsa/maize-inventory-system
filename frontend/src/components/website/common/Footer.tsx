import { Factory, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer id="contact" className="bg-yellow-200 py-12">
      <div className="container max-w-6xl mx-auto px-2">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl font-bold text-yellow-700">MaizeTrack AI</span>
            </div>
            <p className="text-gray-900 mb-4">
              The complete business management solution for maize processing companies. Streamline
              operations, reduce costs, and increase profitability.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/#home" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/#about" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    About
                  </a>
                </li>
                
                <li>
                  <a href="/#contact" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Contacts
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/private-policy"
                    className="text-yellow-800 hover:text-yellow-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="text-yellow-800 hover:text-yellow-900  transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="flex items-center text-yellow-800 text-sm mb-1">
              <Mail className="w-4 h-4 mr-2" />
              <span>abdullatifmnyamis@gmail.com</span>
            </div>
            <div className="flex items-center text-yellow-800 text-sm">
              <Phone className="w-4 h-4 mr-2" />
              <span>+255619577093</span>
            </div>
          </div>
        </div>

        <div className="border-t border-yellow-600 pt-8 mt-8 text-center text-gr00">
          <p>
            &copy; {new Date().getFullYear()} MaizeTrack AI. All rights reserved. Built with love for
            the maize processing industry.
          </p>
        </div>
      </div>
    </footer>
  );
};
