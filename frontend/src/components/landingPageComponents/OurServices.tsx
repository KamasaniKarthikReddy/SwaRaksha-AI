import { BentoGrid, BentoCard } from '../ui/BentoGrid.tsx';
import {
    ChatBubbleIcon,
    PersonIcon,
    CardStackIcon,
    FileTextIcon,
    CalendarIcon,
} from '@radix-ui/react-icons';
import DoctorIcon from "../../../public/icon/Doctor.tsx";

const services = [
    {
        Icon: CardStackIcon,
        name: "Symptom Triage",
        description: (
            <>
                Leverage our AI-powered Symptom Checker for instant health insights. Describe symptoms and receive personalized guidance within minutes.
                <ul className="list-disc pl-5 mt-2">
                    <li>24/7 access to self-service symptom assessments</li>
                    <li>AI-driven care navigation for accurate results</li>
                    <li>Eliminates long wait times with instant recommendations</li>
                </ul>
            </>
        ),
        href: "/survey",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-2",
    },
    {
        Icon: DoctorIcon,
        name: "Doctor Portal",
        description: "Manage schedules and perform consultations efficiently.",
        href: "/consultation/doctor",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        Icon: ChatBubbleIcon,
        name: "HealthGPT",
        description: (
            <>
                Engage with our AI Chatbot, your virtual health assistant. Powered by cutting-edge AI and ML, it offers:
                <ul className="list-disc pl-5 mt-2">
                    <li>Instant answers to preliminary health inquiries</li>
                    <li>Comprehensive information on causes, symptoms, and treatments</li>
                    <li>Over-the-counter medication guidance and precautions</li>
                </ul>
            </>
        ),
        href: "/consultation/chat_bot",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-2",
    },
    {
        Icon: FileTextIcon,
        name: "Report Summary Generation",
        description: (
            <>
                Utilize our AI-driven tool to transform medical reports from images to text with precision. Streamline your workflow with:
                <ul className="list-disc pl-5 mt-2">
                    <li>Advanced image recognition powered by ML algorithms</li>
                    <li>Quick and accurate conversion of reports</li>
                    <li>Enhanced efficiency in handling medical documentation</li>
                </ul>
            </>
        ),
        href: "/consultation/upload_reports",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-2",
    },
    {
        Icon: PersonIcon,
        name: "Patient Portal",
        description: "Access health records and manage appointments easily.",
        href: "/consultation/patient",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        Icon: CalendarIcon,
        name: "Consultation Management",
        description: "Streamline patient-doctor consultation process.",
        href: "/consultation",
        cta: "Learn more",
        className: "md:col-span-1 md:row-span-1",
    },
];
const OurServices = () => {
    return (
        <section id="services" className="flex justify-center items-center flex-col pt-24 px-4">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-purple-100/70 text-purple-800 uppercase tracking-wider mb-2">
                What's Included
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111827] tracking-tight py-3 text-center">
                Smart Health Solutions
            </h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl text-center mb-6">
                From real-time symptom triage to AI report extraction and telehealth consultations.
            </p>
            <div className=" max-w-[calc(100%-2rem)] md:max-w-5xl py-10">
                <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[12rem] gap-4">
                    {services.map((service) => (
                        <BentoCard
                            key={service.name}
                            {...service}
                            className={`${service.className} col-span-1`}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
};


export default OurServices;