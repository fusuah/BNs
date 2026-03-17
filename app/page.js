"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useGetPostQuery } from "@/service/auth/autApiSlice";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { type } = useAuth();
  const router = useRouter();

  // Preserving the existing query call, though it might be for testing
  const { data } = useGetPostQuery(); 

  // console.log(data); // Optional: keep or remove console logs

  useEffect(() => {
    if (type === "bns-worker") {
      router.replace("/bnsUser");
    } else if (type === "bns-admin") {
      router.replace("/superAdmin");
    } else if (type === "bns-beneficiary") {
      router.replace("/beneficiary");
    }
  }, [type, router]); // Added dependencies to ensure redirect happens when type loads

  return (
    <div className="w-full text-black bg-white">
      {/* HEADER */}
      <header className="w-full bg-white p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-50">
        {/* LOGO CONTAINER */}
        <div className="flex gap-2 justify-center items-center ">
          <span className="w-10 h-10 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] rounded-md flex items-center justify-center text-white font-bold ">
            B
          </span>
          <h1 className="text-[20px] font-bold ">BNS Assist</h1>
        </div>

        {/* NAV LIST */}
        <nav className="flex gap-[32px] items-center justify-center hidden md:flex">
          <a className="text-[16px] text-gray-600 hover:text-[#4CAF50]" href="#features">
            Features
          </a>
          <a className="text-[16px] text-gray-600 hover:text-[#4CAF50]" href="#about">
            About
          </a>
          <a className="text-[16px] text-gray-600 hover:text-[#4CAF50]" href="#testimonials">
            Testimonials
          </a>
        </nav>

        {/* CTA NAV CONT */}
        <div className="flex gap-[8px]">
          <Link 
            href="/login" 
            className="py-2 px-4 text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
          >
            Log In
          </Link>
          <Link 
            href="/register" 
            className="py-2 px-4 text-white bg-[#4CAF50] rounded-md hover:bg-[#43a047] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO-SECTION */}
      <div
        id="hero-section"
        className="flex flex-col-reverse md:flex-row mx-auto bg-[#FBFEFC] w-full max-w-[1120px] py-[64px] px-4 gap-8"
      >
        {/* HERO _TEXT */}
        <div className="w-full md:w-1/2 flex flex-col items-start justify-center">
          <h1 className="w-full mb-4 text-[36px] md:text-[48px] leading-[110%] font-inter bg-gradient-to-br from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent font-bold">
            Empowering Community Nutrition Through Digital Tools
          </h1>
          <p className="text-[18px] md:text-[20px] text-gray-600 mb-[24px]">
            BNS Assist simplifies data collection, reporting, and communication
            for Barangay Nutrition Scholars, improving community health
            outcomes.
          </p>
          <div className="flex gap-[8px]">
            <Link 
              href="/register" 
              className="py-2 px-[32px] text-white bg-[#4CAF50] rounded-md hover:bg-[#43a047] transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/login" 
              className="py-2 px-[32px] text-black border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <img
            src="/asset/main-photo.png"
            alt="Barangay Nutrition Scholar visiting a home"
            className="w-full rounded-2xl shadow-xl relative z-10 object-cover h-[300px] md:h-[500px]"
          />
        </div>
      </div>

      {/* FEATURE SECTION */}
      <section id="features" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#4CAF50] to-[#19B799]">
              Our Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              BNS Assist is designed to empower Barangay Nutrition Scholars with
              tools that streamline their work and improve community health
              outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <i className="bi bi-file-earmark-text text-[24px]"></i>
              }
              title="Data Collection"
              description="Easily collect and manage nutrition data for children, pregnant women, and other beneficiaries."
              color="bg-blue-50 text-blue-600"
            />
            <FeatureCard
              icon={<i className="bi bi-mic text-[24px]"></i>}
              title="Voice-to-Text Reporting"
              description="Record your observations verbally, and our system will transcribe them into text reports."
              color="bg-green-50 text-green-600"
            />
            <FeatureCard
              icon={<i className="bi bi-robot text-[24px]"></i>}
              title="Nutrition Chatbot"
              description="Provide 24/7 support to mothers and caregivers with our AI-powered nutrition advisor."
              color="bg-purple-50 text-purple-600"
            />
            <FeatureCard
              icon={<i className="bi bi-map text-[24px]"></i>}
              title="Nutrition Heatmap"
              description="Visualize nutrition data across your community to identify areas needing focus."
              color="bg-amber-50 text-amber-600"
            />
          </div>

          <div className="mt-16 grid md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src="/asset/sub-third.png"
                alt="BNS worker providing health services"
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">
                Streamlined Workflows for Better Results
              </h3>
              <p className="text-gray-600">
                Our platform is designed specifically for the needs of Barangay
                Nutrition Scholars, making your daily tasks easier and more
                efficient.
              </p>
              <ul className="space-y-4">
                <FeatureListItem text="Schedule and track feeding programs, check-ups, and household visits" />
                <FeatureListItem text="Generate reports with a single click" />
                <FeatureListItem text="Monitor nutrition status of children in your community" />
                <FeatureListItem text="Communicate directly with beneficiaries through the platform" />
              </ul>
              <Link 
                href="/register" 
                className="inline-block bg-[#4CAF50] text-white py-[8px] px-[16px] rounded-md hover:bg-[#43a047] transition-colors"
              >
                Try It Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 px-4 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-[#4CAF50] to-[#2196F3]">
                About BNS Assist
              </h2>
              <p className="text-lg text-gray-600">
                BNS Assist is a digital platform designed to support Barangay
                Nutrition Scholars (BNS) in their vital role of improving
                community nutrition and health outcomes.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is to empower BNS workers with digital tools that
                simplify their daily tasks, enhance data accuracy, and improve
                communication with beneficiaries.
              </p>
              <p className="text-lg text-gray-600">
                By reducing administrative burden, we help BNS workers focus
                more on what matters most: ensuring the health and well-being of
                children and families in their communities.
              </p>
            </div>

            <div className="rounded-xl h-full w-full overflow-hidden shadow-xl ml-auto">
              <img
                src="/asset/sub-photo-about.png"
                alt="BNS workers in the field"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section id="testimonials" className="py-20 px-4 bg-white scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-br from-[#4CAF50] to-[#2196F3] bg-clip-text text-transparent">
              Ang Sabi ng Ating mga BNS
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pakinggan ang mga kwento ng ating Barangay Nutrition Scholars na
              gumagamit ng BNS Assist sa kanilang araw-araw na gawain.
            </p>
          </div>
          
          {/* Mock Testimonials - Uncommented and styled for display */}
          <div className="grid md:grid-cols-3 gap-8">
             <TestimonialCard
               quote="Dahil sa BNS Assist, nabawasan ang oras na ginagamit ko sa pagsusulat ng mga ulat. Mas marami na akong oras para sa mga pamilyang nangangailangan ng gabay."
               name="Adoracion Santos"
               role="BNS, Barangay Matatag"
               image="/asset/default-dp.jpg" // Using default since randomuser might not load or isn't in assets
             />
             <TestimonialCard
               quote="Ang voice-to-text feature ay napakagaling. Pwede ko nang i-record ang aking mga obserbasyon habang sariwa pa sa isipan ko."
               name="Ana Dela Cruz"
               role="BNS, Barangay Maligaya"
               image="/asset/default-dp.jpg"
             />
             <TestimonialCard
               quote="Gustong-gusto ng mga nanay ang chatbot. Kahit anong oras ay pwede silang kumuha ng payo tungkol sa nutrisyon, at ako ay pwedeng magfocus sa mga kritikal na kaso."
               name="Juliana De Belen"
               role="BNS, Barangay Maunlad"
               image="/asset/default-dp.jpg"
             />
           </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#4CAF50] to-[#2196F3] text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your BNS Work?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join BNS Assist today and experience the difference digital tools
            can make.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/register" 
              className="bg-white text-[#4CAF50] py-3 px-[32px] rounded-md hover:bg-gray-100 font-semibold transition-colors"
            >
              Get Started Now
            </Link>
            <Link 
              href="/login" 
              className="border border-white rounded-md py-3 px-[32px] text-white hover:bg-white/10 font-semibold transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                BNS Assist
              </h2>
              <p className="text-gray-600 mb-4">
                Empowering community nutrition through digital tools.
                Simplifying data collection and reporting for better health
                outcomes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Training Materials
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Nutrition Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-[#4CAF50]">
                    Data Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} BNS Assist. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 transition-all hover:shadow-md">
      <div className={`py-3 px-6 rounded-full w-fit ${color} mb-4 flex items-center justify-center h-16 w-16`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function FeatureListItem({ text }) {
  return (
    <div className="flex items-start">
      <div className="mt-1 text-[#4CAF50]">
        <i className="bi bi-check2-circle text-lg"></i>
      </div>
      <p className="ml-3 text-gray-600">{text}</p>
    </div>
  );
}

function TestimonialCard({ quote, name, role, image }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
      <p className="text-gray-600 italic">&quot;{quote}&quot;</p>
    </div>
  );
}