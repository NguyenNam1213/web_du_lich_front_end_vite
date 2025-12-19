import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Destination } from "../../layouts/admin/types/destination.type";
import { Country } from "../../layouts/admin/types/country.type";
import { getDestinations } from "../../services/api/destinationApi";
import { getCountries } from "../../services/api/countryApi";

const SubNavbar = () => {
  const navigate = useNavigate();

  /* ---------------- DESTINATIONS MENU ---------------- */
  const [isOpen, setIsOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  const openMenu = async () => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setIsOpen(true);

    if (destinations.length === 0) {
      setLoading(true);
      try {
        const data = await getDestinations();
        setDestinations(data);
      } finally {
        setLoading(false);
      }
    }
  };

  const closeMenu = () => {
    closeTimeout.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const goToDestination = (id: number) => {
    navigate(`/tours/all?destinationId=${id}`);
    setIsOpen(false);
  };

  /* ---------------- COUNTRIES MENU ---------------- */
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const closeCountryTimeout = useRef<NodeJS.Timeout | null>(null);

  const openCountryMenu = async () => {
    if (closeCountryTimeout.current) clearTimeout(closeCountryTimeout.current);
    setIsCountryOpen(true);

    if (countries.length === 0) {
      setLoadingCountry(true);
      try {
        const data = await getCountries();
        setCountries(data);
      } finally {
        setLoadingCountry(false);
      }
    }
  };

  const closeCountryMenu = () => {
    closeCountryTimeout.current = setTimeout(() => {
      setIsCountryOpen(false);
    }, 200);
  };

  const goToCountry = (code: string) => {
    navigate(`/tours/all?country=${code}`);
    setIsCountryOpen(false);
  };

  return (
    <div className="relative bg-white border-y border-gray-200">
      <ul className="flex gap-8 py-4 px-8">

        {/* ---------------- KHU VỰC PHỔ BIẾN ---------------- */}
        <li
          className="relative"
          onMouseEnter={openCountryMenu}
          onMouseLeave={closeCountryMenu}
        >
          <span className="cursor-pointer text-gray-700 text-sm font-medium hover:text-orange-500">
            Khu vực phổ biến
          </span>

          {isCountryOpen && (
            <div
              className="absolute left-0 top-full w-[500px] bg-white shadow-lg border border-gray-200 rounded-md mt-2 p-4 z-50"
              onMouseEnter={() =>
                closeCountryTimeout.current &&
                clearTimeout(closeCountryTimeout.current)
              }
              onMouseLeave={closeCountryMenu}
            >
              {loadingCountry ? (
                <div className="text-gray-500 text-sm">Đang tải...</div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {countries.map((c) => (
                    <div
                      key={c.code}
                      onClick={() => goToCountry(c.code)}
                      className="px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer text-sm text-gray-700 font-medium"
                    >
                      {c.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </li>

        {/* ---------------- ĐIỂM ĐẾN PHỔ BIẾN ---------------- */}
        <li
          className="relative"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenu}
        >
          <span className="cursor-pointer text-gray-700 text-sm font-medium hover:text-orange-500">
            Điểm đến phổ biến
          </span>

          {isOpen && (
            <div
              onMouseEnter={() =>
                closeTimeout.current && clearTimeout(closeTimeout.current)
              }
              onMouseLeave={closeMenu}
              className="absolute left-0 top-full w-[650px] bg-white shadow-lg border border-gray-200 rounded-md mt-2 p-4 z-50"
            >
              {loading ? (
                <div className="text-gray-500 text-sm">Đang tải...</div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      onClick={() => goToDestination(dest.id)}
                      className="flex flex-col hover:bg-gray-50 p-2 rounded-md cursor-pointer"
                    >
                      {dest.imageUrl ? (
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-full h-20 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-500">
                          No image
                        </div>
                      )}

                      <span className="mt-2 text-sm text-gray-700 font-medium">
                        {dest.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </li>

        <li className="text-gray-700 text-sm font-medium hover:text-orange-500">
          Khám phá Travel
        </li>

        <li className="text-gray-700 text-sm font-medium hover:text-orange-500">
          Phiếu quà tặng Travel
        </li>
      </ul>
    </div>
  );
};

export default SubNavbar;
