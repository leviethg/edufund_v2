import React from 'react';
import { HeroIllustration } from '../assets/svgs';
import { useRouter } from '../context/RouterContext';

const Hero: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-background pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary text-xs font-semibold uppercase tracking-wide mb-6">
              ✨ Nền tảng học bổng Web3
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Quỹ Học Bổng <span className="text-primary">EduFund</span>
            </h1>
            <p className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Nền tảng minh bạch giúp kết nối nhà tài trợ và sinh viên tài năng bằng Blockchain. Trao cơ hội, nhận niềm tin.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/create')}
                className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-primary to-primary-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Tạo quỹ mới
              </button>
              <button 
                onClick={() => {
                  navigate('/');
                  setTimeout(() => document.getElementById('funds')?.scrollIntoView({behavior: 'smooth'}), 100);
                }}
                className="inline-flex justify-center items-center px-8 py-3.5 border-2 border-primary-50 text-base font-medium rounded-xl text-primary bg-white hover:bg-primary-50 hover:border-primary transition-all duration-200"
              >
                Khám phá quỹ
              </button>
            </div>
            <p className="mt-4 text-xs text-text-muted flex items-center justify-center lg:justify-start gap-1">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Kết nối ví chỉ để ký — không rút tiền tự động.
            </p>
          </div>

          {/* Right: Illustration */}
          <div className="flex justify-center lg:justify-end">
            <HeroIllustration className="w-full max-w-lg h-auto drop-shadow-xl" />
          </div>
        </div>
      </div>
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-72 h-72 bg-accent-light rounded-full blur-3xl opacity-50 -z-10"></div>
    </section>
  );
};

export default Hero;