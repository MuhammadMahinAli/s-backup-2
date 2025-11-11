import { useState } from "react";
import {
  clinics,
  clinicsByCategory,
  type Clinic,
} from "../../data/clinics";
import { ChevronDown, Navigation, RotateCcw } from "lucide-react";

interface ClinicSearchProps {
  onClinicSelect: (clinic: Clinic) => void;
  selectedClinic?: Clinic;
}

const ClinicSearch = ({
  onClinicSelect,
  selectedClinic,
}: ClinicSearchProps) => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedClinicId, setSelectedClinicId] = useState("");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [clinicDropdownOpen, setClinicDropdownOpen] = useState(false);

  const clinicTypes = [
    { value: "all", label: "All Clinics" },
    { value: "university", label: "University Level" },
    { value: "public", label: "Public Clinics/Hospitals" },
    { value: "private", label: "Private Clinics/Hospitals" },
  ];

  const getClinicsByType = (type: string) => {
    if (type === "all") return clinics;
    if (type === "university") return clinicsByCategory.university;
    if (type === "public") return clinicsByCategory.public;
    if (type === "private") return clinicsByCategory.private;
    return clinics;
  };

  const filteredClinics = getClinicsByType(selectedType);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedClinicId("");
    setTypeDropdownOpen(false);
  };

  const handleClinicChange = (clinicId: string) => {
    setSelectedClinicId(clinicId);
    setClinicDropdownOpen(false);
    const clinic = filteredClinics.find((c) => c.id === clinicId);
    if (clinic) {
      onClinicSelect(clinic);
    }
  };

  const handleRefresh = () => {
    setSelectedType("all");
    setSelectedClinicId("");
  };

  const selectedClinicName = selectedClinicId
    ? filteredClinics.find((c) => c.id === selectedClinicId)?.name ||
      "Select clinic"
    : selectedClinic?.name || "Select clinic";

  return (
    <section className="w-full bg-white py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-health-primary text-center mb-8 lg:mb-16 uppercase">
          Choose Your Support Pathway
        </h2>

        <div className="max-w-6xl mx-auto bg-health-lighter border border-health-light rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <h3 className="text-xl lg:text-2xl font-bold text-health-secondary">
              Clinic Search
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center">
              {/* Clinic Type Dropdown */}
              <div className="relative flex-1 min-w-0 sm:min-w-[250px]">
                <button
                  onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/35 border border-health-lighter rounded-lg shadow-sm hover:bg-white/50 transition-colors"
                >
                  <span className="text-health-text text-sm">
                    {clinicTypes.find((t) => t.value === selectedType)?.label ||
                      "Select clinic type"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-health-text opacity-50" />
                </button>

                {typeDropdownOpen && (
                  <div className="absolute z-[1100] w-full mt-1 bg-white border border-health-lighter rounded-lg shadow-lg">
                    {clinicTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => handleTypeChange(type.value)}
                        className="w-full px-4 py-3 text-left text-sm text-health-text hover:bg-health-lighter transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specific Clinic Dropdown */}
              <div className="relative flex-1 min-w-0 sm:min-w-[250px]">
                <button
                  onClick={() => setClinicDropdownOpen(!clinicDropdownOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/35 border border-health-lighter rounded-xl shadow-sm hover:bg-white/50 transition-colors"
                >
                  <span className="text-health-dark text-sm truncate">
                    {selectedClinicName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-health-text opacity-50 ml-2" />
                </button>

                {clinicDropdownOpen && (
                  <div className="absolute z-[1100] w-full mt-1 bg-white border border-health-lighter rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {filteredClinics.length > 0 ? (
                      filteredClinics.map((clinic) => (
                        <button
                          key={clinic.id}
                          onClick={() => handleClinicChange(clinic.id)}
                          className="w-full px-4 py-3 text-left text-sm text-health-dark hover:bg-health-lighter transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {clinic.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-health-text">
                        No clinics available for selected type
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-center sm:justify-start">
                <button
                  onClick={handleRefresh}
                  className="p-3 bg-health-lightest border border-health-light rounded-2xl shadow-sm hover:bg-white transition-colors"
                  title="Reset filters"
                >
                  <RotateCcw className="w-4 h-4 text-health-dark" />
                </button>
                <button
                  className="p-3 bg-health-lightest border border-health-light rounded-2xl shadow-sm hover:bg-white transition-colors"
                  title="Get directions"
                >
                  <Navigation className="w-4 h-4 text-health-dark" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClinicSearch;
