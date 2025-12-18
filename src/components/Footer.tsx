import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-xl mb-4">Edu<span className="text-primary">Fund</span></h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Nền tảng học bổng phi tập trung, mang lại sự minh bạch và công bằng cho giáo dục thông qua công nghệ Blockchain.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Khám phá</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Tất cả quỹ</a></li>
              <li><a href="#" className="hover:text-primary">Tạo quỹ mới</a></li>
              <li><a href="#" className="hover:text-primary">Nhà tài trợ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-primary">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-primary">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-primary">Chính sách bảo mật</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-text-muted">© 2024 EduFund. All rights reserved.</p>
          <p className="text-xs text-text-muted mt-2 md:mt-0">Built for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;