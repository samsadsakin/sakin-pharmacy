
import Sidebar from "@/components/software/Navbar/Navbar";



export default function SoftwareLayout({ children }) {
  return (
    <Sidebar>
      {children}
    </Sidebar>
  );
}

