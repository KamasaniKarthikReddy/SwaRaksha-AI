import Card from "../ui/Card.tsx";

const WhoWeHelp = () => {
    return (
        <section id="for-business" className="w-full bg-[#EBE5F7] py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto flex flex-col items-center">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-white/70 text-[#6B46C1] uppercase tracking-wider mb-3 shadow-xs">
                        For Business & Healthcare Organizations
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-bold text-[#141922] tracking-tight">
                        Who we help
                    </h2>
                    <p className="mt-4 text-base sm:text-lg text-[#55595C] max-w-2xl mx-auto font-normal">
                        Empowering healthcare ecosystems with automated symptom triage, early condition screening, and clinical care navigation.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {/* Card 1: Insurers */}
                    <Card
                        heading="Insurers"
                        body="Enhance operations, reduce over utilization of services, improve member experience, cut costs, and engage rural populations."
                        svg={
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M22 5L8 10.5V20.5C8 29.5 14 36.5 22 39C30 36.5 36 29.5 36 20.5V10.5L22 5Z"
                                    stroke="#181D27"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 21.5L20 25.5L28 17.5"
                                    stroke="#181D27"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        }
                    />

                    {/* Card 2: Public Health/Government */}
                    <Card
                        heading="Public Health/Government"
                        body="Optimize services, enhance patient satisfaction, gather health data, and improve care navigation."
                        svg={
                            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 16L22 7L37 16H7Z" stroke="#181D27" strokeWidth="2.5" strokeLinejoin="round" />
                                <line x1="12" y1="19" x2="12" y2="31" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="18.66" y1="19" x2="18.66" y2="31" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="25.33" y1="19" x2="25.33" y2="31" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                                <line x1="32" y1="19" x2="32" y2="31" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M5 35H39" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M8 31H36" stroke="#181D27" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        }
                    />

                    {/* Card 3: Telemedicine companies */}
                    <Card
                        heading="Telemedicine companies"
                        body="Increase revenue, boost provider efficiency, enhance patient satisfaction, and strengthen health system partnerships."
                        svg={
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Doctor head and hair */}
                                <path
                                    d="M17 17C17 13.134 20.134 10 24 10C27.866 10 31 13.134 31 17V22C31 25.866 27.866 29 24 29C20.134 29 17 25.866 17 22V17Z"
                                    stroke="#181D27"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />
                                {/* Hair style top */}
                                <path d="M18 13C20 9 28 9 30 13" stroke="#181D27" strokeWidth="2.2" strokeLinecap="round" />
                                {/* Glasses */}
                                <rect x="17" y="17" width="5.5" height="4.5" rx="1.5" stroke="#181D27" strokeWidth="2" />
                                <rect x="25.5" y="17" width="5.5" height="4.5" rx="1.5" stroke="#181D27" strokeWidth="2" />
                                <path d="M22.5 19.5H25.5" stroke="#181D27" strokeWidth="2" />
                                {/* Body/coat */}
                                <path
                                    d="M11 41V37C11 33.6863 13.6863 31 17 31H31C34.3137 31 37 33.6863 37 37V41"
                                    stroke="#181D27"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                />
                                {/* Collar/Tie */}
                                <path d="M22 31L24 35L26 31" stroke="#181D27" strokeWidth="2" strokeLinejoin="round" />
                                {/* Stethoscope */}
                                <path
                                    d="M16 33C16 37.5 19 41.5 24 41.5C29 41.5 32 37.5 32 33"
                                    stroke="#181D27"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                                <circle cx="24" cy="41.5" r="2.2" fill="#181D27" />
                            </svg>
                        }
                    />

                    {/* Card 4: Healthcare providers */}
                    <Card
                        heading="Healthcare providers"
                        body="Elevate patient support, streamline workflows, cut costs, and extend care access."
                        svg={
                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Sage-green heart */}
                                <path
                                    d="M23 40C23 40 7 29.5 7 18C7 12.4772 11.4772 8 17 8C20.1 8 22.1 9.5 23 10.8C23.9 9.5 25.9 8 29 8C34.5228 8 39 12.4772 39 18C39 29.5 23 40 23 40Z"
                                    fill="#8FA89B"
                                />
                                {/* Plus inside / badge */}
                                <path
                                    d="M32 11V19M28 15H36"
                                    stroke="#445D51"
                                    strokeWidth="2.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>
        </section>
    );
};

export default WhoWeHelp;