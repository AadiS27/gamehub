import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
    }

export default function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <main>
        <div className="flex flex-col h-screen">
            <Navbar/>
            <main className="flex-1 ">
                {children}
            </main>
           <Footer/>
        </div>
        </main>
    );  
}

