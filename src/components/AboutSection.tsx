import React from 'react';
import { TRUST_LOGOS } from '../api/mockData';
import FeatureCard from './FeatureCard';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Về EduFund</h2>
          <p className="text-text-secondary text-lg">
            EduFund hướng tới một tương lai nơi mọi khoản tài trợ giáo dục đều <span className="text-primary font-medium">minh bạch</span> và đến tay người xứng đáng nhất. 
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard icon="🛡️" title="Minh bạch tuyệt đối" desc="Mọi giao dịch và quyết định xét duyệt đều được ghi lại trên Blockchain, không thể sửa đổi." />
          <FeatureCard icon="🔒" title="Bảo mật & Ký On-chain" desc="Sử dụng chữ ký số an toàn. Bạn hoàn toàn kiểm soát tài sản của mình thông qua ví cá nhân." />
          <FeatureCard icon="🤝" title="Đơn giản cho nhà tài trợ" desc="Tạo quỹ chỉ trong vài bước. Hệ thống tự động hóa quy trình nhận hồ sơ và giải ngân." />
        </div>
        <div className="border-t border-gray-100 pt-10">
          <p className="text-center text-sm font-medium text-text-muted mb-6 uppercase tracking-wider">Hợp tác & Tin dùng bởi</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {TRUST_LOGOS.map((logo, idx) => (
               <div key={idx} className="font-bold text-xl flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-gray-300"></div>{logo.name}
               </div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;