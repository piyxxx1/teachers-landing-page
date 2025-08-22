import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set target date (7 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="max-w-sm sm:max-w-md w-full bg-white rounded-lg shadow-xl relative overflow-hidden mx-2">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-white rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>

        {/* Image */}
        <div className="relative">
          <img
            src="/lovable-uploads/popup/Workshop-Legal-Writing-Side-1.png"
            alt="Legal Writing Workshop"
            className="w-full h-32 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 sm:mb-4 text-amber-900">
            Legal Writing Workshop
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 text-center mb-4 sm:mb-6">
            Master the art of legal writing with our exclusive workshop. Limited seats available!
          </p>

          {/* Timer */}
          <div className="bg-amber-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-center mb-2 sm:mb-3">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-2" />
              <span className="text-xs sm:text-sm font-semibold text-amber-800">Registration Ends In:</span>
            </div>
            
            <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center">
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <div className="text-lg sm:text-xl font-bold text-amber-900">{timeLeft.days}</div>
                <div className="text-xs text-gray-600">Days</div>
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <div className="text-lg sm:text-xl font-bold text-amber-900">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Hours</div>
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <div className="text-lg sm:text-xl font-bold text-amber-900">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Minutes</div>
              </div>
              <div className="bg-white rounded-lg p-1.5 sm:p-2">
                <div className="text-lg sm:text-xl font-bold text-amber-900">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Seconds</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <Button 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 sm:py-3 text-sm sm:text-base"
              onClick={() => {
                window.open('https://forms.office.com/pages/responsepage.aspx?id=-m_t40LQXkKOX_MUbtltZBWEL52EmyhPjY4p8NtMoEBUNVdaTVVGMlVFWjdIUjQ1R01HWE5VQUxZUS4u&route=shorturl', '_blank');
              }}
            >
              Register Now - Limited Seats!
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full py-2.5 sm:py-3 text-sm sm:text-base"
              onClick={onClose}
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
            Don't miss this opportunity to enhance your legal writing skills!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Popup;
