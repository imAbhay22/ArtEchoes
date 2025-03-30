import AboutImg from "/src/assets/Images/AboutImg.jpg";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf8f5] to-[#ebe6df] text-[#333]">
      <main className="px-6 py-16 mx-auto max-w-7xl sm:px-8 lg:px-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold text-[#2c2c2c] mb-4 tracking-wide">
            About ArtEcho
          </h1>
          <p className="text-xl text-[#555] max-w-3xl mx-auto leading-relaxed">
            A curated space where fine art meets technology—bringing
            breathtaking digital masterpieces to a global audience.
          </p>
        </div>

        {/* Platform Story */}
        <section className="mb-24">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="relative overflow-hidden shadow-lg h-96 rounded-xl">
              <img
                loading="lazy"
                src={AboutImg}
                alt="Digital Exhibition Concept"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#2c2c2c] mb-6">
                Our Story
              </h2>
              <p className="text-[#555] text-lg leading-relaxed mb-4">
                ArtEcho was founded with a vision—to create an online gallery
                that resonates with the elegance of physical exhibitions.
              </p>
              <p className="text-[#555] text-lg leading-relaxed">
                Our platform empowers artists by providing a seamless, beautiful
                space for their art to be appreciated globally.
              </p>
            </div>
          </div>
        </section>

        {/* Platform Features */}
        <section className="bg-[#fdfbf9] py-16 px-8 rounded-3xl shadow-xl">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2c2c2c] mb-12 text-center">
              Why ArtEcho?
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Curated Virtual Galleries",
                  content:
                    "Experience digital art in beautifully designed, immersive virtual spaces.",
                  icon: "🖼️",
                },
                {
                  title: "Empowering Artists",
                  content:
                    "A platform that supports artists with fair policies and wide exposure.",
                  icon: "🎭",
                },
                {
                  title: "Global Art Community",
                  content:
                    "Connecting collectors, enthusiasts, and creators across the world.",
                  icon: "🌏",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="p-6 border border-[#ddd] rounded-xl bg-white shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-4xl text-[#555] mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#2c2c2c] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[#555]">{feature.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
