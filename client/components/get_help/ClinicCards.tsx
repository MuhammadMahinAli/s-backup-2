import { clinicsByCategory, type Clinic } from "../../data/clinics";
import { Phone, MapPin, Globe, MessageCircle } from "lucide-react";

interface ClinicCardProps {
    clinic: Clinic;
}

const ClinicCard = ({ clinic }: ClinicCardProps) => {
    return (
        <div className="bg-white border border-health-light rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
            <h4 className="text-lg font-bold text-health-primary mb-3">
                {clinic.name}
            </h4>

            <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-health-secondary mt-0.5 flex-shrink-0" />
                    <p className="text-health-text">{clinic.address}</p>
                </div>

                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-health-secondary flex-shrink-0" />
                    <a
                        href={`tel:${clinic.phone}`}
                        className="text-health-dark hover:text-health-primary transition-colors"
                    >
                        {clinic.phone}
                    </a>
                </div>

                {clinic.website && (
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-health-secondary flex-shrink-0" />
                        <a
                            href={clinic.website.startsWith('http') ? clinic.website : `https://${clinic.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-health-dark hover:text-health-primary transition-colors truncate"
                        >
                            {clinic.website}
                        </a>
                    </div>
                )}

                {clinic.whatsapp && (
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-health-secondary flex-shrink-0" />
                        <a
                            href={`https://wa.me/${clinic.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-health-dark hover:text-health-primary transition-colors"
                        >
                            {clinic.whatsapp}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

interface NGOCardProps {
    ngo: {
        id: string;
        name: string;
        website: string;
        whatsapp?: string;
        description: string;
    };
}

const NGOCard = ({ ngo }: NGOCardProps) => {
    return (
        <div className="bg-white border border-health-light rounded-xl shadow-md hover:shadow-xl transition-shadow p-6">
            <h4 className="text-lg font-bold text-health-primary mb-2">
                {ngo.name}
            </h4>

            <p className="text-sm text-health-text mb-3">{ngo.description}</p>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-health-secondary flex-shrink-0" />
                    <a
                        href={ngo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-health-dark hover:text-health-primary transition-colors truncate"
                    >
                        {ngo.website}
                    </a>
                </div>

                {ngo.whatsapp && (
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-health-secondary flex-shrink-0" />
                        <a
                            href={`https://wa.me/${ngo.whatsapp.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-health-dark hover:text-health-primary transition-colors"
                        >
                            WhatsApp: {ngo.whatsapp}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const ClinicCards = () => {
    return (
        <section className="w-full bg-health-lightest py-12 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-health-primary text-center mb-12 lg:mb-16 uppercase">
                    Healthcare Resources
                </h2>

                {/* Government Health Clinics */}
                <div className="mb-12 lg:mb-16">
                    <h3 className="text-xl lg:text-2xl font-bold text-health-secondary mb-6">
                        Government Health Clinics (Klinik Kesihatan)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {clinicsByCategory.public.map((clinic) => (
                            <ClinicCard key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                </div>

                {/* Private Healthcare Options */}
                <div className="mb-12 lg:mb-16">
                    <h3 className="text-xl lg:text-2xl font-bold text-health-secondary mb-6">
                        Private Healthcare Options
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {clinicsByCategory.private.map((clinic) => (
                            <ClinicCard key={clinic.id} clinic={clinic} />
                        ))}
                    </div>
                </div>

                {/* Non-Governmental Organizations */}
                <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-health-secondary mb-6">
                        Non-Governmental Organizations (NGOs)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clinicsByCategory.ngos.map((ngo) => (
                            <NGOCard key={ngo.id} ngo={ngo} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ClinicCards;
