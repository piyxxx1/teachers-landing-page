import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const AdminLink = () => {
  return (
    <Link
      to="/admin/login"
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200 z-50"
      title="Admin Panel"
    >
      <Settings className="w-5 h-5" />
    </Link>
  );
};

export default AdminLink;
