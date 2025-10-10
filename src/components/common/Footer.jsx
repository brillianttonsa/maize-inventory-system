import { Factory,Mail,Phone } from "lucide-react"
import { Link } from "react-router-dom"
export const Footer = () => {
    return (
      <footer className="bg-yellow-500 t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Factory className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">MaizeTrackAI</span>
              </div>
              <p className="text-gray-900 mb-4">
                The complete business management solution for maize processing companies. Streamline operations, reduce
                costs, and increase profitability.
              </p>
              
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Contacts
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-yellow-800 hover:text-yellow-900 transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
              <li>
                  <Link to="/private-policy" className="text-yellow-800 hover:text-yellow-900transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-yellow-800 hover:text-yellow-900 3transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
  
            <div>

                <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
                <div className="flex items-center text-gray-800 text-sm mb-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>abdullatifmnyamis@gmail.com</span>
                </div>
                <div className="flex items-center text-gray-800 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+255619577093</span>
                </div>
              
            </div>
          </div>
  
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gr00">
            <p>
              &copy; {new Date().getFullYear()} MaizeTrackAI. All rights reserved. Built with ❤️ for the maize processing
              industry.
            </p>
          </div>
        </div>
      </footer>
    )
  }