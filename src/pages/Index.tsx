
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0F1C] to-black text-white flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl space-y-6">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/2d34a83d-9197-4265-b617-d94a713ecb24.png" 
            alt="AIO Logo" 
            className="w-96 h-96 mb-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            When stars fall in chaos,<br />
            the colony brings order.
          </h1>
        </div>

        <p className="text-xl md:text-2xl font-medium text-gray-300">
          A thousand minds, one nest. A million paths, one frequency.
        </p>

        <div className="mt-10 flex justify-center">
          <Link to="/home">
            <button className="px-6 py-3 border border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-black transition">
              Join the Colony
            </button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-400 tracking-wide">
          AIO — Agent Input & Output Protocol
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1f2937] via-transparent to-transparent opacity-20 animate-pulse" />
      </div>
    </div>
  );
};

export default Index;
