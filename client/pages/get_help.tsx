import { useState } from "react";
import Hero from "../components/get_help/Hero";
import ClinicSearch from "../components/get_help/ClinicSearch";
import ClinicMap from "../components/get_help/ClinicMap";

import { type Clinic } from "../data/clinics.js";

export default function GetHelp() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | undefined>();

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  return (
    <>
      <Hero />
      <ClinicSearch
        onClinicSelect={handleClinicSelect}
        selectedClinic={selectedClinic}
      />
      <section className="w-full bg-white pb-12 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-health-lighter border border-health-light rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
            <ClinicMap
              selectedClinic={selectedClinic}
              onClinicSelect={handleClinicSelect}
            />
          </div>
        </div>
      </section>
    </>
  );
}
