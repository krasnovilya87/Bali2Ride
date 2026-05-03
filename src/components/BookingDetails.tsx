import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Calendar, ShieldCheck, Zap, Info, X, MapPin, Clock, User, Phone, Mail, Check, Search, Plus, Minus, Navigation } from 'lucide-react';
import { Bike } from '../types';
import { useLanguage } from '../LanguageContext';
import { useRental } from '../RentalContext';
import { IDR_TO_USD } from '../constants';
import { format, setHours, setMinutes } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { DayPicker, DateRange } from 'react-day-picker';
import { startOfToday } from 'date-fns';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { type CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIconRetina,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface BookingDetailsProps {
  bike: Bike;
  onClose: () => void;
}

const LocationPicker = ({ position, setPosition, location, setLocation, language }: { position: L.LatLng, setPosition: (p: L.LatLng) => void, location: string, setLocation: (l: string) => void, language: string }) => {
  const [isSearching, setIsSearching] = useState(false);
  // Зона доставки - туристические районы Бали
  const DELIVERY_ZONE = [
    [-8.6500, 114.9800],
    [-8.6500, 115.3500],
    [-8.9500, 115.3500],
    [-8.9500, 114.9800],
  ];

  const isInsideZone = (lat: number, lon: number): boolean => {
    const [minLat, minLon] = [-8.8800, 115.0900];
    const [maxLat, maxLon] = [-8.6200, 115.2800];
    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  };

  const getDistrict = (address: any): string => {
    const subdistrict = address?.suburb || address?.village || address?.town || address?.city_district || '';
    const districts: Record<string, string> = {
      'Canggu': 'Canggu', 'Seminyak': 'Seminyak', 'Kuta': 'Kuta',
      'Legian': 'Legian', 'Ubud': 'Ubud', 'Sanur': 'Sanur',
      'Nusa Dua': 'Nusa Dua', 'Jimbaran': 'Jimbaran', 'Uluwatu': 'Uluwatu',
      'Denpasar': 'Denpasar', 'Berawa': 'Canggu', 'Pererenan': 'Canggu',
    };
    for (const [key, value] of Object.entries(districts)) {
      if (subdistrict.includes(key) || address?.display_name?.includes(key)) {
        return value;
      }
    }
    return subdistrict || 'Bali';
  };

  const fetchAddress = async (lat: number, lon: number) => {
    if (!isInsideZone(lat, lon)) {
      setLocation(language === 'ru' ? '⚠️ Доставка в этот район недоступна' : '⚠️ Delivery to this area is not available');
      return;
    }
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const data = await response.json();
      if (data && data.display_name) {
        const district = getDistrict(data.address);
        setLocation(data.display_name);
        // Передаём район наверх если есть callback
        if ((setLocation as any).onDistrict) {
          (setLocation as any).onDistrict(district);
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
  };

  const handleSearch = async () => {
    if (!location.trim()) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`);
      const data = await response.json();
      if (data && data.length > 0) {
        const newPos = new L.LatLng(parseFloat(data[0].lat), parseFloat(data[0].lon));
        setPosition(newPos);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const newPos = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
      setPosition(newPos);
      fetchAddress(pos.coords.latitude, pos.coords.longitude);
    });
  };

  const MapControls = () => {
    const map = useMap();

    return (
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); handleMyLocation(); }}
          className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all border border-border/50"
          title={language === 'ru' ? 'Мое местоположение' : 'My location'}
        >
          <Navigation className="w-5 h-5 fill-current" />
        </button>
      </div>
    );
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click(e) {
        setPosition(e.latlng);
        fetchAddress(e.latlng.lat, e.latlng.lng);
      },
    });

    useEffect(() => {
      map.flyTo(position, map.getZoom());
    }, [position]);

    return null;
  };

  return (
    <div className="space-y-3">
      <div className="h-64 w-full rounded-2xl overflow-hidden border border-border relative group">
        <MapContainer
          center={position}
          zoom={16}
          scrollWheelZoom={false}
          className="h-full w-full"
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
          <Marker position={position} />
          <MapEvents />
          <MapControls />
        </MapContainer>

        <div className="absolute top-4 right-4 z-[400]">
          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-tight shadow-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity text-right">
            {language === 'ru' ? 'Клик для выбора' : 'Click to pick'}
          </div>
        </div>
      </div>

      <div className="relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-60 z-10" />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={language === 'ru' ? 'Введите адрес или отель...' : 'Enter address or hotel...'}
          className="w-full bg-surface border border-border rounded-2xl py-4 pl-11 pr-14 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-50"
        >
          {isSearching ? (
            <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

const CustomTimePicker = ({ value, onChange, language }: { value: string, onChange: (v: string) => void, language: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  const timeSlots = useMemo(() => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 15) {
        slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  }, []);

  const currentValue = value || '09:00';
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeItem = listRef.current.querySelector('[data-active="true"]');
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center' });
      }
    }
  }, [isOpen]);

  return (
    <div className="relative group">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-surface border border-border rounded-2xl py-4 pl-11 pr-4 text-sm font-medium focus:border-primary cursor-pointer hover:border-primary/40 transition-all flex items-center justify-between"
      >
        <span className="font-display font-medium text-lg leading-none">{currentValue}</span>
        <ChevronLeft className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-90' : '-rotate-90'}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[550]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute left-0 right-0 mt-2 bg-surface/95 backdrop-blur-xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[1100] overflow-hidden"
            >
              <div ref={listRef} className="max-h-64 overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-border flex flex-col gap-1">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    data-active={slot === currentValue}
                    onClick={() => {
                      onChange(slot);
                      setIsOpen(false);
                    }}
                    className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all text-left flex items-center justify-between ${slot === currentValue
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'hover:bg-primary/5 text-foreground'
                      }`}
                  >
                    <span>{slot}</span>
                    {slot === currentValue && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const YEARS = [2026, 2025, 2024, 2023, 2022];

export const BookingDetails: React.FC<BookingDetailsProps> = ({ bike, onClose }) => {
  const { language, t } = useLanguage();
  const { range, days, setRange } = useRental();
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedColor, setSelectedColor] = useState(bike.colors?.[0]?.name || '');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [location, setLocation] = useState(language === 'ru' ? 'Открытая парковка для мотоциклов в аэропорту' : 'Open motorcycle parking at the airport');
  const [mapPosition, setMapPosition] = useState<L.LatLng>(new L.LatLng(-8.7447, 115.1638)); // Precise Bali Airport Bike Parking
  const [deliveryTime, setDeliveryTime] = useState('09:00');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('id');
  const [dialCode, setDialCode] = useState('62');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState(false);
  const [isDiscountInfoOpen, setIsDiscountInfoOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleVerifyWhatsApp = () => {
    if (!isValid || isVerifying || isVerified) return;
    setIsVerifying(true);
    setVerificationError(false);

    // Simulate WhatsApp API verification
    setTimeout(() => {
      setIsVerifying(false);
      // Simulate "Not registered" if number ends in 0
      if (phone.endsWith('0')) {
        setVerificationError(true);
        setIsVerified(false);
      } else {
        setIsVerified(true);
        setVerificationError(false);
      }
    }, 1500);
  };

  const isValid = useMemo(() => {
    if (!phone) return false;

    // Strict digit counts based on user's manual mask list
    const MASK_DIGIT_COUNTS: Record<string, number> = {
      in: 10, cn: 11, us: 10, ca: 10, id: 11, pk: 10, br: 11, ng: 10, bd: 10,
      ru: 10, kz: 10, mx: 10, jp: 10, et: 9, ph: 11, eg: 10, vn: 9, cd: 9,
      tr: 10, ir: 10, de: 11, th: 9, gb: 11, fr: 9, it: 10, za: 9, kr: 10,
      co: 10, es: 9, ar: 10, dz: 9, ua: 9, iq: 10, pl: 9, ma: 9, sa: 9,
      uz: 9, pe: 9, my: 9, au: 9, nl: 9, ro: 9, cl: 9, gt: 8, ec: 9,
      cz: 9, gr: 10, pt: 9, az: 10, se: 9, ae: 9, hu: 9, by: 9, il: 9,
      ch: 9, at: 11, sg: 8, dk: 8, fi: 10, sk: 9, no: 8, ie: 9, nz: 9,
      qa: 8, ee: 8
    };

    const requiredDigits = MASK_DIGIT_COUNTS[country] || 10;
    const totalDigits = phone.replace(/\D/g, '').length;

    // Valid only if national digits matches required count exactly
    return (totalDigits - dialCode.length) === requiredDigits;
  }, [phone, country, dialCode]);

  useEffect(() => {
    if (isValid && !isVerified && !isVerifying && !verificationError) {
      handleVerifyWhatsApp();
    }
  }, [isValid, phone]);

  const calendarRef = useRef<HTMLDivElement>(null);

  const dateLocale = language === 'ru' ? ru : enUS;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCalendarOpen]);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange({ from: newRange?.from, to: newRange?.to });
  };

  // Calculate price based on year (older = cheaper)
  const basePrice = bike.pricePerDay;
  const yearMultiplier = 1 - (2026 - selectedYear) * 0.1; // 10% discount per year older
  const currentPrice = Math.round(basePrice * yearMultiplier);

  const displayImage = bike.imagesByYear?.[selectedYear] || bike.image;

  // Apply duration discount
  const discountPercent = days >= 30 ? 25 : days >= 7 ? 15 : 8;
  const finalPricePerDay = Math.round(currentPrice * (1 - discountPercent / 100));
  const totalPrice = finalPricePerDay * days;
  const formatPrice = (p: number) => new Intl.NumberFormat('id-ID').format(p);

  const getUSD = (p: number) => `~$${Math.round(p / IDR_TO_USD)}`;

  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'success'>('method');

  const handlePayment = async () => {
    setPaymentStep('processing');

    try {
      // Notify backend about the new booking
      await fetch('/api/notify-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bike,
          selectedYear,
          selectedColor,
          bookingDetails: {
            days,
            from: range.from ? format(range.from, 'd MMM y', { locale: dateLocale }) : '',
            to: range.to ? format(range.to, 'd MMM y', { locale: dateLocale }) : '',
            fromISO: range.from ? format(range.from, 'yyyy-MM-dd') : '',
            toISO: range.to ? format(range.to, 'yyyy-MM-dd') : '',
            totalPrice,
            location,
            deliveryTime
          },
          customerDetails: {
            name,
            phone,
            email
          }
        })
      });
    } catch (error) {
      console.error("Notification failed:", error);
    }

    setTimeout(() => {
      setPaymentStep('success');
    }, 2000);
  };

  if (showPayment) {
    return (
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        className="fixed inset-0 z-[200] bg-background flex flex-col h-screen overflow-y-auto"
      >
        <div className="p-6 flex items-center justify-between border-b border-border sticky top-0 bg-background z-10">
          <button onClick={() => setShowPayment(false)} className="p-2 -ml-2 hover:bg-black/5 rounded-xl transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h2 className="font-display font-bold text-lg">{language === 'ru' ? 'Оплата' : 'Checkout'}</h2>
          </div>
          <div className="w-10" />
        </div>

        <div className="flex-grow p-6 flex flex-col max-w-2xl mx-auto w-full">
          {paymentStep === 'method' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-8 bg-surface border border-border rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted text-[10px] uppercase font-bold tracking-[0.2em]">{bike.name}</span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {days} {language === 'ru' ? 'дн.' : 'days'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xl font-display font-bold text-foreground tracking-tight">
                      {formatPrice(totalPrice)} IDR
                    </span>
                    <span className="text-[10px] text-muted mt-1 font-medium tracking-wide">
                      {language === 'ru' ? 'Общая сумма к оплате' : 'Total amount to pay'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-muted uppercase font-bold tracking-widest px-1 ml-2">
                  {language === 'ru' ? 'Выберите способ' : 'Select Method'}
                </span>
                <button
                  onClick={handlePayment}
                  className="w-full h-20 flex items-center justify-between px-6 bg-surface border border-border rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-base">Apple Pay</span>
                      <span className="text-[10px] text-muted font-medium">Fast & Secure</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
                <button
                  onClick={handlePayment}
                  className="w-full h-20 flex items-center justify-between px-6 bg-surface border border-border rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-sm transform group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">VISA</div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-base">Credit Card</span>
                      <span className="text-[10px] text-muted font-medium">Visa, Mastercard</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
                <button
                  onClick={handlePayment}
                  className="w-full h-20 flex items-center justify-between px-6 bg-surface border border-border rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-[10px] transform group-hover:scale-110 transition-transform shadow-lg shadow-primary/20 leading-none text-center">Indo<br />Bank</div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-base">{language === 'ru' ? 'Банки Индонезии' : 'Indonesian Banks'}</span>
                      <span className="text-[10px] text-muted font-medium">VA, Bank Transfer</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
                <button
                  onClick={handlePayment}
                  className="w-full h-20 flex items-center justify-between px-6 bg-surface border border-border rounded-3xl hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface border border-border rounded-2xl flex items-center justify-center font-bold text-sm transform group-hover:scale-110 transition-transform overflow-hidden">
                      <div className="flex flex-col items-center">
                        <span className="text-primary text-[8px] leading-tight">СБП</span>
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-base">{language === 'ru' ? 'СБП' : 'SBP'}</span>
                      <span className="text-[10px] text-muted font-medium">Fast Payment System</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-border group-hover:border-primary group-hover:bg-primary/5 flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {paymentStep === 'processing' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-8 p-12">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full shadow-2xl shadow-primary/10"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 border-4 border-black/5 border-b-black/20 rounded-full"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {language === 'ru' ? 'Обработка платежа...' : 'Processing Payment...'}
                </h3>
                <p className="text-sm text-muted font-medium">
                  {language === 'ru' ? 'Пожалуйста, не закрывайте окно' : 'Please do not close this window'}
                </p>
              </div>
            </div>
          )}

          {paymentStep === 'success' && (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-10 p-6">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  className="w-32 h-32 bg-green-500 rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-green-500/20"
                >
                  <Check className="w-16 h-16 stroke-[3]" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-green-500 rounded-[40px] blur-2xl -z-10"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-display font-bold text-foreground">
                  {language === 'ru' ? 'Успешно!' : 'Thank You!'}
                </h2>
                <div className="space-y-2">
                  <p className="text-muted font-medium">
                    {language === 'ru'
                      ? 'Ваше бронирование подтверждено.'
                      : 'Your reservation is confirmed.'}
                  </p>
                  <div className="p-4 bg-surface rounded-2xl border border-border inline-block">
                    <p className="text-xs font-bold text-foreground">
                      {language === 'ru'
                        ? 'Мы свяжемся с вами в WhatsApp в ближайшее время.'
                        : 'We will reach out via WhatsApp shortly.'}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full h-20 bg-foreground text-white rounded-3xl font-display font-bold text-lg hover:bg-black transition-all shadow-2xl shadow-black/20"
              >
                {language === 'ru' ? 'Готово' : 'Done'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-background flex flex-col h-screen overflow-y-auto"
    >
      {/* Header Image */}
      <div className="relative w-full h-[35vh] shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={displayImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={displayImage}
            alt={bike.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />

        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 text-white hover:bg-white/40 transition-all active:scale-90"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-display font-bold text-white leading-tight">
            {bike.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow px-6 py-8 max-w-2xl mx-auto w-full space-y-6">
        {/* Price & Discount Section */}
        <div className="space-y-1">
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-foreground">
              {formatPrice(finalPricePerDay)} IDR <span className="text-xs font-medium text-muted ml-0.5 opacity-70">{getUSD(finalPricePerDay)}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted line-through opacity-50 select-none">
                {formatPrice(Math.round(currentPrice * 1.2))} IDR
              </span>
              <span className="text-sm font-bold text-red-500">
                -{discountPercent}%
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsDiscountInfoOpen(true)}
            className="text-[10px] text-muted hover:text-primary transition-colors flex items-center gap-1.5 font-bold uppercase tracking-wider h-8 -ml-1 px-1 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/10"
          >
            <Info className="w-3 h-3" />
            {language === 'ru' ? 'Скидка от 7 дней' : 'Discount from 7 days'}
          </button>
        </div>

        {/* Color Selector */}
        {bike.colors && (
          <div className="flex gap-4">
            {bike.colors.map(color => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all p-0.5 ${selectedColor === color.name ? 'border-primary ring-4 ring-primary/10' : 'border-border hover:border-primary/40'
                  }`}
              >
                <div
                  className="w-full h-full rounded-full shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Year Selector */}
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {YEARS.map(year => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${selectedYear === year
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                  : 'bg-surface border-border text-foreground hover:border-primary/30'
                  }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Info Grid - Interactive Date Selection */}
        <div className="relative">
          <div
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className={`group cursor-pointer rounded-3xl border transition-all duration-300 overflow-hidden ${isCalendarOpen
              ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 ring-4 ring-primary/5'
              : 'bg-surface border-border hover:border-primary/40 hover:shadow-xl hover:shadow-black/5'
              }`}
          >
            <div className="flex items-stretch h-16">
              {/* Check-in */}
              <div className="flex-1 px-6 flex flex-col justify-center">
                <span className="font-display font-medium text-sm text-foreground">
                  {range.from ? format(range.from, 'd MMM y', { locale: dateLocale }) : '...'}
                </span>
              </div>

              <div className="flex items-center text-muted px-2">
                <span className="w-4 h-[1px] bg-border" />
              </div>

              {/* Check-out */}
              <div className="flex-1 px-6 flex flex-col justify-center text-right">
                <span className="font-display font-medium text-sm text-foreground">
                  {range.to ? format(range.to, 'd MMM y', { locale: dateLocale }) : '...'}
                </span>
              </div>

              {/* Duration / Discount Badge */}
              <div className="bg-foreground flex flex-col items-center justify-center px-5 transition-colors group-hover:bg-primary">
                <span className="text-xl font-display font-bold text-white leading-none">{days}</span>
                <span className="text-[8px] font-bold text-red-500 bg-white px-1.5 py-0.5 rounded-full mt-1">-{discountPercent}%</span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isCalendarOpen && (
              <motion.div
                ref={calendarRef}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-4 bg-surface border border-border rounded-3xl p-6 shadow-2xl z-[600] overflow-hidden"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
                    {language === 'ru' ? 'Календарь' : 'Calendar'}
                  </h3>
                  <button onClick={() => setIsCalendarOpen(false)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-muted" />
                  </button>
                </div>

                <div className="rdp-custom flex justify-center">
                  <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={1}
                    locale={dateLocale}
                    disabled={{ before: startOfToday() }}
                    className="!m-0"
                    classNames={{
                      day_selected: "bg-primary text-white rounded-full",
                      day_today: "text-primary font-bold underline",
                      day_range_middle: "bg-primary/20 !text-white rounded-none",
                      day_range_start: "bg-primary text-white rounded-l-full",
                      day_range_end: "bg-primary text-white rounded-r-full",
                    }}
                  />
                </div>

                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="w-full mt-6 bg-primary text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                >
                  {language === 'ru' ? 'Применить' : 'Apply'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Location & Time Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <span className="text-[10px] text-muted uppercase font-bold tracking-widest px-1">
              {language === 'ru' ? 'Локация доставки' : 'Delivery Location'}
            </span>
            <div className="space-y-4">
              <LocationPicker
                position={mapPosition}
                setPosition={setMapPosition}
                location={location}
                setLocation={setLocation}
                language={language}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-muted uppercase font-bold tracking-widest px-1">
              {language === 'ru' ? 'Время доставки' : 'Delivery Time'}
            </span>
            <div className="relative">
              <Clock className="absolute left-4 top-[22px] w-4 h-4 text-primary opacity-60 z-10 pointer-events-none" />
              <CustomTimePicker
                value={deliveryTime}
                onChange={setDeliveryTime}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-4">
          <div className="px-1">
            <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
              {language === 'ru' ? 'Контактные данные' : 'Contact Details'}
            </span>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted opacity-60" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                  const formatted = val.split(' ').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ');
                  setName(formatted);
                }}
                placeholder={language === 'ru' ? 'Ваше имя' : 'Your name'}
                className="w-full bg-surface border border-border rounded-2xl py-4 pl-11 pr-4 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
              />
            </div>
            <div className="relative phone-input-container">
              <PhoneInput
                country={country}
                value={phone}
                onChange={(val, data: any) => {
                  setPhone(val);
                  setCountry(data.countryCode);
                  setDialCode(data.dialCode);
                  setIsVerified(false);
                  setIsVerifying(false);
                  setVerificationError(false);
                }}
                enableSearch
                disableSearchIcon
                placeholder="WhatsApp number"
                searchPlaceholder="Search country..."
                searchNotFound="No results"
                masks={{
                  in: '.....-.....',
                  cn: '... .... ....',
                  us: '(...) ...-....',
                  ca: '(...) ...-....',
                  id: '...-....-....',
                  pk: '...-.......',
                  br: '.. 9....-....',
                  ng: '... ... ....',
                  bd: '....-......',
                  ru: '(...) ...-..-..',
                  kz: '(...) ...-..-..',
                  mx: '... ... ....',
                  jp: '..-....-....',
                  et: '.. ... ....',
                  ph: '.... ... ....',
                  eg: '... ... ....',
                  vn: '... ... ...',
                  cd: '... ... ...',
                  tr: '... ... .. ..',
                  ir: '... ... ....',
                  de: '.... .......',
                  th: '.. ... ....',
                  gb: '..... ......',
                  fr: '. .. .. .. ..',
                  it: '... .......',
                  za: '.. ... ....',
                  kr: '..-....-....',
                  co: '... ... ....',
                  es: '... .. .. ..',
                  ar: '.. ....-....',
                  dz: '... .. .. ..',
                  ua: '(..) ... .. ..',
                  iq: '... ... ....',
                  pl: '... ... ...',
                  ma: '.-.. .. .. ..',
                  sa: '. ... ....',
                  uz: '.. ...-..-..',
                  pe: '... ... ...',
                  my: '..-... ....',
                  au: '. .... ....',
                  nl: '. .. .. .. ..',
                  ro: '... ... ...',
                  cl: '. .... ....',
                  gt: '.... ....',
                  ec: '. ... ....',
                  cz: '... ... ...',
                  gr: '... ... ....',
                  pt: '... ... ...',
                  az: '.. ... .. ..',
                  se: '.. ... .. ..',
                  ae: '. ... ....',
                  hu: '.. ... ....',
                  by: '(..) ...-..-..',
                  il: '..-...-....',
                  ch: '.. ... .. ..',
                  at: '.... .......',
                  sg: '.... ....',
                  dk: '.. .. .. ..',
                  fi: '... ... ....',
                  sk: '... ... ...',
                  no: '... .. ...',
                  ie: '.. ... ....',
                  nz: '.. ... ....',
                  qa: '.... ....',
                  ee: '.... ....',
                }}
                inputStyle={{
                  width: '100%',
                  height: '54px',
                  borderRadius: '16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  backgroundColor: 'var(--color-surface)',
                  border: phone && isValid ? '1px solid #22c55e' : '1px solid var(--color-border)',
                  paddingLeft: '56px',
                  transition: 'all 0.2s',
                }}
                buttonStyle={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  paddingLeft: '12px',
                  width: '48px',
                  borderRadius: '16px 0 0 16px',
                }}
                containerClass="!w-full"
                inputClass="!w-full !font-medium !text-foreground !outline-none focus:!border-primary focus:!ring-4 focus:!ring-primary/5"
                dropdownClass="!bg-surface !border-border !rounded-2xl !mt-2 !shadow-2xl !overflow-hidden !text-sm"
                searchClass="!bg-surface !border-border !px-4 !py-2 !mx-0 !w-full !sticky !top-0 !z-10"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
                {isVerified ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter animate-in fade-in slide-in-from-right-1">Verified</span>
                    <Check className="w-4 h-4 text-green-500 animate-in zoom-in" />
                  </div>
                ) : isVerifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : verificationError ? (
                  <div className="w-4 h-4 text-red-500 bg-red-500/10 rounded-full flex items-center justify-center font-bold text-[10px]">!</div>
                ) : phone && phone.length > 3 ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse pointer-events-none" />
                ) : (
                  <Phone className="w-4 h-4 text-muted opacity-60 pointer-events-none" />
                )}
              </div>
            </div>
            {verificationError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[10px] font-bold text-red-500 px-1 mt-1"
              >
                {language === 'ru' ? 'Номер не зарегистрирован в WhatsApp' : 'Number is not registered in WhatsApp'}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Discount Info Modal */}
      <AnimatePresence>
        {isDiscountInfoOpen && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDiscountInfoOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl relative z-10 p-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold text-foreground">
                  {language === 'ru' ? 'Система скидок' : 'Discount System'}
                </h3>
                <button onClick={() => setIsDiscountInfoOpen(false)} className="p-2 hover:bg-black/5 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-muted/5 rounded-2xl border border-border/50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted uppercase tracking-widest">{language === 'ru' ? 'До 7 дней' : 'Up to 7 days'}</span>
                    <span className="text-sm font-medium text-foreground">{language === 'ru' ? 'Базовая скидка' : 'Base discount'}</span>
                  </div>
                  <span className="text-2xl font-display font-bold text-red-500">8%</span>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between scale-105 shadow-xl shadow-primary/5">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{language === 'ru' ? '7 - 30 дней' : '7 - 30 days'}</span>
                    <span className="text-sm font-medium text-foreground">{language === 'ru' ? 'Популярный выбор' : 'Popular choice'}</span>
                  </div>
                  <span className="text-2xl font-display font-bold text-primary">15%</span>
                </div>

                <div className="p-4 bg-foreground/5 rounded-2xl border border-foreground/10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-muted uppercase tracking-widest">{language === 'ru' ? 'От 30 дней' : '30+ days'}</span>
                    <span className="text-sm font-medium text-foreground">{language === 'ru' ? 'Максимальная выгода' : 'Maximum value'}</span>
                  </div>
                  <span className="text-2xl font-display font-bold text-foreground">25%</span>
                </div>
              </div>

              <button
                onClick={() => setIsDiscountInfoOpen(false)}
                className="w-full mt-8 h-16 bg-primary text-white rounded-2xl font-display font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
              >
                {language === 'ru' ? 'Понятно' : 'Got it'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-xl border-t border-border p-6 mt-auto z-[1000] shadow-[0_-20px_50px_rgba(0,0,0,0.15)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-foreground">
              {formatPrice(totalPrice)} IDR <span className="text-xs font-medium text-muted ml-0.5 opacity-70">{getUSD(totalPrice)}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted line-through opacity-60">
                {formatPrice(Math.round(currentPrice * days))} IDR
              </span>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">
                -{discountPercent}%
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isVerified) {
                const el = document.getElementById('phone-input');
                const container = el?.closest('.phone-input-container');
                container?.classList.add('border-red-500', 'shake-animation');
                setTimeout(() => container?.classList.remove('border-red-500', 'shake-animation'), 2000);
                return;
              }
              setShowPayment(true);
            }}
            className={`flex-1 max-w-[200px] py-4 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl transition-all ${isVerified
              ? 'bg-primary text-white shadow-primary/20 hover:scale-105 active:scale-95'
              : 'bg-muted/20 text-muted cursor-not-allowed'
              }`}
          >
            {language === 'ru' ? 'Оплатить' : 'Pay'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
