export interface Clinic {
  id: string;
  name: string;
  category: "University" | "Public" | "Private" | "NGO";
  address: string;
  phone: string;
  website?: string;
  email?: string;
  hours: string;
  cost: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  whatsapp?: string;
}

export const clinics: Clinic[] = [
  // University Level
  {
    id: "taylors-qualitas",
    name: "Qualitas Health - Klinik Kumpulan Medic (Taylor's University)",
    category: "University",
    address: "Lot G-28, Ground Floor, Taylor's University Lakeside Campus, No. 1, Jalan Taylor's, Subang Jaya, Selangor",
    phone: "03-5612 0656",
    website: "qualitashealth.com.my",
    hours: "9:00 AM - 6:00 PM",
    cost: "Student rates available",
    description: "On-campus healthcare facility specifically for Taylor's University students and staff with affordable rates.",
    coordinates: {
      lat: 3.0644,
      lng: 101.5892
    }
  },

  // Public Clinics
  {
    id: "kampung-melayu-subang",
    name: "Klinik Kesihatan Kampung Melayu Subang",
    category: "Public",
    address: "Jalan Merbau, Kampung Melayu Subang, 40150 Shah Alam, Selangor",
    phone: "03-7803 5534",
    website: "jknselangor.moh.gov.my",
    hours: "8:00 AM - 5:00 PM",
    cost: "RM1 for Malaysian students, Subsidized rates for international students",
    description: "Government health clinic providing affordable basic healthcare services.",
    coordinates: {
      lat: 3.0738,
      lng: 101.5183
    }
  },
  {
    id: "seksyen-7-shah-alam",
    name: "Klinik Kesihatan Seksyen 7 (Shah Alam)",
    category: "Public",
    address: "No. 2, Persiaran Kayangan, Seksyen 7, 40000 Shah Alam, Selangor",
    phone: "03-5518 6531 / 6534",
    website: "jknselangor.moh.gov.my",
    hours: "8:00 AM - 5:00 PM",
    cost: "RM1 for Malaysian students, Subsidized rates for international students",
    description: "Public health clinic in Shah Alam serving the local community with affordable healthcare.",
    coordinates: {
      lat: 3.0733,
      lng: 101.4901
    }
  },
  {
    id: "puchong-clinic",
    name: "Klinik Kesihatan Puchong",
    category: "Public",
    address: "Batu 14, Jalan Puchong, 47100 Puchong, Petaling, Selangor",
    phone: "03-8061 1814",
    website: "jknselangor.moh.gov.my",
    hours: "8:00 AM - 5:00 PM",
    cost: "RM1 for Malaysian students, Subsidized rates for international students",
    description: "Government clinic serving Puchong area with comprehensive primary healthcare services.",
    coordinates: {
      lat: 3.0167,
      lng: 101.6500
    }
  },
  {
    id: "utc-selangor",
    name: "Klinik Kesihatan UTC Selangor (Shah Alam)",
    category: "Public",
    address: "Lot G, Anggerik Mall, Jalan 14/7, Seksyen 7, 40000 Shah Alam, Selangor",
    phone: "03-5525 0200",
    website: "jknselangor.moh.gov.my",
    hours: "8:00 AM - 5:00 PM",
    cost: "RM1 for Malaysian students, Subsidized rates for international students",
    description: "Urban Transformation Centre health clinic in convenient mall location.",
    coordinates: {
      lat: 3.0759,
      lng: 101.4901
    }
  },

  // Private Clinics
  {
    id: "red-clinic-jaya-one",
    name: "The Red Clinic - Jaya One",
    category: "Private",
    address: "19-P1, Jaya One, Block A, 72A, Jln Profesor Diraja Ungku Aziz, 46200 Petaling Jaya, Selangor",
    phone: "+60108730175",
    website: "https://theredclinic.com/",
    hours: "9:00 AM - 9:00 PM",
    cost: "Private rates",
    description: "Modern private clinic specializing in sexual health and reproductive care with extended hours.",
    coordinates: {
      lat: 3.1073,
      lng: 101.6400
    }
  },
  {
    id: "red-clinic-menara-k1",
    name: "The Red Clinic - Menara K1",
    category: "Private",
    address: "G-05b, Menara K1, Lorong 3/137C, off Jln Klang Lama, 58000 Kuala Lumpur",
    phone: "+60189730175",
    website: "https://theredclinic.com/",
    hours: "9:00 AM - 9:00 PM",
    cost: "Private rates",
    description: "Professional sexual health clinic offering confidential services and expert care.",
    coordinates: {
      lat: 3.0833,
      lng: 101.6667
    }
  },
  {
    id: "sjmc",
    name: "Subang Jaya Medical Centre (SJMC)",
    category: "Private",
    address: "1, Jalan SS12/1A, 47500 Subang Jaya, Selangor",
    phone: "03-5639 1212",
    website: "sjmc.com.my",
    hours: "24 hours",
    cost: "Private hospital rates",
    description: "Leading private hospital providing comprehensive medical services with 24/7 emergency care.",
    coordinates: {
      lat: 3.0583,
      lng: 101.5906
    }
  },
  {
    id: "sunway-medical",
    name: "Sunway Medical Centre",
    category: "Private",
    address: "5, Jalan Lagoon Selatan, Bandar Sunway, 47500 Subang Jaya, Selangor",
    phone: "03-7491 9191",
    website: "sunwaymedical.com",
    hours: "24 hours",
    cost: "Private hospital rates",
    description: "Premier medical center with state-of-the-art facilities and specialist services.",
    coordinates: {
      lat: 3.0683,
      lng: 101.6033
    }
  }
];

export const ngos = [
  {
    id: "frham",
    name: "Federation of Reproductive Health Associations, Malaysia (FRHAM)",
    website: "https://www.frham.org.my/contact-us/",
    description: "Reproductive health advocacy and support"
  },
  {
    id: "mac",
    name: "Malaysian AIDS Council (MAC)",
    website: "https://mac.org.my/v4/",
    description: "HIV/AIDS prevention and support services"
  },
  {
    id: "rraam",
    name: "Reproductive Rights Advocacy Alliance Malaysia (RRAAM)",
    website: "https://www.rraam.org/",
    whatsapp: "+60183687950",
    description: "Reproductive rights advocacy and support"
  }
];

export const clinicsByCategory = {
  university: clinics.filter(c => c.category === "University"),
  public: clinics.filter(c => c.category === "Public"),
  private: clinics.filter(c => c.category === "Private"),
  ngos: ngos
};
