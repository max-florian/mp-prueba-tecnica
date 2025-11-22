import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-24 px-8 pb-8 max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;