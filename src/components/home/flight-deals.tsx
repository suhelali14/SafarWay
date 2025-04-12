import { motion } from "framer-motion";
import { Plane, Calendar, ArrowRight, TrendingUp, Timer } from "lucide-react";

const flightDeals = [
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    price: "₹2,599",
    airline: "IndiGo",
    duration: "2h 10m",
    dates: "Jan - Mar '25",
    discount: "25% OFF",
    trending: true
  },
  {
    from: "Bangalore",
    fromCode: "BLR",
    to: "Delhi",
    toCode: "DEL",
    price: "₹3,299",
    airline: "Air India",
    duration: "2h 40m",
    dates: "Feb - Apr '25",
    discount: "15% OFF",
    trending: false
  },
  {
    from: "Hyderabad",
    fromCode: "HYD",
    to: "Chennai",
    toCode: "MAA",
    price: "₹1,999",
    airline: "SpiceJet",
    duration: "1h 25m",
    dates: "Jan - Mar '25",
    discount: "30% OFF",
    trending: true
  },
  {
    from: "Mumbai",
    fromCode: "BOM",
    to: "Goa",
    toCode: "GOI",
    price: "₹1,799",
    airline: "AirAsia",
    duration: "1h 15m",
    dates: "Mar - May '25",
    discount: "20% OFF",
    trending: false
  },
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Kolkata",
    toCode: "CCU",
    price: "₹3,199",
    airline: "Vistara",
    duration: "2h 15m",
    dates: "Jan - Feb '25",
    discount: "10% OFF",
    trending: false
  }
];

export function FlightDeals() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold">Flight Deals</h2>
            <p className="text-gray-600 mt-2">
              Grab these limited period offers on domestic flights
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Deals <ArrowRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        {/* Deal Cards - Horizontal Scrolling for Mobile */}
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x">
          {flightDeals.map((deal, index) => (
            <motion.div
              key={`${deal.fromCode}-${deal.toCode}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 min-w-[280px] md:min-w-0 md:w-auto flex-1 snap-start border border-gray-100"
            >
              {/* Deal Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-lg font-semibold">{deal.fromCode}</span>
                    <Plane className="h-4 w-4 mx-2 text-blue-500 -rotate-[30deg]" />
                    <span className="text-lg font-semibold">{deal.toCode}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {deal.from} to {deal.to}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                  {deal.airline}
                </div>
              </div>
              
              {/* Deal Info */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">ONE WAY FARE</p>
                  <p className="text-2xl font-bold text-blue-600">{deal.price}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {deal.discount}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Timer className="h-3.5 w-3.5 mr-1" />
                    <span>{deal.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{deal.dates}</span>
                  </div>
                </div>
              </div>
              
              {/* Deal Footer */}
              <div className="flex justify-between items-center">
                {deal.trending && (
                  <div className="flex items-center text-xs text-red-600 gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Trending</span>
                  </div>
                )}
                {!deal.trending && <div></div>}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Deals <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-10 md:w-3/5">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Download our app for exclusive mobile deals!
              </h3>
              <p className="text-white/90 mb-6">
                Get access to app-only discounts, real-time flight status updates, and a seamless booking experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <img
                  src="https://seeklogo.com/images/D/download-on-the-app-store-badge-logo-8A059ADCCE-seeklogo.com.png"
                  alt="App Store"
                  className="h-10"
                />
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </div>
            <div className="md:w-2/5 p-4 md:p-0">
              <img
                src="https://img.freepik.com/free-vector/mobile-app-concept-illustration_114360-690.jpg"
                alt="Mobile App"
                className="max-h-64 mx-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 
import { Plane, Calendar, ArrowRight, TrendingUp, Timer } from "lucide-react";

const flightDeals = [
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    price: "₹2,599",
    airline: "IndiGo",
    duration: "2h 10m",
    dates: "Jan - Mar '25",
    discount: "25% OFF",
    trending: true
  },
  {
    from: "Bangalore",
    fromCode: "BLR",
    to: "Delhi",
    toCode: "DEL",
    price: "₹3,299",
    airline: "Air India",
    duration: "2h 40m",
    dates: "Feb - Apr '25",
    discount: "15% OFF",
    trending: false
  },
  {
    from: "Hyderabad",
    fromCode: "HYD",
    to: "Chennai",
    toCode: "MAA",
    price: "₹1,999",
    airline: "SpiceJet",
    duration: "1h 25m",
    dates: "Jan - Mar '25",
    discount: "30% OFF",
    trending: true
  },
  {
    from: "Mumbai",
    fromCode: "BOM",
    to: "Goa",
    toCode: "GOI",
    price: "₹1,799",
    airline: "AirAsia",
    duration: "1h 15m",
    dates: "Mar - May '25",
    discount: "20% OFF",
    trending: false
  },
  {
    from: "Delhi",
    fromCode: "DEL",
    to: "Kolkata",
    toCode: "CCU",
    price: "₹3,199",
    airline: "Vistara",
    duration: "2h 15m",
    dates: "Jan - Feb '25",
    discount: "10% OFF",
    trending: false
  }
];

export function FlightDeals() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold">Flight Deals</h2>
            <p className="text-gray-600 mt-2">
              Grab these limited period offers on domestic flights
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Deals <ArrowRight className="h-4 w-4 ml-1" />
          </motion.button>
        </div>

        {/* Deal Cards - Horizontal Scrolling for Mobile */}
        <div className="flex overflow-x-auto gap-4 pb-6 snap-x">
          {flightDeals.map((deal, index) => (
            <motion.div
              key={`${deal.fromCode}-${deal.toCode}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 min-w-[280px] md:min-w-0 md:w-auto flex-1 snap-start border border-gray-100"
            >
              {/* Deal Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <div className="flex items-center mb-1">
                    <span className="text-lg font-semibold">{deal.fromCode}</span>
                    <Plane className="h-4 w-4 mx-2 text-blue-500 -rotate-[30deg]" />
                    <span className="text-lg font-semibold">{deal.toCode}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {deal.from} to {deal.to}
                  </p>
                </div>
                <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">
                  {deal.airline}
                </div>
              </div>
              
              {/* Deal Info */}
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">ONE WAY FARE</p>
                  <p className="text-2xl font-bold text-blue-600">{deal.price}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {deal.discount}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <Timer className="h-3.5 w-3.5 mr-1" />
                    <span>{deal.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{deal.dates}</span>
                  </div>
                </div>
              </div>
              
              {/* Deal Footer */}
              <div className="flex justify-between items-center">
                {deal.trending && (
                  <div className="flex items-center text-xs text-red-600 gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>Trending</span>
                  </div>
                )}
                {!deal.trending && <div></div>}
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-6 text-center md:hidden">
          <button className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-6 py-2 rounded-full text-sm font-medium transition-colors inline-flex items-center">
            View All Deals <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl overflow-hidden shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="p-8 md:p-10 md:w-3/5">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Download our app for exclusive mobile deals!
              </h3>
              <p className="text-white/90 mb-6">
                Get access to app-only discounts, real-time flight status updates, and a seamless booking experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <img
                  src="https://seeklogo.com/images/D/download-on-the-app-store-badge-logo-8A059ADCCE-seeklogo.com.png"
                  alt="App Store"
                  className="h-10"
                />
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Google Play"
                  className="h-10"
                />
              </div>
            </div>
            <div className="md:w-2/5 p-4 md:p-0">
              <img
                src="https://img.freepik.com/free-vector/mobile-app-concept-illustration_114360-690.jpg"
                alt="Mobile App"
                className="max-h-64 mx-auto"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 