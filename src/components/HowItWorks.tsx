import React from 'react';
import { Step1Icon, Step2Icon, Step3Icon, Step4Icon } from '../assets/svgs';

const Step: React.FC<{ 
  Icon: React.FC<{className?:string}>, 
  title: string, 
  desc: string, 
  stepNum: number 
}> = ({ Icon, title, desc, stepNum }) => (
  <div className="flex flex-col items-center text-center relative group">
    <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4 z-10 group-hover:scale-110 transition-transform duration-300 border border-gray-100">
      <Icon className="w-10 h-10" />
    </div>
    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-0 hidden md:block" 
         style={{ display: stepNum === 4 ? 'none' : 'block' }}></div>
    
    <h3 className="font-bold text-lg text-gray-900 mb-2">{title}</h3>
    <p className="text-text-secondary text-sm max-w-[200px] mb-3">{desc}</p>
    <a href="#" className="text-primary text-xs font-medium hover:underline">Learn more &rarr;</a>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Cách hoạt động</h2>
          <p className="text-text-secondary">Quy trình 4 bước đơn giản, an toàn và hiệu quả.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step 
            stepNum={1}
            Icon={Step1Icon} 
            title="1. Tạo quỹ" 
            desc="Nhà tài trợ thiết lập thông tin quỹ, định giá và số lượng suất học bổng." 
          />
          <Step 
            stepNum={2}
            Icon={Step2Icon} 
            title="2. Nộp hồ sơ" 
            desc="Sinh viên đăng nhập ví và nộp CV/Portfolio trực tuyến dễ dàng." 
          />
          <Step 
            stepNum={3}
            Icon={Step3Icon} 
            title="3. Xét chọn" 
            desc="Hội đồng bình chọn hoặc cộng đồng vote. Kết quả ghi nhận on-chain." 
          />
          <Step 
            stepNum={4}
            Icon={Step4Icon} 
            title="4. Phát thưởng" 
            desc="Smart contract tự động giải ngân học bổng cho người thắng cuộc." 
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;