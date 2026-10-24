import React from 'react';
import ApolloHeroIntro from "./ApolloHeroIntro.tsx";
import ScanCentresAcrossIndia from "./ScanCentresAcrossIndia.tsx";
import Footer from "../footer/Footer.tsx";
import MarqueeComponent from "./marquee/MarqueeComponent.tsx";
import WhoWeHelp from "./WhoWeHelp.tsx";
import OurSolution from "./OurSolution.tsx";

const LandingPageComponent: React.FC = () => {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#FDFCFE] text-[#111827] overflow-x-hidden selection:bg-purple-100 selection:text-purple-900">
            {/* Apollo Diagnostics Style First Intro - Promotional Carousel & Quick Help Cards */}
            <ApolloHeroIntro />

            {/* Scan Centres Across India - Dotted Map & Interactive Location Pins */}
            <ScanCentresAcrossIndia />

            {/* Who We Help Section - Pastel Lilac 4-Card Section */}
            <WhoWeHelp />

            {/* Our Clinical Diagnostic Protocol */}
            <OurSolution />

            {/* Accredited Diagnostic & Hospital Network Partners */}
            <MarqueeComponent />

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPageComponent;

